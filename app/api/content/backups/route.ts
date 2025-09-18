import { NextResponse } from 'next/server'
import { VersionedBackupSystem } from '@/scripts/versioned-backup-system'

export async function GET() {
  try {
    const backupSystem = new VersionedBackupSystem()
    const stats = backupSystem.getSystemStats()

    // Get latest backup info
    const storyPath = 'data/story.json'
    const history = backupSystem.getBackupHistory(storyPath)

    return NextResponse.json({
      totalBackups: stats.totalBackups,
      totalSizeMB: stats.totalSizeMB,
      latestBackup: history.entries.length > 0 ? {
        id: history.entries[0].id,
        timestamp: history.entries[0].metadata.timestamp,
        description: history.entries[0].metadata.description
      } : null
    })
  } catch (error: any) {
    return NextResponse.json({
      error: `Failed to get backup info: ${error.message}`,
      totalBackups: 0,
      totalSizeMB: 0,
      latestBackup: null
    }, { status: 500 })
  }
}