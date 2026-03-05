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
        const activeCycle = e.app.findFirstRecordByFilter(
            "order_cycles",
            "tenant = {:tenant} && (status = 'open' || status = 'OPEN' || status = 'ACTIVE')",
            { tenant: tenantId }
        );

        currentCycleId = activeCycle.getId();
        order.set("orderCycle", currentCycleId);
        console.log(`Order automatically linked to cycle: ${currentCycleId}`);
    } catch (err) {
        console.log(`No active cycle found for tenant: ${tenantId}. Order will be saved without cycle.`);
    }

    // --- B. PREVENT DUPLICATE ORDERS ---
    try {
        const tenant = e.app.findRecordById("tenants", tenantId);
        const logisticsConfig = tenant.get("logisticsConfig") || {};
        const orderWindow = logisticsConfig.orderWindow || {};

        if (orderWindow.enabled === true && currentCycleId) {
            const existingOrders = e.app.findAllRecords(
                "orders",
                $dbx.exp("user = {:user} AND tenant = {:tenant} AND orderCycle = {:cycle}", {
                    user: userId,
                    tenant: tenantId,
                    cycle: currentCycleId
                })
            );

            if (existingOrders.length > 0) {
                throw new BadRequestError("You have already placed an order for this shopping cycle.");
            }
        }
    } catch (err) {
        if (err instanceof BadRequestError) throw err;
        console.error("Error checking for duplicates: ", err);
    }

    return e.next();
}, "orders");


