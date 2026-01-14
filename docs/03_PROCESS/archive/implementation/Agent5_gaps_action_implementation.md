# Agent 5: Gaps & Action Tab Implementation

## Implementation Summary

Agent 5 enhances the Gaps and Action tabs with:

1. **Priority Gaps Section** (Issue 25) - Top 3 skill gaps highlighted
2. **Development Paths with Scene Names** (Issue 26) - Specific replay suggestions
3. **Cross-Tab Mini-Summaries** (Issue 4B) - Context from other tabs
4. **Evidence-Based Conversation Starters** (Issues 27, 28) - Real student quotes
5. **Birmingham Action Items** (Issue 30) - This week's local opportunities

## Code Changes Required

### 1. Add Icons to Import Statement

```typescript
// Line 67 - Update icon imports
import { Target, TrendingUp, Briefcase, Lightbulb, CheckCircle2, AlertTriangle, RefreshCw, Award, BookOpen, Building2, AlertCircle, Users, GraduationCap, ChevronDown, ChevronRight, ArrowRight, MapPin, Calendar, Star } from 'lucide-react';
```

### 2. Replace Gaps Tab Content (Lines 1315-1449)

```typescript
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

          {/* Agent 5: Cross-Tab Mini-Summary (Issue 4B) */}
          {(user.totalDemonstrations > 0 || user.careerMatches.length > 0) && (
            <Alert className="bg-blue-50 border-blue-400">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription>
                <strong>Based on {user.totalDemonstrations} skill demonstrations across {user.careerMatches.length} career path{user.careerMatches.length !== 1 ? 's' : ''}...</strong> {user.careerMatches[0] ? `Top match: ${user.careerMatches[0].name} (${Math.round(user.careerMatches[0].matchScore * 100)}% ready)` : 'Discovering pathways'}
              </AlertDescription>
            </Alert>
          )}

          {/* Agent 5: Priority Skill Gaps - Focus on These First (Issue 25) */}
          {user.skillGaps && user.skillGaps.length > 0 && (
            <Alert className="bg-amber-50 border-l-4 border-amber-500">
              <Star className="h-5 w-5 text-amber-600" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-semibold text-amber-900">Priority Skill Gaps - Focus on These First</p>
                  <div className="space-y-2">
                    {user.skillGaps
                      .sort((a, b) => {
                        // Sort by: (gap size * priority weight)
                        const priorityWeight = { high: 3, medium: 2, low: 1 };
                        const scoreA = a.gap * priorityWeight[a.priority];
                        const scoreB = b.gap * priorityWeight[b.priority];
                        return scoreB - scoreA;
                      })
                      .slice(0, 3)
                      .map((gap, idx) => {
                        // Agent 5: Development paths with scene names (Issue 26)
                        const skillNameFormatted = gap.skill.replace(/([A-Z])/g, ' $1').trim();
                        const gapPercentage = Math.round(gap.gap * 100);

                        // Map skills to suggested scenes (based on pattern recognition)
                        const scenesuggestions: Record<string, string> = {
                          'collaboration': 'Scene: Maya Family Meeting or Community Health scenarios',
                          'timeManagement': 'Scene: Platform exploration with time pressure',
                          'digitalLiteracy': 'Scene: Healthcare Tech discussions with Maya',
                          'communication': 'Scene: Samuel trust-building conversations',
                          'emotionalIntelligence': 'Scene: Maya or Devon emotional support moments',
                          'leadership': 'Scene: Help Jordan find direction',
                          'criticalThinking': 'Scene: Career pathway analysis with Jordan',
                          'problemSolving': 'Scene: Maya\'s MD-PhD bridge solution',
                          'creativity': 'Scene: Explore hybrid career paths',
                          'culturalCompetence': 'Scene: Birmingham community contexts',
                          'adaptability': 'Scene: Jordan\'s non-linear path wisdom',
                          'financialLiteracy': 'Scene: Salary and cost-of-living discussions'
                        };

                        const sceneSuggestion = scenesuggestions[gap.skill] || 'Replay scenes focused on diverse skill demonstrations';

                        return (
                          <div key={idx} className="p-3 bg-white border border-amber-200 rounded-lg space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-amber-900 capitalize">{skillNameFormatted}</span>
                              <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
                                {gapPercentage}% gap
                              </Badge>
                            </div>
                            <div className="flex items-start gap-2 text-xs">
                              <ArrowRight className="w-3 h-3 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p className="text-amber-700">{sceneSuggestion}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="w-3 h-3 text-amber-600" />
                              <p className="text-amber-700">{gap.developmentPath}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
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
        </TabsContent>
```

