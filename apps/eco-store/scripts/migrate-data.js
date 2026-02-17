import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const LOCAL_URL = process.env.POCKETBASE_LOCAL_URL;
const STAGING_URL = process.env.POCKETBASE_STAGING_URL;

const LOCAL_ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
const LOCAL_ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

const STAGING_ADMIN_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
const STAGING_ADMIN_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

const pbLocal = new PocketBase(LOCAL_URL);
const pbStaging = new PocketBase(STAGING_URL);

// Disable auto-cancellation for bulk operations
pbLocal.autoCancellation(false);
pbStaging.autoCancellation(false);

async function migrateCollection(collectionName) {
  console.log(`\n📦 Migrating collection: ${collectionName}...`);

  try {
    // 1. Fetch all records from local
    const records = await pbLocal.collection(collectionName).getFullList({
      sort: '-created',
    });

    console.log(`Found ${records.length} records in local.`);

    for (const record of records) {
      const recordId = record.id;
      try {
        // 2. Check if record exists in staging
        let exists = false;
        try {
          await pbStaging.collection(collectionName).getOne(recordId);
          exists = true;
        } catch (e) {
          // Record doesn't exist
        }

        // Prepare data
        const data = { ...record };
        delete data.created;
        delete data.updated;
        delete data.collectionId;
        delete data.collectionName;
        delete data.expand;

        // Handle files
        const fileFields = [];
        if (collectionName === 'products') fileFields.push('images');
        if (collectionName === 'tenants') fileFields.push('logo');
        if (collectionName === 'users') fileFields.push('avatar');

        const formData = new FormData();
        let hasFiles = false;

        // Download and add files to formData
        for (const field of fileFields) {
          const files = record[field];
          if (files) {
            const fileList = Array.isArray(files) ? files : [files];
            for (const filename of fileList) {
              try {
                const fileUrl = pbLocal.files.getURL(record, filename);
                const response = await fetch(fileUrl);
                if (response.ok) {
                  const blob = await response.blob();
                  formData.append(field, blob, filename);
                  hasFiles = true;
                }
              } catch (fileErr) {
                console.error(`  ⚠️ Could not migrate file ${filename}:`, fileErr.message);
              }
            }
          }
        }

        if (exists) {
          console.log(`Updating record ${recordId}...`);
          let updateData;
          if (hasFiles) {
            for (const key in data) {
              if (key === 'id') continue;
              if (!fileFields.includes(key)) {
                const value = data[key];
                if (Array.isArray(value)) {
                  value.forEach(item => formData.append(key, item));
                } else if (typeof value === 'object' && value !== null) {
                  formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                  formData.append(key, value);
                }
              }
            }
            updateData = formData;
          } else {
            updateData = { ...data };
            delete updateData.id;
          }
          await pbStaging.collection(collectionName).update(recordId, updateData);
        } else {
          console.log(`Creating record ${recordId}...`);
          let createData;
          if (hasFiles) {
            for (const key in data) {
              if (!fileFields.includes(key)) {
                const value = data[key];
                if (Array.isArray(value)) {
                  value.forEach(item => formData.append(key, item));
                } else if (typeof value === 'object' && value !== null) {
                  formData.append(key, JSON.stringify(value));
                } else if (value !== undefined && value !== null) {
                  formData.append(key, value);
                }
              }
            }
            createData = formData;
          } else {
            createData = data;
          }
          await pbStaging.collection(collectionName).create(createData);
        }
      } catch (err) {
        console.error(`❌ Error migrating record ${recordId} in ${collectionName}:`, err.message);
        if (err.data && err.data.data) {
          console.error('Validation errors:', JSON.stringify(err.data.data));
        }
      }
    }
    console.log(`✅ Finished migrating ${collectionName}.`);
  } catch (err) {
    console.error(`❌ Failed to fetch from local collection ${collectionName}:`, err.message);
  }
}

async function run() {
  try {
    console.log('🚀 Starting migration...');

    // Login
    console.log('Logging into local PB...');
    await pb.collection('_superusers').authWithPassword(LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASSWORD);

    console.log('Logging into staging PB...');
    await pb
      .collection('_superusers')
      .authWithPassword(STAGING_ADMIN_EMAIL, STAGING_ADMIN_PASSWORD);

    const collections = await pb.collections.getFullList({
      sort: 'created',
    });

    for (const collection of collections) {
      await migrateCollection(collection);
    }

    console.log('\n✨ Migration completed successfully!');
  } catch (err) {
    console.error('\n💥 Critical error during migration:', err.message);
  }
}

run();
