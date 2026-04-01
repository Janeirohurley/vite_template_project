import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { AuthLayout, AuthTabs } from '../components'
import { useLogin } from '../hooks'
import { useTranslation } from 'react-i18next'
import { DebugDisplay } from '@/components/common/DebugDisplay'

export function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const loginMutation = useLogin()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        loginMutation.mutate({ email, password })
    }
    const {t} = useTranslation()

    return (
        <AuthLayout>
        
            <AuthTabs active="login" />
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="username">
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

                {/* Mot de passe */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1" htmlFor="password">
                        Mot de passe
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition-colors border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* Bouton connexion */}
                <button
                    type="submit"
                    disabled={loginMutation.isPending}
                    className="inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-700 dark:bg-blue-600 text-white hover:bg-blue-800 dark:hover:bg-blue-700 focus:ring-blue-500 dark:focus:ring-blue-400 shadow-sm hover:shadow-md px-4 py-2 text-base w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loginMutation.isPending ? 'Connexion en cours...' : t("login_keys.login")}
                </button>

              

                

                {/* Mot de passe oublié */}
                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => navigate({ to: '/auth/reset-password' })}
                        className="text-sm text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                        Mot de passe oublié ?
                    </button>
                </div>
            </form>
          
            {/* Footer aide */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Besoin d'aide ?{' '}
                    <a href="mailto:support@upg.bi" className="text-blue-700 dark:text-blue-400 hover:underline">
                        Contactez le support
                    </a>
                </p>
            </div>
            <DebugDisplay
            className='text-red-400 absolute bottom-0 -left-100  p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg z-50'
                title='Les authentification pour les differents roles pour les tests'
                data={{
                    admin: {
                        username: 'admin@upg.bi',
                        password: 'admin123',
                    },
                    user: {
                        username: 'studentservice@gmail.com',
                        password: 'sOkn40G%Ir*g',
                    }
                }}
            />
        </AuthLayout>
    )
}
