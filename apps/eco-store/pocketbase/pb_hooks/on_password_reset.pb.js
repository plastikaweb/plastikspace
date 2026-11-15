/// <reference path="../pb_data/types.d.ts" />

// =================================================================
// CUSTOM PASSWORD RESET EMAIL
// Intercepts the default password reset email and replaces it with
// a branded HTML email matching the order confirmation style.
//
// Two frontends ask for it, and the link of the email goes back to
// the one that asked:
//   - the storefront of the user's cooperative (eco-store), and
//   - the admin panel (eco-admin), when the request came from the
//     panel AND the account is an administrator's.
// Everything else in the email is the same for both.
// =================================================================

// The mailer hook below has no request to read: PocketBase sends the email in the
// background, after the request is answered. This hook runs while the request is still
// there and leaves its `Origin` on the record (a value that is not a field of the
// collection: it is never saved and never returned by the API). The same record is the
// one the mailer hook receives.
//
// The request lives on `e.requestEvent` in this PocketBase build (0.36.7): there is no
// top-level `e.request` (see the note in `validate_fiscal_profile.pb.js`). Reading the
// header must never be what stops a reset, so any failure here leaves the origin empty
// and the email falls back to the storefront.
onRecordRequestPasswordResetRequest((e) => {
    let requestOrigin = "";

    try {
        requestOrigin = e.requestEvent.request.header.get("Origin") || "";
    } catch (_) {
        requestOrigin = "";
    }

    try {
        if (e.record) {
            e.record.set("resetRequestOrigin", requestOrigin);
        }
    } catch (_) { /* the email falls back to the storefront */ }

    return e.next();
}, "users");

