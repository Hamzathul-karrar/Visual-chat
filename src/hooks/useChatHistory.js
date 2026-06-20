import { useState, useCallback, useEffect } from 'react';

/**
 * Manages multiple chat sessions persisted in localStorage.
 *
 * Session shape:
 * {
 *   id: string,
 *   title: string,       // derived from first user message
 *   messages: Message[],
 *   createdAt: number,   // timestamp ms
 *   updatedAt: number,
 * }
 */

const STORAGE_KEY = 'visual-chat-history';
const MAX_SESSIONS = 20;

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    // Rehydrate Date objects in messages
    return parsed.map((s) => ({
      ...s,
      messages: s.messages.map((m) => ({
        ...m,
        timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
      })),
    }));
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS)));
  } catch {
    // Storage full — silently ignore
  }
}

function deriveTitle(messages) {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'New chat';
  const text = first.text.trim();
  return text.length > 48 ? text.slice(0, 46) + '…' : text;
}

export default function useChatHistory() {
  const [sessions, setSessions] = useState(() => loadSessions());
  const [activeSessionId, setActiveSessionId] = useState(null);

  // Persist whenever sessions change
  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  /** Start a brand-new empty chat */
  const newChat = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  /** Load an existing session by id */
  const loadSession = useCallback((id) => {
    setActiveSessionId(id);
  }, []);

  /** Called by useChat after every message update */
  const saveSession = useCallback((sessionId, messages) => {
    if (!messages.length) return sessionId;

    const now = Date.now();
    const title = deriveTitle(messages);

    if (sessionId) {
      // Update existing session
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId
            ? { ...s, messages, title, updatedAt: now }
            : s
        )
      );
      return sessionId;
    } else {
      // Create new session
      const newId = crypto.randomUUID();
      const newSession = {
        id: newId,
        title,
        messages,
        createdAt: now,
        updatedAt: now,
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newId);
      return newId;
    }
  }, []);

  /** Delete a session by id */
  const deleteSession = useCallback((id) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setActiveSessionId((prev) => (prev === id ? null : prev));
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  return {
    sessions,
    activeSession,
    activeSessionId,
    newChat,
    loadSession,
    saveSession,
    deleteSession,
  };
}
