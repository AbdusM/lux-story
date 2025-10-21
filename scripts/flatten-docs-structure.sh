#!/bin/bash

# 📁 Documentation Flattening Script
# Create 2-level structure with numbered nomenclature

set -e

echo "📁 Starting Documentation Flattening..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Create backup
echo -e "${BLUE}📦 Creating backup...${NC}"
BACKUP_DIR="backup/flatten-structure-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r docs/ "$BACKUP_DIR/docs-backup/"
echo -e "${GREEN}✅ Backup created${NC}"

# Remove old docs structure
echo -e "${BLUE}🗑️ Removing old docs structure...${NC}"
rm -rf docs/

# Create new flat structure
echo -e "${BLUE}📁 Creating new flat structure...${NC}"
mkdir -p docs/{00-core,01-features,02-development,03-deployment,04-archive}

# Move and flatten core documentation
echo -e "${BLUE}📋 Moving core documentation...${NC}"
if [ -f "$BACKUP_DIR/docs-backup/core/choice-system.md" ]; then
    cp "$BACKUP_DIR/docs-backup/core/choice-system.md" "docs/00-core/00-choice-system.md"
    echo -e "${GREEN}✅ Choice system moved${NC}"
fi

if [ -f "$BACKUP_DIR/docs-backup/core/character-system.md" ]; then
    cp "$BACKUP_DIR/docs-backup/core/character-system.md" "docs/00-core/01-character-system.md"
    echo -e "${GREEN}✅ Character system moved${NC}"
fi

# Move and flatten features documentation
echo -e "${BLUE}📋 Moving features documentation...${NC}"
if [ -f "$BACKUP_DIR/docs-backup/features/admin-dashboard.md" ]; then
    cp "$BACKUP_DIR/docs-backup/features/admin-dashboard.md" "docs/01-features/00-admin-dashboard.md"
    echo -e "${GREEN}✅ Admin dashboard moved${NC}"
fi

if [ -f "$BACKUP_DIR/docs-backup/features/analytics.md" ]; then
    cp "$BACKUP_DIR/docs-backup/features/analytics.md" "docs/01-features/01-analytics.md"
    echo -e "${GREEN}✅ Analytics moved${NC}"
fi

# Move and flatten development documentation
echo -e "${BLUE}📋 Moving development documentation...${NC}"
if [ -f "$BACKUP_DIR/docs-backup/development/README.md" ]; then
    cp "$BACKUP_DIR/docs-backup/development/README.md" "docs/02-development/00-readme.md"
    echo -e "${GREEN}✅ Development readme moved${NC}"
fi

if [ -f "$BACKUP_DIR/docs-backup/development/testing.md" ]; then
    cp "$BACKUP_DIR/docs-backup/development/testing.md" "docs/02-development/01-testing.md"
    echo -e "${GREEN}✅ Testing moved${NC}"
fi

if [ -f "$BACKUP_DIR/docs-backup/development/methodology.md" ]; then
    cp "$BACKUP_DIR/docs-backup/development/methodology.md" "docs/02-development/02-methodology.md"
    echo -e "${GREEN}✅ Methodology moved${NC}"
fi

# Move and flatten deployment documentation
echo -e "${BLUE}📋 Moving deployment documentation...${NC}"
if [ -f "$BACKUP_DIR/docs-backup/deployment/README.md" ]; then
    cp "$BACKUP_DIR/docs-backup/deployment/README.md" "docs/03-deployment/00-readme.md"
    echo -e "${GREEN}✅ Deployment readme moved${NC}"
fi

if [ -f "$BACKUP_DIR/docs-backup/deployment/readiness.md" ]; then
    cp "$BACKUP_DIR/docs-backup/deployment/readiness.md" "docs/03-deployment/01-readiness.md"
    echo -e "${GREEN}✅ Readiness moved${NC}"
fi

if [ -f "$BACKUP_DIR/docs-backup/deployment/production-status.md" ]; then
    cp "$BACKUP_DIR/docs-backup/deployment/production-status.md" "docs/03-deployment/02-production-status.md"
    echo -e "${GREEN}✅ Production status moved${NC}"
fi

# Move all archive files to flat structure
echo -e "${BLUE}📋 Moving archive documentation...${NC}"
ARCHIVE_COUNT=0
if [ -d "$BACKUP_DIR/docs-backup/archive" ]; then
    for file in "$BACKUP_DIR/docs-backup/archive"/*.md; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            # Clean filename and add number prefix
            clean_name=$(echo "$filename" | sed 's/^[A-Z_]*//' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]/-/g' | sed 's/--*/-/g' | sed 's/^-//' | sed 's/-$//')
            cp "$file" "docs/04-archive/$(printf "%03d" $ARCHIVE_COUNT)-$clean_name"
            ARCHIVE_COUNT=$((ARCHIVE_COUNT + 1))
        fi
    done
    echo -e "${GREEN}✅ $ARCHIVE_COUNT archive files moved${NC}"
fi

# Create main README with navigation
echo -e "${BLUE}📋 Creating main README...${NC}"
cat > docs/README.md << 'EOF'
# 📚 Lux Story Documentation

Interactive narrative experience combining character development, choice-driven storytelling, and career exploration.

## 📁 Documentation Structure

### 00-core/
Core system documentation and architecture
- [00-choice-system.md](00-core/00-choice-system.md) - Choice design framework
- [01-character-system.md](00-core/01-character-system.md) - Character interactions

