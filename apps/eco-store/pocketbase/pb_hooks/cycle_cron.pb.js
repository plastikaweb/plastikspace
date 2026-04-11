// This cron runs every Sunday at 23:59 to generate the cycles for the following week
cronAdd("order_cycle_init", "59 23 * * 0", () => {

    // Helper to get a Date object representing "now" in a specific timezone
    const getNowInTimezone = (tz = 'Europe/Madrid') => {
        try {
            const now = new Date();
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: tz,
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: false
            });
            const parts = formatter.formatToParts(now);
            const d = {};
            parts.forEach(p => d[p.type] = p.value);
            // Construct a date object that "looks like" the local time but is technically in system time
            // This is useful for getDay(), getHours() etc.
            return new Date(d.year, d.month - 1, d.day, d.hour, d.minute, d.second);
        } catch (e) {
            console.warn(`Timezone ${tz} not supported or Intl missing, falling back to system time.`);
            return new Date();
        }
    };

    // Helper function to get the next date and time from a day of the week
    const getNextDayOfWeek = (tz, dayName, timeStr) => {
        const DAYS_MAP = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
        const date = getNowInTimezone(tz);
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

        // Now we need to convert this "local" date back to a real UTC Date object for storage
        // We do this by creating a string and letting the engine parse it with the timezone
        return new Date(date.toLocaleString('en-US', { timeZone: tz }));
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

        console.log("Tenants found: ", tenants.length);

        // --- PASS 1: Plan all cycles to create (compute dates, names, codes per tenant) ---
        const plannedCycles = [];
        for (let tenant of tenants) {
            const tz = tenant.getString("timezone") || 'Europe/Madrid';

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
            console.log(`Processing tenant: ${tenant.get("name")} (${tz}), Order window enabled: ${!!orderWindow?.enabled}`);

            if (!orderWindow || !orderWindow.enabled) {
                console.log(`Skipping tenant: ${tenant.get("name")} (24/7 access configured)`);
                continue;
            }

            const openDay = orderWindow.openDay || 'monday';
            const openTime = orderWindow.openTime || '08:00';
            const closeDay = orderWindow.closeDay || 'thursday';
            const closeTime = orderWindow.closeTime || '23:59';

            // Calculate exact dates starting from today in the tenant's timezone
            const startsAt = getNextDayOfWeek(tz, openDay, openTime);
            let endsAt = getNextDayOfWeek(tz, closeDay, closeTime);

            // If the closing day is numerically before the opening day (e.g., opens Thursday, closes Monday),
            // it means the closing jumps to the next natural week. So we add 7 days.
            if (endsAt <= startsAt) {
                endsAt.setDate(endsAt.getDate() + 7);
            }

            // Check if the cycle spans across a natural week boundary to set clear names and codes
            const startWeek = getWeekNumber(startsAt);
            const endWeek = getWeekNumber(endsAt);

            let cycleName = `Comandes Setmana ${startWeek}`;
            let cycleCode = `WK${startWeek}-${startsAt.getFullYear()}`;

            if (startWeek !== endWeek) {
                cycleName = `Comandes Setmanes ${startWeek}-${endWeek}`;
                cycleCode = `WK${startWeek}-${endWeek}-${startsAt.getFullYear()}`;
            }

            plannedCycles.push({ tenant, cycleName, cycleCode, startsAt, endsAt });
        }

        if (plannedCycles.length === 0) {
            console.log("No cycles to create.");
            return;
        }

        // --- PASS 2: Pre-fetch existing cycles for all planned (tenant, code) pairs in one query ---
        // Avoids an N+1 query pattern where each tenant triggered its own findFirstRecordByFilter.
        const existingKeys = new Set();
        try {
            const filter = plannedCycles
                .map(p => `(tenant = '${p.tenant.id}' && code = '${p.cycleCode}')`)
                .join(" || ");
            const existingCycles = $app.findRecordsByFilter("order_cycles", filter);
            for (const c of existingCycles) {
                existingKeys.add(`${c.get("tenant")}|${c.get("code")}`);
            }
        } catch (e) {
            console.warn("Could not pre-fetch existing cycles, falling back to per-tenant check:", e);
        }

        // --- PASS 3: Create cycles, skipping any that already exist ---
        const collection = $app.findCollectionByNameOrId("order_cycles");

        for (const { tenant, cycleName, cycleCode, startsAt, endsAt } of plannedCycles) {
            if (existingKeys.has(`${tenant.id}|${cycleCode}`)) {
                console.log(`Cycle '${cycleCode}' already exists for tenant: ${tenant.get("name")}. Skipping.`);
                continue;
            }

            const newCycle = new Record(collection);
            newCycle.set("tenant", tenant.id);
            newCycle.set("name", cycleName);
            newCycle.set("code", cycleCode);
            newCycle.set("startsAt", startsAt.toISOString());
            newCycle.set("endsAt", endsAt.toISOString());

            // Assign 'open' for now, Angular will process it accordingly
            newCycle.set("status", "OPEN");

            $app.save(newCycle);
            console.log(`Cycle '${cycleName}' scheduled for tenant: ${tenant.get("name")}`);
        }

    } catch (err) {
        console.error("Error generating order cycles: ", err);
    }
});

// This cron runs every 15 minutes to check if any open cycle should be closed (moved to processing)
cronAdd("order_cycle_status_watcher", "*/15 * * * *", () => {
    try {
        const now = new Date().toISOString();

        // 1. Find all 'OPEN' cycles that have already ended
        const expiredCycles = $app.findAllRecords(
            "order_cycles",
            $dbx.exp("status = 'OPEN' AND endsAt <= {:now}", { now: now })
        );

        if (expiredCycles.length === 0) {
            return;
        }

        // Batch all status updates inside a single transaction so SQLite issues
        // one commit/fsync for the whole run instead of N. Any failure rolls the
        // entire batch back; the next cron tick (15 min later) will retry.
        try {
            $app.runInTransaction((txApp) => {
                for (const cycle of expiredCycles) {
                    console.log(`Closing cycle '${cycle.get("name")}' (ID: ${cycle.id}) for tenant ${cycle.get("tenant")}`);
                    cycle.set("status", "PROCESSING");
                    txApp.save(cycle);
                }
            });
        } catch (txErr) {
            console.error("Failed to close expired cycles:", txErr);
        }
    } catch (err) {
        console.error("Error in order_cycle_status_watcher:", err);
    }
});

