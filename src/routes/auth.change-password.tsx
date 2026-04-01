import { createFileRoute } from '@tanstack/react-router'
import { ChangePasswordPage } from '@/modules/auth/pages'

export const Route = createFileRoute('/auth/change-password')({
    component: ChangePasswordPage,
})
