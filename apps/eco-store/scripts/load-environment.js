#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * load the Angular environment configuration
 * @param {string} envName - environment name ('development', 'staging', 'production')
 * @returns {object} - environment configuration
 */
export function loadEnvironment(envName = 'staging') {
  const envPath = path.join(__dirname, '..', 'src', 'environments', `environment.${envName}.ts`);

  try {
    // read the TypeScript file
    const content = readFileSync(envPath, 'utf-8');

    // extract baseApiUrl with a simple regex
    const baseApiUrlMatch = content.match(/baseApiUrl:\s*['"]([^'"]+)['"]/);

    if (!baseApiUrlMatch) {
      throw new Error(`No baseApiUrl found in ${envPath}`);
    }

    const baseApiUrl = baseApiUrlMatch[1];

    // extract client with a regex
    const clientMatch = content.match(/client:\s*['"]([^'"]+)['"]/);
    const client = clientMatch ? clientMatch[1] : null;

    return {
      baseApiUrl,
      client,
      environment: envName,
    };
  } catch (error) {
    console.error(`❌ Error loading environment '${envName}':`, error.message);
    throw error;
  }
}

/**
 * get PocketBase URL according to the environment
 * @param {string} envName - environment name
 * @returns {string} - PocketBase URL
 */
export function getPocketBaseUrl(envName) {
  const env = loadEnvironment(envName);
  return env.baseApiUrl;
}

/**
 * Manually load environment variables from .env file
 */
export function loadDotEnv() {
  const envPath = path.join(__dirname, '..', '.env');

  if (existsSync(envPath)) {
    try {
      const content = readFileSync(envPath, 'utf-8');
      content.split('\n').forEach(line => {
        // Skip comments and empty lines
        if (!line || line.startsWith('#')) return;

        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const trimmedKey = key.trim();
          let value = valueParts.join('=').trim();

          // Remove quotes if present
          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.substring(1, value.length - 1);
          }

          if (trimmedKey && !process.env[trimmedKey]) {
            process.env[trimmedKey] = value;
          }
        }
      });
    } catch (error) {
      console.warn('⚠️ Could not load .env file:', error.message);
    }
  }
}
