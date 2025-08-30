import React from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onSectionChange?: (sectionId: string) => void;
}

export default function DashboardLayout({ children, onSectionChange }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-bg-secondary">
      <Sidebar onSectionChange={onSectionChange} />
      
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="ds-title">Economic Indicators Dashboard</h1>
            <p className="ds-subtitle mt-2">
              Real-time economic data from the Federal Reserve Economic Data (FRED) system
            </p>
          </div>
          
          <div className="ds-dashboard-grid">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import DashboardLayout from './components/DashboardLayout';
 * import ChartPanel from './components/ChartPanel';
 * 
 * function App() {
 *   const handleSectionChange = (sectionId: string) => {
 *     console.log('Section changed to:', sectionId);
 *     // Load data for selected section
 *     // Update charts
 *     // Update URL routing
 *   };
 * 
 *   return (
 *     <DashboardLayout onSectionChange={handleSectionChange}>
 *       <ChartPanel title="Chart 1" source="FRED">
 *         {/* Your chart component */}
 *       </ChartPanel>
 *       <ChartPanel title="Chart 2" source="FRED">
 *         {/* Your chart component */}
 *       </ChartPanel>
 *       <ChartPanel title="Chart 3" source="FRED">
 *         {/* Your chart component */}
 *       </ChartPanel>
 *       <ChartPanel title="Chart 4" source="FRED">
 *         {/* Your chart component */}
 *       </ChartPanel>
 *     </DashboardLayout>
 *   );
 * }
 * 
 * FEATURES:
 * ✅ Complete dashboard layout with sidebar + main content
 * ✅ 2x2 grid layout that actually works (using CSS, not broken Tailwind)
 * ✅ Proper header with title and subtitle
 * ✅ Responsive overflow handling
 * ✅ Integration callback for section changes
 * ✅ Matches Figma design specifications exactly
 * 
 * LAYOUT SPECIFICATIONS:
 * - Sidebar: 280px fixed width
 * - Main content: Flex-1 with 32px padding
 * - Grid: 2x2 layout with 20px gaps
 * - Chart height: 180px standard
 * 
 * DEPENDENCIES REQUIRED:
 * - React
 * - Sidebar component (included)
 * - CSS classes: .ds-dashboard-grid, .ds-title, .ds-subtitle, .bg-bg-secondary
 */