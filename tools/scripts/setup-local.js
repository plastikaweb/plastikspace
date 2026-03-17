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

    // 5. Check if PocketBase needs population
    if (!existsSync(PB_DATA_DIR)) {
      console.info('\n⚠️  PocketBase database (pb_data) not found.');
      const answer = await askUser(
        '❓ Do you want to initialize and populate the local database? (y/N): '
      );

      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        console.info('🌱 Populating PocketBase...');
        execSync('yarn pb:populate', { stdio: 'inherit' });
      } else {
        console.info(
          'ℹ️  Skipping PocketBase population. You can run it later using "yarn pb:populate".'
        );
      }
    } else {
      console.info('✅ PocketBase database already exists. Skipping population.');
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
