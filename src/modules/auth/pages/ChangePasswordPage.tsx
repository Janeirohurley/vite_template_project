import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { AuthLayout } from '../components'

import { motion } from 'framer-motion'
import { useChangePassword } from '../hooks'
import { notify } from '@/lib'

export function ChangePasswordPage() {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    })
    const navigate = useNavigate()
    const search = useSearch({ from: '/auth/change-password' }) as { token: string }
    const changePasswordMutation = useChangePassword()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validations
        if (formData.password !== formData.confirmPassword) {
            notify.error('Les mots de passe ne correspondent pas.')
            return
        }
        if (formData.password.length < 6) {
            notify.error('Le mot de passe doit contenir au moins 6 caractères.')
            return
        }

        // Utiliser le hook mutation
        changePasswordMutation.mutate({
            token: search.token,
            newPassword: formData.password,
        })
    }

    return (
        <AuthLayout>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mb-6 text-center"
            >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Nouveau mot de passe</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Entrez votre nouveau mot de passe.
                </p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                {/* Nouveau mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                        Nouveau mot de passe
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Confirmer mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="confirmPassword">
                        Confirmer le mot de passe
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Bouton changer */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={changePasswordMutation.isPending}
                    className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md px-4 py-2 text-base w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {changePasswordMutation.isPending ? 'Changement en cours...' : 'Changer le mot de passe'}
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
