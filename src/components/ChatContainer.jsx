import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import VisualChatLogo from './VisualChatLogo';
import useChat from '../hooks/useChat';

export default function ChatContainer() {
  const { messages, isLoading, handleSubmit } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const hasMessages = messages.length > 0;

  return (
    <div
      id="chat-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
        background: '#131314',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Header — Gemini style: minimal, no border, just logo + name */}
      <header
        style={{
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <VisualChatLogo size={32} />
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 500,
            color: '#e3e3e3',
            letterSpacing: '-0.01em',
          }}
        >
          Visual Chat
        </span>

        {/* Status indicator — top right */}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: isLoading ? '#f8c85b' : '#81c995',
              boxShadow: isLoading
                ? '0 0 6px rgba(248, 200, 91, 0.5)'
                : '0 0 6px rgba(129, 201, 149, 0.5)',
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
            <div
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
            </div>
          ) : (
            <WelcomeScreen onPromptClick={handleSubmit} />
          )}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
