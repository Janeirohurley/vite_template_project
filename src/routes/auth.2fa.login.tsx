import { TwoFactorLoginPage } from '@/modules/auth/pages/TwoFactorLoginPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/2fa/login')({
  component: TwoFactorLoginPage,
})
