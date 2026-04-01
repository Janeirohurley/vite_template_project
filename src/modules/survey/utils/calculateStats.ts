import type { Survey } from "../types";
import type { SurveyResponse, QuestionStats, SurveyStats } from "../types/responses";

export const calculateSurveyStats = (
  survey: Survey,
  responses: SurveyResponse[]
): SurveyStats => {
  const questionStats: QuestionStats[] = survey.questions.map((question) => {
    const stats: QuestionStats = {
      questionId: question.id,
      questionLabel: question.label,
      questionType: question.type,
      totalResponses: 0,
    };

    const relevantResponses = responses.filter((r) => r.responses[question.id] !== undefined);
    stats.totalResponses = relevantResponses.length;

    if (question.type === "radio" || question.type === "select") {
      stats.optionCounts = {};
      relevantResponses.forEach((response) => {
        const value = response.responses[question.id];
        stats.optionCounts![value] = (stats.optionCounts![value] || 0) + 1;
      });
    } else if (question.type === "checkbox") {
      stats.optionCounts = {};
      relevantResponses.forEach((response) => {
        const values = response.responses[question.id] as string[];
        values?.forEach((value) => {
          stats.optionCounts![value] = (stats.optionCounts![value] || 0) + 1;
        });
      });
    } else if (question.type === "rating") {
      stats.ratingDistribution = {};
      let sum = 0;
      relevantResponses.forEach((response) => {
        const rating = response.responses[question.id] as number;
        stats.ratingDistribution![rating] = (stats.ratingDistribution![rating] || 0) + 1;
        sum += rating;
      });
      stats.averageRating = relevantResponses.length > 0 ? sum / relevantResponses.length : 0;
    } else if (question.type === "text" || question.type === "textarea") {
      stats.textResponses = relevantResponses
        .map((response) => ({
          value: response.responses[question.id] as string,
          respondent: response.respondentName || response.respondentEmail,
          date: response.submittedAt,
        }))
        .filter((r) => r.value && r.value.trim() !== "");
    }

    return stats;
  });

  return {
    surveyId: survey.id,
    surveyTitle: survey.title,
    totalResponses: responses.length,
    questionStats,
  };
};
