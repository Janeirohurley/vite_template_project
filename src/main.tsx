import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import "./language/i18n/i18n";

import "./index.css";

// Import your React Query client
import { queryClient } from "@/lib/queryClient";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import ErrorBoundary from "./components/ErrorBoundary";
import { GenericErrorComponent } from "./components/GenericErrorComponent";

// Create a new router instance with error handling
const router = createRouter({
    routeTree,
    defaultErrorComponent: GenericErrorComponent,
    context: undefined!,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}


const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
 
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>

 

);
