import HighSchoolInfoPage from '@/modules/student-service/pages/HighSchoolInfoPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/student-service/highschool-infos',
)({
  component: HighSchoolInfoPage,
})


