import { useState } from "react";
import { Info, Save, } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SecuritySettings() {
    const [minPasswordLength, setMinPasswordLength] = useState(8);
    const [sessionDuration, setSessionDuration] = useState(480);
    const [maxLoginAttempts, setMaxLoginAttempts] = useState(3);
    const [passwordExpiration, setPasswordExpiration] = useState(90);
    const [requirements, setRequirements] = useState({
        specialChars: true,
        numbers: true,
        uppercase: true,
    });
    const [twoFA, setTwoFA] = useState(false);
    const [twoFATypes, setTwoFATypes] = useState({
        email: true,
        totp: false,
        static: false,
    });
    const [signMethods, setSignMethods] = useState({
        password: true,
        google: false,
        github: false,
        microsoft: false,
    });

    const toggleRequirement = (key: keyof typeof requirements) => {
        setRequirements(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleTwoFAType = (key: keyof typeof twoFATypes) => {
        setTwoFATypes(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleSignMethod = (key: keyof typeof signMethods) => {
        setSignMethods(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-4 text-sm">

            {/* Info box */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-300 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900 dark:text-blue-100">Politique de sécurité</h4>
                        <p className="text-blue-700 dark:text-blue-200">Ces paramètres affectent tous les utilisateurs. Modifiez avec précaution.</p>
                    </div>
                </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div> <Label
                    htmlFor="minPasswordLength"
                    className="flex text-xs items-center gap-1 text-gray-900 dark:text-gray-100 font-medium"
                >
                    Longueur minimale du mot de passe
                </Label>

                    <Input id="minPasswordLength" type="number" min={3} max={10} className="w-full px-3 py-2 border rounded-lg focus:ring-0.5 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
                        value={minPasswordLength}
                        onChange={e => setMinPasswordLength(Number(e.target.value))}
                        placeholder="Longueur min mot de passe"
                    />
                </div>
                <div>
                    <Label
                        htmlFor="maxPasswordLength"
                        className="flex text-xs items-center gap-1 text-gray-900 dark:text-gray-100 font-medium"
                    >
                        Longueur maximale du mot de passe
                    </Label>
                    <Input id="maxPasswordLength" type="number" min={3} max={10} className="w-full px-3 py-2 border rounded-lg focus:ring-0.5 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
                        value={sessionDuration}
                        onChange={e => setSessionDuration(Number(e.target.value))}
                        placeholder="Durée session (min)"
                    />
                </div>

                <div>
                    <Label
                        htmlFor="maxLoginAttempts"
                        className="flex text-xs items-center gap-1 text-gray-900 dark:text-gray-100 font-medium" >
                        Tentatives de connexion maximales
                    </Label>
                    <Input id="maxLoginAttempts" type="number" min={3} max={10} className="w-full px-3 py-2 border rounded-lg focus:ring-0.5 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
                        value={maxLoginAttempts}
                        onChange={e => setMaxLoginAttempts(Number(e.target.value))}
                        placeholder="Tentatives max"
                    />
                </div>

                <div>
                    <Label
                        htmlFor="expirationTime"
                        className="flex text-xs items-center gap-1 text-gray-900 dark:text-gray-100 font-medium"
                    >
                        Expiration du mot de passe (jours)
                    </Label>
                    <Input id="expirationTime" type="number" min={30} max={365} className="w-full px-3 py-2 border rounded-lg focus:ring-0.5 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 text-sm"
                        value={passwordExpiration}
                        onChange={e => setPasswordExpiration(Number(e.target.value))}
                        placeholder="Expiration mot de passe (jours)"
                    />
                </div>

            </div>

            {/* Password requirements */}
            <div className="space-y-1">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Exigences du mot de passe</h4>
                {Object.entries(requirements).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-2">
                        <input type="checkbox" checked={value} onChange={() => toggleRequirement(key as keyof typeof requirements)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                        <span className="dark:text-gray-200">{key === "specialChars" ? "Caractères spéciaux" : key === "numbers" ? "Chiffres" : "Majuscules"}</span>
                    </label>
                ))}
            </div>

            {/* 2FA toggle */}
            <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {/* Toggle principal */}
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">Authentification à deux facteurs</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-xs">Activer 2FA pour tous les administrateurs</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
                        <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:border-gray-300 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
                    </label>
                </div>

                {/* Sous-toggles pour les types de 2FA */}
                {twoFA && (
                    <div className="space-y-2 mt-3">
                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Email</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Recevoir un code par email pour se connecter</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={twoFATypes.email} onChange={() => toggleTwoFAType("email")} />
                                <div className="w-7.5 h-4 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-px after:left-px after:bg-white after:border after:border-gray-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">TOTP</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Utiliser une application d’authentification (Google Authenticator, Authy)</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={twoFATypes.totp} onChange={() => toggleTwoFAType("totp")} />
                                <div className="w-7.5 h-4 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-px after:left-px after:bg-white after:border after:border-gray-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-lg">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Statique</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Code fixe fourni à l’utilisateur</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={twoFATypes.static} onChange={() => toggleTwoFAType("static")} />
                                <div className="w-7.5 h-4 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-px after:left-px after:bg-white after:border after:border-gray-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-full"></div>
                            </label>
                        </div>
                    </div>
                )}
            </div>


            {/* Sign-in Methods */}
            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Méthodes de connexion</h4>

                {Object.entries(signMethods).map(([key, value]) => (
                    <div
                        key={key}
                        className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-900 rounded-lg"
                    >
                        <div className="flex flex-col">
                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                                {key === "email" && "Confirmer via email pour sécuriser la connexion"}
                                {key === "totp" && "Utiliser une application d'authentification TOTP (Google Authenticator, Authy)"}
                                {key === "social" && "Connexion via réseaux sociaux (Google, Facebook, etc.)"}
                                {key === "static" && "Code statique pour accès administrateur"}
                            </span>
                        </div>

                        {/* Toggle individuel */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={value}
                                onChange={() => toggleSignMethod(key as keyof typeof signMethods)}
                            />
                            <div className="w-7.5 h-4 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-px after:left-px after:bg-white after:border after:border-gray-300 after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:after:translate-x-full"></div>
                        </label>
                    </div>
                ))}
            </div>


            {/* Save button */}
            <div className="flex justify-end pt-2">
                <button className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors flex items-center gap-1 text-xs">
                    <Save className="w-3 h-3" />
                    <span>Sauvegarder</span>
                </button>
            </div>
        </div>
    );
}
