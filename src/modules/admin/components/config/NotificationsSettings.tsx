import { useState, type JSX } from "react";
import { Mail, Bell, Info, Calendar } from "lucide-react";
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { Input } from "@/components/ui/input";

interface NotificationSetting {
    key: string;
    label: string;
    description: string;
    icon: JSX.Element;
}

export function NotificationsSettings() {
    const notificationOptions: NotificationSetting[] = [
        { key: "welcome", label: "Email de bienvenue", description: "Envoyé lors de la création d'un compte", icon: <Mail className="w-4 h-4 text-blue-600" /> },
        { key: "passwordReset", label: "Réinitialisation mot de passe", description: "Confirmation des changements de mot de passe", icon: <Mail className="w-4 h-4 text-red-600" /> },
        { key: "systemAlert", label: "Alertes système", description: "Notifications d'erreurs et problèmes", icon: <Bell className="w-4 h-4 text-yellow-600" /> },
        { key: "maintenance", label: "Avis de maintenance", description: "Notifications de maintenance programmée", icon: <Info className="w-4 h-4 text-gray-600" /> },
        { key: "weeklySummary", label: "Résumé hebdomadaire", description: "Rapport d'activité hebdomadaire", icon: <Calendar className="w-4 h-4 text-green-600" /> },
    ];

    const [notifications, setNotifications] = useState<Record<string, boolean>>({
        welcome: true,
        passwordReset: true,
        systemAlert: true,
        maintenance: true,
        weeklySummary: false,
    });

    const [alertLevel, setAlertLevel] = useState("medium");
    const [adminEmails, setAdminEmails] = useState("admin@universite.bi");

    const toggleNotification = (key: string) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const saveSettings = () => {
        // ici tu peux appeler ton API pour sauvegarder
        console.log({ notifications, alertLevel, adminEmails });
        alert("Paramètres sauvegardés !");
    };

    return (<div className="space-y-6"> <h4 className="text-base font-medium text-gray-900 dark:text-gray-100">Emails automatiques</h4>
        <div className="space-y-3">
            {notificationOptions.map((option) => (
                <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-2">
                        {option.icon}
                        <div className="flex flex-col text-xs">
                            <span className="font-medium text-gray-800 dark:text-gray-200">{option.label}</span>
                            <span className="text-gray-500 dark:text-gray-400">{option.description}</span>
                        </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={notifications[option.key]}
                            onChange={() => toggleNotification(option.key)}
                        />
                        <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:rounded-full after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>
            ))}
        </div>

        {/* Paramètres avancés */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           

            <SingleSelectDropdown
                label="niveau d'alerte"
                
                value={alertLevel}
                options={[
                    {
                        id: "1",
                        label: "faible",
                        value: "low"
                    },
                    {
                        id: "2",
                        label: "Moyen",
                        value: "medium"
                    },
                    {
                        id: "3",
                        label: "Élevé",
                        value: "high"
                    },
                    {
                        id: "4",
                        label: "Critique",
                        value: "critical"
                    }
                ]}
                onChange={setAlertLevel}
            />

            <div>
                <label className="block text-sm  font-medium text-gray-700 dark:text-gray-300 mb-1">Emails administrateurs</label>
                <Input
                    type="email"
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg t dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                    value={adminEmails}
                    onChange={(e) => setAdminEmails(e.target.value)}
                />
            </div>
        </div>

        <div className="flex justify-end pt-4">
            <button
                onClick={saveSettings}
                className="bg-blue-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                Sauvegarder
            </button>
        </div>
    </div>


    );
}
