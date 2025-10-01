/**
 * Advisor Briefing Button Component
 *
 * Triggers AI-powered strategic briefing generation
 * The "Co-Pilot" feature for administrators
 *
 * Week 2 Day 3 Enhancement: Now includes WEF 2030 Skills with evidence
 */

'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import type { SkillProfile } from '@/lib/skill-profile-adapter';
import { AdvisorBriefingModal } from './AdvisorBriefingModal';

interface AdvisorBriefingButtonProps {
  profile: SkillProfile;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

interface SkillSummary {
  skillName: string;
  demonstrationCount: number;
  latestContext: string;
  scenesInvolved: string[];
  lastDemonstrated: string;
}

export const AdvisorBriefingButton: React.FC<AdvisorBriefingButtonProps> = ({
  profile,
  variant = 'default',
  size = 'default'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  /**
   * Fetch skill summaries from Supabase API
   */
  const fetchSkillsData = async (userId: string): Promise<SkillSummary[]> => {
    console.log('🔍 [AdvisorBriefing] Fetching skills:', { userId })

    try {
      const response = await fetch(`/api/user/skill-summaries?userId=${userId}`);

      if (!response.ok) {
        console.warn('⚠️ [AdvisorBriefing] Skills API failed, continuing without skills data:', {
          status: response.status
        });
        return [];
      }

      const data = await response.json();

      console.log('✅ [AdvisorBriefing] Skills loaded:', {
        userId,
        skillCount: data.summaries?.length || 0,
        topSkills: data.summaries?.slice(0, 3).map((s: any) => s.skillName)
      })

      return data.summaries || [];
    } catch (error) {
      console.warn('⚠️ [AdvisorBriefing] Skills fetch error:', error);
      return [];
    }
  };

  /**
   * Format skill name for display (critical_thinking → Critical Thinking)
   */
  const formatSkillName = (skillName: string): string => {
    return skillName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleGenerate = async () => {
    const startTime = Date.now()

    try {
      setIsGenerating(true);
      setError(null);

      console.log('📝 [AdvisorBriefing] Generating briefing:', {
        userId: profile.userId,
        totalDemonstrations: profile.totalDemonstrations
      })

      // Fetch skills data from API (parallel with briefing preparation)
      const skillsData = await fetchSkillsData(profile.userId);

      // Send both profile and skills data to API
      const response = await fetch('/api/advisor-briefing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile,
          skillsData // NEW: Include WEF 2030 skills with evidence
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate briefing');
      }

      const data = await response.json();
      const generationTime = Date.now() - startTime

      console.log('✅ [AdvisorBriefing] Briefing generated:', {
        userId: profile.userId,
        briefingLength: data.briefing?.length || 0,
        tokensUsed: data.tokensUsed,
        generationTimeMs: generationTime
      })

      setBriefing(data.briefing);
      setShowModal(true);

      // Cache the briefing in localStorage to avoid re-generation
      const cacheKey = `advisor_briefing_${profile.userId}`;
      localStorage.setItem(cacheKey, JSON.stringify({
        briefing: data.briefing,
        generatedAt: data.generatedAt,
        tokensUsed: data.tokensUsed
      }));

    } catch (error) {
      const errorTime = Date.now() - startTime
      console.error('❌ [AdvisorBriefing] Error:', {
        userId: profile.userId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timeMs: errorTime
      });
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
      alert(`Failed to generate briefing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button
        onClick={handleGenerate}
        variant={variant}
        size={size}
        disabled={isGenerating || profile.totalDemonstrations === 0}
        className="gap-2"
        title={
          profile.totalDemonstrations === 0
            ? 'No skill demonstrations yet. Student needs to complete more of the journey.'
            : 'Generate AI-powered strategic briefing (~10 seconds)'
        }
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Generate Advisor Briefing
          </>
        )}
      </Button>

      {showModal && briefing && (
        <AdvisorBriefingModal
          briefing={briefing}
          profile={profile}
          onClose={handleClose}
        />
      )}
    </>
  );
};
