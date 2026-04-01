import { useState, useEffect } from 'react';
import type { Survey, SurveyResponses, Question, SurveyResponseValue } from '../types';
import { QuestionRenderer } from './QuestionRenderer';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { isSurveyOpen } from '../utils/surveyStatus';
import { Countdown } from './Countdown';

interface MultiStepSurveyFormProps {
  survey: Survey;
  onSubmit: (responses: SurveyResponses) => void;
  onCancel?: () => void;
}

export function MultiStepSurveyForm({ survey, onSubmit, onCancel }: MultiStepSurveyFormProps) {
  const { isOpen, message } = isSurveyOpen(survey);
  const storageKey = `survey_${survey.id}`;
  const stepStorageKey = `survey_step_${survey.id}`;
  const questions = Array.isArray(survey.questions) ? survey.questions : [];
  
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem(stepStorageKey);
    return savedStep ? parseInt(savedStep) : 0;
  });
  
  const [responses, setResponses] = useState<SurveyResponses>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [direction, setDirection] = useState(0);

  const groupedQuestions = questions.reduce((acc, question) => {
    const section = question.section || 'default';
    if (!acc[section]) acc[section] = [];
    acc[section].push(question);
    return acc;
  }, {} as Record<string, Question[]>);

  const sections = Object.keys(groupedQuestions);
  const currentSection = sections[currentStep];
  const currentQuestions = groupedQuestions[currentSection];
  const isLastStep = currentStep === sections.length - 1;

  const handleChange = (questionId: string, value: SurveyResponseValue) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    setErrors(prev => ({ ...prev, [questionId]: '' }));
  };

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(responses));
  }, [responses, storageKey]);

  useEffect(() => {
    localStorage.setItem(stepStorageKey, currentStep.toString());
  }, [currentStep, stepStorageKey]);

  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    currentQuestions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'Ce champ est requis';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setDirection(1);
      setCurrentStep(prev => Math.min(prev + 1, sections.length - 1));
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (isLastStep && validateCurrentStep()) {
      setShowConfirmModal(true);
    }
  };

  const confirmSubmit = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(stepStorageKey);
    onSubmit(responses);
    setShowConfirmModal(false);
  };

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        {survey.logo && (
          <motion.img 
            src={survey.logo} 
            alt="Logo" 
            className="w-24 h-24 mx-auto mb-4 object-contain"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        )}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{survey.title}</h2>
        {survey.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{survey.description}</p>
        )}
      </div>

      {survey.endDate && <Countdown endDate={survey.endDate} />}

      {/* Progress bar */}
      <motion.div 
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Étape {currentStep + 1} sur {sections.length}</span>
          <span>{Math.round(((currentStep + 1) / sections.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / sections.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

      {/* Current step */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {currentSection !== 'default' && (
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b pb-1">
              {currentSection}
            </h3>
          )}
          {currentQuestions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuestionRenderer
                question={question}
                value={responses[question.id]}
                onChange={(value) => handleChange(question.id, value)}
                error={errors[question.id]}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Navigation buttons */}
      <motion.div 
        className="flex gap-3 pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {currentStep > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handlePrevious}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <ChevronLeft size={20} />
            Précédent
          </motion.button>
        )}
        
        {onCancel && currentStep === 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Annuler
          </motion.button>
        )}

        <div className="flex-1" />

        {!isLastStep ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Suivant
            <ChevronRight size={20} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Soumettre
          </motion.button>
        )}
      </motion.div>

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
    </motion.div>
  );
}
