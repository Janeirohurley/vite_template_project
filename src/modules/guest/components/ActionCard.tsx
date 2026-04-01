import { ArrowRight, Lock } from 'lucide-react';
import type { ReactNode } from 'react';

interface ActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  disabledReason?: string;
  variant?: 'default' | 'primary' | 'warning';
}

export function ActionCard({
  title,
  description,
  icon,
  onClick,
  disabled = false,
  disabledReason,
  variant = 'default',
}: ActionCardProps) {
  const baseStyles = 'relative rounded-lg border p-4 transition-all';

  const variantStyles = {
    default: disabled
      ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-60'
      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md cursor-pointer',
    primary: disabled
      ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-60'
      : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md cursor-pointer',
    warning: disabled
      ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 cursor-not-allowed opacity-60'
      : 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md cursor-pointer',
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]}`}
      onClick={disabled ? undefined : onClick}
      role={disabled ? undefined : 'button'}
      tabIndex={disabled ? undefined : 0}
      onKeyDown={disabled ? undefined : (e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="flex items-start gap-3">
        <div className={`${disabled ? 'text-gray-400 dark:text-gray-500' : variant === 'primary' ? 'text-blue-600 dark:text-blue-400' : variant === 'warning' ? 'text-amber-600 dark:text-amber-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-medium ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
            {title}
          </h3>
          <p className={`text-sm mt-0.5 ${disabled ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'}`}>
            {description}
          </p>
          {disabled && disabledReason && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400 dark:text-gray-500">
              <Lock className="w-3 h-3" />
              <span>{disabledReason}</span>
            </div>
          )}
        </div>
        {!disabled && (
          <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
        )}
      </div>
    </div>
  );
}
