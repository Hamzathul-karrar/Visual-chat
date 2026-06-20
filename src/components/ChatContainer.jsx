import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import Sidebar from './Sidebar';
import useChat from '../hooks/useChat';
import useChatHistory from '../hooks/useChatHistory';

export default function ChatContainer() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    newChat,
    loadSession,
    saveSession,
    deleteSession,
  } = useChatHistory();

  const { messages, setMessages, isLoading, handleSubmit: _handleSubmit } = useChat(
    activeSession?.messages ?? []
  );

  const messagesEndRef = useRef(null);
  // Track current session id across renders (mutable ref to avoid stale closures)
  const sessionIdRef = useRef(activeSessionId);

  // When user switches session → load that session's messages into the hook
  useEffect(() => {
    if (activeSessionId !== sessionIdRef.current) {
      sessionIdRef.current = activeSessionId;
      setMessages(activeSession?.messages ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Persist messages to history after every update
  useEffect(() => {
    if (messages.length === 0) return;
    const id = saveSession(sessionIdRef.current, messages);
    sessionIdRef.current = id;
  }, [messages, saveSession]);

  // Wrap handleSubmit so the new session id gets tracked immediately
  function handleSubmit(prompt) {
    _handleSubmit(prompt);
  }

  function handleNewChat() {
    newChat();
    sessionIdRef.current = null;
    setMessages([]);
  }

  function handleLoadSession(id) {
    loadSession(id);
  }

  const hasMessages = messages.length > 0;

  return (
    <div
      id="chat-container"
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        width: '100%',
        background: '#131314',
        overflow: 'hidden',
      }}
    >
      {/* ── Sidebar ── */}
      <Sidebar
        sessions={sessions}
        activeSessionId={sessionIdRef.current}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSession}
      />

      {/* ── Main chat area ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        {/* Header — status only (logo+name live in sidebar) */}
        <header
          style={{
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: isLoading ? '#f8c85b' : '#81c995',
                boxShadow: isLoading
                  ? '0 0 6px rgba(248,200,91,0.5)'
                  : '0 0 6px rgba(129,201,149,0.5)',
                transition: 'all 0.3s ease',
              }}
            />
            <span style={{ fontSize: 12, color: '#9aa0a6' }}>
              {isLoading ? 'Generating…' : 'Ready'}
            </span>
          </div>
        </header>

        {/* Messages / Welcome area */}
        <div
          id="messages-area"
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <AnimatePresence mode="wait">
            {hasMessages ? (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  maxWidth: 768,
                  width: '100%',
                  margin: '0 auto',
                  padding: '24px 24px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                }}
              >
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                <div ref={messagesEndRef} />
              </motion.div>
            ) : (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
              >
                <WelcomeScreen onPromptClick={handleSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
