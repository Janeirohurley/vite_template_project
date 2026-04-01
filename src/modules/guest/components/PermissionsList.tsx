import {
  User,
  Edit,
  Bell,
  Upload,
  Camera,
  BookOpen,
  Award,
  PlusCircle,
  Check,
  X,
} from 'lucide-react';
import { GUEST_PERMISSIONS } from '../constants';

const iconMap = {
  User,
  Edit,
  Bell,
  Upload,
  Camera,
  BookOpen,
  Award,
  PlusCircle,
};

export function PermissionsList() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Vos accès actuels
      </h3>

      {/* Actions autorisées */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-green-700 dark:text-green-400 mb-3 flex items-center gap-2">
          <Check className="w-4 h-4" />
          Actions disponibles
        </h4>
        <div className="space-y-2">
          {GUEST_PERMISSIONS.allowed.map((permission) => {
            const Icon = iconMap[permission.icon as keyof typeof iconMap];
            return (
              <div
                key={permission.action}
                className="flex items-center gap-3 p-2 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{permission.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions non disponibles */}
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
          <X className="w-4 h-4" />
          Fonctionnalités en attente de validation
        </h4>
        <div className="space-y-2">
          {GUEST_PERMISSIONS.forbidden.map((permission) => {
            const Icon = iconMap[permission.icon as keyof typeof iconMap];
            return (
              <div
                key={permission.action}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="text-xs">{permission.label}</span>
                </div>
                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md">
                  {permission.reason}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
