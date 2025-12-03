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

// Credentials depend on the environment
// Development uses local credentials (_DEV_), staging/production use remote credentials
let ADMIN_EMAIL, ADMIN_PASSWORD;

if (ENV_NAME === 'development') {
  ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      '❌ Error: Development environment requires POCKETBASE_DEV_ADMIN_EMAIL and POCKETBASE_DEV_ADMIN_PASSWORD'
    );
    console.error('   Please set them in your .env file');
    process.exit(1);
  }
  console.log('🔑 Using development credentials (local PocketBase)');
} else {
  ADMIN_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      '❌ Error: Staging/Production requires POCKETBASE_STAGING_ADMIN_EMAIL and POCKETBASE_STAGING_ADMIN_PASSWORD'
    );
    console.error('   Please set them in your .env file or environment');
    process.exit(1);
  }
  console.log('🔑 Using remote credentials (PocketHost)');
}

const pb = new PocketBase(POCKETBASE_URL);

async function syncSchema() {
  try {
    console.log('🔐 Authenticating with PocketBase...');

    // Authenticate as admin
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log('📖 Reading schema from file...');

    // Read the schema from the file
    const schemaPath = path.join(__dirname, '..', 'pocketbase', 'pb_schema.json');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(
        `Schema file not found: ${schemaPath}\nRun 'npm run pb:export' first to export the schema.`
      );
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    console.log(`🔄 Syncing ${schema.length} collections...`);

    // get existing collections
    const existingCollections = await pb.collections.getFullList();
    const existingMap = new Map(existingCollections.map(col => [col.name, col]));

    let updated = 0;
    let created = 0;
    let skipped = 0;
    let errors = 0;

    // Filter out system collections
    const collectionsToSync = schema.filter(col => !col.system);
    const systemCollections = schema.filter(col => col.system);

    console.log(`⏭️  Skipping ${systemCollections.length} system collections`);
    skipped += systemCollections.length;

    // First pass: Create missing collections with minimal schema (no relations)
    console.log('🔄 First pass: Creating missing collections...');
    for (const collection of collectionsToSync) {
      const existing = existingMap.get(collection.name);
      if (!existing) {
        try {
          // Filter out relation fields for the first pass to avoid "missing collection" errors
          const minimalFields = collection.fields.filter(field => field.type !== 'relation');

          await pb.collections.create({
            id: collection.id,
            name: collection.name,
            type: collection.type,
            fields: minimalFields,
            // Skip rules and indexes in first pass
          });
          console.log(`🆕 Created (minimal): ${collection.name}`);
          // Update map so second pass knows it exists
          existingMap.set(collection.name, { id: collection.id, name: collection.name });
        } catch (error) {
          console.error(`❌ Error creating ${collection.name} (first pass):`, error.message);
          if (error.response) {
            console.error('   Response:', JSON.stringify(error.response, null, 2));
          }
          errors++;
        }
      }
    }

    // Second pass: Update all collections with full schema (including relations and rules)
    console.log('🔄 Second pass: Updating collections with full schema...');
    for (const collection of collectionsToSync) {
      const existing = existingMap.get(collection.name);

      if (!existing) {
        console.error(`❌ Error: Collection ${collection.name} should exist by now but doesn't.`);
        continue;
      }

      try {
        await pb.collections.update(existing.id, {
          fields: collection.fields,
          indexes: collection.indexes,
          listRule: collection.listRule,
          viewRule: collection.viewRule,
          createRule: collection.createRule,
          updateRule: collection.updateRule,
          deleteRule: collection.deleteRule,
          options: collection.options,
        });
        console.log(`✅ Updated (full): ${collection.name}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating ${collection.name} (second pass):`, error.message);
        if (error.response) {
          console.error('   Response:', JSON.stringify(error.response, null, 2));
        }
        errors++;
      }
    }

    console.log('\n✅ Schema sync completed!');
    console.log(`   Created: ${created}`);
    console.log(`   Updated: ${updated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);

    pb.authStore.clear();
    process.exit(errors > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Error syncing schema:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
    pb.authStore.clear();
    process.exit(1);
  }
}

syncSchema();
