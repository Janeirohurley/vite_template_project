import { createFileRoute } from '@tanstack/react-router'
import { GlobalLayout } from '@/layouts/GlobalLayout'
import { useAuthStore } from '@/modules/auth/store/authStore'
import { useNavigate } from '@tanstack/react-router'
import { FileQuestion, ArrowLeft, Home, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/not-found')({
    component: NotFoundPage,
})

function NotFoundPage() {
    const { user, isAuthenticated } = useAuthStore()
    const navigate = useNavigate()

    const handleGoBack = () => {
        if (isAuthenticated && user) {
            switch (user.role) {
                case 'admin':
                    navigate({ to: '/admin/dashboard' })
                    break
                case 'teacher':
                    navigate({ to: '/teacher/dashboard' })
                    break
                case 'student':
                    navigate({ to: '/student/dashboard' })
                    break
                default:
                    navigate({ to: '/' })
            }
        } else {
            navigate({ to: '/auth/login' })
        }
    }

    const handleGoHome = () => {
        navigate({ to: '/' })
    }

    const handleSearch = () => {
        // Could implement search functionality or navigate to a search page
        navigate({ to: '/' })
    }

    return (
        <GlobalLayout>
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <FileQuestion className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2"
                    >
                        Page non trouvée
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-600 dark:text-gray-400 mb-6"
                    >
                        La page que vous recherchez n'existe pas ou a été déplacée.
                    </motion.p>

                    {/* Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="space-y-3"
                    >
                        <button
                            onClick={handleGoBack}
                            className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md px-4 py-2 text-base"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour en arrière
                        </button>

                        <button
                            onClick={handleGoHome}
                            className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500 dark:focus:ring-gray-400 shadow-sm hover:shadow-md px-4 py-2 text-base"
                        >
                            <Home className="w-4 h-4 mr-2" />
                            Aller à l'accueil
                        </button>

                        <button
                            onClick={handleSearch}
                            className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-green-600 dark:bg-green-500 text-white hover:bg-green-700 dark:hover:bg-green-600 focus:ring-green-500 dark:focus:ring-green-400 shadow-sm hover:shadow-md px-4 py-2 text-base"
                        >
                            <Search className="w-4 h-4 mr-2" />
                            Rechercher
                        </button>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Besoin d'aide ?{' '}
                            <a
                                href="mailto:support@upg.bi"
                                className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                                Contactez le support
                            </a>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </GlobalLayout>
    )
}
