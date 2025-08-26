# MCP Server Setup Guide

This guide documents the complete setup process for Playwright and Figma MCP servers in a WSL Ubuntu environment.

## Prerequisites

### System Requirements
- **WSL2** with Ubuntu (tested on WSL 6.6.87.2-microsoft-standard-WSL2)
- **WSLg** enabled for GUI support (check with `ls /mnt/wslg/`)
- **Node.js** 18+ (tested with versions compatible with Next.js 15.5.0)
- **npm** or **yarn** package manager

### WSL Display Configuration
```bash
# Verify display is configured
echo $DISPLAY  # Should output :0

# Check X11 socket exists
ls /tmp/.X11-unix/  # Should show X0
```

## MCP Server Installations

### 1. Figma Dev Mode MCP Server

The Figma MCP server enables direct integration with Figma designs.

#### Installation
```bash
# Figma MCP is typically pre-installed by the Claude Code user, e.g.
claude mcp add --transport http figma-dev-mode-mcp-server http://127.0.0.1:3845/mcp
```

#### Configuration
- No additional configuration required
- Automatically available as `mcp__figma-dev-mode-mcp-server__*` tools
- Requires Figma file URLs with proper node IDs

### 2. Playwright MCP Server

**Important Discovery**: The Playwright MCP server is a separate service from the Playwright npm package. In WSL environments, using Playwright directly as a project dependency is more reliable.

#### Project-Level Playwright Setup
```bash
# Install Playwright as project dependency
npm install --save-dev @playwright/test

# Install Playwright browsers
npx playwright install chromium

# Optional: Install system dependencies
npx playwright install-deps
```

#### MCP Playwright Server (Reference)
- Located at: `~/.cache/ms-playwright/mcp-chrome-cd63955/`
- Was installed at WSL Ubuntu cmdline: 'claude mcp add playwright npx @playwright/mcp@latest'
- Status: Often shows "Not connected" in WSL environments, so next project, try skipping the Playwright MCP and try using direct Playwright API instead

## Configuration Files

### 1. playwright.config.ts
Create in project root:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Use system Chrome if Playwright browsers fail
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2. Package.json Scripts
Add to your package.json:
```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed"
  }
}
```

## Environment Variables

### For Playwright
```bash
# .env.local
PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright
```

### For Display in WSL
```bash
# Add to ~/.bashrc or ~/.zshrc
export DISPLAY=:0
```

## WSL/Windows-Specific Considerations

### 1. Browser Installation Location
- Playwright browsers install to: `~/.cache/ms-playwright/`
- System Chrome (if installed): `/usr/bin/google-chrome`

### 2. GUI Support
- Requires WSLg (Windows Subsystem for Linux GUI)
- Check with: `ls /mnt/wslg/`
- Weston compositor logs: `/mnt/wslg/weston.log`

### 3. Port Conflicts
- Next.js dev server may use alternative ports (3001, 3002, etc.)
- Always check server logs for actual port
- Update Playwright baseURL accordingly

### 4. Headless vs Headed Mode
```javascript
// Recommended for WSL: Use headless mode
const browser = await chromium.launch({
  headless: true,
  channel: 'chrome', // Use system Chrome
});

// For debugging: Use headed mode sparingly
const browser = await chromium.launch({
  headless: false,
  channel: 'chrome',
});
```

## Verification Steps

1. **Check WSL GUI Support**
   ```bash
   ls /mnt/wslg/
   echo $DISPLAY
   ```

2. **Verify Chrome Installation**
   ```bash
   which google-chrome
   google-chrome --version
   ```

3. **Test Playwright**
   ```bash
   npx playwright test --list
   npx playwright test --headed
   ```

4. **Check MCP Tools Availability**
   - In Claude Code, MCP tools appear as `mcp__[server-name]__[tool-name]`
   - Figma tools: `mcp__figma-dev-mode-mcp-server__get_code`, `mcp__figma-dev-mode-mcp-server__get_image`
   - Playwright tools: `mcp__playwright__browser_navigate`, etc.

## Common Installation Commands Summary

```bash
# Full setup sequence
npm install --save-dev @playwright/test
npx playwright install chromium
npx playwright install-deps

# Verify installation
npx playwright --version
ls ~/.cache/ms-playwright/

# Run tests
npm test
```