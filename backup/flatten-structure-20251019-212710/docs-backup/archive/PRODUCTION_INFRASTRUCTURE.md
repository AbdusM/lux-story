# Production Infrastructure & Monitoring
Grand Central Terminus - Birmingham Career Exploration

## Overview

This document describes the production infrastructure setup, monitoring tools, and operational procedures for the Grand Central Terminus application.

## 🛡️ Error Tracking with Sentry

### Setup
- **Client-side tracking**: `/sentry.client.config.ts`
- **Server-side tracking**: `/sentry.server.config.ts`
- **Edge runtime tracking**: `/sentry.edge.config.ts`
- **Instrumentation**: `/instrumentation.ts`

### Features
- **Error capture**: Automatic error tracking in production
- **Session replay**: 10% of sessions, 100% of error sessions
- **Performance monitoring**: 10% trace sample rate in production
- **PII filtering**: Automatic removal of sensitive data

### Configuration
```bash
# .env.local (production)
SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@xxxxx.ingest.sentry.io/xxxxx
ENABLE_SENTRY=true
```

### Dashboard
- Access: https://sentry.io/organizations/[your-org]/projects/
- Alerts: Configure alerts for error rate thresholds
- Integration: Errors automatically include user context and breadcrumbs

## 🔍 Health Check Endpoints

### `/api/health`
**Purpose**: Overall application health status

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T02:45:19.580Z",
  "uptime": 52,
  "environment": "development",
  "version": "2.0.0",
  "checks": {
    "server": true
  }
}
```

**Usage**:
- Uptime monitoring (e.g., UptimeRobot, Pingdom)
- Load balancer health checks
- Quick deployment verification

### `/api/health/db`
**Purpose**: Database connectivity and query performance

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T02:45:25.611Z",
  "responseTime": "1303ms",
  "checks": {
    "config": true,
    "connection": true,
    "query": true
  }
}
```

**Usage**:
- Database connection monitoring
- Query performance tracking
- Supabase health verification

### `/api/health/storage`
**Purpose**: Client-side storage availability

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T02:45:29.979Z",
  "checks": {
    "config": true,
    "localStorage": true,
    "sessionStorage": true
  },
  "note": "Server-side check only. Client-side storage is tested on the client."
}
```

**Usage**:
- Verify storage configuration
- Client-side compatibility checks

## 📊 Structured Logging

### Logger Utility
**Location**: `/lib/logger.ts`

### Features
- **Log levels**: debug, info, warn, error
- **Structured output**: JSON in production, human-readable in development
- **PII filtering**: Automatic removal of sensitive data
- **Context tracking**: userId, operation, timestamp
- **Sentry integration**: Automatic error reporting

### Usage
```typescript
import { logger } from '@/lib/logger';

// With context
logger.info('User action completed', {
  userId: 'user_123',
  operation: 'career_exploration',
  careerId: 'healthcare_tech',
});

// Error with Sentry integration
logger.error('Database query failed', {
  userId: 'user_123',
  operation: 'fetch_skills',
  query: 'SELECT * FROM skills',
}, error);
```

### Production Output
```json
{
  "level": "info",
  "message": "User action completed",
  "timestamp": "2025-10-04T02:45:30.000Z",
  "userId": "user_123",
  "operation": "career_exploration",
  "careerId": "healthcare_tech"
}
```

## 🔐 Environment Variable Validation

### Validation Utility
**Location**: `/lib/env-validation.ts`

### Features
- **Startup validation**: Verify all required variables on app start
- **Context-aware**: Different requirements for server/client
- **Clear error messages**: Detailed guidance on missing variables
- **Production checks**: Additional validation for production deployment

### Usage
```typescript
import { validateEnv, getEnvConfig } from '@/lib/env-validation';

// Validate environment
const config = validateEnv('server');

// Get cached config
const config = getEnvConfig('server');

// Check if configured
if (!isEnvConfigured('server')) {
  console.error('Missing environment variables');
}
```

### Validation Script
```bash
npm run validate-env
```

**Output**:
```
═══════════════════════════════════════════════════
🔍 ENVIRONMENT VARIABLE VALIDATION
═══════════════════════════════════════════════════

✅ Supabase URL: https://tavalvqcebos...
✅ Supabase Anon Key: eyJhbGciOiJIUzI1NiIs...
✅ Anthropic API Key: sk-ant-api03-7IAvMz7...
✅ Gemini API Key: AIzaSyDEQloxDXlFD2...
✅ Admin API Token: 3f52086db613f78c1db6...

