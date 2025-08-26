# Troubleshooting Guide

This document covers common issues encountered when working with MCP servers in WSL environments and their solutions.

## ⚠️ CRITICAL: Next.js Routing Issues
**See [next-routing-critical.md](./next-routing-critical.md) for the most common 404 routing problems and solutions.**

## MCP Server Connection Issues

### Issue: "Not connected" Error with Playwright MCP

**Symptoms:**
```
Error: Not connected
```

**Root Cause:**
- MCP Playwright server is a separate service from the npm Playwright package
- WSL environments may have difficulty connecting to the MCP server
- The MCP server browser path (`~/.cache/ms-playwright/mcp-chrome-cd63955/`) is different from standard Playwright

**Solutions:**
1. Use Playwright as a direct dependency instead:
   ```bash
   npm install --save-dev @playwright/test
   npx playwright install chromium
   ```

2. Create a wrapper script for screenshots:
   ```javascript
   const { chromium } = require('@playwright/test');
   
   async function takeScreenshot() {
     const browser = await chromium.launch({
       channel: 'chrome',  // Use system Chrome
       headless: true
     });
     // ... rest of code
   }
   ```

### Issue: Multiple Next.js Port Conflicts

**Symptoms:**
```
⚠ Port 3000 is in use by an unknown process, using available port 3001 instead.
```

**Root Cause:**
- Zombie Node.js processes
- Hot reload not properly cleaning up
- Multiple dev server instances

**Solutions:**
1. Kill all Node processes:
   ```bash
   ps aux | grep node | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true
   ```

2. Check specific port usage:
   ```bash
   lsof -i :3000 | grep LISTEN
   ```

3. Use specific port in package.json:
   ```json
   {
     "scripts": {
       "dev": "next dev --turbopack --port 3002"
     }
   }
   ```

## WSL-Specific Problems

### Issue: Display Not Available

**Symptoms:**
- GUI applications fail to launch
- `Error: no display specified`

**Solutions:**
1. Verify WSLg is installed:
   ```bash
   ls /mnt/wslg/
   # Should show: PulseAudio, X11, runtime-dir, weston.log
   ```

2. Set DISPLAY variable:
   ```bash
   export DISPLAY=:0
   echo "export DISPLAY=:0" >> ~/.bashrc
   ```

3. Check X11 socket:
   ```bash
   ls /tmp/.X11-unix/
   # Should show: X0
   ```

### Issue: Module Resolution Errors

**Symptoms:**
```
Module not found: Can't resolve '@/components/Dashboard'
```

**Root Cause:**
- TypeScript path aliases not matching file structure
- Cached build artifacts
- Hot reload not detecting file changes

**Solutions:**
1. Use relative imports when aliases fail:
   ```javascript
   // Instead of: import Dashboard from '@/components/Dashboard'
   import Dashboard from '../src/components/Dashboard'
   ```

2. Update tsconfig.json paths:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

3. Clear build cache:
   ```bash
   rm -rf .next/
   npm run dev
   ```

### Issue: Playwright Browser Installation Fails

**Symptoms:**
- Browser download timeouts
- Permission errors
- Missing dependencies

**Solutions:**
1. Install with specific browser:
   ```bash
   npx playwright install chromium
   ```

2. Install system dependencies:
   ```bash
   npx playwright install-deps
   ```

3. Use system Chrome as fallback:
   ```javascript
   {
     use: {
       channel: 'chrome'  // Uses /usr/bin/google-chrome
     }
   }
   ```

## Performance Considerations

### Issue: Slow Test Execution in WSL

**Root Cause:**
- WSL2 file system performance
- Cross-filesystem operations (Windows ↔ Linux)

**Solutions:**
1. Keep project files in WSL filesystem:
   ```bash
   # Slower: /mnt/c/Users/...
   # Faster: /home/username/projects/...
   ```

2. Use headless mode for tests:
   ```javascript
   headless: true  // Faster than headed mode
   ```

3. Disable animations in tests:
   ```javascript
   await page.addStyleTag({
     content: `*, *::before, *::after { 
       animation-duration: 0s !important; 
       transition-duration: 0s !important; 
     }`
   });
   ```

### Issue: Memory Leaks with Long-Running Dev Server

**Symptoms:**
- Increasing memory usage
- Slow hot reload
- System becomes unresponsive

**Solutions:**
1. Restart dev server periodically
2. Use production builds for testing:
   ```bash
   npm run build
   npm start
   ```

3. Monitor memory usage:
   ```bash
   ps aux | grep node | awk '{print $2, $4, $11}'
   ```

## Figma MCP Specific Issues

### Issue: Empty or Incorrect Code Generation

**Root Cause:**
- Wrong node ID
- Incompatible framework selection
- Design not properly published

**Solutions:**
1. Verify node ID from Figma URL:
   ```
   https://www.figma.com/design/.../node-id=22-21
   ```

2. Use correct framework parameters:
   ```javascript
   clientFrameworks: "react,next.js",
   clientLanguages: "javascript,typescript,html,css"
   ```

### Issue: Image Generation Fails

**Solutions:**
1. Always call get_image after get_code
2. Check Figma file permissions
3. Ensure design is not in draft mode

## Common Error Messages and Fixes

### "Cannot find module 'lucide-react'"
```bash
npm install lucide-react
```

### "EADDRINUSE: address already in use"
```bash
# Find and kill process using the port
lsof -ti:3000 | xargs kill -9
```

### "Error: Executable doesn't exist at..."
```bash
# Reinstall Playwright browsers
rm -rf ~/.cache/ms-playwright
npx playwright install
```

### "WebSocket connection failed"
- Check if dev server is running
- Verify correct port in Playwright config
- Ensure no firewall blocking localhost

## Debug Commands Cheat Sheet

```bash
# Check running processes
ps aux | grep -E "node|next|chrome"

# Check port usage
netstat -tulpn | grep :300

# Monitor WSL logs
tail -f /mnt/wslg/weston.log

# Clear all caches
rm -rf .next/ node_modules/.cache/

# Test display
xeyes  # Should show eyes following mouse

# Check Playwright installation
ls ~/.cache/ms-playwright/

# Verify Chrome
google-chrome --version
which google-chrome
```

## Prevention Strategies

1. **Always use explicit ports** in configurations
2. **Create health check scripts** for MCP services
3. **Document working configurations** immediately
4. **Use version pinning** for critical dependencies
5. **Test in headless mode first**, then headed if needed
6. **Keep WSL2 and Windows in sync** with updates