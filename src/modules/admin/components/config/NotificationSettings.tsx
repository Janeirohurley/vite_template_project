import { CardContent } from "@/components/ui/card";

export function NotificationSettings() {
    return (
        
                <CardContent className="p-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Notifications par email</div>
                                <div className="text-sm text-gray-500">Envoyer des notifications par email</div>
                            </div>
                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Notifications push</div>
                                <div className="text-sm text-gray-500">Activer les notifications push</div>
                            </div>
                            <input type="checkbox" className="w-4 h-4" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium">Notifications importantes uniquement</div>
                                <div className="text-sm text-gray-500">Ne recevoir que les alertes critiques</div>
                            </div>
                            <input type="checkbox" className="w-4 h-4" />
                        </div>
                    </div>
                </CardContent>
        
    );
}
