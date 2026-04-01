/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import type { InscriptionFormData } from '@/types/inscription.d';
import { Step1UserSelection } from './inscription-steps/Step1UserSelection';
import { Step2ParentInfo } from './inscription-steps/Step2ParentInfo';
import { Step3HighschoolInfo } from './inscription-steps/Step3HighschoolInfo';
import { Step4UniversityInfo } from './inscription-steps/Step4UniversityInfo';
import { Step5FinalInscription } from './inscription-steps/Step5FinalInscription';
import { Step6Payment } from './inscription-steps/Step6Payment';
import {
  saveInscriptionDraft,
  markDraftAsCompleted,
  generateSessionId,
  type InscriptionDraft
} from '@/lib/inscriptionDB';
import { notify } from '@/lib';

interface InscriptionWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: InscriptionFormData) => void;
  resumeDraft?: InscriptionDraft;
}

export function InscriptionWizard({ isOpen, onClose, onComplete, resumeDraft }: InscriptionWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<InscriptionFormData>>({});
  // ...existing code...
  const [sessionId, setSessionId] = useState<string>('');

  // Initialize or resume draft
  useEffect(() => {
    if (isOpen) {
      if (resumeDraft) {
        setSessionId(resumeDraft.sessionId);
        setCurrentStep(resumeDraft.currentStep);
        setFormData(resumeDraft.formData);

        notify.success('Inscription reprise');
      } else {
        // Nouvelle inscription : toujours un nouveau sessionId, jamais de chargement automatique de brouillon
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        setCurrentStep(1);
        setFormData({});

      }
    }
  }, [isOpen, resumeDraft]);

  const steps = [
    { number: 1, title: 'Sélection Utilisateur', component: Step1UserSelection },
    { number: 2, title: 'Informations Parents', component: Step2ParentInfo },
    { number: 3, title: 'Informations Lycée', component: Step3HighschoolInfo },
    { number: 4, title: 'Informations Universitaires', component: Step4UniversityInfo },
    { number: 5, title: 'Inscription Finale', component: Step5FinalInscription },
    { number: 6, title: "Frais d'inscription", component: Step6Payment },
  ];

  const handleAutoSave = useCallback((stepData: any) => {
    const stepKey = `step${currentStep}` as keyof InscriptionFormData;
    const updatedData = { ...formData, [stepKey]: stepData };
    setFormData(updatedData);
  }, [currentStep, formData]);

  const handleClose = async () => {
    if (sessionId && Object.keys(formData).length > 0) {
      await saveInscriptionDraft(sessionId, currentStep, formData);
    }
    onClose();
  };

  const handleNext = async (stepData: any) => {
    const stepKey = `step${currentStep}` as keyof InscriptionFormData;
    const updatedData = { ...formData, [stepKey]: stepData };
    setFormData(updatedData);
    console.log(formData)
    if (currentStep === 6) {
      // Step 6 (paiement) is the final step
      await markDraftAsCompleted(sessionId);
      onComplete(updatedData as InscriptionFormData);
    } else if (currentStep === 5) {
      // After Step 5 (Final Inscription), go to Step 6 (Paiement)
      const nextStep = 6;
      setCurrentStep(nextStep);
      await saveInscriptionDraft(sessionId, nextStep, updatedData);
    } else {
      // Skip step 4 for new high school graduates
      if (currentStep === 3 && !stepData.has_university_background) {
        setCurrentStep(5);
        await saveInscriptionDraft(sessionId, 5, updatedData);
      } else {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        await saveInscriptionDraft(sessionId, nextStep, updatedData);
      }
    }
  };

  const handlePrevious = async () => {
    let prevStep;
    if (currentStep === 5 && !formData.step4) {
      prevStep = 3; // Skip step 4 when going back
    } else if (currentStep === 6 && !formData.step4) {
      prevStep = 5; // From Step 6, go back to Step 5
    } else {
      prevStep = Math.max(1, currentStep - 1);
    }
    setCurrentStep(prevStep);
    await saveInscriptionDraft(sessionId, prevStep, formData);
  };

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900/70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Nouvelle Inscription</h2>
            <div className="flex items-center gap-2">
              {sessionId && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Session: {sessionId.split('_')[2]}
                </span>
              )}
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center ${step.number < steps.length ? 'flex-1' : ''
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.number <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                  >
                    {step.number}
                  </div>
                  {step.number < steps.length && (
                    <div
                      className={`flex-1 h-1 mx-2 ${step.number < currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Étape {currentStep} sur {steps.length}: {steps[currentStep - 1]?.title}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {CurrentStepComponent && (
            <CurrentStepComponent
              data={formData}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onAutoSave={handleAutoSave}
            />
          )}
        </div>
      </div>
    </div>
  );
}