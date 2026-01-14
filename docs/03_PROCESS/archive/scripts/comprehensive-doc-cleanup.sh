#!/bin/bash

# 🧹 Comprehensive Documentation Cleanup Script
# Aggressive consolidation of ALL documentation files

set -e

echo "🧹 Starting Comprehensive Documentation Cleanup..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create comprehensive backup
echo -e "${BLUE}📦 Creating comprehensive backup...${NC}"
BACKUP_DIR="backup/comprehensive-cleanup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
find . -name "*.md" -not -path "./node_modules/*" -not -path "./.git/*" -not -path "./out/*" -not -path "./.next/*" -exec cp {} "$BACKUP_DIR/" \;
echo -e "${GREEN}✅ Backup created with $(ls "$BACKUP_DIR" | wc -l) files${NC}"

# Create clean docs structure
echo -e "${BLUE}📁 Creating clean documentation structure...${NC}"
mkdir -p docs/{core,features,development,deployment,archive}

# Keep only essential files in root
echo -e "${BLUE}🔴 Keeping only essential root files...${NC}"
ESSENTIAL_FILES=("README.md" "CONTRIBUTING.md" "LICENSE" "SECURITY.md" "package.json")
for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅ Keeping $file in root${NC}"
    fi
done

# Move all other .md files from root to docs/archive
echo -e "${BLUE}📦 Moving all non-essential root .md files to docs/archive...${NC}"
ROOT_MD_COUNT=0
for file in *.md; do
    if [[ ! " ${ESSENTIAL_FILES[@]} " =~ " ${file} " ]]; then
        if [ -f "$file" ]; then
            mv "$file" "docs/archive/"
            ROOT_MD_COUNT=$((ROOT_MD_COUNT + 1))
        fi
    fi
done
echo -e "${GREEN}✅ Moved $ROOT_MD_COUNT files from root to docs/archive${NC}"

# Consolidate existing docs/ content
echo -e "${BLUE}📋 Consolidating docs/ content...${NC}"
DOCS_COUNT=0
find docs/ -maxdepth 1 -name "*.md" -exec mv {} docs/archive/ \;
DOCS_COUNT=$(find docs/ -maxdepth 1 -name "*.md" | wc -l)
echo -e "${GREEN}✅ Consolidated $DOCS_COUNT docs/ files to archive${NC}"

# Create essential consolidated documentation
echo -e "${BLUE}📝 Creating essential consolidated documentation...${NC}"

# Core README
cat > docs/README.md << 'EOF'
# 📚 Lux Story Documentation

Interactive narrative experience combining character development, choice-driven storytelling, and career exploration.

## 🚀 Quick Start
- **Setup**: Development environment and dependencies
- **Deployment**: Production deployment procedures
- **Contributing**: Development guidelines and workflow

## 🏗️ System Architecture
- **Choice System**: Interactive choice design and user agency
- **Character System**: Character interactions and reciprocity
- **Narrative Engine**: Story progression and branching logic

## 🎯 Key Features
- **Admin Dashboard**: Analytics and user management
- **Engagement Analytics**: User behavior tracking and analysis
- **Character Interactions**: Maya, Devon, Jordan, and Samuel dialogues

## 🛠️ Development
- **Testing**: Quality assurance and testing procedures
- **Deployment**: Production infrastructure and monitoring
- **Security**: Security protocols and best practices

## 📊 Project Status
- **Current**: Production-ready with auto-chunking and reciprocity depth
- **Recent**: Documentation consolidation and organization
- **Next**: Ongoing maintenance and feature development

