# Error Components - Guide d'utilisation

Documentation complète des composants de gestion d'erreurs de l'application UMS.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture](#architecture)
3. [Composants disponibles](#composants-disponibles)
4. [Utilisation](#utilisation)
5. [Personnalisation](#personnalisation)
6. [Cas d'usage](#cas-dusage)
7. [Bonnes pratiques](#bonnes-pratiques)
8. [Types d'erreurs gérées](#types-derreurs-gérées)

---

## Vue d'ensemble

Le système de gestion d'erreurs de l'application UMS est composé de plusieurs composants modulaires et réutilisables qui offrent une expérience utilisateur cohérente en cas d'erreur.

### Philosophie

- **Clarté** : Messages d'erreur explicites et compréhensibles
- **Action** : Toujours proposer une action corrective à l'utilisateur
- **Contexte** : Adapter le message selon le contexte (authentification, navigation, etc.)
- **Design** : Interface animée et professionnelle avec support du mode sombre

---

## Architecture

```
src/components/
├── ErrorDisplay.tsx                    # Composant de base (UI)
├── GenericErrorComponent.tsx           # Erreur générique pour toute l'app
└── ERROR_COMPONENTS_README.md          # Cette documentation

src/modules/auth/components/
├── AuthErrorComponent.tsx              # Erreurs d'authentification
└── ChangePasswordErrorComponent.tsx    # Erreurs de réinitialisation de mot de passe
```

### Hiérarchie des composants

```
ErrorDisplay (Base UI Component)
    │
    ├── GenericErrorComponent
    ├── AuthErrorComponent
    └── ChangePasswordErrorComponent
```

---

## Composants disponibles

### 1. ErrorDisplay (Composant de base)

**Fichier** : [src/components/ErrorDisplay.tsx](./ErrorDisplay.tsx)

Composant UI de base utilisé par tous les autres composants d'erreur.

#### Props

```typescript
interface ErrorDisplayProps {
    /** Titre de l'erreur */
    title?: string;

    /** Message d'erreur détaillé */
    message?: string;

    /** Afficher le bouton de retour */
    showBackButton?: boolean;

    /** URL de retour personnalisée */
    backUrl?: string;

    /** Texte du bouton de retour */
    backButtonText?: string;

    /** Utilise toute la hauteur de l'écran */
    fullScreen?: boolean;
}
```

#### Valeurs par défaut

```typescript
{
    title: "Une erreur est survenue",
    message: "Quelque chose s'est mal passé. Veuillez réessayer.",
    showBackButton: true,
    backUrl: "/auth/login",
    backButtonText: "Retour à la connexion",
    fullScreen: true
}
```

#### Fonctionnalités

- ✅ Animations Framer Motion fluides
- ✅ Support du mode sombre
- ✅ Icône d'erreur animée
- ✅ Deux boutons : "Retour" (historique) et bouton personnalisé
- ✅ Footer avec lien de contact support
- ✅ Responsive (mobile/desktop)

#### Exemple d'utilisation

```tsx
import { ErrorDisplay } from '@/components/ErrorDisplay';

function MyComponent() {
    return (
        <ErrorDisplay
            title="Erreur de connexion"
            message="Impossible de se connecter au serveur"
            backUrl="/dashboard"
            backButtonText="Retour au tableau de bord"
            fullScreen={false}
        />
    );
}
```

---

### 2. GenericErrorComponent

**Fichier** : [src/components/GenericErrorComponent.tsx](./GenericErrorComponent.tsx)

Composant d'erreur générique pour toute l'application. Utilisé comme fallback global.

#### Props

```typescript
interface ErrorComponentProps {
    error: Error | string | unknown;
}
```

#### Détection automatique

- Détecte le type d'erreur (Error, string, unknown)
- Extrait le nom et le message d'erreur
- Redirige vers la page d'accueil

#### Exemple d'utilisation

```tsx
// Dans le routeur TanStack Router
import { GenericErrorComponent } from '@/components/GenericErrorComponent';

const router = createRouter({
    // ...
    defaultErrorComponent: GenericErrorComponent
});
```

---

### 3. AuthErrorComponent

**Fichier** : [src/modules/auth/components/AuthErrorComponent.tsx](../modules/auth/components/AuthErrorComponent.tsx)

Composant spécialisé pour les erreurs d'authentification avec détection intelligente du type d'erreur HTTP.

#### Types d'erreurs gérées

| Code HTTP | Titre | Message personnalisé |
|-----------|-------|---------------------|
| **401** | Authentification requise | Session expirée, reconnexion nécessaire |
| **403** | Accès refusé | Pas de permissions suffisantes |
| **404** | Page introuvable | Page inexistante ou déplacée |
| **400** | Requête invalide | Données incorrectes |
| **422** | Données invalides | Erreur de validation |
| **429** | Trop de tentatives | Limitation de taux dépassée |
| **500** | Erreur serveur | Problème technique serveur |
| **502/503/504** | Service indisponible | Service temporairement inaccessible |
| Network | Problème de connexion | Pas de connexion internet |
| Session | Session expirée | Session expirée pour raisons de sécurité |
| Credentials | Identifiants incorrects | Email/mot de passe incorrect |
| Locked | Compte bloqué | Compte temporairement bloqué |
| Verify | Email non vérifié | Email nécessite vérification |

#### Exemple d'utilisation

```tsx
// Dans les routes d'authentification
import { AuthErrorComponent } from '@/modules/auth/components/AuthErrorComponent';

export const Route = createFileRoute('/auth/login')({
    component: LoginPage,
    errorComponent: AuthErrorComponent
});
```

#### Détection intelligente

Le composant analyse le message d'erreur pour détecter automatiquement le type :

```typescript
// Exemple d'erreur 401
throw new Error('Unauthorized - 401');
// → Affiche "Authentification requise" avec bouton "Se connecter"

// Exemple d'erreur réseau
throw new Error('Network error: fetch failed');
// → Affiche "Problème de connexion" avec message approprié
```

---

### 4. ChangePasswordErrorComponent

**Fichier** : [src/modules/auth/components/ChangePasswordErrorComponent.tsx](../modules/auth/components/ChangePasswordErrorComponent.tsx)

Composant spécialisé pour les erreurs de réinitialisation de mot de passe.

#### Types d'erreurs gérées

| Type d'erreur | Titre | Action proposée |
|---------------|-------|-----------------|
| **Token manquant** | Lien incomplet | Utiliser le lien complet de l'email |
| **Token invalide/expiré** | Lien expiré | Demander un nouveau lien (expire après 24h) |
| **Token déjà utilisé** | Lien déjà utilisé | Demander un nouveau lien |
| **Erreur réseau** | Problème de connexion | Vérifier la connexion internet |
| **500** | Erreur serveur | Réessayer plus tard |
| **404** | Lien introuvable | Le lien n'existe pas |
| **429** | Trop de tentatives | Patienter quelques minutes |

#### Exemple d'utilisation

```tsx
// Route de changement de mot de passe
import { ChangePasswordErrorComponent } from '@/modules/auth/components/ChangePasswordErrorComponent';

export const Route = createFileRoute('/auth/change-password')({
    component: ChangePasswordPage,
    errorComponent: ChangePasswordErrorComponent
});
```

---

## Utilisation

### 1. Utilisation dans TanStack Router

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { AuthErrorComponent } from '@/modules/auth/components/AuthErrorComponent';

export const Route = createFileRoute('/protected-route')({
    component: ProtectedPage,
    errorComponent: AuthErrorComponent,

    // Option : loader avec gestion d'erreur
    loader: async () => {
        const data = await fetchData();
        if (!data) {
            throw new Error('404 - Data not found');
        }
        return data;
    }
});
```

### 2. Utilisation dans un composant

```tsx
import { ErrorDisplay } from '@/components/ErrorDisplay';

function MyComponent() {
    const [error, setError] = useState<string | null>(null);

    if (error) {
        return (
            <ErrorDisplay
                title="Erreur de chargement"
                message={error}
                backUrl="/dashboard"
                backButtonText="Retour au tableau de bord"
            />
        );
    }

    return <div>Contenu normal</div>;
}
```

### 3. Utilisation dans un Error Boundary

```tsx
import { Component, ReactNode } from 'react';
import { ErrorDisplay } from '@/components/ErrorDisplay';

class ErrorBoundary extends Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <ErrorDisplay
                    title="Une erreur inattendue s'est produite"
                    message={this.state.error?.message}
                />
            );
        }

        return this.props.children;
    }
}
```

### 4. Utilisation dans React Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { ErrorDisplay } from '@/components/ErrorDisplay';

function DataComponent() {
    const { data, error, isError } = useQuery({
        queryKey: ['data'],
        queryFn: fetchData
    }); 

    if (isError) {
        return (
            <ErrorDisplay
                title="Erreur de chargement des données"
                message={error.message}
                backUrl="/dashboard"
                fullScreen={false}
            />
        );
    }

    return <div>{/* Afficher les données */}</div>;
}
```

---

## Personnalisation

### Créer un composant d'erreur personnalisé

```tsx
import { type ErrorComponentProps } from '@tanstack/react-router';
import { ErrorDisplay } from '@/components/ErrorDisplay';

export function CustomErrorComponent({ error }: ErrorComponentProps) {
    // Logique de détection personnalisée
    let title = 'Erreur personnalisée';
    let message = 'Message par défaut';
    let backUrl = '/custom-route';

    if (error instanceof Error) {
        // Analyser et personnaliser selon vos besoins
        if (error.message.includes('custom-error')) {
            title = 'Erreur spécifique';
            message = 'Description spécifique de l\'erreur';
        }
    }

    return (
        <ErrorDisplay
            title={title}
            message={message}
            backUrl={backUrl}
            backButtonText="Action personnalisée"
        />
    );
}
```

### Personnaliser le style

Le composant `ErrorDisplay` utilise Tailwind CSS. Vous pouvez créer une variante :

```tsx
import { ErrorDisplay, type ErrorDisplayProps } from '@/components/ErrorDisplay';

export function WarningDisplay(props: ErrorDisplayProps) {
    return (
        <ErrorDisplay
            {...props}
            // Surcharger avec vos propres classes
        />
    );
}
```

---

## Cas d'usage

### Cas 1: Erreur d'API avec gestion spécifique

```tsx
async function loginUser(credentials: LoginCredentials) {
    try {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 401) {
                throw new Error('Invalid credentials - 401');
            } else if (status === 429) {
                throw new Error('Too many login attempts - 429');
            } else if (status === 500) {
                throw new Error('Server error - 500');
            }
        }
        throw new Error('Network error');
    }
}
```

### Cas 2: Validation de token de réinitialisation

```tsx
async function validateResetToken(token: string) {
    if (!token) {
        throw new Error('Token manquant dans l\'URL');
    }

    try {
        const response = await api.post('/auth/verify-token', { token });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.message;

            if (status === 404) {
                throw new Error('Token invalide ou expiré');
            } else if (message?.includes('used')) {
                throw new Error('Token déjà utilisé');
            }
        }
        throw error;
    }
}
```

### Cas 3: Gestion d'erreur dans un loader de route

```tsx
export const Route = createFileRoute('/student/$studentId')({
    component: StudentDetailsPage,
    errorComponent: AuthErrorComponent,

    loader: async ({ params }) => {
        try {
            const student = await fetchStudent(params.studentId);

            if (!student) {
                throw new Error('404 - Student not found');
            }

            return student;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 403) {
                    throw new Error('403 - Forbidden: No permission to view this student');
                }
            }
            throw error;
        }
    }
});
```

---

## Bonnes pratiques

### 1. Toujours fournir un contexte

❌ **Mauvais**
```tsx
throw new Error('Error');
```

✅ **Bon**
```tsx
throw new Error('Failed to load student data - 500 Server Error');
```

### 2. Utiliser des codes HTTP explicites

```tsx
// Dans vos erreurs, incluez le code HTTP
throw new Error('Unauthorized access - 401');
throw new Error('Resource not found - 404');
throw new Error('Validation failed - 422');
```

### 3. Adapter l'erreur au contexte

```tsx
// Pour l'authentification
export const loginRoute = createFileRoute('/auth/login')({
    errorComponent: AuthErrorComponent  // ✅
});

// Pour la réinitialisation
export const resetRoute = createFileRoute('/auth/reset')({
    errorComponent: ChangePasswordErrorComponent  // ✅
});

// Pour le reste de l'app
const router = createRouter({
    defaultErrorComponent: GenericErrorComponent  // ✅
});
```

### 4. Tester les cas d'erreur

```tsx
describe('Error Handling', () => {
    it('should show appropriate error for 401', () => {
        const error = new Error('Unauthorized - 401');
        render(<AuthErrorComponent error={error} />);

        expect(screen.getByText('Authentification requise')).toBeInTheDocument();
    });

    it('should show network error message', () => {
        const error = new Error('Network error: fetch failed');
        render(<AuthErrorComponent error={error} />);

        expect(screen.getByText('Problème de connexion')).toBeInTheDocument();
    });
});
```

### 5. Logger les erreurs

```tsx
import { logger } from '@/lib/logger';

export function AuthErrorComponent({ error }: ErrorComponentProps) {
    // Logger l'erreur pour le monitoring
    logger.error('Auth error occurred', { error });

    // ... reste du code
}
```

### 6. Fournir une action de récupération

Chaque erreur doit proposer une action claire :

```tsx
<ErrorDisplay
    title="Erreur de connexion"
    message="Impossible de se connecter"
    backUrl="/auth/login"
    backButtonText="Réessayer la connexion"  // ✅ Action claire
/>
```

---

## Types d'erreurs gérées

### Erreurs HTTP

| Code | Type | Utilisation |
|------|------|-------------|
| 400 | Bad Request | Requête malformée |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Pas de permissions |
| 404 | Not Found | Ressource introuvable |
| 422 | Unprocessable Entity | Validation échouée |
| 429 | Too Many Requests | Rate limiting |
| 500 | Internal Server Error | Erreur serveur |
| 502 | Bad Gateway | Proxy error |
| 503 | Service Unavailable | Service down |
| 504 | Gateway Timeout | Timeout proxy |

### Erreurs réseau

- Timeout
- Connection refused
- DNS resolution failed
- Network unreachable

### Erreurs d'authentification

- Invalid credentials
- Session expired
- Account locked
- Email not verified
- Token expired
- Token invalid
- Token already used

### Erreurs métier

- Validation errors
- Business rule violations
- Resource conflicts
- Insufficient permissions

---

## Support du mode sombre

Tous les composants supportent automatiquement le mode sombre via Tailwind CSS :

```tsx
// Classes utilisées
className="bg-white dark:bg-gray-900"
className="text-gray-900 dark:text-gray-100"
className="border-gray-200 dark:border-gray-700"
```

---

## Animations

Les composants utilisent Framer Motion pour des animations fluides :

- **Fade in** : Apparition en fondu
- **Scale** : Zoom de l'icône d'erreur
- **Slide up** : Montée des éléments
- **Hover effects** : Effets au survol des boutons
- **Tap effects** : Effets au clic

```tsx
<motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
>
    {/* Contenu */}
</motion.div>
```

---

## Contact et support

Pour toute question ou amélioration :
- Email : support@upg.bi
- Documentation : Voir ce README
- Issues : Créer un ticket dans votre système de suivi

---

## Licence

© 2024 UMS - Université Privée de Gitega
