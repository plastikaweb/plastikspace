import { execSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { platform } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDotEnv } from './load-environment.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PB_DIR = resolve(__dirname, '../pocketbase');
const PB_BINARY = join(PB_DIR, platform() === 'win32' ? 'pocketbase.exe' : 'pocketbase');
const SYNC_SCRIPT = resolve(__dirname, 'sync-pocketbase-schema.js');

// Parse arguments
const args = process.argv.slice(2);
const isSchemaOnly = args.includes('--schema-only');

/**
 * Initializes and populates the local PocketBase instance with the tracked schema.
 *
 * This script ensures a superuser exists, starts the server temporarily,
 * executes the schema synchronization, and then optionally seeds data.
 */
async function populate() {
  console.info(
    `🚀 Starting local PocketBase population (${isSchemaOnly ? 'SCHEMA ONLY' : 'FULL'})...`
  );

  if (!existsSync(PB_BINARY)) {
    console.error('❌ PocketBase binary not found. Please run eco-store:pb:download first.');
    process.exit(1);
  }

  const email = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;
  console.log(email, password);

  if (!email || !password) {
    console.error(
      '❌ Missing POCKETBASE_DEV_ADMIN credentials in environment. \n' +
        'MAKE SURE TO HAVE AN .env FILE IN THE ROOT OF THE PROJECT'
    );
    process.exit(1);
  }

  let pbProcess;

  try {
    // 1. Ensure admin exists (also initializes the DB)
    console.info(`👤 Upserting superuser: ${email}...`);
    execSync(`"${PB_BINARY}" superuser upsert "${email}" "${password}"`, { stdio: 'inherit' });

    // 2. Start PocketBase in background
    console.info('🔌 Starting PocketBase server temporarily...');
    pbProcess = spawn(PB_BINARY, ['serve'], { detached: false, stdio: 'ignore' });

    // 3. Wait for server to be ready
    console.info('⏳ Waiting for API to be ready...');
    await waitForApi();

    // 4. Run existing sync script
    console.info('🔄 Running schema sync...');
    execSync(`node "${SYNC_SCRIPT}"`, {
      stdio: 'inherit',
      env: { ...process.env, POCKETBASE_ENV: 'development' },
    });

    if (!isSchemaOnly) {
      // 5. Run seeding script (staging to local)
      console.info('🌱 Running data seeding from staging...');
      const SEED_SCRIPT = resolve(__dirname, 'seed-local.js');
      try {
        execSync(`node "${SEED_SCRIPT}"`, {
          stdio: 'inherit',
          env: { ...process.env },
        });
      } catch (e) {
        console.warn('⚠️  Seeding from staging failed, continuing with local import...', e.message);
      }

      // 6. Run local data import (JSON files)
      console.info('📦 Running local data import (JSON files)...');
      const IMPORT_SCRIPT = resolve(__dirname, 'import-pocketbase-data.js');
      execSync(`node "${IMPORT_SCRIPT}"`, {
        stdio: 'inherit',
        env: { ...process.env },
      });
    }

    console.info(
      `✅ Local PocketBase ${isSchemaOnly ? 'schema updated' : 'populated'} successfully!`
    );
  } catch (error) {
    console.error('❌ Population failed:', error.message);
    process.exit(1);
  } finally {
    if (pbProcess) {
      console.info('🛑 Stopping temporary PocketBase server...');
      pbProcess.kill();
    }
  }
}

/**
 * Polls the PocketBase health API until it returns a success response.
 */
async function waitForApi(attempts = 15) {
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch('http://127.0.0.1:8090/api/health');
      if (response.ok) return;
    } catch {
      // Ignore and retry
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error('PocketBase API timed out.');
}

loadDotEnv();
populate();
