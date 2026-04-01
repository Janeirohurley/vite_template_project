import type { Survey } from '../types';

export function isSurveyOpen(survey: Survey): { isOpen: boolean; message?: string } {
  const now = new Date();
  
  if (survey.startDate) {
    const start = new Date(survey.startDate);
    if (now < start) {
      return {
        isOpen: false,
        message: `Ce formulaire ouvrira le ${start.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`
      };
    }
  }
  
  if (survey.endDate) {
    const end = new Date(survey.endDate);
    if (now > end) {
      return {
        isOpen: false,
        message: `Ce formulaire a été fermé le ${end.toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`
      };
    }
  }
  
  return { isOpen: true };
}
