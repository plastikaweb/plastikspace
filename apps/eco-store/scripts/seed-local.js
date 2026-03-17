import PocketBase from 'pocketbase';
import { loadDotEnv } from './load-environment.js';

// Load environment variables from .env if it exists
loadDotEnv();

// Constants
const LOCAL_URL = process.env.POCKETBASE_LOCAL_URL || 'http://127.0.0.1:8090';
const STAGING_URL = process.env.POCKETBASE_STAGING_URL;

const LOCAL_ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
const LOCAL_ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

const STAGING_ADMIN_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
const STAGING_ADMIN_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

if (!STAGING_URL) {
  console.error('❌ Error: POCKETBASE_STAGING_URL not defined in environment.');
  process.exit(1);
}

const pbLocal = new PocketBase(LOCAL_URL);
const pbStaging = new PocketBase(STAGING_URL);

// Disable auto-cancellation for bulk operations
pbLocal.autoCancellation(false);
pbStaging.autoCancellation(false);

/**
 * Pulls a collection from staging PocketBase to local.
 * @param {string} collectionName - The name of the collection to pull.
 */
async function pullCollection(collectionName) {
  console.log(`\n📦 Pulling collection: ${collectionName}...`);

  try {
    // 1. Fetch all records from staging
    const records = await pbStaging.collection(collectionName).getFullList({
      sort: 'created',
    });

    console.log(`   Found ${records.length} records in staging.`);

    // Get collection info to find file fields
    const collectionInfo = await pbStaging.collections.getOne(collectionName);
    const fileFields = collectionInfo.fields.filter(f => f.type === 'file');

    for (const record of records) {
      const recordId = record.id;
      try {
        // 2. Check if record exists in local
        let exists = false;
        try {
          await pbLocal.collection(collectionName).getOne(recordId);
          exists = true;
        } catch {
          // Record doesn't exist locally
        }

        // Prepare data
        const data = { ...record };
        delete data.created;
        delete data.updated;
        delete data.collectionId;
        delete data.collectionName;
        delete data.expand;

        const formData = new FormData();
        let hasFiles = false;

        // Download files from staging and add to formData
        if (fileFields.length > 0) {
          for (const field of fileFields) {
            const files = record[field.name];
            if (files) {
              const fileList = Array.isArray(files) ? files : [files];
              for (const filename of fileList) {
                if (!filename) continue;
                try {
                  const fileUrl = pbStaging.files.getURL(record, filename, {
                    token: pbStaging.authStore.token,
                  });
                  const response = await fetch(fileUrl);
                  if (response.ok) {
                    const blob = await response.blob();
                    formData.append(field.name, blob, filename);
                    hasFiles = true;
                  } else {
                    console.error(`      ❌ Failed to fetch file ${filename}: ${response.status}`);
                  }
                } catch (fileErr) {
                  console.error(`      ⚠️ Could not pull file ${filename}:`, fileErr.message);
                }
              }
            }
          }
        }

        if (hasFiles) {
          // Add all other fields to formData
          for (const key in data) {
            if (fileFields.find(f => f.name === key)) continue;
            const value = data[key];
            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
              formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          }
        }

        const payload = hasFiles ? formData : data;

        if (exists) {
          console.log(`   Updating local record ${recordId}...`);
          await pbLocal.collection(collectionName).update(recordId, payload);
        } else {
          console.log(`   Creating local record ${recordId}...`);
          await pbLocal.collection(collectionName).create(payload);
        }
      } catch (err) {
        console.error(
          `   ❌ Error processing record ${recordId} in ${collectionName}:`,
          err.message
        );
      }
    }
    console.log(`   ✅ Finished pulling ${collectionName}.`);
  } catch (err) {
    console.error(`   ❌ Failed to fetch from staging collection ${collectionName}:`, err.message);
  }
}

/**
 * Runs the pull process.
 */
async function run() {
  try {
    console.log('🚀 Starting data pull from staging to local (SEEDING)...');

    // Login
    console.log('🔐 Logging into local PB...');
    // Use _superusers collection for superuser authentication (available in v0.23+)
    await pbLocal
      .collection('_superusers')
      .authWithPassword(LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASSWORD);

    console.log('🔐 Logging into staging PB...');
    // Use _superusers collection for superuser authentication (available in v0.23+)
    await pbStaging
      .collection('_superusers')
      .authWithPassword(STAGING_ADMIN_EMAIL, STAGING_ADMIN_PASSWORD);

    console.log('✅ Authenticated successfully!');
    console.log('   Local Is Superuser:', !!pbLocal.authStore.isSuperuser);
    console.log('   Staging Is Superuser:', !!pbStaging.authStore.isSuperuser);

    // Define collection order to respect relations
    const collectionsToPull = [
      'tenants',
      'languages',
      'category_groups',
      'product_categories',
      'tags',
      'products',
      'user_addresses',
      'tenant_addresses',
      'product_categories_stats',
      'order_cycles',
      'users',
      'carts',
      'orders',
    ];

    for (const name of collectionsToPull) {
      await pullCollection(name);
    }

    console.log('\n✨ Data seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('\n💥 Critical error during seeding:', err.message);
    process.exit(1);
  }
}

run();
