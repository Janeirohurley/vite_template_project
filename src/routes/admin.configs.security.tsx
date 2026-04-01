import { SecuritySettings } from '@/modules/admin/components/config/SecuritySettings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/configs/security')({
    component: SecuritySettings,
})
