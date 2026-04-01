import { useSurveys, useDeleteSurvey } from "../hooks/useSurvey";
import { motion } from "framer-motion";
import { Plus, Eye, BarChart3, Trash2, Calendar, Link, Edit } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { isSurveyOpen } from "../utils/surveyStatus";
import { notify } from "@/lib";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export const SurveyListPage = () => {
  const { data: surveys, isLoading } = useSurveys();
  const deleteSurvey = useDeleteSurvey();
  const navigate = useNavigate();
  const [surveyToDelete, setSurveyToDelete] = useState<{ id: string; title: string } | null>(null);

  const copySurveyLink = async (surveyId: string) => {
    const url = `${window.location.origin}/survey?surveyId=${surveyId}`;
    try {
      await navigator.clipboard.writeText(url);
      notify.success("Lien du sondage copié !");
    } catch {
      notify.error("Impossible de copier le lien");
    }
  };

  const handleDelete = async () => {
    if (!surveyToDelete) return;

    try {
      await deleteSurvey.mutateAsync(surveyToDelete.id);
      notify.success("Sondage supprimé avec succès");
      setSurveyToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      notify.error("Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mes Sondages
          </h1>
          <button
            onClick={() => navigate({ to: "/admin/survey-builder" })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Créer un sondage
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys?.results?.map((survey, index) => {
            const { isOpen, message } = isSurveyOpen(survey);
            return (
              <motion.div
                key={survey.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() =>
                      navigate({ to: "/survey", search: { surveyId: survey.id } })
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    Voir
                  </button>
                  <button
                    onClick={() =>
                      navigate({ to: "/admin/survey-builder", search: { surveyId: survey.id } })
                    }
                    className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    title="Éditer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => copySurveyLink(survey.id)}
                    className="px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                    title="Copier le lien public"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      navigate({ to: "/admin/survey-responses", search: { surveyId: survey.id } })
                    }
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Stats
                  </button>
                  <button
                    onClick={() => setSurveyToDelete({ id: survey.id, title: survey.title })}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {surveys?.results?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Aucun sondage créé
            </p>
            <button
              onClick={() => navigate({ to: "/admin/survey-builder" })}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Créer votre premier sondage
            </button>
          </div>
        )}

        <AlertDialog open={Boolean(surveyToDelete)} onOpenChange={(open) => !open && setSurveyToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce sondage ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le sondage
                {surveyToDelete?.title ? ` « ${surveyToDelete.title} »` : ""} sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  void handleDelete();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
