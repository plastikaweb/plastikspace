import PocketBase from 'pocketbase';

// 1️⃣ CONFIGURACIÓ
const PB_URL = 'http://127.0.0.1:8090'; // La URL del teu PocketBase (local o remot)

// OPCIÓ A: Autenticació amb Email i Password
// const ADMIN_EMAIL = 'tu@email.com';
// const ADMIN_PASS = 'la_teva_password';

// OPCIÓ B: Autenticació amb Token (JWT)
// Pots obtenir aquest token des del LocalStorage del navegador si ja estàs logejat com admin,
// o generant-lo prèviament. Assegura't que no estigui caducat.
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc2NjMwODI0NiwiaWQiOiJxNzc2ZmhnbDR0eWM5NGoiLCJyZWZyZXNoYWJsZSI6dHJ1ZSwidHlwZSI6ImF1dGgifQ.tvpuwVYOvQGLoREZ2ipHEwRBKkA7c0u4tPMQfmfkvlE';

const TARGET_CLIENT_ID = 'w64sjhap8i93yzy'; // L'ID del registre de la col·lecció 'clients' al que vols vincular els productes

const pb = new PocketBase(PB_URL);

// Deshabilita l'auto-cancel·lació de peticions per si hi ha moltes operacions seguides
pb.autoCancellation(false);

async function main() {
    try {
        // --- SELECCIÓ DEL MÈTODE D'AUTENTICACIÓ ---

        // Mètode 1: Si uses Token
        if (ADMIN_TOKEN) {
            console.log("🔐 Carregant token d'autenticació...");
            pb.authStore.save(ADMIN_TOKEN, null); // 'null' perquè no tenim el model d'usuari, però el token és suficient per fer peticions
        }
        // Mètode 2: Si uses Email/Pass (Descomenta les constants a dalt i aquesta part si ho prefereixes)
        /* else {
            console.log("🔐 Autenticant amb contrasenya...");
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        }
        */

        // Verificació ràpida de que tenim accés
        if (!pb.authStore.isValid) {
            throw new Error("El token no és vàlid o ha caducat, o no s'ha fet login correctament.");
        }

        console.log("📦 Buscant productes...");

        // OPCIÓ A: Actualitzar TOTS els productes
        // const records = await pb.collection('products').getFullList();

        // OPCIÓ B: Actualitzar només els que NO tinguin client assignat (més segur)
        const records = await pb.collection('products').getFullList();

        console.log(`🔍 S'han trobat ${records.length} productes per actualitzar.`);

        // Processar en paral·lel o seqüencial. Seqüencial és més segur per no saturar el servidor.
        for (const record of records) {

            // Si ja té el client correcte, saltem (per seguretat si no has filtrat abans)
            if (record.client === TARGET_CLIENT_ID) continue;

            await pb.collection('products').update(record.id, {
                client: TARGET_CLIENT_ID
            });

            console.log(`✅ Actualitzat: ${record.name} (ID: ${record.id})`);
        }

        console.log("\n🎉 Procés finalitzat correctament!");

    } catch (error) {
        console.error("❌ Error:", error.originalError || error);
    }
}

main();