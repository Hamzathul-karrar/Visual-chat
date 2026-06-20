import { ErrorBoundary } from 'react-error-boundary';

function AnimationFallback({ error, resetErrorBoundary, onRegenerate }) {
  return (
    <div className="w-full max-w-anim rounded-xl px-6 py-5 bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.25)]">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[18px]">⚠️</span>
        <span className="text-vc-redLt font-semibold text-[14px]">
          Animation failed to render
        </span>
      </div>
      <p className="text-slate-400 text-[13px] m-0 mb-4 font-mono leading-[1.5] break-words">
        {error.message}
      </p>
      <div className="flex gap-3">
        <button
          onClick={resetErrorBoundary}
          className="bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] rounded-lg text-vc-redLt px-4 py-2 text-[13px] font-medium cursor-pointer transition-colors duration-200 hover:bg-[rgba(239,68,68,0.25)]"
        >
          ↻ Retry render
        </button>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="bg-[rgba(129,140,248,0.15)] border border-[rgba(129,140,248,0.3)] rounded-lg text-vc-indigo px-4 py-2 text-[13px] font-medium cursor-pointer transition-colors duration-200 hover:bg-[rgba(129,140,248,0.25)]"
          >
            ✦ Regenerate Animation
          </button>
        )}
      </div>
    </div>
  );
}

export default function AnimationErrorBoundary({ children, onRegenerate }) {
  return (
    <ErrorBoundary
      FallbackComponent={(props) => <AnimationFallback {...props} onRegenerate={onRegenerate} />}
      onError={(error, info) => {
        console.error('Animation render error:', error);
        console.error('Component stack:', info.componentStack);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
