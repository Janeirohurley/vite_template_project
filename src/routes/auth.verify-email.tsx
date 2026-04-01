import { createFileRoute, redirect } from '@tanstack/react-router'
import { VerifyEmailPage } from '@/modules/auth/pages'

type VerifyEmailSearch = {
    from?: string;
    email?: string;
};

export const Route = createFileRoute('/auth/verify-email')({
    beforeLoad: ({ search }: { search: VerifyEmailSearch }) => {

        // 1. Vérifier l'origine
        const from = search?.from

        if (from !== '/auth/login' && from !== "/auth/register") {
            // Option 1 : rediriger
            throw redirect({
                to: '/auth/login',
                search: {
                    error: 'invalid-origin' // optionnel
                }
            })
        }

        // 2. Vérifier l'email passé
        if (!search?.email) {
            throw redirect({
                to: '/auth/login',
                search: {
                    error: 'missing-email'
                }
            })
        }
        const issuedAt = localStorage.getItem(`otp_issued_at_${search.email}`)
        if (!issuedAt) {
            localStorage.setItem(`otp_issued_at_${search.email}`, Date.now().toString())
            localStorage.setItem(`otp_timer_${search.email}`, Date.now().toString())
        }

        return null
    },

    component: VerifyEmailPage,
})
