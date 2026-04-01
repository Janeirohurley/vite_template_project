# DataTable Component - Guide d'utilisation complète

## Vue d'ensemble

Le composant `DataTable` est un tableau de données avancé et hautement configurable avec de nombreuses fonctionnalités intégrées.

## Fonctionnalités principales

- ✅ **Tri multi-colonnes** avec indicateurs visuels
- ✅ **Filtrage par colonne** avec recherche globale
- ✅ **Pagination** avec tailles de page configurables
- ✅ **Sélection multiple** avec actions en lot
- ✅ **Édition en ligne** (double-clic sur les cellules)
- ✅ **Drag & Drop** pour réorganiser les lignes
- ✅ **Gestion des colonnes** (masquer, épingler, redimensionner)
- ✅ **Export** (CSV, Excel, JSON)
- ✅ **Mode plein écran**
- ✅ **Persistance des paramètres** (IndexedDB)
- ✅ **Types de cellules spécialisés** (image, date, select, boolean)
- ✅ **Navigation au clavier**
- ✅ **Menu contextuel**
- ✅ **États de chargement** et gestion d'erreurs

## Installation et imports

```typescript
import DataTable from '@/components/ui/DataTable';
import type { DataTableColumn, DataTableProps } from '@/components/ui/DataTable';
```

## Types de base

### DataTableColumn<T>
```typescript
type DataTableColumn<T> = {
  key: string;                    // Clé de la propriété dans les données
  label: string;                  // Libellé affiché dans l'en-tête
  render?: (row: T) => ReactNode; // Fonction de rendu personnalisée
  sortable?: boolean;             // Colonne triable (défaut: false)
  filterable?: boolean;           // Colonne filtrable (défaut: true)
  searchable?: boolean;           // Incluse dans la recherche globale
  pinned?: boolean;               // Épinglée à gauche
  editable?: boolean;             // Éditable en ligne
  hidden?: boolean;               // Masquée par défaut
  type?: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect' | 'image' | 'email';
  options?: string[] | { value: string; label: string }[]; // Pour select/multiselect
};
```

## Utilisation de base

```typescript
import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

function UsersPage() {
  const [users] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', age: 30, active: true },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', age: 25, active: false },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const columns: DataTableColumn<User>[] = [
    { key: 'name', label: 'Nom', sortable: true, editable: true },
    { key: 'email', label: 'Email', sortable: true, type: 'email' },
    { key: 'age', label: 'Âge', sortable: true, type: 'number' },
    { key: 'active', label: 'Actif', type: 'boolean', editable: true },
  ];

  return (
    <DataTable<User>
      tableId="users-table"
      data={users}
      columns={columns}
      getRowId={(row) => row.id}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={10}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
    />
  );
}
```

## Fonctionnalités avancées

### 1. Édition en ligne avec gestion des erreurs

```typescript
const handleCellEdit = async (rowId: string, columnKey: string, newValue: string) => {
  try {
    await updateUserApi(rowId, { [columnKey]: newValue });
    // Succès automatiquement géré
  } catch (error) {
    // Erreur automatiquement affichée
    throw error;
  }
};

<DataTable
  // ... autres props
  onCellEdit={handleCellEdit}
/>
```

### 2. Actions personnalisées

```typescript
const renderActions = (user: User) => (
  <div className="flex gap-2">
    <button onClick={() => editUser(user)}>
      <Edit className="w-4 h-4" />
    </button>
    <button onClick={() => deleteUser(user)}>
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
);

<DataTable
  // ... autres props
  renderActions={renderActions}
/>
```

### 3. Actions en lot

```typescript
const handleBulkAction = (action: string, selectedIds: Set<string>) => {
  switch (action) {
    case 'delete':
      deleteMultipleUsers(Array.from(selectedIds));
      break;
    case 'archive':
      archiveUsers(Array.from(selectedIds));
      break;
  }
};

<DataTable
  // ... autres props
  onBulkAction={handleBulkAction}
/>
```

### 4. Colonnes avec types spécialisés

```typescript
const columns: DataTableColumn<User>[] = [
  {
    key: 'avatar',
    label: 'Avatar',
    type: 'image',
    editable: true,
    render: (user) => (
      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
    )
  },
  {
    key: 'birthDate',
    label: 'Date de naissance',
    type: 'date',
    editable: true,
    sortable: true
  },
  {
    key: 'role',
    label: 'Rôle',
    type: 'select',
    editable: true,
    options: [
      { value: 'admin', label: 'Administrateur' },
      { value: 'user', label: 'Utilisateur' },
      { value: 'guest', label: 'Invité' }
    ]
  },
  {
    key: 'skills',
    label: 'Compétences',
    type: 'multiselect',
    editable: true,
    options: ['JavaScript', 'Python', 'React', 'Node.js']
  }
];
```

