import DevelopmentPage from '@/pages/DevelopmentPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/development')({
  component: DevelopmentPage,
})

