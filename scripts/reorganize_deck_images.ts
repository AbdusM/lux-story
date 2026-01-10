
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = '/Users/abdusmuwwakkil/Development/30_lux-story/docs/00_DECK/images';
const ARCHIVE_DIR = path.join(IMAGES_DIR, 'archive');

// Ensure archive directory exists
if (!fs.existsSync(ARCHIVE_DIR)) {
    fs.mkdirSync(ARCHIVE_DIR);
}

const RENAMES: { [key: string]: string } = {
    "Slide_02_Problem_Hiring_vs_Training.jpeg": "Slide_02_Experience_Gap.jpeg",
    "Slide_03_Insight_Time_Compression.jpeg": "Slide_03_Pattern_Recognition.jpeg",
    "Slide_07_Crowdsourcing_Flywheel.jpeg": "Slide_07_Data_Flywheel.jpeg",
    "Slide_14_Pattern_Inference_Pentagon.jpeg": "Slide_14_Five_Patterns.jpeg",
    "Slide_16_Pattern_Voices_Dual_UI.jpeg": "Slide_15_Identity_Reflected.jpeg",
    "Slide_17_Predictive_Engine_Comparison.jpeg": "Slide_16_Trajectory.jpeg",
    "Slide_23_New_13_Career_Pathways_Grid.jpeg": "Slide_22_Career_Pathways.jpeg",
    "Slide_23_Cognitive_Domain_Assessment.jpeg": "Slide_23_Cognitive_Domains.jpeg",
    "Slide_25_Evidence_Thresholds.jpeg": "Slide_24_Evidence_Thresholds.jpeg",
    "Slide_26_Interrupt_System_Timeline.jpeg": "Slide_25_Interrupt_System.jpeg",
    "Slide_28_Trust_Gated_Depth_Funnel.jpeg": "Slide_26_Trust_Depth.jpeg",
    "Slide_31_Identity_Offering_The_Climax.jpeg": "Slide_27_Identity_Synthesis.jpeg",
    "Slide_32_Badge_Ceremony_Level_Up.jpeg": "Slide_28_Multi_Sensory.jpeg",
    "Slide_35_Shift_Left_Design_Timeline.jpeg": "Slide_31_Instant_Immersion.jpeg",
    "Slide_36_Scarcity_Mode_Time_Energy.jpeg": "Slide_32_Scarcity.jpeg",
    "Slide_38_Scientific_Foundation_Pillars.jpeg": "Slide_34_Science_Foundation.jpeg",
    "Slide_34_Competitive_Position_2x2.jpeg": "Slide_35_Competitive.jpeg",
    "Slide_35_Trojan_Horse_Philosophy.jpeg": "Slide_36_Hidden_Assessment.jpeg",
    "Slide_37_Completion_Rate_Comparison.jpeg": "Slide_38_Engagement_Gap.jpeg",
    "Slide_38_Go_to_Market_Phases.jpeg": "Slide_39_GTM.jpeg",
    "Slide_40_Why_This_Combination_Venn.jpeg": "Slide_40_Team.jpeg",
    "Slide_47_The_Ask_Financial_Pie.jpeg": "Slide_42_The_Ask.jpeg"
};

const TO_ARCHIVE = [
    "Slide_06_Mind_Thought_Cabinet.jpeg",
    "Slide_14_Harmonics_Resonance_Field.jpeg",
    "Slide_23_Cognition_Radar_Chart.jpeg",
    "Slide_24_Birmingham_First_Ecosystem_Map.jpeg",
    "Slide_29_Six_Interrupt_Types.jpeg",
    "Slide_27_Mastery_Crown_Progression.jpeg",
    "Slide_31_Essence_Sigil_Identity.jpeg",
    "Slide_34_Toolkit_Inventory.jpeg",
    "Slide_15_Five_Behavioral_Patterns.jpeg",
    "Slide_24_New_Birmingham_Map.jpeg"
];

function reorganize() {
    console.log("Starting reorganization...");

    // 1. Perform Renames
    for (const [source, target] of Object.entries(RENAMES)) {
        const sourcePath = path.join(IMAGES_DIR, source);
        const targetPath = path.join(IMAGES_DIR, target);

        if (fs.existsSync(sourcePath)) {
            console.log(`Renaming: ${source} -> ${target}`);
            fs.renameSync(sourcePath, targetPath);
        } else {
            console.warn(`Source not found for rename: ${source}`);
        }
    }

    // 2. Perform Archives
    for (const filename of TO_ARCHIVE) {
        const sourcePath = path.join(IMAGES_DIR, filename);
        const targetPath = path.join(ARCHIVE_DIR, filename);

        if (fs.existsSync(sourcePath)) {
            console.log(`Archiving: ${filename}`);
            fs.renameSync(sourcePath, targetPath);
        } else {
            console.warn(`Source not found for archive: ${filename}`);
        }
    }

    console.log("Reorganization complete.");
}

reorganize();
