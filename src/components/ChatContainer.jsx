import { useRef, useEffect, useState } from 'react';
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
  const sessionIdRef = useRef(activeSessionId);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (activeSessionId !== sessionIdRef.current) {
      sessionIdRef.current = activeSessionId;
      setMessages(activeSession?.messages ?? []);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  return (
    <div id="chat-container" className="flex flex-row h-screen w-full bg-vc-bg overflow-hidden">
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
        {/* Header — status indicator */}
        <header className="px-4 sm:px-6 py-3 flex items-center shrink-0 z-10">
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
          <div className="ml-auto flex items-center gap-[6px]">
            <div
              className={`w-[7px] h-[7px] rounded-full transition-all duration-300 ${isLoading ? 'bg-vc-yellow shadow-glow-yellow' : 'bg-vc-green shadow-glow-green'}`}
            />
            <span className="text-[12px] text-vc-muted">
              {isLoading ? 'Generating…' : 'Ready'}
            </span>
          </div>
        </header>

        {/* Messages / Welcome area */}
        <div id="messages-area" className="flex-1 overflow-y-auto flex flex-col">
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
    </div>
  );
}
