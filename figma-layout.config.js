/**
 * Figma Layout Comparison Configuration
 * 
 * This file configures the automated layout comparison tool for your project.
 * Update these values to match your specific Figma design and application setup.
 * 
 * @see https://github.com/superelastic/nextjs-figma-playwright-wsl-template
 */

module.exports = {
  // Figma Configuration
  figmaNodeId: "REPLACE_WITH_YOUR_NODE_ID", // Extract from your Figma URL: node-id=1-2 becomes "1:2"
  
  // Application Configuration  
  playwrightUrl: "http://localhost:3000", // Your local development URL
  elementSelector: ".chart-panel", // CSS selector for elements to compare (update as needed)
  
  // Layout Expectations
  expectedPattern: "2x2-grid", // Expected layout pattern - see docs for options
  tolerance: 0.1, // Tolerance for positioning differences (0.0-1.0)
  
  // Debug Options
  debug: false, // Set to true for detailed debugging information
  
  // Viewport Configuration (optional)
  viewport: {
    width: 1440,
    height: 900
  },
  
  // Timeout Configuration (optional)
  timeout: 10000, // Timeout in milliseconds for element detection
};

/**
 * SETUP INSTRUCTIONS:
 * 
 * 1. Update figmaNodeId with your Figma design node ID
 *    - From URL: https://figma.com/design/ABC123/design?node-id=22-21
 *    - Extract: "22:21" (replace hyphens with colons)
 * 
 * 2. Update elementSelector to match your CSS classes
 *    - Common selectors: ".chart-panel", ".ds-panel", ".card", ".widget"
 * 
 * 3. Set expectedPattern based on your design:
 *    - "2x2-grid": Four elements in 2 columns, 2 rows
 *    - "1x4-vertical": Four elements stacked vertically  
 *    - "4x1-horizontal": Four elements in single row
 *    - "scattered": Custom positioning
 * 
 * 4. Test with: npm run verify-layout
 * 
 * COMMON PATTERNS:
 * - Dashboard layouts: "2x2-grid"
 * - Mobile layouts: "1x4-vertical"
 * - Toolbar layouts: "4x1-horizontal"
 * - Landing pages: "scattered"
 */