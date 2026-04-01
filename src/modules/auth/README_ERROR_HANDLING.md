# Système de Gestion d'Erreurs et Redirections

## Vue d'ensemble

Le système de gestion d'erreurs a été complètement refondu pour centraliser la gestion des erreurs API, les messages traduits et les redirections automatiques basées sur les codes d'erreur du backend Django.

## Architecture

### 1. **ERROR_MESSAGES** ([src/lib/errorMessages.ts](../../../lib/errorMessages.ts))

Fichier central contenant tous les messages d'erreur traduits en français.

#### Fonctionnalités principales :

- **ERROR_MESSAGES** : Mapping des codes d'erreur vers des messages en français
- **getErrorMessage()** : Récupère un message traduit
- **formatDjangoErrors()** : Formate les erreurs de champs Django
- **translateDjangoError()** : Traduit une réponse d'erreur complète
- **getErrorRedirectAction()** : Détermine l'action de redirection nécessaire

#### Constantes de redirection :

```typescript
// Codes nécessitant une redirection vers login
ERROR_CODES_REQUIRING_LOGIN = [
    'Unauthorized',
    'InvalidToken',
    'TokenExpired',
    'EmailNotVerified',
]

// Codes nécessitant une vérification email
ERROR_CODES_REQUIRING_EMAIL_VERIFICATION = [
    'EmailNotVerified',
]

// Codes nécessitant une configuration 2FA
ERROR_CODES_REQUIRING_2FA_SETUP = [
    'Email2FANotSet',
    'TOTP2FANotSet',
    'Static2FANotSet',
]
```

### 2. **Intercepteur Axios** ([src/lib/axios.ts](../../../lib/axios.ts))

L'intercepteur Axios a été amélioré pour :

1. **Traduire automatiquement les erreurs** : Utilise `translateDjangoError()` et `extractErrorCode()`
2. **Formater les erreurs** : Crée un objet `formattedError` attaché à l'erreur axios
3. **Nettoyer les tokens automatiquement** : Supprime les tokens localStorage en cas d'erreur 401 ou de codes nécessitant une déconnexion
4. **Déterminer les actions de redirection** : Utilise `getErrorRedirectAction()` pour savoir quelle redirection effectuer

#### Structure de l'erreur formatée :

```typescript
{
    message: string,              // Message traduit en français
    originalMessage: string,      // Message original du backend
    errorCode: string,            // Code d'erreur (ex: "EmailAlreadyExists")
    statusCode: number,           // Code HTTP (ex: 400, 401, 500)
    errors: Record<string, string[]> // Erreurs de champs spécifiques
}
```

### 3. **Hook useErrorHandler** ([src/modules/auth/hooks/useErrorHandler.ts](./useErrorHandler.ts))

Hook React personnalisé pour gérer les erreurs de manière centralisée dans les composants.

#### Méthodes disponibles :

##### `handleError(error, options)`

Méthode principale pour gérer les erreurs.

**Options :**
- `showToast` (default: true) : Afficher un notify automatiquement
- `autoRedirect` (default: true) : Rediriger automatiquement si nécessaire
- `customMessage` : Message personnalisé à afficher
- `onRedirect` : Callback appelé avant la redirection

**Retourne :**
```typescript
{
    errorCode: string,
    message: string,
    redirectAction: ErrorRedirectAction,
    fieldErrors: Record<string, string>
}
```

##### `showError(error, customMessage?)`

Variante simplifiée pour afficher uniquement un message d'erreur sans redirection.

##### `handleErrorWithRedirect(error, onRedirect?)`

Variante pour gérer les erreurs avec redirection automatique.

##### `performRedirect(action)`

Effectue une redirection basée sur l'action déterminée.

**Types de redirections :**
- `{ type: 'login' }` → Redirige vers `/auth/login` et déconnecte l'utilisateur
- `{ type: 'verify-email', email?: string }` → Redirige vers `/auth/verify-email`
- `{ type: '2fa-setup', method?: string }` → Redirige vers `/auth/2fa-setup`
- `{ type: 'none' }` → Aucune redirection

