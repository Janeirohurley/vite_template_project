import { createFileRoute } from '@tanstack/react-router'
import Banks from "@/modules/finance/pages/BanksManagment"
export const Route = createFileRoute('/finance/banks')({
  component: Banks,
})


