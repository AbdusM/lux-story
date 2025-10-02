/**
 * Check Supabase for existing player data
 */
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function checkSupabaseData() {
  console.log('🔍 Checking Supabase for player data...\n');

  try {
    // Check player_profiles table (without ordering first)
    const { data: profiles, error: profilesError } = await supabase
      .from('player_profiles')
      .select('*')
      .limit(10);

    if (profilesError) {
      console.log('❌ Error fetching player profiles:', profilesError.message);
    } else {
      console.log(`📊 Found ${profiles?.length || 0} player profiles`);

      if (profiles && profiles.length > 0) {
        console.log('\n=== TOP 10 PLAYERS BY ACTIVITY ===\n');

        for (const profile of profiles) {
          console.log(`Player ID: ${profile.user_id}`);
          console.log(`  Current Scene: ${profile.current_scene || 'N/A'}`);
          console.log(`  Total Demonstrations: ${profile.total_demonstrations || 0}`);
          console.log(`  Last Active: ${profile.last_active_at || profile.last_activity || 'N/A'}`);

          // Get choice history for this player
          const { data: choices } = await supabase
            .from('choice_history')
            .select('*')
            .eq('player_id', profile.user_id);

          const choiceCount = choices?.length || 0;

          // Get skill demonstrations
          const { data: skills } = await supabase
            .from('skill_demonstrations')
            .select('*')
            .eq('user_id', profile.user_id);

          const skillCount = skills?.length || 0;

          // Get visited scenes
          const { data: scenes } = await supabase
            .from('visited_scenes')
            .select('*')
            .eq('player_id', profile.user_id);

          const sceneCount = scenes?.length || 0;

          console.log(`  Choices Made: ${choiceCount}`);
          console.log(`  Skill Demonstrations: ${skillCount}`);
          console.log(`  Scenes Visited: ${sceneCount}`);

          // Calculate richness score
          const score = choiceCount * 2 + skillCount * 3 + sceneCount * 1;
          console.log(`  💯 Richness Score: ${score}`);

          // Admin dashboard suitability
          const suitable = choiceCount >= 5 && skillCount >= 3 && sceneCount >= 3;
          console.log(`  ✅ Admin Dashboard Suitable: ${suitable ? 'YES' : 'NO'}`);

          console.log('');
        }

        // Find the richest user
        const richestUser = profiles[0];
        console.log('=== RICHEST USER FOR ADMIN DASHBOARD ===');
        console.log(`User ID: ${richestUser.user_id}`);
        console.log('\nUse this ID for admin dashboard testing.');
      } else {
        console.log('\n⚠️  No player profiles found in Supabase.');
        console.log('   You may need to play through the game to generate test data.');
      }
    }

    // Check for test users specifically
    console.log('\n=== CHECKING FOR TEST USERS ===');
    const testUserIds = [
      'test_critical_9day_stuck',
      'test_high_4day_confused',
      'test_low_active_healthy'
    ];

    for (const userId of testUserIds) {
      const { data: profile } = await supabase
        .from('player_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (profile) {
        console.log(`✅ Found test user: ${userId}`);
      } else {
        console.log(`❌ Missing test user: ${userId}`);
      }
    }

  } catch (error) {
    console.error('Error checking Supabase data:', error);
  }
}

checkSupabaseData();
