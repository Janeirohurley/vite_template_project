# ErrorBoundary - Guide rapide

## 🚀 Démarrage rapide

Votre ErrorBoundary est maintenant **complètement configuré** !

### ✅ Configuration actuelle

1. **ErrorBoundary** entoure toute l'application dans [src/main.tsx](../main.tsx)
2. **GenericErrorComponent** défini comme errorComponent par défaut
3. **Logging** activé dans la console pour debug
4. **Page de test** disponible à `/test-errors`

---

## 🧪 Tester maintenant

### Option 1: Page de test (RECOMMANDÉ)

```bash
# 1. Démarrez l'application
npm run dev

# 2. Visitez la page de test
http://localhost:5173/test-errors
```

Sur cette page, vous pouvez :
- ✅ Tester l'ErrorBoundary (erreur de rendu)
- ✅ Tester les erreurs 404, 401
- ✅ Tester les erreurs réseau
- ✅ Voir quelles erreurs sont capturées ou non

### Option 2: Test manuel dans votre code

Ajoutez temporairement dans un de vos composants :

```tsx
// Dans n'importe quel composant
function MyComponent() {
    // Décommentez pour tester
    // throw new Error('Test: ErrorBoundary fonctionne!');

    return <div>Mon composant</div>;
}
```

---

## 📁 Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `src/components/ErrorBoundary.tsx` | ✅ Amélioré avec componentDidCatch et logging |
| `src/main.tsx` | ✅ Ajout de defaultErrorComponent |
| `src/routes/__root.tsx` | ✅ Ajout de errorComponent |
| `src/components/ErrorTestComponent.tsx` | ✅ Créé (page de test) |
| `src/routes/test-errors.tsx` | ✅ Créé (route de test) |

---

## 🎯 Ce qui fonctionne maintenant

### ✅ Capturé et affiché automatiquement

- Erreurs de rendu React
- Erreurs dans les loaders de routes
- Erreurs de navigation
- Erreurs avec codes HTTP (401, 404, 500, etc.)
- Erreurs réseau

### ⚠️ Nécessite gestion manuelle

- Erreurs dans event handlers → Utilisez try/catch
- Erreurs async → Utilisez .catch() ou try/await
- Erreurs dans setTimeout → Utilisez try/catch

---

## 🔍 Vérifier que ça fonctionne

### 1. Ouvrez la console (F12)

Vous devriez voir ces logs quand une erreur se produit :

```
ErrorBoundary caught an error: Error: ...
ErrorBoundary - Error details: { error, errorInfo, componentStack }
```

### 2. L'interface affiche ErrorDisplay

Quand une erreur est capturée, vous devriez voir :
- ❌ Icône rouge animée
- 📝 Titre et message d'erreur
- 🔙 Boutons "Retour" et navigation
- 📧 Lien de contact support

---

## 💡 Exemples d'utilisation

### Déclencher une erreur pour tester

```tsx
// Dans votre composant
function TestComponent() {
    const [shouldError, setShouldError] = useState(false);

    if (shouldError) {
        throw new Error('Test: ErrorBoundary fonctionne!');
    }

    return (
        <button onClick={() => setShouldError(true)}>
            Déclencher une erreur
        </button>
    );
}
```

### Gérer une erreur async

```tsx
// ✅ Bon - avec gestion d'erreur
async function fetchData() {
    try {
        const response = await api.get('/data');
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`${error.response?.status} - ${error.message}`);
        }
        throw error;
    }
}
```

### Utiliser errorComponent spécialisé

```tsx
import { AuthErrorComponent } from '@/modules/auth/components/AuthErrorComponent';

export const Route = createFileRoute('/protected')({
    component: ProtectedPage,
    errorComponent: AuthErrorComponent, // ✅ Erreurs auth personnalisées
});
```

---

## 🐛 Débogage

### L'erreur n'apparaît pas à l'écran

**Vérifiez** :
1. La console - Y a-t-il un log "ErrorBoundary caught an error" ?
   - ✅ OUI → ErrorBoundary fonctionne, problème d'affichage
   - ❌ NON → L'erreur n'est pas capturée (event handler, async)

2. Le type d'erreur :
   - Erreur de rendu → ✅ Capturée
   - Event handler → ❌ Utilisez try/catch
   - Async → ❌ Utilisez .catch()

3. ErrorDisplay est importé :
```tsx
import { ErrorDisplay } from '@/components/ErrorDisplay';
```

### L'erreur crash l'application

Si l'application crash complètement :
1. Vérifiez que ErrorBoundary entoure bien tout dans main.tsx
2. Vérifiez qu'il n'y a pas d'erreur de syntaxe dans ErrorBoundary.tsx
3. Regardez la stack trace dans la console

---

## 📚 Documentation complète

Pour plus de détails, consultez :
- [ERROR_HANDLING_SETUP.md](../../ERROR_HANDLING_SETUP.md) - Guide complet
- [ERROR_COMPONENTS_README.md](./ERROR_COMPONENTS_README.md) - Doc des composants

---

## ✅ Checklist avant production

Avant de déployer :

- [ ] Testez toutes les erreurs sur `/test-errors`
- [ ] Vérifiez le mode sombre
- [ ] Testez sur mobile
- [ ] **SUPPRIMEZ** `src/components/ErrorTestComponent.tsx`
- [ ] **SUPPRIMEZ** `src/routes/test-errors.tsx`
- [ ] Configurez un service de monitoring (Sentry, LogRocket, etc.)
- [ ] Testez en build de production (`npm run build && npm run preview`)

---

## 🎉 C'est tout !

Votre application gère maintenant correctement les erreurs. Visitez `/test-errors` pour vérifier !

Si vous avez des questions, consultez la documentation complète.
