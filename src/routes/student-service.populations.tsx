import { PopulationsPage } from '@/modules/student-service'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/student-service/populations')({
    component: PopulationsPage,
})


