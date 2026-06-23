import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import Sidebar from './Sidebar';
import ApiKeyModal from './ApiKeyModal';
import useChat from '../hooks/useChat';
import useChatHistory from '../hooks/useChatHistory';
import useApiConfig from '../hooks/useApiConfig';

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

  const apiConfig = useApiConfig();

  const { messages, setMessages, isLoading, handleSubmit: _handleSubmit } = useChat(
    activeSession?.messages ?? [],
    apiConfig
  );

  const messagesAreaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(activeSessionId);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [apiModalOpen, setApiModalOpen] = useState(false);

  useEffect(() => {
    if (activeSessionId !== sessionIdRef.current) {
      sessionIdRef.current = activeSessionId;
      setMessages(activeSession?.messages ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  useEffect(() => {
    const area = messagesAreaRef.current;
    if (area) {
      area.scrollTo({ top: area.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) return;
    const id = saveSession(sessionIdRef.current, messages);
    sessionIdRef.current = id;
  }, [messages, saveSession]);

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
    setMobileSidebarOpen(false); // Close sidebar on mobile after selecting a chat
  }

  const hasMessages = messages.length > 0;
  const isApiSetup = !!(apiConfig.getTextConfig?.apiKey && apiConfig.getAnimationConfig?.apiKey);

  return (
    <div id="chat-container" className="flex flex-row w-full bg-vc-bg overflow-hidden" style={{ height: '100dvh' }}>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <Sidebar
        sessions={sessions}
        activeSessionId={sessionIdRef.current}
        onNewChat={handleNewChat}
        onLoadSession={handleLoadSession}
        onDeleteSession={deleteSession}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* ── Main chat area ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header — status indicator + API key button */}
        <header className="relative px-4 sm:px-6 py-3 flex items-center shrink-0 z-10">
          <button
            className="md:hidden p-2 -ml-2 mr-2 text-vc-muted hover:text-vc-primary transition-colors"
            onClick={() => setMobileSidebarOpen(true)}
            title="Open Sidebar"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="ml-auto flex items-center gap-3">
            {/* API Key Settings Button */}
            <button
              id="api-key-button"
              onClick={() => setApiModalOpen(true)}
              title="API Configuration"
              className="flex items-center justify-center w-8 h-8 rounded-lg text-vc-faint hover:text-vc-blue transition-all duration-200"
              style={{
                background: 'none',
                border: '1px solid transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(138,180,248,0.08)';
                e.currentTarget.style.borderColor = 'rgba(138,180,248,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
            </button>

            {/* Status indicator */}
            <div className="flex items-center gap-[6px]">
              <div
                className={`w-[7px] h-[7px] rounded-full transition-all duration-300 ${!isApiSetup
                  ? 'bg-vc-red shadow-glow-red'
                  : isLoading
                    ? 'bg-vc-yellow shadow-glow-yellow'
                    : 'bg-vc-green shadow-glow-green'
                  }`}
              />
              <span
                className={`text-[12px] ${!isApiSetup ? 'text-vc-red font-medium' : 'text-vc-muted'
                  }`}
              >
                {!isApiSetup ? 'No API key' : isLoading ? 'Generating…' : 'Ready'}
              </span>
            </div>
          </div>
        </header>

        {/* Messages / Welcome area */}
        <div id="messages-area" ref={messagesAreaRef} className="flex-1 overflow-y-auto flex flex-col">
          <AnimatePresence mode="wait">
            {hasMessages ? (
              <motion.div
                key="messages"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-chat w-full mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-2 flex flex-col gap-0"
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
                className="flex-1 flex flex-col"
              >
                <WelcomeScreen onPromptClick={handleSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {/* ── API Key Modal ── */}
      <ApiKeyModal
        isOpen={apiModalOpen}
        onClose={() => setApiModalOpen(false)}
        config={apiConfig.config}
        updateConfig={apiConfig.updateConfig}
      />
    </div>
  );
}
