# Spécification Backend - Gestion des Emplois du Temps

## Vue d'ensemble
Ce document spécifie les endpoints backend requis pour optimiser la gestion des emplois du temps. Toute la logique métier (filtrage, validation, fusion, calcul de statistiques) doit être effectuée côté backend.

---

## 1. GET /api/timetables/

### Description
Récupère la liste des emplois du temps avec informations de fusion pré-calculées.

### Query Parameters
- `academic_year_id` (string, optional): Filtrer par année académique
- `class_group` (string, optional): Filtrer par groupe de classe
- `date` (string ISO 8601, optional): Filtrer par date (format: YYYY-MM-DD)
- `page` (number, optional): Numéro de page pour pagination
- `page_size` (number, optional): Nombre d'éléments par page

### Response 200
```json
{
  "count": 45,
  "next": "http://api.example.com/api/timetables/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "course_name": "Mathématiques",
      "class_name": "L1 Info",
      "class_id": "uuid",
      "class_group": "uuid",
      "attribution": "uuid",
      "room": "uuid",
      "room_name": "Salle A101",
      "status": "Planned",
      "published_date": "2024-01-15T10:00:00Z",
      "start_date": "2024-01-01",
      "end_date": "2024-06-30",
      "schedule_slot": "uuid",
      "day_of_week": "Lundi",
      "is_merged": true,
      "merges": [
        {
          "id": "merge-uuid-1",
          "name": "Fusion Semestre 1"
        },
        {
          "id": "merge-uuid-2",
          "name": "Fusion Complète"
        }
      ],
      "is_shared": true,
      "shared_groups": [
        {
          "id": "f9d9127b-8593-4bbc-afaa-390bd50d00e1",
          "group_name": "G1",
          "class_name": "IG I",
          "department_abreviation": "IG"
        }
      ],
      "created_at": "2024-01-01T08:00:00Z",
      "updated_at": "2024-01-10T14:30:00Z"
    }
  ]
}
```

