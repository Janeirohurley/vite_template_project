import { SurveyBuilderPage } from '@/modules/survey/builder'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/survey-builder')({
    component: SurveyBuilderPage,
})
