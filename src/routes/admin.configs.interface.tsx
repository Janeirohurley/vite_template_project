import { InterfaceSettings } from '@/modules/admin/components/config/InterfaceSettings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/configs/interface')({
    component: InterfaceSettings,
})
