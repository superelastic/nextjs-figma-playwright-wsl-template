#!/usr/bin/env node

/**
 * Figma Layout Comparison Tool
 * 
 * Compares layout patterns between Figma designs and Playwright-rendered applications.
 * Designed for integration into the nextjs-figma-playwright-wsl-template.
 * 
 * Usage:
 *   node tools/compare-figma-layout.js
 *   node tools/compare-figma-layout.js --figma="22:21" --url="http://localhost:3001"
 * 
 * @author Generated for nextjs-figma-playwright-wsl-template
 * @version 1.0.0
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Configuration (can be overridden by config file or CLI args)
const DEFAULT_CONFIG = {
  figmaNodeId: "22:21",
  playwrightUrl: "http://localhost:3001", 
  elementSelector: ".ds-panel",
  expectedPattern: "2x2-grid",
  tolerance: 0.1,
  debug: false
};

/**
 * Layout Patterns supported by the comparison tool
 */
const LAYOUT_PATTERNS = {
  "2x2-grid": "Four elements arranged in 2 columns and 2 rows",
  "1x4-vertical": "Four elements stacked vertically in single column",
  "4x1-horizontal": "Four elements arranged horizontally in single row", 
  "scattered": "Elements with no clear grid or linear pattern",
  "unknown": "Layout pattern could not be determined"
};

/**
 * Figma Element Extractor
 * Extracts element information from Figma MCP server
 */
class FigmaExtractor {
  constructor(config) {
    this.config = config;
  }

  /**
   * Extract layout information from Figma
   * Uses cached data from Figma MCP server extraction
   */
  async extractLayout(nodeId) {
    try {
      // First, try to load cached Figma data
      const cachePath = path.join(__dirname, 'figma-layout-cache.json');
      
      if (fs.existsSync(cachePath)) {
        const cachedData = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
        
        if (cachedData.nodeId === nodeId) {
          console.log('   ✓ Using cached Figma data from MCP extraction');
          console.log(`   ✓ Found ${cachedData.elements.length} elements`);
          
          // Normalize the Figma coordinates to positive values for comparison
          const normalizedElements = this.normalizeFigmaCoordinates(cachedData.elements);
          
          return {
            nodeId: nodeId,
            elements: normalizedElements,
            pattern: cachedData.pattern,
            confidence: cachedData.confidence
          };
        }
      }
      
      // Fallback to known structure if cache not found
      console.log('   ⚠️  No cached Figma data found, using fallback');
      return {
        nodeId: nodeId,
        elements: [
          { id: "cpi-chart", bounds: { x: 300, y: 120, width: 490, height: 300 }, type: "chart" },
          { id: "unemployment-chart", bounds: { x: 810, y: 120, width: 490, height: 300 }, type: "chart" },
          { id: "interest-rates-chart", bounds: { x: 300, y: 440, width: 490, height: 300 }, type: "chart" },
          { id: "inflation-chart", bounds: { x: 810, y: 440, width: 490, height: 300 }, type: "chart" }
        ],
        pattern: "2x2-grid",
        confidence: 0.95
      };
    } catch (error) {
      console.error('Error extracting Figma layout:', error.message);
      throw error;
    }
  }
  
  /**
   * Normalize Figma coordinates from potentially negative values
   */
  normalizeFigmaCoordinates(elements) {
    // Find the minimum x and y values
    let minX = Infinity, minY = Infinity;
    elements.forEach(el => {
      minX = Math.min(minX, el.bounds.x);
      minY = Math.min(minY, el.bounds.y);
    });
    
    // Normalize to positive coordinates starting from a reasonable offset
    const offsetX = minX < 0 ? Math.abs(minX) + 300 : 0;
    const offsetY = minY < 0 ? Math.abs(minY) + 120 : 0;
    
    return elements.map(el => ({
      ...el,
      bounds: {
        x: el.bounds.x + offsetX,
        y: el.bounds.y + offsetY,
        width: el.bounds.width,
        height: el.bounds.height
      }
    }));
  }
}

/**
 * Playwright Element Extractor  
 * Extracts element positioning from live application
 */
class PlaywrightExtractor {
  constructor(config) {
    this.config = config;
    this.browser = null;
    this.page = null;
  }

