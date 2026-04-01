import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPasswordPage,
})

