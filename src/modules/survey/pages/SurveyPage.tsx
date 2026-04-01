/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyForm } from '../components/SurveyForm';
import { useSubmitSurveyResponse, useSurvey } from '../hooks/useSurvey';
import { useSearch } from '@tanstack/react-router';
import type { SurveyResponses } from '../types';
import { notify } from '@/lib';

export function SurveyPage() {
  const search = useSearch({ strict: false }) as { surveyId?: string; id?: string };
  const surveyId = search.surveyId ?? search.id ?? '';
  const { data: survey, isLoading } = useSurvey(surveyId);
  const submitResponse = useSubmitSurveyResponse();

  const handleSubmit = async (responses: SurveyResponses) => {
    console.log('Submitting survey response:', { surveyId, responses });
    if (!survey) return;
    
    try {
      await submitResponse.mutateAsync({
        surveyId: survey.id,
        response: {
          surveyId: survey.id,
          responses,
        },
      });
      notify.success('Enquête soumise avec succès !');
    } catch (error) {
      notify.error('Erreur lors de la soumission');
    }
  };

  const handleCancel = () => {
    notify.info('Enquête annulée');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Sondage introuvable</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <SurveyForm
        survey={survey}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
