import { GeneralSettings } from '@/modules/admin/components/config/GeneralSettings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/configs/general')({
    component: GeneralSettings,
})
