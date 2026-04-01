# Module d'Authentification 🔐

> Documentation complète du module d'authentification de l'application UMS (University Management System)

## 📋 Table des matières

1. [Vue d'ensemble](#-vue-densemble)
2. [Architecture](#-architecture)
3. [Structure des dossiers](#-structure-des-dossiers)
4. [Flux d'authentification](#-flux-dauthentification)
5. [Composants](#-composants)
6. [Store et gestion d'état](#-store-et-gestion-détat)
7. [API](#-api)
8. [Types](#-types)
9. [Routing et protection](#-routing-et-protection)
10. [Mode Mock vs Production](#-mode-mock-vs-production)
11. [Gestion des erreurs](#-gestion-des-erreurs)
12. [Utilisation](#-utilisation)

---

## 🎯 Vue d'ensemble

Le module d'authentification est un système complet et modulaire qui gère :

- **Connexion** (Login)
- **Inscription** (Register)
- **Mot de passe oublié** (Forgot Password)
- **Gestion de session** (Token storage)
- **Protection des routes** (Role-based access)
- **Fallback Mock Data** (Pour développement sans backend)

### Principes de conception

1. **Modularité** : Chaque fonctionnalité est séparée en fichiers distincts
2. **Réutilisabilité** : Composants et hooks partagés
3. **Type-safety** : TypeScript pour éviter les erreurs
4. **Fallback gracieux** : API → Mock data si échec
5. **UX optimale** : Animations, feedback utilisateur, dark mode

---

## 🏗️ Architecture

```
Module Auth (src/modules/auth/)
│
├── API Layer (api/)              → Appels HTTP vers le backend
├── State Management (store/)     → Zustand store pour l'état global
├── Components (components/)      → UI réutilisables (Layout, Tabs)
├── Pages (pages/)               → Écrans d'authentification
├── Types (types/)               → Définitions TypeScript
└── index.ts                     → Exports centralisés
```

### Flux de données

```
User Input (Page) 
    ↓
Form Submit
    ↓
Store Action (login/register/etc.)
    ↓
API Call (loginApi/registerApi)
    ↓ (Success)        ↓ (Fail)
Store Update      Mock Fallback
    ↓                   ↓
Token Storage      Store Update
    ↓                   ↓
Navigation        Navigation
```

---

## 📁 Structure des dossiers

```
src/modules/auth/
│
├── api/                          # Couche API
│   ├── login.ts                 # POST /auth/login
│   ├── register.ts              # POST /auth/register
│   ├── forgotPassword.ts        # POST /auth/forgot-password
│   ├── changePassword.ts        # POST /auth/change-password
│   └── index.ts                 # Exports
│
├── components/                   # Composants UI
│   ├── AuthLayout.tsx           # Layout avec dégradé bleu + logo UPG
│   ├── AuthTabs.tsx             # Navigation Login/Register
│   └── index.ts                 # Exports
│
├── pages/                        # Écrans complets
│   ├── LoginPage.tsx            # Page de connexion
│   ├── RegisterPage.tsx         # Page d'inscription
│   ├── ForgotPasswordPage.tsx   # Page mot de passe oublié
│   └── index.ts                 # Exports
│
├── store/                        # État global
│   └── authStore.ts             # Zustand store avec persist
│
├── types/                        # Définitions TypeScript
│   └── index.d.ts               # LoginCredentials, AuthResponse, etc.
│
├── index.ts                      # Point d'entrée du module
└── README.md                     # Ce fichier
```

---

## 🔄 Flux d'authentification

### 1. Connexion (Login)

```typescript
// Étapes détaillées
1. Utilisateur entre email + password dans LoginPage
2. Soumission du formulaire → useAuthStore().login({ username, password })
3. authStore.login() tente d'appeler loginApi()
4. API Success:
   - Token stocké dans localStorage ('access_token')
   - User stocké dans Zustand store (persisté)
   - isAuthenticated = true
5. API Fail:
   - Fallback vers getMockUserByCredentials()
   - Vérification des credentials mockés
   - Si valide → token mock + user stocké
6. Navigation:
   - useEffect détecte isAuthenticated
   - Redirection vers '/' (route racine)
   - Route racine redirige vers dashboard selon rôle:
     * admin → /admin/dashboard
     * teacher → /teacher/dashboard
     * student → /student/dashboard
```

**Fichiers impliqués :**
- `pages/LoginPage.tsx` : UI et logique formulaire
- `store/authStore.ts` : Fonction `login()`
- `api/login.ts` : Appel HTTP `POST /auth/login`
- `lib/mockData.ts` : Données fallback

### 2. Inscription (Register)

```typescript
// Étapes
1. Utilisateur remplit le formulaire (prénom, nom, email, password, etc.)
2. Validation côté client:
   - Password === confirmPassword
   - Password.length >= 6
3. Soumission → registerApi()
4. Success:
   - Toast success
   - Navigation vers /auth/login
5. Fail:
   - Toast error
   - Reste sur la page
```

**Fichiers impliqués :**
- `pages/RegisterPage.tsx` : Formulaire d'inscription
- `api/register.ts` : `POST /auth/register`

### 3. Mot de passe oublié

```typescript
// Étapes
1. Utilisateur entre son email
2. Soumission → forgotPasswordApi()
3. Success:
   - État emailSent = true
   - Affichage écran de confirmation (icône ✓ verte)
   - Bouton "Retour à la connexion"
4. Fail:
   - Toast error
```

**Fichiers impliqués :**
- `pages/ForgotPasswordPage.tsx` : Formulaire + écran succès
- `api/forgotPassword.ts` : `POST /auth/forgot-password`

---

## 🧩 Composants

### AuthLayout

**Rôle :** Conteneur visuel pour toutes les pages d'authentification

**Fonctionnalités :**
- Fond dégradé bleu (`bg-gradient-to-br from-blue-900 via-blue-500 to-blue-900`)
- Adaptation dark mode automatique
- Logo UPG en haut
- Menu de paramètres (langue + thème) en haut à droite
- Animations Framer Motion (entrée, scale, rotation)

**Props :**
```typescript
interface AuthLayoutProps {
    children: ReactNode  // Contenu de la page (formulaire, etc.)
}
```

**Utilisation :**
```tsx
<AuthLayout>
    <MonFormulaireLogin />
</AuthLayout>
```

---

### AuthTabs

**Rôle :** Navigation entre Login et Register

**Fonctionnalités :**
- Deux tabs : "Connexion" et "Inscription"
- Highlight du tab actif (bg blanc + texte bleu)
- Navigation avec TanStack Router (`<Link>`)

**Props :**
```typescript
interface AuthTabsProps {
    active: 'login' | 'register'
}
```

**Utilisation :**
```tsx
<AuthTabs active="login" />
```

---

## 📦 Store et gestion d'état

### authStore (Zustand)

**Fichier :** `store/authStore.ts`

**État :**
```typescript
interface AuthState {
    user: User | null              // Utilisateur connecté
    isAuthenticated: boolean       // Statut de connexion
    isLoading: boolean            // Chargement en cours
}
```

**Actions :**

#### `login(data: LoginCredentials): Promise<boolean>`

- Tente d'appeler `loginApi(data)`
- Si échec → fallback vers `getMockUserByCredentials()`
- Stocke le token dans `localStorage` ('access_token')
- Met à jour `user` et `isAuthenticated`
- Retourne `true` si succès, `false` sinon

#### `logout(): Promise<void>`

- Supprime le token de `localStorage`
- Reset `user` et `isAuthenticated` à null/false

#### `setUser(user: User | null): void`

- Permet de définir manuellement l'utilisateur
- Met à jour `isAuthenticated` automatiquement

#### `initialize(): Promise<void>`

- Appelé au démarrage de l'app
- Vérifie si un token existe dans `localStorage`
- Si oui, restaure l'état d'authentification

#### `hasRole(role: UserRole): boolean`

- Vérifie si l'utilisateur a un rôle spécifique
- Utilisé pour les protections de routes

#### `canAccess(resource: string): boolean`

- Vérifie si l'utilisateur peut accéder à une ressource
- Utilise `lib/permissions.ts` pour les règles

**Persistance :**
- Le store est persisté dans `localStorage` avec la clé `'auth-storage'`
- Les champs `user` et `isAuthenticated` sont sauvegardés
- Rechargement automatique au refresh de la page

---

## 🌐 API

### Configuration de base

**Fichier :** `lib/axios.ts`

Toutes les requêtes utilisent une instance Axios configurée avec :
- Base URL depuis `lib/env.ts`
- Intercepteurs pour ajouter le token JWT
- Gestion des erreurs globale

### Endpoints

#### POST /auth/login

**Fichier :** `api/login.ts`

**Request :**
```typescript
{
    username: string  // Email
    password: string
}
```

**Response :**
```typescript
{
    user: User
    accessToken: string
    refreshToken?: string
}
```

---

#### POST /auth/register

**Fichier :** `api/register.ts`

**Request :**
```typescript
{
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    studentId?: string
}
```

**Response :**
```typescript
{
    user: User
    accessToken: string
}
```

---

#### POST /auth/forgot-password

**Fichier :** `api/forgotPassword.ts`

**Request :**
```typescript
{
    email: string
}
```

**Response :**
```typescript
{
    message: string
}
```

---

#### POST /auth/change-password

**Fichier :** `api/changePassword.ts`

**Request :**
```typescript
{
    currentPassword: string
    newPassword: string
}
```

**Response :**
```typescript
{
    message: string
}
```

---

## 🔤 Types

### LoginCredentials

```typescript
interface LoginCredentials {
    username: string  // Email de l'utilisateur
    password: string
}
```

### RegisterData

```typescript
interface RegisterData {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    studentId?: string  // Optionnel (pour les étudiants)
}
```

### AuthResponse

```typescript
interface AuthResponse {
    user: User              // Importé de @/types
    accessToken: string
    refreshToken?: string   // Optionnel
}
```

### AuthError

```typescript
interface AuthError {
    message: string   // Message d'erreur
    field?: string    // Champ concerné (ex: "password")
    code?: string     // Code erreur (ex: "INVALID_CREDENTIALS")
}
```

### User (global)

**Fichier :** `src/types/user.d.ts`

```typescript
interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role: UserRole        // 'admin' | 'teacher' | 'student'
    studentId?: string
    department?: string
    avatarUrl?: string
}
```

---

## 🛡️ Routing et protection

### Routes d'authentification

**Fichier :** `src/routes/auth.*.tsx`

- `/auth/login` → LoginPage
- `/auth/register` → RegisterPage
- `/auth/forgot-password` → ForgotPasswordPage

**Caractéristiques :**
- Accessibles sans authentification
- Redirection automatique si déjà connecté (via useEffect)
- Navigation vers `/` puis dashboard selon rôle

### Routes protégées

**Fichiers :** `src/routes/*.dashboard.tsx`

- `/admin/dashboard` → Admin Dashboard (requiert role='admin')
- `/teacher/dashboard` → Teacher Dashboard (requiert role='teacher')
- `/student/dashboard` → Student Dashboard (requiert role='student')

**Protection :**
```tsx
<ProtectedRoute requiredRole="admin">
    <AdminDashboard />
</ProtectedRoute>
```

**Composant ProtectedRoute :**

**Fichier :** `src/components/ProtectedRoute.tsx`

**Logique :**
1. Vérifie `isAuthenticated`
   - Si false → Redirect vers `/auth/login`
2. Vérifie `requiredRole` ou `allowedRoles`
   - Si pas le bon rôle → Redirect vers `/unauthorized`
3. Si tout est OK → Affiche le children

---

## 🔄 Mode Mock vs Production

### Mode Mock (Développement)

**Quand :** API backend non disponible ou échec de connexion

**Comportement :**
1. Tentative d'appel API
2. Si échec (catch), fallback automatique vers mock
3. Utilisation de `lib/mockData.ts`

**Utilisateurs mockés :**

```typescript
// Fichier: lib/mockData.ts
export const mockUsers = [
    {
        id: "1",
        username: "admin",
        email: "admin@upg.bi",
        role: "admin"
    },
    {
        id: "2",
        username: "teacher1",
        email: "teacher1@upg.bi",
        role: "teacher"
    },
    {
        id: "3",
        username: "student1",
        email: "student1@upg.bi",
        role: "student"
    }
]

// Fonction de vérification
export function getMockUserByCredentials(username: string, password: string): User | null {
    // Logique simple: accepte n'importe quel password pour les users mockés
    return mockUsers.find(u => u.email === username || u.username === username) || null
}
```

**Tokens mockés :**
- Format : `'fake-token-' + Date.now()`
- Stocké dans `localStorage` comme un vrai token
- Accepté par le système de routing

### Mode Production

**Quand :** API backend disponible et fonctionnelle

**Comportement :**
1. Appel API réel
2. Token JWT stocké
3. Validation côté serveur
4. Pas de fallback (erreur si échec)

**Configuration :**

```typescript
// Fichier: lib/env.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'
```

---

## ⚠️ Gestion des erreurs

### Niveaux de gestion

#### 1. Validation formulaire (côté client)

**Exemple (RegisterPage) :**
```typescript
if (password !== confirmPassword) {
    notify.error('Les mots de passe ne correspondent pas.')
    return
}

if (password.length < 6) {
    notify.error('Le mot de passe doit contenir au moins 6 caractères.')
    return
}
```

#### 2. Erreurs API

**Gérées dans le store :**
```typescript
try {
    const response = await loginApi(data)
    // Success
} catch (apiError) {
    console.warn('API login failed, using mock data:', apiError)
    // Fallback
}
```

#### 3. Erreurs réseau

**Intercepteurs Axios (lib/axios.ts) :**
- Timeout après 10s
- Retry automatique sur 5xx
- Toast notification sur erreur

#### 4. Feedback utilisateur

**Toasts (sonner) :**
```typescript
// Success
notify.success('Connexion réussie!')

// Error
notify.error('Identifiants incorrects')

// Info
notify.info('Vérifiez votre boîte mail')
```

---

## 💡 Utilisation

### Importer le module

```typescript
// Pages
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/modules/auth'

// Components
import { AuthLayout, AuthTabs } from '@/modules/auth'

// Store
import { useAuthStore } from '@/modules/auth'

// API
import { loginApi, registerApi } from '@/modules/auth'

// Types
import type { LoginCredentials, AuthResponse } from '@/modules/auth'
```

### Utiliser le store dans un composant

```typescript
function MyComponent() {
    const { user, isAuthenticated, login, logout } = useAuthStore()
    
    const handleLogin = async () => {
        const success = await login({ 
            username: 'admin@upg.bi', 
            password: 'password' 
        })
        
        if (success) {
            console.log('Connecté:', user)
        }
    }
    
    return (
        <div>
            {isAuthenticated ? (
                <button onClick={logout}>Se déconnecter</button>
            ) : (
                <button onClick={handleLogin}>Se connecter</button>
            )}
        </div>
    )
}
```

### Protéger une route

```typescript
// src/routes/admin.dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export const Route = createFileRoute('/admin/dashboard')({
    component: AdminDashboard,
})

function AdminDashboard() {
    return (
        <ProtectedRoute requiredRole="admin">
            <div>Contenu admin</div>
        </ProtectedRoute>
    )
}
```

### Créer une nouvelle page d'auth

```typescript
// 1. Créer le composant
// src/modules/auth/pages/VerifyEmailPage.tsx
import { AuthLayout } from '../components'

export function VerifyEmailPage() {
    return (
        <AuthLayout>
            <h2>Vérification email</h2>
            {/* Votre formulaire */}
        </AuthLayout>
    )
}

// 2. Exporter dans pages/index.ts
export { VerifyEmailPage } from './VerifyEmailPage'

// 3. Créer la route
// src/routes/auth.verify-email.tsx
import { createFileRoute } from '@tanstack/react-router'
import { VerifyEmailPage } from '@/modules/auth'

export const Route = createFileRoute('/auth/verify-email')({
    component: VerifyEmailPage,
})
```

---

## 🎨 Styles et thèmes

### Dark mode

Tous les composants supportent le dark mode via les classes Tailwind :

```tsx
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

**Gestion :**
- Store centralisé : `lib/store.ts` (useAppStore)
- Classe `.dark` ajoutée sur `<html>`
- Variables CSS dans `src/index.css`

### Animations

**Framer Motion :**
```tsx
<motion.div
    initial={{ scale: 0.95, y: 30 }}
    animate={{ scale: 1, y: 0 }}
    transition={{ duration: 0.6 }}
>
```

**Utilisé dans :**
- `AuthLayout` : Entrée de la page
- Formulaires : Smooth transitions

---

## 🔧 Configuration et personnalisation

### Changer la durée de session

```typescript
// store/authStore.ts
const TOKEN_EXPIRY = 7 * 24 * 60 * 60 * 1000 // 7 jours en ms

// Dans login():
localStorage.setItem('token_expiry', Date.now() + TOKEN_EXPIRY)
```

### Ajouter un nouveau rôle

```typescript
// 1. Ajouter dans types/user.d.ts
type UserRole = 'admin' | 'teacher' | 'student' | 'moderator'

// 2. Ajouter dans permissions.ts
const ROLE_PERMISSIONS = {
    moderator: ['read:users', 'moderate:content']
}

// 3. Créer le dashboard
// src/routes/moderator.dashboard.tsx
```

### Customiser les couleurs

```typescript
// AuthLayout.tsx
className="bg-linear-to-br from-purple-900 via-purple-500 to-purple-900"
```

---

## 📚 Références

### Dépendances utilisées

- **Zustand** : State management
- **TanStack Router** : Routing
- **Axios** : HTTP client
- **Sonner** : Toast notifications
- **Framer Motion** : Animations
- **Tailwind CSS** : Styles

### Fichiers importants

- `src/lib/store.ts` : Store global (auth + settings)
- `src/lib/mockData.ts` : Données de test
- `src/lib/permissions.ts` : Règles d'accès
- `src/components/ProtectedRoute.tsx` : Protection des routes
- `src/routes/__root.tsx` : Layout racine
- `src/routes/index.tsx` : Route de redirection

---

## 🐛 Debugging

### Problème : Boucle de redirection

**Cause :** Multiples redirections dans LoginPage/RegisterPage + index.tsx

**Solution :**
1. Redirection uniquement vers `/` dans les pages auth
2. La route `/` gère la redirection finale selon le rôle

### Problème : Token non persisté

**Vérifier :**
```typescript
// Dans le navigateur (DevTools > Application > Local Storage)
- auth-storage : Contient user + isAuthenticated
- access_token : Contient le JWT
```

### Problème : Mock data ne fonctionne pas

**Vérifier :**
```typescript
// lib/mockData.ts
export function getMockUserByCredentials(username: string, password: string) {
    console.log('Checking:', username, password)
    // Ajoutez des logs
}
```

---

## ✅ Checklist pour nouveaux développeurs

- [ ] Lire cette documentation
- [ ] Comprendre le flux Login → Store → API → Navigation
- [ ] Tester le mode mock avec `admin@upg.bi`
- [ ] Vérifier les tokens dans localStorage
- [ ] Comprendre ProtectedRoute et beforeLoad
- [ ] Lire lib/permissions.ts pour les rôles
- [ ] Comprendre la persistance Zustand
- [ ] Tester le dark mode sur les pages auth

---

## 🚀 Prochaines améliorations

- [ ] Refresh token automatique
- [ ] Remember me (cookie)
- [ ] 2FA (Two-Factor Authentication)
- [ ] OAuth (Google, Facebook)
- [ ] Email verification
- [ ] Password strength meter
- [ ] Rate limiting
- [ ] Captcha sur login

---

**Dernière mise à jour :** 14 novembre 2025  
**Version :** 1.0.0  
**Auteur :** UMS Development Team
