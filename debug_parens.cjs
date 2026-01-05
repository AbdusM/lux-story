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

// If balance > 0, find the block where it went positive and stayed positive
balance = 0;
// We know up to lastZero it was balanced.
// Let's print balance per line starting from lastZero
console.log('--- Divergence Trace ---');
for (let i = Math.max(0, lastZero - 5); i < Math.min(lines.length, lastZero + 20); i++) {
    const line = lines[i];
    let delta = 0;
    for (const char of line) {
        if (char === '(') delta++;
        if (char === ')') delta--;
    }
    balance += delta;
    console.log(`Line ${i + 1} [Delta ${delta}]: Balance ${balance} || ${line.substring(0, 50)}...`);
}
