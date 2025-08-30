# 🎨 Universal Figma-to-Web Implementation Guide

**Quick Start**: Transform ANY Figma mockup into a working web application in 30 minutes using universal patterns that prevent common implementation gaps.

## 📋 Prerequisites

**Read This First**: [ANTI_PATTERNS.md](./ANTI_PATTERNS.md) - Can save you 6-12 hours of debugging.

**Required Dependencies**:
```bash
npm install recharts lucide-react
npm install --save-dev @tailwindcss/postcss  # If using Tailwind
```

## 🚀 Universal Implementation Workflow (30 Minutes)

### Step 1: Extract Visual Structure from Figma (5 minutes)
```bash
# Use any method to extract your Figma design:
# - Figma Dev Mode export
# - Figma-to-code plugins  
# - Manual CSS creation from design specs
# - MCP Figma integration (if available)

# Copy universal framework files:
cp template-additions/styles/design-system.css → your-project/styles/
cp template-additions/components/ → your-project/components/  # Adapt as needed
```

### Step 2: Apply Universal CSS Architecture (5 minutes)
```typescript
// In your main CSS file or layout.tsx - works with any CSS framework
import './styles/design-system.css';  // CSS modules
import './design-system.css';         // Standard CSS
// Or configure with styled-components, emotion, etc.
```

### Step 3: Basic Implementation (10 minutes)
```tsx
// app/page.tsx - Complete working example
import DashboardLayout from './components/DashboardLayout';
import ChartPanel from './components/ChartPanel';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const sampleData = [
  { month: 'Jan', value: 100 },
  { month: 'Feb', value: 120 },
  { month: 'Mar', value: 110 },
];

export default function Dashboard() {
  const handleSectionChange = (sectionId: string) => {
    console.log('Section changed to:', sectionId);
    // Add your logic here: update charts, load data, etc.
  };

  return (
    <DashboardLayout onSectionChange={handleSectionChange}>
      <ChartPanel title="CPI - Last Five Years" source="FRED">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#0F52BA" />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
      
      <ChartPanel title="Unemployment Rate" source="FRED">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#7C3AED" />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
      
      <ChartPanel title="Interest Rates" source="FRED">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#10B981" />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
      
      <ChartPanel title="GDP Growth" source="FRED">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sampleData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Line type="monotone" dataKey="value" stroke="#F59E0B" />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
    </DashboardLayout>
  );
}
```

### Step 4: Verification (10 minutes)
```bash
# Verify CSS compilation
curl -s http://localhost:3000/_next/static/css/app.css | grep "ds-dashboard-grid"
# Expected: Should return CSS rule

# Test navigation functionality
# 1. Click different navigation items in sidebar
# 2. Check browser console for "Navigation clicked: [item-id]" logs
# 3. Verify active state changes (blue background moves)
```

## 🎯 Core Design System Components

### Layout Components

#### DashboardLayout
```tsx
import DashboardLayout from './components/DashboardLayout';

<DashboardLayout onSectionChange={handleSectionChange}>
  {/* Your chart panels */}
</DashboardLayout>
```

**Features**:
- ✅ Complete sidebar + main content layout
- ✅ 2x2 grid that actually works (CSS-based, not broken Tailwind)
- ✅ Proper typography hierarchy
- ✅ Responsive overflow handling

#### Sidebar
```tsx
import Sidebar from './components/Sidebar';

<Sidebar onSectionChange={(sectionId) => {
  console.log('Navigate to:', sectionId);
  // Update your charts/data here
}} />
```

**Features**:
- ✅ Full click functionality with React state management
- ✅ Active state styling that matches Figma designs
- ✅ 8 predefined navigation categories
- ✅ Accessibility attributes (ARIA labels, focus states)

#### ChartPanel
```tsx
import ChartPanel from './components/ChartPanel';

<ChartPanel title="Your Chart Title" source="Data Source">
  {/* Any chart library component */}
</ChartPanel>
```

**Features**:
- ✅ Consistent panel styling
- ✅ Typography hierarchy (title → source → chart)
- ✅ 180px standard chart height
- ✅ Works with any charting library

### CSS Classes Reference

