import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, FolderTree, Layers3, Route as RouteIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/env";

function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-6xl flex-col px-6 py-12">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-panel-dark p-8 lg:p-12">
          <p className="text-sm uppercase tracking-[0.35em] text-blue-300">
            Vite + React + TanStack
          </p>
          <h1 className="mt-4 max-w-2xl text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {APP_NAME} gives you a clean starting point for every new frontend.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
            The project is cleaned down to a minimal app shell with typed routing,
            React Query, Tailwind, a few reusable UI primitives, and your module
            folder generator.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/not-found"
              className={buttonVariants({
                className: "h-11 rounded-md bg-blue-500 px-5 hover:bg-blue-400",
              })}
            >
              Open the 404 example
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-md border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              onClick={() => window.alert("Run `pnpm folder-generator` to scaffold a new module.")}
            >
              Test the starter shell
            </Button>
          </div>
        </div>

        <Card className="rounded-md border-white/10 bg-white text-slate-900 shadow-xl shadow-slate-950/10">
          <CardHeader>
            <CardTitle>Starter ingredients</CardTitle>
            <CardDescription>
              Small by default, but ready to grow with your usual folder structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <RouteIcon className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>TanStack Router with a minimal file-route setup.</span>
            </div>
            <div className="flex items-start gap-3">
              <Layers3 className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>React Query and shared utilities already wired in.</span>
            </div>
            <div className="flex items-start gap-3">
              <FolderTree className="mt-0.5 h-4 w-4 text-blue-600" />
              <span>`folderGenerator.js` preserved for your module workflow.</span>
            </div>
            <div className="rounded-md bg-slate-950 p-4 text-xs text-slate-200">
              <code>
                src/
                <br />
                {"  "}components/
                <br />
                {"  "}hooks/
                <br />
                {"  "}lib/
                <br />
                {"  "}modules/
                <br />
                {"  "}routes/
              </code>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
