import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import AnimationRenderer from './AnimationRenderer';
import AnimationErrorBoundary from './AnimationErrorBoundary';
import VisualChatLogo from './VisualChatLogo';

function AnimationSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.15, 0.35, 0.15] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full mt-2 rounded-2xl flex items-center justify-center h-[260px]"
      style={{
        background: 'linear-gradient(135deg, rgba(138,180,248,0.04) 0%, rgba(192,132,252,0.06) 50%, rgba(138,180,248,0.04) 100%)',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        className="w-7 h-7 rounded-full"
        style={{
          border: '2px solid rgba(138, 180, 248, 0.2)',
          borderTopColor: 'rgba(138, 180, 248, 0.7)',
        }}
      />
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-[10px]">
      {[80, 100, 55].map((width, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.18 }}
          className="h-[14px] rounded-lg"
          style={{
            width: `${width}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 100%)',
          }}
        />
      ))}
      <AnimationSkeleton />
    </div>
  );
}

export default function ChatMessage({ message, onRegenerateAnimation }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex flex-col py-[10px] gap-0 ${isUser ? 'items-end' : 'items-start'}`}
    >
      {/* Row: avatar + content */}
      <div className={`flex items-start gap-3 w-full ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div
          className={`w-[30px] h-[30px] rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[13px] text-vc-muted overflow-hidden ${isUser ? 'bg-vc-bubble' : 'bg-transparent'}`}
        >
          {isUser ? '👤' : <VisualChatLogo size={30} />}
        </div>

        {/* Bubble content */}
        <div className={isUser ? 'max-w-[85%] md:max-w-[70%] flex-none' : 'flex-1 w-full min-w-0'}>
          {isUser ? (
            /* User pill bubble */
            <div
              className="bg-vc-bubble text-vc-primary text-[14.5px] leading-[1.6] break-words px-4 py-[10px]"
              style={{ borderRadius: '20px 20px 4px 20px' }}
            >
              {message.text}
            </div>
          ) : message.isLoading ? (
            /* Loading state */
            <div className="py-1 min-w-[200px]">
              <LoadingSkeleton />
            </div>
          ) : (
            /* Assistant response — Gemini-style inline */
            <div className="flex flex-col gap-4 py-1">
              {/* Error */}
              {message.error && (
                <div
                  className="rounded-xl px-[14px] py-[10px] text-vc-red text-[13px]"
                  style={{
                    background: 'rgba(242, 139, 130, 0.08)',
                    border: '1px solid rgba(242, 139, 130, 0.2)',
                  }}
                >
                  ⚠️ {message.error}
                </div>
              )}

              {/* Text */}
              {message.text && (
                <div className="markdown-content text-[14.5px] text-vc-primary leading-[1.75]">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p className="mb-[10px] leading-[1.75] text-vc-primary">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="text-vc-bright font-semibold">{children}</strong>
                      ),
                      code: ({ children }) => (
                        <code
                          className="text-vc-blueLt px-[6px] py-[2px] rounded-[5px] text-[0.87em] font-mono"
                          style={{ background: 'rgba(138, 180, 248, 0.1)' }}
                        >
                          {children}
                        </code>
                      ),
                      ul: ({ children }) => (
                        <ul className="my-[6px] mb-[10px] pl-[18px] text-vc-secondary">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="my-[6px] mb-[10px] pl-[18px] text-vc-secondary">{children}</ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1 leading-[1.65]">{children}</li>
                      ),
                      h1: ({ children }) => (
                        <h1 className="text-[1.35em] font-semibold text-vc-heading mt-4 mb-2">{children}</h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-[1.15em] font-semibold text-vc-heading mt-[14px] mb-[6px]">{children}</h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-[1.05em] font-semibold text-vc-heading mt-3 mb-[6px]">{children}</h3>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}

              {/* Animation block */}
              {(message.animationCode || message.isAnimationLoading) && (
                <div className="border-t border-vc-line pt-[14px]">
                  <div className="flex items-center gap-[6px] mb-[10px]">
                    <span className="text-[10px] text-vc-blue uppercase font-semibold tracking-[0.1em]">
                      Live Animation
                    </span>
                  </div>
                  {message.isAnimationLoading ? (
                    <AnimationSkeleton />
                  ) : (
                    <div className="w-full max-w-full overflow-hidden rounded-2xl relative">
                      <AnimationErrorBoundary
                        key={message.animationCode}
                        onRegenerate={
                          onRegenerateAnimation
                            ? () => onRegenerateAnimation(message.id)
                            : undefined
                        }
                      >
                        <AnimationRenderer code={message.animationCode} />
                      </AnimationErrorBoundary>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Timestamp */}
      <div
        className={`text-[10.5px] text-vc-faint mt-1 ${isUser ? 'pr-[42px] text-right' : 'pl-[42px] text-left'}`}
      >
        {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </motion.div>
  );
}
