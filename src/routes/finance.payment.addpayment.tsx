import { createFileRoute } from '@tanstack/react-router'
import AddPayment from "@/modules/finance/pages/AddPaymentPage"
export const Route = createFileRoute('/finance/payment/addpayment')({
  component: AddPayment,
})