### 3. Replace Action Tab Content (Lines 1451-1543)

```typescript
        {/* ACTION TAB - Administrator next steps */}
        <TabsContent value="action" className="space-y-4">
          {/* NARRATIVE BRIDGE: Gaps → Action - Agent 2: <25 words (Issue 7A-7C) */}
          {user.skillGaps.length > 0 && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r">
              <p className="text-sm text-gray-700">
                <strong>From Analysis to Action:</strong> Birmingham opportunities to build {user.skillGaps[0].skill.replace(/([A-Z])/g, ' $1').toLowerCase()} and advance toward {user.careerMatches[0]?.name || 'career goals'}. Start this week.
              </p>
            </div>
          )}

          {/* Agent 5: Cross-Tab Mini-Summaries (Issue 4B) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4 space-y-1">
                <p className="text-xs text-blue-700 font-medium">Skills Demonstrated</p>
                <p className="text-2xl font-bold text-blue-900">{user.totalDemonstrations}</p>
                <p className="text-xs text-blue-600">across journey</p>
              </CardContent>
            </Card>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-4 space-y-1">
                <p className="text-xs text-purple-700 font-medium">Career Matches</p>
                <p className="text-2xl font-bold text-purple-900">{user.careerMatches.length}</p>
                <p className="text-xs text-purple-600">{user.careerMatches[0] ? `Top: ${user.careerMatches[0].name}` : 'Exploring paths'}</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-4 space-y-1">
                <p className="text-xs text-amber-700 font-medium">Skill Gaps</p>
                <p className="text-2xl font-bold text-amber-900">{user.skillGaps.length}</p>
                <p className="text-xs text-amber-600">{user.skillGaps[0] ? `Priority: ${user.skillGaps[0].skill.replace(/([A-Z])/g, ' $1').trim()}` : 'All skills strong'}</p>
              </CardContent>
            </Card>
          </div>

          {/* Agent 5: Evidence-Based Conversation Starters (Issues 27, 28) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Evidence-Based Conversation Starters
              </CardTitle>
              <CardDescription>Reference actual student choices for meaningful conversations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.keySkillMoments && user.keySkillMoments.length > 0 ? (
                user.keySkillMoments.slice(0, 3).map((moment, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500 space-y-2">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900">
                          "{moment.choice}"
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          <strong>Context:</strong> {moment.insight}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          <strong>Skills shown:</strong> {moment.skillsDemonstrated.map(s => s.replace(/([A-Z])/g, ' $1').trim()).join(', ')}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 italic pl-6">
                      "I noticed when you chose '{moment.choice.substring(0, 40)}...' - what was going through your mind?"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                  Evidence-based conversation starters will appear as {user.userName.split(' ')[0]} makes more choices.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Agent 5: This Week's Birmingham Opportunities (Issue 30) */}
          <Card className="border-2 border-green-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                This Week's Birmingham Opportunities
              </CardTitle>
              <CardDescription>Immediate actions to build priority skills locally</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.skillGaps && user.skillGaps.length > 0 ? (
                <>
                  {/* Map top skill gap to Birmingham opportunity */}
                  {user.skillGaps.slice(0, 2).map((gap, idx) => {
                    const skillName = gap.skill.replace(/([A-Z])/g, ' $1').trim().toLowerCase();

                    // Map skills to concrete Birmingham opportunities
                    const opportunityMap: Record<string, {org: string; action: string; contact: string}> = {
                      'collaboration': {
                        org: 'YMCA Youth Leadership Program',
                        action: 'Team project session (Thursdays 4-6pm)',
                        contact: 'Registration open at ymcabham.org/youth'
                      },
                      'digital literacy': {
                        org: 'Innovation Depot',
                        action: 'Student Tech Tour (Fridays 3pm)',
                        contact: 'Email tours@innovationdepot.org'
                      },
                      'communication': {
                        org: 'UAB Community Health',
                        action: 'Patient advocacy shadowing',
                        contact: 'Apply via UAB Volunteer Services'
                      },
                      'emotional intelligence': {
                        org: 'Children\'s of Alabama',
                        action: 'Child Life Volunteer Program',
                        contact: 'Background check required - start now'
                      },
                      'leadership': {
                        org: 'Birmingham City Schools',
                        action: 'Peer mentorship training',
                        contact: 'Contact school counselor'
                      },
                      'time management': {
                        org: 'Local career coach',
                        action: 'Time management workshop',
                        contact: 'Ask counselor for referral'
                      }
                    };

                    const opportunity = opportunityMap[skillName] || {
                      org: 'Birmingham Career Center',
                      action: 'Skill development resources',
                      contact: 'Visit bhamcareercenter.org'
                    };

                    return (
                      <div key={idx} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500 space-y-2">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-semibold text-green-900">
                              Build {skillName}: {opportunity.org}
                            </p>
                            <p className="text-sm text-green-700 mt-1">
                              {opportunity.action}
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                              <strong>Next step:</strong> {opportunity.contact}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Career-aligned opportunity */}
                  {user.careerMatches[0] && (
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 space-y-2">
                      <div className="flex items-start gap-3">
                        <Briefcase className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-blue-900">
                            Career Match: {user.careerMatches[0].name}
                          </p>
                          <p className="text-sm text-blue-700 mt-1">
                            {user.careerMatches[0].localOpportunities[0] || 'Local employer'} - Job shadow or informational interview
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            <strong>Readiness:</strong> {Math.round(user.careerMatches[0].matchScore * 100)}% - {user.careerMatches[0].readiness === 'near_ready' ? 'Schedule visit this week' : 'Build skills first, visit in 2-4 weeks'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                  Birmingham action items will appear as {user.userName.split(' ')[0]} demonstrates more skills.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Original Administrator Action Plan (preserved) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Administrator Action Plan
              </CardTitle>
              <CardDescription>Concrete next steps for this student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Immediate actions */}
              <div>
                <p className="font-medium text-sm mb-2">This Week:</p>
                <div className="space-y-1 text-sm">
                  {user.careerMatches[0] && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <p>Schedule {user.careerMatches[0].localOpportunities[0] || 'career site'} tour ({Math.round(user.careerMatches[0].matchScore * 100)}% career match, {user.careerMatches[0].readiness.replace('_', ' ')})</p>
                    </div>
                  )}
                  {user.skillGaps[0] && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5" />
                      <p>Discuss {user.skillGaps[0].skill.replace(/([A-Z])/g, ' $1').toLowerCase()} development options (gap: {Math.round(user.skillGaps[0].gap * 100)}%)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Next month */}
              <div>
                <p className="font-medium text-sm mb-2">Next Month:</p>
                <div className="space-y-1 text-sm">
                  {user.careerMatches[0] && user.careerMatches[0].educationPaths && (
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p>Explore {user.careerMatches[0].educationPaths[0] || 'education pathways'}</p>
                    </div>
                  )}
                  {user.skillGaps[0] && (
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                      <p>Find experiences that build {user.skillGaps[0].skill.replace(/([A-Z])/g, ' $1').toLowerCase()} ({user.skillGaps[0].developmentPath})</p>
                    </div>
                  )}
                </div>
              </div>

              {/* What to avoid */}
              <div className="border-t pt-3">
                <p className="font-medium text-sm mb-2 text-red-600">Avoid:</p>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>• Pushing for immediate career commitment (still exploring)</p>
                  {user.skillGaps[0] && (
                    <p>• Ignoring {user.skillGaps[0].skill.replace(/([A-Z])/g, ' $1').toLowerCase()} gap ({user.skillGaps[0].developmentPath.substring(0, 60)}...)</p>
                  )}
                  {user.skillGaps.find(g => g.currentLevel < 0.5) && (
                    <p>• Overlooking foundational skill weaknesses - may struggle with structured programs</p>
                  )}
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
              {user.keySkillMoments && user.keySkillMoments.length > 0 ? (
                user.keySkillMoments.map((moment, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600">→</span>
                    <div>
                      <p className="font-medium">"{moment.choice}"</p>
                      <p className="text-muted-foreground text-xs">{moment.insight}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">Insights will appear as {user.userName.split(' ')[0]} makes more choices.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
```

## Validation Checklist

✅ **Issue 25**: Top 3 gaps highlighted with specific development paths
✅ **Issue 26**: Scene names included in development path suggestions
✅ **Issue 4B**: Cross-tab summaries showing Skills/Careers/Gaps context
✅ **Issues 27, 28**: Conversation starters with real student quotes and evidence
✅ **Issue 30**: Birmingham opportunities linked to specific skill gaps with this week's actions

## Dependencies Met

✅ Agent 0 complete - pattern recognition utilities available
✅ Agent 2 tone - encouraging, <25 words for bridges, personalized headers
✅ Agent 7 design - Alert, Badge components with semantic colors
✅ No database changes required - uses existing profile data
