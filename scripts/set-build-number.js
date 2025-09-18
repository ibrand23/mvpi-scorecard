#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

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

// Set environment variable for Next.js build
process.env.NEXT_PUBLIC_BUILD_NUMBER = newBuild.toString();
process.env.NEXT_PUBLIC_BUILD_DATE = new Date().toISOString();

console.log(`🔢 Build number set to: ${newBuild}`);
