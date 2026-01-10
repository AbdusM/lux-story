
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = '/Users/abdusmuwwakkil/Development/30_lux-story/docs/00_DECK/images';

// The new batch mapping provided by the user (10 items)
// We have 9 newly generated files (from 6:56 PM onwards), so the last one is likely missing.
const FINAL_BATCH_MAPPING = [
    "Slide_01_Title_Grand_Central_Terminus",       // 6:56 PM
    "Slide_02_Problem_Hiring_vs_Training",         // 6:57 PM
    "Slide_03_Insight_Time_Compression",           // 6:58 PM
    "Slide_18_Seven_Derivative_Modules",           // 6:59 PM
    "Slide_20_Future_of_Work_Skills",              // 7:00 PM
    "Slide_29_Six_Interrupt_Types",                // 7:01 PM
    "Slide_35_Shift_Left_Design_Timeline",         // 7:03 PM
    "Slide_38_Scientific_Foundation_Pillars",      // 7:04 PM
    "Slide_47_The_Ask_Financial_Pie",              // 7:05 PM
    "Slide_49_The_Opportunity_Convergence"         // 7:06 PM (Missing?)
];

function getTimestampAndSuffix(filename: string) {
    // Format: "Generated Image January 09, 2026 - 6_56PM.jpeg"

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

async function renameImages() {
    // Filter for files starting with "Generated Image"
    const files = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith("Generated Image"));

    const parsedFiles = files.map(getTimestampAndSuffix).filter(f => f !== null) as { filename: string, time: number, suffix: number }[];

    // FILTER: Only process images created at 6:56 PM or later 
    // 6:56 PM = 18 * 60 + 56 = 1136
    const NEW_BATCH_START_TIME = 18 * 60 + 56;
    const newBatch = parsedFiles.filter(f => f.time >= NEW_BATCH_START_TIME);

    // Sort by time, then by suffix
    newBatch.sort((a, b) => {
        if (a.time !== b.time) return a.time - b.time;
        return a.suffix - b.suffix;
    });

    console.log(`Found ${newBatch.length} new files (post 6:56 PM).`);

    for (let i = 0; i < newBatch.length; i++) {
        if (i >= FINAL_BATCH_MAPPING.length) {
            console.warn(`No mapping for file ${newBatch[i].filename} (Index ${i})`);
            continue;
        }

        const oldPath = path.join(IMAGES_DIR, newBatch[i].filename);
        const newFilename = `${FINAL_BATCH_MAPPING[i]}.jpeg`;
        const newPath = path.join(IMAGES_DIR, newFilename);

        console.log(`Renaming: ${newBatch[i].filename} -> ${newFilename}`);
        fs.renameSync(oldPath, newPath);
    }
}

renameImages();
