import { GeographieManagment } from '@/modules/admin/pages/GeographieManagment'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/geographie')({
  component: GeographieManagment,
})


