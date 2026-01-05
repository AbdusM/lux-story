/**
 * Experience Content Initialization
 * 
 * Imports experience content files to register them with the ExperienceEngine.
 * This must be imported AFTER the ExperienceEngine is fully loaded to avoid
 * circular dependency ReferenceErrors (accessing registry before initialization).
 */

import '@/content/maya-loyalty'
// import '@/content/devon-loyalty' // Uncomment when ready/if exists
