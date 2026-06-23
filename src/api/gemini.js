import {
  ANIMATION_SYSTEM_PROMPT,
  EXPLANATION_SYSTEM_PROMPT,
} from '../prompts/systemPrompts';

// ─── Provider API callers ────────────────────────────────────────

/**
 * Call Google Gemini API.
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @param {string} model - e.g. 'gemini-2.5-flash'
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
async function callGemini(userPrompt, systemPrompt, model, apiKey) {
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Open Settings (🔑) to add it.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          parts: [{ text: userPrompt }],
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
 * Call Groq API (OpenAI-compatible).
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @param {string} model - e.g. 'llama-3.3-70b-versatile'
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
async function callGroq(userPrompt, systemPrompt, model, apiKey) {
  if (!apiKey) {
    throw new Error('Groq API key is not configured. Open Settings (🔑) to add it.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
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
 * Call OpenRouter API (OpenAI-compatible).
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @param {string} model - e.g. 'google/gemini-2.5-flash'
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
async function callOpenRouter(userPrompt, systemPrompt, model, apiKey) {
  if (!apiKey) {
    throw new Error('OpenRouter API key is not configured. Open Settings (🔑) to add it.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Visual Chat',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `OpenRouter API error (${response.status}): ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response from OpenRouter API');
  }

  return text.trim();
}

// ─── Provider dispatcher ─────────────────────────────────────────

/**
 * Route to the correct provider.
 * @param {'gemini'|'groq'|'openrouter'} provider
 * @param {string} userPrompt
 * @param {string} systemPrompt
 * @param {string} model
 * @param {string} apiKey
 * @returns {Promise<string>}
 */
function callProvider(provider, userPrompt, systemPrompt, model, apiKey) {
  switch (provider) {
    case 'gemini':
      return callGemini(userPrompt, systemPrompt, model, apiKey);
    case 'groq':
      return callGroq(userPrompt, systemPrompt, model, apiKey);
    case 'openrouter':
      return callOpenRouter(userPrompt, systemPrompt, model, apiKey);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Fetch a text explanation for the user's prompt.
 * @param {string} userPrompt
 * @param {{ provider: string, model: string, apiKey: string }} taskConfig
 */
export async function fetchExplanation(userPrompt, taskConfig) {
  const { provider, model, apiKey } = taskConfig;
  return callProvider(provider, userPrompt, EXPLANATION_SYSTEM_PROMPT, model, apiKey);
}

/**
 * Fetch animation code for the user's prompt.
 * @param {string} userPrompt
 * @param {{ provider: string, model: string, apiKey: string }} taskConfig
 */
export async function fetchAnimationCode(userPrompt, taskConfig) {
  const { provider, model, apiKey } = taskConfig;
  return callProvider(provider, userPrompt, ANIMATION_SYSTEM_PROMPT, model, apiKey);
}

/**
 * Fetch both explanation and animation code in parallel.
 * Uses Promise.allSettled so a failure in one doesn't block the other.
 * @param {string} userPrompt
 * @param {{ provider: string, model: string, apiKey: string }} textConfig
 * @param {{ provider: string, model: string, apiKey: string }} animConfig
 */
export async function fetchBothResponses(userPrompt, textConfig, animConfig) {
  const [explanationResult, animationResult] = await Promise.allSettled([
    fetchExplanation(userPrompt, textConfig),
    fetchAnimationCode(userPrompt, animConfig),
  ]);

  const text = explanationResult.status === 'fulfilled' ? explanationResult.value : null;
  const animationCode = animationResult.status === 'fulfilled' ? animationResult.value : null;

  // Log any partial failures
  if (explanationResult.status === 'rejected') {
    console.warn('Explanation failed:', explanationResult.reason?.message);
  }
  if (animationResult.status === 'rejected') {
    console.warn('Animation failed:', animationResult.reason?.message);
  }

  // If BOTH failed, throw so the caller's catch block can show an error
  if (!text && !animationCode) {
    throw new Error(
      `Both APIs failed. Text: ${explanationResult.reason?.message || 'unknown'}. Animation: ${animationResult.reason?.message || 'unknown'}.`
    );
  }

  return { text, animationCode };
}
