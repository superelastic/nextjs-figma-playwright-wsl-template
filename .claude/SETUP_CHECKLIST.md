# Next.js + Figma + Playwright Setup Checklist

Use this checklist when starting a new project to avoid common issues.

## 🚀 Project Initialization

### Step 1: Clean Environment
- [ ] Kill any zombie Node/Next.js processes
  ```bash
  pkill -f "next-server" 2>/dev/null || true
  ```
- [ ] Check ports 3000-3002 are free
  ```bash
  lsof -i :3000 -i :3001 -i :3002 | grep LISTEN
  ```

### Step 2: Create Next.js Project
- [ ] Use latest Next.js with App Router
  ```bash
  npx create-next-app@latest my-app --typescript --app --tailwind
  ```
- [ ] Verify structure:
  - [ ] `/app` directory at root (NOT under `/src`)
  - [ ] `app/layout.tsx` exists
  - [ ] `app/page.tsx` exists
  - [ ] Only ONE config file (`next.config.js`)

### Step 3: Install Dependencies
- [ ] Core dependencies
  ```bash
  npm install recharts lucide-react
  ```
- [ ] Development dependencies
  ```bash
  npm install --save-dev @playwright/test
  ```
- [ ] Install Playwright browsers
  ```bash
  npx playwright install chromium
  ```

## 🎨 Figma Integration

### Step 1: Verify Figma MCP
- [ ] Check MCP tools are available in Claude Code
- [ ] Test with a simple Figma URL
- [ ] Note: Tools appear as `mcp__figma-dev-mode-mcp-server__*`

### Step 2: Extract Design
- [ ] Get node ID from Figma URL
- [ ] Extract image first (visual reference)
- [ ] Extract code second (structure)
- [ ] Save both outputs for reference

## 🧪 Playwright Setup

### Step 1: Configuration
- [ ] Create `playwright.config.ts`
- [ ] Use system Chrome for WSL:
  ```typescript
  channel: 'chrome'
  ```
- [ ] Set headless mode as default

### Step 2: Verify Installation
- [ ] Run diagnostic:
  ```bash
  node .claude/examples/mcp-test-suite.js
  ```
- [ ] Test screenshot capability:
  ```bash
  node .claude/examples/playwright-screenshot.js
  ```

## ⚠️ Critical Checks

### Before First Run
- [ ] **No duplicate config files**
  ```bash
  ls next.config* | wc -l  # Should be 1
  ```
- [ ] **App directory at root**
  ```bash
  ls app/layout.tsx  # Should exist
  ```
- [ ] **Clean cache**
  ```bash
  rm -rf .next/
  ```

### After Setup
- [ ] Run diagnostic tool:
  ```bash
  node .claude/examples/next-app-setup.js
  ```
- [ ] Start dev server:
  ```bash
  npm run dev
  ```
- [ ] Verify home page loads (not 404)
- [ ] Take test screenshot

## 📁 Recommended Structure

```
project-root/
├── .claude/                # Documentation & examples
│   ├── next-routing-critical.md
│   └── examples/
├── app/                    # Next.js app router (at root!)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── src/                    # Components & utilities
│   ├── components/
│   └── utils/
├── tests/                  # Playwright tests
├── next.config.js          # Single config file
├── playwright.config.ts
├── package.json
└── tsconfig.json
```

## 🔧 Quick Fixes Reference

| Problem | Quick Fix |
|---------|-----------|
| 404 on all pages | Check app location & zombie processes |
| Port in use | `pkill -f "next-server"` |
| Module not found | Check tsconfig paths & relative imports |
| Playwright not connected | Use direct API instead of MCP |
| Duplicate configs | Keep only `next.config.js` |

## 📝 Environment Variables

```bash
# .env.local (if needed)
NEXT_PUBLIC_API_URL=http://localhost:3000

# WSL Display
export DISPLAY=:0  # Add to ~/.bashrc
```

## 🚨 Emergency Reset

If everything breaks:
```bash
# Nuclear option - full reset
pkill -f node
rm -rf .next/ node_modules/ .turbo/
rm next.config.ts  # If duplicate exists
npm install
npm run dev
```

## 📋 Pre-Commit Checklist

Before committing your setup:
- [ ] App loads without 404
- [ ] All imports resolve
- [ ] Screenshots work
- [ ] No zombie processes
- [ ] Documentation updated
- [ ] `.claude/` directory copied for future use

## 🎯 Success Indicators

✅ Home page loads at http://localhost:3000
✅ No "Module not found" errors
✅ Playwright can take screenshots
✅ Figma MCP extracts designs
✅ Hot reload works
✅ No duplicate config files
✅ Clean process list

---

💡 **Pro Tip**: Run the diagnostic tool first thing in each new session:
```bash
node .claude/examples/next-app-setup.js
```

This will catch most issues before they become problems!