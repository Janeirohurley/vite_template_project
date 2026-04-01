import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Toaster } from "sonner";
import { GenericErrorComponent } from "@/components/GenericErrorComponent";
import { APP_NAME } from "@/lib/env";

function RootComponent() {
  const showRouterDevtools =
    import.meta.env.DEV || import.meta.env.VITE_APP_SHOW_ROUTER_DEVTOOLS === "true";

  return (
    <div className="min-h-screen text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-300">
            {APP_NAME}
          </Link>
          <nav className="flex items-center gap-3 text-sm text-slate-300">
            <Link to="/" className="rounded-full border border-white/10 px-3 py-1.5 transition hover:bg-white/5">
              Home
            </Link>
            <Link
              to="/not-found"
              className="rounded-full border border-white/10 px-3 py-1.5 transition hover:bg-white/5"
            >
              404 example
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />
      <Toaster richColors position="top-right" />
      {showRouterDevtools ? <TanStackRouterDevtools position="bottom-right" /> : null}
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  errorComponent: GenericErrorComponent,
  notFoundComponent: () => <GenericErrorComponent error={new Error("Page not found")} />,
});
