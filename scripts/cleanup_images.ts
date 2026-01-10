
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = '/Users/abdusmuwwakkil/Development/30_lux-story/docs/00_DECK/images';

// Batch Definitions
// Batch 2: ~6:40 - 6:45
const BATCH_2_MAPPING = [
    "Slide_10_In_Game_Interface_Hero_Shot",        // 6:40 PM
    "Slide_32_Badge_Ceremony_Level_Up",            // 6:41 PM
    "Slide_31_Identity_Offering_The_Climax",       // 6:42 PM
    "Slide_36_Scarcity_Mode_Time_Energy",          // 6:43 PM
    "Slide_24_Birmingham_First_Ecosystem_Map",     // 6:44 PM
    "Slide_37_Accessibility_Cognitive_Load"        // Missing?
];

// Batch 3: ~6:49 - 6:55
const BATCH_3_MAPPING = [
    "Slide_14_Harmonics_Resonance_Field",          // 6:49 PM
    "Slide_31_Essence_Sigil_Identity",             // 6:50 PM
    "Slide_27_Mastery_Crown_Progression",          // 6:51 PM
    "Slide_06_Mind_Thought_Cabinet",               // 6:51 PM (1)
    "Slide_34_Toolkit_Inventory",                  // 6:52 PM
    "Slide_05_Simulations_Archive",                // 6:53 PM
    "Slide_23_Cognition_Radar_Chart",              // 6:54 PM
    "Slide_13_Analysis_Narrative_Graph"            // Missing
];

function getTimestampAndSuffix(filename: string) {
    const regex = /Generated Image January 09, 2026 - (\d{1,2})_(\d{2})(AM|PM)( \(\d+\))?\.jpeg/;
    const match = filename.match(regex);

    if (!match) return null;

    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const meridiem = match[3];
    const suffix = match[4] ? parseInt(match[4].replace(/[() ]/g, '')) : 0;

    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;

    return {
        filename,
        time: hour * 60 + minute,
        suffix
    };
}

async function cleanupImages() {
    const files = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith("Generated Image"));

    const parsedFiles = files.map(getTimestampAndSuffix).filter(f => f !== null) as { filename: string, time: number, suffix: number }[];

    // Sort by time, then by suffix to ensure alignment with arrays
    parsedFiles.sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        return a.suffix - b.suffix;
    });

    // Split into batches based on time
    const batch2Files = parsedFiles.filter(f => f.time >= (18 * 60 + 38) && f.time <= (18 * 60 + 47)); // ~6:38 - 6:47
    const batch3Files = parsedFiles.filter(f => f.time >= (18 * 60 + 48)); // > 6:48

    console.log(`Cleanup: Found ${batch2Files.length} files in Batch 2 window.`);
    console.log(`Cleanup: Found ${batch3Files.length} files in Batch 3 window.`);

    // Process Batch 2
    processBatch(batch2Files, BATCH_2_MAPPING, "Batch 2");

    // Process Batch 3
    processBatch(batch3Files, BATCH_3_MAPPING, "Batch 3");
}

function processBatch(files: { filename: string }[], mapping: string[], batchName: string) {
    for (let i = 0; i < files.length; i++) {
        if (i >= mapping.length) {
            console.warn(`[${batchName}] No mapping for file ${files[i].filename} (Index ${i})`);
            continue;
        }

        const sourcePath = path.join(IMAGES_DIR, files[i].filename);
        const targetFilename = `${mapping[i]}.jpeg`;
        const targetPath = path.join(IMAGES_DIR, targetFilename);

        if (fs.existsSync(targetPath)) {
            // Target already exists. Since source is a "Generated Image", it's likely a duplicate or unprocessed original.
            // We should remove the source to clean up.
            console.log(`[${batchName}] Duplicate found. Target ${targetFilename} exists. Removing source ${files[i].filename}.`);
            fs.unlinkSync(sourcePath);
        } else {
            // Target doesn't exist, rename source to target.
            console.log(`[${batchName}] Renaming ${files[i].filename} -> ${targetFilename}`);
            fs.renameSync(sourcePath, targetPath);
        }
    }
}

cleanupImages();
