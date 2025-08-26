/**
 * Next.js App Router Setup Script
 * Ensures correct structure to prevent 404 routing issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class NextAppSetup {
  constructor(projectRoot = process.cwd()) {
    this.projectRoot = projectRoot;
    this.issues = [];
    this.fixes = [];
  }

  // Check for zombie processes
  checkZombieProcesses() {
    console.log('🔍 Checking for zombie Next.js processes...');
    
    try {
      const processes = execSync('ps aux | grep -E "next-server|next dev" | grep -v grep', { encoding: 'utf8' });
      if (processes) {
        this.issues.push('Found running Next.js processes that may cause port conflicts');
        this.fixes.push('Kill zombie processes: pkill -f "next-server"');
        
        // Extract process info
        const lines = processes.split('\n').filter(Boolean);
        lines.forEach(line => {
          const parts = line.split(/\s+/);
          const pid = parts[1];
          const startTime = parts[8];
          console.log(`  ⚠️  PID ${pid} started at ${startTime}`);
        });
      }
    } catch (e) {
      console.log('  ✅ No zombie processes found');
    }
  }

  // Check for duplicate config files
  checkConfigFiles() {
    console.log('🔍 Checking Next.js config files...');
    
    const configFiles = ['next.config.js', 'next.config.ts', 'next.config.mjs'];
    const foundConfigs = configFiles.filter(file => 
      fs.existsSync(path.join(this.projectRoot, file))
    );

    if (foundConfigs.length === 0) {
      this.issues.push('No Next.js config file found');
      this.fixes.push('Create next.config.js');
    } else if (foundConfigs.length > 1) {
      this.issues.push(`Multiple config files found: ${foundConfigs.join(', ')}`);
      this.fixes.push(`Keep only one config file (recommend: next.config.js)`);
      console.log(`  ⚠️  Found: ${foundConfigs.join(', ')}`);
    } else {
      console.log(`  ✅ Single config file: ${foundConfigs[0]}`);
    }
  }

  // Check app directory structure
  checkAppDirectory() {
    console.log('🔍 Checking app directory structure...');
    
    const appPath = path.join(this.projectRoot, 'app');
    const srcAppPath = path.join(this.projectRoot, 'src', 'app');
    
    // Check if app exists at root
    if (!fs.existsSync(appPath)) {
      // Check if it's under src/
      if (fs.existsSync(srcAppPath)) {
        this.issues.push('App directory is under src/ instead of root');
        this.fixes.push('Move app directory to root: mv src/app app');
        console.log('  ⚠️  App directory found at src/app (should be at root)');
      } else {
        this.issues.push('No app directory found');
        this.fixes.push('Create app directory with layout.tsx and page.tsx');
        console.log('  ❌ No app directory found');
      }
      return;
    }
    
    // Check for nested app directory
    const nestedAppPath = path.join(appPath, 'app');
    if (fs.existsSync(nestedAppPath)) {
      this.issues.push('Nested app/app directory detected');
      this.fixes.push('Fix nested structure: mv app/app/* app/ && rmdir app/app');
      console.log('  ⚠️  Nested app/app structure detected');
      return;
    }
    
    // Check for required files
    const requiredFiles = ['layout.tsx', 'page.tsx'];
    const missingFiles = requiredFiles.filter(file => 
      !fs.existsSync(path.join(appPath, file))
    );
    
    if (missingFiles.length > 0) {
      this.issues.push(`Missing required files in app/: ${missingFiles.join(', ')}`);
      this.fixes.push(`Create missing files: ${missingFiles.join(', ')}`);
      console.log(`  ⚠️  Missing: ${missingFiles.join(', ')}`);
    } else {
      console.log('  ✅ App directory structure correct');
    }
  }

  // Check for .next cache issues
  checkBuildCache() {
    console.log('🔍 Checking build cache...');
    
    const nextPath = path.join(this.projectRoot, '.next');
    if (fs.existsSync(nextPath)) {
      const stats = fs.statSync(nextPath);
      const ageInHours = (Date.now() - stats.mtime) / (1000 * 60 * 60);
      
      if (ageInHours > 24) {
        console.log(`  ⚠️  .next cache is ${Math.round(ageInHours)} hours old`);
        this.fixes.push('Clear old cache: rm -rf .next/');
      } else {
        console.log(`  ✅ .next cache is recent (${Math.round(ageInHours)} hours old)`);
      }
    }
  }

  // Check port availability
  checkPorts() {
    console.log('🔍 Checking port availability...');
    
    const ports = [3000, 3001, 3002];
    ports.forEach(port => {
      try {
        execSync(`lsof -i :${port} | grep LISTEN`, { encoding: 'utf8' });
        this.issues.push(`Port ${port} is in use`);
        console.log(`  ⚠️  Port ${port} is in use`);
      } catch (e) {
        console.log(`  ✅ Port ${port} is available`);
      }
    });
  }

  // Generate fix script
  generateFixScript() {
    if (this.fixes.length === 0) return null;
    
    const script = `#!/bin/bash
# Auto-generated fix script for Next.js routing issues

echo "🔧 Fixing Next.js setup issues..."

# Kill zombie processes
pkill -f "next-server" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Clear caches
rm -rf .next/ .turbo/ node_modules/.cache/

${this.fixes.map(fix => `# ${fix}`).join('\n')}

echo "✅ Fixes applied. Try running: npm run dev"
`;
    
    return script;
  }

  // Create minimal working files
  createMinimalApp() {
    const appDir = path.join(this.projectRoot, 'app');
    
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    
    // Create layout.tsx if missing
    const layoutPath = path.join(appDir, 'layout.tsx');
    if (!fs.existsSync(layoutPath)) {
      const layoutContent = `export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`;
      fs.writeFileSync(layoutPath, layoutContent);
      console.log('  ✅ Created app/layout.tsx');
    }
    
    // Create page.tsx if missing
    const pagePath = path.join(appDir, 'page.tsx');
    if (!fs.existsSync(pagePath)) {
      const pageContent = `export default function Home() {
  return (
    <div>
      <h1>Next.js App Router Working!</h1>
    </div>
  )
}`;
      fs.writeFileSync(pagePath, pageContent);
      console.log('  ✅ Created app/page.tsx');
    }
    
    // Create next.config.js if missing
    const configPath = path.join(this.projectRoot, 'next.config.js');
    if (!fs.existsSync(configPath)) {
      const configContent = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig`;
      fs.writeFileSync(configPath, configContent);
      console.log('  ✅ Created next.config.js');
    }
  }

  // Run all checks
  async runDiagnostics() {
    console.log('🚀 Next.js App Router Diagnostic Tool\n');
    
    this.checkZombieProcesses();
    this.checkConfigFiles();
    this.checkAppDirectory();
    this.checkBuildCache();
    this.checkPorts();
    
    console.log('\n📋 Summary:');
    
    if (this.issues.length === 0) {
      console.log('  ✅ No issues found! Your Next.js setup looks good.');
    } else {
      console.log(`  ⚠️  Found ${this.issues.length} issue(s):\n`);
      this.issues.forEach((issue, i) => {
        console.log(`    ${i + 1}. ${issue}`);
      });
      
      console.log('\n🔧 Recommended fixes:\n');
      this.fixes.forEach((fix, i) => {
        console.log(`    ${i + 1}. ${fix}`);
      });
      
      const fixScript = this.generateFixScript();
      if (fixScript) {
        const scriptPath = path.join(this.projectRoot, 'fix-next-routing.sh');
        fs.writeFileSync(scriptPath, fixScript);
        fs.chmodSync(scriptPath, '755');
        console.log(`\n  💡 Fix script generated: ./fix-next-routing.sh`);
        console.log('     Run: bash ./fix-next-routing.sh');
      }
    }
    
    // Offer to create minimal app
    if (this.issues.some(issue => issue.includes('app directory'))) {
      console.log('\n  💡 Want to create a minimal working app structure?');
      console.log('     Run: node next-app-setup.js --create-minimal');
    }
  }
}

// CLI execution
if (require.main === module) {
  const setup = new NextAppSetup();
  
  if (process.argv.includes('--create-minimal')) {
    setup.createMinimalApp();
    console.log('\n✅ Minimal app structure created!');
  } else if (process.argv.includes('--fix')) {
    execSync('pkill -f "next-server" 2>/dev/null || true');
    execSync('rm -rf .next/ .turbo/ node_modules/.cache/');
    console.log('✅ Applied automatic fixes');
  } else {
    setup.runDiagnostics();
  }
}

module.exports = NextAppSetup;