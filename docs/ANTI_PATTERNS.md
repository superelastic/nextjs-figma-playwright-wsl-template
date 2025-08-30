# ❌ Universal Anti-Patterns: What NOT to Do in Any Figma-to-Web Implementation

**Critical Reading**: This document can save you 6-12 hours of debugging time. Read this FIRST before implementing ANY Figma mockup as a web application.

## 🚨 CRITICAL ANTI-PATTERNS

### ❌ Grid Layout - DON'T Depend on Framework-Specific Custom Classes

```tsx
// ❌ NEVER DO THIS - Custom utility classes often fail to compile
<div className="grid grid-cols-custom gap-custom">         // Tailwind custom
<div className="grid-layout-custom spacing-custom">        // CSS modules custom
<div className={styles.customGridLayout}>                  // styled-components custom
  <ComponentPanel />
  <ComponentPanel />
  <ComponentPanel />
</div>
```

**Problem**: Custom CSS utilities in any framework require compilation and configuration that often fails.

**✅ DO THIS INSTEAD:**
```tsx
// ✅ ALWAYS WORKS - Direct CSS classes or inline styles
<div className="ds-responsive-grid">                       // Predefined CSS class
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}> // Inline
  <ComponentPanel />
  <ComponentPanel />
  <ComponentPanel />
</div>
```

### ❌ Interactive Elements - DON'T Create Static UI from Figma

```tsx
// ❌ NEVER DO THIS - Figma-extracted components are often non-functional
const menuItems = [
  { id: 'item1', label: 'Item 1', active: true }, // Static from design
];

return (
  <button className={`menu-item ${item.active ? 'active' : ''}`}>
    {/* Missing any interaction logic */}
    {item.label}
  </button>
);
```

**Problem**: Design tools export static components that look perfect but have zero functionality.

**✅ DO THIS INSTEAD:**
```tsx
// ✅ UNIVERSAL PATTERN - Add behavior to any static component
const [activeItem, setActiveItem] = useState('item1');

const handleInteraction = (itemId: string) => {
  setActiveItem(itemId);
  onSelectionChange?.(itemId); // Notify parent components
};

return (
  <button 
    onClick={() => handleInteraction(item.id)}  // ✅ Behavioral logic
    className={`menu-item ${activeItem === item.id ? 'active' : ''}`}  // ✅ Dynamic state
  >
    {item.label}
  </button>
);
```

### ❌ CSS Compilation - DON'T Assume Classes Exist

```bash
# ❌ NEVER ASSUME - Custom classes might not be generated
# This could return empty even though you see the class in HTML:
curl -s http://localhost:3000/_next/static/css/app.css | grep "grid-cols-dashboard"
```

**Problem**: Classes appear in HTML but don't exist in compiled CSS.

**✅ DO THIS INSTEAD:**
```bash
# ✅ VERIFY CSS GENERATION - Always check before assuming it works
curl -s http://localhost:3000/_next/static/css/app.css | grep "ds-dashboard-grid"
# Expected: .ds-dashboard-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--gap-charts)}
```

## ⚠️ COMMON ANTI-PATTERNS

### ❌ Component Props - DON'T Use Static Active States

```tsx
// ❌ ANTI-PATTERN - Static configuration
interface NavItem {
  id: string;
  label: string;
  active: boolean;  // ❌ Static active state
}

const navItems: NavItem[] = [
  { id: 'item1', label: 'Item 1', active: true },
  { id: 'item2', label: 'Item 2', active: false },
];
```

**Problem**: Active state can't change dynamically.

**✅ DO THIS INSTEAD:**
```tsx
// ✅ CLEAN INTERFACE - Let React manage state
interface NavItem {
  id: string;
  label: string;
  // No active prop - managed by React state
}

const [activeItem, setActiveItem] = useState('item1');
```

### ❌ Tailwind Config - DON'T Trust Custom Extensions

```typescript
// ❌ DANGEROUS - Custom Tailwind extensions often fail
// tailwind.config.ts
module.exports = {
  theme: {
    extend: {
      gridTemplateColumns: {
        'dashboard': 'repeat(2, minmax(0, 1fr))',  // ❌ Might not compile
      },
      gap: {
        'charts': 'var(--gap-charts)',  // ❌ Might not compile
      }
    }
  }
};
```

**Problem**: Extensions require dev server restarts and may not compile in production.

**✅ DO THIS INSTEAD:**
```css
/* ✅ RELIABLE - Direct CSS always works */
.ds-dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--gap-charts);
}
```

### ❌ Event Handling - DON'T Forget Accessibility

```tsx
// ❌ POOR ACCESSIBILITY - Missing attributes
<button className="nav-item" onClick={handleClick}>
  Item
</button>
```

**✅ DO THIS INSTEAD:**
```tsx
// ✅ ACCESSIBLE - Proper attributes
<button 
  className="nav-item"
  onClick={handleClick}
  aria-label={`Navigate to ${item.label}`}  // ✅ Screen reader support
  type="button"                              // ✅ Explicit button type
>
  Item
</button>
```

