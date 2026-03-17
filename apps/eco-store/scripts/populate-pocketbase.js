import { execSync, spawn } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { platform } from 'node:os';
import { existsSync } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PB_DIR = resolve(__dirname, '../pocketbase');
const PB_BINARY = join(PB_DIR, platform() === 'win32' ? 'pocketbase.exe' : 'pocketbase');
const SYNC_SCRIPT = resolve(__dirname, 'sync-pocketbase-schema.js');

/**
 * Initializes and populates the local PocketBase instance with the tracked schema.
 *
 * This script ensures a superuser exists, starts the server temporarily,
 * executes the schema synchronization, and then shuts down the server.
 */
async function populate() {
  console.info('🚀 Starting local PocketBase population...');

  if (!existsSync(PB_BINARY)) {
    console.error('❌ PocketBase binary not found. Please run pb:download first.');
    process.exit(1);
  }

  const email = process.env.POCKETBASE_DEV_ADMIN_EMAIL;
  const password = process.env.POCKETBASE_DEV_ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Missing POCKETBASE_DEV_ADMIN credentials in environment.');
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

    console.info('✅ Local PocketBase populated successfully!');
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

populate();
