import { NextResponse } from 'next/server'
import { VersionedBackupSystem } from '@/scripts/versioned-backup-system'

export async function POST(request: Request) {
  try {
    const { backupId } = await request.json()

    if (!backupId) {
      return NextResponse.json({ error: 'Backup ID required' }, { status: 400 })
    }

    const backupSystem = new VersionedBackupSystem()
    const result = await backupSystem.restoreFromBackup('data/story.json', backupId)

    return NextResponse.json({
      success: result.success,
      error: result.errors.join(', ') || null
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: `Restore failed: ${error.message}`
    }, { status: 500 })
  }
}