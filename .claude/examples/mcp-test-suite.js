/**
 * MCP Server Test Suite
 * Use this to verify MCP server connectivity and functionality
 */

// Test MCP Playwright Connection
async function testPlaywrightMCP() {
  console.log('Testing MCP Playwright Server...\n');
  
  try {
    // This would be called in Claude Code context
    // await mcp__playwright__browser_navigate({ url: 'http://localhost:3000' });
    console.log('❌ MCP Playwright not available in standalone script');
    console.log('   Use this test within Claude Code session\n');
  } catch (error) {
    console.log('❌ MCP Playwright connection failed:', error.message);
    console.log('   Fallback: Use direct Playwright API\n');
  }
}

// Test Direct Playwright
async function testDirectPlaywright() {
  console.log('Testing Direct Playwright...\n');
  
  try {
    const { chromium } = require('@playwright/test');
    
    // Test browser launch
    console.log('1. Testing browser launch...');
    const browser = await chromium.launch({
      channel: 'chrome',
      headless: true
    });
    console.log('✅ Browser launched successfully');
    
    // Test page creation
    console.log('2. Testing page creation...');
    const page = await browser.newPage();
    console.log('✅ Page created successfully');
    
    // Test navigation
    console.log('3. Testing navigation...');
    await page.goto('https://example.com');
    console.log('✅ Navigation successful');
    
    // Test screenshot
    console.log('4. Testing screenshot...');
    await page.screenshot({ path: 'test-screenshot.png' });
    console.log('✅ Screenshot saved');
    
    await browser.close();
    console.log('\n✅ All Playwright tests passed!\n');
    
  } catch (error) {
    console.log('❌ Playwright test failed:', error.message);
    console.log('   Run: npx playwright install chromium\n');
  }
}

// Test Figma MCP (mock since it requires Claude Code context)
function testFigmaMCP() {
  console.log('Testing MCP Figma Server...\n');
  
  // This would be the actual call in Claude Code
  const mockFigmaCall = `
    const image = await mcp__figma-dev-mode-mcp-server__get_image({
      nodeId: "22-21",
      clientFrameworks: "react,next.js",
      clientLanguages: "javascript,typescript,html,css"
    });
    
    const code = await mcp__figma-dev-mode-mcp-server__get_code({
      nodeId: "22-21",
      clientFrameworks: "react,next.js",
      clientLanguages: "javascript,typescript,html,css"
    });
  `;
  
  console.log('Example Figma MCP calls:');
  console.log(mockFigmaCall);
  console.log('\n❓ Figma MCP can only be tested within Claude Code session\n');
}

// Test WSL Environment
async function testWSLEnvironment() {
  console.log('Testing WSL Environment...\n');
  
  const { execSync } = require('child_process');
  
  // Test display
  try {
    const display = process.env.DISPLAY;
    console.log(`1. Display variable: ${display || 'NOT SET'}`);
    if (display) {
      console.log('✅ Display configured');
    } else {
      console.log('❌ Display not set. Run: export DISPLAY=:0');
    }
  } catch (error) {
    console.log('❌ Display check failed');
  }
  
  // Test WSLg
  try {
    console.log('\n2. WSLg check...');
    execSync('ls /mnt/wslg/ > /dev/null 2>&1');
    console.log('✅ WSLg available');
  } catch (error) {
    console.log('❌ WSLg not available');
  }
  
  // Test Chrome installation
  try {
    console.log('\n3. Chrome installation...');
    const chromeVersion = execSync('google-chrome --version 2>/dev/null').toString().trim();
    console.log(`✅ ${chromeVersion}`);
  } catch (error) {
    console.log('❌ Chrome not installed');
    console.log('   Install with: sudo apt install google-chrome-stable');
  }
  
  // Test X11
  try {
    console.log('\n4. X11 socket...');
    execSync('ls /tmp/.X11-unix/X0 > /dev/null 2>&1');
    console.log('✅ X11 socket available');
  } catch (error) {
    console.log('❌ X11 socket not found');
  }
  
  console.log('\n');
}

// Port availability checker
async function checkPorts() {
  console.log('Checking common development ports...\n');
  
  const net = require('net');
  const ports = [3000, 3001, 3002, 8080, 8000];
  
  for (const port of ports) {
    const available = await new Promise(resolve => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.once('listening', () => {
        server.close();
        resolve(true);
      });
      server.listen(port);
    });
    
    console.log(`Port ${port}: ${available ? '✅ Available' : '❌ In use'}`);
  }
  
  console.log('\n');
}

// Configuration validator
function validateConfigurations() {
  console.log('Validating configurations...\n');
  
  const fs = require('fs');
  const path = require('path');
  
  // Check playwright.config.ts
  const playwrightConfig = path.join(process.cwd(), 'playwright.config.ts');
  if (fs.existsSync(playwrightConfig)) {
    console.log('✅ playwright.config.ts found');
  } else {
    console.log('❌ playwright.config.ts missing');
  }
  
  // Check package.json scripts
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['test', 'dev'];
    
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        console.log(`✅ Script "${script}" configured`);
      } else {
        console.log(`❌ Script "${script}" missing`);
      }
    });
  } catch (error) {
    console.log('❌ Could not read package.json');
  }
  
  console.log('\n');
}

// Main test runner
async function runAllTests() {
  console.log('='.repeat(50));
  console.log('MCP Server Environment Test Suite');
  console.log('='.repeat(50));
  console.log('\n');
  
  await testWSLEnvironment();
  await checkPorts();
  validateConfigurations();
  await testDirectPlaywright();
  testFigmaMCP();
  testPlaywrightMCP();
  
  console.log('='.repeat(50));
  console.log('Test suite complete!');
  console.log('='.repeat(50));
}

// Export for use in other scripts
module.exports = {
  testPlaywrightMCP,
  testDirectPlaywright,
  testFigmaMCP,
  testWSLEnvironment,
  checkPorts,
  validateConfigurations
};

// Run if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}