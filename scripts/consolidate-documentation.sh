#!/bin/bash

# 📚 Documentation Consolidation Script
# Systematic cleanup and organization of project documentation

set -e  # Exit on any error

echo "🚀 Starting Documentation Consolidation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create backup
echo -e "${BLUE}📦 Creating backup of all documentation...${NC}"
mkdir -p backup/documentation-$(date +%Y%m%d-%H%M%S)
cp *.md backup/documentation-$(date +%Y%m%d-%H%M%S)/ 2>/dev/null || true
echo -e "${GREEN}✅ Backup created${NC}"

# Create new directory structure
echo -e "${BLUE}📁 Creating new directory structure...${NC}"
mkdir -p docs/{getting-started,architecture,features/{characters,analytics,admin-dashboard,user-experience},development,deployment,reference/{api,database,troubleshooting}}
mkdir -p archive/{completed-phases,obsolete-plans,historical-analysis,legacy-docs}
echo -e "${GREEN}✅ Directory structure created${NC}"

# Phase 1: Move critical files
echo -e "${BLUE}🔴 Moving critical files...${NC}"
# README stays in root
# CONTRIBUTING.md stays in root  
# LICENSE stays in root
# SECURITY.md stays in root
# package.json stays in root
echo -e "${GREEN}✅ Critical files maintained in root${NC}"

# Phase 2: Consolidate core system documentation
echo -e "${BLUE}🟡 Consolidating core system documentation...${NC}"

# Choice Design System
if [ -f "BEST_CHOICE_DESIGN_SYSTEM.md" ]; then
    cp "BEST_CHOICE_DESIGN_SYSTEM.md" "docs/architecture/choice-system.md"
    echo -e "${GREEN}✅ Choice system documentation moved${NC}"
fi

# Engagement Quality System
if [ -f "ENGAGEMENT_QUALITY_ANALYZER_SUMMARY.md" ]; then
    cp "ENGAGEMENT_QUALITY_ANALYZER_SUMMARY.md" "docs/features/analytics/engagement-system.md"
    echo -e "${GREEN}✅ Analytics documentation moved${NC}"
fi

# Reciprocity Engine
if [ -f "RECIPROCITY_ENGINE_COMPLETE.md" ]; then
    cp "RECIPROCITY_ENGINE_COMPLETE.md" "docs/architecture/character-system.md"
    echo -e "${GREEN}✅ Character system documentation moved${NC}"
fi

# Strategic Plan
if [ -f "STRATEGIC_MASTER_PLAN.md" ]; then
    cp "STRATEGIC_MASTER_PLAN.md" "docs/planning/strategic-plan.md"
    echo -e "${GREEN}✅ Strategic plan moved${NC}"
fi

# Development Methodology
if [ -f "SOFTWARE_DEVELOPMENT_PLAN_NARRATIVE_ENHANCEMENT.md" ]; then
    cp "SOFTWARE_DEVELOPMENT_PLAN_NARRATIVE_ENHANCEMENT.md" "docs/development/methodology.md"
    echo -e "${GREEN}✅ Development methodology moved${NC}"
fi

# Phase 3: Organize operational documentation
echo -e "${BLUE}🟢 Organizing operational documentation...${NC}"

# Current Status
if [ -f "FINAL_STATUS_OCTOBER_2025.md" ]; then
    mkdir -p docs/status
    cp "FINAL_STATUS_OCTOBER_2025.md" "docs/status/current-status.md"
    echo -e "${GREEN}✅ Current status moved${NC}"
fi

# Deployment Documentation
if [ -f "DEPLOYMENT_READY_STATUS.md" ]; then
    cp "DEPLOYMENT_READY_STATUS.md" "docs/deployment/readiness.md"
    echo -e "${GREEN}✅ Deployment readiness moved${NC}"
fi

if [ -f "PRODUCTION_READY.md" ]; then
    cp "PRODUCTION_READY.md" "docs/deployment/production-status.md"
    echo -e "${GREEN}✅ Production status moved${NC}"
fi

# Admin Dashboard Documentation
mkdir -p docs/features/admin-dashboard
if [ -f "ADMIN_DASHBOARD_DEBUG_STATUS.md" ]; then
    cp "ADMIN_DASHBOARD_DEBUG_STATUS.md" "docs/features/admin-dashboard/debugging.md"
    echo -e "${GREEN}✅ Admin dashboard debugging moved${NC}"
fi

if [ -f "ADMIN_DASHBOARD_FIX_SUMMARY.md" ]; then
    cp "ADMIN_DASHBOARD_FIX_SUMMARY.md" "docs/features/admin-dashboard/fixes.md"
    echo -e "${GREEN}✅ Admin dashboard fixes moved${NC}"
