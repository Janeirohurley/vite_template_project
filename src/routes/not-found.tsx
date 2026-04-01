import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Home, SearchX } from "lucide-react";

export const Route = createFileRoute("/not-found")({
  component: NotFoundPage,
});

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl items-center px-6 py-12">
      <div className="surface-panel-dark w-full p-10 text-center text-slate-100">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5 text-blue-300">
          <SearchX className="h-10 w-10" />
        </div>

        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
          The route you requested is not part of this minimal template yet.
          Add a file route when you are ready to expand the app.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-blue-500 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-400"
          >
            <Home className="mr-2 h-4 w-4" />
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
