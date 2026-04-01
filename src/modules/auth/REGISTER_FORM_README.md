# Formulaire d'inscription amélioré - Documentation

Documentation complète du nouveau formulaire d'inscription multi-étapes avec tous les champs personnalisés.

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Nouvelles fonctionnalités](#nouvelles-fonctionnalités)
3. [Structure du formulaire](#structure-du-formulaire)
4. [Champs disponibles](#champs-disponibles)
5. [Validation](#validation)
6. [Utilisation](#utilisation)
7. [Personnalisation](#personnalisation)

---

## Vue d'ensemble

Le formulaire d'inscription a été complètement refondu avec :
- **Formulaire multi-étapes** (3 étapes)
- **Nouveaux champs** : genre, téléphone, date de naissance, état civil, langues parlées
- **Validation en temps réel** avec messages d'erreur contextuels
- **Interface moderne** avec animations Framer Motion
- **Support du mode sombre**
- **Indicateur de progression visuel**

---

## Nouvelles fonctionnalités

### 1. Formulaire multi-étapes

Le formulaire est divisé en 3 étapes logiques :

**Étape 1 : Identité**
- Prénom, Nom
- Numéro d'étudiant
- Email

**Étape 2 : Sécurité**
- Mot de passe
- Confirmation du mot de passe
- Conseils de sécurité

**Étape 3 : Informations complémentaires** (optionnel)
- Genre
- Date de naissance
- Numéro de téléphone
- État civil
- Langues parlées

### 2. Nouveaux composants de champs

Composants réutilisables créés dans [components/FormFields.tsx](./components/FormFields.tsx) :

- `TextField` - Champs texte, email, password, tel, date
- `SelectField` - Liste déroulante
- `MultiSelectField` - Sélection multiple avec checkboxes
- `FileField` - Upload de fichier (photo de profil)
- `FormSection` - Section avec titre et description

### 3. Validation avancée

Fichier [constants/registerOptions.ts](./constants/registerOptions.ts) contient :

- Validation d'âge (minimum 18 ans)
- Validation de numéro de téléphone (format burundais)
- Validation d'email (max 254 caractères)
- Helpers de validation réutilisables

---

## Structure du formulaire

### Architecture des fichiers

```
src/modules/auth/
├── components/
│   ├── FormFields.tsx          # Composants de champs réutilisables
│   └── index.ts               # Exports
├── constants/
│   ├── registerOptions.ts      # Options et validations
│   └── index.ts               # Exports
├── pages/
│   ├── RegisterPage.tsx        # Nouveau formulaire multi-étapes
│   └── RegisterPage.old.tsx    # Ancien formulaire (backup)
├── types/
│   └── index.d.ts             # Types mis à jour
└── REGISTER_FORM_README.md     # Cette documentation
```

### Types de données

```typescript
// Types principaux (src/modules/auth/types/index.d.ts)

export type GenderEnum = 'M' | 'F' | 'O';

export type MaritalStatusEnum = 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED';

export interface RegisterData {
    // Obligatoires
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
    studentId?: string

    // Optionnels
    gender?: GenderEnum | null
    phone_number?: string | null
    birth_date?: string | null
    nationality?: string | null
    residence?: string[] | null
    marital_status?: MaritalStatusEnum | null
    profile_picture?: string | null
    spoken_languages?: string[] | null
}
```

---

## Champs disponibles

### Champs obligatoires

| Champ | Type | Description | Validation |
|-------|------|-------------|------------|
| `firstName` | `string` | Prénom de l'étudiant | Requis, non vide |
| `lastName` | `string` | Nom de l'étudiant | Requis, non vide |
| `email` | `string` | Adresse email | Requis, format email, max 254 caractères |
| `studentId` | `string` | Numéro d'étudiant | Requis, non vide |
| `password` | `string` | Mot de passe | Requis, min 8 caractères |
| `confirmPassword` | `string` | Confirmation | Doit correspondre au password |

### Champs optionnels

| Champ | Type | Description | Format | Options |
|-------|------|-------------|--------|---------|
| `gender` | `GenderEnum` | Genre | - | M (Homme), F (Femme), O (Autre) |
| `phone_number` | `string` | Numéro de téléphone | Burundi: `+25761234567` | Max 20 caractères |
| `birth_date` | `string` | Date de naissance | ISO: `YYYY-MM-DD` | Âge min: 18 ans |
| `marital_status` | `MaritalStatusEnum` | État civil | - | SINGLE, MARRIED, DIVORCED, WIDOWED |
| `spoken_languages` | `string[]` | Langues parlées | Array de codes | FR, EN, KI, SW, ES, etc. |
| `nationality` | `string` | Nationalité | UUID | À charger depuis API |
| `residence` | `string[]` | Lieux de résidence | Array de UUIDs | À charger depuis API |
| `profile_picture` | `string` | Photo de profil | URI | À implémenter |

---

## Validation

### Validation par étape

#### Étape 1 - Identité

```typescript
validateStep1():
    ✓ Prénom : non vide
    ✓ Nom : non vide
    ✓ Numéro d'étudiant : non vide
    ✓ Email : format valide, max 254 caractères
```

#### Étape 2 - Sécurité

```typescript
validateStep2():
    ✓ Mot de passe : min 8 caractères
    ✓ Confirmation : identique au mot de passe
```

#### Étape 3 - Informations

```typescript
validateStep3():
    ✓ Téléphone : format burundais (optionnel)
    ✓ Date de naissance : âge >= 18 ans (optionnel)
```

### Fonctions de validation

```typescript
// src/modules/auth/constants/registerOptions.ts

// Valider la date de naissance
validateBirthDate(birthDate: string): { valid: boolean; error?: string }

// Valider le numéro de téléphone
validatePhoneNumber(phone: string): { valid: boolean; error?: string }

// Valider l'email
validateEmail(email: string): { valid: boolean; error?: string }

// Calculer l'âge
calculateAge(birthDate: string): number
```

### Exemples d'utilisation

```typescript
// Validation de téléphone
const phoneValidation = validatePhoneNumber('+25761234567');
if (!phoneValidation.valid) {
    console.error(phoneValidation.error);
}

// Validation de date de naissance
const birthValidation = validateBirthDate('2000-01-15');
if (!birthValidation.valid) {
    console.error(birthValidation.error);
}

// Calcul d'âge
const age = calculateAge('2000-01-15'); // 24 ans (en 2024)
```

---

## Utilisation

### Accès au formulaire

```
URL: /auth/register
Composant: RegisterPage
```

### Flux utilisateur

1. **Page de connexion** → Clic sur "S'inscrire"
2. **Étape 1** : Remplir identité → Clic "Suivant"
3. **Étape 2** : Choisir mot de passe → Clic "Suivant"
4. **Étape 3** : Compléter informations → Clic "S'inscrire"
5. **Soumission** : Envoi au backend
6. **Succès** : Redirection vers dashboard

### Navigation dans le formulaire

- **Bouton "Suivant"** : Valide l'étape courante et passe à la suivante
- **Bouton "Précédent"** : Revient à l'étape précédente (sans validation)
- **Bouton "S'inscrire"** : Valide l'étape 3 et soumet le formulaire

### Indicateur de progression

```
Étape 1/3: ● ─── ○ ─── ○
Étape 2/3: ✓ ─── ● ─── ○
Étape 3/3: ✓ ─── ✓ ─── ●

Légende:
● = Étape courante (bleu)
✓ = Étape complétée (vert)
○ = Étape non atteinte (gris)
```

---

## Personnalisation

### Modifier les options de sélection

**Fichier** : `src/modules/auth/constants/registerOptions.ts`

```typescript
// Ajouter une option de genre
export const GENDER_OPTIONS: SelectOption[] = [
    { value: 'M', label: 'Homme' },
    { value: 'F', label: 'Femme' },
    { value: 'O', label: 'Autre' },
    { value: 'N', label: 'Non spécifié' } // ✅ Nouvelle option
];

// Ajouter une langue
export const SPOKEN_LANGUAGES_OPTIONS: SelectOption[] = [
    // ...existing languages
    { value: 'JA', label: 'Japonais' } // ✅ Nouvelle langue
];
```

### Modifier les règles de validation

```typescript
// Changer l'âge minimum
export const MIN_AGE = 16; // Au lieu de 18

// Modifier le regex du téléphone
export const PHONE_REGEX = /^\d{10}$/; // 10 chiffres uniquement
```

### Ajouter un nouveau champ

**1. Mettre à jour les types**

```typescript
// src/modules/auth/types/index.d.ts
export interface RegisterData {
    // ... existing fields
    student_level?: string | null; // ✅ Nouveau champ
}
```

**2. Ajouter au formulaire**

```typescript
// src/modules/auth/pages/RegisterPage.tsx
const { values, handleChange } = useForm({
    // ... existing fields
    student_level: '', // ✅ Ajouter au state
});

// Dans l'étape 3
<SelectField
    label="Niveau d'études"
    name="student_level"
    value={values.student_level}
    onChange={handleChange}
    options={STUDENT_LEVEL_OPTIONS}
/>
```

**3. Inclure dans la soumission**

```typescript
registerMutation.mutate({
    // ... existing data
    student_level: values.student_level || null, // ✅ Inclure
});
```

### Changer le nombre d'étapes

```typescript
// RegisterPage.tsx
const totalSteps = 4; // ✅ Ajouter une 4ème étape

// Ajouter la validation
const validateStep4 = (): boolean => {
    // Logique de validation
    return true;
};

// Ajouter le rendu
{currentStep === 4 && (
    <motion.div key="step4">
        {/* Contenu de l'étape 4 */}
    </motion.div>
)}
```

---

## API Backend

### Endpoint attendu

```
POST /auth/register
Content-Type: application/json
```

### Corps de la requête

```json
{
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@upg.bi",
    "password": "SecurePass123!",
    "confirmPassword": "SecurePass123!",
    "studentId": "UPG2024001",
    "gender": "M",
    "phone_number": "+25761234567",
    "birth_date": "2000-01-15",
    "nationality": "uuid-de-nationalite",
    "residence": ["uuid-residence-1", "uuid-residence-2"],
    "marital_status": "SINGLE",
    "spoken_languages": ["FR", "EN", "KI"],
    "profile_picture": null
}
```

### Réponse attendue

```json
{
    "user": {
        "id": "user-uuid",
        "firstName": "Jean",
        "lastName": "Dupont",
        "email": "jean.dupont@upg.bi",
        "role": "student"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
}
```

---

## Compatibilité

### Version précédente

L'ancien formulaire est sauvegardé dans `RegisterPage.old.tsx` et peut être restauré si nécessaire.

### Migration

Pour revenir à l'ancien formulaire :

```bash
cd src/modules/auth/pages
mv RegisterPage.tsx RegisterPageNew.tsx
mv RegisterPage.old.tsx RegisterPage.tsx
```

---

## Exemples d'utilisation des composants

### TextField

```tsx
<TextField
    label="Email"
    name="email"
    type="email"
    value={values.email}
    onChange={handleChange}
    placeholder="votre.email@upg.bi"
    error={errors.email}
    maxLength={254}
    required
/>
```

### SelectField

```tsx
<SelectField
    label="Genre"
    name="gender"
    value={values.gender}
    onChange={handleChange}
    options={GENDER_OPTIONS}
    placeholder="Sélectionnez"
    error={errors.gender}
/>
```

### MultiSelectField

```tsx
<MultiSelectField
    label="Langues parlées"
    name="spoken_languages"
    values={spokenLanguages}
    onChange={setSpokenLanguages}
    options={SPOKEN_LANGUAGES_OPTIONS}
    error={errors.spoken_languages}
/>
```

### FormSection

```tsx
<FormSection
    title="Informations personnelles"
    description="Complétez vos informations"
>
    {/* Champs ici */}
</FormSection>
```

---

## Testing

### Test manuel

1. Accédez à `/auth/register`
2. Testez chaque étape :
   - ✅ Validation des champs obligatoires
   - ✅ Messages d'erreur
   - ✅ Navigation avant/arrière
   - ✅ Persistance des données entre étapes
3. Testez la soumission
4. Testez en mode sombre

### Test des validations

```typescript
// Tests unitaires recommandés

describe('Register Validation', () => {
    test('validates email format', () => {
        const result = validateEmail('invalid-email');
        expect(result.valid).toBe(false);
    });

    test('validates phone number', () => {
        const result = validatePhoneNumber('+25761234567');
        expect(result.valid).toBe(true);
    });

    test('validates minimum age', () => {
        const result = validateBirthDate('2010-01-01');
        expect(result.valid).toBe(false);
    });
});
```

---

## Troubleshooting

### Les étapes ne changent pas

**Problème** : Cliquer sur "Suivant" ne change pas d'étape

**Solution** : Vérifiez la validation
```typescript
console.log('Validation result:', validateStep1());
```

### Les erreurs ne s'affichent pas

**Problème** : Les messages d'erreur ne s'affichent pas sous les champs

**Solution** : Vérifiez que l'état `errors` est bien passé aux composants
```typescript
<TextField error={errors.fieldName} />
```

### Les langues ne se sélectionnent pas

**Problème** : Les checkboxes de langues ne se cochent pas

**Solution** : Vérifiez l'état `spokenLanguages`
```typescript
console.log('Selected languages:', spokenLanguages);
```

---

## Checklist avant production

- [ ] Tester toutes les étapes du formulaire
- [ ] Vérifier toutes les validations
- [ ] Tester en mode sombre
- [ ] Tester sur mobile/tablette
- [ ] Vérifier l'intégration backend
- [ ] Tester avec de vraies données
- [ ] Vérifier l'accessibilité (a11y)
- [ ] Optimiser les performances
- [ ] Ajouter analytics/tracking

---

## Support et contribution

Pour toute question ou amélioration :
- Consultez cette documentation
- Vérifiez les types dans `types/index.d.ts`
- Consultez les constantes dans `constants/registerOptions.ts`
- Examinez les composants dans `components/FormFields.tsx`

---

## Licence

© 2024 UMS - Université Privée de Gitega
