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
  console.warn('⚠️  POCKETBASE_STAGING_URL not defined in environment.');
  console.log('   Check your .env file. Skipping data seeding from staging.');
  process.exit(0);
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
    const collectionInfo = await pbLocal.collections.getOne(collectionName);

    if (collectionInfo.type === 'view') {
      console.log(`   ⏭️ Skipping ${collectionName} (view collection is read-only).`);
      return;
    }

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

        // If it's an auth collection (like 'users'), we might need to provide a password
        // because it's required in the schema but not returned by staging API.
        if (collectionName === 'users' && !exists) {
          if (!data.password) {
            data.password = 'seed-password-123';
            data.passwordConfirm = 'seed-password-123';
          }
        }

        const formData = new FormData();
        let hasFiles = false;

        // Download files from staging and add to formData
        if (fileFields.length > 0) {
          for (const field of fileFields) {
            let files = record[field.name];
            if (files) {
              let fileList = Array.isArray(files) ? files : [files];

              // ENFORCE FILE LIMITS: Staging might have more files than local schema allows
              if (field.maxSelect && fileList.length > field.maxSelect) {
                console.warn(
                  `      ⚠️ Truncating files for field ${field.name} in ${collectionName} (${recordId}): ${fileList.length} -> ${field.maxSelect}`
                );
                fileList = fileList.slice(0, field.maxSelect);
              }

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

        let payload;
        if (hasFiles) {
          // Add all other fields to formData
          for (const key in data) {
            // Skip file fields as we handled them separately
            if (fileFields.find(f => f.name === key)) continue;

            const value = data[key];
            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
              formData.append(key, JSON.stringify(value));
            } else if (value !== undefined && value !== null) {
              formData.append(key, value);
            }
          }
          payload = formData;
        } else {
          payload = data;
        }

        const options = {
          headers: {
            'x-bypass-hooks': 'true',
          },
        };

        if (exists) {
          console.log(`   Updating local record ${recordId}...`);
          await pbLocal.collection(collectionName).update(recordId, payload, options);
        } else {
          console.log(`   Creating local record ${recordId}...`);
          await pbLocal.collection(collectionName).create(payload, options);
        }
      } catch (err) {
        console.error(
          `   ❌ Error processing record ${recordId} in ${collectionName}:`,
          err.message
        );
        if (err.response?.data) {
          console.error('      Details:', JSON.stringify(err.response.data, null, 2));
        }
      }
    }
    console.log(`   ✅ Finished pulling ${collectionName}.`);
  } catch (err) {
    console.error(`   ❌ Failed to fetch from staging collection ${collectionName}:`, err.message);
    if (err.response?.data) {
      console.error('      Details:', JSON.stringify(err.response.data, null, 2));
    }
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
      'users',
      'user_addresses',
      'tenant_addresses',
      'product_categories_stats',
      'order_cycles',
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
