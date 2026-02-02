const fs = require('fs');
const path = require('path');

/**
 * Validates i18n translation keys in Angular templates and TypeScript files.
 * Automatically discovers all apps with i18n directories and validates keys.
 * Supports any combination of languages per app.
 */

// Regex patterns to find translation keys
const PATTERNS = {
  // {{ 'key' | translate }}
  template: /\{\{\s*['"]([^'"]+)['"]\s*\|\s*translate\s*\}\}/g,
  // 'key' | translate in ngIf, ngSwitch, etc.
  templateAttr: /['"]([^'"]+)['"]\s*\|\s*translate/g,
  // this.translateService.instant('key')
  typescript: /(?:translateService|translate)\.instant\(['"]([^'"]+)['"]\)/g,
  // $localize`key`
  localize: /\$localize`([^`]+)`/g,
};

/**
 * Discovers all apps with i18n directories
 * @returns {Object} Map of app names to i18n paths
 */
function discoverI18nApps() {
  const apps = {};
  const appsDir = path.join(process.cwd(), 'apps');

  if (!fs.existsSync(appsDir)) {
    console.warn('⚠️  No apps directory found');
    return apps;
  }

  const appDirs = fs.readdirSync(appsDir);

  appDirs.forEach(appName => {
    const appPath = path.join(appsDir, appName);
    const stat = fs.statSync(appPath);

    if (!stat.isDirectory()) return;

    // Check for common i18n directory patterns
    const i18nPatterns = [
      path.join(appPath, 'public/i18n'),
      path.join(appPath, 'src/assets/i18n'),
      path.join(appPath, 'i18n'),
    ];

    for (const i18nPath of i18nPatterns) {
      if (fs.existsSync(i18nPath)) {
        apps[appName] = i18nPath;
        break;
      }
    }
  });

  return apps;
}

/**
 * Discovers available languages for an app by reading JSON files in i18n directory
 * @param {string} i18nPath - Path to the i18n directory
 * @returns {Object} Map of language codes to file paths and their keys
 */
function discoverLanguages(i18nPath) {
  const languages = {};

  if (!fs.existsSync(i18nPath)) {
    return languages;
  }

  const files = fs.readdirSync(i18nPath);

  files.forEach(file => {
    if (file.endsWith('.json') && !file.startsWith('.')) {
      const langCode = file.replace('.json', '');
      const filePath = path.join(i18nPath, file);
      languages[langCode] = filePath;
    }
  });

  return languages;
}

/**
 * Load all translation keys from a locale file
 * @param {string} filePath - Path to the JSON file
 * @returns {Set} Set of translation keys in dot notation
 */
function loadTranslationKeys(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    return flattenKeys(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
    return new Set();
  }
}

/**
 * Flatten nested JSON keys into dot-notation
 * @param {Object} obj - Object to flatten
 * @param {string} prefix - Current prefix for nested keys
 * @returns {Set} Set of flattened keys
 */
function flattenKeys(obj, prefix = '') {
  const keys = new Set();

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenKeys(value, fullKey).forEach(k => keys.add(k));
    } else {
      keys.add(fullKey);
    }
  }

  return keys;
}

/**
 * Extract translation keys from a file
 * @param {string} filePath - Path to the file to check
 * @returns {Set} Set of translation keys used in the file
 */
function extractKeysFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const keys = new Set();

    const isTemplate = filePath.endsWith('.html');
    const isTypeScript = filePath.endsWith('.ts');

    if (isTemplate) {
      // Remove HTML comments
      const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');

      let match;
      while ((match = PATTERNS.template.exec(cleanContent)) !== null) {
        keys.add(match[1]);
      }

      PATTERNS.template.lastIndex = 0;
      while ((match = PATTERNS.templateAttr.exec(cleanContent)) !== null) {
        keys.add(match[1]);
      }
      PATTERNS.templateAttr.lastIndex = 0;
    }

    if (isTypeScript) {
      let match;
      while ((match = PATTERNS.typescript.exec(content)) !== null) {
        keys.add(match[1]);
      }
      PATTERNS.typescript.lastIndex = 0;

      while ((match = PATTERNS.localize.exec(content)) !== null) {
        keys.add(match[1]);
      }
      PATTERNS.localize.lastIndex = 0;
    }

    return keys;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return new Set();
  }
}

/**
 * Walk directory and find all template/ts files
 * @param {string} dir - Directory to scan
 * @param {Function} callback - Callback function for each file
 */
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (
        !filePath.includes('node_modules') &&
        !filePath.includes('dist') &&
        !filePath.includes('.nx')
      ) {
        walkDir(filePath, callback);
      }
    } else if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
      callback(filePath);
    }
  });
}

/**
 * Get directories to scan for a given app
 * @param {string} app - App name
 * @returns {Array} Array of directories to scan
 */
function getAppSourceDirectories(app) {
  const directories = [];

  // Check app directory
  const appPath = path.join(process.cwd(), `apps/${app}`);
  if (fs.existsSync(appPath)) {
    directories.push(appPath);
  }

  // Check if this is a shared library (for eco-store libs)
  const libPath = path.join(process.cwd(), `libs/${app}`);
  if (fs.existsSync(libPath)) {
    directories.push(libPath);
  }

  // For eco-store specifically, also check eco-store libs
  if (app === 'eco-store') {
    const ecoStoreLibPath = path.join(process.cwd(), 'libs/eco-store');
    if (fs.existsSync(ecoStoreLibPath) && !directories.includes(ecoStoreLibPath)) {
      directories.push(ecoStoreLibPath);
    }
  }

  return directories;
}

/**
 * Validate i18n keys for all discovered apps
 */
function validateI18nKeys() {
  const i18nApps = discoverI18nApps();
  const allErrors = [];

  if (Object.keys(i18nApps).length === 0) {
    console.warn('⚠️  No apps with i18n directories found');
    process.exit(0);
  }

  console.log(`\n🔍 Found ${Object.keys(i18nApps).length} app(s) with translations:\n`);

  for (const [app, i18nPath] of Object.entries(i18nApps)) {
    console.log(`📦 Validating ${app}`);
    console.log(`   i18n path: ${i18nPath}`);

    // Discover languages for this app
    const languages = discoverLanguages(i18nPath);
    const langCodes = Object.keys(languages);

    if (langCodes.length === 0) {
      console.warn(`   ⚠️  No translation files found`);
      continue;
    }

    console.log(`   Languages: ${langCodes.join(', ')}`);

    // Load keys from source language (first language found, usually 'en')
    const sourceLanguage = langCodes.includes('en') ? 'en' : langCodes[0];
    const sourceKeyPath = languages[sourceLanguage];
    const validKeys = loadTranslationKeys(sourceKeyPath);

    if (validKeys.size === 0) {
      console.warn(`   ⚠️  No translation keys found in ${sourceLanguage}.json`);
      continue;
    }

    console.log(`   ✓ Loaded ${validKeys.size} keys from ${sourceLanguage}.json`);

    // Find all source directories for this app
    const sourceDirs = getAppSourceDirectories(app);

    if (sourceDirs.length === 0) {
      console.warn(`   ⚠️  No source directories found for app`);
      continue;
    }

    // Collect all files to check
    const filesToCheck = [];
    sourceDirs.forEach(dir => {
      walkDir(dir, filePath => filesToCheck.push(filePath));
    });

    console.log(`   ✓ Found ${filesToCheck.length} files to check`);

    // Check each file
    filesToCheck.forEach(filePath => {
      const usedKeys = extractKeysFromFile(filePath);

      usedKeys.forEach(key => {
        if (!validKeys.has(key)) {
          allErrors.push({
            app,
            file: filePath,
            key,
            sourceLanguage,
          });
        }
      });
    });

    console.log(`   ✅ ${app} validation complete\n`);
  }

  // Report results
  if (allErrors.length === 0) {
    console.log('✅ All translation keys are valid in all apps!\n');
    process.exit(0);
  }

  // Group errors by app
  const errorsByApp = {};
  allErrors.forEach(error => {
    if (!errorsByApp[error.app]) {
      errorsByApp[error.app] = [];
    }
    errorsByApp[error.app].push(error);
  });

  console.error(`\n❌ Found ${allErrors.length} missing translation key(s):\n`);

  for (const [app, errors] of Object.entries(errorsByApp)) {
    console.error(`📦 ${app}:\n`);

    // Group by file
    const errorsByFile = {};
    errors.forEach(error => {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = [];
      }
      errorsByFile[error.file].push(error.key);
    });

    for (const [file, keys] of Object.entries(errorsByFile)) {
      const relativePath = path.relative(process.cwd(), file);
      console.error(`  ${relativePath}`);
      keys.forEach(key => {
        console.error(`    Missing key: "${key}"`);
      });
      console.error('');
    }
  }

  process.exit(1);
}

// Run validation
validateI18nKeys();
