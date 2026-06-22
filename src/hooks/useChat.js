import { useState, useCallback } from 'react';
import { fetchExplanation, fetchAnimationCode } from '../api/gemini';
// Explanation → Groq API, Animation → Gemini API (fired independently)

/**
 * Custom hook for managing chat state and LLM interactions.
 *
 * Accepts optional initialMessages so the container can seed it with a
 * restored session when switching conversations.
 *
 * Message shape:
 * {
 *   id: string,
 *   role: 'user' | 'assistant',
 *   text: string,
 *   animationCode: string | null,
 *   isLoading: boolean,        // text explanation loading
 *   isAnimationLoading: boolean, // animation code loading
 *   error: string | null,
 *   timestamp: Date
 * }
 */
export default function useChat(initialMessages = []) {
  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);

  // Helper to check if animation code is a null/empty response
  const isNullAnimationCode = (code) => {
    const clean = code?.trim();
    return (
      !clean ||
      clean === '(motion, React) => null' ||
      clean === 'null' ||
      !!clean.match(/^\(motion,\s*React\)\s*=>\s*null$/)
    );
  };

  const handleSubmit = useCallback(async (prompt) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: prompt.trim(),
      animationCode: null,
      isLoading: false,
      isAnimationLoading: false,
      error: null,
      timestamp: new Date(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage = {
      id: assistantId,
      role: 'assistant',
      text: '',
      animationCode: null,
      isLoading: true,           // text skeleton
      isAnimationLoading: true,  // animation skeleton
      error: null,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    const trimmedPrompt = prompt.trim();

    // Fire both API calls independently — whichever finishes first updates the UI
    const explanationPromise = fetchExplanation(trimmedPrompt)
      .then((text) => {
        console.log('=== TEXT RESPONSE ===', text?.substring(0, 100));
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? { ...msg, text: text || '', isLoading: false, timestamp: new Date() }
              : msg
          )
        );
        return { ok: true };
      })
      .catch((err) => {
        console.warn('Explanation (Groq) failed:', err.message);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  isLoading: false,
                  error: (msg.error ? msg.error + ' ' : '') + 'Explanation unavailable.',
                  timestamp: new Date(),
                }
              : msg
          )
        );
        return { ok: false, error: err };
      });

    const animationPromise = fetchAnimationCode(trimmedPrompt)
      .then((code) => {
        console.log('=== ANIMATION RESPONSE (raw) ===', code);
        const nullAnim = isNullAnimationCode(code);
        console.log('=== isNullAnimation:', nullAnim, '===');
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  animationCode: nullAnim ? null : code,
                  isAnimationLoading: false,
                  timestamp: new Date(),
                }
              : msg
          )
        );
        return { ok: true };
      })
      .catch((err) => {
        console.warn('Animation (Gemini) failed:', err.message);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
              ? {
                  ...msg,
                  isAnimationLoading: false,
                  error: (msg.error ? msg.error + ' ' : '') + 'Animation unavailable.',
                  timestamp: new Date(),
                }
              : msg
          )
        );
        return { ok: false, error: err };
      });

    // Wait for both to settle before releasing the global loading lock
    const [expResult, animResult] = await Promise.all([explanationPromise, animationPromise]);

    // If both failed, set a combined error
    if (!expResult.ok && !animResult.ok) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                error: 'Both APIs failed. Please try again.',
                isLoading: false,
                isAnimationLoading: false,
              }
            : msg
        )
      );
    }

    setIsLoading(false);
  }, [isLoading]);

  const regenerateAnimation = useCallback(async (messageId) => {
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    let userPrompt = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userPrompt = messages[i].text;
        break;
      }
    }

    if (!userPrompt) return;

    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, animationCode: null, isAnimationLoading: true, error: null }
          : msg
      )
    );

    try {
      const code = await fetchAnimationCode(userPrompt);

      const cleanAnimation = code?.trim();
      const isNullAnimation =
        !cleanAnimation ||
        cleanAnimation === '(motion, React) => null' ||
        cleanAnimation === 'null' ||
        cleanAnimation.match(/^\(motion,\s*React\)\s*=>\s*null$/);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, animationCode: isNullAnimation ? null : code, isAnimationLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Regenerate animation error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, isAnimationLoading: false, error: error.message || 'Failed to regenerate animation.' }
            : msg
        )
      );
    }
  }, [messages]);

  return { messages, setMessages, isLoading, handleSubmit, regenerateAnimation };
}