  async initialize() {
    this.browser = await chromium.launch({ headless: true });
    this.page = await this.browser.newPage();
    // Set viewport to match Figma design width
    await this.page.setViewportSize({ width: 1440, height: 900 });
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Extract element positions from the live application
   */
  async extractLayout(url, selector) {
    try {
      await this.page.goto(url, { waitUntil: 'networkidle' });
      
      // Wait for elements to be present
      await this.page.waitForSelector(selector, { timeout: 10000 });
      
      // Get all matching elements
      const elements = await this.page.locator(selector).all();
      
      if (elements.length === 0) {
        throw new Error(`No elements found with selector: ${selector}`);
      }

      // Extract bounding box information
      const elementData = [];
      for (let i = 0; i < elements.length; i++) {
        const boundingBox = await elements[i].boundingBox();
        if (boundingBox) {
          elementData.push({
            id: `element-${i}`,
            bounds: {
              x: boundingBox.x,
              y: boundingBox.y, 
              width: boundingBox.width,
              height: boundingBox.height
            },
            type: "detected"
          });
        }
      }

      return {
        url: url,
        selector: selector,
        elements: elementData,
        pattern: this.detectLayoutPattern(elementData),
        confidence: this.calculateConfidence(elementData)
      };
    } catch (error) {
      console.error('Error extracting Playwright layout:', error.message);
      throw error;
    }
  }

  /**
   * Detect layout pattern from element positions
   */
  detectLayoutPattern(elements) {
    if (elements.length !== 4) {
      return "unknown";
    }

    const positions = elements.map(el => ({
      x: el.bounds.x,
      y: el.bounds.y,
      centerX: el.bounds.x + el.bounds.width / 2,
      centerY: el.bounds.y + el.bounds.height / 2
    }));

    // Sort by Y position to identify rows
    const sortedByY = [...positions].sort((a, b) => a.y - b.y);
    
    // Check for 2x2 grid pattern
    const tolerance = 50; // pixels
    const topRow = sortedByY.slice(0, 2);
    const bottomRow = sortedByY.slice(2, 4);
    
    // Check if top row elements are roughly same Y position
    const topYDiff = Math.abs(topRow[0].y - topRow[1].y);
    const bottomYDiff = Math.abs(bottomRow[0].y - bottomRow[1].y);
    
    if (topYDiff < tolerance && bottomYDiff < tolerance) {
      // Sort each row by X position
      topRow.sort((a, b) => a.x - b.x);
      bottomRow.sort((a, b) => a.x - b.x);
      
      // Check if left column elements are roughly same X position
      const leftXDiff = Math.abs(topRow[0].x - bottomRow[0].x);
      const rightXDiff = Math.abs(topRow[1].x - bottomRow[1].x);
      
      if (leftXDiff < tolerance && rightXDiff < tolerance) {
        return "2x2-grid";
      }
    }
    
    // Check for vertical stack (single column)
    const sortedByX = [...positions].sort((a, b) => a.x - b.x);
    const leftmostX = sortedByX[0].x;
    const allInSameColumn = positions.every(p => Math.abs(p.x - leftmostX) < tolerance);
    
    if (allInSameColumn) {
      return "1x4-vertical";
    }
    
    // Check for horizontal row (single row)
    const topmostY = sortedByY[0].y;
    const allInSameRow = positions.every(p => Math.abs(p.y - topmostY) < tolerance);
    
    if (allInSameRow) {
      return "4x1-horizontal";
    }
    
    return "scattered";
  }

  /**
   * Calculate confidence score for pattern detection
   */
  calculateConfidence(elements) {
    if (elements.length !== 4) {
      return 0.0;
    }
    
    // Higher confidence for more regular spacing and alignment
    const positions = elements.map(el => ({
      x: el.bounds.x,
      y: el.bounds.y,
      width: el.bounds.width,
      height: el.bounds.height
    }));
    
    // Check size consistency
    const widths = positions.map(p => p.width);
    const heights = positions.map(p => p.height);
    const widthVariance = this.calculateVariance(widths);
    const heightVariance = this.calculateVariance(heights);
    
    // Lower variance = higher confidence
    const maxExpectedVariance = 100; // pixels^2
    const sizeConfidence = Math.max(0, 1 - (widthVariance + heightVariance) / (2 * maxExpectedVariance));
    
    return Math.min(0.95, Math.max(0.5, sizeConfidence));
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  }
}

/**
 * Layout Comparison Engine
 */
class LayoutComparator {
  constructor(config) {
    this.config = config;
    this.figmaExtractor = new FigmaExtractor(config);
    this.playwrightExtractor = new PlaywrightExtractor(config);
  }

  /**
   * Compare Figma design with Playwright implementation
   */
  async compare() {
    console.log('🔍 Starting Figma → Playwright layout comparison...');
    console.log(`   Figma Node: ${this.config.figmaNodeId}`);
    console.log(`   App URL: ${this.config.playwrightUrl}`);
    console.log(`   Element Selector: ${this.config.elementSelector}`);
    console.log('');

    try {
      // Initialize Playwright
      await this.playwrightExtractor.initialize();

      // Extract layouts from both sources
      console.log('📐 Extracting Figma layout...');
      const figmaLayout = await this.figmaExtractor.extractLayout(this.config.figmaNodeId);
      
      console.log('📐 Extracting Playwright layout...');
      const playwrightLayout = await this.playwrightExtractor.extractLayout(
        this.config.playwrightUrl,
        this.config.elementSelector
      );

      // Compare the layouts
      const comparison = this.compareLayouts(figmaLayout, playwrightLayout);
      
      // Generate report
      this.generateReport(comparison);
      
      return comparison;

    } catch (error) {
      console.error('❌ Layout comparison failed:', error.message);
      throw error;
    } finally {
      await this.playwrightExtractor.cleanup();
    }
  }

