import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';
import { getPocketBaseUrl } from './load-environment.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

console.log(process.env);

// Read environment from arguments or use 'staging' by default
const ENV_NAME = process.env.POCKETBASE_ENV || 'staging';
const POCKETBASE_URL = getPocketBaseUrl(ENV_NAME);

console.log(`🔧 Using environment: ${ENV_NAME}`);
console.log(`🌐 PocketBase URL: ${POCKETBASE_URL}`);

// Credentials depend on the environment
let ADMIN_EMAIL, ADMIN_PASSWORD;

if (ENV_NAME === 'development') {
  ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

  console.log(`Development credentials: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);

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

async function fixCollectionIds() {
  try {
    console.log('🔐 Authenticating with PocketBase...');
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log('📖 Reading local schema from file...');
    const schemaPath = path.join(__dirname, '..', 'pocketbase', 'pb_schema.json');

    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const localSchema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

    console.log('🌐 Fetching remote collections from PocketHost...');
    const remoteCollections = await pb.collections.getFullList();

    console.log(`\n📊 Found ${localSchema.length} collections in local schema`);
    console.log(`📊 Found ${remoteCollections.length} collections in remote PocketBase\n`);

    // Create a map of collection name -> remote ID
    const remoteIdMap = new Map();
    remoteCollections.forEach(col => {
      remoteIdMap.set(col.name, col.id);
    });

    let updatedCount = 0;
    let unchangedCount = 0;

    // Update local schema with remote IDs
    localSchema.forEach(collection => {
      if (collection.system) {
        unchangedCount++;
        return; // Skip system collections
      }

      const remoteId = remoteIdMap.get(collection.name);

      if (!remoteId) {
        console.log(
          `⚠️  Collection "${collection.name}" not found in remote - keeping local ID: ${collection.id}`
        );
        unchangedCount++;
        return;
      }

      if (collection.id !== remoteId) {
        console.log(`🔄 Updating "${collection.name}": ${collection.id} → ${remoteId}`);
        collection.id = remoteId;

        // Update relation fields that reference this collection
        localSchema.forEach(otherCollection => {
          otherCollection.fields.forEach(field => {
            if (field.type === 'relation' && field.collectionId === collection.id) {
              console.log(`   ↳ Updating relation in "${otherCollection.name}.${field.name}"`);
              field.collectionId = remoteId;
            }
          });
        });

        updatedCount++;
      } else {
        unchangedCount++;
      }
    });

    console.log(`\n✅ Fixed ${updatedCount} collection IDs`);
    console.log(`✅ ${unchangedCount} collections unchanged`);

    // Write updated schema back to file
    console.log('\n💾 Writing updated schema to file...');
    fs.writeFileSync(schemaPath, JSON.stringify(localSchema, null, 2));

    console.log('✅ Schema file updated successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Review the changes: git diff apps/eco-store/pocketbase/pb_schema.json');
    console.log('   2. Run sync again: node apps/eco-store/scripts/sync-pocketbase-schema.js');

    pb.authStore.clear();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing collection IDs:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
    pb.authStore.clear();
    process.exit(1);
  }
}

fixCollectionIds();
