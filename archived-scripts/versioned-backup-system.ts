/**
 * VersionedBackupSystem - Safe File Management with Rollback
 *
 * Provides versioned backups with automatic cleanup and rollback capability
 * Essential for safe story modification operations and change control
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export interface BackupMetadata {
  timestamp: Date
  version: string
  description: string
  fileSize: number
  checksum: string
  operation: string
  author: string
  tags: string[]
}

export interface BackupEntry {
  id: string
  originalPath: string
  backupPath: string
  metadata: BackupMetadata
}

export interface BackupHistory {
  entries: BackupEntry[]
  totalBackups: number
  totalSize: number
  oldestBackup: Date | null
  newestBackup: Date | null
}

export interface RestoreResult {
  success: boolean
  restoredPath: string
  backupUsed: BackupEntry
  checksumVerified: boolean
  errors: string[]
}

/**
 * Versioned backup system with automatic management and rollback
 */
export class VersionedBackupSystem {
  private backupDir: string
  private maxBackups: number
  private maxSizeBytes: number
  private indexPath: string
  private backupIndex: Map<string, BackupEntry[]> = new Map()

  constructor(options: {
    backupDir?: string
    maxBackups?: number
    maxSizeMB?: number
  } = {}) {
    this.backupDir = options.backupDir || path.join(process.cwd(), 'backups')
    this.maxBackups = options.maxBackups || 50
    this.maxSizeBytes = (options.maxSizeMB || 100) * 1024 * 1024 // Convert MB to bytes
    this.indexPath = path.join(this.backupDir, 'backup-index.json')

    this.initializeBackupSystem()
  }