### Logique Backend
1. Filtrer les timetables selon les paramètres
2. Pour chaque timetable:
   - Calculer `is_merged` (true si appartient à au moins une fusion)
   - Récupérer et construire le tableau `merges` avec id et name via jointure
   - Calculer `is_shared` (true si partagé avec d'autres groupes)
   - Récupérer `shared_groups` avec id, group_name, class_name, department_abreviation
3. Retourner résultats paginés

---

## 2. GET /api/timetables/stats/

### Description
Récupère les statistiques globales des emplois du temps.

### Query Parameters
- `academic_year_id` (string, optional): Filtrer par année académique
- `class_group` (string, optional): Filtrer par groupe de classe
- `date` (string ISO 8601, optional): Filtrer par date

### Response 200
```json
{
  "total": 45,
  "drafts": 12,
  "published": 33,
  "slots": 120
}
```

### Logique Backend
1. Appliquer les mêmes filtres que GET /api/timetables/
2. Calculer:
   - `total`: COUNT(*) des timetables
   - `drafts`: COUNT(*) WHERE published_date IS NULL AND status = 'Planned'
   - `published`: COUNT(*) WHERE published_date IS NOT NULL
   - `slots`: COUNT(*) des schedule_slots disponibles
3. Retourner les statistiques

---

## 3. POST /api/timetable-merges/validate/

### Description
Valide si plusieurs emplois du temps peuvent être fusionnés.

### Request Body
```json
{
  "timetable_ids": ["uuid1", "uuid2", "uuid3"]
}
```

### Response 200 (Validation réussie)
```json
{
  "valid": true
}
```

### Response 200 (Validation échouée)
```json
{
  "valid": false,
  "errors": [
    {
      "type": "CLASS_MISMATCH",
      "message": "Classes différentes",
      "details": ["L1 Info", "L2 Info", "L3 Info"]
    }
  ]
}
```

### Types d'erreurs
- `CLASS_MISMATCH`: Classes différentes
- `STATUS_MISMATCH`: Statuts différents
- `PERIOD_NO_OVERLAP`: Périodes ne se chevauchent pas
- `SLOT_CONFLICT`: Conflits de créneaux horaires

### Logique Backend
1. Récupérer tous les timetables par IDs
2. Vérifier que tous ont la même `class_name`
3. Vérifier que tous ont le même `status`
4. Vérifier que toutes les périodes se chevauchent (start_date/end_date)
5. Vérifier qu'il n'y a pas de conflits de créneaux (même jour/heure)
6. Retourner résultat de validation avec détails des erreurs

---

## 3. POST /api/timetable-merges/

### Description
Crée une nouvelle fusion d'emplois du temps après validation.

### Request Body
```json
{
  "name": "Fusion Semestre 1",
  "timetable_ids": ["uuid1", "uuid2", "uuid3"]
}
```

### Response 201
```json
{
  "id": "merge-uuid",
  "name": "Fusion Semestre 1",
  "timetable_ids": ["uuid1", "uuid2", "uuid3"],
  "merged_data": {
    "id": "merge-uuid",
    "name": "Fusion Semestre 1",
    "timetable_ids": ["uuid1", "uuid2", "uuid3"],
    "merged_slots": [
      {
        "id": "slot-uuid",
        "day_of_week": "Lundi",
        "start_time": "08:00:00",
        "end_time": "10:00:00",
        "schedule_name": "Mathématiques",
        "source_timetable_id": "uuid1"
      }
    ],
    "conflicts": []
  },
  "created_at": "2024-01-15T10:00:00Z"
}
```

### Response 400 (Erreur de validation)
```json
{
  "error": {
    "type": "SLOT_CONFLICT",
    "message": "Conflits de créneaux détectés",
    "details": ["Lundi 08:00-10:00 (Mathématiques)", "Lundi 08:00-10:00 (Physique)"]
  }
}
```

### Logique Backend
1. Valider les timetables (appeler logique de validation)
2. Si invalide, retourner erreur 400
3. Fusionner tous les créneaux des timetables
4. Détecter les conflits (même jour/heure)
5. Créer l'enregistrement merge en base
6. Mettre à jour les timetables pour référencer ce merge
7. Retourner merge avec données fusionnées

---

## 4. GET /api/timetable-merges/{id}/preview/

### Description
Récupère l'aperçu d'une fusion existante avec tous les créneaux fusionnés.

### Response 200
```json
{
  "merged_data": {
    "id": "merge-uuid",
    "name": "Fusion Semestre 1",
    "timetable_ids": ["uuid1", "uuid2", "uuid3"],
    "merged_slots": [
      {
        "id": "slot-uuid",
        "day_of_week": "Lundi",
        "start_time": "08:00:00",
        "end_time": "10:00:00",
        "schedule_name": "Mathématiques",
        "source_timetable_id": "uuid1"
      }
    ],
    "conflicts": [
      {
        "slot_id": "slot-uuid-1",
        "conflicting_slots": ["slot-uuid-2"],
        "details": "Lundi 08:00-10:00: Mathématiques vs Physique"
      }
    ]
  }
}
```

### Logique Backend
1. Récupérer le merge par ID
2. Récupérer tous les timetables associés
3. Fusionner tous les créneaux
4. Détecter et retourner les conflits
5. Retourner données fusionnées

---

## 5. PATCH /api/timetable-merges/{id}/add/

### Description
Ajoute un emploi du temps à une fusion existante.

### Request Body
```json
{
  "timetable_id": "uuid4"
}
```

### Response 200 (Succès)
```json
{
  "success": true,
  "merged_data": {
    "id": "merge-uuid",
    "name": "Fusion Semestre 1",
    "timetable_ids": ["uuid1", "uuid2", "uuid3", "uuid4"],
    "merged_slots": [...],
    "conflicts": []
  }
}
```

### Response 200 (Échec de validation)
```json
{
  "success": false,
  "error": {
    "type": "CLASS_MISMATCH",
    "message": "Classes différentes",
    "details": ["L1 Info", "L2 Info"]
  }
}
```

### Logique Backend
1. Récupérer le merge et le nouveau timetable
2. Valider que le nouveau timetable est compatible (classe, statut, période)
3. Si invalide, retourner success=false avec erreur
4. Ajouter le timetable_id au merge
5. Recalculer la fusion avec le nouveau timetable
6. Retourner résultat

---

## 6. PATCH /api/timetable-merges/{id}/remove/

### Description
Retire un emploi du temps d'une fusion existante.

### Request Body
```json
{
  "timetable_id": "uuid3"
}
```

### Response 200 (Succès)
```json
{
  "success": true,
  "merged_data": {
    "id": "merge-uuid",
    "name": "Fusion Semestre 1",
    "timetable_ids": ["uuid1", "uuid2"],
    "merged_slots": [...],
    "conflicts": []
  }
}
```

### Response 200 (Fusion insuffisante)
```json
{
  "success": false,
  "error": {
    "type": "INSUFFICIENT_TIMETABLES",
    "message": "Une fusion doit contenir au moins 2 emplois du temps",
    "details": []
  }
}
```

### Logique Backend
1. Récupérer le merge
2. Retirer le timetable_id de la liste
3. Si moins de 2 timetables restants, retourner erreur INSUFFICIENT_TIMETABLES
4. Recalculer la fusion sans ce timetable
5. Retourner résultat

---

## Modèles de données

### Timetable (étendu)
```typescript
{
  id: string;
  course_name: string;
  class_name: string;
  class_group: string;
  status: string;
  published_date: string | null;
  start_date: string;
  end_date: string;
  merge_ids: string[];        // ← NOUVEAU
  merge_names: string[];      // ← NOUVEAU
  created_at: string;
  updated_at: string;
}
```

### TimetableMerge
```typescript
{
  id: string;
  name: string;
  timetable_ids: string[];
  created_at: string;
  updated_at: string;
}
```

### MergedSlot
```typescript
{
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  schedule_name?: string;
  source_timetable_id: string;
}
```

---

## Optimisations recommandées

1. **Indexation**: Créer des index sur `class_group`, `academic_year_id`, `published_date`, `status`
2. **Cache**: Mettre en cache les statistiques (invalidation lors de création/suppression)
3. **Jointures**: Utiliser des jointures SQL pour calculer `merge_ids` et `merge_names` en une seule requête
4. **Pagination**: Toujours paginer les résultats (défaut: 20 items)
5. **Validation asynchrone**: Envisager une validation asynchrone pour les grandes fusions

---

## Notes d'implémentation

- Toutes les dates doivent être en format ISO 8601
- Les erreurs de validation doivent retourner HTTP 200 avec `valid: false` (pas 400)
- Les erreurs serveur doivent retourner HTTP 500 avec message d'erreur
- Utiliser des transactions pour les opérations de fusion
- Logger toutes les opérations de fusion pour audit
