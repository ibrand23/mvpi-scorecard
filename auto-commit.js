#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class AutoCommit {
  constructor() {
    this.watchedDir = process.cwd();
    this.gitignore = this.loadGitignore();
    this.isCommitting = false;
    this.pendingChanges = new Set();
    this.debounceTimeout = null;
    this.debounceDelay = 2000; // 2 seconds delay before committing
  }

  loadGitignore() {
    try {
      const gitignorePath = path.join(this.watchedDir, '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        return fs.readFileSync(gitignorePath, 'utf8').split('\n').filter(line => 
          line.trim() && !line.startsWith('#')
        );
      }
    } catch (error) {
      console.log('No .gitignore found or error reading it');
    }
    return [];
  }

  shouldIgnoreFile(filePath) {
    // Ignore node_modules, .git, and other common directories
    const ignorePatterns = [
      'node_modules',
      '.git',
      '.next',
      'dist',
      'build',
      '.env',
      '*.log',
      '.DS_Store',
      'Thumbs.db'
    ];

    const relativePath = path.relative(this.watchedDir, filePath);
    
    return ignorePatterns.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern);
    }) || this.gitignore.some(pattern => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath.includes(pattern);
    });
  }

  incrementBuildNumber() {
    try {
      const buildNumberPath = path.join(this.watchedDir, 'build-number.txt');
      let currentBuild = 1;
      
      if (fs.existsSync(buildNumberPath)) {
        const content = fs.readFileSync(buildNumberPath, 'utf8').trim();
        currentBuild = parseInt(content) || 1;
      }
      
      const newBuild = currentBuild + 1;
      fs.writeFileSync(buildNumberPath, newBuild.toString());
      console.log(`🔢 Incremented build number to ${newBuild}`);
      return newBuild;
    } catch (error) {
      console.error('❌ Error incrementing build number:', error.message);
      return 1;
    }
  }

  async commitChanges() {
    if (this.isCommitting || this.pendingChanges.size === 0) {
      return;
    }

    this.isCommitting = true;
    
    try {
      // Check if there are any changes to commit
      const status = execSync('git status --porcelain', { encoding: 'utf8' });
      
      if (!status.trim()) {
        console.log('No changes to commit');
        this.isCommitting = false;
        return;
      }

      // Increment build number
      const newBuildNumber = this.incrementBuildNumber();

      // Add all changes
      execSync('git add .', { stdio: 'inherit' });

      // Get current commit hash for reference
      let currentCommitHash = 'unknown';
      try {
        currentCommitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
      } catch (error) {
        console.log('Could not get current commit hash');
      }

      // Create commit message with timestamp and changed files
      const timestamp = new Date().toLocaleString();
      const changedFiles = Array.from(this.pendingChanges).join(', ');
      const commitMessage = `Auto-commit: ${timestamp} (Build #${newBuildNumber})\n\nChanged files: ${changedFiles}\nPrevious commit: ${currentCommitHash}`;

      // Commit changes
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });

      // Push to origin
      execSync('git push origin main', { stdio: 'inherit' });

      console.log(`✅ Auto-committed changes at ${timestamp}`);
      console.log(`🔢 Build #${newBuildNumber}`);
      console.log(`📁 Files: ${changedFiles}`);
      
      // Clear pending changes
      this.pendingChanges.clear();

    } catch (error) {
      console.error('❌ Error during auto-commit:', error.message);
    } finally {
      this.isCommitting = false;
    }
  }

  handleFileChange(filePath) {
    if (this.shouldIgnoreFile(filePath)) {
      return;
    }

    const relativePath = path.relative(this.watchedDir, filePath);
    this.pendingChanges.add(relativePath);

    console.log(`📝 File changed: ${relativePath}`);

    // Clear existing timeout
    if (this.debounceTimeout) {
      clearTimeout(this.debounceTimeout);
    }

    // Set new timeout for debounced commit
    this.debounceTimeout = setTimeout(() => {
      this.commitChanges();
    }, this.debounceDelay);
  }

  start() {
    console.log('🚀 Starting auto-commit watcher...');
    console.log(`📁 Watching directory: ${this.watchedDir}`);
    console.log('⏱️  Debounce delay: 2 seconds');
    console.log('🛑 Press Ctrl+C to stop\n');

    // Watch for file changes
    fs.watch(this.watchedDir, { recursive: true }, (eventType, filename) => {
      if (filename && eventType === 'change') {
        const fullPath = path.join(this.watchedDir, filename);
        this.handleFileChange(fullPath);
      }
    });

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping auto-commit watcher...');
      
      // Commit any pending changes before stopping
      if (this.pendingChanges.size > 0) {
        console.log('📝 Committing pending changes...');
        this.commitChanges();
      }
      
      process.exit(0);
    });
  }
}

// Start the auto-commit watcher
const autoCommit = new AutoCommit();
autoCommit.start();