  /**
   * Create a versioned backup of a file
   */
  async createBackup(
    filePath: string,
    options: {
      description?: string
      operation?: string
      author?: string
      tags?: string[]
    } = {}
  ): Promise<BackupEntry> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`)
    }

    const {
      description = 'Automated backup',
      operation = 'unknown',
      author = 'system',
      tags = []
    } = options

    console.log(`📦 Creating backup for: ${filePath}`)

    // Generate backup details
    const timestamp = new Date()
    const backupId = this.generateBackupId(filePath, timestamp)
    const backupFileName = `${path.basename(filePath)}.${backupId}.backup`
    const backupPath = path.join(this.backupDir, backupFileName)

    // Read file and calculate checksum
    const fileContent = fs.readFileSync(filePath)
    const checksum = this.calculateChecksum(fileContent)
    const stats = fs.statSync(filePath)

    // Create backup entry
    const backupEntry: BackupEntry = {
      id: backupId,
      originalPath: path.resolve(filePath),
      backupPath: backupPath,
      metadata: {
        timestamp,
        version: this.generateVersion(),
        description,
        fileSize: stats.size,
        checksum,
        operation,
        author,
        tags
      }
    }

    // Copy file to backup location
    fs.copyFileSync(filePath, backupPath)

    // Update index
    await this.addToIndex(backupEntry)

    // Cleanup old backups if needed
    await this.cleanupOldBackups(filePath)

    console.log(`✅ Backup created: ${backupId}`)
    return backupEntry
  }

  /**
   * List all backups for a file
   */
  getBackupHistory(filePath: string): BackupHistory {
    const resolvedPath = path.resolve(filePath)
    const entries = this.backupIndex.get(resolvedPath) || []

    const totalSize = entries.reduce((sum, entry) => sum + entry.metadata.fileSize, 0)
    const timestamps = entries.map(e => e.metadata.timestamp)

    return {
      entries: entries.sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime()),
      totalBackups: entries.length,
      totalSize,
      oldestBackup: timestamps.length > 0 ? new Date(Math.min(...timestamps.map(t => t.getTime()))) : null,
      newestBackup: timestamps.length > 0 ? new Date(Math.max(...timestamps.map(t => t.getTime()))) : null
    }
  }

  /**
   * Restore a file from backup
   */
  async restoreFromBackup(filePath: string, backupId?: string): Promise<RestoreResult> {
    const resolvedPath = path.resolve(filePath)
    const entries = this.backupIndex.get(resolvedPath) || []

    if (entries.length === 0) {
      return {
        success: false,
        restoredPath: '',
        backupUsed: {} as BackupEntry,
        checksumVerified: false,
        errors: ['No backups found for this file']
      }
    }

    // Find backup to restore (latest if no ID specified)
    let backupToRestore: BackupEntry
    if (backupId) {
      const found = entries.find(e => e.id === backupId)
      if (!found) {
        return {
          success: false,
          restoredPath: '',
          backupUsed: {} as BackupEntry,
          checksumVerified: false,
          errors: [`Backup ${backupId} not found`]
        }
      }
      backupToRestore = found
    } else {
      // Get most recent backup
      backupToRestore = entries.sort((a, b) =>
        b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime()
      )[0]
    }

    console.log(`🔄 Restoring from backup: ${backupToRestore.id}`)

    const errors: string[] = []

    // Verify backup file exists
    if (!fs.existsSync(backupToRestore.backupPath)) {
      return {
        success: false,
        restoredPath: '',
        backupUsed: backupToRestore,
        checksumVerified: false,
        errors: ['Backup file not found on disk']
      }
    }

    // Verify checksum
    const backupContent = fs.readFileSync(backupToRestore.backupPath)
    const actualChecksum = this.calculateChecksum(backupContent)
    const checksumVerified = actualChecksum === backupToRestore.metadata.checksum

    if (!checksumVerified) {
      errors.push('Backup file checksum mismatch - file may be corrupted')
    }

    try {
      // Create backup of current file before restoring
      if (fs.existsSync(resolvedPath)) {
        await this.createBackup(resolvedPath, {
          description: 'Pre-restore backup',
          operation: 'restore-preparation',
          author: 'backup-system'
        })
      }

      // Restore the file
      fs.copyFileSync(backupToRestore.backupPath, resolvedPath)

      console.log(`✅ File restored successfully`)

      return {
        success: true,
        restoredPath: resolvedPath,
        backupUsed: backupToRestore,
        checksumVerified,
        errors
      }

    } catch (error: any) {
      return {
        success: false,
        restoredPath: '',
        backupUsed: backupToRestore,
        checksumVerified,
        errors: [`Restore failed: ${error.message}`]
      }
    }
  }

  /**
   * Delete specific backup
   */
  async deleteBackup(backupId: string): Promise<boolean> {
    console.log(`🗑️ Deleting backup: ${backupId}`)

    let found = false
    for (const [filePath, entries] of this.backupIndex) {
      const entryIndex = entries.findIndex(e => e.id === backupId)
      if (entryIndex !== -1) {
        const entry = entries[entryIndex]

        // Delete backup file
        if (fs.existsSync(entry.backupPath)) {
          fs.unlinkSync(entry.backupPath)
        }

        // Remove from index
        entries.splice(entryIndex, 1)
        if (entries.length === 0) {
          this.backupIndex.delete(filePath)
        }

        found = true
        break
      }
    }

    if (found) {
      await this.saveIndex()
      console.log(`✅ Backup deleted: ${backupId}`)
    }

    return found
  }

  /**
   * Get system statistics
   */
  getSystemStats(): {
    totalFiles: number
    totalBackups: number
    totalSizeBytes: number
    totalSizeMB: number
    oldestBackup: Date | null
    newestBackup: Date | null
    averageBackupsPerFile: number
  } {
    let totalBackups = 0
    let totalSize = 0
    const allTimestamps: Date[] = []

    for (const entries of this.backupIndex.values()) {
      totalBackups += entries.length
      totalSize += entries.reduce((sum, e) => sum + e.metadata.fileSize, 0)
      allTimestamps.push(...entries.map(e => e.metadata.timestamp))
    }

    return {
      totalFiles: this.backupIndex.size,
      totalBackups,
      totalSizeBytes: totalSize,
      totalSizeMB: Number((totalSize / (1024 * 1024)).toFixed(2)),
      oldestBackup: allTimestamps.length > 0
        ? new Date(Math.min(...allTimestamps.map(t => t.getTime())))
        : null,
      newestBackup: allTimestamps.length > 0
        ? new Date(Math.max(...allTimestamps.map(t => t.getTime())))
        : null,
      averageBackupsPerFile: this.backupIndex.size > 0
        ? Number((totalBackups / this.backupIndex.size).toFixed(1))
        : 0
    }
  }

  /**
   * Cleanup old backups based on policies
   */
  async cleanupOldBackups(filePath?: string): Promise<number> {
    console.log('🧹 Running backup cleanup...')

    let deletedCount = 0
    const filesToClean = filePath ? [path.resolve(filePath)] : Array.from(this.backupIndex.keys())

    for (const file of filesToClean) {
      const entries = this.backupIndex.get(file) || []

      if (entries.length <= this.maxBackups) continue

      // Sort by timestamp (newest first)
      entries.sort((a, b) => b.metadata.timestamp.getTime() - a.metadata.timestamp.getTime())

      // Keep only the most recent maxBackups
      const toDelete = entries.splice(this.maxBackups)

      for (const entry of toDelete) {
        if (fs.existsSync(entry.backupPath)) {
          fs.unlinkSync(entry.backupPath)
        }
        deletedCount++
      }
    }

    // Check total system size
    const stats = this.getSystemStats()
    if (stats.totalSizeBytes > this.maxSizeBytes) {
      deletedCount += await this.cleanupBySize()
    }

    if (deletedCount > 0) {
      await this.saveIndex()
      console.log(`🧹 Cleaned up ${deletedCount} old backups`)
    }

    return deletedCount
  }

  /**
   * Export backup configuration and index
   */
  async exportBackupManifest(): Promise<string> {
    const manifest = {
      exportDate: new Date().toISOString(),
      backupDirectory: this.backupDir,
      systemStats: this.getSystemStats(),
      configuration: {
        maxBackups: this.maxBackups,
        maxSizeBytes: this.maxSizeBytes
      },
      backupIndex: Object.fromEntries(
        Array.from(this.backupIndex.entries()).map(([path, entries]) => [
          path,
          entries.map(entry => ({
            ...entry,
            metadata: {
              ...entry.metadata,
              timestamp: entry.metadata.timestamp.toISOString()
            }
          }))
        ])
      )
    }

    const manifestPath = path.join(this.backupDir, `backup-manifest-${Date.now()}.json`)
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))

    console.log(`📋 Backup manifest exported: ${manifestPath}`)
    return manifestPath
  }

  // Private methods

  private initializeBackupSystem(): void {
    // Create backup directory
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true })
      console.log(`📁 Created backup directory: ${this.backupDir}`)
    }

    // Load existing index
    this.loadIndex()
  }

  private loadIndex(): void {
    if (fs.existsSync(this.indexPath)) {
      try {
        const indexData = JSON.parse(fs.readFileSync(this.indexPath, 'utf-8'))

        for (const [filePath, entries] of Object.entries(indexData)) {
          this.backupIndex.set(filePath, (entries as any[]).map(entry => ({
            ...entry,
            metadata: {
              ...entry.metadata,
              timestamp: new Date(entry.metadata.timestamp)
            }
          })))
        }

        console.log(`📚 Loaded backup index: ${this.backupIndex.size} files tracked`)
      } catch (error) {
        console.log('⚠️ Failed to load backup index, starting fresh')
        this.backupIndex = new Map()
      }
    }
  }

  private async saveIndex(): Promise<void> {
    const indexData = Object.fromEntries(
      Array.from(this.backupIndex.entries()).map(([path, entries]) => [
        path,
        entries.map(entry => ({
          ...entry,
          metadata: {
            ...entry.metadata,
            timestamp: entry.metadata.timestamp.toISOString()
          }
        }))
      ])
    )

    fs.writeFileSync(this.indexPath, JSON.stringify(indexData, null, 2))
  }

  private async addToIndex(entry: BackupEntry): Promise<void> {
    const filePath = entry.originalPath

    if (!this.backupIndex.has(filePath)) {
      this.backupIndex.set(filePath, [])
    }

    this.backupIndex.get(filePath)!.push(entry)
    await this.saveIndex()
  }

  private generateBackupId(filePath: string, timestamp: Date): string {
    const fileName = path.basename(filePath, path.extname(filePath))
    const dateStr = timestamp.toISOString().replace(/[:.]/g, '-')
    const hash = crypto.createHash('md5').update(filePath + timestamp.getTime()).digest('hex').substring(0, 8)
    return `${fileName}-${dateStr}-${hash}`
  }

  private generateVersion(): string {
    // Simple version based on timestamp
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hour = String(now.getHours()).padStart(2, '0')
    const minute = String(now.getMinutes()).padStart(2, '0')

    return `${year}.${month}.${day}.${hour}${minute}`
  }

  private calculateChecksum(content: Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex')
  }

  private async cleanupBySize(): Promise<number> {
    // Collect all entries across all files
    const allEntries: Array<{ entry: BackupEntry; filePath: string }> = []

    for (const [filePath, entries] of this.backupIndex) {
      for (const entry of entries) {
        allEntries.push({ entry, filePath })
      }
    }

    // Sort by timestamp (oldest first for deletion)
    allEntries.sort((a, b) => a.entry.metadata.timestamp.getTime() - b.entry.metadata.timestamp.getTime())

    let deletedCount = 0
    let currentSize = this.getSystemStats().totalSizeBytes

    for (const { entry, filePath } of allEntries) {
      if (currentSize <= this.maxSizeBytes) break

      // Delete backup file
      if (fs.existsSync(entry.backupPath)) {
        fs.unlinkSync(entry.backupPath)
        currentSize -= entry.metadata.fileSize
      }

      // Remove from index
      const entries = this.backupIndex.get(filePath)!
      const index = entries.findIndex(e => e.id === entry.id)
      if (index !== -1) {
        entries.splice(index, 1)
        if (entries.length === 0) {
          this.backupIndex.delete(filePath)
        }
      }

      deletedCount++
    }

    return deletedCount
  }
}

// Export convenience function
export const createBackupSystem = (options?: {
  backupDir?: string
  maxBackups?: number
  maxSizeMB?: number
}) => new VersionedBackupSystem(options)