fi

if [ -f "ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md" ]; then
    cp "ADMIN_DASHBOARD_IMPLEMENTATION_PLAN.md" "docs/features/admin-dashboard/implementation.md"
    echo -e "${GREEN}✅ Admin dashboard implementation moved${NC}"
fi

if [ -f "DASHBOARD_IMPROVEMENT_BIBLE.md" ]; then
    cp "DASHBOARD_IMPROVEMENT_BIBLE.md" "docs/features/admin-dashboard/improvements.md"
    echo -e "${GREEN}✅ Dashboard improvements moved${NC}"
fi

if [ -f "DASHBOARD_SCREENS_SPECIFICATION.md" ]; then
    cp "DASHBOARD_SCREENS_SPECIFICATION.md" "docs/features/admin-dashboard/screens.md"
    echo -e "${GREEN}✅ Dashboard screens moved${NC}"
fi

# Testing Documentation
if [ -f "TESTING_INFRASTRUCTURE.md" ]; then
    cp "TESTING_INFRASTRUCTURE.md" "docs/development/testing.md"
    echo -e "${GREEN}✅ Testing infrastructure moved${NC}"
fi

# Quality Documentation
mkdir -p docs/quality/audits
if [ -f "COMPREHENSIVE_AUDIT_REPORT.md" ]; then
    cp "COMPREHENSIVE_AUDIT_REPORT.md" "docs/quality/audits/comprehensive-2025.md"
    echo -e "${GREEN}✅ Comprehensive audit moved${NC}"
fi

if [ -f "LINTER_COMPREHENSIVE_REPORT.md" ]; then
    cp "LINTER_COMPREHENSIVE_REPORT.md" "docs/quality/linting-report.md"
    echo -e "${GREEN}✅ Linting report moved${NC}"
fi

if [ -f "CODE_QUALITY_FIXES_SUMMARY.md" ]; then
    cp "CODE_QUALITY_FIXES_SUMMARY.md" "docs/quality/code-quality-fixes.md"
    echo -e "${GREEN}✅ Code quality fixes moved${NC}"
fi

# Narrative Documentation
mkdir -p docs/features/narrative
if [ -f "ATMOSPHERIC_INTRO_SUMMARY.md" ]; then
    cp "ATMOSPHERIC_INTRO_SUMMARY.md" "docs/features/narrative/atmospheric-intro.md"
    echo -e "${GREEN}✅ Atmospheric intro moved${NC}"
fi

if [ -f "NATURAL_CHARACTER_SELECTION_IMPLEMENTATION.md" ]; then
    cp "NATURAL_CHARACTER_SELECTION_IMPLEMENTATION.md" "docs/features/characters/selection.md"
    echo -e "${GREEN}✅ Character selection moved${NC}"
fi

if [ -f "RECIPROCITY_AGENCY_FIX_PLAN.md" ]; then
    cp "RECIPROCITY_AGENCY_FIX_PLAN.md" "docs/features/characters/reciprocity-fixes.md"
    echo -e "${GREEN}✅ Reciprocity fixes moved${NC}"
fi

if [ -f "RECIPROCITY_DEPTH_PLAN.md" ]; then
    cp "RECIPROCITY_DEPTH_PLAN.md" "docs/features/characters/reciprocity-depth.md"
    echo -e "${GREEN}✅ Reciprocity depth moved${NC}"
fi

# Phase 4: Archive historical documentation
echo -e "${BLUE}🔵 Archiving historical documentation...${NC}"

# Completed Phases
if [ -f "PHASE_1_COMPLETION_SUMMARY.md" ]; then
    cp "PHASE_1_COMPLETION_SUMMARY.md" "archive/completed-phases/"
    echo -e "${GREEN}✅ Phase 1 completion archived${NC}"
fi

if [ -f "PHASE_2_COMPLETION_SUMMARY.md" ]; then
    cp "PHASE_2_COMPLETION_SUMMARY.md" "archive/completed-phases/"
    echo -e "${GREEN}✅ Phase 2 completion archived${NC}"
fi

# Obsolete Plans
if [ -f "GEMINI_TO_CLAUDE_TRANSITION.md" ]; then
    cp "GEMINI_TO_CLAUDE_TRANSITION.md" "archive/obsolete-plans/"
    echo -e "${GREEN}✅ Gemini transition archived${NC}"
fi

if [ -f "GEMINI-EXECUTION-PLAN.md" ]; then
    cp "GEMINI-EXECUTION-PLAN.md" "archive/obsolete-plans/"
    echo -e "${GREEN}✅ Gemini execution plan archived${NC}"
