import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/')({
  component: ()=><Navigate to='/dean/dashboard'/>
})
