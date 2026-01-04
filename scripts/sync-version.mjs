#!/usr/bin/env node

/**
 * Sync version from package.json to Cargo.toml
 * Run: npm run sync-version
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read package.json version
const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'));
const version = packageJson.version;

console.log(`📦 Syncing version ${version}...`);

// Update Cargo.toml
const cargoPath = join(rootDir, 'src-tauri', 'Cargo.toml');
let cargoContent = readFileSync(cargoPath, 'utf8');

cargoContent = cargoContent.replace(
  /^version = ".*"$/m,
  `version = "${version}"`
);

writeFileSync(cargoPath, cargoContent);

console.log(`✅ Cargo.toml updated to ${version}`);
console.log('🎯 Version sync complete!');
