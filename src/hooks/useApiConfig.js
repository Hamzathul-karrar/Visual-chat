import { useState, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'vc-api-config';

/**
 * Default model per provider — used when a provider is first selected
 * and the user hasn't typed a custom model name yet.
 */
export const DEFAULT_MODELS = {
  gemini: 'gemini-2.5-flash',
  groq: 'llama-3.3-70b-versatile',
  openrouter: 'google/gemini-2.5-flash',
};

/**
 * Provider display names for the UI.
 */
export const PROVIDER_OPTIONS = [
  { id: 'gemini', label: 'Gemini' },
  { id: 'groq', label: 'Groq' },
  { id: 'openrouter', label: 'OpenRouter' },
];

/**
 * Build the initial config, merging localStorage with .env fallbacks.
 *
 * Config shape:
 * {
 *   text:      { provider, model, apiKey },
 *   animation: { provider, model, apiKey },
 *   useSameKey: boolean   // when true, animation uses text's apiKey
 * }
 */
function loadConfig() {
  const defaults = {
    text: {
      provider: 'groq',
      model: DEFAULT_MODELS.groq,
      apiKey: '',
    },
    animation: {
      provider: 'gemini',
      model: DEFAULT_MODELS.gemini,
      apiKey: '',
    },
    useSameKey: false,
  };

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        text: {
          provider: parsed.text?.provider || defaults.text.provider,
          model: parsed.text?.model || defaults.text.model,
          apiKey: parsed.text?.apiKey || defaults.text.apiKey,
        },
        animation: {
          provider: parsed.animation?.provider || defaults.animation.provider,
          model: parsed.animation?.model || defaults.animation.model,
          apiKey: parsed.animation?.apiKey || defaults.animation.apiKey,
        },
        useSameKey: parsed.useSameKey ?? defaults.useSameKey,
      };
    }
  } catch (e) {
    console.warn('Failed to load API config from localStorage:', e);
  }

  return defaults;
}

/**
 * Custom hook for managing API configuration.
 *
 * Each task (text / animation) has its own provider, model, and API key.
 * When useSameKey is true, animation inherits the text task's API key.
 * Everything is persisted to localStorage.
 */
export default function useApiConfig() {
  const [config, setConfig] = useState(loadConfig);

  /**
   * Update the config and persist to localStorage.
   * Accepts a partial config that is deep-merged with the current state.
   */
  const updateConfig = useCallback((updates) => {
    setConfig((prev) => {
      const next = {
        text: { ...prev.text, ...updates.text },
        animation: { ...prev.animation, ...updates.animation },
        useSameKey: updates.useSameKey ?? prev.useSameKey,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save API config to localStorage:', e);
      }
      return next;
    });
  }, []);

  /**
   * Get the full config needed for text explanation API calls.
   */
  const getTextConfig = useMemo(
    () => ({
      provider: config.text.provider,
      model: config.text.model,
      apiKey: config.text.apiKey,
    }),
    [config.text]
  );

  /**
   * Get the full config needed for animation API calls.
   * When useSameKey is true, uses the entire text config (provider + model + key).
   */
  const getAnimationConfig = useMemo(
    () =>
      config.useSameKey
        ? {
            provider: config.text.provider,
            model: config.text.model,
            apiKey: config.text.apiKey,
          }
        : {
            provider: config.animation.provider,
            model: config.animation.model,
            apiKey: config.animation.apiKey,
          },
    [config.animation, config.text, config.useSameKey]
  );

  return {
    config,
    updateConfig,
    getTextConfig,
    getAnimationConfig,
  };
}
