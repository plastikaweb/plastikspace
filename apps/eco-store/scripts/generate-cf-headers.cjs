#!/usr/bin/env node
'use strict';

const { writeFileSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');

const SECURITY_HEADERS = require('../src/security-headers.json');

const outputPath = join(__dirname, '../../../dist/apps/eco-store/browser/_headers');

mkdirSync(dirname(outputPath), { recursive: true });

const lines = ['/*'];
for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
  lines.push(`  ${key}: ${value}`);
}

writeFileSync(outputPath, lines.join('\n') + '\n');
console.log(`✅ Generated ${outputPath}`);
