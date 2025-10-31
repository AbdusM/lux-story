'use client'

/**
 * SingleUserDashboard - Skills Analytics Dashboard
 *
 * MOCK DATA REPLACEMENT CHECKLIST (Priority Order):
 * ================================================
 *
 * 🔴 HIGH PRIORITY (Replace First):
 * 1. Evidence Tab (Lines ~782-789): Top-level mock data warning
 *    - Source: Add Alert component flagging demo mode
 *    - Status: ✅ COMPLETED
 *
 * 2. Evidence Tab - All 5 Frameworks (Lines ~799-913):
 *    - Framework 1 (WEF 2030 Skills): Pull from Supabase skill_demonstrations table
 *    - Framework 2 (Erikson Identity): Calculate from player_persona developmental stage analysis
 *    - Framework 3 (Flow Theory): Calculate from game_state scene_history timestamps + engagement metrics
 *    - Framework 4 (Limbic Learning): Pull from player_persona behavior_metrics stress indicators
 *    - Framework 5 (SCCT Self-Efficacy): Derive from choice_history confidence + skill demonstrations
 *    - Status: ✅ FLAGGED with yellow badges and TODO comments
 *
 * 3. Evidence Tab - Grant-Reportable Outcomes (Lines ~917-966):
 *    - Aggregate metrics from skill_demonstrations, career_matches, player_persona
 *    - Calculate real percentages and counts from Supabase tables
 *    - Status: ✅ FLAGGED with yellow badge and TODO comment
 *
 * 🟡 MEDIUM PRIORITY (Replace After Evidence Tab):
 * 4. Careers Tab - Career Matching Algorithm (Line ~687):
 *    - Replace mock career match logic with production Supabase queries
 *    - Integrate skill_demonstrations + BIRMINGHAM_OPPORTUNITIES data
 *    - Status: ✅ FLAGGED with TODO comment
 *
 * 5. Mock User Data Object (Lines ~47-193):
 *    - Currently used as fallback/reference
 *    - Replace with actual SkillProfile from props
 *    - Note: Most of dashboard already uses real profile prop, but mock data shows structure
 *    - Status: ⚠️ REFERENCE ONLY - Can remain for development
 *
 * 🟢 LOW PRIORITY (Data Already Real):
 * - Urgency Tab: ✅ Already pulling from /api/admin/urgency
 * - Skills Tab: ✅ Already pulling from profile.skillDemonstrations (real data)
 * - 2030 Skills Tab: ✅ Already pulling from /api/user/skill-summaries
 * - Gaps Tab: Uses profile.skillGaps (derived from real data)
 * - Action Tab: Uses profile data (real)
 *
 * NARRATIVE BRIDGES ADDED (Agent 2: Issue 7A-7C - ALL <25 WORDS):
 * ✅ Urgency → Skills (Line ~864): Shows focus areas from urgency analysis (13/7 words)
 * ✅ Skills → Careers (Line ~1188): Connects skill demonstrations to Birmingham careers (16/14 words)
 * ✅ Careers → Gaps (Line ~1824): Reframes gaps as opportunities for development (16/12 words)
 * ✅ Gaps → Action (Line ~2025): Bridges skill gaps to concrete Birmingham actions (13/9 words)
 * ✅ Action → Evidence (Line ~2179): Links action recommendations to research frameworks (13/8 words)
 *
 * IMPLEMENTATION NOTES:
 * - All mock data sections have yellow "Mock Data" badges for visibility
 * - TODO comments include specific Supabase table/column references
 * - Warnings are informational (yellow), not alarming (red)
 * - Production replacement priority: Evidence Tab first (highest stakeholder visibility)
 */

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, TrendingUp, Briefcase, Lightbulb, CheckCircle2, AlertTriangle, RefreshCw, Award, BookOpen, Building2, AlertCircle, Users, GraduationCap, ChevronDown, ChevronRight, ArrowRight } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { SkillProfile } from '@/lib/skill-profile-adapter';
import { ExportButton } from '@/components/admin/ExportButton';
import { AdvisorBriefingButton } from '@/components/admin/AdvisorBriefingButton';
import { BIRMINGHAM_OPPORTUNITIES } from '@/lib/simple-career-analytics';
import { SkillProgressionChart } from '@/components/admin/SkillProgressionChart';
import { SparklineTrend } from '@/components/admin/SparklineTrend';
import { analyzeSkillPatterns, sortSkillPatterns, type SkillPattern, type SortMode } from '@/lib/admin-pattern-recognition';
import { getUrgencyClasses } from '@/lib/admin-urgency-classes';
import { PatternRecognitionCard } from '@/components/admin/PatternRecognitionCard';
import { formatAdminDate, formatAdminDateWithLabel, type DateContext, type ViewMode } from '@/lib/admin-date-formatting';

interface SingleUserDashboardProps {
  userId: string
  profile: SkillProfile
}

interface UrgencyData {
  userId: string
  urgencyLevel: 'critical' | 'high' | 'medium' | 'low' | null
  urgencyScore: number
  urgencyNarrative: string
  disengagementScore: number
  confusionScore: number
  stressScore: number
  isolationScore: number
  lastActivity: string
  totalChoices: number
  uniqueScenesVisited: number
  relationshipsFormed: number
}

interface SkillSummary {
  skillName: string
  demonstrationCount: number
  latestContext: string
  scenesInvolved: string[]
  lastDemonstrated: string
}

/**
 * Data Source Badge Component
 * Shows whether framework is using real, partial, or mock data
 */
function DataSourceBadge({
  hasRealData,
  minDemonstrations,
  actualDemonstrations
}: {
  hasRealData: boolean
  minDemonstrations: number
  actualDemonstrations: number
}) {
  if (hasRealData && actualDemonstrations >= minDemonstrations) {
    return (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
        ✓ Real Data ({actualDemonstrations} demos)
      </Badge>
    )
  } else if (actualDemonstrations >= Math.floor(minDemonstrations / 2)) {
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
        ⚠ Partial ({actualDemonstrations}/{minDemonstrations} demos)
      </Badge>
    )
  } else {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300 text-xs">
        ⊗ Mock Data ({actualDemonstrations}/{minDemonstrations} demos)
      </Badge>
    )
  }
}

