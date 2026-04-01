export interface LoadingSpinnerProps {
  title?: string;
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  showDots?: boolean;
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-16 h-16",
  lg: "w-24 h-24",
};

export function LoadingSpinner({
  title = "Loading...",
  message = "Preparing the application shell.",
  size = "md",
  fullScreen = true,
  showDots = true,
}: LoadingSpinnerProps = {}) {
  return (
    <div className={`flex items-center justify-center px-6 ${fullScreen ? "min-h-screen" : "py-12"}`}>
      <div className="surface-panel-dark w-full max-w-md p-8 text-center text-slate-100">
        <div className="mx-auto mb-5 flex justify-center">
          <div className={`relative ${sizeClasses[size]}`}>
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-400" />
          </div>
        </div>

        {title || message ? (
          <div>
            {title ? <h2 className="text-xl font-semibold">{title}</h2> : null}
            {message ? <p className="mt-2 text-sm text-slate-300">{message}</p> : null}
          </div>
        ) : null}

        {showDots ? (
          <div className="mt-5 flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 w-2 animate-pulse rounded-full bg-blue-400"
                style={{ animationDelay: `${i * 120}ms` }}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