#### Layout Classes
```css
.ds-dashboard-grid    /* 2x2 grid layout - USE THIS, not Tailwind grid utilities */
.ds-sidebar          /* Fixed width sidebar with shadow */
.ds-panel            /* Standard panel container with shadow */
.ds-chart-container  /* Standard 180px chart height */
```

#### Typography Classes
```css
.ds-title           /* Main page title (24px, semibold) */
.ds-subtitle        /* Page subtitle (14px, gray) */
.ds-chart-title     /* Chart panel title (14px, semibold) */
.ds-chart-source    /* Chart data source (12px, light gray) */
```

#### Navigation Classes
```css
.ds-nav-item        /* Navigation button base styles */
.ds-nav-item.active /* Active navigation state (blue background) */
```

#### Utility Classes
```css
.bg-bg-primary      /* Primary background (#FFFFFF) */
.bg-bg-secondary    /* Secondary background (#F1F5F9) */
.text-text-primary  /* Primary text (#0F172A) */
.text-text-secondary /* Secondary text (#334155) */
```

## 🎨 Design Tokens

### Colors
```css
:root {
  --color-bg-primary: #FFFFFF;      /* Panel backgrounds */
  --color-bg-secondary: #F1F5F9;    /* Page background */
  --color-text-primary: #0F172A;    /* Headings, important text */
  --color-text-secondary: #334155;  /* Navigation items */
  --color-brand-primary: #0F52BA;   /* Active states, primary actions */
  --color-chart-primary: #0F52BA;   /* Chart line 1 */
  --color-chart-secondary: #7C3AED; /* Chart line 2 */
}
```

### Layout
```css
:root {
  --sidebar-width: 280px;      /* Fixed sidebar width */
  --chart-height: 180px;       /* Standard chart height */
  --gap-charts: 20px;          /* Grid gap between panels */
  --panel-padding: 24px;       /* Internal panel padding */
}
```

## 📊 Chart Integration Examples

### Using Recharts (Recommended)
```tsx
import { LineChart, AreaChart, BarChart, Line, Area, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Line Chart
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>
    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
    <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
    <Line type="monotone" dataKey="value" stroke="#0F52BA" strokeWidth={2} />
  </LineChart>
</ResponsiveContainer>

// Area Chart with Gradient
<ResponsiveContainer width="100%" height="100%">
  <AreaChart data={data}>
    <defs>
      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.3}/>
        <stop offset="95%" stopColor="#0F52BA" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <XAxis dataKey="month" />
    <YAxis />
    <Area type="monotone" dataKey="value" stroke="#0F52BA" fill="url(#colorValue)" />
  </AreaChart>
</ResponsiveContainer>
```

### Chart Styling Best Practices
```typescript
// Standard chart configuration
const chartConfig = {
  margin: { top: 5, right: 5, left: 5, bottom: 5 },
  colors: {
    primary: '#0F52BA',     // var(--color-chart-primary)
    secondary: '#7C3AED',   // var(--color-chart-secondary)
    tertiary: '#10B981',    // var(--color-chart-tertiary)
    quaternary: '#F59E0B',  // var(--color-chart-quaternary)
  },
  fonts: {
    size: 11,
    color: '#64748B',       // var(--color-text-tertiary)
  }
};
```

## 🔗 Component Integration Patterns

### Navigation → Chart Updates
```tsx
export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('key-indicators');
  const [chartData, setChartData] = useState(defaultData);

  const handleSectionChange = async (sectionId: string) => {
    setSelectedSection(sectionId);
    
    // Update charts based on section
    switch(sectionId) {
      case 'inflation':
        setChartData(await loadInflationData());
        break;
      case 'employment':
        setChartData(await loadEmploymentData());
        break;
      // etc.
    }
  };

  return (
    <DashboardLayout onSectionChange={handleSectionChange}>
      {/* Charts will update when navigation changes */}
      <ChartPanel title={`${selectedSection} Data`} source="FRED">
        <YourChart data={chartData} />
      </ChartPanel>
    </DashboardLayout>
  );
}
```

