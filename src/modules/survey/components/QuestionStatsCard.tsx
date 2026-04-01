import { motion } from "framer-motion";
import { BarChart3, MessageSquare, Star } from "lucide-react";
import type { QuestionStats } from "../types/responses";

interface QuestionStatsCardProps {
  stats: QuestionStats;
  index: number;
}

export const QuestionStatsCard = ({ stats, index }: QuestionStatsCardProps) => {
  const renderStats = () => {
    // Radio, Select, Checkbox - Bar chart
    if (stats.optionCounts) {
      const total = Object.values(stats.optionCounts).reduce((a, b) => a + b, 0);
      const sortedOptions = Object.entries(stats.optionCounts).sort((a, b) => b[1] - a[1]);

      return (
        <div className="space-y-3">
          {sortedOptions.map(([option, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={option} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Rating - Stars and distribution
    if (stats.ratingDistribution && stats.averageRating !== undefined) {
      const maxRating = Math.max(...Object.keys(stats.ratingDistribution).map(Number));
      const total = Object.values(stats.ratingDistribution).reduce((a, b) => a + b, 0);

      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Moyenne sur {maxRating}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: maxRating }, (_, i) => maxRating - i).map((rating) => {
              const count = stats.ratingDistribution![rating] || 0;
              const percentage = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-8">
                    {rating} ★
                  </span>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="bg-yellow-500 h-2 rounded-full"
                    />
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Text/Textarea - Comments list
    if (stats.textResponses) {
      return (
        <div className="space-y-3">
          {stats.textResponses.length > 0 ? (
            stats.textResponses.map((response, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <p className="text-gray-800 dark:text-gray-200 text-sm mb-2">
                  {response.value}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {response.respondent && <span>• {response.respondent}</span>}
                  <span>• {new Date(response.date).toLocaleDateString("fr-FR")}</span>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 ">
              Aucune réponse textuelle
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  const getIcon = () => {
    if (stats.questionType === "rating") return <Star className="w-5 h-5 text-yellow-500" />;
    if (stats.questionType === "text" || stats.questionType === "textarea")
      return <MessageSquare className="w-5 h-5 text-blue-500" />;
    return <BarChart3 className="w-5 h-5 text-green-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-4"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">{getIcon()}</div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {stats.questionLabel}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats.totalResponses} réponse{stats.totalResponses > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      {stats.totalResponses > 0 && <div className="pt-2">{renderStats()}</div>}
    </motion.div>
  );
};
