import {
  ANIMATION_SYSTEM_PROMPT,
  EXPLANATION_SYSTEM_PROMPT,
} from '../prompts/systemPrompts';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

/**
 * Generic call to the Gemini REST API.
 * @param {string} userPrompt - The user's message
 * @param {string} systemPrompt - The system instruction
 * @returns {Promise<string>} - The text response from Gemini
 */
async function callGemini(userPrompt, systemPrompt) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Gemini API error (${response.status}): ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Empty response from Gemini API');
  }

  return text.trim();
}

/**
 * Fetch a text explanation for the user's prompt.
 */
export async function fetchExplanation(userPrompt) {
  return callGemini(userPrompt, EXPLANATION_SYSTEM_PROMPT);
}

/**
 * Fetch animation code for the user's prompt.
 */
export async function fetchAnimationCode(userPrompt) {
  return callGemini(userPrompt, ANIMATION_SYSTEM_PROMPT);
}

/**
 * Fetch both explanation and animation code in parallel.
 * @returns {Promise<{ text: string, animationCode: string }>}
 */
export async function fetchBothResponses(userPrompt) {
  const [text, animationCode] = await Promise.all([
    fetchExplanation(userPrompt),
    fetchAnimationCode(userPrompt),
  ]);

  return { text, animationCode };
}
