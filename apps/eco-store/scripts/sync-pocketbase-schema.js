import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';
import { getPocketBaseUrl } from './load-environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment from arguments or use 'staging' by default
const ENV_NAME = process.env.POCKETBASE_ENV || 'staging';
const POCKETBASE_URL = getPocketBaseUrl(ENV_NAME);

console.log(`🔧 Using environment: ${ENV_NAME}`);
console.log(`🌐 PocketBase URL: ${POCKETBASE_URL}`);

let ADMIN_EMAIL, ADMIN_PASSWORD;

if (ENV_NAME === 'development') {
  ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: Missing DEV credentials.');
    process.exit(1);
  }
  console.log('🔑 Using development credentials (local PocketBase)');
} else {
  ADMIN_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: Missing STAGING credentials.');
    process.exit(1);
  }
  console.log('🔑 Using remote credentials (PocketHost)');
}

const pb = new PocketBase(POCKETBASE_URL);

async function syncSchema() {
  try {
    console.log('🔐 Authenticating with PocketBase...');
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log('📖 Reading schema from file...');
    const schemaPath = path.join(__dirname, '..', 'pocketbase', 'pb_schema.json');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    console.log(`🔄 Syncing ${schema.length} collections...`);

    // --- INITIAL FETCH ---
    let existingCollections = await pb.collections.getFullList();
    let existingMap = new Map(existingCollections.map(col => [col.name, col]));

    let updated = 0;
    let created = 0;
    let skipped = 0;
    let errors = 0;

    const collectionsToSync = schema.filter(col => !col.system);
    const systemCollections = schema.filter(col => col.system);

    console.log(`⏭️  Skipping ${systemCollections.length} system collections`);
    skipped += systemCollections.length;

    // Map by ID for rename detection
    const existingMapById = new Map(existingCollections.map(col => [col.id, col]));

    // --- FIRST PASS: CREATE OR RENAME ---
    console.log('🔄 First pass: Creating missing collections (and handling renames)...');
    for (const collection of collectionsToSync) {
      const existingByName = existingMap.get(collection.name);

      if (!existingByName) {
        // Check if it exists by ID (Renamed collection)
        const existingById = existingMapById.get(collection.id);

        if (existingById) {
          console.log(
            `⚠️ Detected rename: ${existingById.name} -> ${collection.name} (ID: ${collection.id})`
          );
          try {
            await pb.collections.update(existingById.id, { name: collection.name });
            console.log(`✅ Renamed collection: ${existingById.name} -> ${collection.name}`);

            // Update maps to reflect the change for the next pass
            const updatedCol = await pb.collections.getOne(collection.id);
            existingMap.set(collection.name, updatedCol);
            existingMapById.set(collection.id, updatedCol);
            // Remove old name from map if desired, though strictly not required for next pass lookup
            existingMap.delete(existingById.name);

            continue; // Skip creation, proceed to update in next pass
          } catch (error) {
            console.error(
              `❌ Error renaming ${existingById.name} to ${collection.name}:`,
              error.message
            );
            errors++;
          }
        }

        // Create if not found by Name OR ID
        try {
          const minimalFields = collection.fields.filter(field => field.type !== 'relation');

          // Try to force ID, but server might generate a new one
          await pb.collections.create({
            id: collection.id,
            name: collection.name,
            type: collection.type,
            fields: minimalFields,
          });
          console.log(`🆕 Created (minimal): ${collection.name}`);
          created++;
        } catch (error) {
          console.error(`❌ Error creating ${collection.name} (first pass):`, error.message);
          if (error.response?.data) {
            console.error('   Details:', JSON.stringify(error.response.data, null, 2));
          }
          errors++;
        }
      }
    }

    // --- RE-FETCH (CRITICAL FIX) ---
    // Refetch collections to get the REAL IDs assigned by the server.
    // This handles cases where the server ignored our forced ID.
    console.log('🔄 Re-fetching remote collections to ensure ID mapping is correct...');
    existingCollections = await pb.collections.getFullList();
    existingMap = new Map(existingCollections.map(col => [col.name, col]));

    // --- SECOND PASS: UPDATE ---
    console.log('🔄 Second pass: Updating collections with full schema...');
    for (const collection of collectionsToSync) {
      const existing = existingMap.get(collection.name);

      if (!existing) {
        console.error(`❌ Error: Collection ${collection.name} missing after creation pass.`);
        continue;
      }

      try {
        const collectionData = JSON.parse(JSON.stringify(collection));

        // --- SMART SYNC FIX ---
        if (collectionData.fields) {
          collectionData.fields.forEach(field => {
            // FIX: Check both top-level collectionId AND options.collectionId
            const relationId = field.collectionId || field.options?.collectionId;

            if (field.type === 'relation' && relationId) {
              // 1. Find local definition to get the name
              const targetLocalCollection = schema.find(c => c.id === relationId);

              if (targetLocalCollection) {
                const targetName = targetLocalCollection.name;

                // 2. Find remote collection by NAME
                const targetRemoteCollection = existingMap.get(targetName);

                if (targetRemoteCollection) {
                  // If IDs don't match, swap the Local ID for the Remote ID
                  if (relationId !== targetRemoteCollection.id) {
                    console.log(
                      `   🔄 Smart Sync: Mapping ${collection.name}.${field.name} -> ${targetName} (${targetRemoteCollection.id})`
                    );

                    // Update wherever the ID is stored
                    if (field.collectionId) field.collectionId = targetRemoteCollection.id;
                    if (field.options) field.options.collectionId = targetRemoteCollection.id;
                  }
                } else {
                  console.warn(`   ⚠️ Warning: Target '${targetName}' not found remotely.`);
                }
              }
            }
          });
        }

        await pb.collections.update(existing.id, {
          fields: collectionData.fields,
          indexes: collectionData.indexes,
          listRule: collectionData.listRule,
          viewRule: collectionData.viewRule,
          createRule: collectionData.createRule,
          updateRule: collectionData.updateRule,
          deleteRule: collectionData.deleteRule,
          options: collectionData.options,
        });
        console.log(`✅ Updated (full): ${collection.name}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating ${collection.name}:`, error.message);
        if (error.response?.data) {
          // Better error logging to see exactly which field fails
          console.error('   Details:', JSON.stringify(error.response.data, null, 2));
        }
        errors++;
      }
    }

    console.log('\n✅ Schema sync completed!');
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Errors: ${errors}`);

    pb.authStore.clear();
    process.exit(errors > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    pb.authStore.clear();
    process.exit(1);
  }
}

syncSchema();
