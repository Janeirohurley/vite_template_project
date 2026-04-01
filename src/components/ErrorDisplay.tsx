import { motion } from 'framer-motion'
import { useNavigate, useRouter } from '@tanstack/react-router'

export interface ErrorDisplayProps {
    /**
     * Titre de l'erreur
     * @default "Une erreur est survenue"
     */
    title?: string
    /**
     * Message d'erreur détaillé
     */
    message?: string
    /**
     * Afficher le bouton de retour
     * @default true
     */
    showBackButton?: boolean
    /**
     * URL de retour personnalisée
     * @default "/auth/login"
     */
    backUrl?: string
    /**
     * Texte du bouton de retour
     * @default "Retour à la connexion"
     */
    backButtonText?: string
    /**
     * Si true, utilise toute la hauteur de l'écran
     * @default true
     */
    fullScreen?: boolean
}

export function ErrorDisplay({
    title = 'Une erreur est survenue',
    message = 'Quelque chose s\'est mal passé. Veuillez réessayer.',
    showBackButton = true,
    backUrl = '/auth/login',
    backButtonText = 'Retour à la connexion',
    fullScreen = true,
}: ErrorDisplayProps) {
    const navigate = useNavigate()
    const router = useRouter()

    return (
        <div className={`bg-white dark:bg-gray-900 flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
            <div className="max-w-md w-full px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-6"
                >
                    {/* Icône d'erreur */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto"
                    >
                        <svg
                            className="w-10 h-10 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </motion.div>

                    {/* Titre */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-2xl font-bold text-gray-900 dark:text-gray-100"
                    >
                        {title}
                    </motion.h2>

                    {/* Message */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400"
                    >
                        {message}
                    </motion.p>

                    {/* Boutons d'action */}
                    {showBackButton && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex flex-col sm:flex-row gap-3 pt-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.history.back()}
                                className="flex-1 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-400 px-4 py-2 text-base"
                            >
                                Retour
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate({ to: backUrl })}
                                className="flex-1 inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md px-4 py-2 text-base"
                            >
                                {backButtonText}
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Footer d'aide */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Besoin d'aide ?{' '}
                            <a
                                href="mailto:support@upg.bi"
                                className="text-blue-700 dark:text-blue-400 hover:underline"
                            >
                                Contactez le support
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    )
}
