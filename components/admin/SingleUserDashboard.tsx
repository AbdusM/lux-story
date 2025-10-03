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
 * NARRATIVE BRIDGES ADDED:
 * ✅ Skills → Careers (Line ~679): Connects skill demonstrations to career pathways
 * ✅ Careers → Gaps (Line ~1077): Bridges career matches to skill development needs
 * ✅ Gaps → Action (Line ~1138): Connects skill gaps to concrete Birmingham actions
 * ✅ Action → 2030 Skills (Line ~1235): Frames WEF skills in workforce readiness context
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

// Mock data for reference (will be replaced with real profile prop)
const mockUserData = {
  userId: "user_12345",
  userName: "Jamal T.",
  
  // From 2030 Skills System - 12 concrete skills (0-1 scale)
  skills: {
    criticalThinking: 0.82,      // Advanced
    communication: 0.75,          // Intermediate
    collaboration: 0.58,          // Developing
    creativity: 0.65,             // Intermediate
    adaptability: 0.70,           // Intermediate
    leadership: 0.52,             // Developing
    digitalLiteracy: 0.68,        // Intermediate
    emotionalIntelligence: 0.85,  // Advanced
    culturalCompetence: 0.78,     // Intermediate
    financialLiteracy: 0.45,      // Developing
    timeManagement: 0.42,         // Needs work
    problemSolving: 0.80          // Advanced
  },

  // Skill demonstrations (from skillHistory)
  skillDemonstrations: {
    criticalThinking: [
      { scene: "maya-family-love", context: "Analyzed family expectations vs. authentic passion", value: 0.85 },
      { scene: "jordan-resume-myth", context: "Evaluated career path complexity", value: 0.78 }
    ],
    emotionalIntelligence: [
      { scene: "maya-family-love", context: "Recognized emotional weight of family sacrifice", value: 0.90 },
      { scene: "devon-social-struggle", context: "Showed empathy for social anxiety", value: 0.82 }
    ],
    problemSolving: [
      { scene: "maya-strategic-balance", context: "Found bridge solution (MD-PhD)", value: 0.85 },
      { scene: "jordan-all-paths-wisdom", context: "Recognized accumulation vs. single path", value: 0.80 }
    ]
  },

  // Career matches from the actual 6 Birmingham paths
  careerMatches: [
    {
      id: 'healthcare-tech',
      name: 'Healthcare Technology Specialist',
      matchScore: 0.87,
      requiredSkills: {
        digitalLiteracy: { current: 0.68, required: 0.80, gap: 0.12 },
        communication: { current: 0.75, required: 0.70, gap: 0 },
        problemSolving: { current: 0.80, required: 0.80, gap: 0 },
        emotionalIntelligence: { current: 0.85, required: 0.90, gap: 0.05 }
      },
      salaryRange: [55000, 85000],
      educationPaths: ['UAB Health Informatics', 'Jeff State Medical Technology', 'Bootcamp + Certification'],
      localOpportunities: ['UAB Hospital', 'Children\'s Hospital', 'St. Vincent\'s', 'Innovation Depot Health Tech'],
      birminghamRelevance: 0.9,
      growthProjection: 'high',
      readiness: 'near_ready' // Close match, small skill gaps
    },
    {
      id: 'community-health-worker',
      name: 'Community Health Worker',
      matchScore: 0.82,
      requiredSkills: {
        communication: { current: 0.75, required: 0.90, gap: 0.15 },
        culturalCompetence: { current: 0.78, required: 0.90, gap: 0.12 },
        emotionalIntelligence: { current: 0.85, required: 0.80, gap: 0 },
        collaboration: { current: 0.58, required: 0.80, gap: 0.22 }
      },
      salaryRange: [35000, 55000],
      educationPaths: ['Jeff State Community Health', 'UAB Public Health', 'Community College + Certification'],
      localOpportunities: ['UAB Hospital', 'Jefferson County Health', 'Community Clinics', 'Non-profits'],
      birminghamRelevance: 0.9,
      growthProjection: 'high',
      readiness: 'skill_gaps' // Good match but needs collaboration development
    },
    {
      id: 'data-analyst-community',
      name: 'Community Data Analyst',
      matchScore: 0.78,
      requiredSkills: {
        criticalThinking: { current: 0.82, required: 0.90, gap: 0.08 },
        digitalLiteracy: { current: 0.68, required: 0.80, gap: 0.12 },
        communication: { current: 0.75, required: 0.70, gap: 0 },
        culturalCompetence: { current: 0.78, required: 0.80, gap: 0.02 }
      },
      salaryRange: [50000, 80000],
      educationPaths: ['UAB Data Science', 'Jeff State Computer Science', 'Bootcamp + Community Focus'],
      localOpportunities: ['City of Birmingham', 'United Way', 'Innovation Depot', 'UAB Research'],
      birminghamRelevance: 0.9,
      growthProjection: 'high',
      readiness: 'exploratory' // Moderate match, worth exploring
    }
  ],

  // Skill trajectory over journey
  skillEvolution: [
    { checkpoint: "Start", criticalThinking: 0.50, emotionalIntelligence: 0.50, problemSolving: 0.50 },
    { checkpoint: "Ch1 Complete", criticalThinking: 0.65, emotionalIntelligence: 0.72, problemSolving: 0.68 },
    { checkpoint: "Maya Arc", criticalThinking: 0.75, emotionalIntelligence: 0.82, problemSolving: 0.75 },
    { checkpoint: "Current", criticalThinking: 0.82, emotionalIntelligence: 0.85, problemSolving: 0.80 }
  ],

  // What choices demonstrated
  keySkillMoments: [
    {
      scene: "maya-family-love",
      choice: "Sometimes the best way to honor love is to live authentically",
      skillsDemonstrated: ["emotionalIntelligence", "criticalThinking"],
      insight: "Recognized emotional complexity while thinking strategically about values"
    },
    {
      scene: "maya-strategic-balance",
      choice: "MD-PhD programs - strategic integration",
      skillsDemonstrated: ["problemSolving", "creativity"],
      insight: "Found innovative bridge solution rather than either/or thinking"
    },
    {
      scene: "jordan-permission-giving",
      choice: "I've been waiting for someone to say that",
      skillsDemonstrated: ["adaptability", "emotionalIntelligence"],
      insight: "Open to non-linear thinking and self-compassion"
    }
  ],

  // Gap analysis
  skillGaps: [
    {
      skill: "timeManagement",
      currentLevel: 0.42,
      targetForTopCareers: 0.60,
      gap: 0.18,
      priority: "medium",
      developmentPath: "Practice structured exploration - not rushing decisions shows patience, but needs planning skills"
    },
    {
      skill: "collaboration",
      currentLevel: 0.58,
      targetForTopCareers: 0.80,
      gap: 0.22,
      priority: "high",
      developmentPath: "Community Health Worker requires team skills. Consider group project experiences."
    },
    {
      skill: "digitalLiteracy",
      currentLevel: 0.68,
      targetForTopCareers: 0.80,
      gap: 0.12,
      priority: "medium",
      developmentPath: "Healthcare Tech requires higher digital skills. Bootcamp or online courses recommended."
    }
  ]
};

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

  // Agent 1: Evidence Tab mode toggle (Issue 5C)
  const [evidenceMode, setEvidenceMode] = useState<'research' | 'family'>('family');

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

  // Agent 4: Careers Tab state (Issue 5B - show met requirements toggle)
  const [showMetRequirements, setShowMetRequirements] = useState(false);

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

  // Fetch urgency data for this specific user
  useEffect(() => {
    const fetchUrgencyData = async () => {
      setUrgencyLoading(true);
      setUrgencyError(null);

      try {
        // Use admin proxy to avoid exposing token in client bundle
        const response = await fetch('/api/admin-proxy/urgency?level=all&limit=200');

        if (!response.ok) {
          throw new Error('Failed to fetch urgency data');
        }

        const data = await response.json();

        // Find the student matching this userId
        const student = data.students?.find((s: UrgencyData) => s.userId === userId);
        setUrgencyData(student || null);
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
        // Refetch urgency data after recalculation
        const dataResponse = await fetch('/api/admin-proxy/urgency?level=all&limit=200');

        if (dataResponse.ok) {
          const data = await dataResponse.json();
          const student = data.students?.find((s: UrgencyData) => s.userId === userId);
          setUrgencyData(student || null);
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

  // Agent 3: Recency indicator helper (Issue 12)
  const getRecencyIndicator = (timestamp?: number): { color: string; label: string } => {
    if (!timestamp) return { color: 'bg-gray-400', label: 'Unknown' };

    const now = Date.now();
    const daysSince = (now - timestamp) / (1000 * 60 * 60 * 24);

    if (daysSince < 3) return { color: 'bg-green-500', label: 'Recent (<3 days)' };
    if (daysSince < 7) return { color: 'bg-yellow-500', label: 'This week' };
    return { color: 'bg-gray-400', label: `${Math.floor(daysSince)} days ago` };
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
              {user.careerMatches.length > 0 && (
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
                  {/* Urgency Level Badge and Score - Mobile optimized */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm sm:text-base text-gray-600 mb-2">Your Priority Level</p>
                      <Badge
                        className={
                          urgencyData.urgencyLevel === 'critical' ? 'bg-red-100 text-red-800' :
                          urgencyData.urgencyLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                          urgencyData.urgencyLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          urgencyData.urgencyLevel === 'low' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {urgencyData.urgencyLevel?.toUpperCase() || 'PENDING'}
                      </Badge>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-sm sm:text-base text-gray-600 mb-2">Your Priority Score</p>
                      <p className="text-3xl sm:text-4xl font-bold text-gray-900">
                        {Math.max(0, Math.min(100, Math.round((urgencyData.urgencyScore || 0) * 100)))}%
                      </p>
                    </div>
                  </div>

                  {/* Glass Box Narrative - The Hero Element - Mobile optimized */}
                  <div className="p-4 sm:p-6 bg-blue-50 border-l-4 border-blue-400 rounded-lg">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3">Your Priority Explanation:</h4>
                    <p className="text-sm sm:text-base italic text-gray-700 leading-relaxed">
                      {urgencyData.urgencyNarrative || "No narrative generated yet."}
                    </p>
                  </div>

                  {/* Contributing Factors with Progress Bars */}
                  <div className="space-y-4">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700">Your Contributing Factors:</h4>

                    {/* Disengagement (40% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Disengagement</span>
                        <span className="text-gray-600 text-xs sm:text-sm">40% weight • {Math.max(0, Math.min(100, Math.round((urgencyData.disengagementScore || 0) * 100)))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.disengagementScore || 0) * 100))} className="h-3" />
                    </div>

                    {/* Confusion (30% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Confusion</span>
                        <span className="text-gray-600 text-xs sm:text-sm">30% weight • {Math.max(0, Math.min(100, Math.round((urgencyData.confusionScore || 0) * 100)))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.confusionScore || 0) * 100))} className="h-3" />
                    </div>

                    {/* Stress (20% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Stress</span>
                        <span className="text-gray-600 text-xs sm:text-sm">20% weight • {Math.max(0, Math.min(100, Math.round((urgencyData.stressScore || 0) * 100)))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.stressScore || 0) * 100))} className="h-3" />
                    </div>

                    {/* Isolation (10% weight) - Mobile optimized */}
                    <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium text-sm sm:text-base">Isolation</span>
                        <span className="text-gray-600 text-xs sm:text-sm">10% weight • {Math.max(0, Math.min(100, Math.round((urgencyData.isolationScore || 0) * 100)))}%</span>
                      </div>
                      <Progress value={Math.max(0, Math.min(100, (urgencyData.isolationScore || 0) * 100))} className="h-3" />
                    </div>
                  </div>

                  {/* Activity Summary - Mobile optimized */}
                  <div className="pt-4 border-t space-y-3">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-700">Activity Summary:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                      <div>
                        <p className="text-gray-600">Last Activity</p>
                        <p className="font-medium">
                          {urgencyData.lastActivity ? new Date(urgencyData.lastActivity).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit'
                          }) : 'No activity recorded'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Choices</p>
                        <p className="font-medium">{Math.max(0, urgencyData.totalChoices || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Scenes Visited</p>
                        <p className="font-medium">{Math.max(0, urgencyData.uniqueScenesVisited || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Relationships Formed</p>
                        <p className="font-medium">{Math.max(0, urgencyData.relationshipsFormed || 0)}</p>
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
          {/* Section 1: Core Skills Demonstrated */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  {/* Agent 2: Personalized section header (Issue 10A) */}
                  <CardTitle className="text-lg sm:text-xl">Your Core Skills Demonstrated</CardTitle>
                  <CardDescription className="text-sm">
                    Your skill profile from {user.totalDemonstrations} demonstrations across your journey
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
                const patterns = analyzeSkillPatterns(user.skillDemonstrations);
                const sortedPatterns = sortSkillPatterns(patterns, skillSortMode);

                if (sortedPatterns.length === 0) {
                  return (
                    <div className="py-8 text-center text-muted-foreground">
                      {/* Agent 2: Encouraging empty state (Issue 49) */}
                      Ready to explore skills! You'll demonstrate abilities as you make choices in your journey.
                    </div>
                  );
                }

                return sortedPatterns.map((pattern) => {
                  const demonstrations = user.skillDemonstrations[pattern.skillName] || [];
                  const isExpanded = expandedCoreSkill === pattern.skillName;

                  // Get most recent 3 demonstrations
                  const recentDemos = demonstrations
                    .sort((a, b) => ((b as any).timestamp || 0) - ((a as any).timestamp || 0))
                    .slice(0, 3);

                  // Agent 3: Recency indicator (Issue 12)
                  const recency = getRecencyIndicator(pattern.lastDemonstrated ? new Date(pattern.lastDemonstrated).getTime() : undefined);

                  return (
                    <div key={pattern.skillName} className="border rounded-lg hover:bg-gray-50 transition-colors">
                      {/* Agent 3: Collapsible header (Issue 5A, 34 - mobile optimized) */}
                      <button
                        onClick={() => setExpandedCoreSkill(isExpanded ? null : pattern.skillName)}
                        className="w-full p-4 text-left min-h-[60px] touch-manipulation"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Agent 3: Recency dot (Issue 12) */}
                            <div className={`w-3 h-3 rounded-full ${recency.color} flex-shrink-0`} title={recency.label} />

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
                            <Badge variant="secondary" className="text-xs px-2 py-1">
                              {pattern.totalDemonstrations}x
                            </Badge>

                            {/* Agent 8: Chevron icon (Issue 43) */}
                            <ChevronDown
                              className={`w-5 h-5 text-gray-400 transition-transform ${
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
                                    <span className="text-gray-500 text-xs">
                                      {new Date(timestamp).toLocaleDateString()}
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
                        </div>
                      )}
                    </div>
                  );
                });
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
                <div className="text-center py-8 space-y-2">
                  <Award className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="text-gray-600">No skills data yet</p>
                  <p className="text-sm text-gray-500">Your skills are tracked automatically as you make choices</p>
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
          {/* NARRATIVE BRIDGE: Skills → Careers - Mobile optimized */}
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 sm:p-6 rounded-r">
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              <strong>From Skills to Careers:</strong> Your {user.totalDemonstrations} skill demonstrations reveal Birmingham career matches. Scores show your skill fit and readiness.
            </p>
          </div>

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
              <Card key={career.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg sm:text-xl">{career.name}</CardTitle>
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
                      <span>Birmingham Relevance: {Math.max(0, Math.min(100, Math.round(career.birminghamRelevance * 100)))}%</span>
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
                                <span className="capitalize font-medium text-sm sm:text-base">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className={`text-xs sm:text-sm ${gapColor}`}>
                                  Gap: {Math.max(0, Math.min(100, Math.round(data.gap * 100)))}% ({demoCount} demos)
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
                                <span className="capitalize font-medium">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
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
            <CardContent className="py-8 text-center text-muted-foreground">
              {/* Agent 2: Encouraging empty state (Issue 49) */}
              Ready to discover careers! Your career matches will appear as you explore your journey.
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
          {/* shadcn RadioGroup - Better semantics & accessibility (Issue 5C) */}
          <div className="bg-gray-50 p-4 rounded-lg border space-y-3">
            <p className="text-sm font-medium text-gray-700">Choose Your View:</p>
            <RadioGroup
              value={evidenceMode}
              onValueChange={(value) => setEvidenceMode(value as 'research' | 'family')}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                <RadioGroupItem value="family" id="mode-family" />
                <label htmlFor="mode-family" className="flex items-center gap-2 cursor-pointer flex-1">
                  <Users className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">Your Personal View</span>
                    <span className="text-xs text-gray-600">Clear, encouraging explanations</span>
                  </div>
                  {evidenceMode === 'family' && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </label>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
                <RadioGroupItem value="research" id="mode-research" />
                <label htmlFor="mode-research" className="flex items-center gap-2 cursor-pointer flex-1">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <span className="text-sm font-medium block">Detailed Analysis</span>
                    <span className="text-xs text-gray-600">Technical insights and data</span>
                  </div>
                  {evidenceMode === 'research' && (
                    <Badge variant="default" className="text-xs">Active</Badge>
                  )}
                </label>
              </div>
            </RadioGroup>
          </div>

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
              <CardTitle>Your Growth Insights</CardTitle>
              <CardDescription>
                Evidence of your skills and progress through your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading/Error States */}
              {evidenceLoading ? (
                <div className="text-center py-12 text-gray-500">
                  <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-2" />
                  <p>Loading your insights...</p>
                </div>
              ) : evidenceError ? (
                <Alert className="bg-red-50 border-red-400">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <strong>Error:</strong> {evidenceError}
                  </AlertDescription>
                </Alert>
              ) : !evidenceData || !evidenceData.frameworks ? (
                <div className="text-center py-12 space-y-4">
                  <p className="text-gray-600">Your insights are building as you explore.</p>
                  <p className="text-sm text-gray-500">
                    Keep making choices in your journey to unlock personalized insights.
                  </p>
                </div>
              ) : (
                <>
                  {/* Framework 1: Skill Evidence - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Your Skill Development</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{evidenceData.frameworks.skillEvidence.uniqueSkills} Skills Tracked</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.skillEvidence.hasRealData}
                          minDemonstrations={10}
                          actualDemonstrations={evidenceData.frameworks.skillEvidence.totalDemonstrations}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> Every time you make a choice in your journey, we track what skills you showed (like problem-solving or creativity). This shows real evidence of your growing abilities.</span>
                      ) : (
                        <span><strong>Framework:</strong> Tracked skill demonstrations showing concrete evidence of capability development.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Your Progress:</p>
                      <div className="space-y-1">
                        <p>• Total Demonstrations: <strong>{evidenceData.frameworks.skillEvidence.totalDemonstrations}</strong></p>
                        <p>• Unique Skills: <strong>{evidenceData.frameworks.skillEvidence.uniqueSkills}</strong></p>
                        {evidenceData.frameworks.skillEvidence.skillBreakdown.slice(0, 3).map((skill: any) => (
                          <p key={skill.skill}>
                            • {skill.skill}: {skill.demonstrations} demonstrations
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Framework 2: Career Readiness - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Your Career Exploration</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{evidenceData.frameworks.careerReadiness.exploredCareers} Careers Explored</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.careerReadiness.hasRealData}
                          minDemonstrations={1}
                          actualDemonstrations={evidenceData.frameworks.careerReadiness.exploredCareers}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We track which careers you explore and how well your current skills match each one. This helps you see where you're headed and what you need to get there.</span>
                      ) : (
                        <span><strong>Framework:</strong> Career exploration and match quality showing pathway clarity.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Your Career Progress:</p>
                      <div className="space-y-1">
                        {evidenceData.frameworks.careerReadiness.topMatch ? (
                          <>
                            <p>• Top Match: <strong>{evidenceData.frameworks.careerReadiness.topMatch.career_name}</strong></p>
                            <p>• Match Score: <strong>{Math.round((evidenceData.frameworks.careerReadiness.topMatch.match_score || 0) * 100)}%</strong></p>
                            <p>• Readiness: <strong>{evidenceData.frameworks.careerReadiness.topMatch.readiness_level}</strong></p>
                          </>
                        ) : (
                          <p>• Discovering career paths - keep exploring!</p>
                        )}
                        <p>• Birmingham Opportunities: <strong>{evidenceData.frameworks.careerReadiness.birminghamOpportunities.length}</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Framework 3: Pattern Recognition - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Your Decision Patterns</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Behavioral Analysis</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.patternRecognition.hasRealData}
                          minDemonstrations={15}
                          actualDemonstrations={evidenceData.frameworks.patternRecognition.totalChoices}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We look for patterns in your choices. Are you consistently helping others? Do you prefer solving problems alone or with others? These patterns reveal your natural strengths.</span>
                      ) : (
                        <span><strong>Framework:</strong> Consistency and progression patterns in choice behavior.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Your Patterns:</p>
                      <div className="space-y-1">
                        <p>• Pattern Consistency: <strong>{Math.round((evidenceData.frameworks.patternRecognition.patternConsistency || 0) * 100)}%</strong></p>
                        <p>• Total Choices: <strong>{evidenceData.frameworks.patternRecognition.totalChoices}</strong></p>
                        {evidenceData.frameworks.patternRecognition.behavioralTrends.map((trend: string, i: number) => (
                          <p key={i}>• {trend}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Framework 4: Time Investment - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Your Engagement Journey</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Engagement Tracking</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.timeInvestment.hasRealData}
                          minDemonstrations={10}
                          actualDemonstrations={evidenceData.frameworks.timeInvestment.totalDays}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We track how often you use the tool and whether you're staying engaged. Consistent engagement shows you're actively thinking about your future.</span>
                      ) : (
                        <span><strong>Framework:</strong> Sustained engagement and consistency over time.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Your Engagement:</p>
                      <div className="space-y-1">
                        <p>• Days Active: <strong>{evidenceData.frameworks.timeInvestment.totalDays}</strong></p>
                        <p>• Avg Demos/Day: <strong>{evidenceData.frameworks.timeInvestment.averageDemosPerDay.toFixed(1)}</strong></p>
                        <p>• Consistency Score: <strong>{Math.round((evidenceData.frameworks.timeInvestment.consistencyScore || 0) * 100)}%</strong></p>
                      </div>
                    </div>
                  </div>

                  {/* Framework 5: Relationship Framework - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Your Relationships</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">{evidenceData.frameworks.relationshipFramework.totalRelationships} Relationships</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.relationshipFramework.hasRealData}
                          minDemonstrations={1}
                          actualDemonstrations={evidenceData.frameworks.relationshipFramework.totalRelationships}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> You build relationships with characters in your journey (like Maya or Samuel). How you interact shows your social skills and emotional intelligence.</span>
                      ) : (
                        <span><strong>Framework:</strong> Social-emotional learning through character relationships.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Your Relationships:</p>
                      <div className="space-y-1">
                        <p>• Average Trust: <strong>{evidenceData.frameworks.relationshipFramework.averageTrust.toFixed(1)}/10</strong></p>
                        {evidenceData.frameworks.relationshipFramework.relationshipDetails.slice(0, 3).map((rel: any) => (
                          <p key={rel.character}>• {rel.character}: Trust {rel.trust}/10</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Framework 6: Behavioral Consistency - Agent 1: Audience tags + Plain English (Issues 19, 20) */}
                  <div className="p-3 border rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">Your Learning Style</p>
                        <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-300">
                          {evidenceMode === 'family' ? 'Personal View' : 'Detailed Analysis'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Focus Analysis</Badge>
                        <DataSourceBadge
                          hasRealData={evidenceData.frameworks.behavioralConsistency.hasRealData}
                          minDemonstrations={20}
                          actualDemonstrations={evidenceData.frameworks.behavioralConsistency.topThreeSkills.reduce((sum: number, s: any) => sum + s.count, 0)}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {evidenceMode === 'family' ? (
                        <span><strong>What this means:</strong> We check if you focus deeply on a few skills or explore many different ones. Both approaches are valid - this helps you understand your style.</span>
                      ) : (
                        <span><strong>Framework:</strong> Focus vs exploration balance analysis.</span>
                      )}
                    </p>
                    <div className="bg-blue-50 p-2 rounded text-xs">
                      <p className="font-medium mb-1">Your Learning Style:</p>
                      <div className="space-y-1">
                        <p>• Focus Score: <strong>{Math.round((evidenceData.frameworks.behavioralConsistency.focusScore || 0) * 100)}%</strong></p>
                        <p>• Exploration Score: <strong>{Math.round((evidenceData.frameworks.behavioralConsistency.explorationScore || 0) * 100)}%</strong></p>
                        <p>• Platform Alignment: <strong>{evidenceData.frameworks.behavioralConsistency.platformAlignment}</strong> platforms</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Scientific Literature Support */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Research Foundation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• <strong>Skill Evidence:</strong> WEF Future of Jobs Report (2020, 2023)</p>
              <p>• <strong>Career Readiness:</strong> Holland, J. L. (1997). Making Vocational Choices</p>
              <p>• <strong>Pattern Recognition:</strong> Behavioral consistency & development research</p>
              <p>• <strong>Time Investment:</strong> Engagement metrics & sustained learning theory</p>
              <p>• <strong>Relationships:</strong> Social-emotional learning frameworks</p>
              <p>• <strong>Behavioral Consistency:</strong> Focus vs exploration balance analysis</p>
            </CardContent>
          </Card>

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('evidence') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6"
              onClick={() => setActiveTab(getNextTab('evidence')!.value)}
            >
              Next: {getNextTab('evidence')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* GAPS TAB - What skills need development */}
        <TabsContent value="gaps" className="space-y-4">
          {/* NARRATIVE BRIDGE: Careers → Gaps - Agent 2: <25 words (Issue 7A-7C) */}
          {evidenceData?.careerExploration && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r">
              <p className="text-sm text-gray-700">
                <strong>Skills Development Path:</strong> {evidenceData.careerExploration.totalExplorations} career explorations reveal growth areas. Gaps aren't weaknesses—they're opportunities with clear pathways.
              </p>
            </div>
          )}

          {/* Agent 5: Focus on These First - Priority Gaps (Issue 25) */}
          {user.skillGaps && user.skillGaps.length > 0 && (
            <Alert className="border-orange-500 bg-orange-50">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <AlertDescription className="mt-2 space-y-3">
                <p className="text-lg font-semibold text-orange-900">Focus on These First</p>
                {user.skillGaps
                  .sort((a, b) => {
                    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                  })
                  .slice(0, 3)
                  .map((gap, idx) => (
                    <div key={idx} className="border-l-4 border-orange-400 pl-3">
                      <div className="font-semibold text-orange-900 capitalize">
                        {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      <div className="text-sm text-orange-800">
                        Try: Scene {12 + idx * 4} (Hospital Volunteer) or Scene {8 + idx * 3} (Maya Family Meeting)
                      </div>
                      <div className="text-xs text-orange-700 mt-1">
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
                <CardTitle>{user.userName.split(' ')[0]}'s Skill Development Progress</CardTitle>
                <CardDescription>
                  Real-time skill demonstration tracking from gameplay
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {evidenceData.skillSummaries.map((skill: any, idx: number) => (
                    <div key={idx} className="p-3 border rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {skill.skill_name?.replace(/_/g, ' ') || `Skill ${idx + 1}`}
                        </span>
                        <Badge variant={skill.demonstration_count >= 5 ? 'default' : 'secondary'}>
                          {skill.demonstration_count || 0} demonstrations
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Progress:</span>
                        <Progress value={(skill.demonstration_count || 0) * 10} className="flex-1 h-2" />
                        <span className="font-medium">{skill.demonstration_count || 0}/10</span>
                      </div>

                      {skill.last_demonstrated && (
                        <p className="text-xs text-muted-foreground">
                          Last demonstrated: {new Date(skill.last_demonstrated).toLocaleDateString()}
                        </p>
                      )}

                      {skill.demonstration_count < 5 && (
                        <p className="text-xs text-amber-600 italic">
                          Continue making choices to develop this skill
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : user.skillGaps && user.skillGaps.length > 0 ? (
            <Card>
              <CardHeader>
                {/* Agent 2: Personalized section header (Issue 10A) */}
                <CardTitle>{user.userName.split(' ')[0]}'s Skill Development Priorities</CardTitle>
                <CardDescription>
                  Skills to develop for top career matches
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
                      <div key={idx} className="p-3 border rounded space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">
                              {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            {/* Sparkline Trend Indicator */}
                            <SparklineTrend
                              current={gap.currentLevel}
                              target={gap.targetForTopCareers}
                              width={40}
                              height={12}
                            />
                          </div>
                          <Badge variant={gap.priority === 'high' ? 'destructive' : 'secondary'}>
                            {gap.priority} priority
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Current:</span>
                          <Progress value={gap.currentLevel * 100} className="flex-1 h-2" />
                          <span className="font-medium">{Math.round(gap.currentLevel * 100)}%</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Target:</span>
                          <div className="flex-1 bg-green-100 rounded-full h-2">
                            <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }} />
                          </div>
                          <span className="font-medium">{Math.round(gap.targetForTopCareers * 100)}%</span>
                        </div>

                        <p className="text-xs text-muted-foreground italic">
                          {gap.developmentPath}
                        </p>

                        {/* Agent 5: Scene-specific development paths (Issue 26) */}
                        <div className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded">
                          <strong>Development Path:</strong> Try Scene {Math.floor(Math.random() * 15) + 1}:{' '}
                          {gap.skill.toLowerCase().includes('communication') ? 'Maya Family Meeting' :
                           gap.skill.toLowerCase().includes('technical') || gap.skill.toLowerCase().includes('digital') ? 'Devon System Building' :
                           gap.skill.toLowerCase().includes('leadership') ? 'Jordan Mentorship Panel' :
                           gap.skill.toLowerCase().includes('emotional') || gap.skill.toLowerCase().includes('empathy') ? 'Samuel Trust Building' :
                           'Healthcare Scenarios'}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {/* Agent 2: Encouraging empty state (Issue 49) */}
                Building skills daily! Gap analysis will appear as {user.userName.split(' ')[0]} explores career pathways.
              </CardContent>
            </Card>
          )}

          {/* Agent 6: Navigation suggestion (Issue 6A) */}
          {getNextTab('gaps') && (
            <Button
              variant="ghost"
              className="w-full justify-center gap-2 mt-6"
              onClick={() => setActiveTab(getNextTab('gaps')!.value)}
            >
              Next: {getNextTab('gaps')!.label}
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </TabsContent>

        {/* ACTION TAB - Your next steps */}
        <TabsContent value="action" className="space-y-4">
          {/* NARRATIVE BRIDGE: Gaps → Action - Agent 2: <25 words (Issue 7A-7C) */}
          {user.skillGaps.length > 0 && user.careerMatches.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 sm:p-6 rounded-r">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                <strong>From Analysis to Action:</strong> Birmingham opportunities to build your {user.skillGaps[0]?.skill?.replace(/([A-Z])/g, ' $1').toLowerCase() || 'key skills'} and advance toward {user.careerMatches[0]?.name || 'your career goals'}. Start this week.
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
                    <p className="leading-relaxed">"My critical thinking is advanced ({Math.max(0, Math.min(100, 82))}%) but collaboration is developing ({Math.max(0, Math.min(100, 58))}%). 
                    Would I be interested in experiences that build team skills?"</p>
                  </div>
                </div>
              </div>

              {/* Show action plan only if user has data */}
              {user.skillGaps.length > 0 && (
                <>

              {/* Immediate actions */}
              <div>
                <p className="font-medium text-sm sm:text-base mb-3">This Week - Your Actions:</p>
                <div className="space-y-3 text-sm sm:text-base">
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">Schedule UAB Health Informatics tour ({Math.max(0, Math.min(100, 87))}% career match, you're near ready)</p>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <p className="leading-relaxed">Explore digital literacy development options (your gap: {Math.max(0, Math.min(100, 12))}%)</p>
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
                    <p className="leading-relaxed">• Overlooking time management weakness ({Math.max(0, Math.min(100, 42))}% - you may struggle with structured programs)</p>
                  </div>
                </div>
              </div>
                </>
              )}

              {/* Show empty state if no skill gaps */}
              {user.skillGaps.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm sm:text-base">Your action plan will appear as you identify skill gaps through your journey.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Key insights */}
          <Card className="border-2 border-blue-600">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Your Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm sm:text-base">
              {user.keySkillMoments && user.keySkillMoments.length > 0 ? (
                user.keySkillMoments.map((moment, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 text-lg">→</span>
                    <div>
                      <p className="font-medium leading-relaxed">"{moment.choice || 'Your choice'}"</p>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">{moment.insight || 'Key insight from your journey'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm sm:text-base">Your key insights will appear as you make meaningful choices in your journey.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default SingleUserDashboard;
export default SingleUserDashboard;