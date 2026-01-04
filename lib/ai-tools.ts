import { PatternType } from './patterns'

export interface AITool {
    id: string
    name: string
    category: ToolCategory
    description: string
    realWorldUse: string
    luxParallel: string
    requiredPattern: PatternType
    requiredLevel: 3 | 6 | 9
    // The Reality Bridge: A tangible artifact for the player to use
    goldenPrompt?: {
        title: string
        content: string
        usageContext: string
        requiredFlag?: string // ISP: Unlocked via Simulation
    }
}

export type ToolCategory =
    | 'coding'
    | 'writing'
    | 'image'
    | 'video'
    | 'design'
    | 'data'
    | 'productivity'
    | 'marketing'
    | 'research'
    | 'audio'

export const AI_TOOLS: AITool[] = [
    // --- CODING (Building) ---
    {
        id: 'github-copilot',
        name: 'GitHub Copilot',
        category: 'coding',
        description: 'AI coding assistant providing real-time code suggestions and chat-based assistance.',
        realWorldUse: 'Accelerates coding tasks by ~55%; industry standard for AI-assisted dev.',
        luxParallel: 'Neural Interface Auto-Completion',
        requiredPattern: 'building',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Context Primer',
            content: '// q: implementing [complex algorithm] using state pattern\\n// context: heavily typed environment, prefer functional composition\\n// constraint: optimized for memory usage\\n// gen:',
            usageContext: 'Paste this comment block before writing complex functions to force Copilot to align with your architectural constraints.'
        }
    },
    {
        id: 'cursor',
        name: 'Cursor',
        category: 'coding',
        description: 'AI-native IDE with repository-wide context understanding.',
        realWorldUse: 'Codebase-aware editing; enables "vibe coding" from natural language.',
        luxParallel: 'Holographic Architect Suite',
        requiredPattern: 'building',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The System Architect',
            content: 'You are a Senior Architect. Review the file @[file] for SOLID violations. Propose a refactor that isolates the [side-effect] logic into a separate service. Do not write code yet, just the plan.',
            usageContext: 'Use in Cursor Chat (Cmd+L) to plan refactors before executing them.',
            requiredFlag: 'golden_prompt_cursor'
        }
    },

    // --- PRODUCTIVITY (Building/Systemizing) ---
    {
        id: 'zapier-ai',
        name: 'Zapier AI',
        category: 'productivity',
        description: 'Automation orchestration layer connecting apps.',
        realWorldUse: 'Connecting AI to real-world workflows without code.',
        luxParallel: 'Workflow Neural Link',
        requiredPattern: 'building',
        requiredLevel: 9,
        goldenPrompt: {
            title: 'The Autonomous Agent',
            content: 'Trigger: New Typeform Entry. Action 1: Send to ChatGPT (classify sentiment). Action 2: If "Negative", add to Jira "Urgent Bugs". Action 3: Slack alert to Engineering.',
            usageContext: 'Logic flow for building a self-healing customer feedback loop.'
        }
    },
    {
        id: 'microsoft-365-copilot',
        name: 'M365 Copilot',
        category: 'productivity',
        description: 'AI integrated into Word, Excel, Teams, Outlook.',
        realWorldUse: 'Meeting summaries, email drafting, document synthesis.',
        luxParallel: 'Office Neural Network',
        requiredPattern: 'analytical',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Meeting Synthesizer',
            content: 'Summarize this meeting into: 1. Key Decisions Made. 2. Action Items (assignee + deadline). 3. Open Controversy. Draft a follow-up email based on this.',
            usageContext: 'Use in Teams recap to instantly generate post-meeting documentation.'
        }
    },

    // --- DATA & RESEARCH (Analytical) ---
    {
        id: 'perplexity',
        name: 'Perplexity',
        category: 'research',
        description: 'Conversational search engine with real-time citations.',
        realWorldUse: 'Deep discovery, fact-checking, academic research.',
        luxParallel: 'Global Knowledge Index',
        requiredPattern: 'exploring',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Fact Audit',
            content: 'Research the history of [Topic]. For every claim, provide a direct citation to a primary source (no blogs/news aggregators). Highlight any conflicting consensus.',
            usageContext: 'Use for rigorous fact-checking before publishing content.',
            requiredFlag: 'golden_prompt_deep_search'
        }
    },
    {
        id: 'julius-ai',
        name: 'Julius AI',
        category: 'data',
        description: 'AI data analyst for natural language queries and visualization.',
        realWorldUse: 'Democratizes data analysis; no SQL/Python needed for insights.',
        luxParallel: 'Conversational Data Stream',
        requiredPattern: 'analytical',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Insight Extractor',
            content: 'Analyze this dataset for outliers in [Column X] relative to [Column Y]. Visualize the correlation as a scatter plot and highlight the top 3 anomalies.',
            usageContext: 'Upload a CSV to Julius and use this to instantly find actionable data points.'
        }
    },
    {
        id: 'power-bi',
        name: 'Microsoft Power BI',
        category: 'data',
        description: 'Business intelligence platform with AI-powered report generation.',
        realWorldUse: 'Generate reports from natural language; automate DAX formula creation.',
        luxParallel: 'Pattern Recognition Scanner',
        requiredPattern: 'analytical',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The DAX Generator',
            content: 'Create a DAX measure to calculate [Metric] year-over-year growth, handling cases where the previous year is zero or null. Explain the logic.',
            usageContext: 'Use in Power BI Copilot to generate complex financial formulas without syntax errors.'
        }
    },

    // --- WRITING & EXPLORING (Exploring) ---
    {
        id: 'notebooklm',
        name: 'NotebookLM',
        category: 'research',
        description: 'Grounded AI assistant for your own documents.',
        realWorldUse: 'Study guides, audio overviews, sourcing from user data.',
        luxParallel: 'Personal Archive Synthesis',
        requiredPattern: 'patience',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Audio Briefing',
            content: 'Upload [Q3 Financial Report PDF]. Generate an Audio Overview focusing specifically on "Risks" and "Opportunity" sections.',
            usageContext: 'Turn a dry 50-page PDF into an engaging 5-minute podcast for your commute.',
            requiredFlag: 'golden_prompt_notebooklm'
        }
    },
    {
        id: 'claude',
        name: 'Claude',
        category: 'writing',
        description: 'AI specialized in long-form, nuanced context and reasoning.',
        realWorldUse: 'Complex analysis, legal/technical writing, large context windows.',
        luxParallel: 'Deep Context Weaver',
        requiredPattern: 'patience',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Style Mimic',
            content: 'Here are 3 samples of my writing [Paste 3 Samples]. Analyze my tone, sentence structure, and vocabulary. Then write a blog post about [Topic] adhering strictly to this style.',
            usageContext: 'Use Claude Project artifacts to maintain personal brand voice perfectly.'
        }
    },
    {
        id: 'runway',
        name: 'Runway',
        category: 'video',
        description: 'AI video generation and transformation suite.',
        realWorldUse: 'Text-to-video, sophisticated editing, style transfer.',
        luxParallel: 'Temporal Flow Manipulator',
        requiredPattern: 'building',
        requiredLevel: 9,
        goldenPrompt: {
            title: 'The Motion Brush',
            content: 'Select the [Subject]. Apply horizontal motion (speed 5). Keep the background static. Ambient fog movement.',
            usageContext: 'Use in Runway Gen-2 Motion Brush to animate specific parts of a static image.'
        }
    },

    // --- COMMUNICATION (Helping) ---
    {
        id: 'chatgpt',
        name: 'ChatGPT (GPT-4o)',
        category: 'writing',
        description: 'General-purpose AI assistant for writing, coding, and analysis.',
        realWorldUse: 'Foundational AI literacy; everyday co-pilot.',
        luxParallel: 'Universal Omni-Assistant',
        requiredPattern: 'exploring',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Socratic Tutor',
            content: 'Explain [Complex Topic] to me. After your explanation, ask me a question to test my understanding. Do not move on until I answer correctly.',
            usageContext: 'Use to learn new concepts deeply rather than passively receiving summaries.'
        }
    },
    {
        id: 'descript',
        name: 'Descript',
        category: 'audio',
        description: 'Text-based audio/video editing.',
        realWorldUse: 'Edit media by editing text; remove filler words instantly.',
        luxParallel: 'Reality Transcript Editor',
        requiredPattern: 'building',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Studio Sound',
            content: 'Apply "Studio Sound" effect at 85% intensity. Remove all "um" and "uh" pauses > 0.5s. Export 44.1kHz WAV.',
            usageContext: 'Standard operating procedure for cleaning up noisy Zoom recordings instantly.'
        }
    },
    {
        id: 'synthesia',
        name: 'Synthesia',
        category: 'video',
        description: 'AI avatar video generation for training and comms.',
        realWorldUse: 'Rapid video production without cameras/actors.',
        luxParallel: 'Holographic Presenter',
        requiredPattern: 'helping',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Micro-Lesson',
            content: 'Script format: 1. Hook (5s). 2. Problem (10s). 3. Solution (20s). 5. CTA (5s). Keep sentences under 12 words for natural avatar pacing.',
            usageContext: 'Structure for Synthesia scripts to avoid "uncanny valley" pauses.'
        }
    },
    {
        id: 'hubspot-breeze',
        name: 'HubSpot Breeze',
        category: 'marketing',
        description: 'AI agents embedded in CRM for sales and service.',
        realWorldUse: 'Content creation, lead qualification, customer agents.',
        luxParallel: 'Relationship Algorithm',
        requiredPattern: 'helping',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Lead Scorer',
            content: 'Analyze the last 5 emails from this prospect. Score intent from 1-10 based on keywords [Pricing, Timeline, Decision Maker]. Draft a response addressing their specific blockers.',
            usageContext: 'Use in CRM to prioritize sales outreach based on actual signal.',
            requiredFlag: 'golden_prompt_workflow'
        }
    },
    {
        id: 'elevenlabs',
        name: 'ElevenLabs',
        category: 'audio',
        description: 'Ultra-realistic AI speech synthesis and voice cloning.',
        realWorldUse: 'Audiobooks, content creation, dubbing in 32+ languages.',
        luxParallel: 'Harmonic Voice Resynthesizer',
        requiredPattern: 'helping',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Emotional Narrator',
            content: 'Settings: Stability 40%, Clarity 80%, Style Exaggeration 15%. "Read this passage with a tone of [Emotion], pausing slightly after [Keyword] for emphasis."',
            usageContext: 'Configuration for ElevenLabs to produce natural, non-robotic storytelling narration.',
            requiredFlag: 'golden_prompt_voice'
        }
    },

    // --- CREATIVE PATIENCE (Patience) ---
    {
        id: 'midjourney',
        name: 'Midjourney',
        category: 'image',
        description: 'Generates highly highly stylized, artistic images from text.',
        realWorldUse: 'Concept art, brand storytelling, high-fidelity aesthetic visuals.',
        luxParallel: 'Dream Synthesizer v7',
        requiredPattern: 'building',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Cinematic Shot',
            content: '/imagine prompt: [Subject] inside a [Location], cinematic lighting, volumetric fog, shot on 35mm, f/1.8, hyperrealistic, --ar 16:9 --v 6.0 --style raw',
            usageContext: 'Discord command for generating photorealistic movie-still quality images.',
            requiredFlag: 'golden_prompt_midjourney'
        }
    },
    {
        id: 'adobe-firefly',
        name: 'Adobe Firefly',
        category: 'design',
        description: 'Commercially safe AI generation in Creative Cloud.',
        realWorldUse: 'Generative fill, vector creation, copyright-safe visuals.',
        luxParallel: 'Pro-Grade Visual Synthesis',
        requiredPattern: 'building',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Generative Extend',
            content: 'Select the empty canvas edge. Prompt: "Seamlessly extend the forest background, adding soft bokeh lighting matches source."',
            usageContext: 'Fix aspect ratio issues (e.g., turning a 4:3 shot into 16:9) without cropping.'
        }
    },
    {
        id: 'canva-ai',
        name: 'Canva AI',
        category: 'design',
        description: 'Democratized design with Magic Studio.',
        realWorldUse: 'Marketing materials for non-designers.',
        luxParallel: 'Aesthetic Auto-Formatter',
        requiredPattern: 'building',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Magic Resize',
            content: 'Take this "Slide Deck" design. Use Magic Switch to transform it into a "Doc Information Sheet". Translate text to Spanish.',
            usageContext: 'Repurpose presentation content into handouts instantly.'
        }
    },
    {
        id: 'dall-e-3',
        name: 'DALL-E 3',
        category: 'image',
        description: 'ChatGPT-integrated image generation with high prompt fidelity.',
        realWorldUse: 'Commercial visualizations, precise text rendering in images.',
        luxParallel: 'Literal Visualizer',
        requiredPattern: 'analytical',
        requiredLevel: 3,
        goldenPrompt: {
            title: 'The Brand Asset',
            content: 'Create a flat vector illustration of [Concept] using brand colors #[Hex1] and #[Hex2]. minimalist style, white background, suitable for a tech website hero section.',
            usageContext: 'Use in ChatGPT to generate seamless web assets matched to your brand guide.'
        }
    },
    {
        id: 'jasper',
        name: 'Jasper',
        category: 'marketing',
        description: 'Enterprise content marketing platform.',
        realWorldUse: 'SEO blog posts, brand voice consistency, campaigns.',
        luxParallel: 'Brand Resonance Field',
        requiredPattern: 'exploring',
        requiredLevel: 6,
        goldenPrompt: {
            title: 'The Campaign remix',
            content: 'Take this [Blog Post URL]. Remix it into: 1. A LinkedIn Thread (professional). 2. A Twitter Thread (punchy). 3. An Instagram Caption (visual). Maintain Brand Voice: "Witty Authority".',
            usageContext: 'Turn one asset into a multi-channel campaign instantly.'
        }
    }
]
