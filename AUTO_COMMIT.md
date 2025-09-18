# Auto-Commit Setup

This project includes an automatic commit system that watches for file changes and automatically commits them to GitHub.

## How to Use

### Option 1: Run Development Server with Auto-Commit (Recommended)
```bash
npm run dev:watch
```
This will start both the Next.js development server and the auto-commit watcher simultaneously.

### Option 2: Run Auto-Commit Separately
```bash
# In one terminal
npm run dev

# In another terminal
npm run auto-commit
```

### Option 3: Manual Commit
```bash
npm run commit:manual
```

## How It Works

- **File Watching**: Monitors all files in the project directory for changes
- **Debouncing**: Waits 2 seconds after the last change before committing (prevents too many commits)
- **Smart Filtering**: Ignores common files like `node_modules`, `.git`, `.next`, etc.
- **Automatic Push**: Commits are automatically pushed to the `main` branch on GitHub
- **Descriptive Messages**: Each commit includes a timestamp and list of changed files

## Commit Messages

Auto-commits will have messages like:
```
Auto-commit: 12/19/2024, 3:45:23 PM

Changed files: src/components/InspectionViewer.tsx, src/components/InspectionOverview.tsx
```

## Stopping Auto-Commit

Press `Ctrl+C` to stop the auto-commit watcher. Any pending changes will be committed before stopping.

## Configuration

The auto-commit script can be customized by editing `auto-commit.js`:
- Change `debounceDelay` to adjust the wait time before committing
- Modify `shouldIgnoreFile()` to change which files are ignored
- Update the commit message format

## Troubleshooting

If you encounter issues:
1. Make sure you're authenticated with GitHub (git credentials are set up)
2. Check that the remote repository is correctly configured
3. Ensure you have write permissions to the repository
4. Verify there are no uncommitted changes that might conflict
