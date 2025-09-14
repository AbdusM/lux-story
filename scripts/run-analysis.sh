#!/bin/bash

# Complete Gemini Cognitive Analysis Workflow
# Handles video compression and analysis automatically

VIDEO_PATH="${1:-/Users/abdusmuwwakkil/Documents/testrun01.mov}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "🎯 Gemini 2.5 Pro Cognitive Analysis Workflow"
echo "=============================================="
echo "📹 Video: $VIDEO_PATH"

# Check if video exists
if [ ! -f "$VIDEO_PATH" ]; then
    echo "❌ Video file not found: $VIDEO_PATH"
    exit 1
fi

# Get file size in MB
FILE_SIZE_MB=$(du -m "$VIDEO_PATH" | cut -f1)
echo "📊 File size: ${FILE_SIZE_MB} MB"

# Check if file needs compression
if [ "$FILE_SIZE_MB" -gt 20 ]; then
    echo "⚠️  File too large for Gemini API (>20MB)"
    echo "🔧 Compression options:"
    echo ""
    echo "1. Install FFmpeg and use our compression script:"
    echo "   brew install ffmpeg"
    echo "   node scripts/compress-video.js \"$VIDEO_PATH\""
    echo ""
    echo "2. Use online compression tools:"
    echo "   - https://www.freeconvert.com/video-compressor"
    echo "   - https://www.media.io/compress-video.html"
    echo ""
    echo "3. Use QuickTime Player (macOS):"
    echo "   File > Export As... > 480p (reduces file size significantly)"
    echo ""
    echo "💡 Aim for under 18MB for reliable API processing"
    exit 1
fi

echo "✅ File size acceptable for Gemini API"

# Check if API key is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "❌ GEMINI_API_KEY environment variable not set"
    echo "💡 Get your API key from: https://makersuite.google.com/app/apikey"
    echo "💡 Then run: export GEMINI_API_KEY=\"your_api_key_here\""
    exit 1
fi

echo "✅ API key configured"
echo ""
echo "🤖 Starting cognitive behavioral analysis..."

# Run the analysis
cd "$SCRIPT_DIR/.."
node scripts/gemini-cognitive-analysis.js "$VIDEO_PATH"

echo ""
echo "🎉 Analysis workflow complete!"
echo "📄 Check the generated markdown file for detailed results"