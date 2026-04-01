import { Heart, HardDrive, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemMaintenanceCardProps {
    systemStatus?: string;
    uptime?: string;
    storageUsed?: string;
    storageTotal?: string;
    storagePercent?: number;
    onBackup?: () => void;
    onRestore?: () => void;
    className?: string;
}

export function SystemMaintenanceCard({
    systemStatus = "Opérationnel",
    uptime = "99.9%",
    storageUsed = "2.1 TB",
    storageTotal = "3.2 TB",
    storagePercent = 67,
    onBackup,
    onRestore,
    className,
}: SystemMaintenanceCardProps) {
    return (
        <div
            className={cn(
                "bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4",
                className
            )}
        >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Maintenance Système
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* État du système */}
                <div className="text-center">
                    <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="text-green-600 dark:text-green-400 h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                        État du Système
                    </h3>
                    <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                        {systemStatus}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Uptime: {uptime}
                    </p>
                </div>

                {/* Stockage */}
                <div className="text-center">
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <HardDrive className="text-blue-600 dark:text-blue-400 h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">
                        Stockage
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                        {storagePercent}% utilisé
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {storageUsed} / {storageTotal}
                    </p>
                </div>

                {/* Actions */}
                <div className="text-center">
                    <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Wrench className="text-orange-600 dark:text-orange-400 h-6 w-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-2">
                        Actions
                    </h3>

                    <div className="space-y-2">
                        <button
                            onClick={onBackup}
                            className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700 transition-colors"
                        >
                            Sauvegarde d'urgence
                        </button>

                        <button
                            onClick={onRestore}
                            className="w-full bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm hover:bg-gray-600 transition-colors"
                        >
                            Outils de restauration
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
