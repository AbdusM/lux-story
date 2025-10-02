/**
 * Get detailed information about a specific user
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, serviceKey);

const userId = process.argv[2] || 'test_critical_9day_stuck';

async function getUserDetails() {
  console.log(`\n📊 DETAILED USER ANALYSIS: ${userId}\n`);
  console.log('='.repeat(70));

  // Profile
  const { data: profile } = await supabase
    .from('player_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!profile) {
    console.log('❌ User not found');
    return;
  }

  console.log('\n📋 PROFILE');
  console.log(`Current Scene: ${profile.current_scene}`);
  console.log(`Total Demonstrations: ${profile.total_demonstrations}`);
  console.log(`Last Active: ${profile.last_activity}`);

  // Choice history
  const { data: choices } = await supabase
    .from('choice_history')
    .select('*')
    .eq('player_id', userId)
    .order('chosen_at', { ascending: false });

  console.log(`\n🎯 CHOICES (${choices?.length || 0})`);
  if (choices && choices.length > 0) {
    choices.slice(0, 10).forEach((choice, i) => {
      console.log(`  ${i + 1}. ${choice.choice_text}`);
      console.log(`     Scene: ${choice.scene_id}, Chosen: ${choice.chosen_at}`);
    });
    if (choices.length > 10) {
      console.log(`  ... and ${choices.length - 10} more`);
    }
  }

  // Visited scenes
  const { data: scenes } = await supabase
    .from('visited_scenes')
    .select('*')
    .eq('player_id', userId)
    .order('visited_at', { ascending: false });

  console.log(`\n🗺️  VISITED SCENES (${scenes?.length || 0})`);
  if (scenes && scenes.length > 0) {
    scenes.forEach((scene, i) => {
      console.log(`  ${i + 1}. ${scene.scene_id} (visited: ${scene.visited_at})`);
    });
  }

  // Skill demonstrations
  const { data: skills } = await supabase
    .from('skill_demonstrations')
    .select('*')
    .eq('user_id', userId);

  console.log(`\n🎓 SKILL DEMONSTRATIONS (${skills?.length || 0})`);
  if (skills && skills.length > 0) {
    skills.forEach((skill, i) => {
      console.log(`  ${i + 1}. ${skill.skill_name}`);
      console.log(`     Scene: ${skill.scene_id}, Choice: ${skill.choice_text}`);
    });
  } else {
    console.log('  (None recorded)');
  }

  // Player patterns
  const { data: patterns } = await supabase
    .from('player_patterns')
    .select('*')
    .eq('player_id', userId);

  console.log(`\n📈 PLAYER PATTERNS (${patterns?.length || 0})`);
  if (patterns && patterns.length > 0) {
    patterns.forEach((pattern) => {
      console.log(`  ${pattern.pattern_name}: ${pattern.pattern_value} (${pattern.demonstration_count} demonstrations)`);
    });
  } else {
    console.log('  (None recorded)');
  }

  // Behavioral profile
  const { data: behavioral } = await supabase
    .from('player_behavioral_profiles')
    .select('*')
    .eq('player_id', userId)
    .single();

  console.log(`\n🧠 BEHAVIORAL PROFILE`);
  if (behavioral) {
    console.log(`  Response Speed: ${behavioral.response_speed || 'N/A'}`);
    console.log(`  Stress Response: ${behavioral.stress_response || 'N/A'}`);
    console.log(`  Social Orientation: ${behavioral.social_orientation || 'N/A'}`);
    console.log(`  Problem Approach: ${behavioral.problem_approach || 'N/A'}`);
    console.log(`  Communication Style: ${behavioral.communication_style || 'N/A'}`);
    console.log(`  Cultural Alignment: ${behavioral.cultural_alignment || 'N/A'}`);
    console.log(`  Total Choices: ${behavioral.total_choices || 0}`);
    console.log(`  Avg Response Time: ${behavioral.avg_response_time_ms || 0}ms`);
    if (behavioral.summary_text) {
      console.log(`  Summary: ${behavioral.summary_text}`);
    }
  } else {
    console.log('  (No behavioral profile)');
  }

  // Career explorations
  const { data: careers } = await supabase
    .from('career_explorations')
    .select('*')
    .eq('user_id', userId);

  console.log(`\n💼 CAREER EXPLORATIONS (${careers?.length || 0})`);
  if (careers && careers.length > 0) {
    careers.forEach((career) => {
      console.log(`  ${career.career_name}: ${Math.round(career.match_score * 100)}% match (${career.readiness_level})`);
    });
  } else {
    console.log('  (None recorded)');
  }

  // Relationship progress
  const { data: relationships } = await supabase
    .from('relationship_progress')
    .select('*')
    .eq('user_id', userId);

  console.log(`\n👥 CHARACTER RELATIONSHIPS (${relationships?.length || 0})`);
  if (relationships && relationships.length > 0) {
    relationships.forEach((rel) => {
      console.log(`  ${rel.character_name}: Trust ${rel.trust_level}`);
      console.log(`    Last interaction: ${rel.last_interaction}`);
    });
  } else {
    console.log('  (None recorded)');
  }

  // Milestones
  const { data: milestones } = await supabase
    .from('skill_milestones')
    .select('*')
    .eq('player_id', userId)
    .order('reached_at', { ascending: false });

  console.log(`\n🏆 MILESTONES (${milestones?.length || 0})`);
  if (milestones && milestones.length > 0) {
    milestones.forEach((milestone, i) => {
      console.log(`  ${i + 1}. ${milestone.milestone_type}${milestone.milestone_context ? ` (${milestone.milestone_context})` : ''}`);
      console.log(`     Reached: ${milestone.reached_at}`);
    });
  } else {
    console.log('  (None recorded)');
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n✅ ADMIN DASHBOARD SUITABILITY');

  const hasChoices = (choices?.length || 0) >= 3;
  const hasScenes = (scenes?.length || 0) >= 2;
  const hasCareerData = (careers?.length || 0) > 0;
  const hasRelationships = (relationships?.length || 0) > 0;

  console.log(`  Minimum choices (3+): ${hasChoices ? '✅' : '❌'} (${choices?.length || 0})`);
  console.log(`  Minimum scenes (2+): ${hasScenes ? '✅' : '❌'} (${scenes?.length || 0})`);
  console.log(`  Career explorations: ${hasCareerData ? '✅' : '⚠️ '} (${careers?.length || 0})`);
  console.log(`  Character relationships: ${hasRelationships ? '✅' : '⚠️ '} (${relationships?.length || 0})`);

  const suitable = hasChoices && hasScenes;
  console.log(`\n  Overall: ${suitable ? '✅ SUITABLE' : '❌ NOT SUITABLE'}`);

  if (suitable) {
    console.log(`\n🎉 This user has enough data for admin dashboard testing!`);
    console.log(`\n📋 Use this command to test admin dashboard:`);
    console.log(`   User ID: ${userId}`);
  } else {
    console.log(`\n⚠️  This user needs more gameplay data.`);
  }

  console.log('');
}

getUserDetails();
