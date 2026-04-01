
import { SchedulesPageNew } from '@/modules/doyen/pages/SchedulesPageNew'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/schedules')({
  component: SchedulesPageNew,
})

