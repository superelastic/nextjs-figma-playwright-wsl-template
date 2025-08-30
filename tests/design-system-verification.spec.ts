import { test, expect } from '@playwright/test';

/**
 * Design System Verification Tests
 * 
 * These tests verify that the design system is implemented correctly and
 * catch the common issues that cost developers 6-12 hours of debugging.
 */

test.describe('Design System Verification', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should have working 2x2 grid layout (not single column)', async ({ page }) => {
    console.log('🔍 Testing Grid Layout...');
    
    // Wait for dashboard grid to be present
    await page.waitForSelector('.ds-dashboard-grid', { timeout: 10000 });
    
    // Get grid container styles
    const gridStyles = await page.locator('.ds-dashboard-grid').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        display: styles.display,
        gridTemplateColumns: styles.gridTemplateColumns,
        gap: styles.gap,
      };
    });
    
    console.log('Grid styles:', gridStyles);
    
    // Verify grid layout
    expect(gridStyles.display).toBe('grid');
    expect(gridStyles.gridTemplateColumns).toContain('490px 490px'); // 2 columns
    expect(gridStyles.gap).toBe('20px');
    
    // Verify panels are in 2x2 layout, not stacked vertically
    const panels = page.locator('.ds-panel');
    await expect(panels).toHaveCount(4);
    
    // Check panel positions (should be in 2x2 grid)
    const panelPositions = await panels.evaluateAll((elements) => {
      return elements.map((el, index) => {
        const rect = el.getBoundingBox();
        return {
          index,
          x: rect?.x || 0,
          y: rect?.y || 0,
          width: rect?.width || 0,
          height: rect?.height || 0
        };
      });
    });
    
    console.log('Panel positions:', panelPositions);
    
    // Verify we have two columns (different x positions)
    const uniqueXPositions = [...new Set(panelPositions.map(p => Math.round(p.x)))];
    expect(uniqueXPositions.length).toBe(2); // Should have 2 different X positions
    
    // Verify we have two rows (different y positions)
    const uniqueYPositions = [...new Set(panelPositions.map(p => Math.round(p.y)))];
    expect(uniqueYPositions.length).toBe(2); // Should have 2 different Y positions
    
    console.log('✅ Grid layout verification passed');
  });

  test('should have fully functional navigation', async ({ page }) => {
    console.log('🔍 Testing Navigation Functionality...');
    
    // Wait for sidebar
    await page.waitForSelector('.ds-sidebar');
    
    // Check initial active state
    const initialActive = page.locator('.ds-nav-item.active');
    await expect(initialActive).toHaveCount(1);
    await expect(initialActive).toContainText('Key Indicators');
    
    console.log('Initial active state: Key Indicators ✅');
    
    // Test clicking different navigation items
    const navItems = [
      'Inflation',
      'Employment', 
      'Interest Rates',
      'Economic Growth',
      'Exchange Rates',
      'Housing',
      'Consumer Spending'
    ];
    
    for (const itemText of navItems) {
      console.log(`Testing click: ${itemText}`);
      
      // Click the navigation item
      await page.locator('.ds-nav-item').filter({ hasText: itemText }).click();
      await page.waitForTimeout(100); // Wait for state update
      
      // Verify active state changed
      const activeItem = page.locator('.ds-nav-item.active');
      await expect(activeItem).toHaveCount(1);
      await expect(activeItem).toContainText(itemText);
      
      console.log(`✅ ${itemText} navigation working`);
    }
    
    console.log('✅ All navigation functionality verified');
  });

  test('should have correct CSS classes compiled', async ({ page }) => {
    console.log('🔍 Testing CSS Compilation...');
    
    // Check that critical CSS classes exist in the compiled bundle
    const cssContent = await page.evaluate(async () => {
      const response = await fetch('/_next/static/css/app/layout.css');
      return await response.text();
    });
    
    // Verify critical classes are present
    const requiredClasses = [
      'ds-dashboard-grid',
      'ds-panel',
      'ds-nav-item',
      'ds-sidebar',
      'ds-chart-container'
    ];
    
    for (const className of requiredClasses) {
      const classExists = cssContent.includes(className);
      console.log(`${className}: ${classExists ? '✅' : '❌'}`);
      expect(classExists).toBe(true);
    }
    
    // Verify grid-template-columns is properly set
    const hasGridColumns = cssContent.includes('grid-template-columns:repeat(2,minmax(0,1fr))');
    console.log(`Grid columns CSS: ${hasGridColumns ? '✅' : '❌'}`);
    expect(hasGridColumns).toBe(true);
    
    console.log('✅ CSS compilation verification passed');
  });

  test('should have proper visual styling', async ({ page }) => {
    console.log('🔍 Testing Visual Styling...');
    
    // Check sidebar styling
    const sidebarStyles = await page.locator('.ds-sidebar').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        width: styles.width,
        backgroundColor: styles.backgroundColor,
        boxShadow: styles.boxShadow
      };
    });
    
    console.log('Sidebar styles:', sidebarStyles);
    expect(sidebarStyles.width).toBe('280px');
    expect(sidebarStyles.backgroundColor).toBe('rgb(255, 255, 255)'); // --color-bg-primary
    
    // Check active navigation styling
    const activeNavStyles = await page.locator('.ds-nav-item.active').evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color
      };
    });
    
    console.log('Active nav styles:', activeNavStyles);
    expect(activeNavStyles.backgroundColor).toBe('rgb(15, 82, 186)'); // --color-brand-primary
    expect(activeNavStyles.color).toBe('rgb(255, 255, 255)'); // White text
    
    // Check panel styling
    const panelStyles = await page.locator('.ds-panel').first().evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderRadius: styles.borderRadius,
        padding: styles.padding
      };
    });
    
    console.log('Panel styles:', panelStyles);
    expect(panelStyles.backgroundColor).toBe('rgb(255, 255, 255)'); // --color-bg-primary
    expect(panelStyles.borderRadius).toBe('8px');
    expect(panelStyles.padding).toBe('24px');
    
    console.log('✅ Visual styling verification passed');
  });

  test('should have charts with correct dimensions', async ({ page }) => {
    console.log('🔍 Testing Chart Dimensions...');
    
    // Check chart container dimensions
    const chartContainers = page.locator('.ds-chart-container');
    await expect(chartContainers).toHaveCount(4);
    
    // Verify each chart container has correct height
    const containerDimensions = await chartContainers.evaluateAll((elements) => {
      return elements.map((el) => {
        const styles = window.getComputedStyle(el);
        const rect = el.getBoundingBox();
        return {
          height: styles.height,
          width: styles.width,
          actualHeight: rect?.height || 0,
          actualWidth: rect?.width || 0
        };
      });
    });
    
    console.log('Chart container dimensions:', containerDimensions);
    
    // All containers should have 180px height
    containerDimensions.forEach((container, index) => {
      console.log(`Chart ${index + 1}: ${container.height} height, ${container.width} width`);
      expect(container.height).toBe('180px');
      expect(container.width).toBe('100%');
    });
    
    console.log('✅ Chart dimensions verification passed');
  });

  test('should have accessible navigation', async ({ page }) => {
    console.log('🔍 Testing Accessibility...');
    
    // Check for proper ARIA labels
    const navButtons = page.locator('.ds-nav-item');
    await expect(navButtons).toHaveCount(8);
    
    // Verify each button has proper attributes
    const buttonAttributes = await navButtons.evaluateAll((buttons) => {
      return buttons.map((button, index) => ({
        index,
        hasAriaLabel: button.getAttribute('aria-label') !== null,
        hasType: button.getAttribute('type') === 'button',
        tagName: button.tagName,
        ariaLabel: button.getAttribute('aria-label')
      }));
    });
    
    console.log('Button accessibility:', buttonAttributes);
    
    buttonAttributes.forEach((attrs, index) => {
      console.log(`Button ${index + 1}: ${attrs.ariaLabel}`);
      expect(attrs.hasAriaLabel).toBe(true);
      expect(attrs.hasType).toBe(true);
      expect(attrs.tagName).toBe('BUTTON');
    });
    
    console.log('✅ Accessibility verification passed');
  });

  test('should handle responsive design', async ({ page }) => {
    console.log('🔍 Testing Responsive Design...');
    
    // Test desktop size (default)
    await page.setViewportSize({ width: 1440, height: 900 });
    
    const desktopGrid = await page.locator('.ds-dashboard-grid').evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    console.log('Desktop grid:', desktopGrid);
    expect(desktopGrid).toContain('490px 490px'); // 2 columns
    
    // Test tablet size
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(100); // Wait for CSS to update
    
    const tabletGrid = await page.locator('.ds-dashboard-grid').evaluate((el) => {
      return window.getComputedStyle(el).gridTemplateColumns;
    });
    
    console.log('Tablet grid:', tabletGrid);
    // Should be single column on tablet
    expect(tabletGrid).not.toContain('490px 490px');
    
    console.log('✅ Responsive design verification passed');
  });

  test('should log console messages for debugging', async ({ page }) => {
    console.log('🔍 Testing Debug Logging...');
    
    const consoleLogs: string[] = [];
    
    // Capture console logs
    page.on('console', (msg) => {
      if (msg.text().startsWith('Navigation clicked:')) {
        consoleLogs.push(msg.text());
      }
    });
    
    // Click a navigation item
    await page.locator('.ds-nav-item').filter({ hasText: 'Inflation' }).click();
    await page.waitForTimeout(100);
    
    console.log('Console logs captured:', consoleLogs);
    expect(consoleLogs.length).toBeGreaterThan(0);
    expect(consoleLogs[0]).toContain('Navigation clicked: inflation');
    
    console.log('✅ Debug logging verification passed');
  });
});

