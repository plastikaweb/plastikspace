#!/usr/bin/env node
/* eslint-disable no-console */

import PocketBase from 'pocketbase';
import { loadDotEnv } from './load-environment.js';

// Load environment variables
loadDotEnv();

const LOCAL_URL = process.env.POCKETBASE_LOCAL_URL || 'http://127.0.0.1:8090';
const LOCAL_EMAIL = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
const LOCAL_PASSWORD = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

const STAGING_URL = process.env.POCKETBASE_STAGING_URL;
const STAGING_EMAIL = process.env.POCKETBASE_STAGING_ADMIN_EMAIL;
const STAGING_PASSWORD = process.env.POCKETBASE_STAGING_ADMIN_PASSWORD;

if (!STAGING_URL || !STAGING_EMAIL || !STAGING_PASSWORD || !LOCAL_EMAIL || !LOCAL_PASSWORD) {
  console.error('❌ Faltaven credencials de LOCAL o STAGING al .env');
  process.exit(1);
}

const pbLocal = new PocketBase(LOCAL_URL);
const pbStaging = new PocketBase(STAGING_URL);

// Disable auto-cancellation
pbLocal.autoCancellation(false);
pbStaging.autoCancellation(false);

const COLLECTIONS = [
  'tenants',
  'users',
  'products',
  'user_addresses',
  'tenant_addresses',
  'order_cycles',
  'orders',
];

// Map of collections and their file fields
const FILE_FIELDS: Record<string, string[]> = {
  tenants: ['logo'],
  users: ['avatar'],
  products: ['images'],
};

/**
 * @description Helper function to process items in chunks with a maximum concurrency.
 * @param {T[]} items - The items to process.
 * @param {number} chunkSize - The number of concurrent items to process.
 * @param {(item: T) => Promise<void>} processor - The function to process each item.
 * @returns {Promise<void>}
 */
async function processInChunks<T>(
  items: T[],
  chunkSize: number,
  processor: (item: T) => Promise<void>
) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await Promise.all(chunk.map(item => processor(item)));
  }
}

/**
 * @description Sync a single record from local to staging.
 * @param {string} collectionName - The collection name.
 * @param {any} record - The local record.
 * @returns {Promise<void>}
 */
async function syncRecord(collectionName: string, record: any) {
  const id = record.id;
  const fileFields = FILE_FIELDS[collectionName] || [];

  try {
    // Prepare payload using FormData for multipart upload
    const formData = new FormData();

    // Add all fields except file fields and system fields
    for (const key in record) {
      if (['collectionId', 'collectionName', 'created', 'updated', 'expand'].includes(key)) continue;
      if (fileFields.includes(key)) continue;

      const val = record[key];
      if (val !== null && val !== undefined) {
        if (Array.isArray(val) || typeof val === 'object') {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, val.toString());
        }
      }
    }

    // Handle Files: Download from local and append to FormData
    for (const field of fileFields) {
      const filenames = record[field];
      if (!filenames) continue;

      const fileList = Array.isArray(filenames) ? filenames : [filenames];
      for (const filename of fileList) {
        if (!filename) continue;
        try {
          const fileUrl = pbLocal.files.getURL(record, filename);
          const response = await fetch(fileUrl);
          if (response.ok) {
            const blob = await response.blob();
            formData.append(field, blob, filename);
          } else {
            console.warn(`      ⚠️ Error descarregant fitxer local ${filename}: ${response.status}`);
          }
        } catch (fErr) {
          const msg = fErr instanceof Error ? fErr.message : String(fErr);
          console.warn(`      ⚠️ Excepció descarregant fitxer ${filename}:`, msg);
        }
      }
    }

    // Check if exists in staging
    let existsInStaging = false;
    try {
      await pbStaging.collection(collectionName).getOne(id);
      existsInStaging = true;
    } catch {
      // No existeix a staging
    }

    const options = {
      headers: { 'x-bypass-hooks': 'true' },
    };

    if (existsInStaging) {
      console.log(`   🔄 Actualitzant ${id}...`);
      await pbStaging.collection(collectionName).update(id, formData, options);
    } else {
      console.log(`   ➕ Creant ${id}...`);
      if (collectionName === 'users') {
        formData.append('password', 'seed-password-123');
        formData.append('passwordConfirm', 'seed-password-123');
      }
      await pbStaging.collection(collectionName).create(formData, options);
    }
  } catch (err) {
    const pbErr = err as { message: string; response?: { data: Record<string, unknown> } };
    console.error(`   ❌ Error amb el registre ${id}:`, pbErr.message);
    if (pbErr.response?.data) {
      console.error('      Detalls:', JSON.stringify(pbErr.response.data));
    }
  }
}

/**
 * @description Push data from local PocketBase instance to staging.
 * @returns {Promise<void>}
 */
async function pushToStaging() {
  console.log('🚀 Iniciant sincronització AMB FITXERS de LOCAL cap a STAGING...');

  try {
    await pbLocal
      .collection('_superusers')
      .authWithPassword(LOCAL_EMAIL ?? '', LOCAL_PASSWORD ?? '');
    await pbStaging
      .collection('_superusers')
      .authWithPassword(STAGING_EMAIL ?? '', STAGING_PASSWORD ?? '');
    console.log('✅ Autenticat als dos entorns.');

    for (const collectionName of COLLECTIONS) {
      console.log(`\n📦 Processant col·lecció: ${collectionName}...`);

      const localRecords = await pbLocal.collection(collectionName).getFullList({
        sort: 'created',
      });

      console.log(`   Trobats ${localRecords.length} registres locals.`);

      await processInChunks(localRecords, 10, record => syncRecord(collectionName, record));

      console.log(`   ✅ Sincronització de ${collectionName} finalitzada.`);
    }
    console.log('\n✨ Push a STAGING completat! ✨');
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('\n💥 Error crític:', msg);
    process.exit(1);
  }
}

pushToStaging();