### 4. **Hooks d'authentification mis à jour**

#### useLogin ([src/modules/auth/hooks/useLogin.ts](./useLogin.ts))

```typescript
const { handleErrorWithRedirect } = useErrorHandler()

// En cas d'erreur :
onError: (error) => {
    handleErrorWithRedirect(error, (redirectAction) => {
        // Callback optionnel avant redirection
    })
}
```

#### useRegister ([src/modules/auth/hooks/useRegister.ts](./useRegister.ts))

```typescript
const { handleErrorWithRedirect } = useErrorHandler()

// Même pattern que useLogin
onError: (error) => {
    handleErrorWithRedirect(error)
}
```

#### useForgotPassword ([src/modules/auth/hooks/useForgotPassword.ts](./useForgotPassword.ts))

```typescript
const { handleError } = useErrorHandler()

// Pas de redirection automatique pour forgot password
onError: (error) => {
    handleError(error, {
        showToast: true,
        autoRedirect: false  // Important !
    })
}
```

### 5. **AuthStore mis à jour** ([src/modules/auth/store/authStore.ts](../store/authStore.ts))

Le store Zustand a été amélioré pour :

1. **Gérer les tokens** : Stocke `accessToken` et `refreshToken`
2. **Nouvelle méthode `setAuth()`** : Permet de définir user + tokens en une seule fois
3. **Logout amélioré** : Nettoie tous les tokens et données

```typescript
interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean

    // Nouvelle méthode
    setAuth: (user: User, accessToken: string, refreshToken?: string) => void
}
```

## Flux de gestion d'erreur

```
1. API Call (ex: loginApi)
   ↓
2. Erreur backend Django
   ↓
3. Intercepteur Axios
   - Traduit l'erreur (translateDjangoError)
   - Extrait le code (extractErrorCode)
   - Formate l'erreur (formattedError)
   - Nettoie les tokens si nécessaire
   ↓
4. Hook (useLogin, useRegister, etc.)
   - Reçoit l'erreur formatée
   ↓
5. useErrorHandler
   - Détermine l'action (getErrorRedirectAction)
   - Affiche le notify avec message traduit
   - Affiche les erreurs de champs si présentes
   - Effectue la redirection si nécessaire
   ↓
6. Utilisateur voit :
   - Message d'erreur en français
   - Redirection automatique si nécessaire
```

## Exemples d'utilisation

### Exemple 1 : Utilisation basique dans un hook

```typescript
import { useMutation } from '@tanstack/react-query'
import { useErrorHandler } from '../hooks/useErrorHandler'
import type { ApiError } from '@/types/api'

export function useMyCustomHook() {
    const { handleErrorWithRedirect } = useErrorHandler()

    return useMutation({
        mutationFn: myApiCall,
        onSuccess: (data) => {
            // Gérer le succès
        },
        onError: (error: ApiError) => {
            // Gestion automatique des erreurs avec redirection
            handleErrorWithRedirect(error)
        }
    })
}
```

### Exemple 2 : Sans redirection automatique

```typescript
export function useMyCustomHook() {
    const { handleError } = useErrorHandler()

    return useMutation({
        mutationFn: myApiCall,
        onError: (error: ApiError) => {
            handleError(error, {
                showToast: true,
                autoRedirect: false  // Pas de redirection
            })
        }
    })
}
```

### Exemple 3 : Avec callback personnalisé avant redirection

```typescript
export function useMyCustomHook() {
    const { handleErrorWithRedirect } = useErrorHandler()

    return useMutation({
        mutationFn: myApiCall,
        onError: (error: ApiError) => {
            handleErrorWithRedirect(error, (redirectAction) => {
                // Code exécuté AVANT la redirection
                console.log('Redirection vers:', redirectAction.type)

                // Exemple: sauvegarder un état avant redirection
                if (redirectAction.type === 'login') {
                    sessionStorage.setItem('redirect_after_login', '/dashboard')
                }
            })
        }
    })
}
```

### Exemple 4 : Message personnalisé

