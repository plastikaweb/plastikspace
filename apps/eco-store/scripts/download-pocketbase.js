const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync, execFileSync } = require('child_process');
const os = require('os');

const PB_VERSION = '0.36.1'; // Use latest stable version
const PB_DIR = path.join(__dirname, '../pocketbase');
const PB_BINARY = path.join(PB_DIR, os.platform() === 'win32' ? 'pocketbase.exe' : 'pocketbase');

/**
 * Downloads a file from a URL, following redirects.
 */
function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, response => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          // Follow redirect
          downloadFile(response.headers.location, dest).then(resolve).catch(reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
          return;
        }

        const file = fs.createWriteStream(dest);
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
        file.on('error', err => {
          fs.unlink(dest, () => {});
          reject(err);
        });
      })
      .on('error', err => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function download() {
  if (fs.existsSync(PB_BINARY)) {
    console.log('✅ PocketBase binary already exists.');
    return;
  }

  if (!fs.existsSync(PB_DIR)) {
    fs.mkdirSync(PB_DIR, { recursive: true });
  }

  const platform = os.platform();
  const arch = os.arch();

  let osName = '';
  let archName = '';

  if (platform === 'darwin') osName = 'darwin';
  else if (platform === 'win32') osName = 'windows';
  else if (platform === 'linux') osName = 'linux';
  else throw new Error(`Unsupported platform: ${platform}`);

  if (arch === 'x64') archName = 'amd64';
  else if (arch === 'arm64') archName = 'arm64';
  else throw new Error(`Unsupported architecture: ${arch}`);

  const zipName = `pocketbase_${PB_VERSION}_${osName}_${archName}.zip`;
  const url = `https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/${zipName}`;
  const zipPath = path.join(PB_DIR, zipName);

  console.log(`🚀 Downloading PocketBase v${PB_VERSION} for ${osName}-${archName}...`);
  console.log(`🔗 URL: ${url}`);

  try {
    await downloadFile(url, zipPath);
  } catch (err) {
    console.error('❌ Download failed:', err.message);
    process.exit(1);
  }

  console.log('📦 Extracting PocketBase...');
  try {
    if (platform === 'win32') {
      execSync(
        `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${PB_DIR}' -Force"`
      );
    } else {
      let extracted = false;

      // 1. Try unzip
      try {
        execFileSync('unzip', ['-o', zipPath, '-d', PB_DIR], { stdio: 'inherit' });
        extracted = true;
      } catch (e) {
        console.log('⚠️  "unzip" not found or failed.');
      }

      // 2. Try python3
      if (!extracted) {
        try {
          console.log('🐍 Trying "python3 -m zipfile"...');
          execFileSync('python3', ['-m', 'zipfile', '-e', zipPath, PB_DIR], { stdio: 'inherit' });
          extracted = true;
        } catch (e) {
          console.log('⚠️  "python3" not found or failed.');
        }
      }

      // 3. Try python (legacy alias)
      if (!extracted) {
        try {
          console.log('🐍 Trying "python -m zipfile"...');
          execFileSync('python', ['-m', 'zipfile', '-e', zipPath, PB_DIR], { stdio: 'inherit' });
          extracted = true;
        } catch (e) {
          console.log('⚠️  "python" not found or failed.');
        }
      }

      // 4. Try tar (some modern versions support zip extraction)
      if (!extracted) {
        try {
          console.log('📦 Trying "tar -xf"...');
          execFileSync('tar', ['-xf', zipPath, '-C', PB_DIR], { stdio: 'inherit' });
          extracted = true;
        } catch (e) {
          console.log('⚠️  "tar" not found or failed.');
        }
      }

      if (!extracted) {
        throw new Error(
          'Could not find a way to extract the ZIP file. Please install "unzip" (e.g., sudo apt install unzip) or extract it manually.'
        );
      }

      execFileSync('chmod', ['+x', PB_BINARY], { stdio: 'inherit' });
    }
    fs.unlinkSync(zipPath);
    console.log('✅ PocketBase installed successfully!');
  } catch (err) {
    console.error('❌ Extraction failed.');
    console.error('Error details:', err.message);
    process.exit(1);
  }
}

download().catch(err => {
  console.error('❌ Error downloading PocketBase:', err.message);
  process.exit(1);
});
