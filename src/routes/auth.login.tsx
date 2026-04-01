import { createFileRoute } from '@tanstack/react-router'
import { LoginPage } from '@/modules/auth/pages'
import { GuestOnlyRoute } from '@/modules/auth/components/GuestOnlyRoute'

export const Route = createFileRoute('/auth/login')({
  component: () => (
    <GuestOnlyRoute>
      <LoginPage />
    </GuestOnlyRoute>
  ),
})
