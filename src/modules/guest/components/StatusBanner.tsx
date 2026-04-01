import { Clock, Search, CheckCircle, XCircle } from 'lucide-react';
import { GUEST_STATUS_CONFIG } from '../constants';
import type { GuestAccountStatus } from '../types';

interface StatusBannerProps {
  status: GuestAccountStatus;
  showDetails?: boolean;
}

const iconMap = {
  Clock,
  Search,
  CheckCircle,
  XCircle,
};

export function StatusBanner({ status, showDetails = true }: StatusBannerProps) {
  const config = GUEST_STATUS_CONFIG[status];
  const Icon = iconMap[config.icon as keyof typeof iconMap];

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className={`${config.textColor} mt-0.5`}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold ${config.textColor}`}>
            {config.label}
          </h3>
          {showDetails && (
            <p className={`text-sm mt-1 ${config.textColor} opacity-90`}>
              {config.description}
            </p>
          )}
        </div>
        {status === 'pending' && (
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 dark:bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 dark:bg-amber-600"></span>
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">En cours</span>
          </div>
        )}
      </div>
    </div>
  );
}