onMailerRecordPasswordResetSend((e) => {
    const record = e.record;
    const token = e.meta["token"];

    if (!record || !token) {
        return e.next();
    }

    const userEmail = record.email();
    if (!userEmail) {
        console.warn("Password reset requested for record without email. Skipping custom email.");
        return e.next();
    }

    // --- Resolve tenant name and normalizedName ---
    let tenantName = "Botiga Eco";
    let normalizedName = "el-llevat"; // Default fallback
    try {
        const tenantId = record.get("tenant");
        if (tenantId) {
            const tenant = e.app.findRecordById("tenants", tenantId);
            tenantName = tenant.get("name") || tenantName;
            normalizedName = tenant.get("normalizedName") || normalizedName;
        } else {
            // Fallback: Just grab the first tenant if the user somehow has no tenant assigned
            const tenants = e.app.findAllRecords("tenants");
            if (tenants.length > 0) {
                tenantName = tenants[0].get("name") || tenantName;
                normalizedName = tenants[0].get("normalizedName") || normalizedName;
            }
        }
    } catch (err) {
        console.warn("Could not fetch tenant for password reset email:", err);
    }

    // --- Resolve the two frontends ---
    // The app URL comes from PocketBase Admin > Settings > Application URL.
    const appURL = (e.app.settings().meta.appURL || "").replace(/\/+$/, "");
    const isLocal = !appURL || appURL.includes("localhost") || appURL.includes("127.0.0.1");

    // The address of the frontend served under a subdomain of the instance's domain:
    // the storefront of a tenant (`el-llevat`) or the admin panel (`admin`).
    const frontendFor = (subdomain, localURL) => {
        if (isLocal) {
            return localURL;
        }

        if (appURL.includes("9botiga.top")) {
            // Staging/Prod environment specifically for 9botiga.top
            return `https://${subdomain}.9botiga.top`;
        }

        // Generic fallback for other domains: try to replace the first subdomain
        try {
            // Note: PocketBase JavaScript VM (Goja) has basic JS support.
            // Using basic string manipulation to avoid missing URL class issues if any.
            if (appURL.startsWith("http")) {
                const urlParts = appURL.split("://");
                const protocol = urlParts[0];
                const domain = urlParts[1].split('/')[0];
                const domainParts = domain.split('.');

                if (domainParts.length >= 3) { // e.g., api.domain.com
                    domainParts[0] = subdomain; // replace 'api' with the subdomain
                    return `${protocol}://${domainParts.join('.')}`;
                }

                return `${protocol}://${subdomain}.${domain}`;
            }
        } catch (err) {
            console.warn("Could not parse generic appURL, falling back to basic:", err);
        }

        return appURL;
    };

    const storeURL = frontendFor(normalizedName, `http://${normalizedName}.test:4200`);
    const adminURL = frontendFor("admin", "http://localhost:4204");

    // --- Pick the frontend the link opens ---
    // The `Origin` of the request is only ever COMPARED with the address of the panel
    // worked out above; it is never written into the link. Anyone can send any `Origin`
    // with someone else's address, and a link built from it would hand the token to a
    // host of their choice.
    // An administrator who asks from the storefront, and a member who asks from the
    // panel, both get the storefront: the panel would turn the member away at the door.
    let requestOrigin = "";
    try {
        requestOrigin = String(record.get("resetRequestOrigin") || "").replace(/\/+$/, "");
    } catch (_) {
        // no request behind this email (sent from the PocketBase console)
    }

    const role = record.get("role");
    const isAdministrator = role === "TENANT_ADMIN" || role === "GLOBAL_ADMIN";
    const opensAdminPanel = isAdministrator && requestOrigin === adminURL;
    const frontendURL = opensAdminPanel ? adminURL : storeURL;

    // Both frontends serve the reset view under the same path.
    const resetPath = "restablir-contrasenya";
    const resetLink = frontendURL + "/" + resetPath + "?token=" + encodeURIComponent(token);

    // Which frontend the link opens, for whoever has to answer "the email took me to the
    // wrong place". The token and the address of the user stay out of the log.
    e.app.logger().info(
        "Password reset email built",
        "record", record.id,
        "frontend", opensAdminPanel ? "admin" : "store",
        "frontendURL", frontendURL
    );

    // --- Detect language from record (fallback to 'ca') ---
    let lang = "ca";
    try {
        lang = record.get("language") || "ca";
    } catch (_) {
        // language field may not exist on all auth collections
    }

    const translations = {
        ca: {
            subject: `Restablir contrasenya - ${tenantName}`,
            greeting: "Hola!",
            intro: `Has sol·licitat restablir la contrasenya del teu compte a <strong>${tenantName}</strong>.`,
            instruction: "Fes clic al botó de sota per crear una nova contrasenya:",
            buttonText: "Restablir contrasenya",
            expiry: "Aquest enllaç caducarà en <strong>30 minuts</strong>.",
            ignoreNotice: "Si no has sol·licitat aquest canvi, pots ignorar aquest correu amb tota tranquil·litat.",
            footer: "Aquest correu és un missatge automàtic. Si tens cap problema, posa't en contacte amb nosaltres.",
            regards: "Salut i bons aliments,",
            team: `L'equip de ${tenantName}`,
        },
        es: {
            subject: `Restablecer contraseña - ${tenantName}`,
            greeting: "¡Hola!",
            intro: `Has solicitado restablecer la contraseña de tu cuenta en <strong>${tenantName}</strong>.`,
            instruction: "Haz clic en el botón de abajo para crear una nueva contraseña:",
            buttonText: "Restablecer contraseña",
            expiry: "Este enlace caducará en <strong>30 minutos</strong>.",
            ignoreNotice: "Si no has solicitado este cambio, puedes ignorar este correo con total tranquilidad.",
            footer: "Este correo es un mensaje automático. Si tienes algún problema, ponte en contacto con nosotros.",
            regards: "Saludos y buenos alimentos,",
            team: `El equipo de ${tenantName}`,
        },
        en: {
            subject: `Reset password - ${tenantName}`,
            greeting: "Hello!",
            intro: `You have requested to reset your password for your account at <strong>${tenantName}</strong>.`,
            instruction: "Click the button below to create a new password:",
            buttonText: "Reset password",
            expiry: "This link will expire in <strong>30 minutes</strong>.",
            ignoreNotice: "If you did not request this change, you can safely ignore this email.",
            footer: "This email is an automated message. If you have any issues, please contact us.",
            regards: "Kind regards,",
            team: `The ${tenantName} team`,
        },
    };

    const t = translations[lang] || translations["ca"];

    const htmlBody = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1a1d12; max-width: 600px; margin: 0 auto; line-height: 1.6; background-color: #ffffff; border: 1px solid #eef3d8; border-radius: 16px; overflow: hidden;">
            <!-- Header -->
            <div style="padding: 40px 20px; text-align: center; background-color: #f9fbe9; border-bottom: 1px solid #eef3d8;">
                <h2 style="color: #457b2e; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">${t.subject}</h2>
            </div>

            <!-- Content -->
            <div style="padding: 40px 32px;">
                <p style="font-size: 16px; margin-top: 0; font-weight: 500;">${t.greeting}</p>
                <p style="font-size: 16px; color: #333;">${t.intro}</p>
                <p style="font-size: 16px; color: #333;">${t.instruction}</p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 40px 0;">
                    <a href="${resetLink}" style="display: inline-block; background-color: #457b2e; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">${t.buttonText}</a>
                </div>

                <!-- Expiry notice -->
                <div style="font-size: 14px; color: #5c6144; background-color: #f1f4e4; padding: 16px; border-radius: 12px; border-left: 4px solid #457b2e; margin: 24px 0;">
                    ${t.expiry}
                </div>

                <!-- Ignore notice -->
                <p style="font-size: 14px; color: #757964; margin-top: 24px;">${t.ignoreNotice}</p>

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

    // Override the default email. The tenant name wins over the instance-wide sender name
    // so members see their cooperative as the sender, not the platform.
    const senderAddress = e.app.settings().meta.senderAddress;
    const senderName = tenantName || e.app.settings().meta.senderName;

    e.message.subject = t.subject;
    e.message.html = htmlBody;
    e.message.from = { address: senderAddress, name: senderName };

    return e.next();
}, "users");
