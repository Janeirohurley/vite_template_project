import { SurveyPage } from '@/modules/survey'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/survey')({
  component: SurveyPage,
})
