/// <reference path="../pb_data/types.d.ts" />

// This hook triggers right BEFORE a new record is saved in the 'orders' collection
onRecordCreateRequest((e) => {
    const order = e.record;
    const tenantId = order.get("tenant");

    if (!tenantId) return e.next();

    try {
        // Query the database to find an 'open' cycle for this specific tenant using modern v0.23+ syntax
        const openCycle = $app.findFirstRecordByFilter(
            "order_cycles",
            "tenant = {:tenant} && status = 'open'",
            { tenant: tenantId }
        );

        // If found, automatically link the order to this cycle
        order.set("orderCycle", openCycle.id);
        console.log(`Order automatically linked to cycle: ${openCycle.id}`);

    } catch (err) {
        // In PocketBase, findFirstRecordByFilter throws an error if NO record is found.

        // Scenario A: The tenant operates 24/7, so it's normal they don't have cycles.
        // We just log it and the order is saved with a null/empty orderCycle.
        console.log(`No open cycle found for tenant: ${tenantId}. Order will be saved without cycle.`);

        // Scenario B (OPTIONAL): If you want to strictly ENFORCE that orders can only
        // be placed during open cycles, uncomment the following line to block the request:
        // throw new BadRequestError("The store is currently closed. Cannot accept new orders.");
    }

    return e.next(); // Mandatory in v0.23+
}, "orders");
