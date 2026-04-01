import { createFileRoute } from '@tanstack/react-router'
import Installments from "@/modules/finance/pages/InstallmentsPage"
export const Route = createFileRoute('/finance/payment/studentpaymentdetails')({
  component: Installments,
})

