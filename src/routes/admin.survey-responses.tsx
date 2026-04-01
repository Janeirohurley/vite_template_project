import { SurveyResponsesPage } from '@/modules/survey/pages/SurveyResponsesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/survey-responses')({
    component: SurveyResponsesPage,
})
