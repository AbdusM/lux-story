/**
 * Semantic Similarity Detection
 *
 * Filters redundant choices using sentence embeddings and cosine similarity
 */

import { pipeline, env } from '@xenova/transformers';

// Disable local model loading for serverless environment
env.allowLocalModels = false;

// Feature flag to disable semantic similarity if needed
const ENABLE_SEMANTIC_SIMILARITY = process.env.ENABLE_SEMANTIC_SIMILARITY !== 'false';

// Cache the embeddings pipeline
let embeddingsPipeline: any = null;

/**
 * Initialize the sentence embeddings pipeline with error handling and timeout
 */
async function getEmbeddingsPipeline() {
  if (!embeddingsPipeline) {
    console.log('🧠 Initializing sentence embeddings pipeline...');

    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Pipeline initialization timeout')), 30000)
      );

      const pipelinePromise = pipeline(
        'feature-extraction',
        'Xenova/all-MiniLM-L6-v2',
        {
          revision: 'main',
          progress_callback: (progress: any) => {
            if (progress.status === 'downloading') {
              console.log(`📥 Downloading model: ${Math.round(progress.progress || 0)}%`);
            }
          }
        }
      );

      embeddingsPipeline = await Promise.race([pipelinePromise, timeoutPromise]);
      console.log('✅ Embeddings pipeline ready');

    } catch (error) {
      console.warn('⚠️ Failed to initialize embeddings pipeline:', error);
      // Set to a special "failed" marker so we don't keep retrying
      embeddingsPipeline = 'FAILED';
      throw error;
    }
  }

  if (embeddingsPipeline === 'FAILED') {
    throw new Error('Embeddings pipeline failed to initialize');
  }

  return embeddingsPipeline;
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * Generate embeddings for multiple texts in a single batch call (optimized)
 */
async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const pipeline = await getEmbeddingsPipeline();

  try {
    // Batch processing - single call for all texts
    const results = await pipeline(texts, { pooling: 'mean', normalize: true });

    // Convert tensor results to arrays
    if (results.length) {
      return results.map((result: any) => Array.from(result.data));
    } else {
      // Single result case
      return [Array.from(results.data)];
    }
  } catch (error) {
    console.warn('Batch embeddings failed, falling back to individual processing:', error);

    // Fallback to individual processing
    const embeddings: number[][] = [];
    for (const text of texts) {
      const result = await pipeline(text, { pooling: 'mean', normalize: true });
      embeddings.push(Array.from(result.data));
    }
    return embeddings;
  }
}

/**
 * Calculate semantic similarity between two choice texts
 */
export async function calculateSimilarity(choice1: string, choice2: string): Promise<number> {
  try {
    const embeddings = await getBatchEmbeddings([choice1, choice2]);
    return cosineSimilarity(embeddings[0], embeddings[1]);
  } catch (error) {
    console.error('Error calculating similarity:', error);

    // Fallback to simple string similarity if embeddings fail
    return simpleStringSimilarity(choice1, choice2);
  }
}

/**
 * Simple string similarity fallback using Jaccard similarity
 */
function simpleStringSimilarity(str1: string, str2: string): number {
  const set1 = new Set(str1.toLowerCase().split(/\s+/));
  const set2 = new Set(str2.toLowerCase().split(/\s+/));

  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  return intersection.size / union.size;
}

/**
 * Filter out redundant choices based on semantic similarity (optimized with batch processing)
 */
export async function filterSimilarChoices(
  choices: { text: string; [key: string]: any }[],
  threshold: number = 0.85
): Promise<{ text: string; [key: string]: any }[]> {
  if (choices.length <= 1) return choices;

  // Quick exit if semantic similarity is disabled
  if (!ENABLE_SEMANTIC_SIMILARITY) {
    console.log('📄 Semantic similarity disabled, using simple string filtering');
    return filterWithSimpleStringComparison(choices, threshold);
  }

  console.log(`🔍 Filtering ${choices.length} choices with threshold ${threshold}`);

  try {
    // Extract all choice texts for batch embedding generation
    const choiceTexts = choices.map(choice => choice.text);

    // Generate all embeddings in a single batch call
    console.log('📊 Generating embeddings for all choices...');
    const embeddings = await getBatchEmbeddings(choiceTexts);
    console.log('✅ All embeddings generated');

    const filtered: typeof choices = [];
    const filteredEmbeddings: number[][] = [];

    // Now compare using pre-computed embeddings
    for (let i = 0; i < choices.length; i++) {
      const candidate = choices[i];
      const candidateEmbedding = embeddings[i];
      let isSimilar = false;

      // Check against all already accepted choices
      for (let j = 0; j < filteredEmbeddings.length; j++) {
        const similarity = cosineSimilarity(candidateEmbedding, filteredEmbeddings[j]);

        if (similarity >= threshold) {
          console.log(`❌ Filtered similar choice: "${candidate.text}" (${similarity.toFixed(3)} similarity to "${filtered[j].text}")`);
          isSimilar = true;
          break;
        }
      }

      if (!isSimilar) {
        console.log(`✅ Accepted choice: "${candidate.text}"`);
        filtered.push(candidate);
        filteredEmbeddings.push(candidateEmbedding);
      }
    }

    console.log(`📊 Filtered ${choices.length - filtered.length} redundant choices, kept ${filtered.length}`);
    return filtered;

  } catch (error) {
    console.error('Batch filtering failed, falling back to simple string similarity:', error);

    // Fallback to simple string-based filtering
    return filterWithSimpleStringComparison(choices, threshold);
  }
}

/**
 * Fallback filtering using simple string similarity
 */
function filterWithSimpleStringComparison(
  choices: { text: string; [key: string]: any }[],
  threshold: number
): { text: string; [key: string]: any }[] {
  const filtered: typeof choices = [];

  for (const candidate of choices) {
    let isSimilar = false;

    for (const accepted of filtered) {
      const similarity = simpleStringSimilarity(candidate.text, accepted.text);

      if (similarity >= threshold) {
        console.log(`❌ Filtered similar choice (string): "${candidate.text}" (${similarity.toFixed(3)} similarity to "${accepted.text}")`);
        isSimilar = true;
        break;
      }
    }

    if (!isSimilar) {
      console.log(`✅ Accepted choice (string): "${candidate.text}"`);
      filtered.push(candidate);
    }
  }

  return filtered;
}

/**
 * Simple batch similarity check for performance
 */
export async function batchSimilarityCheck(
  choices: string[],
  threshold: number = 0.85
): Promise<boolean[]> {
  if (choices.length <= 1) return new Array(choices.length).fill(true);

  try {
    const embeddings = await getBatchEmbeddings(choices);
    const results: boolean[] = new Array(choices.length).fill(true);

    for (let i = 0; i < choices.length; i++) {
      for (let j = i + 1; j < choices.length; j++) {
        const similarity = cosineSimilarity(embeddings[i], embeddings[j]);

        if (similarity >= threshold) {
          // Mark the later choice as redundant
          results[j] = false;
          console.log(`🔄 Found similarity: "${choices[i]}" ↔ "${choices[j]}" (${similarity.toFixed(3)})`);
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Batch similarity check failed:', error);
    return new Array(choices.length).fill(true);
  }
}