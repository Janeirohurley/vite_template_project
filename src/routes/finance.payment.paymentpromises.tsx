import { createFileRoute } from '@tanstack/react-router'
import PaymentPromises from "@/modules/finance/pages/PaymentPromisesPage"
export const Route = createFileRoute('/finance/payment/paymentpromises')({
  component: PaymentPromises,
})

