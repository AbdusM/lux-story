import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Target, TrendingUp, Briefcase, Lightbulb, CheckCircle2, AlertTriangle } from 'lucide-react';

// Using the ACTUAL 2030 skills system
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

const SingleUserDashboard = () => {
  const [activeTab, setActiveTab] = useState("skills");
  const user = mockUserData;

  const getSkillLevel = (value: number) => {
    if (value >= 0.80) return { label: "Advanced", color: "text-green-600", bg: "bg-green-600" };
    if (value >= 0.60) return { label: "Intermediate", color: "text-blue-600", bg: "bg-blue-600" };
    if (value >= 0.40) return { label: "Developing", color: "text-yellow-600", bg: "bg-yellow-600" };
    return { label: "Beginning", color: "text-red-600", bg: "bg-red-600" };
  };

  const skillNames = {
    criticalThinking: "Critical Thinking",
    communication: "Communication",
    collaboration: "Collaboration",
    creativity: "Creativity",
    adaptability: "Adaptability",
    leadership: "Leadership",
    digitalLiteracy: "Digital Literacy",
    emotionalIntelligence: "Emotional Intelligence",
    culturalCompetence: "Cultural Competence",
    financialLiteracy: "Financial Literacy",
    timeManagement: "Time Management",
    problemSolving: "Problem Solving"
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
            <Badge variant="default" className="text-lg">
              {user.careerMatches[0].matchScore * 100}% Match
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="evidence">Evidence</TabsTrigger>
          <TabsTrigger value="gaps">Gaps</TabsTrigger>
          <TabsTrigger value="action">Action</TabsTrigger>
        </TabsList>

        {/* SKILLS TAB - The 12 concrete skills */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Demonstrated Skills (2030 Framework)
              </CardTitle>
              <CardDescription>Based on choices made throughout journey</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {Object.entries(user.skills)
                    .sort(([,a], [,b]) => b - a)
                    .map(([skill, value]) => {
                      const level = getSkillLevel(value);
                      return (
                        <div key={skill} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{skillNames[skill as keyof typeof skillNames]}</span>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={level.color}>
                                {level.label}
                              </Badge>
                              <span className="text-sm font-bold">{Math.round(value * 100)}%</span>
                            </div>
                          </div>
                          <Progress value={value * 100} className="h-2" />
                          
                          {/* Show demonstrations if available */}
                          {user.skillDemonstrations[skill as keyof typeof user.skillDemonstrations] && (
                            <div className="mt-1 pl-3 border-l-2 border-blue-400">
                              {user.skillDemonstrations[skill as keyof typeof user.skillDemonstrations].map((demo, idx) => (
                                <p key={idx} className="text-xs text-muted-foreground">
                                  • {demo.context}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Skill Growth */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Skill Development Trajectory
              </CardTitle>
              <CardDescription>How skills evolved through the journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user.skillEvolution.map((checkpoint, idx) => (
                  <div key={idx} className="space-y-1">
                    <p className="text-sm font-medium">{checkpoint.checkpoint}</p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">Critical: </span>
                        <span className="font-medium">{Math.round(checkpoint.criticalThinking * 100)}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Emotional: </span>
                        <span className="font-medium">{Math.round(checkpoint.emotionalIntelligence * 100)}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Problem: </span>
                        <span className="font-medium">{Math.round(checkpoint.problemSolving * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EVIDENCE TAB - Scientific frameworks and outcomes */}
        <TabsContent value="evidence" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evidence-Based Framework</CardTitle>
              <CardDescription>
                Scientific models and measurable outcomes for funding accountability
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Framework 1: 2030 Skills (World Economic Forum) */}
              <div className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">World Economic Forum - Future of Jobs Report 2030</p>
                  <Badge variant="default">12 Skills Tracked</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Framework: Critical skills identified for 2030 workforce readiness including critical thinking, 
                  emotional intelligence, digital literacy, and problem-solving.
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Student Outcomes:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <p>• Critical Thinking: 82% (Advanced)</p>
                    <p>• Emotional Intelligence: 85% (Advanced)</p>
                    <p>• Problem Solving: 80% (Advanced)</p>
                    <p>• Digital Literacy: 68% (Intermediate)</p>
                  </div>
                </div>
              </div>

              {/* Framework 2: Erikson Identity Development */}
              <div className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Erikson's Identity Development Theory</p>
                  <Badge variant="default">Stage 5: Identity vs. Role Confusion</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Framework: Adolescent identity formation through exploration and commitment. 
                  Key outcomes: self-concept clarity, value integration, career identity crystallization.
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Student Progress:</p>
                  <p>• Identity Status: <strong>Crystallizing (80%)</strong></p>
                  <p>• Exploration → Integration pathway demonstrated</p>
                  <p>• Values alignment showing strategic thinking</p>
                  <p>• Ready for structured exploration phase</p>
                </div>
              </div>

              {/* Framework 3: Flow Theory */}
              <div className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Csikszentmihalyi's Flow Theory</p>
                  <Badge variant="default">Engagement Optimization</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Framework: Optimal experience through challenge-skill balance. Measures engagement depth, 
                  intrinsic motivation, and sustained attention as indicators of meaningful exploration.
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Engagement Markers:</p>
                  <p>• Deep engagement: 18 min (Maya family pressure narrative)</p>
                  <p>• Challenge-skill match: Healthcare Tech (87% alignment)</p>
                  <p>• Intrinsic motivation: Problem-solving choices (80%)</p>
                  <p>• Sustained focus: Multiple return visits to integration themes</p>
                </div>
              </div>

              {/* Framework 4: Limbic Learning */}
              <div className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Limbic System Learning Integration</p>
                  <Badge variant="default">Emotional + Cognitive</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Framework: Emotion-cognition integration for deeper learning. Stress response patterns, 
                  emotional regulation, and affective decision-making as learning indicators.
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Stress Response Profile:</p>
                  <p>• Baseline: Adaptive (healthy regulation)</p>
                  <p>• Brief reactive spike: Maya family scenes (emotionally loaded topic identified)</p>
                  <p>• Recovery: Quick return to calm (resilience demonstrated)</p>
                  <p>• Pattern: Emotional intelligence + Critical thinking integration</p>
                </div>
              </div>

              {/* Framework 5: Social Cognitive Career Theory */}
              <div className="p-3 border rounded space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Social Cognitive Career Theory (SCCT)</p>
                  <Badge variant="default">Self-Efficacy Building</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Framework: Career development through self-efficacy beliefs, outcome expectations, 
                  and personal goals. Measures confidence in skill areas and readiness for career action.
                </p>
                <div className="bg-blue-50 p-2 rounded text-xs">
                  <p className="font-medium mb-1">Self-Efficacy Indicators:</p>
                  <p>• Strong self-efficacy: Emotional Intelligence (85%), Problem-solving (80%)</p>
                  <p>• Developing self-efficacy: Collaboration (58%), Time Management (42%)</p>
                  <p>• Career confidence: Healthcare Tech match (87%) with clear action steps</p>
                  <p>• Outcome expectations: Explored salary data, education pathways</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Measurable Outcomes for Funders */}
          <Card className="border-2 border-green-600">
            <CardHeader>
              <CardTitle className="text-lg">Grant-Reportable Outcomes</CardTitle>
              <CardDescription>Quantifiable metrics for funding accountability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">87%</p>
                  <p className="text-xs text-muted-foreground">Career Match Score (Healthcare Tech)</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">80%</p>
                  <p className="text-xs text-muted-foreground">Identity Clarity (Erikson Framework)</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">3</p>
                  <p className="text-xs text-muted-foreground">Advanced-Level Skills Developed</p>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <p className="text-2xl font-bold text-green-600">6</p>
                  <p className="text-xs text-muted-foreground">Birmingham Career Pathways Explored</p>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2 text-xs">
                <p className="font-medium">Funder-Specific Metrics:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>• <strong>Skill Development:</strong> 32% improvement in Critical Thinking (0.50 → 0.82)</p>
                  <p>• <strong>Career Clarity:</strong> From exploration (20%) to crystallization (80%) in identity formation</p>
                  <p>• <strong>Local Connection:</strong> 90% Birmingham relevance score (UAB, Innovation Depot focus)</p>
                  <p>• <strong>Action Readiness:</strong> 2 concrete next steps identified with specific employers</p>
                  <p>• <strong>Evidence-Based:</strong> 5 validated psychological frameworks with measurable outcomes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Research Backing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Scientific Literature Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>• <strong>2030 Skills:</strong> World Economic Forum, Future of Jobs Report (2020, 2023)</p>
              <p>• <strong>Identity Development:</strong> Erikson, E. H. (1968). Identity: Youth and Crisis</p>
              <p>• <strong>Flow Theory:</strong> Csikszentmihalyi, M. (1990). Flow: The Psychology of Optimal Experience</p>
              <p>• <strong>Limbic Learning:</strong> LeDoux, J. (2015). Anxious: Using the Brain to Understand Fear</p>
              <p>• <strong>Career Theory:</strong> Lent, R. W., Brown, S. D., & Hackett, G. (1994). SCCT</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CAREERS TAB - Actual Birmingham pathways */}
        <TabsContent value="careers" className="space-y-4">
          {user.careerMatches.map((career) => (
            <Card key={career.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{career.name}</CardTitle>
                  <Badge variant="default">{Math.round(career.matchScore * 100)}% Match</Badge>
                </div>
                <CardDescription>
                  ${career.salaryRange[0].toLocaleString()} - ${career.salaryRange[1].toLocaleString()} • 
                  Birmingham Relevance: {Math.round(career.birminghamRelevance * 100)}%
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Skill requirements */}
                <div>
                  <p className="text-sm font-medium mb-2">Skill Requirements:</p>
                  <div className="space-y-2">
                    {Object.entries(career.requiredSkills).map(([skill, data]) => (
                      <div key={skill} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className={data.gap > 0 ? "text-yellow-600" : "text-green-600"}>
                            {data.current >= data.required ? "✓ Met" : `Gap: ${Math.round(data.gap * 100)}%`}
                          </span>
                        </div>
                        <div className="flex gap-1 items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${data.gap > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}
                              style={{ width: `${(data.current / data.required) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-16 text-right">
                            {Math.round(data.current * 100)}/{Math.round(data.required * 100)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education paths */}
                <div>
                  <p className="text-sm font-medium mb-1">Education Pathways:</p>
                  <div className="flex flex-wrap gap-1">
                    {career.educationPaths.map(path => (
                      <Badge key={path} variant="secondary" className="text-xs">{path}</Badge>
                    ))}
                  </div>
                </div>

                {/* Local opportunities */}
                <div>
                  <p className="text-sm font-medium mb-1">Birmingham Employers:</p>
                  <div className="flex flex-wrap gap-1">
                    {career.localOpportunities.map(opp => (
                      <Badge key={opp} variant="outline" className="text-xs">{opp}</Badge>
                    ))}
                  </div>
                </div>

                {/* Readiness */}
                <div className="pt-2 border-t">
                  {career.readiness === 'near_ready' && (
                    <div className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <p className="text-green-600">
                        <strong>Near Ready:</strong> Small skill gaps. Consider exploratory experiences.
                      </p>
                    </div>
                  )}
                  {career.readiness === 'skill_gaps' && (
                    <div className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <p className="text-yellow-600">
                        <strong>Skill Gaps:</strong> Good foundation but needs development. See Gaps tab.
                      </p>
                    </div>
                  )}
                  {career.readiness === 'exploratory' && (
                    <div className="flex items-start gap-2 text-sm">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p className="text-blue-600">
                        <strong>Worth Exploring:</strong> Moderate match. Informational interviews recommended.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* GAPS TAB - What skills need development */}
        <TabsContent value="gaps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skill Development Priorities</CardTitle>
              <CardDescription>
                Skills to develop for top career matches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user.skillGaps
                  .sort((a, b) => {
                    const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
                    return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
                  })
                  .map((gap, idx) => (
                    <div key={idx} className="p-3 border rounded space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {gap.skill.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
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
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ACTION TAB - Administrator next steps */}
        <TabsContent value="action" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Administrator Action Plan
              </CardTitle>
              <CardDescription>Concrete next steps for this student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Conversation starters */}
              <div>
                <p className="font-medium text-sm mb-2">Conversation Starters:</p>
                <div className="space-y-2 text-sm">
                  <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-600">
                    <p>"You showed strong emotional intelligence and problem-solving skills. 
                    Have you thought about healthcare technology roles that use both?"</p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded border-l-2 border-blue-600">
                    <p>"Your critical thinking is advanced (82%) but collaboration is developing (58%). 
                    Would you be interested in experiences that build team skills?"</p>
                  </div>
                </div>
              </div>

              {/* Immediate actions */}
              <div>
                <p className="font-medium text-sm mb-2">This Week:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p>Schedule UAB Health Informatics tour (87% career match, near ready)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                    <p>Discuss digital literacy development options (gap: 12%)</p>
                  </div>
                </div>
              </div>

              {/* Next month */}
              <div>
                <p className="font-medium text-sm mb-2">Next Month:</p>
                <div className="space-y-1 text-sm">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p>Connect with UAB Hospital or Children's Hospital for shadowing</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p>Explore group projects or team activities (collaboration skill gap)</p>
                  </div>
                </div>
              </div>

              {/* What to avoid */}
              <div className="border-t pt-3">
                <p className="font-medium text-sm mb-2 text-red-600">Avoid:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Pushing for immediate career commitment (still exploring)</p>
                  <p>• Ignoring skill gaps (collaboration needs work for Community Health path)</p>
                  <p>• Overlooking time management weakness (42% - may struggle with structured programs)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key insights */}
          <Card className="border-2 border-blue-600">
            <CardHeader>
              <CardTitle className="text-lg">Key Psychological Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {user.keySkillMoments.map((moment, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-600">→</span>
                  <div>
                    <p className="font-medium">"{moment.choice}"</p>
                    <p className="text-muted-foreground text-xs">{moment.insight}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SingleUserDashboard;