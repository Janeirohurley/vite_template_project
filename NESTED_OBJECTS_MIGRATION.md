# Migration des Types - Objets Imbriqués

## Problème résolu
Le backend Django renvoie des objets imbriqués (nested objects) pour les relations ForeignKey, mais nos types TypeScript utilisaient des IDs en string. Cette incohérence causait des problèmes lors de l'affichage et de la manipulation des données.

## Solution
Adaptation de tous les types pour refléter la structure exacte renvoyée par le backend, avec des types séparés pour la création/modification (qui utilisent des IDs).

## Changements dans les Types (`academicTypes.ts`)

### Faculty ✅
- **Aucun changement** - Déjà correct
- Utilise `types: TypeFormation` (objet imbriqué)
- `CreateFacultyData` utilise `types_id: string`

### Department
**Avant:**
```typescript
interface Department {
    faculty_id: string;
    faculty_name?: string;
}
```

**Après:**
```typescript
interface Department {
    faculty: Faculty;  // Objet imbriqué
    faculty_name?: string;  // Propriété dérivée pour l'affichage
    faculty_id?: string;    // Propriété dérivée pour l'affichage
}

interface CreateDepartmentData {
    faculty_id: string;  // ID pour création
}
```

### Class
**Avant:**
```typescript
interface Class {
    department: string;  // ID
}
```

**Après:**
```typescript
interface Class {
    department: Department;  // Objet imbriqué
    department_name?: string;
    department_id?: string;
}

interface CreateClassData {
    department_id: string;  // ID pour création
}
```

### Module
**Avant:**
```typescript
interface Module {
    class_fk: string;  // ID
}
```

**Après:**
```typescript
interface Module {
    class_fk: Class;  // Objet imbriqué
    class_name?: string;
    class_id?: string;
}

interface CreateModuleData {
    class_fk: string;  // ID pour création
}
```

### Course
**Avant:**
```typescript
interface Course {
    module: string;  // ID
}
```

**Après:**
```typescript
interface Course {
    module: Module;  // Objet imbriqué
    module_name?: string;
    module_id?: string;
}

interface CreateCourseData {
    module: string;  // ID pour création
}
```

### ClassGroup
**Avant:**
```typescript
interface ClassGroup {
    class_fk: string;
    academic_year: string;
}
```

**Après:**
```typescript
interface ClassGroup {
    class_fk: Class;           // Objet imbriqué
    academic_year: AcademicYear;  // Objet imbriqué
    class_name?: string;
    class_id?: string;
    academic_year_name?: string;
    academic_year_id?: string;
}

interface CreateClassGroupData {
    class_fk: string;        // ID pour création
    academic_year: string;   // ID pour création
}
```

## Changements dans les Composants de Formulaire

### DepartmentForm.tsx
```typescript
// Initialisation du state
faculty_id: department?.faculty?.id || ''

// Dans useEffect
faculty_id: department.faculty.id
```

### ClassFormWithGroups.tsx
```typescript
// Initialisation du state
department_id: classData?.department?.id || ''

// Dans useEffect
department_id: classData.department.id
```

### ModuleForm.tsx
```typescript
// Initialisation du state
class_fk: typeof moduleData?.class_fk === 'object' ? moduleData.class_fk.id : ''

// Dans useEffect
class_fk: typeof moduleData.class_fk === 'object' ? moduleData.class_fk.id : ''
```

### CourseForm.tsx
```typescript
// Initialisation du state
module: typeof course?.module === 'object' ? course.module.id : ''

// Dans useEffect
module: typeof course.module === 'object' ? course.module.id : ''
```

## Changements dans ProgramManagementPage.tsx

### Colonnes pour Department
```typescript
{
    key: "faculty",
    render: (row: Department) => row.faculty?.faculty_name || 'N/A'
}
```

### Colonnes pour Class
```typescript
{
    key: "department",
    render: (row: Class) => row.department?.department_name || 'N/A'
},
{
    key: "faculty",
    render: (row: Class) => row.department?.faculty?.faculty_name || 'N/A'
}
```

### Colonnes pour Module
```typescript
{
    key: "class_fk",
    render: (row: Module) => typeof row.class_fk === 'object' ? row.class_fk.class_name : 'N/A'
}
```

### Colonnes pour Course
```typescript
{
    key: "module",
    render: (row: Course) => typeof row.module === 'object' ? row.module.module_name || 'N/A' : 'N/A'
}
```

## Changements dans les Mappers

### mapDepartmentToTableRow
```typescript
faculty_display: item.faculty
    ? `${item.faculty.faculty_name}${item.faculty.faculty_abreviation ? ` (${item.faculty.faculty_abreviation})` : ''}`
    : 'Faculté inconnue'
```

### mapClassToTableRow
```typescript
department_display: item.department
    ? `${item.department.department_name} (${item.department.abreviation})`
    : 'Département inconnu',
faculty_display: item.department?.faculty
    ? item.department.faculty.faculty_name
    : 'Faculté inconnue'
```

### mapModuleToTableRow
```typescript
class_display: typeof item.class_fk === 'object' ? item.class_fk.class_name : 'Classe inconnue',
department_display: typeof item.class_fk === 'object' && item.class_fk.department
    ? item.class_fk.department.department_name
    : 'Département inconnu'
```

### mapCourseToTableRow
```typescript
module_display: typeof item.module === 'object'
    ? item.module.module_name || 'Module inconnu'
    : 'Module inconnu'
```

## Avantages de cette approche

1. **Cohérence avec le Backend**: Les types TypeScript reflètent exactement la structure renvoyée par Django
2. **Accès Direct aux Données**: Pas besoin de requêtes supplémentaires pour obtenir les informations des entités liées
3. **Type Safety**: TypeScript peut détecter les erreurs d'accès aux propriétés
4. **Affichage Optimisé**: Les données imbriquées permettent un affichage riche sans requêtes supplémentaires
5. **Séparation Claire**: Les types Create/Update utilisent des IDs, les types de lecture utilisent des objets

## Notes importantes

- Les propriétés dérivées (comme `faculty_name`, `faculty_id`) sont optionnelles et peuvent être utilisées pour un accès rapide
- Les formulaires continuent d'utiliser des IDs (string) pour la soumission
- Les mappers utilisent les objets imbriqués pour créer des affichages riches
- La vérification `typeof === 'object'` permet de gérer les cas où l'API pourrait renvoyer un ID au lieu d'un objet
