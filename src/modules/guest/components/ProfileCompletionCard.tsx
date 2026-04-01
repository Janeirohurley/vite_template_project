import { User, ArrowRight, CheckCircle } from 'lucide-react';
import { GUEST_MESSAGES } from '../constants';

interface ProfileCompletionCardProps {
  completionPercentage: number;
  onComplete?: () => void;
}

export function ProfileCompletionCard({
  completionPercentage,
  onComplete,
}: ProfileCompletionCardProps) {
  const isComplete = completionPercentage >= 100;

  if (isComplete) {
    return (
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-green-800 dark:text-green-400">
              {GUEST_MESSAGES.noAction.title}
            </h3>
            <p className="text-sm text-green-600 dark:text-green-500 mt-0.5">
              {GUEST_MESSAGES.noAction.description}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
          <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-amber-800 dark:text-amber-400">
            {GUEST_MESSAGES.profileIncomplete.title}
          </h3>
          <p className="text-sm text-amber-600 dark:text-amber-500 mt-0.5">
            {GUEST_MESSAGES.profileIncomplete.description}
          </p>

          {/* Barre de progression */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-amber-700 dark:text-amber-400 mb-1">
              <span>Progression</span>
              <span className="font-medium">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-amber-200 dark:bg-amber-900/50 rounded-full h-2">
              <div
                className="bg-amber-500 dark:bg-amber-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            onClick={onComplete}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition-colors"
          >
            {GUEST_MESSAGES.profileIncomplete.cta}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