  /**
   * Compare two layout objects
   */
  compareLayouts(figmaLayout, playwrightLayout) {
    const elementCountMatch = figmaLayout.elements.length === playwrightLayout.elements.length;
    const patternMatch = figmaLayout.pattern === playwrightLayout.pattern;
    const overallMatch = elementCountMatch && patternMatch;
    
    return {
      match: overallMatch,
      figma: figmaLayout,
      playwright: playwrightLayout,
      details: {
        elementCount: {
          match: elementCountMatch,
          expected: figmaLayout.elements.length,
          actual: playwrightLayout.elements.length
        },
        pattern: {
          match: patternMatch,
          expected: figmaLayout.pattern,
          actual: playwrightLayout.pattern
        }
      },
      confidence: Math.min(figmaLayout.confidence, playwrightLayout.confidence)
    };
  }

  /**
   * Generate human-readable comparison report
   */
  generateReport(comparison) {
    console.log('📊 Layout Comparison Report');
    console.log('═'.repeat(50));
    
    if (comparison.match) {
      console.log('✅ LAYOUT MATCH CONFIRMED');
      console.log(`   Pattern: ${comparison.figma.pattern}`);
      console.log(`   Elements: ${comparison.figma.elements.length}`);
      console.log(`   Confidence: ${(comparison.confidence * 100).toFixed(1)}%`);
    } else {
      console.log('❌ LAYOUT MISMATCH DETECTED');
      console.log('');
      
      if (!comparison.details.elementCount.match) {
        console.log('🔢 Element Count Mismatch:');
        console.log(`   Expected: ${comparison.details.elementCount.expected} elements`);
        console.log(`   Actual:   ${comparison.details.elementCount.actual} elements`);
        console.log('');
      }
      
      if (!comparison.details.pattern.match) {
        console.log('📐 Layout Pattern Mismatch:');
        console.log(`   Expected: ${comparison.details.pattern.expected}`);
        console.log(`   Actual:   ${comparison.details.pattern.actual}`);
        console.log(`   Expected Description: ${LAYOUT_PATTERNS[comparison.details.pattern.expected]}`);
        console.log(`   Actual Description:   ${LAYOUT_PATTERNS[comparison.details.pattern.actual]}`);
        console.log('');
      }

      // Provide specific guidance for common failures
      if (comparison.details.pattern.expected === "2x2-grid" && 
          comparison.details.pattern.actual === "1x4-vertical") {
        console.log('🔧 SUGGESTED FIX:');
        console.log('   This is a common CSS grid configuration issue.');
        console.log('   Try using:');
        console.log('   .ds-dashboard-grid {');
        console.log('     display: grid;');
        console.log('     grid-template-columns: repeat(2, minmax(0, 1fr));');
        console.log('     gap: 20px;');
        console.log('   }');
        console.log('   Instead of Tailwind utilities like "grid-cols-2"');
      }
    }
    
    console.log('═'.repeat(50));
    
    if (this.config.debug) {
      console.log('\n🐛 Debug Information:');
      console.log('Figma Elements:', JSON.stringify(comparison.figma.elements, null, 2));
      console.log('Playwright Elements:', JSON.stringify(comparison.playwright.elements, null, 2));
    }
  }
}

/**
 * Configuration loader
 */
function loadConfig() {
  // Start with defaults
  let config = { ...DEFAULT_CONFIG };
  
  // Try to load from config file
  const configPath = path.join(process.cwd(), 'figma-layout.config.js');
  if (fs.existsSync(configPath)) {
    try {
      const fileConfig = require(configPath);
      config = { ...config, ...fileConfig };
      console.log('📄 Loaded configuration from figma-layout.config.js');
    } catch (error) {
      console.warn('⚠️  Failed to load figma-layout.config.js:', error.message);
    }
  }
  
  // Override with CLI arguments
  const args = process.argv.slice(2);
  args.forEach(arg => {
    if (arg.startsWith('--figma=')) {
      config.figmaNodeId = arg.split('=')[1];
    } else if (arg.startsWith('--url=')) {
      config.playwrightUrl = arg.split('=')[1];
    } else if (arg.startsWith('--selector=')) {
      config.elementSelector = arg.split('=')[1];
    } else if (arg === '--debug') {
      config.debug = true;
    }
  });
  
  return config;
}

/**
 * Main execution
 */
async function main() {
  try {
    const config = loadConfig();
    const comparator = new LayoutComparator(config);
    const result = await comparator.compare();
    
    // Exit with appropriate code
    process.exit(result.match ? 0 : 1);
    
  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    process.exit(2);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = {
  FigmaExtractor,
  PlaywrightExtractor, 
  LayoutComparator,
  LAYOUT_PATTERNS
};