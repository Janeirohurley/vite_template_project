import { GuestProfile } from '@/modules/guest'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/guest/profile')({
  component: GuestProfile,
})


