# Installation des dépendances pour les graphiques

Pour utiliser les graphiques dans la page des logs, vous devez installer Chart.js :

## Commande d'installation

```bash
npm install chart.js react-chartjs-2
```

ou avec yarn :

```bash
yarn add chart.js react-chartjs-2
```

## Vérification

Après l'installation, les fichiers suivants devraient fonctionner :

- `src/modules/admin/components/charts/*`
- `src/modules/admin/pages/ActivityLogsPage.tsx`

## Fonctionnalités ajoutées

### 1. Composants de graphiques réutilisables
- **LineChart** : Graphiques en ligne
- **BarChart** : Graphiques en barres (horizontal/vertical)
- **PieChart** : Graphiques circulaires (pie/doughnut)
- **ChartBase** : Composant de base personnalisable

### 2. Support du Dark Mode
Tous les graphiques s'adaptent automatiquement au mode sombre en ajustant :
- Les couleurs du texte
- Les couleurs de la grille
- Les couleurs des tooltips

### 3. Page des logs améliorée
La page `ActivityLogsPage` inclut maintenant :
- **Filtrage par période** : Aujourd'hui, Semaine, Mois, Année, Tout
- **Statistiques détaillées** : Total, Taux de succès, Échecs, Avertissements
- **Graphiques interactifs** :
  - Distribution des activités par type (Doughnut)
  - Utilisateurs les plus actifs (Barres horizontales)
- **Animations Framer Motion** pour tous les éléments

## Documentation

Consultez les fichiers README pour plus de détails :
- `src/modules/admin/components/charts/README.md` : Documentation des graphiques
- `src/modules/admin/components/README.md` : Documentation des composants admin

## Utilisation

Une fois installé, naviguez vers `/admin/logs` pour voir tous les graphiques et statistiques en action.
