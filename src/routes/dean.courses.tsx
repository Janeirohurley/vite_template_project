import { CoursesPage } from '@/modules/doyen'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dean/courses')({
  component: CoursesPage,
})

