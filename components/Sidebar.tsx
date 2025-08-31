'use client';

import React, { useState } from 'react';
import {
  TrendingUp,
  Users,
  Percent,
  TrendingDown,
  DollarSign,
  Home,
  ShoppingCart,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: 'key-indicators', label: 'Key Indicators', icon: TrendingUp },
  { id: 'inflation', label: 'Inflation', icon: TrendingUp },
  { id: 'employment', label: 'Employment', icon: Users },
  { id: 'interest-rates', label: 'Interest Rates', icon: Percent },
  { id: 'economic-growth', label: 'Economic Growth', icon: TrendingDown },
  { id: 'exchange-rates', label: 'Exchange Rates', icon: DollarSign },
  { id: 'housing', label: 'Housing', icon: Home },
  { id: 'consumer-spending', label: 'Consumer Spending', icon: ShoppingCart },
];

interface SidebarProps {
  onSectionChange?: (sectionId: string) => void;
}

export default function Sidebar({ onSectionChange }: SidebarProps) {
  // State management for active navigation item
  const [activeItem, setActiveItem] = useState<string>('key-indicators');

  // Click handler for navigation items
  const handleNavClick = (itemId: string) => {
    console.log(`Navigation clicked: ${itemId}`);
    setActiveItem(itemId);
    
    // Optional callback for parent component integration
    onSectionChange?.(itemId);
  };

  return (
    <aside className="ds-sidebar">
      <div>
        <h1 className="ds-sidebar-title">Dashboard Template</h1>
        <p className="ds-sidebar-subtitle">Next.js + Figma + Playwright</p>
      </div>
      
      <nav className="ds-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`ds-nav-item ${isActive ? 'active' : ''}`}
              aria-label={`Navigate to ${item.label}`}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="ds-footer">
        <p className="ds-footer-text">
          Template ready for<br />
          dashboard development
        </p>
      </div>
    </aside>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import Sidebar from './components/Sidebar';
 * 
 * function App() {
 *   const handleSectionChange = (sectionId: string) => {
 *     console.log('Section changed to:', sectionId);
 *     // Update charts, load data, etc.
 *   };
 * 
 *   return (
 *     <div className="flex h-screen">
 *       <Sidebar onSectionChange={handleSectionChange} />
 *       <main className="flex-1">
 *         {/* Your dashboard content */}
 *       </main>
 *     </div>
 *   );
 * }
 * 
 * FEATURES:
 * ✅ Full click functionality with state management
 * ✅ Visual active state that matches Figma designs
 * ✅ Optional callback for parent component integration
 * ✅ Accessibility attributes (aria-label, button type)
 * ✅ Console logging for debugging
 * ✅ TypeScript support with proper interfaces
 * 
 * DEPENDENCIES REQUIRED:
 * - lucide-react: npm install lucide-react
 * - React with hooks support
 * - CSS classes: .ds-sidebar, .ds-nav-item, .active (see design-system.css)
 */