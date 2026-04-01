import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ProgressStep } from '../types';

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep?: number;
}

export function ProgressTracker({ steps, currentStep = 1 }: ProgressTrackerProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Progression de votre dossier
      </h3>
      <div className="relative">
        {/* Ligne de connexion */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = step.current || step.id === currentStep;
            const isCompleted = step.completed;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-start gap-4"
              >
                {/* Indicateur */}
                <div
                  className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all shrink-0
                    ${isCompleted
                      ? 'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600 text-white'
                      : isActive
                        ? 'bg-blue-500 dark:bg-blue-600 border-blue-500 dark:border-blue-600 text-white'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : isActive ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold">{step.id}</span>
                  )}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium leading-tight
                      ${isCompleted
                        ? 'text-green-700 dark:text-green-400'
                        : isActive
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p
                      className={`text-xs mt-0.5
                        ${isCompleted
                          ? 'text-green-600 dark:text-green-500'
                          : isActive
                            ? 'text-blue-600 dark:text-blue-500'
                            : 'text-gray-400 dark:text-gray-500'
                        }`}
                    >
                      {step.description}
                    </p>
                  )}
                  {isActive && !isCompleted && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-blue-500 dark:text-blue-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></span>
                      En cours
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
