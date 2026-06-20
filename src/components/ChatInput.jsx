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

  const hasInput = input.trim().length > 0;

  return (
    <div
      style={{
        padding: '12px 24px 20px',
        background: '#131314',
        flexShrink: 0,
      }}
    >
      {/* Gemini-style pill input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 8,
          maxWidth: 768,
          margin: '0 auto',
          background: '#1e1f20',
          border: '1px solid #2d2e30',
          borderRadius: 28,
          padding: '10px 10px 10px 22px',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(138, 180, 248, 0.4)';
          e.currentTarget.style.boxShadow = '0 0 0 1px rgba(138, 180, 248, 0.15)';
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            e.currentTarget.style.borderColor = '#2d2e30';
            e.currentTarget.style.boxShadow = 'none';
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
            color: '#e3e3e3',
            fontSize: 15,
            fontFamily: 'inherit',
            resize: 'none',
            lineHeight: 1.6,
            padding: '4px 0',
            maxHeight: 160,
            opacity: isLoading ? 0.5 : 1,
          }}
        />

        {/* Send button */}
        <motion.button
          type="submit"
          disabled={!hasInput || isLoading}
          whileHover={hasInput && !isLoading ? { scale: 1.08 } : {}}
          whileTap={hasInput && !isLoading ? { scale: 0.93 } : {}}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: 'none',
            background: hasInput && !isLoading
              ? 'linear-gradient(135deg, #8ab4f8 0%, #c084fc 100%)'
              : '#2d2e30',
            color: hasInput && !isLoading ? '#131314' : '#5f6368',
            cursor: hasInput && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.25s ease',
          }}
        >
          {isLoading ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', fontSize: 15 }}
            >
              ◌
            </motion.span>
          ) : (
            <svg
              width="17"
              height="17"
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
          color: '#5f6368',
          fontSize: 11,
          margin: '8px 0 0',
          userSelect: 'none',
        }}
      >
        Visual Chat can make mistakes. Visual animations may occasionally fail to render.
      </p>
    </div>
  );
}
