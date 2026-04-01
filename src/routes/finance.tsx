import FinanceLayout from '@/modules/finance/layouts/FinanceLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/finance')({
  component: ()=><FinanceLayout><Outlet/></FinanceLayout>,
})

