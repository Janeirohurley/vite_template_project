import { type ErrorComponentProps } from "@tanstack/react-router";
import { ErrorDisplay } from "./ErrorDisplay";

export function GenericErrorComponent({ error }: ErrorComponentProps) {
  let title = "Route error";
  let message = "Something unexpected happened while loading this page.";

  if (error instanceof Error) {
    title = error.name || "Error";
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  return <ErrorDisplay title={title} message={message} backUrl="/" backButtonText="Return home" />;
}
