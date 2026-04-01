import { SurveyListPage } from '@/modules/survey/pages/SurveyListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/surveys')({
    component: SurveyListPage,
})
