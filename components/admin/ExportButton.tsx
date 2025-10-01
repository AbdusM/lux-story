/**
 * Export Button Component
 * Triggers PDF generation for skills-based career profile
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { downloadSkillsReport } from '@/lib/pdf-export';
import type { SkillProfile } from '@/lib/skill-profile-adapter';

interface ExportButtonProps {
  profile: SkillProfile;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  profile,
  variant = 'outline',
  size = 'default'
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await downloadSkillsReport(profile);
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      onClick={handleExport}
      variant={variant}
      size={size}
      disabled={isExporting}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      {isExporting ? 'Generating...' : 'Export PDF'}
    </Button>
  );
};
