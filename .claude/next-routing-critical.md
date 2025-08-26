# CRITICAL: Next.js Routing Issues Prevention Guide

## 🚨 Most Common Routing Problem: 404 on All Pages

### Root Causes Discovered
1. **Duplicate config files**: Both `next.config.js` AND `next.config.ts` existing
2. **Zombie processes**: Old Next.js servers from previous sessions still running
3. **Wrong app directory location**: Next.js 13+ expects `/app` at root, NOT `/src/app`
4. **Nested app directories**: Accidental `app/app` structure from moves/copies

## Essential Pre-Flight Checklist

```bash
# 1. Kill ALL existing Node/Next processes
ps aux | grep -E "next|node" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null || true

# 2. Check for duplicate configs
ls -la next.config*
# MUST have ONLY ONE: either .js OR .ts, never both!

# 3. Verify app directory structure
ls -la app/
# Should show: layout.tsx, page.tsx, globals.css
# Should NOT show another app/ directory inside!

# 4. Clear ALL caches
rm -rf .next/ .turbo/ node_modules/.cache/

# 5. Check ports are free
lsof -i :3000 -i :3001 -i :3002 | grep LISTEN
```

## Correct Next.js App Router Structure

```
project-root/
├── app/                    # ✅ At root level
│   ├── layout.tsx         # ✅ Root layout (required)
│   ├── page.tsx           # ✅ Home page
│   └── globals.css        # ✅ Global styles
├── src/                   # ✅ For components/utils
│   ├── components/
│   └── utils/
├── next.config.js         # ✅ Config file (only ONE!)
└── package.json
```

### ❌ WRONG Structures That Cause 404s

```
# Wrong 1: App under src
src/
└── app/  ❌

# Wrong 2: Nested app
app/
└── app/  ❌

# Wrong 3: Multiple configs
next.config.js  ❌
next.config.ts  ❌ (both present)
```

## Fix Sequence for 404 Issues

### Step 1: Check Process Hygiene
```bash
# Find zombie processes (especially old dates)
ps aux | grep next
# Look for processes from previous days/months!
```

### Step 2: Verify Single Config
```bash
# Remove duplicate config
ls next.config*
# If you see both .js and .ts:
rm next.config.ts  # Keep only .js
```

### Step 3: Fix App Directory Location
```bash
# If app is under src/, move it to root:
mv src/app app

# Check for nested app directories:
ls app/
# If you see another app/ inside:
mv app/app/* app/ && rmdir app/app
```

### Step 4: Ensure Required Files
```bash
# Verify these exist:
ls app/layout.tsx  # MUST exist
ls app/page.tsx    # MUST exist
```

### Step 5: Clean Start
```bash
rm -rf .next/
npm run dev
```

## Working package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**Note**: Remove `--turbopack` from build command if having issues

## Working next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
```

## Import Path Resolution

### For App Directory at Root
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]  // Components in src/
    }
  }
}

// Usage in app/page.tsx:
import Component from '@/components/Component'  // ✅
```

## Diagnostic Commands

```bash
# Quick health check
echo "=== Process Check ===" && \
ps aux | grep -E "next|node" | grep -v grep | head -5 && \
echo "=== Config Files ===" && \
ls -la next.config* && \
echo "=== App Structure ===" && \
ls -la app/ 2>/dev/null || echo "No app directory!" && \
echo "=== Port Status ===" && \
lsof -i :3000 | grep LISTEN || echo "Port 3000 free"
```

## Prevention Strategies

1. **Start fresh projects with:**
   ```bash
   npx create-next-app@latest --app --typescript
   ```

2. **Always check for zombies before starting:**
   ```bash
   pkill -f "next-server" 2>/dev/null || true
   ```

3. **Use a startup script:**
   ```bash
   #!/bin/bash
   # save as start-dev.sh
   pkill -f "next-server" 2>/dev/null || true
   rm -rf .next/
   npm run dev
   ```

4. **Monitor for config conflicts:**
   ```bash
   # Add to package.json scripts
   "predev": "ls next.config* | wc -l | grep -q '^1$' || (echo 'ERROR: Multiple configs!' && exit 1)"
   ```

## Common Error Messages and Solutions

| Error | Solution |
|-------|----------|
| `404 This page could not be found` on all routes | Check app directory location and config files |
| `page.tsx doesn't have a root layout` | Ensure `app/layout.tsx` exists |
| `Module not found: Can't resolve '@/...'` | Check tsconfig.json paths match actual structure |
| `Port 3000 is in use` | Kill zombie processes |
| `ENOENT: no such file or directory, open '.../app/page.tsx'` | App directory in wrong location |

## The Golden Rule

**If Next.js returns 404 for the home page, it's almost always one of:**
1. Zombie processes from old sessions
2. Duplicate config files
3. App directory in wrong location
4. Missing layout.tsx

Check these FIRST before debugging anything else!