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
      style={{
        height: 180,
        width: '100%',
        background: 'linear-gradient(135deg, rgba(138,180,248,0.04) 0%, rgba(192,132,252,0.06) 50%, rgba(138,180,248,0.04) 100%)',
        borderRadius: 16,
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          border: '2px solid rgba(138, 180, 248, 0.2)',
          borderTopColor: 'rgba(138, 180, 248, 0.7)',
        }}
      />
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {[80, 100, 55].map((width, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.18 }}
          style={{
            height: 14,
            width: `${width}%`,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 100%)',
            borderRadius: 8,
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
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        padding: '10px 0',
        gap: 0,
      }}
    >
      {/* Row: avatar + content */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          width: '100%',
          flexDirection: isUser ? 'row-reverse' : 'row',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            flexShrink: 0,
            marginTop: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isUser ? '#2d2e30' : 'transparent',
            fontSize: 13,
            color: '#9aa0a6',
            overflow: 'hidden',
          }}
        >
          {isUser ? '👤' : <VisualChatLogo size={30} />}
        </div>

        {/* Bubble content */}
        <div
          style={{
            maxWidth: isUser ? '70%' : '100%',
            flex: isUser ? '0 1 auto' : 1,
          }}
        >
          {isUser ? (
            /* User pill bubble */
            <div
              style={{
                background: '#2d2e30',
                borderRadius: '20px 20px 4px 20px',
                padding: '10px 16px',
                color: '#e3e3e3',
                fontSize: 14.5,
                lineHeight: 1.6,
                wordBreak: 'break-word',
              }}
            >
              {message.text}
            </div>
          ) : message.isLoading ? (
            /* Loading state — no bubble, just content */
            <div style={{ padding: '4px 0', minWidth: 200 }}>
              <LoadingSkeleton />
            </div>
          ) : (
            /* Assistant response — no bubble, Gemini-style inline */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '4px 0' }}>
              {/* Error */}
              {message.error && (
                <div
                  style={{
                    background: 'rgba(242, 139, 130, 0.08)',
                    border: '1px solid rgba(242, 139, 130, 0.2)',
                    borderRadius: 12,
                    padding: '10px 14px',
                    color: '#f28b82',
                    fontSize: 13,
                  }}
                >
                  ⚠️ {message.error}
                </div>
              )}

              {/* Text */}
              {message.text && (
                <div
                  className="markdown-content"
                  style={{ fontSize: 14.5, color: '#e3e3e3', lineHeight: 1.75 }}
                >
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p style={{ margin: '0 0 10px', lineHeight: 1.75, color: '#e3e3e3' }}>
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ color: '#f8f9fa', fontWeight: 600 }}>
                          {children}
                        </strong>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            background: 'rgba(138, 180, 248, 0.1)',
                            color: '#aecbfa',
                            padding: '2px 6px',
                            borderRadius: 5,
                            fontSize: '0.87em',
                            fontFamily: "'Google Sans Mono', 'JetBrains Mono', monospace",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      ul: ({ children }) => (
                        <ul style={{ margin: '6px 0 10px', paddingLeft: 18, color: '#bdc1c6' }}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol style={{ margin: '6px 0 10px', paddingLeft: 18, color: '#bdc1c6' }}>
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: 4, lineHeight: 1.65 }}>{children}</li>
                      ),
                      h1: ({ children }) => (
                        <h1 style={{ fontSize: '1.35em', fontWeight: 600, color: '#e8eaed', margin: '16px 0 8px' }}>
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 style={{ fontSize: '1.15em', fontWeight: 600, color: '#e8eaed', margin: '14px 0 6px' }}>
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 style={{ fontSize: '1.05em', fontWeight: 600, color: '#e8eaed', margin: '12px 0 6px' }}>
                          {children}
                        </h3>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}

              {/* Animation block */}
              {(message.animationCode || message.isAnimationLoading) && (
                <div
                  style={{
                    borderTop: '1px solid #2d2e30',
                    paddingTop: 14,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: '#8ab4f8',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.1em',
                      }}
                    >
                      ⬡ Live Animation
                    </span>
                  </div>
                  {message.isAnimationLoading ? (
                    <AnimationSkeleton />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        overflowX: 'auto',
                        borderRadius: 16,
                        position: 'relative',
                      }}
                    >
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
        style={{
          fontSize: 10.5,
          color: '#5f6368',
          marginTop: 4,
          paddingLeft: isUser ? 0 : 42,
          paddingRight: isUser ? 42 : 0,
          textAlign: isUser ? 'right' : 'left',
        }}
      >
        {message.timestamp?.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </motion.div>
  );
}
