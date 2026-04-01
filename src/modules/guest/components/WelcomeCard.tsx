import { GraduationCap, UserCheck, Mail, Unlock } from 'lucide-react';
import { GUEST_MESSAGES } from '../constants';

const stepIcons = {
  UserCheck,
  Mail,
  Unlock,
};

export function WelcomeCard() {
  const { welcome, whatNext } = GUEST_MESSAGES;

  return (
    <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl border border-blue-100 dark:border-gray-800 p-6 mb-6">
      {/* En-tête de bienvenue */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
          <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{welcome.title}</h1>
          <p className="text-blue-600 dark:text-blue-400 font-medium">{welcome.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
        {welcome.description}
      </p>

      {/* Étapes suivantes */}
      <div className="bg-white/60 dark:bg-gray-900/60 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
          {whatNext.title}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {whatNext.steps.map((step, index) => {
            const Icon = stepIcons[step.icon as keyof typeof stepIcons];
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-full mb-2">
                  <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">{step.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
