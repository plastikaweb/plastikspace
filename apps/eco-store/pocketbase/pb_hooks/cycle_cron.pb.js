// This cron runs every Sunday at 23:59 to generate the cycles for the following week
cronAdd("order_cycle_init", "59 23 * * 0", () => {

    // Helper function to get the next date and time from a day of the week
    const getNextDayOfWeek = (referenceDate, dayName, timeStr) => {
        const DAYS_MAP = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
        const date = new Date(referenceDate);
        const currentDay = date.getDay();
        const targetDay = DAYS_MAP[dayName.toLowerCase()] !== undefined ? DAYS_MAP[dayName.toLowerCase()] : 1;

        let daysUntilTarget = targetDay - currentDay;
        // Since the CRON runs on Sunday (day 0), ensure we jump to the next week (unless it's the exact same Sunday)
        if (daysUntilTarget <= 0) {
            daysUntilTarget += 7;
        }

        date.setDate(date.getDate() + daysUntilTarget);

        // Parse the time (format "HH:mm")
        if (timeStr) {
            const parts = timeStr.split(':');
            date.setHours(parseInt(parts[0], 10) || 0, parseInt(parts[1], 10) || 0, 0, 0);
        } else {
            date.setHours(0, 0, 0, 0);
        }

        return date;
    };

    // Helper function to get the week number
    const getWeekNumber = (d) => {
        const copy = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        copy.setUTCDate(copy.getUTCDate() + 4 - (copy.getUTCDay()||7));
        const yearStart = new Date(Date.UTC(copy.getUTCFullYear(),0,1));
        return Math.ceil(( ( (copy - yearStart) / 86400000) + 1)/7);
    };


    try {
        console.log("Starting order cycles generation...");

        // 1. Find all active tenants (active = true) that are not manually closed (closed = false)
        const tenants = $app.findAllRecords(
            "tenants",
            $dbx.exp("active = {:active} AND closed = {:closed}", { active: true, closed: false })
        );

        console.log("Tenants: ", tenants);

        const now = new Date();

        for (let tenant of tenants) {
            // Get the raw JSON string from the database to ensure we can parse it as a pure JS object
            let logisticsRaw = tenant.getString("logisticsConfig");
            let logistics = {};

            try {
                logistics = JSON.parse(logisticsRaw || "{}");
            } catch (e) {
                console.error(`Failed to parse logistics for tenant ${tenant.get("name")}:`, e);
                continue;
            }

            const orderWindow = logistics?.orderWindow;
            console.log(`Processing tenant: ${tenant.get("name")}, Order window enabled: ${!!orderWindow?.enabled}`);

            // 2. If orderWindow.enabled is true, calculate exact dates and create the cycle
            if (orderWindow && orderWindow.enabled) {
                const openDay = orderWindow.openDay || 'monday';
                const openTime = orderWindow.openTime || '08:00';
                const closeDay = orderWindow.closeDay || 'thursday';
                const closeTime = orderWindow.closeTime || '23:59';

                // Calculate exact dates starting from today
                const startsAt = getNextDayOfWeek(now, openDay, openTime);
                let endsAt = getNextDayOfWeek(now, closeDay, closeTime);

                // If the closing day is numerically before the opening day (e.g., opens Thursday, closes Monday),
                // it means the closing jumps to the next natural week. So we add 7 days.
                if (endsAt <= startsAt) {
                    endsAt.setDate(endsAt.getDate() + 7);
                }

                const collection = $app.findCollectionByNameOrId("order_cycles");
                const newCycle = new Record(collection);

                // Check if the cycle spans across a natural week boundary to set clear names and codes
                const startWeek = getWeekNumber(startsAt);
                const endWeek = getWeekNumber(endsAt);

                let cycleName = `Comandes Setmana ${startWeek}`;
                let cycleCode = `WK${startWeek}-${startsAt.getFullYear()}`;

                if (startWeek !== endWeek) {
                    cycleName = `Comandes Setmanes ${startWeek}-${endWeek}`;
                    cycleCode = `WK${startWeek}-${endWeek}-${startsAt.getFullYear()}`;
                }

                // Check if a cycle with this code already exists for this tenant to avoid duplicates
                try {
                    const existing = $app.findFirstRecordByFilter(
                        "order_cycles",
                        "tenant = {:tenant} && code = {:code}",
                        { tenant: tenant.getId(), code: cycleCode }
                    );

                    if (existing) {
                        console.log(`Cycle '${cycleCode}' already exists for tenant: ${tenant.get("name")}. Skipping.`);
                        continue;
                    }
                } catch (e) {
                    // findFirstRecordByFilter throws an error if no record is found, we can ignore this
                }

                newCycle.set("tenant", tenant.getId());
                newCycle.set("name", cycleName);
                newCycle.set("code", cycleCode);
                newCycle.set("startsAt", startsAt.toISOString());
                newCycle.set("endsAt", endsAt.toISOString());

                // Assign 'open' for now, Angular will process it accordingly
                newCycle.set("status", "OPEN");

                // 3. Save to DB
                $app.save(newCycle);
                console.log(`Cycle '${cycleName}' scheduled for tenant: ${tenant.get("name")}`);
            } else {
                console.log(`Skipping tenant: ${tenant.get("name")} (24/7 access configured)`);
            }
        }

    } catch (err) {
        console.error("Error generating order cycles: ", err);
    }
});

// This cron runs every 15 minutes to check if any open cycle should be closed (moved to processing)
cronAdd("order_cycle_status_watcher", "*/15 * * * *", () => {
    try {
        const now = new Date().toISOString();

        // 1. Find all 'open' cycles that have already ended
        const expiredCycles = $app.findAllRecords(
            "order_cycles",
            $dbx.exp("status = 'open' AND endsAt <= {:now}", { now: now })
        );

        for (let cycle of expiredCycles) {
            console.log(`Closing cycle '${cycle.get("name")}' (ID: ${cycle.getId()}) for tenant ${cycle.get("tenant")}`);

            cycle.set("status", "processing");

            try {
                $app.save(cycle);
            } catch (saveErr) {
                console.error(`Failed to update cycle ${cycle.getId()}:`, saveErr);
            }
        }
    } catch (err) {
        console.error("Error in order_cycle_status_watcher:", err);
    }
});
