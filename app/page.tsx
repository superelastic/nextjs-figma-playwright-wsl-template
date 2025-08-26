export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Next.js + Figma + Playwright Template</h1>
        <p className="text-gray-600 mb-8">WSL2-optimized starter template</p>
        
        <div className="text-left max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold">Quick Start:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Run diagnostics: <code className="bg-gray-100 px-2 py-1 rounded">node .claude/examples/next-app-setup.js</code></li>
            <li>Install dependencies: <code className="bg-gray-100 px-2 py-1 rounded">npm install</code></li>
            <li>Start development: <code className="bg-gray-100 px-2 py-1 rounded">npm run dev</code></li>
          </ol>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm">
              ✅ Figma MCP enabled<br/>
              ✅ Playwright direct API<br/>
              ✅ WSL2 optimized<br/>
              ✅ Routing issues prevented
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}