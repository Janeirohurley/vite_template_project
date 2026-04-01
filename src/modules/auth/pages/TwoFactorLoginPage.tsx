import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
    useTOTP2FALogin,
    useStatic2FALogin,
    useEmail2FALogin,
} from '../hooks'
import { AuthLayout } from '../components/AuthLayout'
import { TextField } from '../components/FormFields'
import { KeyRound, Mail, Smartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SearchParams {
    email?: string
    method?: string
}

/**
 * Page de connexion avec authentification à deux facteurs (2FA)
 * Route: /auth/2fa/login
 * Correspond aux endpoints Django:
 * - /login/email/ (Email 2FA - étape initiale)
 * - /2fa/verify/email/ (vérification Email 2FA)
 * - /login/totp/ (login TOTP)
 * - /login/static/ (login avec code de secours)
 */
export function TwoFactorLoginPage() {
    const navigate = useNavigate()
    const search = useSearch({ from: '/auth/2fa/login' }) as SearchParams

    // Parse and filter valid methods from URL
    const validMethods: ('email' | 'totp' | 'static')[] = ['email', 'totp', 'static']
    const urlMethods = search.method ? search.method.split(',').map(m => m.trim()) : []
    const availableMethods = urlMethods.filter(m => validMethods.includes(m as 'email' | 'totp' | 'static')) as ('email' | 'totp' | 'static')[]
    const finalMethods = availableMethods.length > 0 ? availableMethods : validMethods
    console.log('finalMethods methods:', finalMethods)

    const [activeMethod, setActiveMethod] = useState<'email' | 'totp' | 'static'>(
        finalMethods.includes(search.method as 'email' | 'totp' | 'static') ? (search.method as 'email' | 'totp' | 'static') : finalMethods[0]
    )
    const [email] = useState(search.email || '')
    const [otp, setOtp] = useState('')
    const [totpCode, setTotpCode] = useState('')
    const [staticCode, setStaticCode] = useState('')

    const { mutate: loginEmail, status: isLoggingInEmail } = useEmail2FALogin()
    const { mutate: loginTOTP, status: statusLoggingInTOTP } = useTOTP2FALogin()
    const { mutate: loginStatic, status: statusLoggingInStatic } = useStatic2FALogin()
    const isVerifyingEmail = isLoggingInEmail === 'pending'
    const isLoggingInTOTP = statusLoggingInTOTP === 'pending'
    const isLoggingInStatic = statusLoggingInStatic === 'pending'

    const handleVerifyEmail = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || !otp) return

        loginEmail({ email, otp })
    }

    const handleLoginTOTP = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email  || !totpCode) return

        loginTOTP({
            email,
            otp: totpCode
        })
    }

    const handleLoginStatic = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email  || !staticCode) return

        loginStatic({
            email,
            otp: staticCode
        })
    }

    return (
        <AuthLayout>

            <h2 className="text-xl font-bold mb-2 text-center">Authentification à deux facteurs</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Choisissez votre méthode d'authentification</p>
            <div className="flex justify-center gap-2 mb-6">
                {finalMethods.map((method, index) => {

                    const getIcon = () => {
                        switch (method) {
                            case "email":
                                return <Mail className="inline-block w-4 h-4 mr-2 align-middle" />
                            case "totp":
                                return <Smartphone className="inline-block w-4 h-4 mr-2 align-middle" />
                            case "static":
                                return <KeyRound className="inline-block w-4 h-4 mr-2 align-middle" />
                            default:
                                return null
                        }
                    }

                    const getMethodLabel = () => {
                        switch (method) {
                            case "email":
                                return "Email"
                            case "totp":
                                return "TOTP"
                            case "static":
                                return "Codes de secours"
                            default:
                                return method
                        }
                    }

                    return (
                        <button
                            key={index}
                            className={`px-4 flex items-center py-2 rounded-lg font-medium transition-colors ${activeMethod === method
                                ? "bg-blue-700 text-white"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                                }`}
                            onClick={() => setActiveMethod(method)}
                            type="button"
                        >
                            {getIcon()}
                            {getMethodLabel()}
                        </button>
                    )
                })}
            </div>

            {/* Email 2FA Verification */}


            {/* Email 2FA Verification */}
            {activeMethod === 'email' && (
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-3 flex items-center text-sm mb-2">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>Un code de vérification a été envoyé à
                            <strong> {email}</strong>
                        </span>
                    </div>

                    <TextField
                        label="Code de vérification"
                        name="email-otp"
                        type="text"
                        value={otp}
                        onChange={e => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        required
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Entrez le code à 6 chiffres reçu par email
                    </p>

                    <Button
                        type="submit"
                        className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60"
                        disabled={isVerifyingEmail || !otp}
                    >
                        {isVerifyingEmail ? (
                            <span className="mr-2">
                                Vérifing....
                            </span>
                        ) : "Vérifier"}
                    </Button>
                </form>
            )}

            {/* TOTP 2FA */}
            {activeMethod === 'totp' && (
                <form onSubmit={handleLoginTOTP} className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-3 flex items-center text-sm mb-2">
                        <Smartphone className="w-4 h-4 mr-2" />
                        <span>Utilisez votre application d'authentification</span>
                    </div>

                    <TextField
                        label="Code TOTP"
                        name="totp-code"
                        type="text"
                        value={totpCode}
                        onChange={e => setTotpCode(e.target.value)}
                        placeholder="123456"
                        maxLength={6}
                        required
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Entrez le code de votre application d'authentification
                    </p>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60"
                        disabled={isLoggingInTOTP || !totpCode}
                    >
                        {isLoggingInTOTP ? (
                            <span className="mr-2">
                                connecting....
                            </span>
                        ) : "Se connecter"}
                    </button>
                </form>
            )}

            {/* Static Code 2FA */}
            {activeMethod === 'static' && (
                <form onSubmit={handleLoginStatic} className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-3 flex items-center text-sm mb-2">
                        <KeyRound className="w-4 h-4 mr-2" />
                        <span>Utilisez un de vos codes de secours</span>
                    </div>

                    <TextField
                        label="Code de secours"
                        name="static-code"
                        type="text"
                        value={staticCode}
                        onChange={e => setStaticCode(e.target.value.toUpperCase())}
                        placeholder="XXXX-XXXX-XXXX"
                        required
                    />

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Chaque code ne peut être utilisé qu'une seule fois
                    </p>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-60"
                        disabled={isLoggingInStatic || !staticCode}
                    >
                        {isLoggingInStatic ? (
                            <span className="mr-2">
                                connecting....
                            </span>
                        ) : "Se connecter"}
                        
                    </button>
                </form>
            )}


            <div className="mt-6">
                <button
                    type="button"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-semibold py-2 px-4 rounded-lg mt-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                    onClick={() => navigate({ to: '/auth/login' })}
                >
                    <span className="mr-2">←</span>
                    Retour à la connexion
                </button>
            </div>

        </AuthLayout>
    )
}
