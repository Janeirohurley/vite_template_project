# Routes et Protection - Documentation Complète

Ce document liste toutes les routes frontend, leur protection, et leur correspondance avec les endpoints Django.

## Table des matières

1. [Routes publiques (Guest Only)](#routes-publiques-guest-only)
2. [Routes protégées (Authenticated)](#routes-protégées-authenticated)
3. [Routes protégées par rôle](#routes-protégées-par-rôle)
4. [Composants de protection](#composants-de-protection)
5. [Configuration TanStack Router](#configuration-tanstack-router)

---

## Routes publiques (Guest Only)

Ces routes sont accessibles uniquement aux utilisateurs **non connectés**. Les utilisateurs authentifiés sont redirigés vers leur dashboard.

| Route Frontend | Page | Endpoint Django | Protection |
|----------------|------|-----------------|------------|
| `/auth/login` | [LoginPage](./pages/LoginPage.tsx) | `/login/` | `GuestOnlyRoute` |
| `/auth/register` | [RegisterPage](./pages/RegisterPage.tsx) | `/register/` | `GuestOnlyRoute` |
| `/auth/forgot-password` | [ForgotPasswordPage](./pages/ForgotPasswordPage.tsx) | `/send-email-otp/` | `GuestOnlyRoute` |
| `/auth/reset-password` | [ResetPasswordPage](./pages/ResetPasswordPage.tsx) | `/password/reset/verify/` | `GuestOnlyRoute` |

### Exemple d'implémentation :

```typescript
// Dans votre fichier de routes TanStack Router
import { GuestOnlyRoute } from '@/modules/auth/components/GuestOnlyRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'

export const loginRoute = {
    path: '/auth/login',
    component: () => (
        <GuestOnlyRoute>
            <LoginPage />
        </GuestOnlyRoute>
    )
}
```

---

## Routes protégées (Authenticated)

Ces routes nécessitent une authentification. Les utilisateurs non connectés sont redirigés vers `/auth/login`.

### Routes d'authentification

| Route Frontend | Page | Endpoint Django | Vérifications |
|----------------|------|-----------------|---------------|
| `/auth/verify-email` | [VerifyEmailPage](./pages/VerifyEmailPage.tsx) | `/verify-email/` | Authentifié |
| `/auth/change-password` | [ChangePasswordPage](./pages/ChangePasswordPage.tsx) | `/auth/change-password/` | Authentifié |

### Routes 2FA

| Route Frontend | Page | Endpoints Django | Vérifications |
|----------------|------|------------------|---------------|
| `/auth/2fa/login` | [TwoFactorLoginPage](./pages/TwoFactorLoginPage.tsx) | `/login/email/`, `/login/totp/`, `/login/static/` | Aucune (public) |
| `/auth/2fa/setup` | [Setup2FAPage](./pages/Setup2FAPage.tsx) | `/2fa/set/email/`, `/2fa/set/totp/`, `/2fa/set/static/` | Authentifié |
| `/settings/2fa` | [Manage2FAPage](./pages/Manage2FAPage.tsx) | `/2fa/disable/email/`, `/2fa/disable/totp/`, `/2fa/disable/static/` | Authentifié |

### Exemple d'implémentation :

```typescript
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute'
import { Setup2FAPage } from '@/modules/auth/pages/Setup2FAPage'

export const setup2FARoute = {
    path: '/auth/2fa/setup',
    component: () => (
        <ProtectedRoute>
            <Setup2FAPage />
        </ProtectedRoute>
    )
}
```

---

## Routes protégées par rôle

Ces routes nécessitent un rôle spécifique en plus de l'authentification.

### Routes Admin

| Route Frontend | Protection | Vérifications |
|----------------|-----------|---------------|
| `/admin/dashboard` | `requiredRole: 'admin'` | Authentifié + Admin + Email vérifié |
| `/admin/users` | `requiredRole: 'admin'` | Authentifié + Admin + Email vérifié |
| `/admin/settings` | `requiredRole: 'admin'` | Authentifié + Admin + Email vérifié + 2FA |

### Routes Teacher

| Route Frontend | Protection | Vérifications |
|----------------|-----------|---------------|
| `/teacher/dashboard` | `requiredRole: 'teacher'` | Authentifié + Teacher + Email vérifié |
| `/teacher/courses` | `requiredRole: 'teacher'` | Authentifié + Teacher + Email vérifié |

### Routes Student

| Route Frontend | Protection | Vérifications |
|----------------|-----------|---------------|
| `/student/dashboard` | `requiredRole: 'student'` | Authentifié + Student + Email vérifié |
| `/student/courses` | `requiredRole: 'student'` | Authentifié + Student + Email vérifié |

### Exemple d'implémentation :

```typescript
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute'
import { AdminDashboard } from '@/modules/admin/pages/Dashboard'

export const adminDashboardRoute = {
    path: '/admin/dashboard',
    component: () => (
        <ProtectedRoute
            requiredRole="admin"
            requireEmailVerified={true}
        >
            <AdminDashboard />
        </ProtectedRoute>
    )
}

// Pour les routes très sensibles
export const adminSettingsRoute = {
    path: '/admin/settings',
    component: () => (
        <ProtectedRoute
            requiredRole="admin"
            requireEmailVerified={true}
            require2FA={true}
        >
            <AdminSettings />
        </ProtectedRoute>
    )
}
```

---

## Composants de protection

### `ProtectedRoute`

Composant pour protéger les routes avec différents niveaux de sécurité.

#### Props

```typescript
interface ProtectedRouteProps {
    children: ReactNode
    requiredRole?: UserRole | UserRole[]  // 'admin' | 'teacher' | 'student'
    require2FA?: boolean                   // Nécessite que la 2FA soit activée
    requireEmailVerified?: boolean         // Nécessite que l'email soit vérifié (défaut: true)
}
```

#### Exemples d'utilisation

```typescript
// Protection simple (authentification + email vérifié)
<ProtectedRoute>
    <DashboardPage />
</ProtectedRoute>

// Protection par rôle unique
<ProtectedRoute requiredRole="admin">
    <AdminPanel />
</ProtectedRoute>

// Protection par rôles multiples
<ProtectedRoute requiredRole={['admin', 'teacher']}>
    <ManagementPanel />
</ProtectedRoute>

// Protection nécessitant la 2FA
<ProtectedRoute require2FA>
    <SensitiveDataPage />
</ProtectedRoute>

// Protection combinée
<ProtectedRoute
    requiredRole="admin"
    require2FA={true}
    requireEmailVerified={true}
>
    <HighSecurityPage />
</ProtectedRoute>

// Sans vérification d'email (rare)
<ProtectedRoute requireEmailVerified={false}>
    <OnboardingPage />
</ProtectedRoute>
```

#### Redirections automatiques

Le composant `ProtectedRoute` redirige automatiquement :

- **Non authentifié** → `/auth/login?redirect={current_path}`
- **Email non vérifié** → `/auth/verify-email?email={user_email}`
- **2FA non activée** (si requis) → `/auth/2fa/setup?required=true`
- **Rôle insuffisant** → `/unauthorized`

---

### `GuestOnlyRoute`

Composant pour les routes accessibles uniquement aux utilisateurs non connectés.

#### Props

```typescript
interface GuestOnlyRouteProps {
    children: ReactNode
    redirectTo?: string  // Redirection personnalisée (optionnel)
}
```

#### Exemples d'utilisation

```typescript
// Redirection automatique vers dashboard basé sur le rôle
<GuestOnlyRoute>
    <LoginPage />
</GuestOnlyRoute>

// Redirection personnalisée
<GuestOnlyRoute redirectTo="/welcome">
    <RegisterPage />
</GuestOnlyRoute>
```

#### Redirections automatiques

Le composant `GuestOnlyRoute` redirige les utilisateurs connectés :

- **Admin** → `/admin/dashboard`
- **Teacher** → `/teacher/dashboard`
- **Student** → `/student/dashboard`
- **Autre** → `/dashboard` (par défaut)
- **Avec `redirectTo`** → Route personnalisée

---

### HOCs (Higher-Order Components)

Pour une utilisation plus concise, utilisez les HOCs :

```typescript
import { withProtectedRoute, withGuestOnlyRoute } from '@/modules/auth/components'

// Guest Only HOC
const GuestLoginPage = withGuestOnlyRoute(LoginPage)

// Protected Route HOC
const ProtectedAdminPage = withProtectedRoute(AdminDashboard, {
    requiredRole: 'admin',
    require2FA: true
})

// Utilisation dans les routes
export const routes = [
    {
        path: '/auth/login',
        component: GuestLoginPage
    },
    {
        path: '/admin/dashboard',
        component: ProtectedAdminPage
    }
]
```

---

## Configuration TanStack Router

### Structure de fichier complète

```typescript
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: () => <Outlet />
})
```

```typescript
// src/routes/auth/login.tsx
import { createFileRoute } from '@tanstack/react-router'
import { GuestOnlyRoute } from '@/modules/auth/components/GuestOnlyRoute'
import { LoginPage } from '@/modules/auth/pages/LoginPage'

export const Route = createFileRoute('/auth/login')({
    component: () => (
        <GuestOnlyRoute>
            <LoginPage />
        </GuestOnlyRoute>
    )
})
```

```typescript
// src/routes/auth/2fa/setup.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute'
import { Setup2FAPage } from '@/modules/auth/pages/Setup2FAPage'

export const Route = createFileRoute('/auth/2fa/setup')({
    component: () => (
        <ProtectedRoute>
            <Setup2FAPage />
        </ProtectedRoute>
    )
})
```

```typescript
// src/routes/admin/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute'
import { AdminDashboard } from '@/modules/admin/pages/Dashboard'

export const Route = createFileRoute('/admin/dashboard')({
    component: () => (
        <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
        </ProtectedRoute>
    )
})
```

---

## Flux de redirection complet

### 1. Utilisateur non connecté accède à une route protégée

```
/admin/dashboard
    ↓ (ProtectedRoute vérifie)
Non authentifié
    ↓
Redirect → /auth/login?redirect=/admin/dashboard
    ↓
Login réussi
    ↓
Redirect → /admin/dashboard (depuis query param)
```

### 2. Utilisateur connecté mais email non vérifié

```
/dashboard
    ↓ (ProtectedRoute vérifie)
Email non vérifié
    ↓
Redirect → /auth/verify-email?email=user@example.com
    ↓
Vérification réussie
    ↓
Redirect → /auth/login (puis login automatique vers /dashboard)
```

### 3. Utilisateur connecté accède à une route guest

```
/auth/login
    ↓ (GuestOnlyRoute vérifie)
Déjà authentifié (role: admin)
    ↓
Redirect → /admin/dashboard
```

### 4. Utilisateur connecté mais 2FA non activée (route nécessitant 2FA)

```
/admin/settings (require2FA: true)
    ↓ (ProtectedRoute vérifie)
2FA non activée
    ↓
Redirect → /auth/2fa/setup?required=true
    ↓
2FA activée
    ↓
Redirect → /admin/settings
```

---

## Matrice de protection complète

| Route | Auth | Email vérifié | Role | 2FA | Redirection si échec |
|-------|------|---------------|------|-----|---------------------|
| `/auth/login` | ❌ | - | - | - | Dashboard (si connecté) |
| `/auth/register` | ❌ | - | - | - | Dashboard (si connecté) |
| `/auth/verify-email` | ✅ | ❌ | - | - | `/auth/login` |
| `/auth/2fa/setup` | ✅ | ✅ | - | - | `/auth/login` ou `/auth/verify-email` |
| `/dashboard` | ✅ | ✅ | - | - | `/auth/login` ou `/auth/verify-email` |
| `/admin/dashboard` | ✅ | ✅ | Admin | - | `/auth/login` ou `/unauthorized` |
| `/admin/settings` | ✅ | ✅ | Admin | ✅ | Multiple (selon vérification échouée) |
| `/settings/2fa` | ✅ | ✅ | - | - | `/auth/login` ou `/auth/verify-email` |

---

## Bonnes pratiques

1. **Toujours vérifier l'email** par défaut sauf cas spécifique
2. **Utiliser `require2FA`** pour les pages sensibles (admin settings, financial data, etc.)
3. **Spécifier les rôles requis** pour éviter les accès non autorisés
4. **Conserver les paramètres de redirection** dans l'URL pour une meilleure UX
5. **Afficher un loader** pendant la vérification d'authentification
6. **Gérer les erreurs de permission** avec une page `/unauthorized` dédiée

---

## Pages manquantes recommandées

Vous devriez créer ces pages supplémentaires :

1. **`/unauthorized`** - Page d'accès non autorisé
2. **`/dashboard`** - Dashboard général (auto-redirect basé sur le rôle)
3. **`/welcome`** - Page d'accueil après inscription
4. **`/settings`** - Page de paramètres utilisateur

---

## Testing des protections

```typescript
// Test: Utilisateur non authentifié
describe('ProtectedRoute', () => {
    it('should redirect to login when not authenticated', () => {
        // ... test implementation
    })

    it('should redirect to verify-email when email not verified', () => {
        // ... test implementation
    })

    it('should redirect to 2fa-setup when 2FA required but not enabled', () => {
        // ... test implementation
    })

    it('should redirect to unauthorized when role insufficient', () => {
        // ... test implementation
    })
})
```

---

Pour plus d'informations :
- [README_ERROR_HANDLING.md](./README_ERROR_HANDLING.md) - Gestion des erreurs
- [DJANGO_API_INTEGRATION.md](./DJANGO_API_INTEGRATION.md) - Intégration API Django
