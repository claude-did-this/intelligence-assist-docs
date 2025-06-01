#!/usr/bin/env node

/**
 * Documentation Sync Script for Claude Hub
 * 
 * This script synchronizes documentation from the claude-hub project
 * to maintain up-to-date documentation in the intelligence-assist-docs site.
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const CLAUDE_HUB_PATH = path.resolve(__dirname, '../../claude-hub');
const DOCS_TARGET_PATH = path.resolve(__dirname, '../docs-claude-hub');

// Documentation file mappings from claude-hub to docs structure
const DOC_MAPPINGS = {
  // Main documentation files
  'README.md': 'overview.md',
  'CLAUDE.md': null, // Skip - internal guidance file
  
  // Core setup and configuration
  'docs/complete-workflow.md': 'getting-started/complete-workflow.md',
  'docs/container-setup.md': 'getting-started/container-setup.md',
  'docs/setup-container-guide.md': 'getting-started/setup-container-guide.md',
  'docs/claude-authentication-guide.md': 'configuration/authentication.md',
  
  // AWS Configuration
  'docs/aws-authentication-best-practices.md': 'configuration/aws-authentication.md',
  'docs/aws-profile-setup.md': 'configuration/aws-profile-setup.md',
  'docs/aws-profile-quickstart.md': 'configuration/aws-quickstart.md',
  
  // Environment and Docker
  'docs/docker-optimization.md': 'configuration/docker-optimization.md',
  'docs/container-limitations.md': 'configuration/container-limitations.md',
  
  // Features and workflows
  'docs/github-workflow.md': 'features/github-integration.md',
  'docs/pr-review-workflow.md': 'features/pr-reviews.md',
  'docs/workflow.md': 'features/workflows.md',
  
  // API and webhooks
  // Note: webhooks.md already exists, we'll enhance it
  
  // Troubleshooting and maintenance
  'docs/logging-security.md': 'troubleshooting/logging-security.md',
  'docs/credential-security.md': 'troubleshooting/credential-security.md',
  'docs/container-pooling-lessons.md': 'troubleshooting/container-pooling.md',
  
  // Scripts and automation
  'docs/SCRIPTS.md': 'configuration/scripts-reference.md',
  'docs/ci-cd-setup.md': 'configuration/ci-cd-setup.md',
  'docs/pre-commit-setup.md': 'configuration/pre-commit-setup.md',
};

/**
 * Process markdown content to adjust for the documentation site context
 */
function processMarkdownContent(content, sourceFile) {
  let processed = content;
  
  // Update relative links to point to the correct locations
  processed = processed.replace(
    /\]\(\.\/docs\//g, 
    '](../'
  );
  
  // Update links to other documentation files
  processed = processed.replace(
    /\]\(\.\.\/docs\//g,
    '](../'
  );
  
  // Add frontmatter for Docusaurus if not present
  if (!processed.startsWith('---')) {
    const title = extractTitle(processed, sourceFile);
    const frontmatter = `---
title: ${title}
---

`;
    processed = frontmatter + processed;
  }
  
  // Add sync notice
  const syncNotice = `:::info
This documentation is automatically synchronized from the [claude-hub repository](https://github.com/intelligence-assist/claude-hub). 
Last updated: ${new Date().toISOString().split('T')[0]}
:::

`;
  
  // Insert sync notice after frontmatter
  const frontmatterEnd = processed.indexOf('---', 3) + 3;
  processed = processed.slice(0, frontmatterEnd) + '\n\n' + syncNotice + processed.slice(frontmatterEnd);
  
  return processed;
}

/**
 * Extract title from markdown content or generate from filename
 */
function extractTitle(content, filename) {
  // Look for first h1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) {
    return h1Match[1];
  }
  
  // Generate from filename
  const baseName = path.basename(filename, '.md');
  return baseName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Ensure directory exists
 */
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

/**
 * Copy and process a documentation file
 */
async function syncDocFile(sourceFile, targetFile) {
  try {
    const sourcePath = path.join(CLAUDE_HUB_PATH, sourceFile);
    const targetPath = path.join(DOCS_TARGET_PATH, targetFile);
    
    // Check if source file exists
    try {
      await fs.access(sourcePath);
    } catch {
      console.log(`⚠️  Source file not found: ${sourceFile}`);
      return false;
    }
    
    // Ensure target directory exists
    await ensureDir(path.dirname(targetPath));
    
    // Read, process, and write content
    const content = await fs.readFile(sourcePath, 'utf8');
    const processedContent = processMarkdownContent(content, sourceFile);
    
    await fs.writeFile(targetPath, processedContent);
    console.log(`✅ Synced: ${sourceFile} → ${targetFile}`);
    return true;
  } catch (error) {
    console.error(`❌ Error syncing ${sourceFile}:`, error.message);
    return false;
  }
}

/**
 * Get git information about the claude-hub repository
 */
function getGitInfo() {
  try {
    const gitHash = execSync('git rev-parse HEAD', { 
      cwd: CLAUDE_HUB_PATH, 
      encoding: 'utf8' 
    }).trim();
    
    const gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { 
      cwd: CLAUDE_HUB_PATH, 
      encoding: 'utf8' 
    }).trim();
    
    return { hash: gitHash.substring(0, 7), branch: gitBranch };
  } catch {
    return { hash: 'unknown', branch: 'unknown' };
  }
}

/**
 * Generate sync report
 */
async function generateSyncReport(syncResults, gitInfo) {
  const successful = syncResults.filter(r => r.success).length;
  const total = syncResults.length;
  
  const report = `# Documentation Sync Report

Generated: ${new Date().toISOString()}
Claude Hub Repository: ${gitInfo.branch}@${gitInfo.hash}

## Sync Results
- ✅ Successful: ${successful}/${total}
- ❌ Failed: ${total - successful}/${total}

## File Mappings
${syncResults.map(r => 
  `- ${r.success ? '✅' : '❌'} \`${r.source}\` → \`${r.target}\``
).join('\n')}

## Next Steps
${total - successful > 0 ? '⚠️  Review failed syncs and update mappings as needed.' : '🎉 All documentation successfully synchronized!'}
`;

  const reportPath = path.join(__dirname, '../sync-report.md');
  await fs.writeFile(reportPath, report);
  console.log(`📊 Sync report generated: ${reportPath}`);
}

/**
 * Main sync function
 */
async function main() {
  console.log('🔄 Starting claude-hub documentation sync...');
  
  // Check if claude-hub directory exists
  try {
    await fs.access(CLAUDE_HUB_PATH);
  } catch {
    console.error(`❌ Claude Hub directory not found: ${CLAUDE_HUB_PATH}`);
    console.error('Please ensure the claude-hub repository is cloned in the expected location.');
    process.exit(1);
  }
  
  const gitInfo = getGitInfo();
  console.log(`📍 Syncing from claude-hub ${gitInfo.branch}@${gitInfo.hash}`);
  
  // Sync all mapped files
  const syncResults = [];
  
  for (const [source, target] of Object.entries(DOC_MAPPINGS)) {
    if (target === null) {
      console.log(`⏭️  Skipping: ${source}`);
      continue;
    }
    
    const success = await syncDocFile(source, target);
    syncResults.push({ source, target, success });
  }
  
  // Generate sync report
  await generateSyncReport(syncResults, gitInfo);
  
  console.log('✨ Documentation sync completed!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, DOC_MAPPINGS };