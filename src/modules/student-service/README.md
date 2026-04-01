# Module Service des Étudiants

Dashboard complet pour la gestion du Service des Étudiants.

## 📁 Structure

```
student-service/
├── api/                    # Services API
├── components/             # Composants réutilisables
├── hooks/                  # Hooks personnalisés
├── layout/                 # Layout principal
├── pages/                  # Pages du module
├── types/                  # Types TypeScript
├── navItems.ts            # Configuration navigation
└── index.ts               # Exports
```

## 🎯 Pages

- **Dashboard** - Statistiques et actions rapides
- **Inscriptions** - Gestion des inscriptions
- **Étudiants** - Liste des étudiants
- **Parents** - Gestion des parents
- **Info Scolaires** - Historique scolaire
- **Info Académiques** - Parcours académique

## 🔌 API Endpoints

- `GET /student/inscriptions/` - Lister les inscriptions
- `GET /student/students/` - Lister les étudiants
- `GET /student/parents/` - Lister les parents
- `GET /student/student-hs-info/` - Info scolaires
- `GET /student/student-graduate-info/` - Info académiques

## 🎨 Composants

### StatsCard
Affiche une statistique avec icône et couleur.

```tsx
<StatsCard
  label="Total Étudiants"
  value={150}
  icon={Users}
  color="blue"
/>
```

### DataTable
Tableau réutilisable avec colonnes personnalisables.

```tsx
<DataTable
  columns={[
    { key: 'name', label: 'Nom' },
    { key: 'email', label: 'Email' }
  ]}
  data={data}
/>
```

### FormModal
Modal de formulaire avec validation.

```tsx
<FormModal
  isOpen={isOpen}
  title="Nouvelle Inscription"
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
>
  {/* Champs du formulaire */}
</FormModal>
```

### FilterBar
Barre de recherche et filtres.

```tsx
<FilterBar
  searchValue={search}
  onSearchChange={setSearch}
  hasFilters={hasFilters}
  onClearFilters={clearFilters}
/>
```

## 🪝 Hooks

### useInscriptions
```tsx
const { data, isLoading } = useInscriptions(academicYearId);
```

### useStudents
```tsx
const { data, isLoading } = useStudents(params);
```

### useFilters
```tsx
const { filters, updateFilter, clearFilters } = useFilters();
```

## 🛣️ Routes

- `/student-service/dashboard` - Tableau de bord
- `/student-service/inscriptions` - Inscriptions
- `/student-service/documents` - Étudiants
- `/student-service/absences` - Parents
- `/student-service/scholarships` - Info scolaires
- `/student-service/activities` - Info académiques

## 🔐 Authentification

Le module est protégé par `ProtectedRoute` avec le rôle `staff`.

## 📦 Dépendances

- React Query - Gestion des données
- Framer Motion - Animations
- Lucide React - Icônes
- Tailwind CSS - Styling