### Loading States
```tsx
const [loading, setLoading] = useState(false);

const handleSectionChange = async (sectionId: string) => {
  setLoading(true);
  setSelectedSection(sectionId);
  
  try {
    const data = await loadDataForSection(sectionId);
    setChartData(data);
  } catch (error) {
    console.error('Failed to load data:', error);
  } finally {
    setLoading(false);
  }
};

return (
  <ChartPanel title="Chart Title" source="FRED">
    {loading ? (
      <div className="flex items-center justify-center h-full">
        <div className="text-text-tertiary">Loading...</div>
      </div>
    ) : (
      <YourChart data={chartData} />
    )}
  </ChartPanel>
);
```

## 🧪 Testing Your Implementation

### Visual Verification Checklist
- [ ] ✅ Sidebar displays on left side with fixed width
- [ ] ✅ Main content shows 2x2 grid of panels (not single column)
- [ ] ✅ Clicking navigation items changes active state (blue background moves)
- [ ] ✅ Charts display within panels at proper height (180px)
- [ ] ✅ Typography hierarchy is clear (title → subtitle → chart labels)

### Functional Testing
```typescript
// Manual testing steps:
// 1. Click each navigation item
// 2. Verify console shows: "Navigation clicked: [item-id]"
// 3. Verify only one item has blue background at a time
// 4. Verify charts render without errors
// 5. Test responsive behavior (shrink window)

// Automated testing (if using Playwright):
test('navigation functionality', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Test navigation clicks
  await page.click('[aria-label="Navigate to Inflation"]');
  expect(page.locator('.ds-nav-item.active')).toContainText('Inflation');
  
  await page.click('[aria-label="Navigate to Employment"]');
  expect(page.locator('.ds-nav-item.active')).toContainText('Employment');
});
```

### Performance Verification
```bash
# Check CSS bundle size
curl -s http://localhost:3000/_next/static/css/app.css | wc -c
# Should be reasonable size (< 100KB for design system)

# Check for unused CSS
# Use tools like PurgeCSS to identify unused styles
```

## 🔧 Customization Guide

### Changing Colors
```css
/* Override design tokens in your own CSS */
:root {
  --color-brand-primary: #YOUR_BRAND_COLOR;
  --color-chart-primary: #YOUR_CHART_COLOR;
  /* Other colors will automatically adjust */
}
```

### Adjusting Layout
```css
/* Customize layout dimensions */
:root {
  --sidebar-width: 320px;        /* Wider sidebar */
  --chart-height: 200px;         /* Taller charts */
  --gap-charts: 24px;            /* More spacing */
}
```

### Adding Custom Navigation Items
```typescript
// Modify navItems in Sidebar.tsx
const navItems: NavItem[] = [
  // ... existing items
  { id: 'my-custom-section', label: 'My Custom Section', icon: TrendingUp },
];
```

## 🆘 Troubleshooting

### Grid Layout Issues
**Problem**: Charts display in single column instead of 2x2 grid
**Solution**: 
1. Verify `design-system.css` is imported
2. Check: `curl -s http://localhost:3000/_next/static/css/app.css | grep "ds-dashboard-grid"`
3. Restart dev server

### Navigation Not Working
**Problem**: Clicks don't change active state
**Solution**:
1. Check browser console for "Navigation clicked" logs
2. Verify you're using the complete Sidebar component (not a modified version)
3. Ensure React state management is working

### CSS Not Loading
**Problem**: Components have no styling
**Solution**:
1. Verify CSS import in layout or main file
2. Check file paths are correct
3. Clear Next.js cache: `rm -rf .next && npm run dev`

## 📚 Additional Resources

- [Component Examples](../examples/) - Complete working implementations
- [Anti-Patterns Guide](./ANTI_PATTERNS.md) - What NOT to do (critical reading)
- [Testing Templates](../tests/) - Automated test examples
- [Figma Design Reference](https://figma.com/...) - Original design specifications

## 🎯 Success Metrics

After following this guide, you should achieve:

- ⏱️ **Time to Working Dashboard**: < 30 minutes
- 🎨 **Visual Accuracy**: 95%+ match to Figma designs
- ⚡ **Functionality**: All navigation working on first try
- 🧪 **Quality**: Zero layout or interaction bugs
- 📱 **Responsiveness**: Mobile-friendly responsive behavior

**Remember**: This design system is battle-tested. Don't customize until you have the basic implementation working perfectly.