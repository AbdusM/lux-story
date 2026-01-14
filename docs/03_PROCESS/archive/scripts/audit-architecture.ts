#!/usr/bin/env npx tsx
/**
 * The "Honest Broker" - Automated Architectural Auditor
 *
 * PURPOSE: To systematically analyze the Grand Central Terminus codebase
 * and produce a data-driven "State of the Union" report. This script
 * validates the assumptions in our strategic documents against the
 * implemented reality.
 *
 * USAGE: tsx scripts/audit-architecture.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Project } from 'ts-morph';

// --- CONFIGURATION ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const ANALYSIS_TARGETS = {
  PLAYER_PERSONA: 'lib/player-persona.ts',
  CAREER_ANALYTICS: 'lib/career-analytics.ts',
  SIMPLE_ANALYTICS: 'lib/simple-career-analytics.ts',
  GAME_STATE: 'lib/character-state.ts',
  SKILLS_SYSTEM: 'lib/2030-skills-system.ts',
  DEV_PSYCH: 'lib/developmental-psychology-system.ts',
  NEUROSCIENCE: 'lib/neuroscience-system.ts',
  COGNITIVE_DEV: 'lib/cognitive-development-system.ts',
  BIRMINGHAM_OPPS: 'lib/birmingham-opportunities.ts',
  SKILL_TRACKER: 'lib/skill-tracker.ts',
  SKILL_PROFILE_ADAPTER: 'lib/skill-profile-adapter.ts',
  DIALOGUE_GRAPHS: 'content/',
  UI_DASHBOARDS: 'components/admin/'
};

// --- UTILITY FUNCTIONS ---

function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function countLines(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

function analyzeTypeScriptFile(project: Project, relativePath: string): {
  exists: boolean;
  lineCount: number;
  exports: string[];
  interfaces: string[];
  classes: string[];
} {
  const fullPath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, lineCount: 0, exports: [], interfaces: [], classes: [] };
  }

  const lineCount = countLines(fullPath);

  const sourceFile = project.getSourceFile(fullPath);
  if (!sourceFile) {
    return { exists: true, lineCount, exports: [], interfaces: [], classes: [] };
  }

  const exportDeclarations = sourceFile.getExportedDeclarations();
  const exports: string[] = [];
  exportDeclarations.forEach((declarations, name) => {
    exports.push(name);
  });

  const interfaces = sourceFile.getInterfaces().map(i => i.getName());
  const classes = sourceFile.getClasses().map(c => c.getName() || 'anonymous');

  return {
    exists: true,
    lineCount,
    exports,
    interfaces,
    classes,
  };
}

function analyzeDialogueGraphs(directoryPath: string): {
  count: number;
  totalNodes: number;
  totalChoices: number;
  characterArcs: string[]
} {
  const fullPath = path.join(ROOT_DIR, directoryPath);
  const files = fs.readdirSync(fullPath).filter(file =>
    file.endsWith('-dialogue-graph.ts') || file.endsWith('-revisit-graph.ts')
  );

  let totalNodes = 0;
  let totalChoices = 0;
  const characterArcs = new Set<string>();

  files.forEach(file => {
    const content = fs.readFileSync(path.join(fullPath, file), 'utf-8');
    const nodes = (content.match(/nodeId:/g) || []).length;
    const choices = (content.match(/choiceId:/g) || []).length;
    totalNodes += nodes;
    totalChoices += choices;
    characterArcs.add(file.split('-')[0]);
  });

  return {
    count: files.length,
    totalNodes,
    totalChoices,
    characterArcs: Array.from(characterArcs),
  };
}

function analyzeDashboardComponent(project: Project, relativePath: string): {
  exists: boolean;
  lineCount: number;
  dataProps: string[];
  staticTextCount: number;
  dataDependencies: string[];
} {
  const fullPath = path.join(ROOT_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    return { exists: false, lineCount: 0, dataProps: [], staticTextCount: 0, dataDependencies: [] };
  }

  const lineCount = countLines(fullPath);
  const content = fs.readFileSync(fullPath, 'utf-8');

  const sourceFile = project.getSourceFile(fullPath);
  if (!sourceFile) {
    return { exists: true, lineCount, dataProps: [], staticTextCount: 0, dataDependencies: [] };
  }

  // Find data dependencies (imports from lib folder)
  const dataDependencies = sourceFile.getImportDeclarations()
    .map(imp => imp.getModuleSpecifierValue())
    .filter(spec => spec.startsWith('@/lib') || spec.startsWith('./lib') || spec.startsWith('../lib'));

  // Count static text nodes (rough proxy for placeholder content)
  const staticTextCount = (content.match(/>([^<>{]+)</g) || []).length;

  return {
    exists: true,
    lineCount,
    dataProps: [], // We'll extract this if needed
    staticTextCount,
    dataDependencies,
  };
}

// --- MAIN AUDIT LOGIC ---

async function runAudit() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   THE HONEST BROKER - ARCHITECTURAL AUDIT REPORT');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Root Directory: ${ROOT_DIR}\n`);

  const project = new Project({
    tsConfigFilePath: path.join(ROOT_DIR, 'tsconfig.json'),
  });

  // --- SECTION 1: CORE DATA SYSTEMS ANALYSIS ---
  console.log('─────────────────────────────────────────────────────────────');
  console.log('1. CORE DATA SYSTEMS ANALYSIS');
  console.log('─────────────────────────────────────────────────────────────\n');

  const systems = [
    { name: 'Player Persona', key: 'PLAYER_PERSONA' as const },
    { name: 'Career Analytics (Dormant?)', key: 'CAREER_ANALYTICS' as const },
    { name: 'Simple Career Analytics', key: 'SIMPLE_ANALYTICS' as const },
    { name: 'Skill Tracker', key: 'SKILL_TRACKER' as const },
    { name: 'Skill Profile Adapter', key: 'SKILL_PROFILE_ADAPTER' as const },
    { name: '2030 Skills System (Dormant?)', key: 'SKILLS_SYSTEM' as const },
    { name: 'Developmental Psychology (Dormant?)', key: 'DEV_PSYCH' as const },
    { name: 'Neuroscience (Dormant?)', key: 'NEUROSCIENCE' as const },
    { name: 'Cognitive Development (Dormant?)', key: 'COGNITIVE_DEV' as const },
  ];

  for (const system of systems) {
    const analysis = analyzeTypeScriptFile(project, ANALYSIS_TARGETS[system.key]);
    console.log(`[SYSTEM]: ${system.name}`);
    console.log(`  Path: ${ANALYSIS_TARGETS[system.key]}`);
    console.log(`  Status: ${analysis.exists ? '✅ FOUND' : '❌ MISSING'}`);

    if (analysis.exists) {
      console.log(`  Size: ${analysis.lineCount} lines`);
      if (analysis.classes.length > 0) {
        console.log(`  Classes: ${analysis.classes.join(', ')}`);
      }
      if (analysis.interfaces.length > 0) {
        console.log(`  Interfaces: ${analysis.interfaces.slice(0, 3).join(', ')}${analysis.interfaces.length > 3 ? '...' : ''}`);
      }

      // Check for usage in the codebase
      const sourceFile = project.getSourceFile(path.join(ROOT_DIR, ANALYSIS_TARGETS[system.key]));
      const references = sourceFile?.getReferencingSourceFiles() || [];
      const usageStatus = references.length > 0
        ? `🔥 ACTIVE (${references.length} references)`
        : '❄️  DORMANT (0 references)';
      console.log(`  Integration: ${usageStatus}`);

      if (references.length > 0 && references.length < 5) {
        const refPaths = references
          .map(sf => path.relative(ROOT_DIR, sf.getFilePath()))
          .filter(p => !p.includes('node_modules'));
        if (refPaths.length > 0) {
          console.log(`  Referenced in: ${refPaths.slice(0, 3).join(', ')}`);
        }
      }
    }
    console.log('');
  }

  // --- SECTION 2: CONTENT & NARRATIVE ANALYSIS ---
  console.log('─────────────────────────────────────────────────────────────');
  console.log('2. CONTENT & NARRATIVE ANALYSIS');
  console.log('─────────────────────────────────────────────────────────────\n');

  const birminghamAnalysis = analyzeTypeScriptFile(project, ANALYSIS_TARGETS.BIRMINGHAM_OPPS);
  console.log('[DATABASE]: Birmingham Opportunities');
  console.log(`  Path: ${ANALYSIS_TARGETS.BIRMINGHAM_OPPS}`);
  console.log(`  Status: ${birminghamAnalysis.exists ? '✅ FOUND' : '❌ MISSING'}`);
  if (birminghamAnalysis.exists) {
    const content = fs.readFileSync(path.join(ROOT_DIR, ANALYSIS_TARGETS.BIRMINGHAM_OPPS), 'utf-8');
    const opportunityCount = (content.match(/id:/g) || []).length;
    console.log(`  Size: ${birminghamAnalysis.lineCount} lines`);
    console.log(`  Opportunities Cataloged: ${opportunityCount}`);
  }
  console.log('');

  const dialogueAnalysis = analyzeDialogueGraphs(ANALYSIS_TARGETS.DIALOGUE_GRAPHS);
  console.log('[NARRATIVE]: Dialogue Graphs');
  console.log(`  Path: ${ANALYSIS_TARGETS.DIALOGUE_GRAPHS}`);
  console.log(`  Character Arcs: ${dialogueAnalysis.characterArcs.join(', ')} (${dialogueAnalysis.characterArcs.length} total)`);
  console.log(`  Total Dialogue Graphs: ${dialogueAnalysis.count}`);
  console.log(`  Total Dialogue Nodes: ${dialogueAnalysis.totalNodes}`);
  console.log(`  Total Choices: ${dialogueAnalysis.totalChoices}`);
  console.log('');

  // --- SECTION 3: STORAGE ARCHITECTURE ---
  console.log('─────────────────────────────────────────────────────────────');
  console.log('3. STORAGE & PERSISTENCE');
  console.log('─────────────────────────────────────────────────────────────\n');

  const packageJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf-8'));
  const hasSupabase = packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js'];
  console.log('[BACKEND]: Supabase Integration');
  console.log(`  Status: ${hasSupabase ? '✅ INSTALLED' : '❌ NOT INSTALLED'}`);
  console.log('');

  console.log('[FRONTEND]: LocalStorage Usage');
  const localStorageUsages: string[] = [];
  project.getSourceFiles().forEach(sf => {
    const filePath = sf.getFilePath();
    if (!filePath.includes('node_modules') && sf.getFullText().includes('localStorage')) {
      localStorageUsages.push(path.relative(ROOT_DIR, filePath));
    }
  });
  console.log(`  Direct localStorage calls: ${localStorageUsages.length} files`);
  if (localStorageUsages.length > 0 && localStorageUsages.length < 10) {
    console.log(`  Files: ${localStorageUsages.join(', ')}`);
  }
  console.log('');

  // --- SECTION 4: PRESENTATION LAYER ---
  console.log('─────────────────────────────────────────────────────────────');
  console.log('4. PRESENTATION & UI LAYER');
  console.log('─────────────────────────────────────────────────────────────\n');

  const adminDashboardPath = path.join(ROOT_DIR, ANALYSIS_TARGETS.UI_DASHBOARDS);
  let dashboardFiles: string[] = [];
  if (fs.existsSync(adminDashboardPath)) {
    dashboardFiles = fs.readdirSync(adminDashboardPath).filter(f => f.endsWith('.tsx'));
  }
  console.log('[UI]: Admin Dashboards');
  console.log(`  Path: ${ANALYSIS_TARGETS.UI_DASHBOARDS}`);
  console.log(`  Status: ${dashboardFiles.length > 0 ? `✅ FOUND (${dashboardFiles.length} components)` : '❌ NOT FOUND'}`);
  console.log('');

  if (dashboardFiles.length > 0) {
    for (const file of dashboardFiles) {
      const relativePath = path.join(ANALYSIS_TARGETS.UI_DASHBOARDS, file);
      const analysis = analyzeDashboardComponent(project, relativePath);
      console.log(`  [COMPONENT]: ${file}`);
      if (analysis.exists) {
        console.log(`    Size: ${analysis.lineCount} lines`);
        console.log(`    Data Dependencies: ${analysis.dataDependencies.length > 0 ? analysis.dataDependencies.join(', ') : 'None'}`);
        console.log(`    Static Text Nodes: ${analysis.staticTextCount} (high count = placeholder data)`);

        const content = fs.readFileSync(path.join(ROOT_DIR, relativePath), 'utf-8');
        const isDataConnected = /useQuery|useState|useEffect/i.test(content);
        console.log(`    Data Connection: ${isDataConnected ? '🔥 LIKELY CONNECTED' : '❄️  LIKELY STATIC/MOCK'}`);
      }
      console.log('');
    }
  }

  // --- FINAL SYNTHESIS ---
  console.log('─────────────────────────────────────────────────────────────');
  console.log('5. STRATEGIC SYNTHESIS');
  console.log('─────────────────────────────────────────────────────────────\n');

  const skillsSystemFile = project.getSourceFile(path.join(ROOT_DIR, ANALYSIS_TARGETS.SKILLS_SYSTEM));
  const skillsReferences = skillsSystemFile?.getReferencingSourceFiles() || [];

  console.log('**Career Readiness Pipeline:**');
  console.log('  Data Sources: Player Persona, Simple Career Analytics');
  console.log('  Core Logic: Career Analytics Engine status pending');
  console.log('  Assessment: Requires activation of dormant systems\n');

  console.log('**Birmingham Opportunity Flow:**');
  console.log('  Data Sources: Birmingham DB (✅), Career Interests (✅)');
  console.log('  Core Logic: Requires aggregation across users');
  console.log('  Blocker: Client-side persistence limits cross-user analysis\n');

  console.log('**Skills Development Dashboard:**');
  console.log(`  Data Source: 2030 Skills System - ${skillsReferences.length > 0 ? '🔥 ACTIVE' : '❄️  DORMANT'}`);
  console.log(`  Integration Status: ${skillsReferences.length} references found`);
  console.log('  Assessment: ' + (skillsReferences.length === 0
    ? 'HIGHEST POTENTIAL - Code exists but not activated'
    : 'System is integrated and active'));
  console.log('');

  console.log('═══════════════════════════════════════════════════════════');
  console.log('AUDIT COMPLETE');
  console.log('═══════════════════════════════════════════════════════════\n');
}

runAudit().catch(error => {
  console.error('❌ Audit failed:', error);
  process.exit(1);
});
