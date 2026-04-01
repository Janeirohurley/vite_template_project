import { useState, useEffect } from 'react';
import type { Survey, SurveyResponses, Question, SurveyResponseValue } from '../types';
import { QuestionRenderer } from './QuestionRenderer';
import { MultiStepSurveyForm } from './MultiStepSurveyForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { isSurveyOpen } from '../utils/surveyStatus';
import { Countdown } from './Countdown';

interface SurveyFormProps {
  survey: Survey;
  onSubmit: (responses: SurveyResponses) => void;
  onCancel?: () => void;
}

export function SurveyForm({ survey, onSubmit, onCancel }: SurveyFormProps) {
  const { isOpen, message } = isSurveyOpen(survey);
  const questions = Array.isArray(survey.questions) ? survey.questions : [];

 
  // Sinon, utiliser le formulaire classique
  const storageKey = `survey_${survey.id}`;
  const [responses, setResponses] = useState<SurveyResponses>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleChange = (questionId: string, value: SurveyResponseValue) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: '' }));
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(responses));
  }, [responses, storageKey]);


  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    questions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'Ce champ est requis';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setShowConfirmModal(true);
    }
  };

  const confirmSubmit = () => {
    localStorage.removeItem(storageKey);
    onSubmit(responses);
    setShowConfirmModal(false);
  };

  const groupedQuestions = questions.reduce((acc, question) => {
    const section = question.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(question);
    return acc;
  }, {} as Record<string, Question[]>);




  // Si multiStep est activé, utiliser le formulaire multi-étapes
  if (survey.multiStep) {
    return <MultiStepSurveyForm survey={survey} onSubmit={onSubmit} onCancel={onCancel} />;
  }

  if (!isOpen) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600"
      >
        <Lock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Formulaire fermé
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{message}</p>
      </motion.div>
    );
  }

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-gray-300 dark:border-gray-600"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Aucun questionnaire disponible
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Ce sondage ne contient aucune question pour le moment.
        </p>
      </motion.div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        {survey.logo && (
          <img 
            src={survey.logo} 
            alt="Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
          />
        )}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{survey.title}</h2>
        {survey.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{survey.description}</p>
        )}
      </div>

      {survey.endDate && <Countdown endDate={survey.endDate} />}

      {Object.entries(groupedQuestions).map(([section, questions]) => (
        <div key={section} className="space-y-4">
          {section !== 'default' && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-1">
              {section}
            </h3>
          )}
          {questions.map(question => (
            <QuestionRenderer
              key={question.id}
              question={question}
              value={responses[question.id]}
              onChange={(value) => handleChange(question.id, value)}
              error={errors[question.id]}
            />
          ))}
        </div>
      ))}

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Soumettre
        </button>
      </div>

      <Modal
        open={showConfirmModal}
        type="warning"
        title="Confirmer la soumission"
        description="Avez-vous bien révisé toutes vos réponses ? Une fois soumis, vous ne pourrez plus modifier le formulaire."
        onClose={() => setShowConfirmModal(false)}
        actions={
          <>
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Réviser
            </Button>
            <Button onClick={confirmSubmit}>
              Confirmer et soumettre
            </Button>
          </>
        }
      />
    </form>
  );
}
