import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';
import { getPocketBaseUrl, loadDotEnv } from './load-environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if it exists
loadDotEnv();

// This script always targets DEVELOPMENT (local) for importing
const ENV_NAME = 'development';
const POCKETBASE_URL = getPocketBaseUrl(ENV_NAME);

console.log(`🔧 Target Environment: ${ENV_NAME}`);
console.log(`🌐 PocketBase URL: ${POCKETBASE_URL}`);

const ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌ Error: Missing local PocketBase credentials in .env');
  process.exit(1);
}

const pb = new PocketBase(POCKETBASE_URL);
pb.autoCancellation(false);

/**
 * Main import function
 */
async function importAll() {
  try {
    console.log('🔐 Authenticating with local PocketBase...');
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('✅ Authenticated successfully!');

    const dataDir = path.join(__dirname, '..', 'pocketbase', 'data');
    const storageDir = path.join(dataDir, 'storage');

    if (!fs.existsSync(dataDir)) {
      console.error(`❌ Data directory not found: ${dataDir}`);
      process.exit(1);
    }

    // Define the order of import to respect relations
    // (e.g. tenants before products)
    const collectionsToImport = [
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

    for (const colName of collectionsToImport) {
      const filePath = path.join(dataDir, `${colName}.json`);
      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  Data file for ${colName} not found, skipping...`);
        continue;
      }

      console.log(`📦 Importing collection: ${colName}...`);
      const records = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Get collection schema to identify file fields
      const collection = await pb.collections.getOne(colName);
      const fileFields = collection.fields.filter(f => f.type === 'file');

      for (const record of records) {
        try {
          // Check if record exists
          let exists = false;
          try {
            await pb.collection(colName).getOne(record.id);
            exists = true;
          } catch {
            // Not found
          }

          const data = { ...record };
          // Remove system/generated fields
          delete data.collectionId;
          delete data.collectionName;
          delete data.created;
          delete data.updated;
          delete data.expand;

          // Prepare FormData if there are files
          let payload = data;
          const formData = new FormData();
          let hasFiles = false;

          if (fileFields.length > 0) {
            for (const field of fileFields) {
              const fileNames = record[field.name];
              if (!fileNames) continue;

              const nameList = Array.isArray(fileNames) ? fileNames : [fileNames];
              const recordLocalDir = path.join(storageDir, collection.id, record.id);

              for (const name of nameList) {
                const localFilePath = path.join(recordLocalDir, name);
                if (fs.existsSync(localFilePath)) {
                  const blob = new Blob([fs.readFileSync(localFilePath)]);
                  formData.append(field.name, blob, name);
                  hasFiles = true;
                } else {
                  console.warn(
                    `   ⚠️ File missing locally: ${name}. Will try to download from staging...`
                  );
                  // OPTIONAL: Pull from staging if local is missing
                  const stagingUrl = process.env.POCKETBASE_STAGING_URL;
                  if (stagingUrl) {
                    try {
                      const remoteUrl = `${stagingUrl}/api/files/${collection.id}/${record.id}/${name}`;
                      const response = await fetch(remoteUrl);
                      if (response.ok) {
                        const buffer = await response.arrayBuffer();
                        formData.append(field.name, new Blob([buffer]), name);
                        hasFiles = true;
                        console.log(`      ✅ Successfully pulled ${name} from staging.`);
                      }
                    } catch (e) {
                      console.error(`      ❌ Could not pull from staging: ${e.message}`);
                    }
                  }
                }
              }
            }
          }

          if (hasFiles) {
            // Add all other fields to formData
            for (const key in data) {
              if (fileFields.find(f => f.name === key)) continue;
              const val = data[key];
              if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
                formData.append(key, JSON.stringify(val));
              } else {
                formData.append(key, val);
              }
            }
            payload = formData;
          }

          if (exists) {
            await pb.collection(colName).update(record.id, payload);
          } else {
            await pb.collection(colName).create(payload);
          }
        } catch (err) {
          console.error(`   ❌ Failed to import record ${record.id} in ${colName}:`, err.message);
        }
      }
      console.log(`   ✅ Finished ${colName}.`);
    }

    console.log('\n✨ Data import completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing:', error.message);
    process.exit(1);
  }
}

importAll();
