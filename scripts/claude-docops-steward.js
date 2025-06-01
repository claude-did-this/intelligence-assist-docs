#!/usr/bin/env node

/**
 * Claude Code DocOps Steward
 * 
 * An intelligent AI-powered documentation steward that uses Claude Code
 * to autonomously maintain, improve, and monitor documentation quality.
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class ClaudeDocOpsTeward {
  constructor(options = {}) {
    this.claudeHubPath = options.claudeHubPath || path.resolve(__dirname, '../../claude-hub');
    this.docsPath = options.docsPath || path.resolve(__dirname, '../docs-claude-hub');
    this.syncScript = options.syncScript || path.resolve(__dirname, './sync-claude-hub-docs.js');
    this.reportPath = options.reportPath || path.resolve(__dirname, '../docops-steward-report.md');
  }

  /**
   * Execute Claude Code command and return structured output
   */
  async executeClaude(prompt, options = {}) {
    try {
      console.log(`🔧 Executing Claude analysis: ${options.analysis || 'General'}`);
      
      const claudeCmd = [
        'claude',
        '--dangerously-skip-permissions',
        '--print',
        ...(options.systemPrompt ? ['--append-system-prompt', `"${options.systemPrompt.replace(/"/g, '\\"')}"`] : []),
        `"${prompt.replace(/"/g, '\\"')}"`
      ].join(' ');

      console.log(`📝 Working directory: ${options.workingDir || this.claudeHubPath}`);
      
      const result = execSync(claudeCmd, {
        encoding: 'utf8',
        cwd: options.workingDir || this.claudeHubPath,
        maxBuffer: 1024 * 1024 * 10, // 10MB buffer
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Claude --print outputs plain text
      const content = result.trim();
      
      if (!content) {
        throw new Error('Empty response from Claude');
      }
      
      console.log(`✅ Claude analysis completed (${content.length} characters)`);
      return { content, error: null };
      
    } catch (error) {
      console.error(`❌ Claude execution failed: ${error.message}`);
      if (error.stderr) {
        console.error(`stderr: ${error.stderr}`);
      }
      return { error: error.message, content: `Error: ${error.message}` };
    }
  }

  /**
   * Monitor claude-hub repository for changes
   */
  async monitorSourceChanges() {
    console.log('🔍 Monitoring claude-hub for documentation changes...');
    
    const prompt = `
      Analyze the current state of this repository's documentation:
      1. Check git status for any uncommitted documentation changes
      2. Review recent commits that might affect documentation
      3. Identify any documentation files that need updates
      4. Look for new features that lack documentation
      5. Check for broken internal links or outdated information
      
      Focus specifically on:
      - README.md completeness and accuracy
      - docs/ directory structure and content
      - Missing setup instructions
      - Outdated configuration examples
      - New features without documentation
      
      Provide specific actionable recommendations for documentation improvements.
    `;

    const result = await this.executeClaude(prompt, {
      systemPrompt: 'You are a documentation quality expert. Be specific and actionable in your analysis.',
      workingDir: this.claudeHubPath,
      analysis: 'Source Changes Monitoring'
    });

    return result;
  }

  /**
   * Analyze documentation quality and completeness
   */
  async analyzeDocumentationQuality() {
    console.log('📊 Analyzing documentation quality...');
    
    const prompt = `
      Perform a comprehensive documentation quality audit:
      
      1. **Content Analysis**:
         - Check for outdated information
         - Identify missing prerequisites
         - Verify example code accuracy
         - Review completeness of setup guides
      
      2. **Structure Analysis**:
         - Evaluate information hierarchy
         - Check for logical flow
         - Identify gaps in user journey
         - Review navigation clarity
      
      3. **Technical Accuracy**:
         - Verify command examples
         - Check environment variable references
         - Validate Docker configurations
         - Review API documentation
      
      4. **User Experience**:
         - Assess beginner-friendliness
         - Check for common troubleshooting scenarios
         - Evaluate examples clarity
         - Review error handling guidance
      
      Provide specific recommendations with priority levels (High/Medium/Low).
    `;

    const result = await this.executeClaude(prompt, {
      systemPrompt: 'You are an expert technical writer focused on developer experience. Provide detailed, actionable feedback.',
      workingDir: this.claudeHubPath,
      analysis: 'Documentation Quality Analysis'
    });

    return result;
  }

  /**
   * Check for documentation drift between source and synchronized docs
   */
  async detectDocumentationDrift() {
    console.log('🔄 Detecting documentation drift...');
    
    // First, run sync to get latest status
    try {
      execSync('node ' + this.syncScript, { encoding: 'utf8' });
    } catch (error) {
      console.error('Sync failed:', error.message);
    }

    const prompt = `
      Compare the original documentation in claude-hub with the synchronized documentation:
      
      1. Check for any files that failed to sync
      2. Identify content differences or formatting issues
      3. Look for broken links after synchronization
      4. Verify that all new documentation is being captured
      5. Check if sync mappings are complete and accurate
      
      Also suggest improvements to the sync process:
      - Missing file mappings
      - Better organization structure
      - Enhanced content processing
      - Automated quality checks
      
      Focus on ensuring complete coverage and accuracy of synchronized content.
    `;

    const result = await this.executeClaude(prompt, {
      systemPrompt: 'You are a documentation synchronization expert. Focus on completeness and accuracy.',
      workingDir: this.docsPath,
      analysis: 'Documentation Drift Detection'
    });

    return result;
  }

  /**
   * Generate improvement suggestions for documentation
   */
  async generateImprovementSuggestions() {
    console.log('💡 Generating documentation improvement suggestions...');
    
    const prompt = `
      Based on the current documentation state, generate specific improvement suggestions:
      
      1. **Content Enhancements**:
         - Missing sections or topics
         - Areas needing more detail
         - Examples that could be improved
         - Common user questions not addressed
      
      2. **Structural Improvements**:
         - Better organization proposals
         - Navigation enhancements
         - Cross-referencing opportunities
         - Search optimization
      
      3. **Automation Opportunities**:
         - Processes that could be automated
         - Quality checks that could be implemented
         - Validation scripts that could be added
         - Monitoring improvements
      
      4. **User Experience Enhancements**:
         - Onboarding flow improvements
         - Interactive elements
         - Visual aids or diagrams
         - Quick start optimizations
      
      Prioritize suggestions based on impact and implementation effort.
    `;

    const result = await this.executeClaude(prompt, {
      systemPrompt: 'You are a product manager focused on developer documentation experience. Think strategically about improvements.',
      workingDir: this.claudeHubPath,
      analysis: 'Improvement Suggestions Generation'
    });

    return result;
  }

  /**
   * Implement automatic documentation fixes
   */
  async implementAutomaticFixes() {
    console.log('🔧 Implementing automatic documentation fixes...');
    
    const prompt = `
      Identify and implement safe, automatic fixes for documentation issues:
      
      1. **Safe Automated Fixes**:
         - Fix obvious typos and formatting issues
         - Update date references
         - Standardize code block formatting
         - Fix broken internal links
         - Update version references
      
      2. **Content Validation**:
         - Verify command syntax
         - Check environment variable consistency
         - Validate Docker image references
         - Confirm URL accessibility
      
      3. **Quality Improvements**:
         - Enhance code examples
         - Add missing error handling examples
         - Improve prerequisite clarity
         - Standardize terminology
      
      Only make changes that are clearly beneficial and low-risk.
      Document all changes made for review.
    `;

    const result = await this.executeClaude(prompt, {
      systemPrompt: 'You are a careful documentation maintainer. Only make safe, obvious improvements that clearly add value.',
      workingDir: this.claudeHubPath,
      analysis: 'Automatic Fixes Implementation'
    });

    return result;
  }

  /**
   * Generate comprehensive steward report
   */
  async generateStewardReport(analyses) {
    const timestamp = new Date().toISOString();
    const report = `# Claude Code DocOps Steward Report

Generated: ${timestamp}

## Executive Summary
${analyses.sourceChanges?.content || 'Analysis not completed'}

## Documentation Quality Analysis
${analyses.qualityAnalysis?.content || 'Analysis not completed'}

## Synchronization Status
${analyses.driftDetection?.content || 'Analysis not completed'}

## Improvement Recommendations
${analyses.improvements?.content || 'Analysis not completed'}

## Automated Fixes Applied
${analyses.automaticFixes?.content || 'No automatic fixes applied'}

## Next Actions
Based on this analysis, the following actions are recommended:
1. Review and approve suggested improvements
2. Implement high-priority fixes
3. Update documentation sync mappings if needed
4. Schedule follow-up steward run

---
*Generated by Claude Code DocOps Steward*
`;

    await fs.writeFile(this.reportPath, report);
    console.log(`📋 Steward report generated: ${this.reportPath}`);
  }

  /**
   * Run complete steward analysis cycle
   */
  async runStewardship() {
    console.log('🤖 Claude Code DocOps Steward starting...');
    
    const analyses = {};
    
    try {
      // Run all analyses
      analyses.sourceChanges = await this.monitorSourceChanges();
      analyses.qualityAnalysis = await this.analyzeDocumentationQuality();
      analyses.driftDetection = await this.detectDocumentationDrift();
      analyses.improvements = await this.generateImprovementSuggestions();
      analyses.automaticFixes = await this.implementAutomaticFixes();
      
      // Generate comprehensive report
      await this.generateStewardReport(analyses);
      
      console.log('✅ DocOps stewardship cycle completed successfully');
      return analyses;
      
    } catch (error) {
      console.error('❌ Stewardship cycle failed:', error.message);
      throw error;
    }
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'full';
  
  const steward = new ClaudeDocOpsTeward();
  
  switch (command) {
    case 'monitor':
      await steward.monitorSourceChanges();
      break;
    case 'quality':
      await steward.analyzeDocumentationQuality();
      break;
    case 'drift':
      await steward.detectDocumentationDrift();
      break;
    case 'improve':
      await steward.generateImprovementSuggestions();
      break;
    case 'fix':
      await steward.implementAutomaticFixes();
      break;
    case 'full':
    default:
      await steward.runStewardship();
      break;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = ClaudeDocOpsTeward;