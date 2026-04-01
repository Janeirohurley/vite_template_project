import { createFileRoute } from '@tanstack/react-router'
import Financedashbord from "@/modules/finance/pages/FinanceDashboard"
export const Route = createFileRoute('/finance/dashbord')({
  component: Financedashbord,
})