// =================================================================
// 2. AFTER CREATE REQUEST (Remove Cart and Send Email)
// =================================================================
// We are using 'AfterCreate' to ensure that the cart is only deleted
// if the order has been saved correctly to the database.
onRecordAfterCreateSuccess((e) => {
    console.log("onRecordAfterCreateRequest triggered for orders collection");

    const order = e.record;
    const tenantId = order.get("tenant");
    const userId = order.get("user");

    if (!tenantId || !userId) {
        console.warn("Missing tenantId or userId in order, skipping post-create actions.");
        return e.next();
    }

    // --- REMOVE CART ---
    try {
        const carts = e.app.findAllRecords(
            "carts",
            $dbx.exp("user = {:user} AND tenant = {:tenant}", {
                user: userId,
                tenant: tenantId
            })
        );

        for (const cart of carts) {
            e.app.delete(cart);
        }
    } catch (err) {
        console.error("Error trying to delete the cart: ", err);
    }

    // --- SEND CONFIRMATION EMAIL ---
    try {
        const orderNumber = order.get("orderNumber");
        const lang = order.get("language") || "ca";
        console.log(`Starting email confirmation for order ${orderNumber} in lang ${lang}...`);

        const user = e.app.findRecordById("users", userId);
        const tenant = e.app.findRecordById("tenants", tenantId);

        const userEmail = user.get("email");
        const tenantName = tenant.get("name") || "Botiga Eco";

        // Use getString and JSON.parse to ensure we get a clean JS array for the items JSON field
        const itemsRaw = order.getString("items");
        let items = [];
        try {
            items = JSON.parse(itemsRaw || "[]");
        } catch (e) {
            console.error("Failed to parse order items JSON:", e);
        }

        const translations = {
            ca: {
                subject: `Confirmació de comanda #${orderNumber}`,
                greeting: "Hola!",
                thankYou: `Gràcies per comprar a <strong>${tenantName}</strong>. Hem rebut la teva comanda correctament.`,
                modificationNotice: "Pots modificar la teva comanda mentre el període de comandes estigui obert des del teu perfil.",
                lockedNotice: "Un cop el període de comandes estigui tancat, no podràs modificar-la.",
                summaryTitle: `Resum de la Comanda #${orderNumber}`,
                product: "Producte",
                quantity: "Quantitat",
                price: "Preu",
                subtotal: "Subtotal",
                shipping: "Enviament",
                tax: "Impostos",
                total: "Total",
                deliveryDetails: "Detalls del lliurament",
                deliveryMethod: "Mètode",
                deliveryDate: "Data",
                deliveryTime: "Horari",
                deliveryAddress: "Adreça",
                notesTitle: "Comentaris",
                noNotes: "No has afegit cap comentari.",
                footer: "Aquest correu és un justificant automàtic. Ens posarem en contacte amb tu si hi ha cap incidència.",
                regards: "Salut i bons aliments,",
                team: `L'equip de ${tenantName}`,
                pickup: "Recollida",
                delivery: "Enviament a domicili",
                days: ["diumenge", "dilluns", "dimarts", "dimecres", "dijous", "divendres", "dissabte"],
                months: ["gener", "febrer", "març", "abril", "maig", "juny", "juliol", "agost", "setembre", "octubre", "novembre", "desembre"]
            },
            es: {
                subject: `Confirmación de pedido #${orderNumber}`,
                greeting: "¡Hola!",
                thankYou: `Gracias por comprar en <strong>${tenantName}</strong>. Hemos recibido tu pedido correctamente.`,
                modificationNotice: "Puedes modificar tu pedido mientras el periodo de pedidos esté abierto desde tu perfil.",
                lockedNotice: "Una vez el periodo de pedidos esté cerrado, no podrás modificarlo.",
                summaryTitle: `Resumen del Pedido #${orderNumber}`,
                product: "Producto",
                quantity: "Cantidad",
                price: "Precio",
                subtotal: "Subtotal",
                shipping: "Envío",
                tax: "Impuestos",
                total: "Total",
                deliveryDetails: "Detalles de la entrega",
                deliveryMethod: "Método",
                deliveryDate: "Fecha",
                deliveryTime: "Horario",
                deliveryAddress: "Dirección",
                notesTitle: "Comentarios",
                noNotes: "No has añadido ningún comentario.",
                footer: "Este correo es un justificante automático. Nos pondremos en contacto contigo si hay alguna incidencia.",
                regards: "Saludos y buenos alimentos,",
                team: `El equipo de ${tenantName}`,
                pickup: "Recogida",
                delivery: "Envío a domicilio",
                days: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
                months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"]
            },
            en: {
                subject: `Order Confirmation #${orderNumber}`,
                greeting: "Hello!",
                thankYou: `Thank you for shopping at <strong>${tenantName}</strong>. We have received your order correctly.`,
                modificationNotice: "You can modify your order while the ordering window is open from your profile.",
                lockedNotice: "Once the ordering window is closed, you will not be able to modify it.",
                summaryTitle: `Order Summary #${orderNumber}`,
                product: "Product",
                quantity: "Quantity",
                price: "Price",
                subtotal: "Subtotal",
                shipping: "Shipping",
                tax: "Tax",
                total: "Total",
                deliveryDetails: "Delivery Details",
                deliveryMethod: "Method",
                deliveryDate: "Date",
                deliveryTime: "Time",
                deliveryAddress: "Address",
                notesTitle: "Comments",
                noNotes: "No comments added.",
                footer: "This email is an automatic receipt. We will contact you if there are any issues.",
                regards: "Kind regards,",
                team: `The ${tenantName} team`,
                pickup: "Pickup",
                delivery: "Home Delivery",
                days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            }
        };

        const t = translations[lang] || translations["ca"];

        if (userEmail) {
            // 1. Build items table rows
            let itemsHtml = items.map(item => {
                const name = item.name || t.product;
                const qty = item.requestedQuantity || 0;
                const lineTotal = Number(item.lineTotal || 0).toFixed(2);
                const unitType = (item.unitType || '').toLowerCase();
                const suffix = unitType.includes('weight') ? 'kg' : 'un.';

                return `
                <tr>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eef3d8; color: #1a1d12;">${name}</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eef3d8; text-align: center; color: #1a1d12;">${qty} ${suffix}</td>
                    <td style="padding: 12px 10px; border-bottom: 1px solid #eef3d8; text-align: right; color: #1a1d12; font-weight: 500;">${lineTotal} €</td>
                </tr>
                `;
            }).join('');

            // 2. Helper to calculate formatted date for the delivery day
            const getFormattedDeliveryDate = (dayName) => {
                const DAYS_MAP = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
                const targetDay = DAYS_MAP[dayName.toLowerCase()];
                if (targetDay === undefined) return dayName;

                const date = new Date();
                const currentDay = date.getDay();
                let daysUntilTarget = targetDay - currentDay;
                if (daysUntilTarget < 0) daysUntilTarget += 7;

                date.setDate(date.getDate() + daysUntilTarget);

                const dName = t.days[date.getDay()];
                const dNum = date.getDate();
                const mName = t.months[date.getMonth()];
                const yNum = date.getFullYear();

                return `${dName}, ${dNum} ${mName} ${yNum}`;
            };

            const deliveryMethodRaw = order.get("deliveryMethod");
            const deliveryMethod = deliveryMethodRaw === "delivery" ? t.delivery : t.pickup;
            const deliveryDayRaw = order.get("day");
            const deliveryDate = deliveryDayRaw ? getFormattedDeliveryDate(deliveryDayRaw) : "-";
            const deliveryTime = order.get("time") || "-";

            // 3. Destructure and format address nicely
            const addressRaw = order.getString("address");
            let deliveryAddress = "-";
            try {
                const addressObj = JSON.parse(addressRaw || "{}");
                if (addressObj && addressObj.address) {
                    const lines = [];
                    if (addressObj.name) lines.push(`<strong>${addressObj.name}</strong>`);
                    lines.push(addressObj.address);
                    lines.push(`${addressObj.zip || ''} ${addressObj.city || ''}`);
                    if (addressObj.province) lines.push(addressObj.province);
                    if (addressObj.phone) lines.push(`${addressObj.phone}`);
                    deliveryAddress = lines.join('<br>');
                } else if (typeof addressObj === 'string' && addressObj.length > 0) {
                    deliveryAddress = addressObj;
                }
            } catch (e) {
                deliveryAddress = order.get("address") || "-";
            }

            const subtotal = Number(order.get("subtotal") || 0).toFixed(2);
            const shipping = Number(order.get("shipping") || 0).toFixed(2);
            const tax = Number(order.get("tax") || 0).toFixed(2);
            const total = Number(order.get("total") || 0).toFixed(2);
            const notes = order.get("notes") || t.noNotes;

            const htmlBody = `
                <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1d12; max-width: 600px; margin: 0 auto; line-height: 1.6; background-color: #ffffff; border: 1px solid #eef3d8; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <div style="padding: 40px 20px; text-align: center; background-color: #f9fbe9; border-bottom: 1px solid #eef3d8;">
                        <h2 style="color: #457b2e; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">${t.subject}</h2>
                    </div>

                    <!-- Content -->
                    <div style="padding: 40px 32px;">
                        <p style="font-size: 16px; margin-top: 0; font-weight: 500;">${t.greeting}</p>
                        <p style="font-size: 16px; color: #333;">${t.thankYou}</p>

                        <div style="font-size: 14px; color: #5c6144; background-color: #f1f4e4; padding: 16px; border-radius: 12px; border-left: 4px solid #457b2e; margin: 24px 0;">
                            ${t.modificationNotice}<br><strong style="color: #3d6b28;">${t.lockedNotice}</strong>
                        </div>

                        <!-- Order Summary -->
                        <div style="margin: 40px 0;">
                            <h3 style="margin-bottom: 20px; color: #1a1d12; font-size: 18px; font-weight: 700; border-bottom: 2px solid #e8f5e0; padding-bottom: 10px;">${t.summaryTitle}</h3>
                            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                                <thead>
                                    <tr style="text-align: left; color: #457b2e; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
                                        <th style="padding: 12px 10px; border-bottom: 2px solid #e8f5e0;">${t.product}</th>
                                        <th style="padding: 12px 10px; border-bottom: 2px solid #e8f5e0; text-align: center;">${t.quantity}</th>
                                        <th style="padding: 12px 10px; border-bottom: 2px solid #e8f5e0; text-align: right;">${t.price}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2" style="padding: 20px 10px 4px; text-align: right; color: #757964;">${t.subtotal}:</td>
                                        <td style="padding: 20px 10px 4px; text-align: right; color: #1a1d12; font-weight: 500;">${subtotal} €</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 4px 10px; text-align: right; color: #757964;">${t.shipping}:</td>
                                        <td style="padding: 4px 10px; text-align: right; color: #1a1d12; font-weight: 500;">${shipping} €</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 4px 10px; text-align: right; color: #757964;">${t.tax}:</td>
                                        <td style="padding: 4px 10px; text-align: right; color: #1a1d12; font-weight: 500;">${tax} €</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="padding: 16px 10px; text-align: right; font-weight: 700; color: #457b2e; font-size: 20px;">${t.total}:</td>
                                        <td style="padding: 16px 10px; text-align: right; font-weight: 700; color: #457b2e; font-size: 20px;">${total} €</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <!-- Delivery Info -->
                        <div style="background-color: #f9fbe9; padding: 32px; border-radius: 16px; margin: 40px 0; border: 1px solid #eef3d8;">
                            <h3 style="margin-top: 0; color: #457b2e; font-size: 18px; font-weight: 700; margin-bottom: 20px;">${t.deliveryDetails}</h3>
                            <table style="width: 100%; font-size: 15px; border-spacing: 0;">
                                <tr>
                                    <td style="padding: 6px 0; color: #757964; width: 120px; font-weight: 500;">${t.deliveryMethod}:</td>
                                    <td style="padding: 6px 0; color: #1a1d12; font-weight: 600;">${deliveryMethod}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #757964; font-weight: 500;">${t.deliveryDate}:</td>
                                    <td style="padding: 6px 0; color: #1a1d12; font-weight: 600; text-transform: capitalize;">${deliveryDate}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 6px 0; color: #757964; font-weight: 500;">${t.deliveryTime}:</td>
                                    <td style="padding: 6px 0; color: #1a1d12; font-weight: 600;">${deliveryTime}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0 0 0; color: #757964; vertical-align: top; font-weight: 500;">${t.deliveryAddress}:</td>
                                    <td style="padding: 12px 0 0 0; color: #1a1d12; font-weight: 400; line-height: 1.5;">${deliveryAddress}</td>
                                </tr>
                            </table>
                        </div>

                        <!-- Notes -->
                        <div style="margin: 40px 0;">
                            <h3 style="margin-top: 0; color: #1a1d12; font-size: 16px; font-weight: 700; margin-bottom: 12px;">${t.notesTitle}</h3>
                            <div style="font-size: 14px; color: #444; font-style: italic; background-color: #fcfcfc; padding: 16px; border-radius: 12px; border: 1px solid #f0f0f0;">
                                ${notes}
                            </div>
                        </div>

                        <div style="text-align: center; margin-top: 60px; padding-top: 30px; border-top: 1px solid #eef3d8;">
                            <p style="font-size: 14px; color: #757964; margin-bottom: 30px;">
                                ${t.footer}
                            </p>

                            <p style="margin: 0; font-size: 16px; color: #333;">
                                ${t.regards}<br>
                                <strong style="color: #457b2e; font-size: 18px;">${t.team}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            `;

            // Sender address from settings
            const senderAddress = e.app.settings().meta.senderAddress;
            const senderName = e.app.settings().meta.senderName || tenantName;

            // 3. Create MailerMessage
            const message = new MailerMessage({
                from: {
                    address: senderAddress,
                    name: senderName,
                },
                to: [{ address: userEmail }],
                subject: `${t.subject} - ${tenantName}`,
                html: htmlBody,
            });

            // 4. Send email
            e.app.newMailClient().send(message);
            console.log(`Email de confirmació enviat correctament a ${userEmail} per la comanda ${orderNumber} (${lang})`);
        } else {
            console.warn(`User ${userId} has no email address. Skipping email.`);
        }
    } catch (err) {
        console.error("Error enviant l'email de confirmació: ", err);
    }

    return e.next();
}, "orders");
