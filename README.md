# Next.js + Figma MCP + Playwright + WSL2 Template

Production-ready template for Next.js projects using Figma MCP for design extraction and Playwright for testing, optimized for WSL2 development.

## ✨ Features

- **Next.js 15.5** with App Router (correctly configured at `/app`)
- **Figma MCP** integration for design-to-code workflow
- **Playwright** direct API (not MCP) for reliable testing
- **WSL2 optimized** configurations
- **Pre-solved common issues** (routing 404s, port conflicts, zombie processes)
- **Diagnostic tools** included

## 🚀 Quick Start

```bash
# Create new project from this template
gh repo create my-new-project --template superelastic/nextjs-figma-playwright-wsl-template

# Navigate to project
cd my-new-project

# Run diagnostics (checks for common issues)
node .claude/examples/next-app-setup.js

# Install dependencies (includes TypeScript, Tailwind, ESLint, Playwright)
npm install

# Install Playwright browsers  
npx playwright install chromium

# Start development server
npm run dev
```

## ⚡ Figma MCP Setup (Required for Design Extraction)

To use Figma with Claude Code, you need to install the Figma MCP server:

```bash
# Install Figma MCP server (one-time setup)
claude mcp add --transport http figma-dev-mode-mcp-server http://127.0.0.1:3845/mcp
```

**After installation**, Figma tools will be available as:
- `mcp__figma-dev-mode-mcp-server__get_image` - Extract design images
- `mcp__figma-dev-mode-mcp-server__get_code` - Generate component code

**⚠️ Important**: This is a **one-time setup per machine**, not per project.

### Verify Installation

In Claude Code, check if MCP tools are available:
```javascript
// These should work after MCP setup:
const image = await mcp__figma-dev-mode-mcp-server__get_image({
  nodeId: "your-node-id",
  clientFrameworks: "react,next.js", 
  clientLanguages: "javascript,typescript,html,css"
});
```

If you see "tool not found" errors, the MCP server needs to be installed.

## 📁 Project Structure

```
├── app/                      # App Router pages (at root, NOT src/app!)
│   ├── layout.tsx           # Root layout (required)
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles
├── src/                     # Components and utilities
│   ├── components/          # React components
│   └── utils/              # Helper functions
├── .claude/                 # Claude Code documentation
│   ├── MCP_STRATEGY.md     # When to use MCP vs direct APIs
│   ├── next-routing-critical.md  # Routing issue solutions
│   └── examples/           # Diagnostic and testing tools
├── next.config.js          # Next.js config (only ONE!)
├── package.json
└── tsconfig.json
```

## 🔧 Pre-configured Solutions

This template includes solutions for common issues:

### ✅ Next.js Routing (No More 404s)
- App directory correctly placed at `/app`
- Single config file (no duplicates)
- Proper TypeScript paths

### ✅ Playwright Testing
- Uses direct API (not MCP) for reliability
- Configured for WSL2 with system Chrome
- Example test included

### ✅ Figma Integration
- MCP server ready for design extraction
- Example usage patterns in `.claude/`

## 🎨 Working with Figma

```javascript
// In Claude Code, extract design:
const design = await mcp__figma-dev-mode-mcp-server__get_image({
  nodeId: "your-node-id",
  clientFrameworks: "react,next.js",
  clientLanguages: "javascript,typescript,html,css"
});
```

## 🧪 Testing with Playwright

```javascript
// tests/example.spec.ts
import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/Next.js/);
});
```

Run tests:
```bash
npm test
```

## 🐛 Troubleshooting

### Run Diagnostics First
```bash
node .claude/examples/next-app-setup.js
```

This checks for:
- Zombie processes
- Port conflicts  
- Duplicate configs
- Wrong directory structure

### Common Issues

| Problem | Solution |
|---------|----------|
| 404 on all pages | Check app directory location |
| Port already in use | Kill zombie processes: `pkill -f "next-server"` |
| Playwright "Not connected" | Use direct API, not MCP |
| Module not found | Check tsconfig paths |
| Figma MCP "tool not found" | Install MCP server: `claude mcp add --transport http figma-dev-mode-mcp-server http://127.0.0.1:3845/mcp` |

### More Help
See `.claude/troubleshooting.md` for detailed solutions.

## 📚 Documentation

The `.claude/` directory contains extensive documentation:

- **[MCP_STRATEGY.md](.claude/MCP_STRATEGY.md)** - When to use MCP servers
- **[next-routing-critical.md](.claude/next-routing-critical.md)** - Routing solutions
- **[SETUP_CHECKLIST.md](.claude/SETUP_CHECKLIST.md)** - Setup checklist
- **[troubleshooting.md](.claude/troubleshooting.md)** - Common issues

## 🔗 Related Resources

- **Knowledge Base**: [github.com/superelastic/claude-knowledge](https://github.com/superelastic/claude-knowledge) (private)
- **Original Project**: FRED Economic Dashboard
- **Stack**: Next.js 15.5, React 19, TypeScript 5, Tailwind CSS

## 🛠️ Scripts

```json
{
  "dev": "next dev",           // Start dev server
  "build": "next build",       // Build for production
  "start": "next start",       // Start production server
  "lint": "eslint"            // Run linter
}
```

## 🚦 Pre-flight Checklist

- [ ] Run diagnostics: `node .claude/examples/next-app-setup.js`
- [ ] No zombie processes: `ps aux | grep next`
- [ ] Port 3000 available: `lsof -i :3000`
- [ ] Single config file: `ls next.config*`
- [ ] App at root: `ls app/layout.tsx`

## 📝 License

MIT - Use this template freely for any project.

## 🙏 Credits

Created from learnings during FRED Economic Dashboard development.
Optimized for Claude Code + WSL2 development environment.

---

**Ready to start?** Run the diagnostic tool first:
```bash
node .claude/examples/next-app-setup.js
```