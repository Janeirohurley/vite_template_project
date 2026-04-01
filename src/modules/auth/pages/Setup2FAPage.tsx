import { useState } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
    useSetEmail2FA,
    useSetTOTP2FA,
    useSetStatic2FA,
} from '../hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Mail, Smartphone, Key, Loader2, CheckCircle2, Copy, Download } from 'lucide-react'
// Import manquant
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { notify } from '@/lib'


/**
 * Page de configuration de l'authentification à deux facteurs (2FA)
 * Route: /auth/2fa/setup
 * Correspond aux endpoints Django:
 * - /2fa/set/email/ (Email 2FA)
 * - /2fa/set/totp/ (TOTP 2FA)
 * - /2fa/set/static/ (Static codes 2FA)
 */
export function Setup2FAPage() {
    const navigate = useNavigate()
    const search = useSearch({ from: '/auth/2fa/setup' }) as { method?: string }

    const [activeTab, setActiveTab] = useState(search.method || 'email')

    const { mutate: setupEmail, isPending: isSettingUpEmail, isSuccess: emailSuccess } = useSetEmail2FA()
    const { mutate: setupTOTP, isPending: isSettingUpTOTP, data: totpData, isSuccess: totpSuccess } = useSetTOTP2FA()
    const { mutate: setupStatic, isPending: isSettingUpStatic, data: staticData, isSuccess: staticSuccess } = useSetStatic2FA()

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        notify.success('Copié dans le presse-papiers !')
    }

    const downloadStaticCodes = () => {
        if (!staticData?.static_codes) return

        const content = staticData.static_codes.join('\n')
        const blob = new Blob([content], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = '2fa-backup-codes.txt'
        a.click()
        URL.revokeObjectURL(url)
        notify.success('Codes téléchargés !')
    }

    return (
        <div className="container max-w-4xl py-10">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Configuration 2FA</h1>
                <p className="text-muted-foreground">
                    Sécurisez votre compte avec l'authentification à deux facteurs
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="email">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                    </TabsTrigger>
                    <TabsTrigger value="totp">
                        <Smartphone className="mr-2 h-4 w-4" />
                        TOTP
                    </TabsTrigger>
                    <TabsTrigger value="static">
                        <Key className="mr-2 h-4 w-4" />
                        Codes de secours
                    </TabsTrigger>
                </TabsList>

                {/* Email 2FA */}
                <TabsContent value="email">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5" />
                                Authentification par Email
                            </CardTitle>
                            <CardDescription>
                                Recevez un code de vérification par email à chaque connexion
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {emailSuccess ? (
                                <Alert className="border-green-500 bg-green-50">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertTitle>2FA Email activé !</AlertTitle>
                                    <AlertDescription>
                                        Vous recevrez désormais un code par email lors de la connexion.
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <>
                                    <Alert>
                                        <AlertDescription>
                                            Une fois activé, vous recevrez un code de vérification à 6 chiffres
                                            par email à chaque fois que vous vous connectez.
                                        </AlertDescription>
                                    </Alert>

                                    <Button
                                        onClick={() => setupEmail()}
                                        disabled={isSettingUpEmail}
                                        className="w-full"
                                    >
                                        {isSettingUpEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Activer 2FA par Email
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TOTP 2FA */}
                <TabsContent value="totp">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Smartphone className="h-5 w-5" />
                                Authentification TOTP
                            </CardTitle>
                            <CardDescription>
                                Utilisez une application d'authentification (Google Authenticator, Authy, etc.)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!totpData ? (
                                <>
                                    <Alert>
                                        <AlertDescription>
                                            Le TOTP (Time-based One-Time Password) génère un code à 6 chiffres
                                            qui change toutes les 30 secondes.
                                        </AlertDescription>
                                    </Alert>

                                    <Button
                                        onClick={() => setupTOTP()}
                                        disabled={isSettingUpTOTP}
                                        className="w-full"
                                    >
                                        {isSettingUpTOTP && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Générer le QR Code
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <Alert className="border-blue-500 bg-blue-50">
                                        <AlertTitle>Scannez le QR Code</AlertTitle>
                                        <AlertDescription>
                                            Utilisez votre application d'authentification pour scanner ce code
                                        </AlertDescription>
                                    </Alert>

                                    {totpData.qr_code && (
                                        <div className="flex justify-center p-4 bg-white rounded-lg border">
                                            <img
                                                src={totpData.qr_code}
                                                alt="QR Code TOTP"
                                                className="max-w-sm"
                                            />
                                        </div>
                                    )}

                                    {totpData.secret_key && (
                                        <div className="space-y-2">
                                            <Label>Clé secrète (saisie manuelle)</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    value={totpData.secret_key}
                                                    readOnly
                                                    className="font-mono"
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => copyToClipboard(totpData.secret_key!)}
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {totpSuccess && (
                                        <Alert className="border-green-500 bg-green-50">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <AlertTitle>TOTP configuré !</AlertTitle>
                                            <AlertDescription>
                                                Vous pouvez maintenant utiliser votre application d'authentification
                                                pour vous connecter.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Static Codes 2FA */}
                <TabsContent value="static">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Key className="h-5 w-5" />
                                Codes de secours
                            </CardTitle>
                            <CardDescription>
                                Générez des codes de secours à usage unique pour accéder à votre compte
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!staticData ? (
                                <>
                                    <Alert>
                                        <AlertDescription>
                                            Les codes de secours vous permettent de vous connecter si vous perdez
                                            l'accès à votre méthode 2FA principale. Chaque code ne peut être utilisé qu'une seule fois.
                                        </AlertDescription>
                                    </Alert>

                                    <Button
                                        onClick={() => setupStatic()}
                                        disabled={isSettingUpStatic}
                                        className="w-full"
                                    >
                                        {isSettingUpStatic && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Générer les codes de secours
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <Alert variant="destructive">
                                        <AlertTitle>Sauvegardez ces codes !</AlertTitle>
                                        <AlertDescription>
                                            Ces codes ne seront affichés qu'une seule fois. Sauvegardez-les dans un endroit sûr.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded-lg border">
                                        {staticData.static_codes?.map((code, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-2 p-2 bg-white rounded border font-mono text-sm"
                                            >
                                                <Badge variant="outline">{index + 1}</Badge>
                                                <span>{code}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={downloadStaticCodes}
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Télécharger
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => {
                                                const codes = staticData.static_codes?.join('\n') || ''
                                                copyToClipboard(codes)
                                            }}
                                        >
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copier
                                        </Button>
                                    </div>

                                    {staticSuccess && (
                                        <Alert className="border-green-500 bg-green-50">
                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                            <AlertTitle>Codes générés !</AlertTitle>
                                            <AlertDescription>
                                                N'oubliez pas de sauvegarder ces codes avant de quitter cette page.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => navigate({ to: '/' })}
                >
                    Retour au tableau de bord
                </Button>

                {(emailSuccess || totpSuccess || staticSuccess) && (
                    <Button onClick={() => navigate({ to: '/' })}>
                        Terminer
                    </Button>
                )}
            </div>
        </div>
    )
}


