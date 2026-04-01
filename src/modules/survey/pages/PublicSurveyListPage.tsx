import { useSurveys } from "../hooks/useSurvey";
import { motion } from "framer-motion";
import { Calendar, Eye } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { isSurveyOpen } from "../utils/surveyStatus";

export const PublicSurveyListPage = () => {
  const { data: surveys, isLoading } = useSurveys();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Sondages publics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choisissez un sondage et répondez aux questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys?.results?.map((survey, index) => {
            const { isOpen, message } = isSurveyOpen(survey);
            return (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {survey.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {survey.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span
                    className={`${
                      isOpen
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {message}
                  </span>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {survey.questions.length} question{survey.questions.length > 1 ? "s" : ""}
                </div>

                <button
                  onClick={() =>
                    navigate({ to: "/survey", search: { surveyId: survey.id } })
                  }
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Eye className="w-4 h-4" />
                  Répondre
                </button>
              </motion.div>
            );
          })}
        </div>

        {surveys?.results?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Aucun sondage public disponible
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
