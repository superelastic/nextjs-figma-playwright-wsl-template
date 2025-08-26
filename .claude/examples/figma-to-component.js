/**
 * Figma to Component Workflow Example
 * Demonstrates the full workflow from Figma design to implemented component
 */

// Example of processing Figma MCP output to create a React component

// Step 1: Raw output from Figma MCP get_code
const figmaOutput = {
  code: `
    export default function Component() {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-800">Chart Title</h3>
            <p className="text-xs text-gray-500 mt-1">Subtitle</p>
          </div>
          <div className="h-64">
            {/* Chart content */}
          </div>
        </div>
      );
    }
  `,
  styles: {
    shadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
    borderRadius: "8px",
    padding: "24px"
  }
};

// Step 2: Transform to production-ready component
function transformFigmaComponent(figmaCode, componentName = 'ChartCard') {
  // Extract className patterns
  const classPattern = /className="([^"]*)"/g;
  const classes = [];
  let match;
  
  while ((match = classPattern.exec(figmaCode)) !== null) {
    classes.push(match[1]);
  }
  
  // Create TypeScript interface
  const tsInterface = `
interface ${componentName}Props {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}
  `.trim();
  
  // Create enhanced component
  const enhancedComponent = `
'use client';

import React from 'react';

${tsInterface}

export default function ${componentName}({ 
  title, 
  subtitle, 
  children, 
  className = '' 
}: ${componentName}Props) {
  return (
    <div className={\`bg-white rounded-lg shadow-sm border border-gray-200 p-6 \${className}\`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}
  `.trim();
  
  return {
    component: enhancedComponent,
    extractedClasses: classes,
    interface: tsInterface
  };
}

// Step 3: Create component with Recharts integration
const createChartComponent = () => {
  return `
'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle: string;
  data: any[];
  dataKey: string;
  color: string;
  yAxisLabel?: string;
}

export default function ChartCard({ 
  title, 
  subtitle, 
  data, 
  dataKey, 
  color, 
  yAxisLabel 
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={data} 
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#e5e7eb"
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              stroke="#e5e7eb"
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft', 
                style: { fontSize: 11, fill: '#6b7280' } 
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
          View details →
        </button>
      </div>
    </div>
  );
}
  `.trim();
};

// Step 4: Example usage in a dashboard
const dashboardExample = `
import ChartCard from './ChartCard';
import { generateCPIData } from '../utils/mockData';

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard
        title="CPI - last five years"
        subtitle="FRED"
        data={generateCPIData()}
        dataKey="value"
        color="#3b82f6"
        yAxisLabel="Index"
      />
      {/* Add more charts */}
    </div>
  );
}
`;

// Step 5: Figma design tokens to Tailwind config
const designTokensExample = {
  // From Figma
  figmaTokens: {
    colors: {
      primary: "#3b82f6",
      secondary: "#10b981",
      gray800: "#1f2937",
      gray600: "#4b5563"
    },
    spacing: {
      cardPadding: "24px",
      sectionGap: "24px"
    }
  },
  
  // To Tailwind config
  tailwindConfig: `
    // tailwind.config.js
    module.exports = {
      theme: {
        extend: {
          colors: {
            'chart-blue': '#3b82f6',
            'chart-green': '#10b981',
            'chart-purple': '#6366f1',
            'chart-orange': '#f59e0b'
          }
        }
      }
    }
  `
};

// Export all examples
module.exports = {
  figmaOutput,
  transformFigmaComponent,
  createChartComponent,
  dashboardExample,
  designTokensExample
};

// Demo transformation
if (require.main === module) {
  console.log('Figma to Component Transformation Example\n');
  
  const result = transformFigmaComponent(figmaOutput.code);
  console.log('Extracted Classes:', result.extractedClasses);
  console.log('\nGenerated Interface:');
  console.log(result.interface);
  console.log('\nEnhanced Component:');
  console.log(result.component);
}