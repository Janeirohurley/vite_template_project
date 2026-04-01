import type { SurveyResponse } from "../types/responses";
import type { Survey } from "../types";

export const generateMockResponses = (survey: Survey, count: number = 50): SurveyResponse[] => {
  const responses: SurveyResponse[] = [];
  const names = ["Alice Martin", "Bob Dupont", "Claire Bernard", "David Petit", "Emma Dubois"];
  
  for (let i = 0; i < count; i++) {
    const response: SurveyResponse = {
      id: `response_${i + 1}`,
      surveyId: survey.id,
      respondentName: names[i % names.length],
      respondentEmail: `user${i + 1}@example.com`,
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      responses: {},
    };

    survey.questions.forEach((question) => {
      if (question.type === "text") {
        response.responses[question.id] = Math.random() > 0.3 
          ? `Réponse ${i + 1} pour ${question.label}` 
          : "";
      } else if (question.type === "textarea") {
        response.responses[question.id] = Math.random() > 0.4
          ? `Ceci est une réponse détaillée numéro ${i + 1}. ${question.label} est important pour améliorer le système.`
          : "";
      } else if (question.type === "radio" || question.type === "select") {
        const options = (question as any).options || [];
        response.responses[question.id] = options[Math.floor(Math.random() * options.length)];
      } else if (question.type === "checkbox") {
        const options = (question as any).options || [];
        const selectedCount = Math.floor(Math.random() * options.length) + 1;
        response.responses[question.id] = options
          .sort(() => Math.random() - 0.5)
          .slice(0, selectedCount);
      } else if (question.type === "rating") {
        const max = (question as any).max || 5;
        response.responses[question.id] = Math.floor(Math.random() * max) + 1;
      }
    });

    responses.push(response);
  }

  return responses;
};
