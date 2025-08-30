# Layout Comparison Tool

A general-purpose tool for comparing Figma design layouts with Playwright-rendered applications. Designed for integration into the [nextjs-figma-playwright-wsl-template](https://github.com/superelastic/nextjs-figma-playwright-wsl-template).

## 🎯 Purpose

This tool automatically detects and compares layout patterns between:
- **Figma designs** (via MCP server integration)  
- **Live applications** (via Playwright element detection)

It prevents common layout implementation failures like:
- ❌ 2x2 grids rendering as single columns
- ❌ Missing or misplaced elements  
- ❌ Incorrect spacing and positioning

## 🚀 Quick Start

### 1. Basic Usage
```bash
# Use default configuration
npm run verify-layout

# With debug information
npm run verify-layout:debug

# Manual command with custom parameters
node tools/compare-figma-layout.js --figma="22:21" --url="http://localhost:3001"
```

### 2. Integration in Development Workflow
```bash
# Run before committing
npm run test:layout  # Runs layout verification + Playwright tests

# In CI/CD pipeline
npm run build && npm run verify-layout
```

## ⚙️ Configuration

### Configuration File: `figma-layout.config.js`
```javascript
module.exports = {
  figmaNodeId: "22:21",               // Your Figma node ID
  playwrightUrl: "http://localhost:3001", // Local development URL
  elementSelector: ".ds-panel",        // CSS selector for elements to compare
  expectedPattern: "2x2-grid",        // Expected layout pattern
  tolerance: 0.1,                     // Positioning tolerance (0.0-1.0)
  debug: false                        // Enable debug information
};
```

### Command Line Overrides
```bash
# Override specific settings
node tools/compare-figma-layout.js \
  --figma="your-node-id" \
  --url="http://localhost:3000" \
  --selector=".chart-container" \
  --debug
```

## 📐 Supported Layout Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| `2x2-grid` | Four elements in 2 columns, 2 rows | Dashboards, analytics |
| `1x4-vertical` | Four elements stacked vertically | Mobile layouts, narrow screens |
| `4x1-horizontal` | Four elements in single horizontal row | Wide displays, toolbars |
| `scattered` | No clear grid pattern | Custom layouts, overlays |

## 🔧 How It Works

### 1. Figma Analysis
- Extracts element positions from Figma metadata
- Determines expected layout pattern
- Provides reference coordinates

### 2. Playwright Analysis  
- Scans live application using CSS selectors
- Measures actual element bounding boxes
- Detects geometric layout patterns

### 3. Comparison Engine
- Compares expected vs actual patterns
- Calculates confidence scores
- Provides specific fix recommendations

### 4. Pattern Detection Algorithm
```typescript
// Example: 2x2 Grid Detection
const detectLayoutPattern = (elements) => {
  // Sort elements by Y position to identify rows
  const sortedByY = elements.sort((a, b) => a.y - b.y);
  
  // Check for two distinct Y levels (rows)
  const topRow = sortedByY.slice(0, 2);
  const bottomRow = sortedByY.slice(2, 4);
  
  // Verify horizontal alignment within rows
  if (Math.abs(topRow[0].y - topRow[1].y) < tolerance &&
      Math.abs(bottomRow[0].y - bottomRow[1].y) < tolerance) {
    return "2x2-grid";
  }
  
  return "other-pattern";
};
```

## 📊 Output Examples

### ✅ Success Case
```
📊 Layout Comparison Report
══════════════════════════════════════════════════
✅ LAYOUT MATCH CONFIRMED
   Pattern: 2x2-grid
   Elements: 4
   Confidence: 95.0%
══════════════════════════════════════════════════
```

### ❌ Failure Case
```
📊 Layout Comparison Report
══════════════════════════════════════════════════
❌ LAYOUT MISMATCH DETECTED

📐 Layout Pattern Mismatch:
   Expected: 2x2-grid
   Actual:   1x4-vertical
   Expected Description: Four elements arranged in 2 columns and 2 rows
   Actual Description:   Four elements stacked vertically in single column

🔧 SUGGESTED FIX:
   This is a common CSS grid configuration issue.
   Try using:
   .ds-dashboard-grid {
     display: grid;
     grid-template-columns: repeat(2, minmax(0, 1fr));
     gap: 20px;
   }
   Instead of Tailwind utilities like "grid-cols-2"
══════════════════════════════════════════════════
```

## 🎯 Template Integration

### For New Projects
1. **Copy tool to new project:**
   ```bash
   cp tools/compare-figma-layout.js /path/to/new-project/tools/
   cp figma-layout.config.js /path/to/new-project/
   ```

2. **Update configuration:**
   ```javascript
   // figma-layout.config.js
   module.exports = {
     figmaNodeId: "your-figma-node-id",    // ← Update this
     elementSelector: ".your-css-class",   // ← Update this
     expectedPattern: "2x2-grid",          // ← Update if different
     // ... other settings
   };
   ```

3. **Add to package.json:**
   ```json
   {
     "scripts": {
       "verify-layout": "node tools/compare-figma-layout.js",
       "test:layout": "npm run verify-layout && playwright test"
     }
   }
   ```

### GitHub Template Integration
To integrate into the main template repository:

1. **Add to template's default structure**
2. **Include in template documentation**
3. **Add to CI/CD examples**
4. **Provide configuration templates**

## 🐛 Troubleshooting

### Common Issues

#### Issue: "No elements found with selector"
```bash
# Solution: Verify your CSS selector
npm run verify-layout:debug
# Check if elementSelector in config matches your actual CSS classes
```

#### Issue: "Pattern detection returns 'unknown'"
```bash
# Solution: Check element count and positioning
# - Ensure exactly 4 elements for grid patterns
# - Verify elements are properly positioned
# - Check if elements overlap or have unusual positioning
```

#### Issue: "Confidence score too low"
```bash
# Solution: Check element size consistency
# - Elements should have similar widths/heights for grid patterns
# - Ensure proper spacing between elements
# - Verify no elements are cut off or hidden
```

### Debug Mode
```bash
npm run verify-layout:debug
```
Shows detailed element positioning data:
```json
{
  "figma": {
    "elements": [
      { "id": "chart1", "bounds": { "x": 335, "y": 169, "width": 490, "height": 300 }},
      // ... more elements
    ]
  },
  "playwright": {
    "elements": [
      { "id": "element-0", "bounds": { "x": 313, "y": 169, "width": 490, "height": 300 }},
      // ... more elements  
    ]
  }
}
```

## 🚀 Advanced Usage

### Custom Pattern Detection
Extend the tool with custom patterns:

```javascript
// In figma-layout.config.js
module.exports = {
  // ... other config
  customPatterns: {
    "sidebar-main": "Sidebar + main content layout",
    "hero-grid": "Hero section + 3-column grid below"
  }
};
```

### CI/CD Integration
```yaml
# .github/workflows/layout-check.yml
name: Layout Verification
on: [push, pull_request]
jobs:
  verify-layout:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm start &
      - run: npm run verify-layout
```

## 🤝 Contributing

### Adding New Patterns
1. Extend `LAYOUT_PATTERNS` in `compare-figma-layout.js`
2. Add detection logic in `detectLayoutPattern()`
3. Update documentation
4. Add test cases

### Improving Detection Accuracy
1. Enhance geometric analysis algorithms
2. Add tolerance configuration options
3. Implement confidence calculation improvements
4. Add support for responsive breakpoints

## 📚 Related Documentation

- [FRED Dashboard Design System](../claude-knowledge/design-systems/FRED_DASHBOARD_DESIGN_SYSTEM.md)
- [Tailwind Grid Layout Issue](../claude-knowledge/issues/tailwind-grid-layout-issue.md)  
- [Template Setup Guide](../claude-knowledge/stacks/nextjs-figma-playwright-wsl/SETUP_CHECKLIST.md)

---

**Created for:** nextjs-figma-playwright-wsl-template  
**Version:** 1.0.0  
**Last Updated:** 2025-08-30