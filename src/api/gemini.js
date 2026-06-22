import {
  ANIMATION_SYSTEM_PROMPT,
  EXPLANATION_SYSTEM_PROMPT,
} from '../prompts/systemPrompts';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-3.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Generic call to Google AI Studio's Gemini API.
 * @param {string} userPrompt - The user's message
 * @param {string} systemPrompt - The system instruction
 * @returns {Promise<string>} - The text response from Gemini
 */
async function callGemini(userPrompt, systemPrompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key (VITE_GEMINI_API_KEY) is not set in your .env file.');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      system_instruction: {
        parts: [
          {
            text: systemPrompt,
          },
        ],
      },
      contents: [
        {
          parts: [
            {
              text: userPrompt,
            },
          ],
        },
      ],
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
 * Generic call to Groq API.
 * @param {string} userPrompt - The user's message
 * @param {string} systemPrompt - The system instruction
 * @returns {Promise<string>} - The text response from Groq
 */
async function callGroq(userPrompt, systemPrompt) {
  if (!GROQ_API_KEY) {
    throw new Error('Groq API Key (VITE_GROQ_API_KEY) is not set in your .env file.');
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `Groq API error (${response.status}): ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response from Groq API');
  }

  return text.trim();
}

/**
 * Fetch a text explanation for the user's prompt.
 * Always uses Groq (fast LLM for text explanations).
 */
export async function fetchExplanation(userPrompt) {
  return callGroq(userPrompt, EXPLANATION_SYSTEM_PROMPT);
}

/**
 * Fetch animation code for the user's prompt.
 * Always uses Gemini (best for complex code generation).
 */
export async function fetchAnimationCode(userPrompt) {
  return callGemini(userPrompt, ANIMATION_SYSTEM_PROMPT);
}

/**
 * Fetch both explanation (Groq) and animation code (Gemini) in parallel.
 * Uses Promise.allSettled so a failure in one doesn't block the other.
 */
export async function fetchBothResponses(userPrompt) {
  const [explanationResult, animationResult] = await Promise.allSettled([
    fetchExplanation(userPrompt),
    fetchAnimationCode(userPrompt),
  ]);

  const text = explanationResult.status === 'fulfilled' ? explanationResult.value : null;
  const animationCode = animationResult.status === 'fulfilled' ? animationResult.value : null;

  // Log any partial failures
  if (explanationResult.status === 'rejected') {
    console.warn('Explanation (Groq) failed:', explanationResult.reason?.message);
  }
  if (animationResult.status === 'rejected') {
    console.warn('Animation (Gemini) failed:', animationResult.reason?.message);
  }

  // If BOTH failed, throw so the caller's catch block can show an error
  if (!text && !animationCode) {
    throw new Error(
      `Both APIs failed. Groq: ${explanationResult.reason?.message || 'unknown'}. Gemini: ${animationResult.reason?.message || 'unknown'}.`
    );
  }

  return { text, animationCode };
}
