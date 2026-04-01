import { useNavigate, useRouter } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export interface ErrorDisplayProps {
  title?: string;
  message?: string;
  showBackButton?: boolean;
  backUrl?: string;
  backButtonText?: string;
  fullScreen?: boolean;
}

export function ErrorDisplay({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  showBackButton = true,
  backUrl = "/",
  backButtonText = "Go home",
  fullScreen = true,
}: ErrorDisplayProps) {
  const navigate = useNavigate();
  const router = useRouter();

  return (
    <div className={`flex items-center justify-center px-6 ${fullScreen ? "min-h-screen" : "py-12"}`}>
      <div className="surface-panel-dark w-full max-w-lg p-8 text-center text-slate-100">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 text-red-300">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm leading-6 text-slate-300">{message}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {showBackButton ? (
            <button
              onClick={() => router.history.back()}
              className="inline-flex flex-1 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/10"
            >
              Go back
            </button>
          ) : null}

          <button
            onClick={() => navigate({ to: backUrl })}
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            {backButtonText}
          </button>
        </div>

        <p className="mt-6 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-slate-400">
          Template safe fallback state
        </p>
      </div>
    </div>
  );
}
