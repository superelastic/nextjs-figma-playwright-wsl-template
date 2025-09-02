#!/usr/bin/env node

/**
 * Design System Verification Script
 * 
 * This script verifies that the design system is correctly implemented
 * and checks for common anti-patterns that could cause issues.
 * 
 * Run: node verify-styles.js
 * Or add to package.json: "verify-styles": "node verify-styles.js"
 */

const fs = require('fs');
const path = require('path');

const verifyImplementation = () => {
  console.log('\n🔍 Design System Verification Starting...\n');
  
  const checks = {
    cssVariables: false,
    gridClasses: false,
    semanticClasses: false,
    interactiveComponents: false,
    antiPatternTailwind: false,
    antiPatternUtilities: false,
    formValidation: false
  };
  
  const warnings = [];
  const errors = [];
  
  // Check for CSS variables and classes in stylesheets
  const checkStylesheets = () => {
    const stylesDir = './styles';
    const appDir = './app';
    
    // Check design-system.css
    if (fs.existsSync('./styles/design-system.css')) {
      const content = fs.readFileSync('./styles/design-system.css', 'utf8');
      
      // Check for CSS variables
      if (content.includes('--color-bg-primary') || content.includes('--color-primary')) {
        checks.cssVariables = true;
      }
      
      // Check for grid classes
      if (content.includes('.ds-dashboard-grid') || content.includes('.app-grid-2')) {
        checks.gridClasses = true;
      }
      
      // Check for semantic classes
      if (content.includes('.ds-loading-text') || content.includes('.ds-placeholder-text')) {
        checks.semanticClasses = true;
      }
      
      // Check for problematic utility classes
      if (content.includes('.text-text-') || content.includes('.bg-brand-')) {
        warnings.push('Found utility classes (text-text-*, bg-brand-*) that might face compilation issues');
        checks.antiPatternUtilities = true;
      }
    }
    
    // Check globals.css
    if (fs.existsSync('./app/globals.css')) {
      const content = fs.readFileSync('./app/globals.css', 'utf8');
      
      if (content.includes('--color-')) {
        checks.cssVariables = true;
      }
      
      if (content.includes('.ds-dashboard-grid')) {
        checks.gridClasses = true;
      }
    }
  };
  
  // Check for interactive components with proper state management
  const checkComponents = () => {
    const componentsDir = './components';
    
    if (fs.existsSync(componentsDir)) {
      const files = fs.readdirSync(componentsDir).filter(f => 
        f.endsWith('.jsx') || f.endsWith('.tsx')
      );
      
      files.forEach(file => {
        const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
        
        // Check for interactive patterns
        if (content.includes('onClick') && content.includes('useState')) {
          checks.interactiveComponents = true;
        }
        
        // Check for form validation
        if (content.includes('onChange') && (content.includes('validation') || content.includes('isValid'))) {
          checks.formValidation = true;
        }
        
        // Check for Tailwind anti-patterns
        if (content.match(/className=["'][^"']*grid-cols-\d/)) {
          errors.push(`${file}: Uses grid-cols-* Tailwind utilities (will fail compilation)`);
          checks.antiPatternTailwind = true;
        }
        
        if (content.match(/className=["'][^"']*bg-\w+-\d{3}/)) {
          warnings.push(`${file}: May be using Tailwind color utilities`);
        }
      });
    }
  };
  
  // Check example files
  const checkExamples = () => {
    const examplesDir = './examples';
    
    if (fs.existsSync(examplesDir)) {
      const files = fs.readdirSync(examplesDir).filter(f => 
        f.endsWith('.jsx') || f.endsWith('.tsx')
      );
      
      files.forEach(file => {
        const content = fs.readFileSync(path.join(examplesDir, file), 'utf8');
        
        // Check for problematic patterns in examples
        if (content.includes('text-text-')) {
          warnings.push(`${file}: Uses text-text-* utility classes (should use semantic classes)`);
        }
        
        if (content.match(/grid-cols-/)) {
          errors.push(`${file}: Example uses grid-cols-* (anti-pattern)`);
        }
      });
    }
  };
  
  // Run all checks
  checkStylesheets();
  checkComponents();
  checkExamples();
  
  // Report results
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                    VERIFICATION RESULTS                    ');
  console.log('═══════════════════════════════════════════════════════════\n');
  
  console.log('✅ REQUIRED CHECKS:');
  console.log(`   CSS Variables:          ${checks.cssVariables ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`   Grid Classes:           ${checks.gridClasses ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`   Interactive Components: ${checks.interactiveComponents ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`   Semantic Classes:       ${checks.semanticClasses ? '✓ PASS' : '✗ FAIL'}`);
  
  console.log('\n📋 OPTIONAL CHECKS:');
  console.log(`   Form Validation:        ${checks.formValidation ? '✓ FOUND' : '○ NOT FOUND'}`);
  
  console.log('\n🚫 ANTI-PATTERN CHECKS:');
  console.log(`   Tailwind Grid Classes:  ${checks.antiPatternTailwind ? '✗ FOUND (MUST FIX)' : '✓ NONE'}`);
  console.log(`   Utility Classes:        ${checks.antiPatternUtilities ? '⚠ FOUND (REVIEW)' : '✓ NONE'}`);
  
  // Show errors and warnings
  if (errors.length > 0) {
    console.log('\n❌ ERRORS (Must Fix):');
    errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log('\n⚠️  WARNINGS (Should Review):');
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  // Summary
  const requiredPassed = checks.cssVariables && checks.gridClasses && checks.interactiveComponents;
  const hasErrors = checks.antiPatternTailwind || errors.length > 0;
  
  console.log('\n═══════════════════════════════════════════════════════════');
  if (hasErrors) {
    console.log('❌ VERIFICATION FAILED - Critical issues found');
    console.log('   Fix the errors above before proceeding');
    process.exit(1);
  } else if (!requiredPassed) {
    console.log('⚠️  VERIFICATION INCOMPLETE - Missing required elements');
    console.log('   Implement the missing checks above');
    process.exit(1);
  } else if (warnings.length > 0) {
    console.log('✅ VERIFICATION PASSED WITH WARNINGS');
    console.log('   Review warnings for potential improvements');
    process.exit(0);
  } else {
    console.log('✅ VERIFICATION PASSED - All checks successful!');
    console.log('   Your implementation follows design system best practices');
    process.exit(0);
  }
};

// Run verification
verifyImplementation();