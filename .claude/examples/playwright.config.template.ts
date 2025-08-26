/**
 * Playwright Configuration Template for WSL Environments
 * Optimized for MCP integration and WSL-specific considerations
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { open: 'never' }],  // Don't auto-open in WSL
    ['list']                       // Console output
  ],
  
  // Shared settings for all projects
  use: {
    // Base URL for all tests
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot only on failure
    screenshot: 'only-on-failure',
    
    // Video only on failure (can be resource intensive in WSL)
    video: process.env.CI ? 'on-first-retry' : 'off',
    
    // WSL-optimized viewport
    viewport: { width: 1280, height: 720 },
    
    // Timeout for each test
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use system Chrome if available (more stable in WSL)
        channel: 'chrome',
        // WSL-specific launch options
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',  // Overcome limited resource problems
            '--disable-gpu',             // Disable GPU hardware acceleration
          ],
        },
      },
    },

    // Optional: Firefox (may require additional setup in WSL)
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        launchOptions: {
          firefoxUserPrefs: {
            // Firefox preferences for better WSL compatibility
            'media.navigator.streams.fake': true,
            'media.navigator.permission.disabled': true,
          },
        },
      },
    },

    // Mobile viewports (useful for responsive testing)
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        channel: 'chrome',
      },
    },
  ],

  // Run your local dev server before starting the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    // WSL-specific: Check if server is ready
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Global setup/teardown
  globalSetup: process.env.CI ? undefined : './tests/global-setup.ts',
  globalTeardown: process.env.CI ? undefined : './tests/global-teardown.ts',

  // Maximum time one test file can run
  timeout: 30 * 1000,

  // Global timeout for the whole test run
  globalTimeout: process.env.CI ? 60 * 60 * 1000 : undefined,

  // Expect options
  expect: {
    // Maximum time expect() should wait for the condition to be met
    timeout: 5000,
    
    // Threshold between 0-1 for screenshot comparison
    toHaveScreenshot: { 
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',  // Important for consistent screenshots
    },
  },

  // Folder for test artifacts such as screenshots, videos, traces
  outputDir: 'test-results/',

  // Path to the global setup files
  snapshotDir: './tests/screenshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-snapshots/{arg}{-projectName}{-snapshotSuffix}{ext}',
});

// Additional configuration for specific environments
export const wslConfig = {
  // WSL-specific environment variables
  env: {
    DISPLAY: ':0',
    // Increase Node memory limit if needed
    NODE_OPTIONS: '--max-old-space-size=4096',
  },
  
  // Recommended browser args for WSL
  browserArgs: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
  ],
};

// Helper configuration for CI environments
export const ciConfig = {
  workers: 1,
  retries: 2,
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
};