import PocketBase from 'pocketbase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getPocketBaseUrl } from './load-environment.js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env if it exists
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Read environment from arguments or use 'staging' by default
const ENV_NAME = process.env.POCKETBASE_ENV || 'development';
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

async function exportSchema() {
  try {
    console.log('🔐 Authenticating with PocketBase...');

    // authenticate as admin
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log('🔍 Fetching collections...');

    // get all collections
    const collections = await pb.collections.getFullList({
      sort: 'created',
    });

    console.log(`📦 Found ${collections.length} collections`);

    // schema structure similar to pb_schema.json
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
      // PB v0.23+ top-level fields
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

    // save schema
    const schemaPath = path.join(__dirname, '..', 'pocketbase', 'pb_schema.json');
    fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
    fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

    console.log(`✅ Schema exported to ${path.relative(process.cwd(), schemaPath)}`);
    console.log('\nCollections exported:');
    schema.forEach((col, index) => {
      const systemLabel = col.system ? '(system)' : '';
      console.log(`  ${index + 1}. ${col.name} ${systemLabel}`);
    });

    pb.authStore.clear();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error exporting schema:', error.message);
    if (error.response) {
      console.error('   Response:', error.response);
    }
    pb.authStore.clear();
    process.exit(1);
  }
}

exportSchema();
