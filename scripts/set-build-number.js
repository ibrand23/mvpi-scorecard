#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read current build number
const buildNumberPath = path.join(process.cwd(), 'build-number.txt');
let currentBuild = 1;

if (fs.existsSync(buildNumberPath)) {
  const content = fs.readFileSync(buildNumberPath, 'utf8').trim();
  currentBuild = parseInt(content) || 1;
}

// Increment build number
const newBuild = currentBuild + 1;
fs.writeFileSync(buildNumberPath, newBuild.toString());

// Get commit information
let commitHash = 'unknown';
let commitShort = 'unknown';
let commitDate = new Date().toISOString();

try {
  // Get full commit hash
  commitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  // Get short commit hash (7 characters)
  commitShort = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  // Get commit date
  commitDate = execSync('git log -1 --format=%cI', { encoding: 'utf8' }).trim();
} catch (error) {
  console.log('⚠️  Could not get git commit information, using defaults');
}

// Set environment variables for Next.js build
process.env.NEXT_PUBLIC_BUILD_NUMBER = newBuild.toString();
process.env.NEXT_PUBLIC_BUILD_DATE = new Date().toISOString();
process.env.NEXT_PUBLIC_COMMIT_HASH = commitHash;
process.env.NEXT_PUBLIC_COMMIT_SHORT = commitShort;
process.env.NEXT_PUBLIC_COMMIT_DATE = commitDate;

console.log(`🔢 Build number set to: ${newBuild}`);
console.log(`📝 Commit: ${commitShort} (${commitHash})`);
console.log(`📅 Commit date: ${new Date(commitDate).toLocaleString()}`);
