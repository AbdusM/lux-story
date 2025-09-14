#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find all TypeScript and JavaScript files
function findSourceFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules, .next, out directories
        if (!['node_modules', '.next', 'out', 'scripts'].includes(item)) {
          traverse(fullPath);
        }
      } else if (item.match(/\.(ts|tsx|js|jsx)$/) && !item.includes('.d.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Replace console.log with logger.debug
function cleanConsoleLogs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file already imports logger
  const hasLoggerImport = content.includes("import { logger }") || content.includes("from '@/lib/logger'");
  
  // Replace console.log with logger.debug
  const originalContent = content;
  content = content.replace(/console\.log\(/g, 'logger.debug(');
  content = content.replace(/console\.info\(/g, 'logger.info(');
  content = content.replace(/console\.warn\(/g, 'logger.warn(');
  content = content.replace(/console\.error\(/g, 'logger.error(');
  
  if (content !== originalContent) {
    modified = true;
    
    // Add logger import if not present
    if (!hasLoggerImport) {
      // Find the last import statement
      const importRegex = /^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm;
      const imports = content.match(importRegex) || [];
      
      if (imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertIndex = lastImportIndex + lastImport.length;
        
        content = content.slice(0, insertIndex) + 
                 "\nimport { logger } from '@/lib/logger'" + 
                 content.slice(insertIndex);
      } else {
        // No imports, add at the top
        content = "import { logger } from '@/lib/logger'\n" + content;
      }
    }
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Cleaned: ${filePath}`);
    return true;
  }
  
  return false;
}

// Main execution
async function main() {
  console.log('🧹 Starting console.log cleanup...\n');
  
  const sourceDir = path.join(__dirname, '..');
  const files = findSourceFiles(sourceDir);
  
  let cleanedCount = 0;
  
  for (const file of files) {
    if (cleanConsoleLogs(file)) {
      cleanedCount++;
    }
  }
  
  console.log(`\n📊 Cleanup Summary:`);
  console.log(`Files processed: ${files.length}`);
  console.log(`Files cleaned: ${cleanedCount}`);
  console.log(`Console.log statements replaced with logger.debug`);
  console.log(`\n✅ Console.log cleanup complete!`);
}

main().catch(console.error);
