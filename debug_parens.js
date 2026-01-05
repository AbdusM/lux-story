const fs = require('fs');
const content = fs.readFileSync('components/StatefulGameInterface.tsx', 'utf8');

// Primitive comment stripper (not perfect but better than awk)
// Remove // comments
let clean = content.replace(/\/\/.*$/gm, ' ');
// Remove /* */ comments
clean = clean.replace(/\/\*[\s\S]*?\*\//g, ' ');

let balance = 0;
let lastZero = 0;
const lines = clean.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const char of line) {
        if (char === '(') balance++;
        if (char === ')') balance--;
    }
    if (balance === 0) lastZero = i + 1;
}

console.log('Final Balance:', balance);
console.log('Last Balanced Line:', lastZero);

// If balance > 0, find the line where it went from 0 to 1 and never came back
balance = 0;
let divertLine = 0;
for (let i = 0; i < lines.length; i++) {
    let lineStartBalance = balance;
    const line = lines[i];
    for (const char of line) {
        if (char === '(') balance++;
        if (char === ')') balance--;
    }
    // If we were at 0 (or less), and ended > 0, and never hit 0 again...
    // Actually simpler: The FIRST line after LastZero where balance > 0 is the start of the unclosed block.
}
console.log('Suspect Start Block:', lastZero + 1);
