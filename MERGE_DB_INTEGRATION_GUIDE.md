# Guide d'intégration - Persistance des Merges en Base de Données

## Modifications apportées

### 1. Types (`src/modules/doyen/types/backend.ts`)
Ajout des types pour TimetableMerge:
```typescript
export interface TimetableMerge {
  id: string;
  name: string;
  timetable_ids: string[];
  created_at: string;
  created_by?: string;
}

export interface CreateTimetableMergeData {
  name: string;
  timetable_ids: string[];
}

export interface UpdateTimetableMergeData {
  name?: string;
  timetable_ids?: string[];
}
```

### 2. API (`src/modules/doyen/api/timetable.ts`)
Ajout des fonctions CRUD:
- `getTimetableMergesApi(params?: QueryParams)`
- `getTimetableMergeByIdApi(id: string)`
- `createTimetableMergeApi(data: CreateTimetableMergeData)`
- `updateTimetableMergeApi(id: string, data: UpdateTimetableMergeData)`
- `deleteTimetableMergeApi(id: string)`

### 3. Hooks (`src/modules/doyen/hooks/useTimetable.ts`)
Ajout des hooks React Query:
- `useTimetableMerges(params?: QueryParams)` - Récupérer tous les merges
- `useTimetableMerge(id?: string)` - Récupérer un merge par ID
- `useCreateTimetableMerge()` - Créer un merge
- `useUpdateTimetableMerge()` - Mettre à jour un merge
- `useDeleteTimetableMerge()` - Supprimer un merge

## Modifications à faire dans SchedulesPageNew.tsx

### Étape 1: Importer les hooks
```typescript
import {
  useTimetables,
  useScheduleSlots,
  useDeleteTimetable,
  usePublishTimetable,
  useClasses,
  useClassGroups,
  useTimetableMerges,
  useCreateTimetableMerge,
  useUpdateTimetableMerge,
  useDeleteTimetableMerge,
} from '@/modules/doyen/hooks';
```

### Étape 2: Remplacer le state localStorage par les hooks
```typescript
// SUPPRIMER:
const [savedMerges, setSavedMerges] = useState<any[]>([]);

// SUPPRIMER l'useEffect qui charge depuis localStorage:
useEffect(() => {
  const stored = localStorage.getItem('timetable_merges');
  if (stored) {
    setSavedMerges(JSON.parse(stored));
  }
}, []);

// AJOUTER:
const { data: mergesData } = useTimetableMerges({ pagination: false });
const createMergeMutation = useCreateTimetableMerge();
const updateMergeMutation = useUpdateTimetableMerge();
const deleteMergeMutation = useDeleteTimetableMerge();

const savedMerges = mergesData?.results || [];
```

### Étape 3: Modifier performMerge pour créer en DB
```typescript
const performMerge = async (mergeName: string) => {
  const selectedTimetables = timetables.filter(t => selectedTimetableIds.includes(t.id));

  // ... validations existantes ...

  try {
    const result = mergeTimetablesWithConflictCheck(...selectedTimetables);
    
    // REMPLACER le code localStorage par:
    await createMergeMutation.mutateAsync({
      name: mergeName,
      timetable_ids: selectedTimetableIds,
    });

    setMergedData({ ...result, mergeName });
    setShowMergedView(true);
    setSelectedTimetableIds([]);
  } catch (err) {
    // ... gestion d'erreur existante ...
  }
};
```

### Étape 4: Modifier handleAddToMerge pour update en DB
```typescript
const handleAddToMerge = async (timetableId: string, mergeId: string) => {
  const merge = savedMerges.find(m => m.id === mergeId);
  if (!merge) return;

  if (!merge.timetable_ids.includes(timetableId)) {
    const timetableToAdd = timetables.find(t => t.id === timetableId);
    if (!timetableToAdd) return;

    const allTimetables = timetables.filter(t =>
      [...merge.timetable_ids, timetableId].includes(t.id)
    );

    // ... validations existantes ...

    try {
      const result = mergeTimetablesWithConflictCheck(...allTimetables);
      
      // REMPLACER le code localStorage par:
      await updateMergeMutation.mutateAsync({
        id: mergeId,
        data: {
          timetable_ids: [...merge.timetable_ids, timetableId],
        },
      });
    } catch (err) {
      // ... gestion d'erreur existante ...
    }
  }
};
```

