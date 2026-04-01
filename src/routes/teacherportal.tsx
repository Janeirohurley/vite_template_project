import { createFileRoute } from '@tanstack/react-router'
import TeacherPage from "@/modules/home/TeacherPortalPage"
export const Route = createFileRoute('/teacherportal')({
  component: TeacherPage,
})