fi

if [ -f "SHADCN_MIGRATION_PLAN.md" ]; then
    cp "SHADCN_MIGRATION_PLAN.md" "archive/obsolete-plans/"
    echo -e "${GREEN}✅ ShadCN migration plan v1 archived${NC}"
fi

if [ -f "SHADCN_MIGRATION_PLAN_V2.md" ]; then
    cp "SHADCN_MIGRATION_PLAN_V2.md" "archive/obsolete-plans/"
    echo -e "${GREEN}✅ ShadCN migration plan v2 archived${NC}"
fi

# Historical Analysis
if [ -f "VIRTUAL_FOCUS_GROUP_AUDIT_2025-09-30.md" ]; then
    cp "VIRTUAL_FOCUS_GROUP_AUDIT_2025-09-30.md" "archive/historical-analysis/"
    echo -e "${GREEN}✅ Focus group audit archived${NC}"
fi

if [ -f "COMPREHENSIVE_BASE_STATE_AUDIT_2025-10-17.md" ]; then
    cp "COMPREHENSIVE_BASE_STATE_AUDIT_2025-10-17.md" "archive/historical-analysis/"
    echo -e "${GREEN}✅ Base state audit archived${NC}"
fi

if [ -f "OBJECTIVE_VALIDATION_REPORT_2025-10-17.md" ]; then
    cp "OBJECTIVE_VALIDATION_REPORT_2025-10-17.md" "archive/historical-analysis/"
    echo -e "${GREEN}✅ Objective validation archived${NC}"
fi

if [ -f "SYSTEMATIC_FIX_COMPLETE_2025-10-17.md" ]; then
    cp "SYSTEMATIC_FIX_COMPLETE_2025-10-17.md" "archive/historical-analysis/"
    echo -e "${GREEN}✅ Systematic fix complete archived${NC}"
fi

if [ -f "SYSTEMATIC_FIX_SUMMARY_2025-10-17.md" ]; then
    cp "SYSTEMATIC_FIX_SUMMARY_2025-10-17.md" "archive/historical-analysis/"
    echo -e "${GREEN}✅ Systematic fix summary archived${NC}"
fi

# Phase 5: Clean up temporary files
echo -e "${BLUE}🗑️ Cleaning up temporary files...${NC}"

# Remove temporary HTML files
rm -f temp_page.html test-button.html test-text-hierarchy.html
echo -e "${GREEN}✅ Temporary HTML files removed${NC}"

# Remove temporary scripts
rm -f check-supabase-data.mjs get-user-details.mjs
echo -e "${GREEN}✅ Temporary scripts removed${NC}"

# Remove temporary test files
rm -f test-persistence.md
echo -e "${GREEN}✅ Temporary test files removed${NC}"

# Remove duplicate text files (keep .md versions)
rm -f choice-calibration-report.txt dialogue-fix-report.txt
echo -e "${GREEN}✅ Duplicate text files removed${NC}"

# Remove obsolete feature files
rm -f missing-scene-generation-report.md
echo -e "${GREEN}✅ Obsolete feature files removed${NC}"

# Phase 6: Create master documentation index
echo -e "${BLUE}📋 Creating master documentation index...${NC}"

cat > docs/README.md << 'EOF'
# 📚 Lux Story Documentation

Welcome to the comprehensive documentation for the Lux Story project - an interactive narrative experience that combines character development, choice-driven storytelling, and career exploration.

## 🚀 Quick Start

- [Getting Started](getting-started/setup.md) - Development setup and installation
- [Deployment Guide](getting-started/deployment.md) - How to deploy the application
- [Contributing](getting-started/contributing.md) - How to contribute to the project

## 🏗️ Architecture

- [System Overview](architecture/overview.md) - High-level system architecture
- [Narrative Engine](architecture/narrative-engine.md) - Story engine design and implementation
- [Choice System](architecture/choice-system.md) - Choice design framework and patterns
- [Character System](architecture/character-system.md) - Character interaction and reciprocity system
- [Data Flow](architecture/data-flow.md) - Data architecture and flow

## 🎯 Features

### Characters
- [Character Selection](features/characters/selection.md) - Natural character discovery system
- [Reciprocity System](features/characters/reciprocity-depth.md) - Character interaction depth
- [Reciprocity Fixes](features/characters/reciprocity-fixes.md) - Agency and choice improvements

### Analytics
- [Engagement System](features/analytics/engagement-system.md) - User engagement tracking and analysis