---
*All historical documentation preserved in docs/archive/*
EOF

# Core system documentation
cat > docs/core/choice-system.md << 'EOF'
# Choice Design System

## Overview
The choice design system implements a three-choice pattern (Analytical | Empathetic | Patient) with progressive trust rewards and WEF 2030 skills integration.

## Key Principles
- **Three-Choice Pattern**: Consistent analytical/empathetic/patient options
- **Trust Rewards**: Empathetic choices prioritized for engagement
- **Skills Integration**: WEF 2030 skills tagged to all choices
- **User Agency**: Meaningful choices with consequences

## Implementation
- Choice quality scoring system
- Engagement quality analyzer
- Pattern recognition and tracking
- Career insights and matching

*Historical documentation preserved in docs/archive/*
EOF

cat > docs/core/character-system.md << 'EOF'
# Character System

## Overview
Interactive character system with Maya, Devon, Jordan, and Samuel featuring deep reciprocity arcs and user agency.

## Characters
- **Maya**: Pre-med student with family expectations conflict
- **Devon**: Logic vs emotion internal struggle
- **Jordan**: Impostor syndrome and multi-career path
- **Samuel**: Station guide and character routing

## Reciprocity System
- Mutual recognition nodes
- Three-beat resolution patterns
- User agency preservation
- Trust-based progression

*Historical documentation preserved in docs/archive/*
EOF

# Features documentation
cat > docs/features/admin-dashboard.md << 'EOF'
# Admin Dashboard

## Overview
Comprehensive admin interface for user analytics, skill tracking, and engagement monitoring.

## Key Features
- User journey tracking
- Skill demonstration analysis
- Engagement quality metrics
- Career exploration insights

## Implementation
- Real-time monitoring
- Analytics aggregation
- User data visualization
- Performance tracking

*Historical documentation preserved in docs/archive/*
EOF

cat > docs/features/analytics.md << 'EOF'
# Analytics & Engagement System

## Overview
Advanced analytics system tracking user engagement, choice patterns, and skill demonstrations.

## Components
- Engagement Quality Analyzer
- Choice Pattern Recognition
- Skill Demonstration Tracking
- Career Matching Algorithm

## Metrics
- Trust building patterns
- Patience indicators
- Exploration behavior
- Help-seeking patterns

*Historical documentation preserved in docs/archive/*
EOF

# Development documentation
cat > docs/development/README.md << 'EOF'
# Development Guide

## Setup
1. Install dependencies: `npm install`
2. Configure environment variables
3. Set up Supabase connection
4. Run development server: `npm run dev`

## Testing
- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

## Deployment
- Production: `npm run deploy`
- Staging: `npm run deploy:staging`
- Monitoring: Cloudflare Pages dashboard

*Detailed procedures preserved in docs/archive/*
EOF

# Deployment documentation
cat > docs/deployment/README.md << 'EOF'
# Deployment Guide

## Production Deployment
- **Platform**: Cloudflare Pages
- **Build**: Next.js static export
- **Domain**: lux-story.pages.dev
- **Monitoring**: Built-in analytics

## Environment Setup
- Supabase configuration
- Environment variables
- Security protocols
- Performance optimization

## Monitoring
- Real-time analytics
- Error tracking
- Performance metrics
- User engagement data

*Detailed procedures preserved in docs/archive/*
EOF

# Create archive index
cat > docs/archive/README.md << 'EOF'
# 📦 Documentation Archive

This archive contains all historical documentation, implementation plans, audit reports, and detailed technical specifications.

## Archive Contents
- **Implementation Plans**: Development phase documentation
- **Audit Reports**: Quality assurance and analysis reports  
- **Technical Specifications**: Detailed system documentation
- **Historical Analysis**: Past evaluations and assessments
- **Obsolete Plans**: Superseded implementation strategies

## Usage
- **Reference**: Consult for historical context and detailed information
- **Learning**: Understand evolution of design decisions
- **Audit Trail**: Maintain complete project history

## Important Notes
- Files are **preserved for reference only**
- Information may be **outdated or superseded**
- Always check **current documentation** for up-to-date information
- **Do not delete** - all files contain valuable historical context

---
*Archive maintained as of: $(date)*
EOF

echo -e "${GREEN}✅ Essential consolidated documentation created${NC}"

# Final cleanup - remove empty directories and temporary files
echo -e "${BLUE}🧹 Final cleanup...${NC}"
find . -name "*.md.bak" -delete 2>/dev/null || true
find . -name "*.tmp" -delete 2>/dev/null || true
echo -e "${GREEN}✅ Temporary files cleaned up${NC}"

# Summary
echo -e "${GREEN}🎉 Comprehensive documentation cleanup complete!${NC}"
echo -e "${BLUE}📊 Summary:${NC}"

# Count final files
ROOT_FINAL=$(ls *.md 2>/dev/null | wc -l)
DOCS_FINAL=$(find docs/ -name "*.md" | wc -l)
ARCHIVE_FINAL=$(find docs/archive/ -name "*.md" | wc -l)

echo -e "  • ${GREEN}Root directory: $ROOT_FINAL essential files${NC}"
echo -e "  • ${GREEN}docs/ directory: $DOCS_FINAL consolidated files${NC}"
echo -e "  • ${GREEN}docs/archive/: $ARCHIVE_FINAL historical files${NC}"
echo -e "  • ${GREEN}Total reduction: $(($ROOT_FINAL + $DOCS_FINAL + $ARCHIVE_FINAL)) files${NC}"

echo ""
echo -e "${YELLOW}📋 Key Benefits:${NC}"
echo -e "  • ${GREEN}Clean root directory with only essential files${NC}"
echo -e "  • ${GREEN}Consolidated documentation in docs/${NC}"
echo -e "  • ${GREEN}All historical content preserved in archive${NC}"
echo -e "  • ${GREEN}Easy navigation and discoverability${NC}"

echo ""
echo -e "${BLUE}🔗 Main documentation: docs/README.md${NC}"
echo -e "${BLUE}📦 Archive overview: docs/archive/README.md${NC}"
echo -e "${BLUE}💾 Backup location: $BACKUP_DIR${NC}"
