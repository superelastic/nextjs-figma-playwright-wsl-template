# Claude Code Documentation

This directory contains comprehensive documentation for MCP (Model Context Protocol) server setup and integration patterns discovered during the FRED Economic Dashboard project.

## Directory Structure

```
.claude/
├── README.md                    # This file
├── MCP_STRATEGY.md             # 🎯 IMPORTANT: Figma MCP ✅, Playwright MCP ❌
├── next-routing-critical.md    # ⚠️ MUST READ: Prevents 404 routing issues
├── SETUP_CHECKLIST.md          # Step-by-step setup checklist
├── setup-guide.md              # Complete setup instructions
├── integration-patterns.md     # MCP integration workflows
├── troubleshooting.md         # Common issues and solutions
├── project-context.md         # Specific project learnings
└── examples/                  # Working code examples
    ├── next-app-setup.js       # Diagnostic tool for routing issues
    ├── playwright-screenshot.js
    ├── figma-to-component.js
    ├── mcp-test-suite.js
    └── playwright.config.template.ts
```

## Quick Start

1. **⚠️ FIRST: Check for routing issues** (prevents 404 errors)
   ```bash
   node .claude/examples/next-app-setup.js
   ```

2. **Check your environment**: Run the test suite
   ```bash
   node .claude/examples/mcp-test-suite.js
   ```

3. **Take a screenshot**: Use the direct Playwright approach
   ```bash
   node .claude/examples/playwright-screenshot.js
   ```

3. **Review setup**: See [setup-guide.md](./setup-guide.md) for detailed instructions

## Key Discoveries

### MCP Servers in WSL

- **Figma MCP**: ✅ Works reliably for design extraction
- **Playwright MCP**: ❌ Shows "Not connected" - **DO NOT USE**
- **Solution**: Use Figma MCP + Direct Playwright npm package
- **See**: [MCP_STRATEGY.md](./MCP_STRATEGY.md) for detailed explanation

### Critical Commands

```bash
# Install Playwright with browsers
npm install --save-dev @playwright/test
npx playwright install chromium

# Use system Chrome (more reliable in WSL)
# Configure with: channel: 'chrome'
```

## Documentation Guide

- **⚠️ [next-routing-critical.md](./next-routing-critical.md)**: MUST READ - Prevents 404 routing issues
- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)**: Step-by-step checklist for new projects
- **[setup-guide.md](./setup-guide.md)**: Detailed setup instructions
- **[troubleshooting.md](./troubleshooting.md)**: When things go wrong
- **[integration-patterns.md](./integration-patterns.md)**: How to use MCP tools effectively
- **[project-context.md](./project-context.md)**: Lessons from this specific project

## Essential Context for Future Sessions

When starting a new Claude Code session for similar projects:

1. **MCP Tool Availability**: Check with test suite first
2. **Fallback Strategy**: Always have direct API approach ready
3. **Port Management**: Kill zombie processes before starting
4. **Import Paths**: Use relative imports if aliases fail
5. **WSL Display**: Ensure `$DISPLAY=:0` is set

## Proven Working Configuration

```typescript
// playwright.config.ts
{
  use: {
    channel: 'chrome',  // System Chrome
    headless: true      // More reliable in WSL
  }
}
```

## Quick Diagnostic

Run this to check everything:
```bash
# Check display
echo $DISPLAY

# Check Chrome
google-chrome --version

# Check ports
lsof -i :3000

# Check Playwright
npx playwright --version
```

---

*This documentation was created to preserve learnings from implementing a Figma design using MCP servers in a WSL Ubuntu environment. It serves as a reference for future projects requiring similar integrations.*