import HighSchoolAdminPage from '@/modules/student-service/pages/HighSchoolAdminPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/highschool-infos')({
  component: HighSchoolAdminPage,
})

