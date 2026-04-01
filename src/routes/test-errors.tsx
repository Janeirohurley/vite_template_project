import { createFileRoute } from '@tanstack/react-router'
import { ErrorTestComponent } from '@/components/ErrorTestComponent'

export const Route = createFileRoute('/test-errors')({
    component: ErrorTestComponent,
})
