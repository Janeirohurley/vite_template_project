import { NotificationSettings } from '@/modules/admin/components/config/NotificationSettings'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/configs/notifications')({
    component: NotificationSettings,
})
