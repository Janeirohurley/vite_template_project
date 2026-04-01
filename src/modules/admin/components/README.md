# Composants Admin

## AdminAlert

Composant d'alerte réutilisable pour l'interface admin.

### Types disponibles
- `warning` - Avertissement (jaune)
- `error` - Erreur (rouge)
- `success` - Succès (vert)
- `info` - Information (bleu)

### Exemple d'utilisation

```tsx
<AdminAlert
    type="warning"
    title="3 tentatives de connexion suspectes détectées"
    timestamp="il y a 5 min"
/>

<AdminAlert
    type="error"
    title="Échec de sauvegarde"
    message="Veuillez vérifier l'espace disque."
    timestamp="il y a 1h"
/>
```

## ActivityLog

Composant tableau pour afficher les logs d'activité avec tous les détails.

### Props
- `activities: ActivityLogItem[]` - Liste des activités
- `maxItems?: number` - Nombre max d'items à afficher (défaut: 10)
- `showIp?: boolean` - Afficher la colonne IP (défaut: true)

### Exemple d'utilisation

```tsx
const logs: ActivityLogItem[] = [
    {
        id: '1',
        type: 'login',
        user: 'admin@ums.com',
        action: 'Connexion administrateur',
        timestamp: 'il y a 2 min',
        ip: '192.168.1.45',
        status: 'success'
    },
    // ...
];

<ActivityLog activities={logs} maxItems={15} showIp={true} />
```

## ActivityTimeline

Composant timeline pour afficher les logs d'activité de façon plus compacte et visuelle.

### Props
- `activities: ActivityTimelineItem[]` - Liste des activités
- `maxItems?: number` - Nombre max d'items à afficher (défaut: 15)

### Exemple d'utilisation

```tsx
const logs: ActivityTimelineItem[] = [
    {
        id: '1',
        type: 'login',
        user: 'admin@ums.com',
        action: 'Connexion administrateur',
        timestamp: 'il y a 2 min',
        details: 'Depuis l\'application web'
    },
    // ...
];

<ActivityTimeline activities={logs} maxItems={10} />
```

## Types d'activités disponibles

- `login` - Connexion utilisateur
- `logout` - Déconnexion utilisateur
- `user_created` - Création d'utilisateur
- `user_deleted` - Suppression d'utilisateur
- `permission_change` - Modification de permissions
- `settings_change` - Modification de paramètres
- `backup` - Sauvegarde système
- `security_alert` - Alerte de sécurité

## Mapper les logs du système

### Exemple avec API

```tsx
import { ActivityTimelineItem } from '@/modules/admin/components';

// Transformer les logs API en ActivityTimelineItem
const mapApiLogsToTimeline = (apiLogs: any[]): ActivityTimelineItem[] => {
    return apiLogs.map(log => ({
        id: log.id.toString(),
        type: mapLogTypeToActivityType(log.eventType),
        user: log.performedBy.email,
        action: log.description,
        timestamp: formatTimestamp(log.createdAt),
        details: log.metadata?.details
    }));
};

// Mapper le type d'événement API au type d'activité
const mapLogTypeToActivityType = (eventType: string): ActivityType => {
    const mapping: Record<string, ActivityType> = {
        'USER_LOGIN': 'login',
        'USER_LOGOUT': 'logout',
        'USER_CREATED': 'user_created',
        'USER_DELETED': 'user_deleted',
        'PERMISSION_UPDATED': 'permission_change',
        'SETTINGS_UPDATED': 'settings_change',
        'BACKUP_COMPLETED': 'backup',
        'SECURITY_INCIDENT': 'security_alert'
    };
    return mapping[eventType] || 'security_alert';
};

// Utilisation
const { data: apiLogs } = useSystemLogs();
const timelineLogs = mapApiLogsToTimeline(apiLogs || []);

<ActivityTimeline activities={timelineLogs} />
```
