import { createFileRoute } from '@tanstack/react-router'
import { AuthErrorComponent } from '@/modules/auth/components'

export const Route = createFileRoute('/unauthorized')({
    component: UnauthorizedPage,
})

function UnauthorizedPage() {
    return (
        <AuthErrorComponent
            error={new Error('403 - Accès non autorisé')}
            reset={() => { }}
        />
    )
}