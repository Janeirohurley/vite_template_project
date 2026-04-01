import { createFileRoute } from '@tanstack/react-router'
import StudentPage from "@/modules/home/StudentPortalPage"
export const Route = createFileRoute('/studentportal')({
  component: StudentPage,
})

