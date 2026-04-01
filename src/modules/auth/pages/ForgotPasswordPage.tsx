import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthLayout } from '../components'
import { motion } from 'framer-motion'
import { useForgotPassword } from '../hooks'

export function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [emailSent, setEmailSent] = useState(false)
    const navigate = useNavigate()
    const forgotPasswordMutation = useForgotPassword()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        forgotPasswordMutation.mutate({ email }, {
            onSuccess: () => {
                setEmailSent(true)
            }
        })
    }

    if (emailSent) {
        return (
            <AuthLayout>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-4"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
                    >
                        <svg
                            className="w-8 h-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="text-2xl font-bold text-gray-900"
                    >
                        Email envoyé !
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-gray-600"
                    >
                        Un email avec les instructions pour réinitialiser votre mot de passe a été envoyé à{' '}
                        <span className="font-semibold text-gray-900">{email}</span>
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="text-sm text-gray-500"
                    >
                        Pour cette démo, utilisez le lien suivant pour changer votre mot de passe :
                        <br />
                        <a
                            href={`/auth/change-password?token=demo_token`}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Changer le mot de passe
                        </a>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="pt-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate({ to: '/auth/login' })}
                            className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 text-white hover:bg-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md px-4 py-2 text-base"
                        >
                            Retour à la connexion
                        </motion.button>
                    </motion.div>
                </motion.div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-6 text-center"
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Mot de passe oublié ?</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="votre.email@upg.bi"
                        required
                    />
                </div>

                {/* Bouton envoyer */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={forgotPasswordMutation.isPending}
                    className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md px-4 py-2 text-base w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {forgotPasswordMutation.isPending ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </motion.button>

                {/* Retour à la connexion */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                    className="text-center"
                >
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/auth/login' })}
                        className="text-sm text-blue-700 dark:text-blue-400 hover:underline"
                    >
                        Retour à la connexion
                    </button>
                </motion.div>
            </motion.form>

            {/* Footer aide */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center"
            >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Besoin d'aide ?{' '}
                    <a href="mailto:support@upg.bi" className="text-blue-700 dark:text-blue-400 hover:underline">
                        Contactez le support
                    </a>
                </p>
            </motion.div>
        </AuthLayout>
    )
}
