import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import readline from 'node:readline';

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
    execSync('yarn pb:download', { stdio: 'inherit' });

    // 5. Initialize PocketBase Schema
    if (!existsSync(PB_DATA_DIR)) {
      console.info('\n⚠️  PocketBase database (pb_data) not found. Initializing schema...');
      // Run populate with --schema-only to ensure PB is ready but empty
      execSync('node apps/eco-store/scripts/populate-pocketbase.js --schema-only', {
        stdio: 'inherit',
      });

      console.info('\n🌱 Database initialized with current schema.');
      const answer = await askUser(
        '❓ Do you want to import collections data and files from staging? (y/N): '
      );

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.info('🚀 Pulling data from staging...');
        execSync('yarn pb:seed', { stdio: 'inherit' });
        console.info('📦 Importing local JSON fallback data...');
        execSync('yarn pb:import', { stdio: 'inherit' });
      } else {
        console.info(
          'ℹ️  Skipping data import. You can run it later using "yarn pb:populate" or "yarn pb:seed".'
        );
      }
    } else {
      console.info('✅ PocketBase database already exists. Skipping initialization.');
    }

    console.info('\n✨ Local setup completed successfully!');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

/**
 * Prompts the user for input in the terminal.
 */
function askUser(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve =>
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    })
  );
}

setup();
