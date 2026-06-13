import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import useChat from '../hooks/useChat';

export default function ChatContainer() {
  const { messages, isLoading, handleSubmit } = useChat();
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom on new messages
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
        background: '#0a0a1a',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexShrink: 0,
          background: 'rgba(10, 10, 26, 0.9)',
          backdropFilter: 'blur(20px)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 16,
            boxShadow: '0 0 20px rgba(129, 140, 248, 0.2)',
          }}
        >
          ✦
        </div>
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 600,
              color: '#e2e8f0',
              letterSpacing: '-0.01em',
            }}
          >
            Visual Chat
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 11,
              color: '#475569',
            }}
          >
            Powered by Gemini · Live animations
          </p>
        </div>

        {/* Status indicator */}
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
              background: isLoading ? '#f59e0b' : '#34d399',
              boxShadow: isLoading
                ? '0 0 8px rgba(245, 158, 11, 0.4)'
                : '0 0 8px rgba(52, 211, 153, 0.4)',
              transition: 'all 0.3s ease',
            }}
          />
          <span style={{ fontSize: 11, color: '#475569' }}>
            {isLoading ? 'Generating...' : 'Ready'}
          </span>
        </div>
      </header>

      {/* Messages area */}
      <div
        id="messages-area"
        style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {hasMessages ? (
          <div
            style={{
              maxWidth: 900,
              width: '100%',
              margin: '0 auto',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
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
      </div>

      {/* Input area */}
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
