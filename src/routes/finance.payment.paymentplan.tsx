import { createFileRoute } from '@tanstack/react-router'
import PaymentPlan from "@/modules/finance/pages/Paymentplan"
export const Route = createFileRoute('/finance/payment/paymentplan')({
  component: PaymentPlan,
})