### Étape 5: Modifier handleRemoveFromMerge pour update en DB
```typescript
const handleRemoveFromMerge = async (timetableId: string, mergeId: string) => {
  const merge = savedMerges.find(m => m.id === mergeId);
  if (!merge) return;

  const newTimetableIds = merge.timetable_ids.filter((id: string) => id !== timetableId);

  if (newTimetableIds.length < 2) {
    setModalState({
      open: true,
      type: 'warning',
      title: 'Supprimer la fusion ?',
      description: 'Cette fusion ne contiendra plus assez d\'emplois du temps',
      onConfirm: () => {
        handleDeleteMerge(mergeId);
        setModalState({ open: false, type: 'info', title: '', description: '' });
      }
    });
    return;
  }

  const remainingTimetables = timetables.filter(t => newTimetableIds.includes(t.id));

  try {
    const result = mergeTimetablesWithConflictCheck(...remainingTimetables);
    
    // REMPLACER le code localStorage par:
    await updateMergeMutation.mutateAsync({
      id: mergeId,
      data: {
        timetable_ids: newTimetableIds,
      },
    });
  } catch (err) {
    // ... gestion d'erreur existante ...
  }
};
```

### Étape 6: Modifier handleDeleteMerge pour delete en DB
```typescript
const handleDeleteMerge = (mergeId: string) => {
  setModalState({
    open: true,
    type: 'danger',
    title: 'Supprimer cette fusion ?',
    description: 'Cette action est irréversible',
    onConfirm: async () => {
      // REMPLACER le code localStorage par:
      await deleteMergeMutation.mutateAsync(mergeId);
      setModalState({ open: false, type: 'info', title: '', description: '' });
    }
  });
};
```

### Étape 7: Modifier handleViewMerge pour recalculer le merge
```typescript
const handleViewMerge = (merge: any) => {
  // Recalculer le merge à partir des timetables actuels
  const mergeTimetables = timetables.filter(t => merge.timetable_ids.includes(t.id));
  
  if (mergeTimetables.length > 0) {
    try {
      const result = mergeTimetablesWithConflictCheck(...mergeTimetables);
      setMergedData({ ...result, mergeName: merge.name, id: merge.id });
      setShowMergedView(true);
    } catch (err) {
      setModalState({ 
        open: true, 
        type: 'danger', 
        title: 'Erreur', 
        description: 'Impossible de charger cette fusion' 
      });
    }
  }
};
```

### Étape 8: Supprimer toutes les références à localStorage
Rechercher et supprimer:
- `localStorage.getItem('timetable_merges')`
- `localStorage.setItem('timetable_merges', ...)`

## Structure Backend attendue

Le backend Django doit exposer ces endpoints:
- `GET /api/dashboard/doyen/timetable-merges/` - Liste des merges
- `GET /api/dashboard/doyen/timetable-merges/{id}/` - Détail d'un merge
- `POST /api/dashboard/doyen/timetable-merges/` - Créer un merge
- `PATCH /api/dashboard/doyen/timetable-merges/{id}/` - Mettre à jour un merge
- `DELETE /api/dashboard/doyen/timetable-merges/{id}/` - Supprimer un merge

### Modèle Django attendu:
```python
class TimetableMerge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    timetable_ids = models.JSONField()  # Liste des IDs
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
```

## Avantages de cette approche

1. **Persistance réelle**: Les merges sont sauvegardés en base de données
2. **Multi-utilisateur**: Les merges peuvent être partagés entre utilisateurs
3. **Traçabilité**: On sait qui a créé chaque merge et quand
4. **Synchronisation**: Pas de problème de désynchronisation entre onglets/appareils
5. **Sécurité**: Les données sont sur le serveur, pas dans le navigateur
6. **Invalidation automatique**: React Query gère le cache et les mises à jour

## Notes importantes

- Les mutations sont asynchrones, utiliser `async/await`
- React Query invalide automatiquement le cache après les mutations
- Les toasts de succès/erreur sont gérés automatiquement par les hooks
- Le `result` du merge n'est plus stocké, il est recalculé à chaque affichage
