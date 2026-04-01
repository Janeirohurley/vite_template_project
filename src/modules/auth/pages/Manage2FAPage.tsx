import { useNavigate } from '@tanstack/react-router'
import {
    useDisableEmail2FA,
    useDisableTOTP2FA,
    useDisableStatic2FA,
} from '../hooks'
import { useAuthStore } from '../store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import {
    Mail,
    Smartphone,
    Key,
    Shield,
    AlertTriangle,
    Settings,
    Loader2
} from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

/**
 * Page de gestion de l'authentification à deux facteurs (2FA)
 * Route: /settings/2fa
 * Correspond aux endpoints Django:
 * - /2fa/disable/email/
 * - /2fa/disable/totp/
 * - /2fa/disable/static/
 */
export function Manage2FAPage() {
    const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)

    const { mutate: disableEmail, isPending: isDisablingEmail } = useDisableEmail2FA()
    const { mutate: disableTOTP, isPending: isDisablingTOTP } = useDisableTOTP2FA()
    const { mutate: disableStatic, isPending: isDisablingStatic } = useDisableStatic2FA()

    // Statut 2FA de l'utilisateur (à adapter selon votre modèle User)
    const has2FAEmail = user?.requires_2fa_email || false
    const has2FATOTP = user?.requires_2fa_qr || false
    const has2FAStatic = user?.requires_2fa_static || false
    const has2FA = user?.requires_2fa || false

    const handleSetup2FA = () => {
        navigate({ to: '/auth/2fa/setup' })
    }

    return (
        <div className="container max-w-4xl py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Shield className="h-8 w-8" />
                    Authentification à deux facteurs
                </h1>
                <p className="text-muted-foreground mt-2">
                    Gérez vos méthodes d'authentification à deux facteurs
                </p>
            </div>

            {/* Statut global 2FA */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Statut de la 2FA</span>
                        {has2FA ? (
                            <Badge className="bg-green-500">Activée</Badge>
                        ) : (
                            <Badge variant="destructive">Désactivée</Badge>
                        )}
                    </CardTitle>
                    <CardDescription>
                        {has2FA
                            ? 'Votre compte est protégé par l\'authentification à deux facteurs'
                            : 'Renforcez la sécurité de votre compte en activant la 2FA'
                        }
                    </CardDescription>
                </CardHeader>
                {!has2FA && (
                    <CardContent>
                        <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle>Sécurisez votre compte</AlertTitle>
                            <AlertDescription>
                                L'authentification à deux facteurs ajoute une couche de sécurité supplémentaire
                                à votre compte en demandant un code en plus de votre mot de passe.
                            </AlertDescription>
                        </Alert>
                        <Button
                            className="mt-4 w-full"
                            onClick={handleSetup2FA}
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            Configurer la 2FA
                        </Button>
                    </CardContent>
                )}
            </Card>

            {/* Méthodes 2FA */}
            <div className="space-y-4">
                {/* Email 2FA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Authentification par Email
                            </span>
                            {has2FAEmail ? (
                                <Badge variant="secondary">Activée</Badge>
                            ) : (
                                <Badge variant="outline">Désactivée</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Recevez un code de vérification par email lors de la connexion
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        {has2FAEmail ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDisablingEmail}>
                                        {isDisablingEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Désactiver
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Désactiver la 2FA par Email ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Vous ne recevrez plus de codes par email lors de la connexion.
                                            Cette action réduira la sécurité de votre compte.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => disableEmail()}>
                                            Désactiver
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : (
                            <Button onClick={() => navigate({ to: '/auth/2fa/setup', search: { method: 'email' } })}>
                                Activer
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* TOTP 2FA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Authentification TOTP
                            </span>
                            {has2FATOTP ? (
                                <Badge variant="secondary">Activée</Badge>
                            ) : (
                                <Badge variant="outline">Désactivée</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Utilisez une application d'authentification (Google Authenticator, Authy, etc.)
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        {has2FATOTP ? (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDisablingTOTP}>
                                        {isDisablingTOTP && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Désactiver
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Désactiver TOTP ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Vous ne pourrez plus utiliser votre application d'authentification
                                            pour vous connecter. Cette action réduira la sécurité de votre compte.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => disableTOTP()}>
                                            Désactiver
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        ) : (
                            <Button onClick={() => navigate({ to: '/auth/2fa/setup', search: { method: 'totp' } })}>
                                Activer
                            </Button>
                        )}
                    </CardContent>
                </Card>

                {/* Static Codes 2FA */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Codes de secours
                            </span>
                            {has2FAStatic ? (
                                <Badge variant="secondary">Activés</Badge>
                            ) : (
                                <Badge variant="outline">Désactivés</Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Codes de secours à usage unique pour accéder à votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        {has2FAStatic ? (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => navigate({ to: '/auth/2fa/setup', search: { method: 'static' } })}
                                >
                                    Régénérer les codes
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" disabled={isDisablingStatic}>
                                            {isDisablingStatic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Désactiver
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Désactiver les codes de secours ?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Tous vos codes de secours seront supprimés. Vous ne pourrez plus
                                                les utiliser pour vous connecter en cas de perte d'accès à votre
                                                méthode 2FA principale.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => disableStatic()}>
                                                Désactiver
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                        ) : (
                            <Button onClick={() => navigate({ to: '/auth/2fa/setup', search: { method: 'static' } })}>
                                Générer les codes
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <Button
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                >
                    Retour aux paramètres
                </Button>
            </div>
        </div>
    )
}
