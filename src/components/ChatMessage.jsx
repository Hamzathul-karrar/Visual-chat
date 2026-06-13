import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import AnimationRenderer from './AnimationRenderer';
import AnimationErrorBoundary from './AnimationErrorBoundary';

function AnimationSkeleton() {
  return (
    <motion.div
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{
        height: 180,
        width: '100%',
        background:
          'linear-gradient(135deg, rgba(129,140,248,0.05) 0%, rgba(99,102,241,0.08) 50%, rgba(129,140,248,0.05) 100%)',
        borderRadius: 12,
        marginTop: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.span
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        style={{ fontSize: 28, opacity: 0.3 }}
      >
        ✦
      </motion.span>
    </motion.div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[85, 100, 60].map((width, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
          style={{
            height: 14,
            width: `${width}%`,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
            borderRadius: 7,
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
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        padding: '4px 0',
      }}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #818cf8, #6366f1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
            marginRight: 12,
            marginTop: 4,
            boxShadow: '0 0 16px rgba(129, 140, 248, 0.2)',
          }}
        >
          ✦
        </div>
      )}

      <div
        style={{
          maxWidth: isUser ? '75%' : '85%',
          minWidth: isUser ? undefined : '40%',
        }}
      >
        {/* Message bubble */}
        <div
          style={{
            padding: isUser ? '12px 18px' : '20px 24px',
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            background: isUser
              ? 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)'
              : 'rgba(255, 255, 255, 0.03)',
            border: isUser
              ? 'none'
              : '1px solid rgba(255, 255, 255, 0.06)',
            color: isUser ? '#fff' : '#e2e8f0',
            fontSize: 15,
            lineHeight: 1.7,
            wordBreak: 'break-word',
          }}
        >
          {isUser ? (
            <p style={{ margin: 0 }}>{message.text}</p>
          ) : message.isLoading ? (
            <LoadingSkeleton />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Error state */}
              {message.error && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.08)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: 10,
                    padding: '12px 16px',
                    color: '#fca5a5',
                    fontSize: 13,
                  }}
                >
                  ⚠️ {message.error}
                </div>
              )}

              {/* Text explanation */}
              {message.text && (
                <div className="markdown-content">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => (
                        <p style={{ margin: '0 0 12px', lineHeight: 1.7, color: '#e2e8f0' }}>
                          {children}
                        </p>
                      ),
                      strong: ({ children }) => (
                        <strong style={{ color: '#f1f5f9', fontWeight: 600 }}>
                          {children}
                        </strong>
                      ),
                      code: ({ children }) => (
                        <code
                          style={{
                            background: 'rgba(129, 140, 248, 0.12)',
                            color: '#a5b4fc',
                            padding: '2px 7px',
                            borderRadius: 5,
                            fontSize: '0.88em',
                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          }}
                        >
                          {children}
                        </code>
                      ),
                      ul: ({ children }) => (
                        <ul style={{ margin: '8px 0', paddingLeft: 20, color: '#cbd5e1' }}>
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol style={{ margin: '8px 0', paddingLeft: 20, color: '#cbd5e1' }}>
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li style={{ marginBottom: 4, lineHeight: 1.6 }}>{children}</li>
                      ),
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}

              {/* Animation */}
              {(message.animationCode || message.isAnimationLoading) && (
                <div
                  style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    paddingTop: 16,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: '#818cf8',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                      }}
                    >
                      ✦ Live Animation
                    </span>
                  </div>
                  {message.isAnimationLoading ? (
                    <AnimationSkeleton />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        overflowX: 'auto',
                        overflowY: 'auto',
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

        {/* Timestamp */}
        <div
          style={{
            fontSize: 11,
            color: '#334155',
            marginTop: 6,
            textAlign: isUser ? 'right' : 'left',
            paddingLeft: isUser ? 0 : 4,
            paddingRight: isUser ? 4 : 0,
          }}
        >
          {message.timestamp?.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* Avatar for user */}
      {isUser && (
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            flexShrink: 0,
            marginLeft: 12,
            marginTop: 4,
            color: '#94a3b8',
          }}
        >
          👤
        </div>
      )}
    </motion.div>
  );
}
