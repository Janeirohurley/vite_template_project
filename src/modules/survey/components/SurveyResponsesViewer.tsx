import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, FileText, Filter } from "lucide-react";
import { QuestionStatsCard } from "./QuestionStatsCard";
import type { Survey } from "../types";
import type { SurveyStats } from "../types/responses";

interface SurveyResponsesViewerProps {
  survey: Survey;
  stats: SurveyStats;
}

export const SurveyResponsesViewer = ({ survey, stats }: SurveyResponsesViewerProps) => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const sections = useMemo(() => {
    const sectionSet = new Set(survey.questions.map((q) => q.section));
    return Array.from(sectionSet);
  }, [survey]);

  const filteredStats = useMemo(() => {
    if (!selectedSection) return stats.questionStats;
    return stats.questionStats.filter((qs) => {
      const question = survey.questions.find((q) => q.id === qs.questionId);
      return question?.section === selectedSection;
    });
  }, [stats, selectedSection, survey]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {survey.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">{survey.description}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total réponses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalResponses}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Questions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {survey.questions.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Filter className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sections</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {sections.length}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section Filter */}
        {sections.length > 1 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setSelectedSection(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSection === null
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                Toutes les sections
              </button>
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setSelectedSection(section)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedSection === section
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Stats */}
        <div className="space-y-6">
          {filteredStats.length > 0 ? (
            filteredStats.map((questionStats, index) => (
              <QuestionStatsCard key={questionStats.questionId} stats={questionStats} index={index} />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">Aucune réponse disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
