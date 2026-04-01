import { createFileRoute } from '@tanstack/react-router'
import Finance from "@/modules/finance/pages/FeesSheetsPage"
export const Route = createFileRoute('/finance/feessheets')({
  component: Finance,
})

