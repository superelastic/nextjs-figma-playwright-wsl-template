/**
 * Direct Playwright Screenshot Example
 * Use this when MCP Playwright is not connected
 */

const { chromium } = require('@playwright/test');

async function takeScreenshot(url = 'http://localhost:3000', outputPath = 'screenshot.png') {
  console.log(`Taking screenshot of ${url}...`);
  
  // Launch browser with WSL-optimized settings
  const browser = await chromium.launch({
    channel: 'chrome',    // Use system Chrome in WSL
    headless: true,       // Headless is more reliable in WSL
    args: [
      '--no-sandbox',   // Required for some WSL setups
      '--disable-setuid-sandbox'
    ]
  });
  
  const page = await browser.newPage();
  
  try {
    // Navigate to page
    await page.goto(url, { 
      waitUntil: 'networkidle',  // Wait for network to be idle
      timeout: 30000             // 30 second timeout
    });
    
    // Wait for dynamic content (e.g., charts)
    await page.waitForSelector('.recharts-responsive-container', {
      timeout: 10000
    });
    
    // Additional wait for animations to complete
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: outputPath,
      fullPage: true,
      animations: 'disabled'  // Disable animations for consistent screenshots
    });
    
    console.log(`Screenshot saved to ${outputPath}`);
    
    // Optional: Get page metrics
    const metrics = await page.evaluate(() => ({
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
      deviceScaleFactor: window.devicePixelRatio
    }));
    
    console.log('Page metrics:', metrics);
    
  } catch (error) {
    console.error('Error taking screenshot:', error);
    
    // Take error screenshot for debugging
    await page.screenshot({ 
      path: `error-${outputPath}`,
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

// Handle different port scenarios
async function findAndScreenshot() {
  const ports = [3000, 3001, 3002];
  
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}`);
      if (response.ok) {
        console.log(`Found server on port ${port}`);
        await takeScreenshot(`http://localhost:${port}`, `dashboard-port-${port}.png`);
        break;
      }
    } catch (e) {
      console.log(`Port ${port} not available`);
    }
  }
}

// Run if called directly
if (require.main === module) {
  // Check if URL provided as argument
  const url = process.argv[2];
  const output = process.argv[3] || 'screenshot.png';
  
  if (url) {
    takeScreenshot(url, output);
  } else {
    // Try to find running server
    findAndScreenshot();
  }
}

module.exports = { takeScreenshot, findAndScreenshot };