import { useState, useEffect } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useSendEmailOTP, useVerifyEmailOTP } from '../hooks'
import { AuthLayout } from '../components/AuthLayout'
import { TextField } from '../components/FormFields'
import { ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const OTP_VALIDITY_DURATION = 15 * 60 * 1000  // 15 minutes
const RATE_LIMIT_WINDOW = 10 * 60 * 1000      // 10 minutes
const RATE_LIMIT_MAX_ATTEMPTS = 3             // Max par fenêtre

export function VerifyEmailPage() {
    const navigate = useNavigate()
    const search = useSearch({ from: '/auth/verify-email' }) as { email?: string }

    const emailFromURL = search.email || ''
    const [email, setEmail] = useState(emailFromURL)
    const [otp, setOtp] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [blockMessage, setBlockMessage] = useState('')

    const { mutate: sendOTP, isPending: isSending } = useSendEmailOTP()
    const { mutate: verifyOTP, isPending: isVerifying, isSuccess } = useVerifyEmailOTP()

    const emailMatch = email === emailFromURL

    // -------------------------------------------------------------
    // 1) Vérifier expiration du lien (email dans URL)
    // -------------------------------------------------------------
    useEffect(() => {
        if (!emailFromURL) {
            navigate({ to: '/auth/login' })
            return
        }

        const issuedAt = localStorage.getItem(`otp_issued_at_${emailFromURL}`)

        if (!issuedAt) {
            navigate({ to: '/auth/login', search: { m: 'expired' } })
            return
        }

        const diff = Date.now() - Number(issuedAt)

        if (diff > OTP_VALIDITY_DURATION) {
            localStorage.removeItem(`otp_issued_at_${emailFromURL}`)
            navigate({ to: '/auth/login', search: { m: 'expired' } })
        }
    }, [emailFromURL, navigate])

    // -------------------------------------------------------------
    // 2) Countdown persistant
    // -------------------------------------------------------------
    useEffect(() => {
        if (!emailFromURL) return

        const savedTime = localStorage.getItem(`otp_timer_${emailFromURL}`)
        if (savedTime) {
            const elapsed = Math.floor((Date.now() - Number(savedTime)) / 1000)
            if (elapsed < 60) {
                setCountdown(60 - elapsed)
            }
        }
    }, [emailFromURL])

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // -------------------------------------------------------------
    // 3) Rate limit anti-spam
    // -------------------------------------------------------------
    function checkRateLimit(email: string): boolean {
        const key = `otp_attempts_${email}`
        const raw = localStorage.getItem(key)
        const attempts: number[] = raw ? JSON.parse(raw) : []

        const now = Date.now()
        const filtered = attempts.filter(ts => now - ts < RATE_LIMIT_WINDOW)

        if (filtered.length >= RATE_LIMIT_MAX_ATTEMPTS) {
            setBlockMessage(`⛔ Trop de tentatives ! Réessayez dans quelques minutes.`)
            localStorage.setItem(key, JSON.stringify(filtered)) // nettoyer
            return false
        }

        filtered.push(now)
        localStorage.setItem(key, JSON.stringify(filtered))
        return true
    }

    // -------------------------------------------------------------
    // 4) Envoi OTP avec rate limit + expiration
    // -------------------------------------------------------------
    const handleSendOTP = () => {
        if (!emailMatch || !email) return

        if (!checkRateLimit(email)) return

        sendOTP({ email }, {
            onSuccess: () => {
                localStorage.setItem(`otp_issued_at_${email}`, Date.now().toString())
                localStorage.setItem(`otp_timer_${email}`, Date.now().toString())
                setCountdown(60)
            }
        })
    }

    // -------------------------------------------------------------
    // 5) Vérification OTP
    // -------------------------------------------------------------
    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault()
        if (!emailMatch) return alert("L'email ne correspond pas.")
        if (!email || !otp) return

        verifyOTP({ email, otp }, {
            onSuccess: () => {
                setTimeout(() => navigate({ to: '/auth/login' }), 2000)
            }
        })
    }

    // -------------------------------------------------------------
    // Success UI
    // -------------------------------------------------------------
    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 max-w-md mx-auto mt-8">
                    <div className="flex flex-col items-center space-y-4 py-8">
                        <ShieldCheck className="h-16 w-16 text-green-500" />
                        <h2 className="text-xl font-bold text-green-600">
                            Email vérifié !
                        </h2>
                        <p className="text-gray-600 text-center">
                            Redirection vers la connexion…
                        </p>
                    </div>
                </div>
            </AuthLayout>
        )
    }

    console.log(!emailMatch || otp.trim().length === 0 || isVerifying)

    return (
        <AuthLayout>
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck size={20} />
                    <h2 className="text-lg font-semibold">Vérifier votre email</h2>
                </div>

                <form onSubmit={handleVerify} className="space-y-4">

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {!emailMatch && (
                        <p className="text-red-500 text-sm -mt-3">
                            ⚠️ Email différent de celui du lien.
                        </p>
                    )}

                    <TextField
                        label="Code OTP"
                        name="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                    />

                    {/* Anti-spam message */}
                    {blockMessage && (
                        <p className="text-red-500 text-sm">{blockMessage}</p>
                    )}

                    {/* Resend */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded p-3 flex items-center justify-between text-sm">
                        <span>Vous n'avez pas reçu de code ?</span>

                        <button
                            type="button"
                            disabled={isSending || countdown > 0 || !emailMatch}
                            onClick={handleSendOTP}
                            className={`text-blue-700 dark:text-blue-400 px-2 ${isSending || countdown > 0 || !emailMatch
                                ? "cursor-not-allowed opacity-50"
                                : "hover:underline"
                                }`}
                        >
                            {countdown > 0 ? `Renvoyer dans ${countdown}s` : 'Renvoyer le code'}
                        </button>
                    </div>
                    <Button
                    className='w-full'
                        type="submit"
                        disabled={!emailMatch || otp.trim().length === 0 || isVerifying}
                    >
                        Vérifier
                    </Button>

                </form>
            </div>
        </AuthLayout>
    )
}
