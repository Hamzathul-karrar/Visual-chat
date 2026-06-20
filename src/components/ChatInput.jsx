import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ChatInput({ onSubmit, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

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
    <div className="px-6 pb-5 pt-3 bg-vc-bg shrink-0">
      {/* Gemini-style pill input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 max-w-chat-input mx-auto bg-vc-surface border border-vc-line rounded-pill px-[22px] py-[10px] transition-all duration-200 focus-within:border-[rgba(138,180,248,0.4)] focus-within:shadow-focus-ring"
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
          className={`flex-1 bg-transparent border-none outline-none text-vc-primary text-[15px] font-sans resize-none leading-[1.6] py-1 max-h-[160px] transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        />

        {/* Send button */}
        <motion.button
          type="submit"
          disabled={!hasInput || isLoading}
          whileHover={hasInput && !isLoading ? { scale: 1.08 } : {}}
          whileTap={hasInput && !isLoading ? { scale: 0.93 } : {}}
          className={`w-10 h-10 rounded-full border-none flex items-center justify-center shrink-0 transition-all duration-[250ms] ${hasInput && !isLoading ? 'cursor-pointer text-vc-bg' : 'bg-vc-line text-vc-faint cursor-not-allowed'}`}
          style={hasInput && !isLoading ? { background: 'linear-gradient(135deg, #8ab4f8 0%, #c084fc 100%)' } : {}}
        >
          {isLoading ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="inline-block text-[15px]">
              ◌
            </motion.span>
          ) : (
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </motion.button>
      </form>

      <p className="text-center text-vc-faint text-[11px] mt-2 select-none">
        Visual Chat can make mistakes. Visual animations may occasionally fail to render.
      </p>
    </div>
  );
}
