import React from 'react';

interface ChartPanelProps {
  title: string;
  source: string;
  children: React.ReactNode;
  className?: string;
}

export default function ChartPanel({ title, source, children, className = '' }: ChartPanelProps) {
  return (
    <div className={`ds-panel ${className}`}>
      <h3 className="ds-chart-title">{title}</h3>
      <p className="ds-chart-source">{source}</p>
      <div className="ds-chart-container">
        {children}
      </div>
    </div>
  );
}

/**
 * USAGE EXAMPLE:
 * 
 * import ChartPanel from './components/ChartPanel';
 * import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
 * 
 * const data = [
 *   { month: 'Jan', value: 100 },
 *   { month: 'Feb', value: 120 },
 * ];
 * 
 * function Dashboard() {
 *   return (
 *     <div className="ds-dashboard-grid">
 *       <ChartPanel title="CPI - Last Five Years" source="FRED">
 *         <ResponsiveContainer width="100%" height="100%">
 *           <LineChart data={data}>
 *             <XAxis dataKey="month" />
 *             <YAxis />
 *             <Line type="monotone" dataKey="value" stroke="#0F52BA" />
 *           </LineChart>
 *         </ResponsiveContainer>
 *       </ChartPanel>
 *     </div>
 *   );
 * }
 * 
 * FEATURES:
 * ✅ Consistent panel styling with design system
 * ✅ Proper typography hierarchy (title, source, chart)
 * ✅ Flexible chart container that works with any charting library
 * ✅ Optional className prop for customization
 * ✅ TypeScript support with proper interfaces
 * ✅ Optimized for 180px chart height (design system standard)
 * 
 * DEPENDENCIES REQUIRED:
 * - React
 * - CSS classes: .ds-panel, .ds-chart-title, .ds-chart-source, .ds-chart-container
 * 
 * RECOMMENDED CHART LIBRARY:
 * - recharts: npm install recharts
 */