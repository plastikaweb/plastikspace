import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
import { fileURLToPath } from 'url';
import { getPocketBaseUrl, loadDotEnv } from './load-environment.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if it exists
loadDotEnv();

// Read environment from arguments or use 'staging' by default
const ENV_NAME = process.env.POCKETBASE_ENV || 'development';
const POCKETBASE_URL = getPocketBaseUrl(ENV_NAME);

console.log(`🔧 Using environment: ${ENV_NAME}`);
console.log(`🌐 PocketBase URL: ${POCKETBASE_URL}`);

// Credentials depend on the environment
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

// Disable auto-cancellation for export tasks
pb.autoCancellation(false);

/**
 * Downloads a file from PocketBase and saves it locally.
 */
async function downloadFile(record, fileName, destinationFolder) {
  try {
    // For protected files, we need to pass the admin token
    const url = pb.files.getURL(record, fileName, { token: pb.authStore.token });
    const response = await fetch(url);
    if (!response.ok) {
      console.error(
        `      ❌ Failed to fetch ${fileName}: ${response.status} ${response.statusText}`
      );
      return false;
    }
    const buffer = await response.arrayBuffer();
    fs.mkdirSync(destinationFolder, { recursive: true });
    fs.writeFileSync(path.join(destinationFolder, fileName), Buffer.from(buffer));
    return true;
  } catch (error) {
    console.error(`      ⚠️ Error downloading file ${fileName}:`, error.message);
    return false;
  }
}

/**
 * Exports the PocketBase schema, data, and files.
 */
async function exportAll() {
  try {
    console.log('🔐 Authenticating with PocketBase...');

    // authenticate as superuser
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log('✅ Authenticated successfully!');
    console.log('   Token valid:', pb.authStore.isValid);
    // Use isSuperuser property from AuthStore (available in v0.23+)
    console.log('   Is Superuser:', !!pb.authStore.isSuperuser);

    console.log('🔍 Fetching collections...');

    // get all collections
    const collections = await pb.collections.getFullList({
      sort: 'created',
    });

    console.log(`📦 Found ${collections.length} collections`);

    // 1. Export Schema
    const schema = collections.map(col => ({
      id: col.id,
      name: col.name,
      type: col.type,
      system: col.system,
      fields: col.fields,
      indexes: col.indexes || [],
      listRule: col.listRule,
      viewRule: col.viewRule,
      createRule: col.createRule,
      updateRule: col.updateRule,
      deleteRule: col.deleteRule,
      options: col.options,
      viewQuery: col.viewQuery,
      authRule: col.authRule,
      manageRule: col.manageRule,
      authAlert: col.authAlert,
      oauth2: col.oauth2,
      passwordAuth: col.passwordAuth,
      mfa: col.mfa,
      otp: col.otp,
      authToken: col.authToken,
      passwordResetToken: col.passwordResetToken,
      emailChangeToken: col.emailChangeToken,
      verificationToken: col.verificationToken,
      fileToken: col.fileToken,
      verificationTemplate: col.verificationTemplate,
      resetPasswordTemplate: col.resetPasswordTemplate,
      confirmEmailChangeTemplate: col.confirmEmailChangeTemplate,
    }));

    const schemaPath = path.join(__dirname, '..', 'pocketbase', 'pb_schema.json');
    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
    console.log(`✅ Schema exported to ${path.relative(process.cwd(), schemaPath)}`);

    // 2. Export Data and Files
    console.log('\n🚀 Starting Data and Files export...');
    const dataDir = path.join(__dirname, '..', 'pocketbase', 'data');
    const storageDir = path.join(dataDir, 'storage');

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    for (const col of collections) {
      if (col.name.startsWith('_') && col.name !== '_superusers') {
        console.log(`⏭️  Skipping system collection data: ${col.name}`);
        continue;
      }

      console.log(`📦 Exporting records for: ${col.name}...`);
      try {
        const records = await pb.collection(col.name).getFullList();
        console.log(`   Found ${records.length} records.`);

        // Save records JSON
        const colDataPath = path.join(dataDir, `${col.name}.json`);
        fs.writeFileSync(colDataPath, JSON.stringify(records, null, 2));

        // Handle files
        const fileFields = col.fields.filter(f => f.type === 'file');
        if (fileFields.length > 0 && records.length > 0) {
          console.log(
            `   🖼️  Detected file fields: ${fileFields.map(f => f.name).join(', ')}. Checking records...`
          );
          let fileCount = 0;
          for (const record of records) {
            for (const field of fileFields) {
              const fieldValue = record[field.name];
              if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
                continue;
              }

              const fileList = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
              const recordStorageDir = path.join(storageDir, col.id, record.id);

              for (const fileName of fileList) {
                if (!fileName) continue;
                console.log(`      ⬇️ Downloading ${fileName} from ${col.name} (${record.id})...`);
                const success = await downloadFile(record, fileName, recordStorageDir);
                if (success) fileCount++;
              }
            }
          }
          console.log(`   ✅ Downloaded ${fileCount} files for ${col.name}.`);
        }
      } catch (err) {
        console.error(`   ❌ Error exporting collection ${col.name}:`, err.message);
      }
    }

    console.log(
      `\n✨ Export completed successfully! Data saved in ${path.relative(process.cwd(), dataDir)}`
    );

    pb.authStore.clear();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting:', error.message);
    if (error.response) {
      console.error('   Response:', JSON.stringify(error.response, null, 2));
    }
    pb.authStore.clear();
    process.exit(1);
  }
}

exportAll();