### Admin Dashboard
- [Dashboard Overview](features/admin-dashboard/README.md) - Admin interface documentation
- [Implementation](features/admin-dashboard/implementation.md) - Implementation details
- [Debugging](features/admin-dashboard/debugging.md) - Debug status and procedures
- [Fixes](features/admin-dashboard/fixes.md) - Fix summary and history
- [Improvements](features/admin-dashboard/improvements.md) - Improvement strategies
- [Screens](features/admin-dashboard/screens.md) - Screen specifications

### User Experience
- [Narrative Design](features/narrative/atmospheric-intro.md) - Atmospheric introduction system

## 🛠️ Development

- [Development Methodology](development/methodology.md) - Software development approach
- [Testing](development/testing.md) - Testing infrastructure and procedures
- [Workflow](development/workflow.md) - Development workflow and processes

## 🚀 Deployment

- [Production Deployment](deployment/production.md) - Production deployment procedures
- [Infrastructure](deployment/infrastructure.md) - Infrastructure setup and management
- [Monitoring](deployment/monitoring.md) - Monitoring and alerting systems
- [Security](deployment/security.md) - Security protocols and best practices

## 🔍 Quality Assurance

- [Audits](quality/audits/) - Comprehensive audit reports
- [Code Quality](quality/code-quality-fixes.md) - Code quality improvements
- [Linting](quality/linting-report.md) - Linting configuration and results

## 📊 Project Status

- [Current Status](status/current-status.md) - Current project status and progress

## 📚 Reference

- [API Documentation](reference/api/) - API endpoints and usage
- [Database Schema](reference/database/) - Database structure and relationships
- [Troubleshooting](reference/troubleshooting/) - Common issues and solutions

## 🗂️ Archive

Historical documentation and completed phases are archived in the `archive/` directory:
- [Completed Phases](archive/completed-phases/) - Phase completion reports
- [Obsolete Plans](archive/obsolete-plans/) - Superseded implementation plans
- [Historical Analysis](archive/historical-analysis/) - Historical audit and analysis reports

---

*This documentation is maintained as part of the project's commitment to transparency, maintainability, and knowledge preservation.*
EOF

echo -e "${GREEN}✅ Master documentation index created${NC}"

# Phase 7: Create archive index
echo -e "${BLUE}📦 Creating archive index...${NC}"

cat > archive/README.md << 'EOF'
# 🗂️ Archive Directory

This directory contains historical documentation, completed phases, and obsolete plans that are preserved for reference but no longer actively maintained.

## 📁 Directory Structure

### [completed-phases/](completed-phases/)
Contains documentation for completed development phases:
- Phase 1 completion summary
- Phase 2 completion summary
- Other completed milestone reports

### [obsolete-plans/](obsolete-plans/)
Contains superseded implementation plans and strategies:
- Gemini to Claude transition documentation
- Legacy migration plans
- Obsolete feature implementation plans

### [historical-analysis/](historical-analysis/)
Contains historical audit reports and analysis:
- Focus group audits
- Base state audits
- Validation reports
- Systematic fix reports

### [legacy-docs/](legacy-docs/)
Contains deprecated documentation and legacy references.

## 🔍 Usage

These files are preserved for:
- **Historical context** - Understanding evolution of design decisions
- **Reference** - Consulting previous approaches and solutions
- **Learning** - Analyzing past implementations and outcomes
- **Audit trail** - Maintaining complete project history

## ⚠️ Important Notes

- Files in this directory are **not actively maintained**
- Information may be **outdated** or **superseded**
- Always check **current documentation** in `docs/` for up-to-date information
- These files are preserved for **historical reference only**

---

*Archive maintained as of: $(date)*
EOF

echo -e "${GREEN}✅ Archive index created${NC}"

# Final summary
echo -e "${GREEN}🎉 Documentation consolidation complete!${NC}"
echo -e "${BLUE}📊 Summary:${NC}"
echo -e "  • ${GREEN}Critical files maintained in root${NC}"
echo -e "  • ${GREEN}Core documentation organized in docs/${NC}"
echo -e "  • ${GREEN}Historical files archived${NC}"
echo -e "  • ${GREEN}Temporary files cleaned up${NC}"
echo -e "  • ${GREEN}Master index created${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo -e "  1. Review the new organization structure"
echo -e "  2. Update any remaining cross-references"
echo -e "  3. Test navigation and discoverability"
echo -e "  4. Commit changes to version control"
echo ""
echo -e "${BLUE}🔗 Main documentation: docs/README.md${NC}"
echo -e "${BLUE}🗂️ Archive overview: archive/README.md${NC}"
