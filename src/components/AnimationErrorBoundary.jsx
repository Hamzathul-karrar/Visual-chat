import { ErrorBoundary } from 'react-error-boundary';

function AnimationFallback({ error, resetErrorBoundary }) {
  return (
    <div
      style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: 12,
        padding: '20px 24px',
        width: '100%',
        maxWidth: 700,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 18 }}>⚠️</span>
        <span
          style={{
            color: '#fca5a5',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Animation failed to render
        </span>
      </div>
      <p
        style={{
          color: '#94a3b8',
          fontSize: 13,
          margin: 0,
          marginBottom: 16,
          fontFamily: 'monospace',
          lineHeight: 1.5,
          wordBreak: 'break-word',
        }}
      >
        {error.message}
      </p>
      <button
        onClick={resetErrorBoundary}
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          color: '#fca5a5',
          padding: '8px 16px',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(239, 68, 68, 0.25)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(239, 68, 68, 0.15)';
        }}
      >
        ↻ Retry render
      </button>
    </div>
  );
}

export default function AnimationErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={AnimationFallback}
      onError={(error, info) => {
        console.error('Animation render error:', error);
        console.error('Component stack:', info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
