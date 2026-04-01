
import { AccountReviewPage } from "@/modules/admin/pages/AccountReviewPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/admin/account-review')({
    component: AccountReviewPage,
}) 