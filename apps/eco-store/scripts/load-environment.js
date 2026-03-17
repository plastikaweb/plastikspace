#!/usr/bin/env node

import { readFileSync } from 'fs';
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
