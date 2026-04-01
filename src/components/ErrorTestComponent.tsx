import { useState } from 'react';

/**
 * Composant de test pour l'ErrorBoundary
 *
 * IMPORTANT: Ce composant est uniquement pour tester que les erreurs
 * sont correctement capturées et affichées. À supprimer en production.
 *
 * Utilisation:
 * 1. Importez ce composant dans une route
 * 2. Cliquez sur les différents boutons pour tester les erreurs
 * 3. Vérifiez que l'ErrorBoundary ou le ErrorComponent s'affiche
 */
export function ErrorTestComponent() {
    const [count, setCount] = useState(0);

    // Test 1: Erreur de rendu React (capturée par ErrorBoundary)
    if (count === 1) {
        throw new Error('Test: Erreur de rendu React - ErrorBoundary devrait capturer cette erreur');
    }

    // Test 2: Erreur async
    const throwAsyncError = async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        throw new Error('Test: Erreur asynchrone');
    };

    // Test 3: Simuler une erreur 404
    const throw404Error = () => {
        throw new Error('404 - Not Found: Cette ressource n\'existe pas');
    };

    // Test 4: Simuler une erreur 401
    const throw401Error = () => {
        throw new Error('401 - Unauthorized: Authentification requise');
    };

    // Test 5: Simuler une erreur réseau
    const throwNetworkError = () => {
        throw new Error('Network error: fetch failed - Impossible de se connecter au serveur');
    };

    // Test 6: Erreur dans event handler
    const throwEventHandlerError = () => {
        throw new Error('Test: Erreur dans un event handler');
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        🧪 Test des composants d'erreur
                    </h1>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800 dark:text-yellow-200 font-semibold">
                            ⚠️ Composant de test uniquement
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                            Ce composant permet de tester que les erreurs sont correctement capturées
                            et affichées. À supprimer avant la mise en production.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Test ErrorBoundary */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                1. Test ErrorBoundary (Erreur de rendu)
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                Cette erreur sera capturée par l'ErrorBoundary dans main.tsx
                            </p>
                            <button
                                onClick={() => setCount(1)}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Déclencher erreur de rendu
                            </button>
                        </div>

                        {/* Test erreur 404 */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                2. Test erreur 404 (Not Found)
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                Simule une erreur "page non trouvée"
                            </p>
                            <button
                                onClick={throw404Error}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Déclencher erreur 404
                            </button>
                        </div>

                        {/* Test erreur 401 */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                3. Test erreur 401 (Unauthorized)
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                Simule une erreur d'authentification
                            </p>
                            <button
                                onClick={throw401Error}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Déclencher erreur 401
                            </button>
                        </div>

                        {/* Test erreur réseau */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                4. Test erreur réseau
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                Simule une erreur de connexion réseau
                            </p>
                            <button
                                onClick={throwNetworkError}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Déclencher erreur réseau
                            </button>
                        </div>

                        {/* Test erreur event handler */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                5. Test erreur dans event handler
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                Les erreurs dans les event handlers ne sont PAS capturées par ErrorBoundary
                            </p>
                            <button
                                onClick={throwEventHandlerError}
                                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Déclencher erreur event handler
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Cette erreur apparaîtra seulement dans la console
                            </p>
                        </div>

                        {/* Test erreur async */}
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                6. Test erreur asynchrone
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                Les erreurs async ne sont PAS capturées par ErrorBoundary
                            </p>
                            <button
                                onClick={() => {
                                    throwAsyncError().catch(err => {
                                        console.error('Erreur async capturée:', err);
                                        alert('Erreur async: ' + err.message);
                                    });
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                Déclencher erreur async (avec catch)
                            </button>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Cette erreur est gérée avec un .catch()
                            </p>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                            📋 Instructions de test
                        </h3>
                        <ol className="list-decimal list-inside space-y-1 text-blue-800 dark:text-blue-200 text-sm">
                            <li>Cliquez sur "Déclencher erreur de rendu" → Devrait afficher ErrorDisplay</li>
                            <li>Rechargez la page, puis testez les erreurs 404, 401, réseau</li>
                            <li>Ouvrez la console pour voir les logs d'erreur détaillés</li>
                            <li>Vérifiez que les boutons "Retour" fonctionnent correctement</li>
                            <li>Testez en mode sombre et mode clair</li>
                        </ol>
                    </div>

                    {/* Informations techniques */}
                    <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            ℹ️ Informations techniques
                        </h3>
                        <ul className="space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                            <li>
                                <strong>ErrorBoundary</strong> capture: Erreurs de rendu React uniquement
                            </li>
                            <li>
                                <strong>ErrorBoundary ne capture PAS</strong>: Erreurs async, event handlers,
                                erreurs dans useEffect sans throw
                            </li>
                            <li>
                                <strong>TanStack Router errorComponent</strong>: Capture les erreurs dans les loaders
                            </li>
                            <li>
                                <strong>Console</strong>: Vérifiez toujours les logs pour le debug
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
