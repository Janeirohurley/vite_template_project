import { useSurvey, useSurveyStats } from "../hooks/useSurvey";
import { SurveyResponsesViewer } from "../components/SurveyResponsesViewer";
import { useSearch } from "@tanstack/react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const SurveyResponsesPage = () => {
  const search = useSearch({ strict: false }) as { surveyId?: string; id?: string };
  const surveyId = search.surveyId ?? search.id ?? "";
  const { data: survey, isLoading: surveyLoading } = useSurvey(surveyId);
  const { data: stats, isLoading: statsLoading } = useSurveyStats(surveyId);

  if (surveyLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!survey || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Sondage introuvable</div>
      </div>
    );
  }

  return <ProtectedRoute requiredRole={"admin"}><SurveyResponsesViewer survey={survey} stats={stats} />;</ProtectedRoute>
};
