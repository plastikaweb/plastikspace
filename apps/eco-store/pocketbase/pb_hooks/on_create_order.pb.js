/// <reference path="../pb_data/types.d.ts" />

// =================================================================
// 1. BEFORE CREATE REQUEST (Assign Cycle and Prevent Duplicates)
// =================================================================
onRecordCreateRequest((e) => {
    const order = e.record;
    const tenantId = order.get("tenant");
    const userId = order.get("user");

    if (!tenantId) return e.next();

    let currentCycleId = null;

    try {
        // --- A. ASSIGN THE ORDER CYCLE AUTOMATICALLY ---
        // We look for an active cycle for this tenant
        // We accept both 'open' and 'OPEN' or 'ACTIVE' for security, as seen in other hooks
        const activeCycle = $app.findFirstRecordByFilter(
            "order_cycles",
            "tenant = {:tenant} && (status = 'open' || status = 'OPEN' || status = 'ACTIVE')",
            { tenant: tenantId }
        );

        currentCycleId = activeCycle.id;
        order.set("orderCycle", currentCycleId);
        console.log(`Order automatically linked to cycle: ${currentCycleId}`);
    } catch (err) {
        // No active cycle found - findFirstRecordByFilter throws an error if no results are found
        console.log(`No active cycle found for tenant: ${tenantId}. Order will be saved without cycle.`);
    }

    // --- B. PREVENT DUPLICATE ORDERS ---
    try {
        const tenant = $app.findRecordById("tenants", tenantId);

        // Get the logistics configuration
        let logisticsConfig = {};
        const rawLogistics = tenant.getString("logisticsConfig");
        if (rawLogistics) {
            try {
                logisticsConfig = JSON.parse(rawLogistics);
            } catch (parseErr) {
                console.error(`Error parsing logisticsConfig for tenant ${tenantId}:`, parseErr);
            }
        }

        const orderWindow = logisticsConfig.orderWindow || {};
        const isOrderWindowEnabled = orderWindow.enabled === true;

        // If there is an order window (NOT 24/7) and we have an active cycle, check for duplicates
        if (isOrderWindowEnabled && currentCycleId) {
            const existingOrders = $app.findAllRecords(
                "orders",
                $dbx.exp("user = {:user} AND tenant = {:tenant} AND orderCycle = {:cycle}", {
                    user: userId,
                    tenant: tenantId,
                    cycle: currentCycleId
                })
            );

            if (existingOrders.length > 0) {
                // This will return a 400 error to Angular and stop the order creation
                throw new BadRequestError("You have already placed an order for this shopping cycle.");
            }
        }
    } catch (err) {
        // If it's a BadRequestError, we throw it again to stop the request
        if (err instanceof BadRequestError) throw err;
        console.error("Error checking for duplicates: ", err);
    }

    return e.next();
}, "orders");


// =================================================================
// 2. AFTER CREATE REQUEST (Remove Cart)
// =================================================================
// We are using 'AfterCreate' to ensure that the cart is only deleted
// if the order has been saved correctly to the database.
onRecordAfterCreateSuccess((e) => {
    const order = e.record;
    const tenantId = order.get("tenant");
    const userId = order.get("user");

    if (!tenantId || !userId) return;

    try {
        // We look for the carts of this user and tenant
        const carts = $app.findAllRecords(
            "carts",
            $dbx.exp("user = {:user} AND tenant = {:tenant}", {
                user: userId,
                tenant: tenantId
            })
        );

        // If they exist, delete them
        for (const cart of carts) {
            $app.delete(cart);
        }
    } catch (err) {
        console.error("Error trying to delete the cart: ", err);
        // Since it's AfterCreate, if this fails it won't cancel the original order
    }
}, "orders");