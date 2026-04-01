import { PublicSurveyListPage } from '@/modules/survey/pages/PublicSurveyListPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/public-surveys')({
    component: PublicSurveyListPage,
})