/**
 * CRITICAL FAILURE DETECTION
 * 
 * These tests specifically catch the issues that cost developers the most time:
 */

test.describe('Critical Failure Detection', () => {
  test('CRITICAL: Grid should NOT be single column (common failure)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // This is the most common failure: grid displays as single column
    const panels = page.locator('.ds-panel');
    
    // Get Y positions of all panels
    const positions = await panels.evaluateAll((elements) => {
      return elements.map((el) => el.getBoundingBox()?.y || 0);
    });
    
    // If all panels have different Y positions, they're stacked vertically (BAD)
    const uniqueYPositions = [...new Set(positions.map(y => Math.round(y)))];
    
    console.log('Panel Y positions:', positions);
    console.log('Unique Y positions:', uniqueYPositions);
    
    // Should have only 2 unique Y positions (2 rows), not 4 (stacked)
    expect(uniqueYPositions.length).toBeLessThan(4);
    
    if (uniqueYPositions.length === 4) {
      console.error('❌ CRITICAL FAILURE: Grid is displaying as single column!');
      console.error('This means custom Tailwind classes failed to compile.');
      console.error('Solution: Use .ds-dashboard-grid CSS class instead.');
      throw new Error('Grid layout failure detected');
    }
  });

  test('CRITICAL: Navigation should NOT be static (common failure)', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Get initial active item
    const initialActive = await page.locator('.ds-nav-item.active').textContent();
    
    // Click different item
    await page.locator('.ds-nav-item').filter({ hasText: 'Employment' }).click();
    await page.waitForTimeout(100);
    
    // Get new active item
    const newActive = await page.locator('.ds-nav-item.active').textContent();
    
    console.log(`Initial: ${initialActive}, After click: ${newActive}`);
    
    // If they're the same, navigation is broken
    if (initialActive === newActive) {
      console.error('❌ CRITICAL FAILURE: Navigation is not responding to clicks!');
      console.error('This means state management or click handlers are missing.');
      console.error('Solution: Add React useState and onClick handlers.');
      throw new Error('Navigation functionality failure detected');
    }
    
    expect(newActive).not.toBe(initialActive);
  });
});