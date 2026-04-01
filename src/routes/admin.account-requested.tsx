import { AccountRequestedPage } from "@/modules/admin/pages/AccountRequestedPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/admin/account-requested')({
    component: AccountRequestedPage,
}) 