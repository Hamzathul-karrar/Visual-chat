import { useState, useCallback } from 'react';
import { fetchBothResponses, fetchAnimationCode } from '../api/gemini';

/**
 * Custom hook for managing chat state and LLM interactions.
 *
 * Message shape:
 * {
 *   id: string,
 *   role: 'user' | 'assistant',
 *   text: string,
 *   animationCode: string | null,
 *   isLoading: boolean,
 *   error: string | null,
 *   timestamp: Date
 * }
 */
export default function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState(() => {
    return localStorage.getItem('chat-provider') || (import.meta.env.VITE_GROQ_API_KEY ? 'groq' : 'gemini');
  });

  const changeProvider = useCallback((newProvider) => {
    setProvider(newProvider);
    localStorage.setItem('chat-provider', newProvider);
  }, []);

  const handleSubmit = useCallback(async (prompt) => {
    if (!prompt.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      text: prompt.trim(),
      animationCode: null,
      isLoading: false,
      error: null,
      timestamp: new Date(),
    };

    const assistantId = crypto.randomUUID();
    const assistantMessage = {
      id: assistantId,
      role: 'assistant',
      text: '',
      animationCode: null,
      isLoading: true,
      error: null,
      timestamp: new Date(),
    };

    // Add both messages to state
    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setIsLoading(true);

    try {
      // Parallel LLM calls
      const { text, animationCode } = await fetchBothResponses(prompt.trim(), provider);

      // Debug: log raw LLM responses
      console.log('=== TEXT RESPONSE ===', text?.substring(0, 100));
      console.log('=== ANIMATION RESPONSE (raw) ===', animationCode);

      // Check if animation code is null-like
      const cleanAnimation = animationCode?.trim();
      const isNullAnimation =
        !cleanAnimation ||
        cleanAnimation === '(motion, React) => null' ||
        cleanAnimation === 'null' ||
        cleanAnimation.match(/^\(motion,\s*React\)\s*=>\s*null$/);

      console.log('=== isNullAnimation:', isNullAnimation, '===');

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                text,
                animationCode: isNullAnimation ? null : animationCode,
                isLoading: false,
                timestamp: new Date(),
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                text: '',
                animationCode: null,
                isLoading: false,
                error: error.message || 'Something went wrong. Please try again.',
                timestamp: new Date(),
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, provider]);

  const regenerateAnimation = useCallback(async (messageId) => {
    const msgIndex = messages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    // Find the closest user prompt before this assistant message
    let userPrompt = '';
    for (let i = msgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        userPrompt = messages[i].text;
        break;
      }
    }

    if (!userPrompt) return;

    // Set message to loading state specifically for animation
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              animationCode: null,
              isAnimationLoading: true,
              error: null,
            }
          : msg
      )
    );

    try {
      const code = await fetchAnimationCode(userPrompt, provider);

      const cleanAnimation = code?.trim();
      const isNullAnimation =
        !cleanAnimation ||
        cleanAnimation === '(motion, React) => null' ||
        cleanAnimation === 'null' ||
        cleanAnimation.match(/^\(motion,\s*React\)\s*=>\s*null$/);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                animationCode: isNullAnimation ? null : code,
                isAnimationLoading: false,
              }
            : msg
        )
      );
    } catch (error) {
      console.error('Regenerate animation error:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                isAnimationLoading: false,
                error: error.message || 'Failed to regenerate animation.',
              }
            : msg
        )
      );
    }
  }, [messages, provider]);

  return { messages, isLoading, handleSubmit, regenerateAnimation, provider, setProvider: changeProvider };
}
