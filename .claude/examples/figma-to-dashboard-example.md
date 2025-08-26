# Complete Figma to Dashboard Example

This is the exact prompt used to build the FRED Economic Dashboard from a Figma mockup, demonstrating the full workflow from design to implementation.

## Original Prompt

```
Using the following figma mockup https://www.figma.com/design/3JYlPbw1HsEDaSHkGqClRi/key-indicators?node-id=0-1&p=f&t=C7FGjeiFE3vUYB76-11 use the figma dev MCP server to analyze the mockup and build the underlying code in this next.js application. Use the recharts library for creating charts to make this a web application. Check how this application looks using the playwright MCP server and verify it looks as close to the mock as possible.
```

## What This Prompt Accomplished

### 1. Figma Analysis
- **URL**: https://www.figma.com/design/3JYlPbw1HsEDaSHkGqClRi/key-indicators
- **Node ID**: `0-1` (extracted from `node-id=0-1&p=f&t=C7FGjeiFE3vUYB76-11`)
- **Design Type**: Economic indicators dashboard with charts and sidebar

### 2. Technical Specifications
- **Framework**: Next.js (already established)
- **Chart Library**: Recharts (explicitly requested)
- **Testing**: Playwright for visual verification
- **Target**: Web application matching the mockup

### 3. Implementation Results
- ✅ **Sidebar Navigation**: Extracted and implemented
- ✅ **Chart Components**: Built with recharts library
- ✅ **Layout Structure**: Grid-based dashboard layout
- ✅ **Color Scheme**: Matched Figma design tokens
- ✅ **Typography**: Preserved font sizing and weights

### 4. Components Created
```typescript
// From this single prompt, Claude created:
src/components/
├── Sidebar.tsx           // Navigation with menu items
├── ChartCard.tsx         // Reusable chart component
└── Dashboard.tsx         // Main layout

src/utils/
└── mockData.ts           // Realistic economic data generators

app/
└── page.tsx              // Main dashboard page
```

## Key Workflow Elements

### 1. URL to Node ID Extraction
```
https://www.figma.com/.../node-id=0-1&p=f&t=...
                           ^^^^
                        Becomes: nodeId: "0-1"
```

### 2. MCP Server Integration
```javascript
// Claude automatically used:
const image = await mcp__figma-dev-mode-mcp-server__get_image({
  nodeId: "0-1",
  clientFrameworks: "react,next.js",
  clientLanguages: "javascript,typescript,html,css"
});

const code = await mcp__figma-dev-mode-mcp-server__get_code({
  nodeId: "0-1", 
  clientFrameworks: "react,next.js",
  clientLanguages: "javascript,typescript,html,css"
});
```

### 3. Library Integration
- **Recharts**: Automatically installed and configured
- **Tailwind**: Used for styling based on Figma tokens
- **TypeScript**: Proper interfaces for data structures

### 4. Visual Verification
- **Playwright Screenshots**: Captured final result
- **Comparison**: Verified against original Figma design
- **Iterations**: Refined until visual match achieved

## Prompt Engineering Tips

### ✅ What Worked Well
1. **Specific URL**: Direct link to exact Figma node
2. **Library specification**: "recharts library" was clear
3. **Technology stack context**: Next.js app already established
4. **Verification request**: "verify it looks as close to the mock as possible"

### 🔧 What You Could Add
```
Using the following figma mockup [URL] use the figma dev MCP server to analyze the mockup and build the underlying code in this next.js application. Use the recharts library for creating charts to make this a web application. 

ADDITIONAL SPECIFICATIONS:
- Create TypeScript interfaces for all data structures
- Use Tailwind CSS for styling with design tokens from Figma
- Implement responsive design for mobile and desktop
- Generate realistic mock data that matches the chart examples
- Create reusable components for charts and navigation

Check how this application looks using the playwright MCP server and verify it looks as close to the mock as possible.
```

## Expected Outcome

After running this prompt, you should have:
- ✅ Full working dashboard
- ✅ Components matching Figma design
- ✅ Chart library integrated and configured
- ✅ Screenshot verification completed
- ✅ All routing and configuration issues resolved

## Adapting This for Your Project

Replace the Figma URL with your own:
```
Using the following figma mockup [YOUR_FIGMA_URL] use the figma dev MCP server to analyze the mockup and build the underlying code in this next.js application. Use the [YOUR_PREFERRED_LIBRARY] library for [SPECIFIC_FEATURE]. Check how this application looks using the playwright MCP server and verify it looks as close to the mock as possible.
```

Common libraries to specify:
- **Charts**: recharts, chart.js, victory, nivo
- **UI**: chakra-ui, material-ui, ant-design, mantine
- **Forms**: react-hook-form, formik
- **Animation**: framer-motion, react-spring
- **Icons**: lucide-react, react-icons, heroicons

This approach ensures Claude has all the context needed to build exactly what you want from your Figma design.