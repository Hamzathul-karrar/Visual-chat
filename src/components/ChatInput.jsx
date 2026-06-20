import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ChatInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  }, [input]);

  function handleSubmit(e) {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
    setInput('');
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div
      style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.04)',
        background: 'rgba(10, 10, 26, 0.8)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          maxWidth: 900,
          margin: '0 auto',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 16,
          padding: '10px 12px 10px 18px',
          transition: 'border-color 0.25s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.3)';
        }}
        onBlur={(e) => {
          // Only blur if focus leaves the form entirely
          if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          }
        }}
      >
        <textarea
          ref={textareaRef}
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          disabled={isLoading}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: 15,
            fontFamily: 'inherit',
            resize: 'none',
            lineHeight: 1.5,
            padding: '6px 0',
            maxHeight: 160,
            opacity: isLoading ? 0.5 : 1,
          }}
        />

        <motion.button
          type="submit"
          disabled={!input.trim() || isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            border: 'none',
            background:
              input.trim() && !isLoading
                ? 'linear-gradient(135deg, #818cf8, #6366f1)'
                : 'rgba(255, 255, 255, 0.06)',
            color:
              input.trim() && !isLoading ? '#fff' : '#475569',
            cursor:
              input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
            transition: 'all 0.25s ease',
            boxShadow:
              input.trim() && !isLoading
                ? '0 0 20px rgba(129, 140, 248, 0.25)'
                : 'none',
          }}
        >
          {isLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', fontSize: 16 }}
            >
              ◌
            </motion.span>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </motion.button>
      </form>

      <p
        style={{
          textAlign: 'center',
          color: '#334155',
          fontSize: 11,
          margin: '10px 0 0',
          userSelect: 'none',
        }}
      >
        Visual Chat uses LLMs · Animations may occasionally fail to render
      </p>
    </div>
  );
}

/**
 * Imperatively submit a prompt (used by WelcomeScreen cards).
 * ChatContainer will call onSubmit directly for this.
 */
