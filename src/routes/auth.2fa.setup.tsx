import { Setup2FAPage } from "@/modules/auth/pages/Setup2FAPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/auth/2fa/setup')({
    component: Setup2FAPage,
})