import { createFileRoute } from '@tanstack/react-router'
import Wording from "@/modules/finance/pages/WordingManagement"
export const Route = createFileRoute('/finance/wording')({
  component: Wording,
})
