import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';
import { getPocketBaseUrl, loadDotEnv } from './load-environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if it exists
loadDotEnv();

// Target environments
const LOCAL_URL = process.env.POCKETBASE_LOCAL_URL || 'http://127.0.0.1:8090';
const STAGING_URL = process.env.POCKETBASE_STAGING_URL;

console.log(`🔧 Target Environment: Local (${LOCAL_URL})`);
if (STAGING_URL) {
  console.log(`🌐 Source for missing files: Staging (${STAGING_URL})`);
}

const LOCAL_ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
const LOCAL_ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

const STAGING_ADMIN_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
const STAGING_ADMIN_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

if (!LOCAL_ADMIN_EMAIL || !LOCAL_ADMIN_PASSWORD) {
  console.error('❌ Error: Missing local PocketBase credentials in .env');
  process.exit(1);
}

const pbLocal = new PocketBase(LOCAL_URL);
const pbStaging = STAGING_URL ? new PocketBase(STAGING_URL) : null;

pbLocal.autoCancellation(false);
if (pbStaging) pbStaging.autoCancellation(false);

/**
 * Main import function
 */
async function importAll() {
  try {
    console.log('🔐 Authenticating with local PocketBase...');
    await pbLocal
      .collection('_superusers')
      .authWithPassword(LOCAL_ADMIN_EMAIL, LOCAL_ADMIN_PASSWORD);
    console.log('✅ Local authentication successful!');

    if (pbStaging && STAGING_ADMIN_EMAIL && STAGING_ADMIN_PASSWORD) {
      console.log('🔐 Authenticating with staging PocketBase (for file pulls)...');
      try {
        await pbStaging
          .collection('_superusers')
          .authWithPassword(STAGING_ADMIN_EMAIL, STAGING_ADMIN_PASSWORD);
        console.log('✅ Staging authentication successful!');
      } catch (e) {
        console.warn(
          '⚠️  Staging authentication failed. Protected files may not be pulled:',
          e.message
        );
      }
    }

    const dataDir = path.join(__dirname, '..', 'pocketbase', 'data');
    const storageDir = path.join(dataDir, 'storage');

    if (!fs.existsSync(dataDir)) {
      console.error(`❌ Data directory not found: ${dataDir}`);
      process.exit(1);
    }

    // Define the order of import to respect relations
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

      // Get collection schema to identify file fields and type
      const collection = await pbLocal.collections.getOne(colName);

      if (collection.type === 'view') {
        console.log(`   ⏭️ Skipping ${colName} (view collection is read-only).`);
        continue;
      }

      const fileFields = collection.fields.filter(f => f.type === 'file');

      for (const record of records) {
        try {
          // Check if record exists locally
          let exists = false;
          try {
            await pbLocal.collection(colName).getOne(record.id);
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
              const fieldValue = record[field.name];
              if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
                continue;
              }

              const fileList = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
              const recordLocalDir = path.join(storageDir, collection.id, record.id);

              for (const fileName of fileList) {
                if (!fileName) continue;
                const localFilePath = path.join(recordLocalDir, fileName);

                if (fs.existsSync(localFilePath)) {
                  const blob = new Blob([fs.readFileSync(localFilePath)]);
                  formData.append(field.name, blob, fileName);
                  hasFiles = true;
                } else if (pbStaging && pbStaging.authStore.isValid) {
                  console.log(`      ⬇️ Missing locally, pulling ${fileName} from staging...`);
                  try {
                    // Use staging file token for protected files
                    const fileUrl = pbStaging.files.getURL(record, fileName, {
                      token: pbStaging.authStore.token,
                    });
                    const response = await fetch(fileUrl);
                    if (response.ok) {
                      const buffer = await response.arrayBuffer();
                      formData.append(field.name, new Blob([buffer]), fileName);
                      hasFiles = true;
                      console.log(`         ✅ Successfully pulled ${fileName}.`);
                    } else {
                      console.error(`         ❌ Failed to pull ${fileName}: ${response.status}`);
                    }
                  } catch (e) {
                    console.error(`         ❌ Error pulling from staging: ${e.message}`);
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
            payload = formData;
          }

          if (exists) {
            await pbLocal.collection(colName).update(record.id, payload);
          } else {
            await pbLocal.collection(colName).create(payload);
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
