import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/finance/')({
  component: ()=><Navigate to="/finance/dashbord"/>
})

