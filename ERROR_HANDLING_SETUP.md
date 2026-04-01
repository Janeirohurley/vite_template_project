# Configuration complète de la gestion d'erreurs

Ce document explique comment la gestion d'erreurs est configurée dans l'application UMS et comment la tester.

## 📋 Table des matières

1. [Architecture de gestion d'erreurs](#architecture-de-gestion-derreurs)
2. [Configuration actuelle](#configuration-actuelle)
3. [Comment tester](#comment-tester)
4. [Types d'erreurs capturées](#types-derreurs-capturées)
5. [Débogage](#débogage)
6. [Bonnes pratiques](#bonnes-pratiques)

---

## Architecture de gestion d'erreurs

L'application utilise **3 niveaux de gestion d'erreurs** :

```
┌─────────────────────────────────────────────────┐
│  Niveau 1: React ErrorBoundary                  │
│  Capture: Erreurs de rendu React                │
│  Fichier: src/components/ErrorBoundary.tsx      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Niveau 2: TanStack Router errorComponent       │
│  Capture: Erreurs dans loaders et navigation    │
│  Fichier: src/main.tsx & src/routes/__root.tsx  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  Niveau 3: Composants d'erreur spécialisés      │
│  - GenericErrorComponent (erreurs générales)    │
│  - AuthErrorComponent (erreurs auth)            │
│  - ChangePasswordErrorComponent (reset pwd)     │
└─────────────────────────────────────────────────┘
```

---

## Configuration actuelle

### 1. ErrorBoundary (src/components/ErrorBoundary.tsx)

Le composant ErrorBoundary capture les erreurs de rendu React :

```tsx
// Utilisation dans main.tsx
<ErrorBoundary>
    <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
    </QueryClientProvider>
</ErrorBoundary>
```

**Fonctionnalités** :
- ✅ Capture les erreurs de rendu
- ✅ Log détaillé dans la console
- ✅ Affichage de l'ErrorDisplay
- ✅ Callback `onError` optionnel
- ✅ Fallback personnalisé possible

### 2. TanStack Router errorComponent (src/main.tsx)

Le router est configuré avec un `defaultErrorComponent` :

```tsx
const router = createRouter({
    routeTree,
    defaultErrorComponent: GenericErrorComponent,
    context: undefined!,
});
```

**Ce qui est capturé** :
- ✅ Erreurs dans les loaders de routes
- ✅ Erreurs de navigation
- ✅ Erreurs dans les composants de routes
- ✅ Erreurs 404 (via notFoundComponent)

### 3. Route-specific errorComponent (src/routes/__root.tsx)

La route root a son propre errorComponent :

```tsx
export const Route = createRootRoute({
    component: RootComponent,
    errorComponent: GenericErrorComponent,
    notFoundComponent: NotFoundComponent,
});
```

### 4. Composants d'erreur spécialisés

Chaque module peut avoir son propre errorComponent :

```tsx
// Exemple: Route d'authentification
export const Route = createFileRoute('/auth/login')({
    component: LoginPage,
    errorComponent: AuthErrorComponent, // ✅ Spécialisé pour l'auth
});
```

---

## Comment tester

### Étape 1: Accédez à la page de test

Naviguez vers : **http://localhost:5173/test-errors**

### Étape 2: Testez les différents types d'erreurs

La page de test propose 6 types d'erreurs :

#### Test 1: Erreur de rendu React ✅ CAPTURÉE
```tsx
// Déclenche une erreur dans le render
if (count === 1) {
    throw new Error('Erreur de rendu');
}
```

**Résultat attendu** :
- ✅ ErrorBoundary capture l'erreur
- ✅ Affichage de ErrorDisplay
- ✅ Log dans la console avec stack trace
- ✅ Boutons "Retour" et "Retour à l'accueil" fonctionnels

#### Test 2: Erreur 404 ✅ CAPTURÉE
```tsx
throw new Error('404 - Not Found');
```

**Résultat attendu** :
- ✅ GenericErrorComponent détecte le code 404
- ✅ Message personnalisé "Page introuvable"
- ✅ Redirection vers la page d'accueil

#### Test 3: Erreur 401 ✅ CAPTURÉE
```tsx
throw new Error('401 - Unauthorized');
```

**Résultat attendu** :
- ✅ AuthErrorComponent détecte le code 401
- ✅ Message "Authentification requise"
- ✅ Bouton "Se connecter"

#### Test 4: Erreur réseau ✅ CAPTURÉE
```tsx
throw new Error('Network error: fetch failed');
```

**Résultat attendu** :
- ✅ Détection automatique de l'erreur réseau
- ✅ Message "Problème de connexion"
- ✅ Suggestion de vérifier la connexion internet

#### Test 5: Erreur event handler ❌ PAS CAPTURÉE
```tsx
const handleClick = () => {
    throw new Error('Event handler error');
}
```

**Résultat attendu** :
- ❌ ErrorBoundary NE CAPTURE PAS
- ⚠️ Erreur visible uniquement dans la console
- 💡 Doit être gérée avec try/catch

#### Test 6: Erreur async ❌ PAS CAPTURÉE
```tsx
const asyncFunction = async () => {
    throw new Error('Async error');
}
```

**Résultat attendu** :
- ❌ ErrorBoundary NE CAPTURE PAS
- ⚠️ Erreur dans la console si pas de .catch()
- 💡 Utiliser .catch() ou try/catch dans async/await

### Étape 3: Vérifiez la console

Ouvrez les DevTools (F12) et vérifiez :

```
✅ ErrorBoundary caught an error: Error: Test error
✅ ErrorBoundary - Error details: {
    error: Error,
    errorInfo: { componentStack: "..." },
    componentStack: "at Component..."
}
```

### Étape 4: Testez la navigation

1. Cliquez sur "Retour" → Devrait utiliser history.back()
2. Cliquez sur "Retour à l'accueil" → Devrait naviguer vers "/"

### Étape 5: Testez le mode sombre

1. Activez le mode sombre dans les paramètres
2. Déclenchez une erreur
3. Vérifiez que ErrorDisplay s'affiche correctement

---

## Types d'erreurs capturées

### ✅ Capturées par ErrorBoundary

| Type | Exemple | Capturé |
|------|---------|---------|
| Erreur de rendu | `throw new Error()` dans render | ✅ |
| Erreur dans lifecycle | `componentDidMount()` throw | ✅ |
| Erreur dans constructor | `constructor()` throw | ✅ |
| Erreur dans getDerivedStateFromProps | Erreur dans cette méthode | ✅ |

### ✅ Capturées par TanStack Router

| Type | Exemple | Capturé |
|------|---------|---------|
| Erreur dans loader | `loader: async () => throw new Error()` | ✅ |
| Navigation vers route inexistante | `/route-qui-nexiste-pas` | ✅ (notFoundComponent) |
| Erreur dans beforeLoad | `beforeLoad: () => throw new Error()` | ✅ |

### ❌ PAS capturées automatiquement

| Type | Exemple | Solution |
|------|---------|----------|
| Event handlers | `onClick={() => throw}` | try/catch manuel |
| Async functions | `async () => throw` | .catch() ou try/await |
| setTimeout/setInterval | `setTimeout(() => throw)` | try/catch manuel |
| Promises | `Promise.reject()` | .catch() |
| useEffect sans throw | `useEffect(() => error)` | try/catch |

---

## Débogage

### Problème : Les erreurs ne s'affichent pas

**Vérifications** :

1. **ErrorBoundary est-il bien placé ?**
```tsx
// ✅ Correct - dans main.tsx
<ErrorBoundary>
    <App />
</ErrorBoundary>

// ❌ Incorrect - trop profond
<App>
    <ErrorBoundary>
        <Component />
    </ErrorBoundary>
</App>
```

2. **Le composant d'erreur est-il importé ?**
```tsx
// ✅ Correct
import { GenericErrorComponent } from '@/components/GenericErrorComponent';

// ❌ Incorrect - path invalide
import { GenericErrorComponent } from './components/GenericErrorComponent';
```

3. **Le router a-t-il un defaultErrorComponent ?**
```tsx
// ✅ Correct
const router = createRouter({
    routeTree,
    defaultErrorComponent: GenericErrorComponent,
});

// ❌ Incorrect - manquant
const router = createRouter({ routeTree });
```

4. **Vérifiez la console**
```
Si vous voyez:
"ErrorBoundary caught an error: ..."
→ L'ErrorBoundary fonctionne ✅

Si vous ne voyez rien:
→ L'erreur n'est pas capturée ❌
→ Utilisez try/catch manuel
```

### Problème : L'erreur apparaît dans la console mais pas l'UI

**Causes possibles** :

1. **Erreur dans un event handler**
```tsx
// ❌ Ne sera PAS capturé
<button onClick={() => { throw new Error('test') }}>

// ✅ Solution
<button onClick={() => {
    try {
        throw new Error('test');
    } catch (error) {
        // Gérer l'erreur
        showErrorToast(error.message);
    }
}}>
```

2. **Erreur async**
```tsx
// ❌ Ne sera PAS capturé
const fetchData = async () => {
    throw new Error('test');
}

// ✅ Solution 1: .catch()
fetchData().catch(error => {
    showErrorToast(error.message);
});

// ✅ Solution 2: try/await
try {
    await fetchData();
} catch (error) {
    showErrorToast(error.message);
}
```

3. **Erreur dans useEffect**
```tsx
// ❌ Ne sera PAS capturé
useEffect(() => {
    throw new Error('test');
}, []);

// ✅ Solution
useEffect(() => {
    try {
        // code qui peut échouer
    } catch (error) {
        setError(error);
    }
}, []);
```

### Activer le mode verbose

Pour plus de logs, modifiez ErrorBoundary :

```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ajouter plus de logs
    console.group('🔴 ErrorBoundary - Erreur capturée');
    console.error('Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack trace:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
    console.groupEnd();
}
```

---

## Bonnes pratiques

### 1. Toujours inclure le code HTTP dans les messages d'erreur

```tsx
// ✅ Bon - le code sera détecté
throw new Error('401 - Unauthorized');
throw new Error('404 - Not Found');
throw new Error('500 - Server Error');

// ❌ Mauvais - détection impossible
throw new Error('Erreur');
```

### 2. Gérer les erreurs async explicitement

```tsx
// ✅ Bon
const { data, error, isError } = useQuery({
    queryKey: ['data'],
    queryFn: fetchData,
});

if (isError) {
    return <ErrorDisplay message={error.message} />;
}

// ❌ Mauvais - erreur non gérée
const data = await fetchData(); // Peut crasher
```

### 3. Utiliser des errorComponent spécialisés

```tsx
// ✅ Bon - errorComponent spécifique
export const Route = createFileRoute('/auth/login')({
    component: LoginPage,
    errorComponent: AuthErrorComponent, // Gère les erreurs auth
});

// ⚠️ OK mais générique
export const Route = createFileRoute('/auth/login')({
    component: LoginPage,
    // Utilisera GenericErrorComponent par défaut
});
```

### 4. Logger toutes les erreurs importantes

```tsx
// ✅ Bon
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log local
    console.error('Error:', error);

    // Log vers service de monitoring (production)
    if (import.meta.env.PROD) {
        logToSentry(error, errorInfo);
    }
}
```

### 5. Tester régulièrement les erreurs

- ✅ Visitez `/test-errors` après chaque modification
- ✅ Testez en mode dev ET build
- ✅ Testez sur différents navigateurs
- ✅ Testez avec et sans DevTools ouvert

---

## Commandes utiles

```bash
# Démarrer le serveur de dev
npm run dev

# Accéder à la page de test
# → http://localhost:5173/test-errors

# Build pour production (test que les erreurs fonctionnent aussi)
npm run build
npm run preview

# Type checking
npm run type-check
```

---

## Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `src/components/ErrorBoundary.tsx` | Class component qui capture les erreurs React |
| `src/components/ErrorDisplay.tsx` | UI component pour afficher les erreurs |
| `src/components/GenericErrorComponent.tsx` | Erreur générique par défaut |
| `src/modules/auth/components/AuthErrorComponent.tsx` | Erreurs d'authentification |
| `src/modules/auth/components/ChangePasswordErrorComponent.tsx` | Erreurs de reset password |
| `src/components/ErrorTestComponent.tsx` | Component de test (à supprimer en prod) |
| `src/routes/test-errors.tsx` | Route de test (à supprimer en prod) |
| `src/main.tsx` | Configuration du router avec errorComponent |
| `src/routes/__root.tsx` | ErrorComponent pour la route root |

---

## FAQ

**Q: Pourquoi mon ErrorBoundary ne capture pas mon erreur ?**

R: ErrorBoundary capture UNIQUEMENT les erreurs de rendu React. Les erreurs dans event handlers, async functions, ou useEffect ne sont PAS capturées. Utilisez try/catch manuel.

**Q: Comment tester que mon ErrorBoundary fonctionne ?**

R: Visitez `/test-errors` et cliquez sur "Déclencher erreur de rendu".

**Q: Les erreurs async ne s'affichent pas, que faire ?**

R: Gérez-les manuellement avec .catch() ou try/await, puis utilisez un state pour afficher l'erreur.

**Q: Comment personnaliser le message d'erreur ?**

R: Passez des props à ErrorDisplay ou créez un composant d'erreur personnalisé.

**Q: Faut-il supprimer le composant de test en production ?**

R: OUI ! Supprimez `ErrorTestComponent.tsx` et `test-errors.tsx` avant le déploiement.

---

## Support

Pour toute question :
- Consultez ce document
- Vérifiez la console pour les logs
- Testez avec `/test-errors`
- Consultez la documentation de React ErrorBoundary
- Consultez la documentation de TanStack Router

---

## Licence

© 2024 UMS - Université Privée de Gitega
