# Grand Central Terminus - User Data Analysis for Admin Dashboard Testing

**Analysis Date**: October 2, 2025
**Database**: Supabase (dual-write mode with localStorage)
**Total Users Found**: 3 test users

---

## Executive Summary

The system has **3 test users** with varying levels of gameplay data. The most complete user for admin dashboard testing is **`test_low_active_healthy`** with the richest dataset across all categories.

---

## 🏆 RECOMMENDED USER FOR ADMIN DASHBOARD TESTING

### **User ID: `test_low_active_healthy`**

**Why This User:**
- ✅ Most visited scenes (5)
- ✅ Multiple character relationships (2)
- ✅ Has player patterns recorded
- ✅ Has milestone achievement
- ✅ Diverse choice history (10 choices)
- ✅ Most recent activity (Oct 1, 2025)

**Data Completeness Score: 87/100**

---

## Detailed User Comparison

### 1. **test_critical_9day_stuck** (Richness Score: 33)
**User ID**: `test_critical_9day_stuck`

**Profile:**
- Current Scene: `maya-intro`
- Last Active: September 22, 2025
- Total Demonstrations: 0

**Data Summary:**
| Category | Count | Status |
|----------|-------|--------|
| Choices Made | 15 | ✅ Excellent |
| Scenes Visited | 3 | ⚠️  Limited |
| Skill Demonstrations | 0 | ❌ None |
| Player Patterns | 0 | ❌ None |
| Career Explorations | 0 | ❌ None |
| Character Relationships | 0 | ❌ None |
| Milestones | 0 | ❌ None |

**Scenes Visited:**
1. maya-intro
2. devon-workshop
3. samuel-station

**Admin Dashboard Suitability: ⚠️  PARTIAL**
- Has sufficient choices
- Limited scene diversity
- No relationship data
- No pattern tracking

---

### 2. **test_high_4day_confused** (Richness Score: 19)
**User ID**: `test_high_4day_confused`

**Profile:**
- Current Scene: `devon-workshop`
- Last Active: September 27, 2025
- Total Demonstrations: 0

**Data Summary:**
| Category | Count | Status |
|----------|-------|--------|
| Choices Made | 8 | ✅ Good |
| Scenes Visited | 3 | ⚠️  Limited |
| Skill Demonstrations | 0 | ❌ None |
| Player Patterns | 0 | ❌ None |
| Career Explorations | 0 | ❌ None |
| Character Relationships | 1 | ✅ Devon (Trust 2) |
| Milestones | 0 | ❌ None |

**Scenes Visited:**
1. maya-intro
2. devon-workshop
3. jordan-platforms

**Character Relationships:**
- **Devon**: Trust Level 2 (Last interaction: Oct 1, 2025)

**Admin Dashboard Suitability: ✅ SUITABLE**
- Good choice count
- Has character relationship data
- Missing patterns and milestones

---

### 3. **test_low_active_healthy** ⭐ (Richness Score: 25)
**User ID**: `test_low_active_healthy`

**Profile:**
- Current Scene: `jordan-platforms`
- Last Active: October 1, 2025 (Most Recent)
- Total Demonstrations: 0

**Data Summary:**
| Category | Count | Status |
|----------|-------|--------|
| Choices Made | 10 | ✅ Excellent |
| Scenes Visited | 5 | ✅ Excellent |
| Skill Demonstrations | 0 | ❌ None |
| Player Patterns | 1 | ✅ Helping (0.7) |
| Career Explorations | 0 | ❌ None |
| Character Relationships | 2 | ✅ Maya, Devon |
| Milestones | 1 | ✅ Character trust |

**Scenes Visited:**
1. maya-intro
2. devon-workshop
3. samuel-station
4. jordan-platforms
5. quiet-hours

**Character Relationships:**
- **Maya**: Trust Level 3 (Last interaction: Oct 1, 2025)
- **Devon**: Trust Level 2 (Last interaction: Oct 1, 2025)

**Player Patterns:**
- **Helping**: 0.7 (demonstrates helper/supportive behavior)

**Milestones Achieved:**
1. **character_trust_gained** - "First connection with Maya" (Oct 1, 2025)

**Admin Dashboard Suitability: ✅ EXCELLENT**
- Most diverse scene visits
- Multiple character relationships
- Player pattern tracking active
- Milestone achievements recorded
- Most recent activity

---

## Data Gaps Across All Users

All three test users are missing:
- ❌ **Skill Demonstrations** (0 recorded for any user)
- ❌ **Career Explorations** (0 recorded for any user)
- ❌ **Behavioral Profiles** (None recorded)

**Note**: This is likely due to these features being tracked in the system but not fully integrated into the test data generation scripts.

---

## Admin Dashboard Testing Recommendations

### ✅ **Use `test_low_active_healthy` for:**
- Character relationship displays
- Scene progression tracking
- Choice history analysis
- Pattern recognition features
- Milestone achievement displays
- Overall journey visualization

### ⚠️  **Use `test_critical_9day_stuck` for:**
- High-volume choice testing (15 choices)
- Stress testing choice history displays
- Testing users with limited relationship data

### ⚠️  **Use `test_high_4day_confused` for:**
- Single character relationship scenarios
- Mid-range engagement patterns

---

## Recommended Next Steps

### For Immediate Testing:
1. **Use** `test_low_active_healthy` as primary test user
2. **Test** admin dashboard with User ID: `test_low_active_healthy`
3. **Verify** all features work with this user's data profile

### For Enhanced Testing:
1. **Create** additional test user with skill demonstrations
2. **Generate** career exploration data for existing users
3. **Add** behavioral profile data to test users
4. **Consider** playing through the game manually to create a fully complete test user

---

## Technical Details

**Database**: Supabase (tavalvqcebosfxamuvlx.supabase.co)
**Storage Mode**: dual-write (localStorage + Supabase)
**Tables Used**:
- `player_profiles`
- `choice_history`
- `visited_scenes`
- `skill_demonstrations`
- `player_patterns`
- `relationship_progress`
- `skill_milestones`
- `career_explorations`
- `player_behavioral_profiles`

**Analysis Scripts**:
- `/Users/abdusmuwwakkil/Development/30_lux-story/check-supabase-data.mjs` - Overview of all users
- `/Users/abdusmuwwakkil/Development/30_lux-story/get-user-details.mjs <user_id>` - Detailed user analysis

---

## Quick Reference

### Primary Test User
```
User ID: test_low_active_healthy
Choices: 10
Scenes: 5
Relationships: 2 (Maya: 3, Devon: 2)
Patterns: 1 (Helping: 0.7)
Milestones: 1
Last Active: October 1, 2025
```

### To View Full Details
```bash
node get-user-details.mjs test_low_active_healthy
```

---

**Analysis Complete** ✅
