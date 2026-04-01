import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useSendEmailOTP, useResetPasswordWithOTP } from '../hooks'
import { AuthLayout } from '../components/AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { KeyRound, Loader2, Mail, Lock } from 'lucide-react'
import { notify } from '@/lib'

/**
 * Page de réinitialisation de mot de passe avec OTP
 * Route: /auth/reset-password
 * Correspond aux endpoints Django:
 * - /send-email-otp/ (pour envoyer l'OTP)
 * - /password/reset/verify/ (pour réinitialiser avec OTP)
 */
export function ResetPasswordPage() {
    const navigate = useNavigate()

    const [step, setStep] = useState<'email' | 'verify'>('email')
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const { mutate: sendOTP, isPending: isSending } = useSendEmailOTP()
    const { mutate: resetPassword, isPending: isResetting } = useResetPasswordWithOTP()

    const handleSendOTP = (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) return

        sendOTP({ email }, {
            onSuccess: () => {
                setStep('verify')
            },

        })
    }

    const handleResetPassword = (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !otp || !newPassword || !confirmPassword) return

        if (newPassword !== confirmPassword) {
            notify.info('Les mots de passe ne correspondent pas')
            return
        }

        resetPassword({
            email: email,
            otp: otp,
            new_password: newPassword
        }, {
            onSuccess: () => {
                // La redirection est gérée par le hook
            }
        })
    }

    return (
        <AuthLayout>

            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <KeyRound className="h-5 w-5" />
                    Mot de passe oublié
                </CardTitle>
                <CardDescription>
                    {step === 'email'
                        ? 'Entrez votre email pour recevoir un code de vérification'
                        : 'Entrez le code reçu et votre nouveau mot de passe'
                    }
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === 'email' ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isSending}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSending || !email}
                        >
                            {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Envoyer le code
                        </Button>

                        <Button
                            type="button"
                            variant="link"
                            className="w-full"
                            onClick={() => navigate({ to: '/auth/login' })}
                        >
                            Retour à la connexion
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                Un code de vérification a été envoyé à <strong>{email}</strong>
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-2">
                            <Label htmlFor="otp">Code de vérification</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="123456"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                required
                                disabled={isResetting}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword" className="flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Nouveau mot de passe
                            </Label>
                            <Input
                                id="newPassword"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={isResetting}
                                minLength={8}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={isResetting}
                                minLength={8}
                            />
                        </div>

                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <Alert variant="destructive">
                                <AlertDescription>
                                    Les mots de passe ne correspondent pas
                                </AlertDescription>
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={
                                isResetting ||
                                !email ||
                                !otp ||
                                !newPassword ||
                                !confirmPassword ||
                                newPassword !== confirmPassword
                            }
                        >
                            {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Réinitialiser le mot de passe
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setStep('email')}
                        >
                            Retour
                        </Button>
                    </form>
                )}
            </CardContent>

        </AuthLayout>
    )
}