### 5. Upload d'images

```typescript
const uploadImage = async (file: File, rowId: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`/api/upload/${rowId}`, {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.imageUrl;
};

<DataTable
  // ... autres props
  uploadFunction={uploadImage}
/>
```

### 6. Drag & Drop pour réorganiser

```typescript
const handleReorder = (newData: User[]) => {
  // Sauvegarder le nouvel ordre
  updateUsersOrder(newData);
};

<DataTable
  // ... autres props
  enableDragDrop={true}
  onReorder={handleReorder}
/>
```

## Props complètes

```typescript
interface DataTableProps<T> {
  // Données essentielles
  data: T[];
  columns: DataTableColumn<T>[];
  tableId?: string;                    // ID unique pour la persistance
  getRowId?: (row: T, index: number) => string;

  // Pagination
  currentPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  itemsPerPage: number;

  // Recherche
  searchTerm: string;
  setSearchTerm: (term: string) => void;

  // Actions
  renderActions?: (row: T) => ReactNode;
  onBulkAction?: (action: string, selectedIds: Set<string>) => void;
  onAddRow?: () => void;
  onAddRowAfter?: (afterRow: T) => void;
  onDeleteRow?: (row: T) => void;
  onEditRow?: (row: T) => void;
  onCellEdit?: (rowId: string, columnKey: string, newValue: string) => Promise<void> | void;
  onReorder?: (newData: T[]) => void;

  // États
  isLoading?: boolean;
  error?: string | null;

  // Fonctionnalités
  enableDragDrop?: boolean;
  uploadFunction?: (file: File, rowId: string) => Promise<string>;
}
```

## Raccourcis clavier

- **Flèches** : Navigation dans le tableau
- **Entrée/Espace** : Sélectionner une ligne
- **Échap** : Fermer les modales/menus
- **Ctrl+Clic** : Sélection multiple

## Persistance automatique

Le DataTable sauvegarde automatiquement :
- Ordre des colonnes
- Colonnes masquées/épinglées
- Largeurs des colonnes
- Taille de page
- Tri actuel
- Sélection des lignes

## Exemples d'utilisation complète

### Tableau d'utilisateurs avec toutes les fonctionnalités

```typescript
function CompleteUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const columns: DataTableColumn<User>[] = [
    {
      key: 'avatar',
      label: 'Avatar',
      type: 'image',
      editable: true,
      render: (user) => (
        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
      )
    },
    { key: 'name', label: 'Nom', sortable: true, editable: true },
    { key: 'email', label: 'Email', sortable: true, type: 'email' },
    { key: 'birthDate', label: 'Naissance', type: 'date', sortable: true },
    {
      key: 'role',
      label: 'Rôle',
      type: 'select',
      editable: true,
      options: [
        { value: 'admin', label: 'Admin' },
        { value: 'user', label: 'User' }
      ]
    },
    { key: 'active', label: 'Actif', type: 'boolean', editable: true }
  ];

  const handleCellEdit = async (rowId: string, columnKey: string, newValue: string) => {
    await updateUser(rowId, { [columnKey]: newValue });
  };

  const handleBulkAction = (action: string, selectedIds: Set<string>) => {
    if (action === 'delete') {
      deleteUsers(Array.from(selectedIds));
    }
  };

  const uploadAvatar = async (file: File, rowId: string) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetch(`/api/users/${rowId}/avatar`, {
      method: 'POST',
      body: formData
    });
    return (await response.json()).avatarUrl;
  };

  return (
    <DataTable<User>
      tableId="users-complete"
      data={users}
      columns={columns}
      getRowId={(user) => user.id}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={25}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isLoading={isLoading}
      error={error}
      onCellEdit={handleCellEdit}
      onBulkAction={handleBulkAction}
      onAddRow={() => createUser()}
      onDeleteRow={(user) => deleteUser(user.id)}
      enableDragDrop={true}
      uploadFunction={uploadAvatar}
    />
  );
}
```

## Bonnes pratiques

1. **Utilisez un tableId unique** pour chaque tableau pour la persistance
2. **Implémentez getRowId** pour des IDs stables
3. **Gérez les erreurs** dans onCellEdit avec try/catch
4. **Optimisez les renders** avec useMemo pour les colonnes
5. **Utilisez les types TypeScript** pour une meilleure sécurité
6. **Testez la navigation clavier** pour l'accessibilité

## Personnalisation CSS

Le composant utilise Tailwind CSS et supporte le mode sombre automatiquement. Toutes les classes sont personnalisables via les props className des éléments internes.