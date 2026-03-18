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
const ENV_NAME = process.env.POCKETBASE_ENV || 'staging';
const POCKETBASE_URL = getPocketBaseUrl(ENV_NAME);

console.log(`🔧 Using environment: ${ENV_NAME}`);
console.log(`🌐 PocketBase URL: ${POCKETBASE_URL}`);

let ADMIN_EMAIL, ADMIN_PASSWORD;

if (ENV_NAME === 'development') {
  ADMIN_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: Missing DEV credentials.');
    process.exit(1);
  }
  console.log('🔑 Using development credentials (local PocketBase)');
} else {
  ADMIN_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
  ADMIN_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: Missing STAGING credentials.');
    process.exit(1);
  }
  console.log('🔑 Using remote credentials (PocketHost)');
}

const pb = new PocketBase(POCKETBASE_URL);

/**
 * Synchronizes the local PocketBase schema with a remote instance.
 */
async function syncSchema() {
  try {
    console.log('🔐 Authenticating with PocketBase...');
    await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

    console.log('✅ Authenticated successfully!');
    console.log('   Is Superuser:', !!pb.authStore.isSuperuser);

    const schemaPath = path.join(__dirname, '..', 'pocketbase', 'pb_schema.json');
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Schema file not found: ${schemaPath}`);
    }

    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    console.log(`🔄 Syncing ${schema.length} collections...`);

    // --- INITIAL FETCH ---
    let existingCollections = await pb.collections.getFullList();
    let existingMap = new Map(existingCollections.map(col => [col.name, col]));
    let existingMapById = new Map(existingCollections.map(col => [col.id, col]));

    let updated = 0;
    let created = 0;
    let errors = 0;

    const collectionsToSync = schema.filter(col => !col.system);
    const baseCollections = collectionsToSync.filter(col => col.type !== 'view');
    const viewCollections = collectionsToSync.filter(col => col.type === 'view');

    // --- FIRST PASS: CREATE BASE COLLECTIONS (No Relations) ---
    console.log('🔄 First pass: Creating missing base collections...');
    for (const collection of baseCollections) {
      const existingByName = existingMap.get(collection.name);
      const existingById = existingMapById.get(collection.id);

      if (!existingByName && !existingById) {
        try {
          const createData = {
            id: collection.id,
            name: collection.name,
            type: collection.type,
            // Only non-relation fields to avoid circular dependency errors on create
            fields: collection.fields.filter(f => f.type !== 'relation'),
          };

          if (collection.type === 'auth') {
            const authFields = [
              'authRule',
              'manageRule',
              'authAlert',
              'oauth2',
              'passwordAuth',
              'mfa',
              'otp',
              'authToken',
              'passwordResetToken',
              'emailChangeToken',
              'verificationToken',
              'fileToken',
              'verificationTemplate',
              'resetPasswordTemplate',
              'confirmEmailChangeTemplate',
            ];
            authFields.forEach(key => {
              if (collection[key] !== undefined) createData[key] = collection[key];
            });
          }

          await pb.collections.create(createData);
          console.log(`🆕 Created (base): ${collection.name}`);
          created++;
        } catch (error) {
          console.error(`❌ Error creating ${collection.name}:`, error.message);
          errors++;
        }
      } else if (existingById && existingById.name !== collection.name) {
        console.log(`⚠️ Detected rename: ${existingById.name} -> ${collection.name}`);
        await pb.collections.update(existingById.id, { name: collection.name });
        console.log(`✅ Renamed collection: ${existingById.name} -> ${collection.name}`);
      }
    }

    // --- RE-FETCH MAPS ---
    existingCollections = await pb.collections.getFullList();
    existingMap = new Map(existingCollections.map(col => [col.name, col]));

    // --- SECOND PASS: UPDATE BASE COLLECTIONS (Include Relations) ---
    console.log('🔄 Second pass: Updating base collections with full schema...');
    for (const collection of baseCollections) {
      const existing = existingMap.get(collection.name);
      if (!existing) continue;

      try {
        const collectionData = prepareCollectionData(collection, schema, existingMap);
        await pb.collections.update(existing.id, collectionData);
        console.log(`✅ Updated (full): ${collection.name}`);
        updated++;
      } catch (error) {
        console.error(`❌ Error updating ${collection.name}:`, error.message);
        if (error.response?.data)
          console.error('   Details:', JSON.stringify(error.response.data, null, 2));
        errors++;
      }
    }

    // --- THIRD PASS: HANDLE VIEWS (Dependencies should now be met) ---
    console.log('🔄 Third pass: Creating/Updating view collections...');
    // Re-fetch maps again to ensure second pass changes are captured
    existingCollections = await pb.collections.getFullList();
    existingMap = new Map(existingCollections.map(col => [col.name, col]));

    for (const collection of viewCollections) {
      const existing = existingMap.get(collection.name) || existingMapById.get(collection.id);

      try {
        const viewData = {
          id: collection.id,
          name: collection.name,
          type: 'view',
          viewQuery: collection.viewQuery,
          fields: collection.fields,
          listRule: collection.listRule,
          viewRule: collection.viewRule,
        };

        if (existing) {
          await pb.collections.update(existing.id, viewData);
          console.log(`✅ Updated (view): ${collection.name}`);
          updated++;
        } else {
          await pb.collections.create(viewData);
          console.log(`🆕 Created (view): ${collection.name}`);
          created++;
        }
      } catch (error) {
        console.error(`❌ Error with view ${collection.name}:`, error.message);
        if (error.response?.data)
          console.error('   Details:', JSON.stringify(error.response.data, null, 2));
        errors++;
      }
    }

    console.log('\n✅ Schema sync completed!');
    console.log(`   Created: ${created}, Updated: ${updated}, Errors: ${errors}`);
    pb.authStore.clear();
    process.exit(errors > 0 ? 1 : 0);
  } catch (error) {
    console.error('❌ Fatal Error:', error.message);
    process.exit(1);
  }
}

/**
 * Prepares collection data for update, resolving relation IDs.
 */
function prepareCollectionData(collection, schema, existingMap) {
  const data = JSON.parse(JSON.stringify(collection));

  if (data.fields) {
    data.fields.forEach(field => {
      const relationId = field.collectionId || field.options?.collectionId;
      if (field.type === 'relation' && relationId) {
        const targetLocal = schema.find(c => c.id === relationId);
        if (targetLocal) {
          const targetRemote = existingMap.get(targetLocal.name);
          if (targetRemote && relationId !== targetRemote.id) {
            if (field.collectionId) field.collectionId = targetRemote.id;
            if (field.options) field.options.collectionId = targetRemote.id;
          }
        }
      }
    });
  }

  return {
    fields: data.fields,
    indexes: data.indexes,
    listRule: data.listRule,
    viewRule: data.viewRule,
    createRule: data.createRule,
    updateRule: data.updateRule,
    deleteRule: data.deleteRule,
    options: data.options,
    ...(data.type === 'auth'
      ? {
          authRule: data.authRule,
          manageRule: data.manageRule,
          authAlert: data.authAlert,
          oauth2: data.oauth2,
          passwordAuth: data.passwordAuth,
          mfa: data.mfa,
          otp: data.otp,
          authToken: data.authToken,
          passwordResetToken: data.passwordResetToken,
          emailChangeToken: data.emailChangeToken,
          verificationToken: data.verificationToken,
          fileToken: data.fileToken,
          verificationTemplate: data.verificationTemplate,
          resetPasswordTemplate: data.resetPasswordTemplate,
          confirmEmailChangeTemplate: data.confirmEmailChangeTemplate,
        }
      : {}),
  };
}

syncSchema();