### ❌ CSS Variables - DON'T Use Undefined Variables

```css
/* ❌ UNDEFINED VARIABLES - Will fallback to default values */
.my-component {
  width: var(--undefined-width);  /* Falls back to default */
  height: var(--undefined-height); /* Falls back to default */
}
```

**Problem**: Undefined variables silently fail.

**✅ DO THIS INSTEAD:**
```css
/* ✅ DEFINED VARIABLES - Always define in :root first */
:root {
  --sidebar-width: 280px;
  --chart-height: 180px;
}

.my-component {
  width: var(--sidebar-width);   /* ✅ Defined variable */
  height: var(--chart-height);  /* ✅ Defined variable */
}
```

## 💣 DEBUGGING ANTI-PATTERNS

### ❌ Don't Debug in Production - Check Development

```bash
# ❌ WRONG - Checking production CSS won't show compilation issues
curl -s https://yourapp.com/_next/static/css/app.css | grep "your-class"
```

**✅ DO THIS INSTEAD:**
```bash
# ✅ RIGHT - Check development server CSS
curl -s http://localhost:3000/_next/static/css/app.css | grep "your-class"
```

### ❌ Don't Ignore Console Errors

```javascript
// ❌ IGNORING ERRORS - Console errors often reveal the real problem
// Check browser console for:
// - "Failed to compile"
// - "Module not found"
// - React warnings
```

**✅ DO THIS INSTEAD:**
```javascript
// ✅ MONITOR CONSOLE - Always check for:
console.log('Navigation clicked:', itemId);  // ✅ Functionality verification
// Look for compilation errors in terminal
// Check browser console for React warnings
```

## 🔧 VERIFICATION ANTI-PATTERNS

### ❌ Don't Assume Visual = Functional

```typescript
// ❌ WRONG ASSUMPTION - Visual appearance doesn't guarantee functionality
// "The navigation looks perfect, so it must work"
```

**✅ DO THIS INSTEAD:**
```typescript
// ✅ TEST FUNCTIONALITY - Always verify interactive behavior
test('navigation should respond to clicks', async ({ page }) => {
  await page.click('[data-testid="nav-inflation"]');
  expect(page.locator('.active')).toContainText('Inflation');
});
```

### ❌ Don't Test Only Happy Path

```typescript
// ❌ INCOMPLETE TESTING - Only testing one scenario
test('navigation works', async ({ page }) => {
  await page.click('[data-testid="nav-item"]');
  // Only tests one click
});
```

**✅ DO THIS INSTEAD:**
```typescript
// ✅ COMPREHENSIVE TESTING - Test all scenarios
test('navigation works for all items', async ({ page }) => {
  const items = ['inflation', 'employment', 'housing'];
  for (const item of items) {
    await page.click(`[data-testid="nav-${item}"]`);
    expect(page.locator('.active')).toContainText(item);
  }
});
```

## 📋 PRE-IMPLEMENTATION CHECKLIST

Before you start coding, verify you won't hit these anti-patterns:

### Layout
- [ ] ❌ Am I using `grid-cols-dashboard` or custom Tailwind grid classes?
- [ ] ✅ Am I using `.ds-dashboard-grid` CSS class instead?
- [ ] ✅ Have I included `design-system.css` in my project?

### Navigation  
- [ ] ❌ Are my navigation items missing `onClick` handlers?
- [ ] ❌ Am I using static `active` properties in data?
- [ ] ✅ Am I using React `useState` for active state management?
- [ ] ✅ Do I have proper accessibility attributes?

### CSS Compilation
- [ ] ❌ Am I depending on custom Tailwind extensions working?
- [ ] ✅ Am I using CSS classes that I can verify exist?
- [ ] ✅ Can I confirm my styles in the compiled CSS bundle?

### Testing
- [ ] ❌ Am I only testing visual appearance?
- [ ] ✅ Am I testing interactive functionality?
- [ ] ✅ Am I testing all navigation items, not just one?

---

## 🆘 When You Hit Problems

### If Your Grid Layout is Broken:
1. Check: `curl -s http://localhost:3000/_next/static/css/app.css | grep "ds-dashboard-grid"`
2. Expected: CSS rule should be found
3. If missing: You forgot to import `design-system.css`
4. Solution: Import the CSS file and restart your dev server

### If Your Navigation Doesn't Work:
1. Check: Browser console for click events
2. Expected: `"Navigation clicked: [item-id]"` logs
3. If missing: You forgot the `onClick` handler
4. Solution: Add state management and click handlers (see examples above)

### If You're Unsure:
1. Copy the working examples from this template
2. Don't try to "improve" or customize until it works
3. Test functionality before adding features
4. Use the verification steps in this document

**Remember**: These anti-patterns have cost other developers 6-12 hours of debugging. Learn from their mistakes!