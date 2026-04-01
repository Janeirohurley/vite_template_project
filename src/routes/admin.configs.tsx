import { ConfigurationPage } from '@/modules/admin/pages'
import { createFileRoute } from '@tanstack/react-router'


export const Route = createFileRoute('/admin/configs')({
    component: ConfigurationPage,
})
