import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
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

    for (const collection of schema) {
      // Skip system collections
      if (collection.system) {
        console.log(`⏭️  Skipping system collection: ${collection.name}`);
        skipped++;
        continue;
      }

      const existing = existingMap.get(collection.name);

      try {
        if (existing) {
          // update existing collection
          await pb.collections.update(existing.id, {
            schema: collection.schema,
            indexes: collection.indexes,
            listRule: collection.listRule,
            viewRule: collection.viewRule,
            createRule: collection.createRule,
            updateRule: collection.updateRule,
            deleteRule: collection.deleteRule,
            options: collection.options,
          });
          console.log(`✅ Updated: ${collection.name}`);
          updated++;
        } else {
          // create new collection
          await pb.collections.create({
            name: collection.name,
            type: collection.type,
            schema: collection.schema,
            indexes: collection.indexes,
            listRule: collection.listRule,
            viewRule: collection.viewRule,
            createRule: collection.createRule,
            updateRule: collection.updateRule,
            deleteRule: collection.deleteRule,
            options: collection.options,
          });
          console.log(`🆕 Created: ${collection.name}`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error processing ${collection.name}:`, error.message);
        if (error.response) {
          console.error('   Response:', error.response);
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
