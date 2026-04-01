import { useState, useEffect, useCallback } from 'react';
import { Step1UserInfo } from './user-steps/Step1UserInfo';
import { Step2ProfileCreation } from './user-steps/Step2ProfileCreation';
import {
  saveUserDraft,
  markUserDraftComplete,
  generateUserSessionId,
  type UserCreationDraft
} from '@/lib/userCreationDB';
import { notify } from '@/lib';
import { Modal } from './academic';

interface UserCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  resumeDraft?: UserCreationDraft;
}

export function UserCreationWizard({ isOpen, onClose, onComplete, resumeDraft }: UserCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<UserCreationDraft['userData']>({});
  const [profileData, setProfileData] = useState<UserCreationDraft['profileData']>({});
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (resumeDraft) {
        setSessionId(resumeDraft.sessionId);
        setCurrentStep(resumeDraft.currentStep);
        setUserData(resumeDraft.userData);
        setProfileData(resumeDraft.profileData);
        notify.success('Création reprise');
      } else {
        const newSessionId = generateUserSessionId();
        setSessionId(newSessionId);
        setCurrentStep(1);
        setUserData({});
        setProfileData({});
      }

      
    }
  }, [isOpen, resumeDraft]);

  const steps = [
    { number: 1, title: 'Informations Utilisateur' },
    { number: 2, title: 'Création du Profile' },
  ];

  const handleAutoSaveStep1 = useCallback((data: UserCreationDraft['userData']) => {
    setUserData(data);
  }, []);

  const handleAutoSaveStep2 = useCallback((data: UserCreationDraft['profileData']) => {
    setProfileData(data);
  }, []);

  const handleClose = async () => {
    if (sessionId && userData.id && (Object.keys(userData).length > 0 || Object.keys(profileData).length > 0)) {
      await saveUserDraft(sessionId, currentStep, userData, profileData);
    }
    onClose();
  };

  const handleStep1Next = async (data: UserCreationDraft['userData']) => {
    if (!data.id) {
      notify.error('ID utilisateur manquant');
      return;
    }
    setUserData(data);
    setCurrentStep(2);
    await saveUserDraft(sessionId, 2, data, profileData);
  };

  const handleStep2Next = async (data: UserCreationDraft['profileData']) => {
    setProfileData(data);
    await markUserDraftComplete(sessionId);
    notify.success('Utilisateur et profile créés avec succès');
    onComplete();
  };

  const handlePrevious = async () => {
    const prevStep = Math.max(1, currentStep - 1);
    setCurrentStep(prevStep);
    if (userData.id) {
      await saveUserDraft(sessionId, prevStep, userData, profileData);
    }
  };

  if (!isOpen) return null;
  return (

    <Modal
      title="Création d' un profile"
      subtitle={` Session: ${sessionId.split('_')[2]}`}
      onClose={handleClose}
      isOpen
      subHeaderChildren={
        <>
         {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`flex items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step.number <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300'
                      }`}
                  >
                    {step.number}
                  </div>
                  {index < steps.length - 1 && (
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

          <div className="p-3 mt-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Note:</strong> Avant de proceder a la creation d'un profile utilisateur veuillez choisir la personne dont vous voulez donne a ce profile sinon creez-une.
            </p>
          </div>
        </>
      }
    >

          {currentStep === 1 && (
            <Step1UserInfo
              data={{ userData, profileData }}
              onNext={handleStep1Next}
              onAutoSave={handleAutoSaveStep1}
            />
          )}
          {currentStep === 2 && (
            <Step2ProfileCreation
              data={{ userData, profileData }}
              onNext={handleStep2Next}
              onPrevious={handlePrevious}
              onAutoSave={handleAutoSaveStep2}
            />
          )}
   

    </Modal>
  );
}