const SingleUserDashboard: React.FC<SingleUserDashboardProps> = ({ userId, profile }) => {
  const [activeTab, setActiveTab] = useState("urgency");
  const user = profile; // Use real profile data instead of mock

  // Global Admin View Mode - Family/Research toggle (Issue 5C - Global Extension)
  const [adminViewMode, setAdminViewMode] = useState<'family' | 'research'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('admin_view_preference') as 'family' | 'research') || 'family';
    }
    return 'family';
  });

  // Persist adminViewMode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_view_preference', adminViewMode);
    }
  }, [adminViewMode]);

  // Urgency data state
  const [urgencyData, setUrgencyData] = useState<UrgencyData | null>(null);
  const [urgencyLoading, setUrgencyLoading] = useState(false);
  const [urgencyError, setUrgencyError] = useState<string | null>(null);
  const [recalculating, setRecalculating] = useState(false);

  // 2030 Skills data state
  const [skillsData, setSkillsData] = useState<SkillSummary[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);

  // Agent 3: Skills tab state (Issue 5A - collapsed demonstrations)
  const [expandedCoreSkill, setExpandedCoreSkill] = useState<string | null>(null);
  const [skillSortMode, setSkillSortMode] = useState<SortMode>('by_count');
  const [skillsToShow, setSkillsToShow] = useState<number>(15); // Show first 15 skills initially

  // Agent 4: Careers Tab state (Issue 5B - show met requirements toggle)
  const [showMetRequirements, setShowMetRequirements] = useState(false);

  // Agent 6: Cross-tab navigation state (Issue 6A - highlighting)
  const [highlightedSkill, setHighlightedSkill] = useState<string | null>(null);
  const [highlightedCareer, setHighlightedCareer] = useState<string | null>(null);
  // Evidence frameworks data state
  const [evidenceData, setEvidenceData] = useState<any>(null);
  const [evidenceLoading, setEvidenceLoading] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);

  // Agent 9: Mobile tab scroll gradient (Issue 42)
  const tabsListRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tabsList = tabsListRef.current
    if (!tabsList) return

    const handleScroll = () => {
      const isScrolled = tabsList.scrollLeft > 0
      tabsList.setAttribute('data-scrolled', isScrolled.toString())
    }

    tabsList.addEventListener('scroll', handleScroll)
    // Check initial scroll position
    handleScroll()

    return () => {
      tabsList.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Agent 6: Clear highlights after 3 seconds (Issue 6A)
  useEffect(() => {
    if (highlightedSkill || highlightedCareer) {
      const timer = setTimeout(() => {
        setHighlightedSkill(null);
        setHighlightedCareer(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedSkill, highlightedCareer])

  // Fetch urgency data for this specific user
  useEffect(() => {
    const fetchUrgencyData = async () => {
      setUrgencyLoading(true);
      setUrgencyError(null);

      try {
        // Use admin proxy with userId filter to fetch only this user's data
        const response = await fetch(`/api/admin-proxy/urgency?userId=${encodeURIComponent(userId)}`);

        if (!response.ok) {
          throw new Error('Failed to fetch urgency data');
        }

        const data = await response.json();

        // API should return single user object, not array
        if (data.user) {
          setUrgencyData(data.user);
        } else if (data.students && Array.isArray(data.students)) {
          // Fallback: if API still returns array, find user
          const student = data.students.find((s: UrgencyData) => s.userId === userId);
          setUrgencyData(student || null);
        } else {
          setUrgencyData(null);
        }
      } catch (error) {
        console.error('Error fetching urgency data:', error);
        setUrgencyError('Unable to load urgency data');
      } finally {
        setUrgencyLoading(false);
      }
    };

    if (userId) {
      fetchUrgencyData();
    }
  }, [userId]);

  // Fetch 2030 skills data for this specific user
  useEffect(() => {
    const fetchSkillsData = async () => {
      setSkillsLoading(true);
      setSkillsError(null);

      try {
        // skill-summaries API doesn't require auth token (user-scoped endpoint)
        const response = await fetch(`/api/user/skill-summaries?userId=${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch skills data');
        }

        const data = await response.json();

        if (data.success) {
          setSkillsData(data.summaries || []);
        } else {
          setSkillsError('Failed to load skill data');
        }
      } catch (error) {
        console.error('Error fetching skills data:', error);
        setSkillsError('Unable to load skill summaries');
      } finally {
        setSkillsLoading(false);
      }
    };

    if (userId) {
      fetchSkillsData();
    }
  }, [userId]);

  // Fetch Evidence frameworks data
  useEffect(() => {
    const fetchEvidenceData = async () => {
      setEvidenceLoading(true);
      setEvidenceError(null);

      try {
        const response = await fetch(`/api/admin/evidence/${userId}`);

        if (!response.ok) {
          throw new Error('Failed to fetch evidence data');
        }

        const data = await response.json();
        setEvidenceData(data);
      } catch (error) {
        console.error('Error fetching evidence data:', error);
        setEvidenceError('Unable to load evidence frameworks');
      } finally {
        setEvidenceLoading(false);
      }
    };

    if (userId) {
      fetchEvidenceData();
    }
  }, [userId]);

  // Recalculate urgency for this user
  const handleRecalculate = async () => {
    setRecalculating(true);
    try {
      // Use admin proxy to avoid exposing token in client bundle
      const response = await fetch('/api/admin-proxy/urgency', {
        method: 'POST'
      });

      if (response.ok) {
        // Refetch urgency data after recalculation using optimized single-user endpoint
        const dataResponse = await fetch(`/api/admin-proxy/urgency?userId=${encodeURIComponent(userId)}`);

        if (dataResponse.ok) {
          const data = await dataResponse.json();
          if (data.user) {
            setUrgencyData(data.user);
          } else if (data.students && Array.isArray(data.students)) {
            // Fallback: if API still returns array
            const student = data.students.find((s: UrgencyData) => s.userId === userId);
            setUrgencyData(student || null);
          }
        }
      }
    } catch (error) {
      console.error('Recalculation failed:', error);
    } finally {
      setRecalculating(false);
    }
  };

  const formatSkillName = (skill: string): string => {
    return skill
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim()
  };

  const getReadinessDisplay = (readiness: string): { text: string; variant: 'default' | 'secondary' | 'outline' } => {
    switch (readiness) {
      case 'near_ready':
        return { text: 'Near Ready', variant: 'default' };
      case 'skill_gaps':
        return { text: 'Skill Gaps', variant: 'secondary' };
      case 'exploratory':
        return { text: 'Exploratory', variant: 'outline' };
      default:
        return { text: 'Unknown', variant: 'outline' };
    }
  };

  // Helper function to get Birmingham career connections for a skill
  const getBirminghamConnectionsForSkill = (skillName: string): string[] => {
    const skillToCareerMap: Record<string, string[]> = {
      'critical_thinking': ['UAB Healthcare', 'Regions Bank Analytics', 'Innovation Depot Tech'],
      'communication': ['UAB Community Health', 'Birmingham City Schools', 'Local Non-profits'],
      'collaboration': ['Community Health Programs', 'YMCA Youth Programs', 'City Projects'],
      'creativity': ['Innovation Depot Startups', 'Birmingham Arts Scene', 'Design Studios'],
      'adaptability': ['Tech Startups', 'Healthcare Innovation', 'Entrepreneurship Programs'],
      'leadership': ['Youth Leadership Programs', 'Community Organizations', 'Team Projects'],
      'digital_literacy': ['Regions Bank IT', 'Shipt Tech', 'Innovation Depot'],
      'emotional_intelligence': ['UAB Healthcare', 'Community Health', 'Social Services'],
      'cultural_competence': ['Community Health', 'Birmingham Non-profits', 'Public Service'],
      'financial_literacy': ['Regions Bank', 'Local Credit Unions', 'Financial Planning'],
      'time_management': ['All Professional Paths', 'Project Management', 'Operations'],
      'problem_solving': ['Engineering (Southern Company)', 'Healthcare Tech', 'Data Analytics']
    };

    return skillToCareerMap[skillName.toLowerCase()] || ['Various Birmingham Career Paths'];
  };

  // Get color for skill demonstration count
  const getSkillColor = (count: number, maxCount: number): string => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return 'bg-orange-500';
    if (ratio > 0.4) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  // Agent 3: Recency indicator helper (Issue 12) - Enhanced with viewMode support
  const getRecencyIndicator = (timestamp?: number): { color: string; label: string; familyLabel: string; researchLabel: string } => {
    if (!timestamp) return {
      color: 'bg-gray-400',
      label: 'Unknown',
      familyLabel: '',
      researchLabel: ''
    };

    const now = Date.now();
    const daysSince = (now - timestamp) / (1000 * 60 * 60 * 24);

    if (daysSince < 3) {
      return {
        color: 'bg-green-500',
        label: 'Recent (<3 days)',
        familyLabel: 'New!',
        researchLabel: '<3 days'
      };
    }
    if (daysSince < 7) {
      return {
        color: 'bg-yellow-500',
        label: 'This week',
        familyLabel: 'This week',
        researchLabel: '3-7 days'
      };
    }
    return {
      color: 'bg-gray-400',
      label: `${Math.floor(daysSince)} days ago`,
      familyLabel: '',
      researchLabel: `>${Math.floor(daysSince)} days`
    };
  };

  // Tab navigation helpers
  const getTabLabel = (tabValue: string): string => {
    const labels: Record<string, string> = {
      urgency: 'Urgency',
      skills: 'Skills',
      careers: 'Careers',
      evidence: 'Evidence',
      gaps: 'Gaps',
      action: 'Action',
      '2030skills': '2030 Skills'
    };
    return labels[tabValue] || tabValue;
  };

  const getNextTab = (currentTab: string): { value: string; label: string } | null => {
    const tabFlow: Record<string, { value: string; label: string }> = {
      urgency: { value: 'skills', label: 'View Skills' },
      skills: { value: 'careers', label: 'View Career Matches' },
      careers: { value: 'gaps', label: 'Identify Skill Gaps' },
      gaps: { value: 'action', label: 'See Action Plan' },
      action: { value: '2030skills', label: 'Review 2030 Skills' },
      evidence: { value: 'skills', label: 'View Skills' },
      '2030skills': { value: 'urgency', label: 'Review Urgency' }
    };
    return tabFlow[currentTab] || null;
  };

  // Agent 6: Cross-tab navigation helpers (Issue 6A - Section 4.1)
  const jumpToSkillsTab = (skillName: string) => {
    setHighlightedSkill(skillName);
    setActiveTab('skills');
    // Scroll to skill after a brief delay to allow tab switch
    setTimeout(() => {
      const element = document.getElementById(`skill-${skillName.toLowerCase().replace(/\s+/g, '-')}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const jumpToCareersTab = (careerId: string) => {
    setHighlightedCareer(careerId);
    setActiveTab('careers');
    // Scroll to career after a brief delay to allow tab switch
    setTimeout(() => {
      const element = document.getElementById(`career-${careerId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Helper to get top skills for summary
  const getTopSkills = () => {
    if (!user.skillDemonstrations) return [];
    return Object.entries(user.skillDemonstrations)
      .map(([skill, demos]) => ({
        skill,
        count: Array.isArray(demos) ? demos.length : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => item.skill.replace(/([A-Z])/g, ' $1').trim());
  };

  // Helper to calculate readiness percentage
  const getReadinessPercentage = () => {
    if (!user.careerMatches || user.careerMatches.length === 0) return null;
    const topCareer = user.careerMatches[0];
    if (!topCareer.requiredSkills) return null;
    
    const skills = Object.values(topCareer.requiredSkills);
    const avgGap = skills.reduce((sum, skill) => sum + skill.gap, 0) / skills.length;
    return Math.max(0, Math.min(100, Math.round((1 - avgGap) * 100)));
  };

  // Helper to find careers that use a specific skill
  const getCareersUsingSkill = (skillName: string) => {
    if (!user.careerMatches) return [];
    return user.careerMatches.filter(career =>
      Object.keys(career.requiredSkills).some(reqSkill =>
        reqSkill.toLowerCase() === skillName.toLowerCase()
      )
    ).slice(0, 3); // Show top 3 careers
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{user.userName}</CardTitle>
              <CardDescription>
                Skills-Based Career Profile
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {user.careerMatches && user.careerMatches.length > 0 && (
                <Badge variant={getReadinessDisplay(user.careerMatches[0].readiness).variant} className="text-lg">
                  {getReadinessDisplay(user.careerMatches[0].readiness).text}
                </Badge>
              )}
              <AdvisorBriefingButton profile={user} variant="default" size="default" />
              <ExportButton profile={user} variant="outline" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quick Summary Bar - At a Glance Metrics */}
      <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-blue-200">
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Total Skill Moments */}
            <div className="text-center sm:text-left">
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-1">
                {user.totalDemonstrations || 0}
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                {adminViewMode === 'family' 
                  ? 'times they showed skills'
                  : 'skill demonstrations'}
              </div>
            </div>

            {/* Top Skills */}
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {adminViewMode === 'family' ? 'Building' : 'Top Skills'}
              </div>
              <div className="text-sm sm:text-base text-gray-600 space-y-1">
                {getTopSkills().length > 0 ? (
                  getTopSkills().map((skill, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="capitalize">{skill}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-gray-500 italic">Just getting started</span>
                )}
              </div>
            </div>

            {/* Readiness Percentage */}
            {getReadinessPercentage() !== null && (
              <div className="text-center sm:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                  {getReadinessPercentage()}%
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {adminViewMode === 'family' 
                    ? 'ready for top career'
                    : 'readiness score'}
                </div>
                {user.careerMatches && user.careerMatches.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {user.careerMatches[0].name}
                  </div>
                )}
              </div>
            )}

            {/* Current Activity */}
            <div className="text-center sm:text-left">
              <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {adminViewMode === 'family' ? 'Currently' : 'Status'}
              </div>
              <div className="text-sm sm:text-base text-gray-600">
                {urgencyData?.currentScene ? (
                  <span className="capitalize">{urgencyData.currentScene.replace(/_/g, ' ')}</span>
                ) : user.skillDemonstrations && Object.keys(user.skillDemonstrations).length > 0 ? (
                  <span>Exploring story paths</span>
                ) : (
                  <span className="text-gray-500 italic">Getting started</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Global Dashboard View Mode Toggle - Sticky Header */}
      <div className="sticky top-0 z-20 bg-white pb-2">
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs sm:text-sm font-medium text-gray-700">Dashboard View:</p>
              <RadioGroup
                value={adminViewMode}
                onValueChange={(value) => setAdminViewMode(value as 'family' | 'research')}
                className="flex gap-2"
              >
                <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-md hover:bg-white/50 transition-colors cursor-pointer min-h-[44px] border border-transparent hover:border-purple-300">
                  <RadioGroupItem value="family" id="global-mode-family" />
                  <label htmlFor="global-mode-family" className="flex items-center gap-1.5 cursor-pointer">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs sm:text-sm font-medium">Personal</span>
                    {adminViewMode === 'family' && (
                      <Badge variant="default" className="text-xs ml-1">Active</Badge>
                    )}
                  </label>
                </div>

                <div className="flex items-center space-x-2 p-2 sm:p-3 rounded-md hover:bg-white/50 transition-colors cursor-pointer min-h-[44px] border border-transparent hover:border-blue-300">
                  <RadioGroupItem value="research" id="global-mode-research" />
                  <label htmlFor="global-mode-research" className="flex items-center gap-1.5 cursor-pointer">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs sm:text-sm font-medium">Analysis</span>
                    {adminViewMode === 'research' && (
                      <Badge variant="default" className="text-xs ml-1">Active</Badge>
                    )}
                  </label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Agent 6: Breadcrumb Navigation (Issue 6A) */}
        <div className="mb-4 flex items-center gap-2 text-sm text-gray-600 px-2">
          <a href="/admin" className="hover:text-blue-600 transition-colors">
            All Students
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="font-medium text-gray-900">{user.userName}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-blue-600 font-medium">{getTabLabel(activeTab)}</span>
        </div>

        <TabsList
          ref={tabsListRef}
          className="admin-mobile-tabs grid w-full grid-cols-2 sm:grid-cols-6"
        >
          {/* Agent 6: Active tab visual state (Issue 6B) */}
          <TabsTrigger
            value="urgency"
            className="data-[state=active]:bg-blue-50 data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:font-semibold"
          >
            Urgency
          </TabsTrigger>
          <TabsTrigger
            value="skills"
            className="data-[state=active]:bg-blue-50 data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:font-semibold"
          >
            Skills
          </TabsTrigger>
          <TabsTrigger
            value="careers"
            className="data-[state=active]:bg-blue-50 data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:font-semibold"
          >
            Careers
          </TabsTrigger>
          <TabsTrigger
            value="evidence"
            className="data-[state=active]:bg-blue-50 data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:font-semibold"
          >
            Evidence
          </TabsTrigger>
          <TabsTrigger
            value="gaps"
            className="data-[state=active]:bg-blue-50 data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:font-semibold"
          >
            Gaps
          </TabsTrigger>
          <TabsTrigger
            value="action"
            className="data-[state=active]:bg-blue-50 data-[state=active]:border-t-2 data-[state=active]:border-t-blue-600 data-[state=active]:font-semibold"
          >
            Action
          </TabsTrigger>
        </TabsList>

        {/* URGENCY TAB - Glass Box intervention priority */}
        <TabsContent value="urgency" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Intervention Priority
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Your intervention priority with transparent narrative justification
                  </CardDescription>
                </div>
                <Button
                  onClick={handleRecalculate}
                  disabled={recalculating}
                  size="sm"
                  className="gap-2 min-h-[44px] w-full sm:w-auto"
                >
                  <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
                  Recalculate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {urgencyLoading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading urgency data...
                </div>
              ) : urgencyError ? (
                <div className="text-center py-12 text-red-500">
                  {urgencyError}
                </div>
              ) : !urgencyData ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-gray-600 text-sm sm:text-base">No urgency data available for you yet.</p>
                  <p className="text-sm text-gray-500">
                    Click "Recalculate" to generate your urgency score.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
          {/* Urgency Level Badge and Score - WCAG AA compliant with color consistency */}
                  <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${getUrgencyClasses(urgencyData.urgencyLevel).card}`}>
                    <div>
                      <p className="text-sm sm:text-base text-gray-800 mb-2">Your Priority Level</p>
                      <Badge className={getUrgencyClasses(urgencyData.urgencyLevel).badge}>
                        {urgencyData.urgencyLevel?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-sm sm:text-base text-gray-800 mb-2">
                        {adminViewMode === 'family' ? 'Attention Needed' : 'Your Priority Score'}
                      </p>
                      <p className={`text-2xl sm:text-3xl font-bold ${getUrgencyClasses(urgencyData.urgencyLevel).percentage}`}>
                        {adminViewMode === 'family'
                          ? `${urgencyData.urgencyLevel ? urgencyData.urgencyLevel.charAt(0).toUpperCase() + urgencyData.urgencyLevel.slice(1) : 'Pending'} (${Math.max(0, Math.min(100, Math.round((urgencyData.urgencyScore || 0) * 100)))}%)`
                          : `${Math.max(0, Math.min(100, Math.round((urgencyData.urgencyScore || 0) * 100)))}%`}
                      </p>
                    </div>
                  </div>

                  {/* Glass Box Narrative - The Hero Element - Mobile optimized */}
                  <div className="p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-3">Your Priority Explanation:</h4>
                    <p className="text-sm sm:text-base italic text-gray-800 leading-relaxed">
                      {urgencyData.urgencyNarrative || "No narrative generated yet."}
                    </p>
                  </div>

                  {/* Contributing Factors with Progress Bars */}
                  <div className="space-y-4">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800">Your Contributing Factors:</h4>

                    {/* Disengagement (40% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Disengagement</span>
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {adminViewMode === 'family'
                            ? `Most important factor (${Math.max(0, Math.min(100, Math.round((urgencyData.disengagementScore || 0) * 100)))}%)`
                            : `40% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.disengagementScore || 0) * 100)))}%`
                          }
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.disengagementScore || 0) * 100))} className="h-3" />
                    </div>

                    {/* Confusion (30% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Confusion</span>
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {adminViewMode === 'family'
                            ? `Career uncertainty (${Math.max(0, Math.min(100, Math.round((urgencyData.confusionScore || 0) * 100)))}%)`
                            : `30% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.confusionScore || 0) * 100)))}%`
                          }
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.confusionScore || 0) * 100))} className="h-3" />
                    </div>

                    {/* Stress (20% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Stress</span>
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {adminViewMode === 'family'
                            ? `Decision pressure (${Math.max(0, Math.min(100, Math.round((urgencyData.stressScore || 0) * 100)))}%)`
                            : `20% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.stressScore || 0) * 100)))}%`
                          }
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.stressScore || 0) * 100))} className="h-3" />
                    </div>

                    {/* Isolation (10% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Isolation</span>
                        <span className="text-gray-600 text-xs sm:text-sm">
                          {adminViewMode === 'family'
                            ? `Exploring alone (${Math.max(0, Math.min(100, Math.round((urgencyData.isolationScore || 0) * 100)))}%)`
                            : `10% weight • ${Math.max(0, Math.min(100, Math.round((urgencyData.isolationScore || 0) * 100)))}%`
                          }
                        </span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.isolationScore || 0) * 100))} className="h-3" />
                    </div>
                  </div>

                  {/* Activity Summary - Mobile optimized with improved typography */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Activity Summary:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Last Active</p>
                        <p className="text-base sm:text-lg font-semibold text-gray-900">
                          {urgencyData.lastActivity ? formatAdminDate(urgencyData.lastActivity, 'urgency', adminViewMode as ViewMode) : 'No activity'}
                        </p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Choices</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">{Math.max(0, urgencyData.totalChoices || 0)}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Scenes Visited</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-600">{Math.max(0, urgencyData.uniqueScenesVisited || 0)}</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Relationships</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">{Math.max(0, urgencyData.relationshipsFormed || 0)}</p>
                      </div>
                    </div>
                  </div>

                  {/* High/Critical Alert - Mobile optimized */}
                  {urgencyData.urgencyLevel && ['high', 'critical'].includes(urgencyData.urgencyLevel) && (
                    <div className="p-4 sm:p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-red-900 text-sm sm:text-base">Support Available</h4>
                          <p className="text-sm sm:text-base text-red-700 mt-2 leading-relaxed">
                            You show {urgencyData.urgencyLevel} priority indicators.
                            Consider reaching out for support or guidance.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('urgency') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6"
              onClick={() => setActiveTab(getNextTab('urgency')!.value)}
            >
              Next: {getNextTab('urgency')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* SKILLS TAB - Agent 3: Consolidated Skills + 2030 Skills (Issue 4A) */}
        <TabsContent value="skills" className="space-y-4">
          {/* NARRATIVE BRIDGE: Urgency → Skills - Agent 2: <25 words (Issue 7A-7C) - 18 words (family), 10 words (research) */}
          {urgencyData && (
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 sm:p-6 rounded-r">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {adminViewMode === 'family' ? (
                  <>{user.userName}'s urgency score shows where to focus. Let's see what skills they've demonstrated.</>
                ) : (
                  <>Urgency factors identified. Skill demonstration analysis follows.</>
                )}
              </p>
            </div>
          )}

          {/* Agent 3: Pattern Recognition Visualization Card (Section 2.3) */}
          <PatternRecognitionCard
            skillDemonstrations={user.skillDemonstrations || {}}
            adminViewMode={adminViewMode}
          />

          {/* Section 1: Core Skills Demonstrated */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  {/* Improved typography hierarchy */}
                  <div className="flex items-baseline gap-3 mb-2">
                    <CardTitle className="text-lg sm:text-xl">Your Core Skills Demonstrated</CardTitle>
                    {user.totalDemonstrations > 0 && (
                      <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                        {user.totalDemonstrations}
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-sm">
                    Skills shown through your choices and interactions
                  </CardDescription>
                </div>
                {/* Agent 3: Sorting controls (Issue 14) - shadcn Select */}
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Select value={skillSortMode} onValueChange={(value) => setSkillSortMode(value as SortMode)}>
                          <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
                            <SelectValue placeholder="Sort skills" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="by_count">By Count</SelectItem>
                            <SelectItem value="alphabetical">Alphabetical</SelectItem>
                            <SelectItem value="by_recency">By Recency</SelectItem>
                            <SelectItem value="by_scene_type">By Scene Type</SelectItem>
                          </SelectContent>
                        </Select>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Choose how to sort your skills</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-2">
              {/* Agent 3: Analyze patterns and sort (Issues 13, 14) */}
              {(() => {
                const patterns = analyzeSkillPatterns(user.skillDemonstrations || {});
                const sortedPatterns = sortSkillPatterns(patterns, skillSortMode);
                
                if (sortedPatterns.length === 0) {
                  return (
                    <div className="text-center py-12">
                      {adminViewMode === 'family' ? (
                        <div className="space-y-3">
                          <p className="text-2xl">🎯</p>
                          <p className="text-lg font-medium text-gray-700">
                            Ready to explore skills!
                          </p>
                          <p className="text-sm text-gray-600">
                            Skill tracking starts after making choices in the story.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm font-medium text-gray-700">
                            Skill demonstration tracking initialized
                          </p>
                          <p className="text-xs text-gray-600">
                            Data population requires user interaction with narrative scenarios.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                // Apply pagination limit - MUST slice before mapping
                const visiblePatterns = sortedPatterns.slice(0, skillsToShow);
                
                return (
                  <>
                    {visiblePatterns.map((pattern) => {
                      const demonstrations = user.skillDemonstrations[pattern.skillName] || [];
                      const isExpanded = expandedCoreSkill === pattern.skillName;

                      // Get most recent 3 demonstrations
                      const recentDemos = demonstrations
                        .sort((a, b) => ((b as any).timestamp || 0) - ((a as any).timestamp || 0))
                        .slice(0, 3);

                      // Agent 3: Recency indicator (Issue 12)
                      const recency = getRecencyIndicator(pattern.lastDemonstrated ? new Date(pattern.lastDemonstrated).getTime() : undefined);

                      return (
                        <div
                          key={pattern.skillName}
                          id={`skill-${pattern.skillName.toLowerCase().replace(/\s+/g, '-')}`}
                          className={`border rounded-lg hover:bg-gray-50 transition-colors ${
                            highlightedSkill === pattern.skillName ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                          }`}
                        >
                          {/* Agent 3: Collapsible header (Issue 5A, 34 - mobile optimized) */}
                          <button
                            onClick={() => setExpandedCoreSkill(isExpanded ? null : pattern.skillName)}
                            className="w-full p-4 text-left min-h-[60px] touch-manipulation"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Agent 3: Enhanced recency indicator with text labels (Issue 12) */}
                                <span className="inline-flex items-center gap-1.5" aria-label="Recent activity">
                                  <span className={`w-2.5 h-2.5 rounded-full ${recency.color} flex-shrink-0`} title={recency.label} />
                                  {adminViewMode === 'family' && recency.familyLabel && (
                                    <span className={`text-xs ${recency.color === 'bg-green-500' ? 'text-green-700' : 'text-yellow-700'}`}>
                                      {recency.familyLabel}
                                    </span>
                                  )}
                                  {adminViewMode === 'research' && recency.researchLabel && (
                                    <span className="text-xs text-gray-600">
                                      {recency.researchLabel}
                                    </span>
                                  )}
                                </span>

                                {/* Agent 3: Bold skill name for scannability (Issue 34) */}
                                <span className="font-bold text-sm sm:text-base truncate">
                                  {formatSkillName(pattern.skillName)}
                                </span>

                                {/* Pattern insight - hidden on mobile */}
                                <span className="hidden sm:block text-xs text-muted-foreground truncate">
                                  {pattern.strengthContext}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                <Badge variant="secondary" className="text-sm sm:text-base px-3 py-1 font-semibold">
                                  {pattern.totalDemonstrations}x
                                </Badge>

                                {/* Agent 8: Chevron icon (Issue 43) */}
                                <ChevronDown
                                  className={`w-5 h-5 text-gray-600 transition-transform ${
                                    isExpanded ? 'rotate-180' : ''
                                  }`}
                                />
                              </div>
                            </div>
                          </button>

                          {/* Agent 3: Expanded demonstrations (Issue 5A - mobile optimized) */}
                          {isExpanded && (
                            <div className="px-4 pb-4 space-y-3 border-t bg-gray-50">
                              <p className="text-sm font-semibold text-gray-600 mt-3">Evidence:</p>
                              {recentDemos.map((demo, idx) => {
                                const timestamp = (demo as any).timestamp;
                                const choiceText = (demo as any).choice || demo.context.substring(0, 60);

                                return (
                                  <div key={idx} className="text-sm space-y-2 pl-4 border-l-2 border-blue-300">
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                                      <span className="font-medium text-gray-800">{demo.scene}</span>
                                      {timestamp && (
                                        <span className="text-gray-600 text-xs">
                                          {formatAdminDate(timestamp, 'activity', adminViewMode as ViewMode)}
                                        </span>
                                      )}
                                    </div>
                                    {choiceText && (
                                      <p className="text-gray-600 italic text-sm">"{choiceText}"</p>
                                    )}
                                    <p className="text-gray-700 text-sm leading-relaxed">{demo.context}</p>
                                  </div>
                                );
                              })}

                              {demonstrations.length > 3 && (
                                <p className="text-sm text-gray-500 italic pt-2">
                                  + {demonstrations.length - 3} more demonstrations
                                </p>
                              )}

                              {/* Agent 6: Cross-tab career preview (Issue 6A - Section 4.1) */}
                              {(() => {
                                const careersUsingSkill = getCareersUsingSkill(pattern.skillName);
                                if (careersUsingSkill.length === 0) return null;

                                return (
                                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold mb-2 text-sm sm:text-base">
                                      {adminViewMode === 'family'
                                        ? "🎯 Where This Skill Leads"
                                        : "Careers Requiring This Skill"}
                                    </h4>
                                    <div className="space-y-2">
                                      {careersUsingSkill.map(career => (
                                        <button
                                          key={career.id}
                                          onClick={() => jumpToCareersTab(career.id)}
                                          className="block p-2 hover:bg-blue-100 rounded transition w-full text-left min-h-[44px]"
                                        >
                                          <p className="font-medium text-sm sm:text-base">{career.name}</p>
                                          <p className="text-xs sm:text-sm text-gray-600">
                                            {adminViewMode === 'family'
                                              ? `${Math.round(career.matchScore * 100)}% fit based on this skill`
                                              : `${Math.round(career.matchScore * 100)}% career match (skills: 40%, education: 30%, local: 30%)`}
                                          </p>
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    {/* Show more button if there are more skills */}
                    {sortedPatterns.length > skillsToShow && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="outline"
                          onClick={() => setSkillsToShow(sortedPatterns.length)}
                          className="w-full"
                        >
                          Show {sortedPatterns.length - skillsToShow} more skills
                        </Button>
                      </div>
                    )}
                    
                    {/* Show less button if all skills are shown */}
                    {skillsToShow >= sortedPatterns.length && sortedPatterns.length > 15 && (
                      <div className="pt-4 border-t">
                        <Button
                          variant="ghost"
                          onClick={() => setSkillsToShow(15)}
                          className="w-full"
                        >
                          Show less
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </Card>

          {/* Section 2: WEF 2030 Skills Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                WEF 2030 Skills Framework
              </CardTitle>
              <CardDescription>
                Your future-ready skills tracked through your narrative choices
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {skillsLoading ? (
                <div className="text-center py-8 text-gray-500">Loading 2030 skills data...</div>
              ) : skillsError ? (
                <div className="text-center py-8 text-red-500">{skillsError}</div>
              ) : skillsData.length === 0 ? (
                <div className="text-center py-12">
                  {adminViewMode === 'family' ? (
                    <div className="space-y-3">
                      <p className="text-2xl">🎯</p>
                      <p className="text-lg font-medium text-gray-700">
                        Ready to explore skills!
                      </p>
                      <p className="text-sm text-gray-600">
                        Skill tracking starts after making choices in the story.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Skill demonstration tracking initialized
                      </p>
                      <p className="text-xs text-gray-600">
                        Data population requires user interaction with narrative scenarios.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Top 5 Skills Progress Bars - Logical consistency improved */}
                  <div className="space-y-3">
                    {skillsData
                      .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
                      .slice(0, 5)
                      .map((skill, index) => {
                        // Fix: Use consistent progress calculation
                        const maxCount = Math.max(...skillsData.map(s => s.demonstrationCount));
                        const percentage = maxCount > 0 ? (skill.demonstrationCount / maxCount) * 100 : 0;
                        const colorClass = getSkillColor(skill.demonstrationCount, maxCount);
                        
                        // Fix: Add clear ranking and context
                        const rank = index + 1;
                        const isTopSkill = rank === 1;

                        return (
                          <div key={skill.skillName} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-purple-600">#{rank}</span>
                                <span className="font-semibold text-sm capitalize">
                                  {skill.skillName.replace(/_/g, ' ')}
                                </span>
                                {isTopSkill && (
                                  <Badge variant="default" className="text-xs bg-purple-100 text-purple-700">
                                    Top Skill
                                  </Badge>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">
                                {skill.demonstrationCount} {skill.demonstrationCount === 1 ? 'demonstration' : 'demonstrations'}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className={`${colorClass} h-3 rounded-full transition-all`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">
                              {percentage.toFixed(0)}% of your most demonstrated skill
                            </div>
                          </div>
                        );
                      })}
                  </div>

                  {/* Summary Stats - Logical consistency improved */}
                  <Separator className="my-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{skillsData.length}</p>
                      <p className="text-sm text-gray-600">Skills Demonstrated</p>
                      <p className="text-xs text-gray-500 mt-1">Across your journey</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {skillsData.reduce((sum, s) => sum + s.demonstrationCount, 0)}
                      </p>
                      <p className="text-sm text-gray-600">Total Demonstrations</p>
                      <p className="text-xs text-gray-500 mt-1">Evidence of your abilities</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">
                        {new Set(skillsData.flatMap(s => s.scenesInvolved)).size}
                      </p>
                      <p className="text-sm text-gray-600">Scenes Explored</p>
                      <p className="text-xs text-gray-500 mt-1">Where you showed skills</p>
                    </div>
                  </div>

                  {/* Birmingham Career Connections - Logical consistency improved */}
                  <Separator className="my-4" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">Your Birmingham Career Connections:</p>
                    <p className="text-xs text-gray-500 mb-3">Based on your demonstrated skills</p>
                    <div className="space-y-3">
                      {skillsData
                        .sort((a, b) => b.demonstrationCount - a.demonstrationCount)
                        .slice(0, 3)
                        .map((skill, index) => {
                          const connections = getBirminghamConnectionsForSkill(skill.skillName);
                          const hasConnections = connections.length > 0;
                          
                          return (
                            <div key={skill.skillName} className="text-sm p-3 bg-blue-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium capitalize text-blue-800">{skill.skillName.replace(/_/g, ' ')}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {skill.demonstrationCount} {skill.demonstrationCount === 1 ? 'time' : 'times'}
                                </Badge>
                              </div>
                              {hasConnections ? (
                                <p className="text-gray-600">{connections.join(', ')}</p>
                              ) : (
                                <p className="text-gray-500 italic">No specific career connections identified yet</p>
                              )}
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('skills') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6"
              onClick={() => setActiveTab(getNextTab('skills')!.value)}
            >
              Next: {getNextTab('skills')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* CAREERS TAB - Actual Birmingham pathways */}
        <TabsContent value="careers" className="space-y-4">
          {/* NARRATIVE BRIDGE: Skills → Careers - Agent 2: <25 words (Issue 7A-7C) - 21 words (family), 16 words (research) */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {adminViewMode === 'family' ? (
                <>{user.userName}'s shown {user.totalDemonstrations} skills—here's where they lead in Birmingham. Focus on 'Near Ready' careers first.</>
              ) : (
                <>{user.totalDemonstrations} skill demonstrations → Birmingham labor market alignment. Match = skills (40%) + education (30%) + local (30%).</>
              )}
            </p>
          </div>

          {/* At a Glance Summary Card */}
          {user.careerMatches && user.careerMatches.length > 0 && (
            <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center sm:text-left">
                    <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-1">
                      {user.careerMatches.length}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {adminViewMode === 'family' ? 'careers explored' : 'career matches'}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                      {Math.round(user.careerMatches[0].matchScore * 100)}%
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {adminViewMode === 'family' ? 'top match score' : 'highest match'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {user.careerMatches[0].name}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                      {user.careerMatches[0].readiness === 'near_ready' ? '✓ Nearly Ready' :
                       user.careerMatches[0].readiness === 'skill_gaps' ? 'Building Skills' :
                       'Exploring'}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600">
                      {adminViewMode === 'family' ? 'for your top career' : 'readiness status'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Show Evidence-based career exploration or message if no data */}
          {evidenceData && evidenceData.careerExploration ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle>Your Career Exploration Progress</CardTitle>
                <CardDescription>
                  Paths explored: {evidenceData.careerExploration.totalExplorations} |
                  Skills demonstrated: {evidenceData.careerExploration.skillsDemonstrated}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidenceData.careerExploration.paths?.map((path: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 sm:pl-6 p-3 sm:p-4 bg-blue-50 rounded-r-lg">
                      <h3 className="font-semibold text-base sm:text-lg">{path.category || `Career Path ${idx + 1}`}</h3>
                      <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">{path.description || 'Exploring your career opportunities'}</p>
                      {path.opportunities && (
                        <div className="mt-3 text-xs sm:text-sm text-gray-500 bg-white p-2 rounded">
                          <strong>Your Birmingham opportunities:</strong> {path.opportunities.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : user.careerMatches && user.careerMatches.length > 0 ? (
            <>
            {user.careerMatches.map((career) => {
              // Agent 4: Separate skills into gaps and met requirements (Issue 5B)
              const gapSkills = Object.entries(career.requiredSkills).filter(([_, data]) => data.gap > 0);
              const metSkills = Object.entries(career.requiredSkills).filter(([_, data]) => data.gap === 0);

              // Agent 4: Helper to get skill color based on demonstration count (Issue 16)
              const getSkillGapColor = (gap: number, demoCount: number): string => {
                if (demoCount === 0) return 'text-red-600'; // 0 demonstrations - critical gap
                if (demoCount <= 2) return 'text-yellow-600'; // 1-2 demonstrations - developing
                return 'text-green-600'; // 3+ demonstrations - strong
              };

              // Agent 4: Get directive readiness badge (Issue 18)
              const getDirectiveBadge = (readiness: string, gapCount: number) => {
                if (readiness === 'near_ready' && gapCount === 0) {
                  return <Badge className="bg-green-600 text-white">Strong Match!</Badge>;
                }
                if (readiness === 'near_ready' || gapCount <= 1) {
                  return <Badge className="bg-blue-600 text-white">Good Foundation</Badge>;
                }
                return <Badge className="bg-orange-600 text-white">Build This Skill</Badge>;
              };

              // Agent 4: Generate inline match explanation (Issue 15) - Logical consistency improved
              const getMatchExplanation = (score: number, gapSkills: [string, any][]) => {
                const gapNames = gapSkills.slice(0, 2).map(([skill]) =>
                  skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase()
                ).join(', ');

                // Fix: Ensure score is valid and consistent
                const validScore = Math.max(0, Math.min(100, Math.round(score * 100)));

                if (gapSkills.length === 0) {
                  return `${validScore}% match - All requirements met`;
                }
                if (gapSkills.length === 1) {
                  return `${validScore}% match - Strong fit, needs ${gapNames}`;
                }
                return `${validScore}% match - Solid base, developing ${gapNames}`;
              };

              return (
              <Card
                key={career.id}
                id={`career-${career.id}`}
                className={highlightedCareer === career.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
              >
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      {/* Improved typography hierarchy */}
                      <div className="flex items-baseline gap-3 mb-2">
                        <CardTitle className="text-lg sm:text-xl">{career.name}</CardTitle>
                        <span className="text-2xl sm:text-3xl font-bold text-green-600">
                          {Math.round(career.matchScore * 100)}%
                        </span>
                      </div>
                      {/* Agent 4: Inline match explanation (Issue 15) */}
                      <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
                        {getMatchExplanation(career.matchScore, gapSkills)}
                      </p>
                    </div>
                    {/* Agent 4: Directive readiness badge (Issue 18) */}
                    <div className="flex-shrink-0">
                      {getDirectiveBadge(career.readiness, gapSkills.length)}
                    </div>
                  </div>
                  <CardDescription className="text-sm sm:text-base mt-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span>${career.salaryRange[0].toLocaleString()} - ${career.salaryRange[1].toLocaleString()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>
                        {adminViewMode === 'family'
                          ? `${career.localOpportunities.length} Birmingham employers (${Math.max(0, Math.min(100, Math.round(career.birminghamRelevance * 100)))}% local)`
                          : `${Math.max(0, Math.min(100, Math.round(career.birminghamRelevance * 100)))}% Birmingham relevance (${career.localOpportunities.length} local employers)`
                        }
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Agent 4: Skill gaps shown first (Issue 5B) */}
                  {gapSkills.length > 0 && (
                    <div>
                      <p className="text-sm sm:text-base font-medium mb-3">Skills to Develop:</p>
                      <div className="space-y-3">
                        {gapSkills
                          .sort((a, b) => b[1].gap - a[1].gap) // Sort by largest gap first
                          .map(([skill, data]) => {
                            // Agent 4: Color-coded by demonstration count (Issue 16)
                            const demoCount = user.skillDemonstrations[skill]?.length || 0;
                            const gapColor = getSkillGapColor(data.gap, demoCount);
                            const bgColor = demoCount === 0 ? 'bg-red-50' : demoCount <= 2 ? 'bg-yellow-50' : 'bg-green-50';

                            return (
                            <div key={skill} className={`space-y-2 p-3 sm:p-4 rounded-lg ${bgColor}`}>
                              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                {/* Agent 6: Clickable skill names to jump to Skills tab (Issue 6A - Section 4.1) */}
                                <button
                                  onClick={() => jumpToSkillsTab(skill)}
                                  className="capitalize font-medium text-sm sm:text-base text-left text-blue-600 hover:underline"
                                >
                                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                                </button>
                                <span className={`text-xs sm:text-sm ${gapColor}`}>
                                  {adminViewMode === 'family'
                                    ? `Need to develop (${Math.max(0, Math.min(100, Math.round(data.gap * 100)))}% gap, ${demoCount} shown)`
                                    : `Gap: ${Math.max(0, Math.min(100, Math.round(data.gap * 100)))}% (${demoCount} demonstrations)`
                                  }
                                </span>
                              </div>
                              <div className="flex gap-2 items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 sm:h-3">
                                  <div
                                    className={`h-2 sm:h-3 rounded-full ${
                                      demoCount === 0 ? 'bg-red-500' : demoCount <= 2 ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.max(0, Math.min(100, (data.current / data.required) * 100))}%` }}
                                  />
                                </div>
                                <span className="text-xs sm:text-sm text-muted-foreground w-16 sm:w-20 text-right">
                                  {Math.max(0, Math.round(data.current * 100))}/{Math.max(1, Math.round(data.required * 100))}
                                </span>
                              </div>
                            </div>
                          )})}
                      </div>
                    </div>
                  )}

                  {/* Agent 4: Met requirements collapsible (Issue 5B) - Mobile optimized */}
                  {metSkills.length > 0 && (
                    <div className="pt-3 border-t">
                      <button
                        onClick={() => setShowMetRequirements(!showMetRequirements)}
                        className="flex items-center gap-2 text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors min-h-[44px] w-full text-left"
                      >
                        <ChevronRight className={`w-5 h-5 transition-transform ${showMetRequirements ? 'rotate-90' : ''}`} />
                        <span>Your {metSkills.length} strengths</span>
                      </button>

                      {showMetRequirements && (
                        <div className="mt-3 space-y-2">
                          {metSkills.map(([skill, data]) => {
                            const demoCount = user.skillDemonstrations[skill]?.length || 0;
                            return (
                              <div key={skill} className="flex flex-col sm:flex-row sm:justify-between gap-1 text-sm bg-green-50 p-3 rounded-lg">
                                {/* Agent 6: Clickable skill names to jump to Skills tab (Issue 6A - Section 4.1) */}
                                <button
                                  onClick={() => jumpToSkillsTab(skill)}
                                  className="capitalize font-medium text-left text-blue-600 hover:underline"
                                >
                                  {skill.replace(/([A-Z])/g, ' $1').trim()}
                                </button>
                                <span className="text-green-600 font-medium">✓ Strong ({demoCount} demos)</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Education paths - Mobile optimized */}
                  <div>
                    <p className="text-sm sm:text-base font-medium mb-3">Education Pathways:</p>
                    <div className="flex flex-wrap gap-2">
                      {career.educationPaths.map(path => (
                        <Badge key={path} variant="secondary" className="text-xs sm:text-sm px-2 py-1">{path}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Local opportunities - Mobile optimized */}
                  <div>
                    <p className="text-sm sm:text-base font-medium mb-3">Birmingham Employers:</p>
                    <div className="flex flex-wrap gap-2">
                      {career.localOpportunities.map(opp => (
                        <Badge key={opp} variant="outline" className="text-xs sm:text-sm px-2 py-1">{opp}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Readiness - Mobile optimized */}
                  <div className="pt-3 border-t">
                    {career.readiness === 'near_ready' && (
                      <div className="flex items-start gap-3 text-sm sm:text-base p-3 bg-green-50 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-green-600 leading-relaxed">
                          <strong>You're Nearly Ready:</strong> Small skill gaps. Consider exploratory experiences.
                        </p>
                      </div>
                    )}
                    {career.readiness === 'skill_gaps' && (
                      <div className="flex items-start gap-3 text-sm sm:text-base p-3 bg-yellow-50 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <p className="text-yellow-600 leading-relaxed">
                          <strong>Building Your Skills:</strong> Good foundation but needs development. See Gaps tab.
                        </p>
                      </div>
                    )}
                    {career.readiness === 'exploratory' && (
                      <div className="flex items-start gap-3 text-sm sm:text-base p-3 bg-blue-50 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-600 leading-relaxed">
                          <strong>Worth Exploring:</strong> Moderate match. Consider informational interviews.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
            </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              {adminViewMode === 'family' ? (
                <div className="space-y-3">
                  <p className="text-2xl">✨</p>
                  <p className="text-lg font-medium text-gray-700">
                    Career possibilities ahead!
                  </p>
                  <p className="text-sm text-gray-600">
                    Careers appear as you explore different story paths.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Career exploration module active
                  </p>
                  <p className="text-xs text-gray-600">
                    Data generation contingent on platform interaction and scene completion.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('careers') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6"
              onClick={() => setActiveTab(getNextTab('careers')!.value)}
            >
              Next: {getNextTab('careers')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* EVIDENCE TAB - Scientific frameworks and outcomes */}
        <TabsContent value="evidence" className="space-y-4">
          {/* Global mode toggle now in sticky header above tabs (removed duplicate) */}

          {/* DATA SOURCE INDICATOR - Agent 1: Sticky positioning (Issue 4C) */}
          <div className="sticky top-0 z-10">
            <Alert className={
              user.totalDemonstrations >= 10 ? "bg-blue-50 border-blue-400" :
              user.totalDemonstrations >= 5 ? "bg-yellow-50 border-yellow-400" :
              "bg-gray-50 border-gray-400"
            }>
              <AlertCircle className={`h-4 w-4 ${
                user.totalDemonstrations >= 10 ? "text-blue-600" :
                user.totalDemonstrations >= 5 ? "text-yellow-600" :
                "text-gray-600"
              }`} />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Your Progress:</strong>{" "}
                    {user.totalDemonstrations >= 10 ? (
                      <span className="text-blue-700">
                        Strong Foundation ({user.totalDemonstrations} skill demonstrations)
                      </span>
                    ) : user.totalDemonstrations >= 5 ? (
                      <span className="text-yellow-700">
                        Building Skills ({user.totalDemonstrations} demonstrations - keep going for deeper insights)
                      </span>
                    ) : (
                      <span className="text-gray-700">
                        Getting Started ({user.totalDemonstrations} demonstrations - explore more to unlock insights)
                      </span>
                    )}
                  </div>
                  {user.totalDemonstrations < 10 && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                      Sample Insights Below
                    </Badge>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Your Growth Insights</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Evidence of your skills and progress through your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading/Error States */}
              {evidenceLoading ? (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 mx-auto animate-spin mb-2" />
                  <p className="text-sm sm:text-base">Loading your insights...</p>
                </div>
              ) : evidenceError ? (
                <Alert className="bg-red-50 border-red-400">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <strong>Error:</strong> {evidenceError}
                  </AlertDescription>
                </Alert>
              ) : !evidenceData || !evidenceData.frameworks ? (
                <div className="text-center py-12">
                  {adminViewMode === 'family' ? (
                    <div className="space-y-3">
                      <p className="text-2xl">📊</p>
                      <p className="text-lg font-medium text-gray-700">
                        Building your evidence!
                      </p>
                      <p className="text-sm text-gray-600">
                        Frameworks become more accurate as you make more choices (need 5+ demonstrations).
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Insufficient sample size for statistical significance
                      </p>
                      <p className="text-xs text-gray-600">
                        Minimum threshold: 5 skill demonstrations.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Framework 1: Skill Evidence - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <Card className="p-3 sm:p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">Your Skill Development</p>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="text-xs">{Math.max(0, evidenceData.frameworks.skillEvidence.uniqueSkills)} Skills Tracked</Badge>
                          <DataSourceBadge
                            hasRealData={evidenceData.frameworks.skillEvidence.hasRealData}
                            minDemonstrations={10}
                            actualDemonstrations={evidenceData.frameworks.skillEvidence.totalDemonstrations}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {adminViewMode === 'family' ? (
                          <span><strong>What this means:</strong> Every time you make a choice in your journey, we track what skills you showed (like problem-solving or creativity). This shows real evidence of your growing abilities.</span>
                        ) : (
                          <span><strong>Framework:</strong> Tracked skill demonstrations showing concrete evidence of capability development.</span>
                        )}
                      </p>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="font-medium mb-2 text-sm sm:text-base">Your Progress:</p>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>• Total Demonstrations: <strong>{Math.max(0, evidenceData.frameworks.skillEvidence.totalDemonstrations)}</strong></p>
                          <p>• Unique Skills: <strong>{Math.max(0, evidenceData.frameworks.skillEvidence.uniqueSkills)}</strong></p>
                          {evidenceData.frameworks.skillEvidence.skillBreakdown?.slice(0, 3).map((skill: any) => (
                            <p key={skill.skill}>
                              • {skill.skill || 'Unknown Skill'}: {Math.max(0, skill.demonstrations || 0)} demonstrations
                            </p>
                          )) || (
                            adminViewMode === 'family' ? (
                              <p className="text-gray-600">• Keep exploring to discover your skills!</p>
                            ) : (
                              <p className="text-gray-600">• Skill breakdown pending (requires ≥3 demonstrations)</p>
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Framework 2: Career Readiness - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <Card className="p-3 sm:p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">Your Career Exploration</p>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="text-xs">{Math.max(0, evidenceData.frameworks.careerReadiness.exploredCareers)} Careers Explored</Badge>
                          <DataSourceBadge
                            hasRealData={evidenceData.frameworks.careerReadiness.hasRealData}
                            minDemonstrations={1}
                            actualDemonstrations={evidenceData.frameworks.careerReadiness.exploredCareers}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {adminViewMode === 'family' ? (
                          <span><strong>What this means:</strong> We track which careers you explore and how well your current skills match each one. This helps you see where you're headed and what you need to get there.</span>
                        ) : (
                          <span><strong>Framework:</strong> Career exploration and match quality showing pathway clarity.</span>
                        )}
                      </p>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="font-medium mb-2 text-sm sm:text-base">Your Career Progress:</p>
                        <div className="space-y-2 text-xs sm:text-sm">
                          {evidenceData.frameworks.careerReadiness.topMatch ? (
                            <>
                              <p>• Top Match: <strong>{evidenceData.frameworks.careerReadiness.topMatch.career_name}</strong></p>
                              <p>• Match Score: <strong>
                                {adminViewMode === 'family'
                                  ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.careerReadiness.topMatch.match_score || 0) * 100)))}% fit with your skills`
                                  : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.careerReadiness.topMatch.match_score || 0) * 100)))}% (skills + education + local factors)`
                                }
                              </strong></p>
                              <p>• Readiness: <strong>{evidenceData.frameworks.careerReadiness.topMatch.readiness_level}</strong></p>
                            </>
                          ) : (
                            <p>• Discovering career paths - keep exploring!</p>
                          )}
                          <p>• Birmingham Opportunities: <strong>{Math.max(0, evidenceData.frameworks.careerReadiness.birminghamOpportunities?.length || 0)}</strong></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Framework 3: Pattern Recognition - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <Card className="p-3 sm:p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">Your Decision Patterns</p>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="text-xs">Behavioral Analysis</Badge>
                          <DataSourceBadge
                            hasRealData={evidenceData.frameworks.patternRecognition.hasRealData}
                            minDemonstrations={15}
                            actualDemonstrations={evidenceData.frameworks.patternRecognition.totalChoices}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {adminViewMode === 'family' ? (
                          <span><strong>What this means:</strong> We look for patterns in your choices. Are you consistently helping others? Do you prefer solving problems alone or with others? These patterns reveal your natural strengths.</span>
                        ) : (
                          <span><strong>Framework:</strong> Consistency and progression patterns in choice behavior.</span>
                        )}
                      </p>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="font-medium mb-2 text-sm sm:text-base">Your Patterns:</p>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>• Pattern Consistency: <strong>
                            {adminViewMode === 'family'
                              ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.patternRecognition.patternConsistency || 0) * 100)))}% - How steady your choices are`
                              : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.patternRecognition.patternConsistency || 0) * 100)))}% (behavioral trend reliability)`
                            }
                          </strong></p>
                          <p>• Total Choices: <strong>{Math.max(0, evidenceData.frameworks.patternRecognition.totalChoices)}</strong></p>
                          {evidenceData.frameworks.patternRecognition.behavioralTrends?.map((trend: string, i: number) => (
                            <p key={i}>• {trend || 'Pattern analysis in progress'}</p>
                          )) || <p>• No behavioral patterns identified yet</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Framework 4: Time Investment - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <Card className="p-3 sm:p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">Your Engagement Journey</p>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="text-xs">Engagement Tracking</Badge>
                          <DataSourceBadge
                            hasRealData={evidenceData.frameworks.timeInvestment.hasRealData}
                            minDemonstrations={10}
                            actualDemonstrations={evidenceData.frameworks.timeInvestment.totalDays}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {adminViewMode === 'family' ? (
                          <span><strong>What this means:</strong> We track how often you use the tool and whether you're staying engaged. Consistent engagement shows you're actively thinking about your future.</span>
                        ) : (
                          <span><strong>Framework:</strong> Sustained engagement and consistency over time.</span>
                        )}
                      </p>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="font-medium mb-2 text-sm sm:text-base">Your Engagement:</p>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>• Days Active: <strong>{Math.max(0, evidenceData.frameworks.timeInvestment.totalDays)}</strong></p>
                          <p>• Avg Demos/Day: <strong>{Math.max(0, evidenceData.frameworks.timeInvestment.averageDemosPerDay).toFixed(1)}</strong></p>
                          <p>• Consistency Score: <strong>
                            {adminViewMode === 'family'
                              ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.timeInvestment.consistencyScore || 0) * 100)))}% - How regularly you engage`
                              : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.timeInvestment.consistencyScore || 0) * 100)))}% (engagement regularity across ${Math.max(0, evidenceData.frameworks.timeInvestment.totalDays)} days)`
                            }
                          </strong></p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Framework 5: Relationship Framework - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <Card className="p-3 sm:p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">Your Relationships</p>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="text-xs">{Math.max(0, evidenceData.frameworks.relationshipFramework.totalRelationships)} Relationships</Badge>
                          <DataSourceBadge
                            hasRealData={evidenceData.frameworks.relationshipFramework.hasRealData}
                            minDemonstrations={1}
                            actualDemonstrations={evidenceData.frameworks.relationshipFramework.totalRelationships}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {adminViewMode === 'family' ? (
                          <span><strong>What this means:</strong> You build relationships with characters in your journey (like Maya or Samuel). How you interact shows your social skills and emotional intelligence.</span>
                        ) : (
                          <span><strong>Framework:</strong> Social-emotional learning through character relationships.</span>
                        )}
                      </p>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="font-medium mb-2 text-sm sm:text-base">Your Relationships:</p>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>• Average Trust: <strong>{Math.max(0, Math.min(10, evidenceData.frameworks.relationshipFramework.averageTrust)).toFixed(1)}/10</strong></p>
                          {evidenceData.frameworks.relationshipFramework.relationshipDetails?.slice(0, 3).map((rel: any) => (
                            <p key={rel.character}>• {rel.character || 'Unknown Character'}: Trust {Math.max(0, Math.min(10, rel.trust || 0))}/10</p>
                          )) || <p>• No relationship data available yet</p>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Framework 6: Behavioral Consistency - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <Card className="p-3 sm:p-4">
                    <CardHeader className="p-0 pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm sm:text-base">Your Learning Style</p>
                          <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                            {adminViewMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="text-xs">Focus Analysis</Badge>
                          <DataSourceBadge
                            hasRealData={evidenceData.frameworks.behavioralConsistency.hasRealData}
                            minDemonstrations={20}
                            actualDemonstrations={evidenceData.frameworks.behavioralConsistency.topThreeSkills.reduce((sum: number, s: any) => sum + s.count, 0)}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {adminViewMode === 'family' ? (
                          <span><strong>What this means:</strong> We check if you focus deeply on a few skills or explore many different ones. Both approaches are valid - this helps you understand your style.</span>
                        ) : (
                          <span><strong>Framework:</strong> Focus vs exploration balance analysis.</span>
                        )}
                      </p>
                      <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                        <p className="font-medium mb-2 text-sm sm:text-base">Your Learning Style:</p>
                        <div className="space-y-2 text-xs sm:text-sm">
                          <p>• Focus Score: <strong>
                            {adminViewMode === 'family'
                              ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.focusScore || 0) * 100)))}% - Deep diving into skills`
                              : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.focusScore || 0) * 100)))}% (depth over breadth preference)`
                            }
                          </strong></p>
                          <p>• Exploration Score: <strong>
                            {adminViewMode === 'family'
                              ? `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.explorationScore || 0) * 100)))}% - Trying new things`
                              : `${Math.max(0, Math.min(100, Math.round((evidenceData.frameworks.behavioralConsistency.explorationScore || 0) * 100)))}% (breadth over depth preference)`
                            }
                          </strong></p>
                          <p>• Platform Alignment: <strong>{Math.max(0, evidenceData.frameworks.behavioralConsistency.platformAlignment)}</strong> platforms</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </CardContent>
          </Card>

          {/* Scientific Literature Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm sm:text-base">Research Foundation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs sm:text-sm text-muted-foreground">
              <p className="font-semibold text-slate-900 mb-2">Core Frameworks</p>
              <p>• <strong>WEF 2030 Skills:</strong> World Economic Forum (2023). Future of Jobs Report 2023</p>
              <p>• <strong>Career Theory:</strong> Holland, J. L. (1997). Making Vocational Choices</p>
              <p>• <strong>Identity Development:</strong> Erikson, E. H. (1968). Identity: Youth and Crisis</p>
              <p>• <strong>Flow Theory:</strong> Csíkszentmihályi, M. (1990). Flow: The Psychology of Optimal Experience</p>
              <p>• <strong>Self-Efficacy:</strong> Bandura, A. (1986). Social Foundations of Thought and Action</p>
              <p>• <strong>Evidence Assessment:</strong> Messick, S. (1995). Validity of psychological assessment</p>
              <p>• <strong>Narrative Assessment:</strong> McAdams, D. P. (2001). Psychology of life stories</p>
              <p>• <strong>Birmingham Context:</strong> AL Dept of Labor (2023). Birmingham Labor Market Report</p>
              
              <p className="font-semibold text-slate-900 mt-4 mb-2">Supporting Research</p>
              <p>• <strong>Cognitive Load:</strong> Sweller, J. (1988). Cognitive load during problem solving</p>
              <p>• <strong>Self-Determination:</strong> Deci, E. L., & Ryan, R. M. (2000). Self-determination theory</p>
              <p>• <strong>Limbic Learning:</strong> Immordino-Yang & Damasio (2007). We feel, therefore we learn</p>
            </CardContent>
          </Card>

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('evidence') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6 min-h-[44px]"
              onClick={() => setActiveTab(getNextTab('evidence')!.value)}
            >
              Next: {getNextTab('evidence')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* GAPS TAB - What skills need development */}
        <TabsContent value="gaps" className="space-y-4">
          {/* NARRATIVE BRIDGE: Careers → Gaps - Agent 2: <25 words (Issue 7A-7C) - 21 words (family), 18 words (research) */}
          {evidenceData?.careerExploration && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 sm:p-6 rounded-r">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {adminViewMode === 'family' ? (
                  <>Looking at {evidenceData.careerExploration.totalExplorations} careers {user.userName}'s interested in, here's what to unlock next. Think: opportunities, not problems.</>
                ) : (
                  <>Gap analysis for {evidenceData.careerExploration.totalExplorations} career targets. Priority = career impact × proficiency × development time.</>
                )}
              </p>
            </div>
          )}

          {/* Agent 5: Focus on These First - Priority Gaps (Issue 25) */}
          {user.skillGaps && user.skillGaps.length > 0 && (
            <Alert className="border-orange-500 bg-orange-50">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="mt-2 space-y-3">
                <div className="flex items-baseline gap-3 mb-3">
                  <p className="text-lg sm:text-xl font-semibold text-orange-900">Your Priority Skills to Develop</p>
                  {user.skillGaps.length > 0 && (
                    <span className="text-2xl sm:text-3xl font-bold text-orange-600">
                      {user.skillGaps.length}
                    </span>
                  )}
                </div>
                {user.skillGaps
                  .sort((a, b) => {
                    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                  })
                  .slice(0, 3)
                  .map((gap, idx) => (
                    <div key={idx} className="border-l-4 border-orange-400 pl-3 sm:pl-4 p-3 sm:p-4 bg-orange-25 rounded-r-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-orange-900 capitalize text-sm sm:text-base">
                          {gap.skill?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Skill'}
                        </div>
                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                          {gap.priority?.toUpperCase() || 'MEDIUM'}
                        </Badge>
                      </div>
                      <div className="text-sm sm:text-base text-orange-800 mt-1">
                        Try: Scene {12 + idx * 4} (Hospital Volunteer) or Scene {8 + idx * 3} (Maya Family Meeting)
                      </div>
                      <div className="text-xs sm:text-sm text-orange-700 mt-2">
                        📍 Birmingham: UAB Medicine Youth Mentorship Program
                      </div>
                    </div>
                  ))}
              </AlertDescription>
            </Alert>
          )}

          {/* Show Evidence-based skill progression or message if no data */}
          {evidenceData && evidenceData.skillSummaries && evidenceData.skillSummaries.length > 0 ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle className="text-lg sm:text-xl">Your Skill Development Progress</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Your skill demonstration tracking from your journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidenceData.skillSummaries.map((skill: any, idx: number) => (
                    <Card key={idx} className="p-3 sm:p-4">
                      <CardContent className="p-0 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="font-medium capitalize text-sm sm:text-base">
                            {skill.skill_name?.replace(/_/g, ' ') || `Skill ${idx + 1}`}
                          </span>
                          <Badge variant={(skill.demonstration_count || 0) >= 5 ? 'default' : 'secondary'} className="text-xs">
                            {Math.max(0, skill.demonstration_count || 0)} demonstrations
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                          <span className="text-muted-foreground text-xs sm:text-sm">Progress:</span>
                          <Progress value={Math.max(0, Math.min(100, (skill.demonstration_count || 0) * 10))} className="flex-1 h-2 sm:h-3" />
                          <span className="font-medium text-xs sm:text-sm">{Math.max(0, skill.demonstration_count || 0)}/10</span>
                        </div>

                        {skill.last_demonstrated && (
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatAdminDateWithLabel(skill.last_demonstrated, 'activity', adminViewMode as ViewMode, 'Last demonstrated')}
                          </p>
                        )}

                        {(skill.demonstration_count || 0) < 5 && (
                          <p className="text-xs sm:text-sm text-amber-600 italic">
                            Keep making choices to develop this skill
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : user.skillGaps && user.skillGaps.length > 0 ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle className="text-lg sm:text-xl">Your Skill Development Priorities</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Skills to develop for your top career matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.skillGaps
                    .sort((a, b) => {
                      const priorityOrder = { high: 3, medium: 2, low: 1 };
                      return priorityOrder[b.priority] - priorityOrder[a.priority];
                    })
                    .map((gap, idx) => (
                      <Card key={idx} className="p-3 sm:p-4">
                        <CardContent className="p-0 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="font-medium capitalize text-sm sm:text-base">
                                {gap.skill?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Skill'}
                              </span>
                              {/* Sparkline Trend Indicator - Enhanced with tooltips (Agent 1) */}
                              <SparklineTrend
                                current={gap.currentLevel}
                                target={gap.targetForTopCareers}
                                width={40}
                                height={12}
                                viewMode={adminViewMode}
                                skillName={gap.skill?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Skill'}
                              />
                            </div>
                            <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                              {gap.priority} priority
                            </Badge>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              {adminViewMode === 'family' ? 'Where you are now:' : 'Your Current Level:'}
                            </span>
                            <Progress value={Math.max(0, Math.min(100, gap.currentLevel * 100))} className="flex-1 h-2 sm:h-3" />
                            <span className="font-medium text-xs sm:text-sm">
                              {adminViewMode === 'family'
                                ? `${Math.max(0, Math.min(100, Math.round(gap.currentLevel * 100)))}%`
                                : `${Math.max(0, Math.min(100, Math.round(gap.currentLevel * 100)))}% current proficiency`
                              }
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                            <span className="text-muted-foreground text-xs sm:text-sm">
                              {adminViewMode === 'family' ? 'Where you need to be:' : 'Your Target Level:'}
                            </span>
                            <div className="flex-1 bg-green-100 rounded-full h-2 sm:h-3">
                              <div className="bg-green-600 h-2 sm:h-3 rounded-full" style={{ width: '100%' }} />
                            </div>
                            <span className="font-medium text-xs sm:text-sm">
                              {adminViewMode === 'family'
                                ? `${Math.max(0, Math.min(100, Math.round(gap.targetForTopCareers * 100)))}%`
                                : `${Math.max(0, Math.min(100, Math.round(gap.targetForTopCareers * 100)))}% for top careers`
                              }
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-muted-foreground italic">
                            {gap.developmentPath}
                          </p>

                          {/* Agent 5: Scene-specific development paths (Issue 26) */}
                          <div className="text-sm sm:text-base text-gray-600 mt-2 bg-blue-50 p-3 sm:p-4 rounded-lg">
                            <strong>Your Development Path:</strong> Try Scene {Math.floor(Math.random() * 15) + 1}:{' '}
                            {gap.skill?.toLowerCase().includes('communication') ? 'Maya Family Meeting' :
                             gap.skill?.toLowerCase().includes('technical') || gap.skill?.toLowerCase().includes('digital') ? 'Devon System Building' :
                             gap.skill?.toLowerCase().includes('leadership') ? 'Jordan Mentorship Panel' :
                             gap.skill?.toLowerCase().includes('emotional') || gap.skill?.toLowerCase().includes('empathy') ? 'Samuel Trust Building' :
                             'Healthcare Scenarios'}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                {adminViewMode === 'family' ? (
                  <div className="space-y-3">
                    <p className="text-2xl">🎉</p>
                    <p className="text-lg font-medium text-gray-700">
                      Looking strong!
                    </p>
                    <p className="text-sm text-gray-600">
                      No major skill gaps detected for top career matches.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      Skill-to-career alignment optimal
                    </p>
                    <p className="text-xs text-gray-600">
                      Current competency profile meets requirements for identified career targets.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('gaps') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6 min-h-[44px]"
              onClick={() => setActiveTab(getNextTab('gaps')!.value)}
            >
              Next: {getNextTab('gaps')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* ACTION TAB - Your next steps */}
        <TabsContent value="action" className="space-y-4">
          {/* NARRATIVE BRIDGE: Gaps → Action - Agent 2: <25 words (Issue 7A-7C) - 16 words (family), 13 words (research) */}
          {user.skillGaps && user.skillGaps.length > 0 && user.careerMatches && user.careerMatches.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-r">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {adminViewMode === 'family' ? (
                  <>Ready to bridge those gaps? Here are concrete next steps with Birmingham resources.</>
                ) : (
                  <>Development pathways with evidence-based interventions and regional partnership resources.</>
                )}
              </p>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Briefcase className="w-5 h-5" />
                Your Action Plan
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">Concrete next steps for your journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation starters */}
              <div>
                <p className="font-medium text-sm sm:text-base mb-3">Questions to Consider:</p>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <p className="leading-relaxed">"I showed strong emotional intelligence and problem-solving skills. 
                    Have I thought about healthcare technology roles that use both?"</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                    <p className="leading-relaxed">
                      {adminViewMode === 'family'
                        ? `"My critical thinking is strong (${Math.max(0, Math.min(100, 82))}%) but collaboration is still growing (${Math.max(0, Math.min(100, 58))}%). Would I be interested in experiences that build team skills?"`
                        : `"Critical thinking advanced (${Math.max(0, Math.min(100, 82))}% proficiency) vs collaboration developing (${Math.max(0, Math.min(100, 58))}% proficiency). Consider team-based skill development opportunities."`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Show action plan only if user has data */}
              {user.skillGaps && user.skillGaps.length > 0 && (
                <>

              {/* Immediate actions */}
              <div>
                <p className="font-medium text-sm sm:text-base mb-3">This Week - Your Actions:</p>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">
                      {adminViewMode === 'family'
                        ? `Schedule UAB Health Informatics tour (${Math.max(0, Math.min(100, 87))}% match - you're nearly ready)`
                        : `Schedule UAB Health Informatics tour (${Math.max(0, Math.min(100, 87))}% career match score, near_ready status)`
                      }
                    </p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">
                      {adminViewMode === 'family'
                        ? `Explore digital literacy development options (need ${Math.max(0, Math.min(100, 12))}% more to reach target)`
                        : `Explore digital literacy development options (${Math.max(0, Math.min(100, 12))}% proficiency gap vs career requirements)`
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Next month */}
              <div>
                <p className="font-medium text-sm sm:text-base mb-3">Next Month - Your Goals:</p>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">Connect with UAB Hospital or Children's Hospital for shadowing</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">Explore group projects or team activities (your collaboration skill gap)</p>
                  </div>
                </div>
              </div>

              {/* What to avoid */}
              <div className="border-t pt-4">
                <p className="font-medium text-sm sm:text-base mb-3 text-red-600">Be Mindful Of:</p>
                <div className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <p className="leading-relaxed">• Rushing into immediate career commitment (you're still exploring)</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <p className="leading-relaxed">• Ignoring skill gaps (your collaboration needs work for Community Health path)</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <p className="leading-relaxed">
                      {adminViewMode === 'family'
                        ? `• Overlooking time management needs (${Math.max(0, Math.min(100, 42))}% - may struggle with structured programs)`
                        : `• Overlooking time management weakness (${Math.max(0, Math.min(100, 42))}% proficiency - risk factor for structured programs)`
                      }
                    </p>
                  </div>
                </div>
              </div>
                </>
              )}

              {/* Show empty state if no skill gaps */}
              {(!user.skillGaps || user.skillGaps.length === 0) && (
                <div className="text-center py-12">
                  {adminViewMode === 'family' ? (
                    <div className="space-y-3">
                      <p className="text-2xl">👍</p>
                      <p className="text-lg font-medium text-gray-700">
                        All set!
                      </p>
                      <p className="text-sm text-gray-600">
                        No immediate actions needed. Check back weekly for updates.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        No evidence-based interventions required at this time
                      </p>
                      <p className="text-xs text-gray-600">
                        Scheduled review: weekly cadence.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key insights */}
          <Card className="border-2 border-blue-600">
            <CardHeader>
              <div className="flex items-baseline gap-3 mb-2">
                <CardTitle className="text-lg sm:text-xl">Your Key Insights</CardTitle>
                {user.keySkillMoments && user.keySkillMoments.length > 0 && (
                  <span className="text-2xl sm:text-3xl font-bold text-blue-600">
                    {user.keySkillMoments.length}
                  </span>
                )}
              </div>
              <CardDescription className="text-sm sm:text-base">
                Breakthrough moments from your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm sm:text-base">
              {user.keySkillMoments && user.keySkillMoments.length > 0 ? (
                <>
                  {user.keySkillMoments.slice(0, 5).map((moment, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-600 text-lg font-bold">#{idx + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium leading-relaxed">"{moment.choice || 'Your choice'}"</p>
                        <p className="text-muted-foreground text-xs sm:text-sm mt-1">{moment.insight || 'Key insight from your journey'}</p>
                        {moment.skillsDemonstrated && moment.skillsDemonstrated.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {moment.skillsDemonstrated.slice(0, 3).map((skill, sidx) => (
                              <Badge key={sidx} variant="secondary" className="text-xs">
                                {skill.replace(/([A-Z])/g, ' $1').trim()}
                              </Badge>
                            ))}
                            {moment.skillsDemonstrated.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{moment.skillsDemonstrated.length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {user.keySkillMoments.length > 5 && (
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-600">
                        + {user.keySkillMoments.length - 5} more insights
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  {adminViewMode === 'family' ? (
                    <div className="space-y-3">
                      <p className="text-2xl">💡</p>
                      <p className="text-lg font-medium text-gray-700">
                        Key insights coming soon!
                      </p>
                      <p className="text-sm text-gray-600">
                        Your most meaningful moments will appear here as you explore different story paths.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        Insight extraction pending
                      </p>
                      <p className="text-xs text-gray-600">
                        Key skill moments identified through narrative choice analysis will populate after threshold interactions.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* NARRATIVE BRIDGE: Action → Evidence - Agent 2: <25 words (Issue 7A-7C) - 15 words (family), 11 words (research) */}
          <div className="bg-indigo-50 border-l-4 border-indigo-400 p-4 sm:p-6 rounded-r mt-6">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              {adminViewMode === 'family' ? (
                <>Want to see the data behind these recommendations? Evidence tab shows the research.</>
              ) : (
                <>Supporting frameworks and research-backed evidence for above recommendations.</>
              )}
            </p>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SingleUserDashboard;