✅ ALL ENVIRONMENT VARIABLES ARE VALID
```

## 🛠️ Database Migration Safety

### Migration Script
**Location**: `/scripts/migrate-ensure-all-profiles.ts`

### Safety Features
- **Dry-run mode**: Preview changes without executing
- **Pagination**: Handle large datasets (1000 records per batch)
- **Progress reporting**: Real-time status updates
- **Database backup reminder**: Enforced 5-second delay
- **Rollback documentation**: Complete recovery procedures

### Usage
```bash
# Dry run (preview only)
npx tsx scripts/migrate-ensure-all-profiles.ts --dry-run

# Execute migration
npx tsx scripts/migrate-ensure-all-profiles.ts
```

### Rollback Procedure
**Location**: `/scripts/MIGRATION_ROLLBACK.md`

## 🚀 Deployment Process

### Pre-Deployment Checklist
**Location**: `/docs/DEPLOYMENT_CHECKLIST.md`

### Automated Pre-Deploy
```bash
npm run predeploy
```

**This runs**:
1. Environment validation (`npm run validate-env`)
2. Test suite (`npm run test:run`)
3. Production build (`npm run build`)

### Health Check Script
```bash
npm run health-check
```

**Tests**:
- `/api/health` - General health
- `/api/health/db` - Database connectivity

### Manual Deployment Steps
1. **Create database backup**
   ```
   Supabase Dashboard → Database → Backups → Create Backup
   ```

2. **Validate environment**
   ```bash
   npm run validate-env
   ```

3. **Run tests**
   ```bash
   npm run test:run
   ```

4. **Build production bundle**
   ```bash
   npm run build
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

6. **Verify deployment**
   ```bash
   curl https://your-domain.com/api/health
   curl https://your-domain.com/api/health/db
   ```

## 📈 Monitoring & Alerts

### Recommended Monitoring Stack

#### 1. Uptime Monitoring
- **Tool**: UptimeRobot, Pingdom, or similar
- **Endpoint**: `https://your-domain.com/api/health`
- **Frequency**: Every 5 minutes
- **Alert threshold**: 2 consecutive failures

#### 2. Error Tracking
- **Tool**: Sentry
- **Alerts**:
  - Error rate >5% in 5 minutes
  - Critical errors (500s) immediate notification
  - Performance degradation (P95 >5s)

#### 3. Database Monitoring
- **Tool**: Supabase Dashboard
- **Metrics**:
  - Connection pool usage
  - Query performance
  - Storage usage
  - API request count

#### 4. Application Logs
- **Tool**: Vercel/Cloudflare Logs or external log aggregation
- **Retention**: 30 days minimum
- **Analysis**: Search by userId, operation, error type

### Alert Escalation

**Severity Levels**:
1. **P1 - Critical**: Application down, data loss, security breach
   - Response time: 15 minutes
   - Escalate to: On-call engineer + CTO

2. **P2 - High**: Partial outage, performance degradation
   - Response time: 1 hour
   - Escalate to: On-call engineer

3. **P3 - Medium**: Non-critical errors, minor issues
   - Response time: 4 hours
   - Escalate to: Development team

4. **P4 - Low**: Monitoring alerts, warnings
   - Response time: Next business day
   - Escalate to: Development team

## 🔄 Incident Response

### Incident Workflow
1. **Detect**: Monitoring alerts or user reports
2. **Assess**: Check health endpoints and error rates
3. **Mitigate**: Apply immediate fixes or rollback
4. **Communicate**: Update status page and stakeholders
5. **Resolve**: Implement permanent fix
6. **Review**: Post-mortem and prevention measures

### Rollback Procedure
```bash
# 1. Revert deployment
git revert [commit-hash]
git push origin main

# 2. Restore database (if needed)
# Supabase Dashboard → Backups → Restore

# 3. Verify health
curl https://your-domain.com/api/health
curl https://your-domain.com/api/health/db
```

## 📝 Operational Runbook

### Daily Operations
- [ ] Review error logs (Sentry dashboard)
- [ ] Check uptime monitoring (no alerts)
- [ ] Verify database health (connection pool <80%)
- [ ] Monitor API response times (<2s average)

### Weekly Operations
- [ ] Review database backup retention (30 days)
- [ ] Check storage usage (Supabase dashboard)
- [ ] Update dependencies (security patches)
- [ ] Review and close resolved incidents

### Monthly Operations
- [ ] Rotate admin tokens
- [ ] Review and optimize database queries
- [ ] Update documentation
- [ ] Disaster recovery drill

## 🔗 Quick Links

- **Sentry Dashboard**: https://sentry.io/organizations/[your-org]/
- **Supabase Dashboard**: https://app.supabase.com/project/[project-id]
- **Deployment Logs**: [Your hosting platform]
- **Status Page**: [If applicable]

## 📞 Emergency Contacts

- **On-call Engineer**: [Contact]
- **Database Admin**: [Contact]
- **Supabase Support**: support@supabase.com
- **Sentry Support**: support@sentry.io

---

Last Updated: October 2025
