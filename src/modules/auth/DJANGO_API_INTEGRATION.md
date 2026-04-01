# Intégration API Django - Documentation Complète

Ce document décrit l'intégration complète avec l'API Django pour l'authentification et la gestion des utilisateurs.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Endpoints disponibles](#endpoints-disponibles)
3. [Flux d'authentification](#flux-dauthentification)
4. [Hooks React disponibles](#hooks-react-disponibles)
5. [Exemples d'utilisation](#exemples-dutilisation)
6. [Gestion des erreurs](#gestion-des-erreurs)

---

## Vue d'ensemble

L'application frontend est entièrement intégrée avec le backend Django en utilisant :
- **API REST** avec Django Rest Framework
- **JWT Tokens** pour l'authentification (access + refresh tokens)
- **2FA** (Email, TOTP, Static codes)
- **Email Verification** avec OTP
- **Password Reset** avec OTP

---

## Endpoints disponibles

### 🔐 Authentification de base

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/register/` | POST | Inscription utilisateur | `useRegister` |
| `/login/` | POST | Connexion standard | `useLogin` |
| `/token/refresh/` | POST | Rafraîchir le token | `useTokenRefresh` |

### ✉️ Vérification email

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/send-email-otp/` | POST | Envoyer OTP par email | `useSendEmailOTP` |
| `/verify-email/` | POST | Vérifier email avec OTP | `useVerifyEmailOTP` |

### 🔑 Réinitialisation mot de passe

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/password/reset/verify/` | POST | Réinitialiser avec OTP | `useResetPasswordWithOTP` |

### 🔒 Authentification à deux facteurs (2FA)

#### Setup 2FA

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/2fa/set/email/` | POST | Activer 2FA Email | `useSetEmail2FA` |
| `/2fa/set/totp/` | POST | Activer 2FA TOTP | `useSetTOTP2FA` |
| `/2fa/set/static/` | POST | Générer codes de secours | `useSetStatic2FA` |

#### Vérification 2FA

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/2fa/verify/email/` | POST | Vérifier OTP Email | `useVerifyEmail2FA` |
| `/2fa/verify/totp/` | POST | Vérifier code TOTP | `useVerifyTOTP2FA` |
| `/2fa/verify/static/` | POST | Vérifier code de secours | `useVerifyStatic2FA` |

#### Désactivation 2FA

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/2fa/disable/email/` | POST | Désactiver 2FA Email | `useDisableEmail2FA` |
| `/2fa/disable/totp/` | POST | Désactiver 2FA TOTP | `useDisableTOTP2FA` |
| `/2fa/disable/static/` | POST | Désactiver codes de secours | `useDisableStatic2FA` |

#### Login avec 2FA

| Endpoint | Méthode | Description | Hook |
|----------|---------|-------------|------|
| `/login/email/` | POST | Login avec Email 2FA | `useEmail2FALogin` |
| `/login/totp/` | POST | Login avec TOTP | `useTOTP2FALogin` |
| `/login/static/` | POST | Login avec code de secours | `useStatic2FALogin` |

---

## Flux d'authentification

### 1. Inscription (Registration)

```
User fills registration form
        ↓
    useRegister hook
        ↓
    POST /register/
        ↓
  Account created (email_verified = False)
        ↓
  Email OTP sent automatically
        ↓
  User verifies email with OTP
        ↓
  Account fully activated
```

#### Code exemple :

```typescript
const { mutate: register, isLoading } = useRegister()

const handleRegister = () => {
    register({
        email: 'user@example.com',
        password: 'SecurePass123',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1990-01-01',
        // ... autres champs optionnels
    })
}
```

### 2. Vérification Email

```
User registers
        ↓
  Backend sends OTP to email
        ↓
  User enters OTP in frontend
        ↓
  useSendEmailOTP (if resend needed)
        ↓
  useVerifyEmailOTP
        ↓
  POST /verify-email/
        ↓
  Email verified ✓
```

#### Code exemple :

```typescript
// Envoyer/Re-envoyer OTP
const { mutate: sendOTP } = useSendEmailOTP()
sendOTP({ email: 'user@example.com' })

// Vérifier OTP
const { mutate: verifyOTP } = useVerifyEmailOTP()
verifyOTP({
    email: 'user@example.com',
    otp: '123456'
})
```

### 3. Login Standard

```
User enters credentials
        ↓
    useLogin hook
        ↓
    POST /login/
        ↓
  Backend checks credentials
        ↓
  If 2FA disabled → Returns tokens directly
        ↓
  If 2FA enabled → Redirect to 2FA page
        ↓
  Complete 2FA verification
        ↓
  Receive tokens
        ↓
  Store in localStorage & Zustand
        ↓
  Redirect to dashboard
```

#### Code exemple :

```typescript
const { mutate: login, isLoading } = useLogin()

login({
    email: 'user@example.com',
    password: 'SecurePass123'
})
```

### 4. Login avec 2FA

#### Email 2FA Flow

```
User logs in
        ↓
  POST /login/email/
        ↓
  Backend sends OTP to email
        ↓
  User enters OTP
        ↓
  useVerifyEmail2FA
        ↓
  Returns tokens
        ↓
  Login complete
```

#### Code exemple :

```typescript
// Étape 1: Initier login Email 2FA
const { mutate: emailLogin } = useEmail2FALogin()
emailLogin({
    email: 'user@example.com',
    password: 'SecurePass123'
})

// Étape 2: Vérifier OTP
const { mutate: verifyEmail } = useVerifyEmail2FA()
verifyEmail({
    email: 'user@example.com',
    otp: '123456'
})
```

#### TOTP 2FA Flow

```typescript
const { mutate: totpLogin } = useTOTP2FALogin()
totpLogin({
    email: 'user@example.com',
    password: 'SecurePass123',
    otp: '123456' // From authenticator app
})
```

#### Static Code Flow

```typescript
const { mutate: staticLogin } = useStatic2FALogin()
staticLogin({
    email: 'user@example.com',
    password: 'SecurePass123',
    code: 'ABCD-EFGH-1234' // Static backup code
})
```

### 5. Reset Password avec OTP

```
User clicks "Forgot Password"
        ↓
  useSendEmailOTP
        ↓
  POST /send-email-otp/
        ↓
  Backend sends OTP to email
        ↓
  User enters: email + OTP + new password
        ↓
  useResetPasswordWithOTP
        ↓
  POST /password/reset/verify/
        ↓
  Password reset successful
        ↓
  Redirect to login
```

#### Code exemple :

```typescript
// Étape 1: Demander OTP
const { mutate: sendOTP } = useSendEmailOTP()
sendOTP({ email: 'user@example.com' })

// Étape 2: Reset avec OTP
const { mutate: resetPassword } = useResetPasswordWithOTP()
resetPassword({
    email: 'user@example.com',
    otp: '123456',
    newPassword: 'NewSecurePass456'
})
```

### 6. Configuration 2FA

#### Email 2FA

```typescript
const { mutate: enableEmail2FA } = useSetEmail2FA()
enableEmail2FA() // Automatically uses authenticated user
```

#### TOTP 2FA

```typescript
const { mutate: enableTOTP, data } = useSetTOTP2FA()
enableTOTP()

// `data` contains:
// - qr_code: Base64 QR code to scan with authenticator app
// - secret_key: Manual entry key
```

#### Static Codes

```typescript
const { mutate: generateCodes, data } = useSetStatic2FA()
generateCodes()

// `data` contains:
// - static_codes: Array of backup codes to save
```

### 7. Token Refresh

```
Access token expires
        ↓
  Automatic refresh triggered
        ↓
  useTokenRefresh
        ↓
  POST /token/refresh/
        ↓
  New access token received
        ↓
  Update localStorage & Zustand
        ↓
  Continue request
```

#### Code exemple :

```typescript
// Automatique avec refreshToken() utility
import { refreshToken } from '@/modules/auth/hooks'

const newToken = await refreshToken()
if (newToken) {
    // Token refreshed successfully
} else {
    // Refresh failed, user must re-login
}
```

---

## Hooks React disponibles

### Authentication

```typescript
import {
    useLogin,
    useRegister,
} from '@/modules/auth/hooks'
```

### Password Management

```typescript
import {
    useForgotPassword,
    useChangePassword,
    useResetPasswordWithOTP,
} from '@/modules/auth/hooks'
```

### Email Verification

```typescript
import {
    useSendEmailOTP,
    useVerifyEmailOTP,
} from '@/modules/auth/hooks'
```

### Token Management

```typescript
import {
    useTokenRefresh,
    refreshToken,
    useVerifyToken,
} from '@/modules/auth/hooks'
```

### 2FA Setup

```typescript
import {
    useSetEmail2FA,
    useSetTOTP2FA,
    useSetStatic2FA,
} from '@/modules/auth/hooks'
```

### 2FA Verification

```typescript
import {
    useVerifyEmail2FA,
    useVerifyTOTP2FA,
    useVerifyStatic2FA,
} from '@/modules/auth/hooks'
```

### 2FA Disable

```typescript
import {
    useDisableEmail2FA,
    useDisableTOTP2FA,
    useDisableStatic2FA,
} from '@/modules/auth/hooks'
```

### 2FA Login

```typescript
import {
    useEmail2FALogin,
    useTOTP2FALogin,
    useStatic2FALogin,
} from '@/modules/auth/hooks'
```

---

## Exemples d'utilisation

### Page de Login complète avec 2FA

```typescript
import { useState } from 'react'
import { useLogin, useEmail2FALogin, useVerifyEmail2FA } from '@/modules/auth/hooks'

function LoginPage() {
    const [step, setStep] = useState<'login' | 'email-2fa' | 'verify-2fa'>('login')
    const [credentials, setCredentials] = useState({ email: '', password: '' })

    const { mutate: login } = useLogin()
    const { mutate: email2FALogin } = useEmail2FALogin()
    const { mutate: verifyEmail2FA } = useVerifyEmail2FA()

    const handleLogin = () => {
        // Essayer login standard
        login(credentials, {
            onError: (error) => {
                if (error.errorCode === 'Email2FANotEnabled') {
                    // L'utilisateur a Email 2FA activé
                    setStep('email-2fa')
                }
            }
        })
    }

    const handleEmail2FALogin = () => {
        email2FALogin(credentials, {
            onSuccess: () => {
                setStep('verify-2fa')
            }
        })
    }

    const handleVerify2FA = (otp: string) => {
        verifyEmail2FA({
            email: credentials.email,
            otp
        })
    }

    if (step === 'verify-2fa') {
        return <OTPInput onSubmit={handleVerify2FA} />
    }

    if (step === 'email-2fa') {
        return <button onClick={handleEmail2FALogin}>Send OTP</button>
    }

    return (
        <form onSubmit={(e) => { e.preventDefault(); handleLogin() }}>
            <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            <button type="submit">Login</button>
        </form>
    )
}
```

### Configuration TOTP 2FA

```typescript
import { useSetTOTP2FA } from '@/modules/auth/hooks'
import QRCode from 'react-qr-code'

function Setup2FAPage() {
    const { mutate: setupTOTP, data, isLoading } = useSetTOTP2FA()

    const handleSetup = () => {
        setupTOTP()
    }

    return (
        <div>
            <button onClick={handleSetup} disabled={isLoading}>
                Activer TOTP 2FA
            </button>

            {data?.qr_code && (
                <div>
                    <h3>Scannez ce QR Code avec votre app d'authentification</h3>
                    <img src={data.qr_code} alt="QR Code" />
                    <p>Clé secrète: {data.secret_key}</p>
                </div>
            )}
        </div>
    )
}
```

---

## Gestion des erreurs

Toutes les erreurs sont automatiquement gérées par `useErrorHandler`. Les codes d'erreur Django sont traduits en français via [ERROR_MESSAGES](../../lib/errorMessages.ts).

### Codes d'erreur courants

| Code Django | Message français | Redirection |
|-------------|------------------|-------------|
| `EmailNotVerified` | "L'email n'est pas vérifié" | `/auth/verify-email` |
| `InvalidOTP` | "Le code OTP fourni est incorrect" | Aucune |
| `Email2FANotSet` | "L'authentification à deux facteurs par email n'est pas configurée" | `/auth/2fa-setup` |
| `TOTP2FANotSet` | "L'authentification TOTP n'est pas configurée" | `/auth/2fa-setup` |
| `Unauthorized` | "Non autorisé - Veuillez vous reconnecter" | `/auth/login` |

Voir [README_ERROR_HANDLING.md](./README_ERROR_HANDLING.md) pour plus de détails sur la gestion des erreurs.

---

## Structure de réponse Django

### Success Response

```json
{
    "status": "success",
    "message": "Operation successful",
    "data": {
        // Response data here
    }
}
```

### Error Response

```json
{
    "status": "error",
    "message": "EmailAlreadyExists",
    "errors": {
        "email": ["This email is already registered"]
    }
}
```

L'intercepteur Axios unwrap automatiquement `response.data.data` pour vous faciliter la vie !

---

## Types TypeScript

Tous les types sont définis dans les fichiers d'API correspondants :

- [emailVerification.ts](../api/emailVerification.ts)
- [passwordReset.ts](../api/passwordReset.ts)
- [twoFactorAuth.ts](../api/twoFactorAuth.ts)
- [tokenRefresh.ts](../api/tokenRefresh.ts)

---

## Prochaines étapes

1. ✅ Implémenter les pages UI pour chaque flux
2. ✅ Ajouter les tests unitaires pour les hooks
3. ✅ Configurer le refresh automatique des tokens
4. ✅ Implémenter la protection des routes basée sur 2FA

---

Pour plus d'informations, consultez :
- [README_ERROR_HANDLING.md](./README_ERROR_HANDLING.md) - Gestion des erreurs
- [Django Backend Documentation] - Documentation API backend
