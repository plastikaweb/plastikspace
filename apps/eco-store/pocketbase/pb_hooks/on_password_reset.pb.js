/// <reference path="../pb_data/types.d.ts" />

// =================================================================
// CUSTOM PASSWORD RESET EMAIL
// Intercepts the default password reset email and replaces it with
// a branded HTML email matching the order confirmation style.
// =================================================================
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

    // --- Resolve app URL ---
    // This comes from PocketBase Admin > Settings > Application URL.
    let appURL = (e.app.settings().meta.appURL || "").replace(/\/+$/, "");
    let frontendURL = appURL;

    // Build the frontend URL based on the environment and tenant subdomain
    if (!appURL || appURL.includes("localhost") || appURL.includes("127.0.0.1")) {
        // Local environment
        frontendURL = `http://${normalizedName}.test:4200`;
    } else if (appURL.includes("9botiga.top")) {
        // Staging/Prod environment specifically for 9botiga.top
        frontendURL = `https://${normalizedName}.9botiga.top`;
    } else {
        // Generic fallback for other domains: try to replace the first subdomain
        try {
            // Note: PocketBase JavaScript VM (Goja) has basic JS support.
            // Using basic string manipulation to avoid missing URL class issues if any.
            if (appURL.startsWith("http")) {
                const urlParts = appURL.split("://");
                const protocol = urlParts[0];
                let domainAndPath = urlParts[1];
                const domainParts = domainAndPath.split('/')[0].split('.');

                if (domainParts.length >= 3) { // e.g., api.domain.com
                    domainParts[0] = normalizedName; // replace 'api' with tenant name
                    frontendURL = `${protocol}://${domainParts.join('.')}`;
                } else {
                    frontendURL = `${protocol}://${normalizedName}.${domainAndPath.split('/')[0]}`;
                }
            }
        } catch (err) {
            console.warn("Could not parse generic appURL, falling back to basic:", err);
        }
    }

    const resetPath = "restablir-contrasenya";
    const resetLink = frontendURL + "/" + resetPath + "?token=" + encodeURIComponent(token);

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
