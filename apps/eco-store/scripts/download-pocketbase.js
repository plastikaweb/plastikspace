const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');
const os = require('os');

const PB_VERSION = '0.36.1'; // Use latest stable version
const PB_DIR = path.join(__dirname, '../pocketbase');
const PB_BINARY = path.join(PB_DIR, os.platform() === 'win32' ? 'pocketbase.exe' : 'pocketbase');

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

  await new Promise((resolve, reject) => {
    const file = fs.createWriteStream(zipPath);
    https
      .get(url, response => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download: ${response.statusCode} ${response.statusMessage}`));
          return;
        }
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      })
      .on('error', err => {
        fs.unlink(zipPath, () => {});
        reject(err);
      });
  });

  console.log('📦 Extracting PocketBase...');
  try {
    if (platform === 'win32') {
      execSync(
        `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${PB_DIR}' -Force"`
      );
    } else {
      execSync(`unzip -o "${zipPath}" -d "${PB_DIR}"`);
      execSync(`chmod +x "${PB_BINARY}"`);
    }
    fs.unlinkSync(zipPath);
    console.log('✅ PocketBase installed successfully!');
  } catch (err) {
    console.error('❌ Extraction failed. Please install "unzip" or extract manually.');
    process.exit(1);
  }
}

download().catch(err => {
  console.error('❌ Error downloading PocketBase:', err.message);
  process.exit(1);
});