### 01-features/
Feature documentation and specifications
- [00-admin-dashboard.md](01-features/00-admin-dashboard.md) - Admin interface
- [01-analytics.md](01-features/01-analytics.md) - Analytics system

### 02-development/
Development guides and procedures
- [00-readme.md](02-development/00-readme.md) - Development overview
- [01-testing.md](02-development/01-testing.md) - Testing procedures
- [02-methodology.md](02-development/02-methodology.md) - Development methodology

### 03-deployment/
Deployment and infrastructure
- [00-readme.md](03-deployment/00-readme.md) - Deployment overview
- [01-readness.md](03-deployment/01-readiness.md) - Deployment readiness
- [02-production-status.md](03-deployment/02-production-status.md) - Production status

### 04-archive/
Historical documentation and reference
- [000-xxx.md to 999-xxx.md] - All archived documentation

## 🚀 Quick Navigation

**Core Systems**: Start with `00-core/` for system architecture
**Features**: Check `01-features/` for feature documentation  
**Development**: Use `02-development/` for development guides
**Deployment**: Reference `03-deployment/` for deployment info
**Archive**: Browse `04-archive/` for historical reference

---
*All documentation follows numbered nomenclature for easy navigation*
EOF

# Create folder READMEs
echo -e "${BLUE}📋 Creating folder READMEs...${NC}"

cat > docs/00-core/README.md << 'EOF'
# 00-core/

Core system documentation and architecture.

## Files
- `00-choice-system.md` - Choice design framework and patterns
- `01-character-system.md` - Character interactions and reciprocity

## Purpose
Essential system documentation that defines the core architecture and design patterns used throughout the application.
EOF

cat > docs/01-features/README.md << 'EOF'
# 01-features/

Feature documentation and specifications.

## Files
- `00-admin-dashboard.md` - Admin interface documentation
- `01-analytics.md` - Analytics and engagement system

## Purpose
Documentation for specific features and their implementation details.
EOF

cat > docs/02-development/README.md << 'EOF'
# 02-development/

Development guides and procedures.

## Files
- `00-readme.md` - Development overview and setup
- `01-testing.md` - Testing procedures and guidelines
- `02-methodology.md` - Development methodology and standards

## Purpose
Guidelines and procedures for developers working on the project.
EOF

cat > docs/03-deployment/README.md << 'EOF'
# 03-deployment/

Deployment and infrastructure documentation.

## Files
- `00-readme.md` - Deployment overview
- `01-readiness.md` - Deployment readiness checklist
- `02-production-status.md` - Current production status

## Purpose
Documentation for deploying and maintaining the application in production.
EOF

cat > docs/04-archive/README.md << 'EOF'
# 04-archive/

Historical documentation and reference materials.

## Files
- `000-xxx.md` through `999-xxx.md` - All archived documentation

## Purpose
Preservation of historical documentation, completed phases, and reference materials.

## Important Notes
- Files are preserved for historical reference only
- Information may be outdated or superseded
- Always check current documentation in other folders first
- Files are numbered for easy sorting and reference

## Usage
- **Historical Context**: Understanding evolution of design decisions
- **Reference**: Consulting previous approaches and solutions
- **Learning**: Analyzing past implementations and outcomes
- **Audit Trail**: Maintaining complete project history
EOF

echo -e "${GREEN}✅ Folder READMEs created${NC}"

# Final summary
echo -e "${GREEN}🎉 Documentation flattening complete!${NC}"
echo -e "${BLUE}📊 Summary:${NC}"

# Count final files
CORE_FILES=$(find docs/00-core -name "*.md" | wc -l)
FEATURES_FILES=$(find docs/01-features -name "*.md" | wc -l)
DEVELOPMENT_FILES=$(find docs/02-development -name "*.md" | wc -l)
DEPLOYMENT_FILES=$(find docs/03-deployment -name "*.md" | wc -l)
ARCHIVE_FILES=$(find docs/04-archive -name "*.md" | wc -l)
TOTAL_FILES=$((CORE_FILES + FEATURES_FILES + DEVELOPMENT_FILES + DEPLOYMENT_FILES + ARCHIVE_FILES))

echo -e "  • ${GREEN}00-core/: $CORE_FILES files${NC}"
echo -e "  • ${GREEN}01-features/: $FEATURES_FILES files${NC}"
echo -e "  • ${GREEN}02-development/: $DEVELOPMENT_FILES files${NC}"
echo -e "  • ${GREEN}03-deployment/: $DEPLOYMENT_FILES files${NC}"
echo -e "  • ${GREEN}04-archive/: $ARCHIVE_FILES files${NC}"
echo -e "  • ${GREEN}Total: $TOTAL_FILES files${NC}"

echo ""
echo -e "${YELLOW}📋 Structure:${NC}"
echo -e "  • ${GREEN}2-level maximum depth${NC}"
echo -e "  • ${GREEN}Numbered nomenclature (00-, 01-, etc.)${NC}"
echo -e "  • ${GREEN}Flat files within each folder${NC}"
echo -e "  • ${GREEN}Clear navigation and organization${NC}"

echo ""
echo -e "${BLUE}🔗 Main documentation: docs/README.md${NC}"
echo -e "${BLUE}💾 Backup location: $BACKUP_DIR${NC}"
