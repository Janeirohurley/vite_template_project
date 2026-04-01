import { CourseProgressPage } from '@/modules/doyen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/progress')({
  component: CourseProgressPage,
})
