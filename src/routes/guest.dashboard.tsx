import { GuestDashboard } from '@/modules/guest'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/guest/dashboard')({
  component: GuestDashboard,
})


