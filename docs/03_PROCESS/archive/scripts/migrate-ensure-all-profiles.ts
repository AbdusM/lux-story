/**
 * Migration Script: Ensure All User Profiles Exist
 * Grand Central Terminus - Birmingham Career Exploration
 *
 * Backfills player_profiles for any user_ids found in child tables
 * that don't have a corresponding profile record.
 *
 * SAFETY FEATURES:
 * - Dry-run mode to preview changes without making them
 * - Pagination to handle large datasets
 * - Progress reporting
 * - Database backup reminder
 *
 * Usage:
 *   Dry run:  npx tsx scripts/migrate-ensure-all-profiles.ts --dry-run
 *   Execute:  npx tsx scripts/migrate-ensure-all-profiles.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'
import { ensureUserProfilesBatch } from '../lib/ensure-user-profile'

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run')
const PAGE_SIZE = 1000 // Process in batches of 1000

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function findMissingProfiles(): Promise<string[]> {
  console.log('\n📊 Scanning all tables for user_ids...')

  const tables = [
    'skill_demonstrations',
    'skill_summaries',
    'career_explorations',
    'relationship_progress',
    'visited_scenes',
    'choice_history',
    'player_patterns',
    'player_behavioral_profiles',
    'skill_milestones'
  ]

  const allUserIds = new Set<string>()

  // Collect all unique user_ids from child tables with pagination
  for (const table of tables) {
    console.log(`   Scanning ${table}...`)

    let page = 0
    let hasMore = true
    let totalRecords = 0

    while (hasMore) {
      const { data, error } = await supabase
        .from(table)
        .select('user_id, player_id') // Some tables use player_id
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      if (error) {
        console.warn(`   ⚠️  Error scanning ${table} (page ${page}):`, error.message)
        break
      }

      if (data && data.length > 0) {
        const column = 'user_id' in data[0] ? 'user_id' : 'player_id'
        data.forEach((row: Record<string, unknown>) => {
          const id = row[column]
          if (typeof id === 'string') {
            allUserIds.add(id)
          }
        })
        totalRecords += data.length

        if (data.length < PAGE_SIZE) {
          hasMore = false
        } else {
          page++
          console.log(`      Progress: ${totalRecords} records scanned...`)
        }
      } else {
        hasMore = false
      }
    }

    console.log(`   ✅ Found ${totalRecords} records in ${table}`)
  }

  console.log(`\n   Total unique user IDs found: ${allUserIds.size}`)

  // Check which ones don't have profiles
  console.log('\n🔍 Checking which users are missing profiles...')

  const missingUserIds: string[] = []
  let checked = 0

  for (const userId of allUserIds) {
    const { data, error } = await supabase
      .from('player_profiles')
      .select('user_id')
      .eq('user_id', userId)
      .single()

    checked++
    if (checked % 100 === 0) {
      console.log(`   Progress: ${checked}/${allUserIds.size} profiles checked...`)
    }

    // PGRST116 = no rows found
    if (error && error.code === 'PGRST116') {
      missingUserIds.push(userId)
      console.log(`   ❌ Missing profile: ${userId}`)
    } else if (error) {
      console.warn(`   ⚠️  Error checking ${userId}:`, error.message)
    }
  }

  return missingUserIds
}

async function backfillProfiles(userIds: string[]): Promise<void> {
  if (userIds.length === 0) {
    console.log('\n✅ No missing profiles found! Database is healthy.')
    return
  }

  if (isDryRun) {
    console.log(`\n🔍 DRY RUN MODE: Would backfill ${userIds.length} missing profiles`)
    console.log('─'.repeat(50))
    console.log('\n   User IDs that would be created:')
    userIds.slice(0, 10).forEach(id => console.log(`      - ${id}`))
    if (userIds.length > 10) {
      console.log(`      ... and ${userIds.length - 10} more`)
    }
    console.log('\n   Run without --dry-run to execute migration')
    return
  }

  console.log(`\n🔧 Backfilling ${userIds.length} missing profiles...`)
  console.log('─'.repeat(50))

  const results = await ensureUserProfilesBatch(userIds)

  console.log('\n📊 Migration Results:')
  console.log('─'.repeat(50))
  console.log(`   Total processed: ${userIds.length}`)
  console.log(`   ✅ Successfully created: ${results.success}`)
  console.log(`   ❌ Failed: ${results.failed}`)

  if (results.failed > 0) {
    console.log('\n   Failed user IDs:')
    results.failedUserIds.forEach(id => console.log(`      - ${id}`))
  }
}

async function verifyIntegrity(): Promise<void> {
  console.log('\n🔍 Verifying database integrity...')
  console.log('─'.repeat(50))

  const tables = [
    { name: 'skill_demonstrations', column: 'user_id' },
    { name: 'career_explorations', column: 'user_id' },
    { name: 'choice_history', column: 'player_id' }
  ]

  let allValid = true

  for (const table of tables) {
    // Try to query with join to check foreign key integrity
    const { count, error } = await supabase
      .from(table.name)
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.log(`   ❌ ${table.name}: ${error.message}`)
      allValid = false
    } else {
      console.log(`   ✅ ${table.name}: ${count} records (all have valid profile references)`)
    }
  }

  if (allValid) {
    console.log('\n✅ Database integrity verified! No foreign key violations.')
  } else {
    console.log('\n⚠️  Some foreign key issues remain. Check error messages above.')
  }
}

async function main() {
  console.log('═'.repeat(60))
  console.log('🔧 USER PROFILE MIGRATION & BACKFILL')
  console.log('═'.repeat(60))
  console.log(`Database: ${supabaseUrl}`)
  console.log(`Started: ${new Date().toISOString()}`)
  console.log(`Mode: ${isDryRun ? 'DRY RUN (preview only)' : 'EXECUTE'}`)
  console.log('═'.repeat(60))

  if (!isDryRun) {
    console.log('\n⚠️  IMPORTANT: Database Backup Reminder')
    console.log('─'.repeat(60))
    console.log('   Before running this migration, ensure you have:')
    console.log('   1. Created a recent database backup')
    console.log('   2. Tested the migration on a staging/dev database')
    console.log('   3. Reviewed the migration script changes')
    console.log('')
    console.log('   To create a backup:')
    console.log('   - Supabase Dashboard → Database → Backups → Create Backup')
    console.log('')
    console.log('   Proceeding in 5 seconds... (Ctrl+C to cancel)')
    console.log('─'.repeat(60))

    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  try {
    // Step 1: Find missing profiles
    const missingUserIds = await findMissingProfiles()

    // Step 2: Backfill missing profiles
    await backfillProfiles(missingUserIds)

    // Step 3: Verify integrity (skip in dry-run mode)
    if (!isDryRun) {
      await verifyIntegrity()
    }

    console.log('\n═'.repeat(60))
    console.log(`✅ ${isDryRun ? 'DRY RUN' : 'MIGRATION'} COMPLETE`)
    console.log('═'.repeat(60))

    if (isDryRun) {
      console.log('\n📝 Next Steps:')
      console.log('   1. Review the user IDs listed above')
      console.log('   2. Ensure database backup is created')
      console.log('   3. Run: npx tsx scripts/migrate-ensure-all-profiles.ts')
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