```typescript
export function useMyCustomHook() {
    const { showError } = useErrorHandler()

    return useMutation({
        mutationFn: myApiCall,
        onError: (error: ApiError) => {
            // Afficher un message personnalisé
            showError(error, "Une erreur s'est produite lors de cette opération.")
        }
    })
}
```

### Exemple 5 : Utilisation directe dans un composant

```typescript
import { useErrorHandler } from '@/modules/auth/hooks'

function MyComponent() {
    const { performRedirect } = useErrorHandler()

    const handleManualRedirect = () => {
        // Redirection manuelle vers la page de login
        performRedirect({ type: 'login' })
    }

    return (
        <button onClick={handleManualRedirect}>
            Se reconnecter
        </button>
    )
}
```

## Ajouter de nouveaux codes d'erreur

Pour ajouter un nouveau code d'erreur :

1. **Ajoutez le code dans ERROR_MESSAGES** ([src/lib/errorMessages.ts](../../../lib/errorMessages.ts)) :

```typescript
export const ERROR_MESSAGES: Record<string, string> = {
    // ... codes existants
    MonNouveauCode: "Message en français pour ce code",
}
```

2. **Si le code nécessite une redirection, ajoutez-le dans la constante appropriée** :

```typescript
export const ERROR_CODES_REQUIRING_LOGIN = [
    'Unauthorized',
    'InvalidToken',
    'TokenExpired',
    'MonNouveauCodeNecessitantLogin',  // ← Ajoutez ici
]
```

3. **Si nécessaire, ajoutez une logique personnalisée dans `getErrorRedirectAction()`** :

```typescript
export function getErrorRedirectAction(errorCode: string): ErrorRedirectAction {
    if (errorCode === 'MonCodeSpecial') {
        return { type: 'custom-page', customData: 'value' }
    }
    // ... reste de la logique
}
```

## Tests

Pour tester le système de gestion d'erreurs :

1. **Tester les codes d'erreur** : Simulez des erreurs depuis le backend Django avec différents codes
2. **Vérifier les traductions** : Assurez-vous que les messages sont bien traduits
3. **Vérifier les redirections** : Testez que les redirections fonctionnent correctement
4. **Vérifier le nettoyage des tokens** : Assurez-vous que les tokens sont bien supprimés en cas d'erreur 401

## Bonnes pratiques

1. **Toujours utiliser useErrorHandler** : Ne pas gérer les erreurs manuellement avec notify.error()
2. **Utiliser les types ApiError** : Toujours typer les erreurs comme `ApiError` dans les hooks
3. **Logger en développement** : Utiliser `import.meta.env.DEV` pour les logs de debug
4. **Messages personnalisés avec parcimonie** : Préférer les messages traduits automatiquement
5. **Tester les codes d'erreur** : Vérifier que tous les codes backend ont une traduction

## Migration depuis l'ancien système

Si vous avez des hooks qui utilisent encore l'ancien système :

### Avant :
```typescript
onError: (error) => {
    notify.error(error.message || 'Erreur')
    if (error.errorCode === 'EmailAlreadyExists') {
        // Logique manuelle
    }
}
```

### Après :
```typescript
import { useErrorHandler } from '../hooks/useErrorHandler'

const { handleErrorWithRedirect } = useErrorHandler()

onError: (error: ApiError) => {
    handleErrorWithRedirect(error)
}
```

## Problèmes connus

- Les redirections sont gérées côté client. Si l'utilisateur rafraîchit la page, il peut perdre le contexte de redirection.
- Solution : Utiliser `sessionStorage` pour sauvegarder l'URL de destination si nécessaire.

## Support

Pour toute question ou problème avec le système de gestion d'erreurs, consultez :
- [src/lib/errorMessages.ts](../../../lib/errorMessages.ts) pour les codes d'erreur
- [src/modules/auth/hooks/useErrorHandler.ts](./useErrorHandler.ts) pour la logique de gestion
- [src/lib/axios.ts](../../../lib/axios.ts) pour l'intercepteur
