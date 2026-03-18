import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PB_DATA_DIR = resolve(__dirname, '../../apps/eco-store/pocketbase/pb_data');

/**
 * Main setup function for local development.
 */
async function setup() {
  console.info('🚀 Starting local installation and setup...');

  try {
    // 1. Husky install
    console.info('🐶 Installing git hooks (Husky)...');
    execSync('yarn husky-install', { stdio: 'inherit' });

    // 2. Clean all
    console.info('🧹 Cleaning workspace...');
    execSync('yarn clean:all', { stdio: 'inherit' });

    // 3. Install dependencies
    console.info('📦 Installing dependencies...');
    execSync('yarn install --immutable', { stdio: 'inherit' });

    // 4. Download PocketBase (already skips if exists)
    console.info('⬇️ Checking PocketBase binary...');
    execSync('yarn eco-store:pb:download', { stdio: 'inherit' });

    // 5. Initialize PocketBase
    if (!existsSync(PB_DATA_DIR)) {
      console.info('\n⚠️  PocketBase database (pb_data) not found.');
      console.info('🏗️  Initializing database schema...');
      // Run populate with --schema-only to ensure PB is ready but empty
      execSync('yarn eco-store:pb:populate --schema-only', {
        stdio: 'inherit',
      });
    } else {
      console.info('✅ PocketBase database already exists. Skipping initialization.');
    }

    console.info('\n✨ Local setup completed successfully!');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
