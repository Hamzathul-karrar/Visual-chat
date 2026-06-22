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
