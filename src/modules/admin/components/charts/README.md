# Composants de Graphiques Réutilisables

Ces composants utilisent Chart.js et supportent le dark mode automatiquement.

## Installation

Assurez-vous d'avoir installé les dépendances :

```bash
npm install chart.js react-chartjs-2
```

## Composants disponibles

### LineChart - Graphique en ligne

Idéal pour afficher l'évolution dans le temps.

```tsx
import { LineChart } from '@/modules/admin/components/charts';

<LineChart
    labels={['Jan', 'Fév', 'Mar', 'Avr', 'Mai']}
    datasets={[
        {
            label: 'Connexions',
            data: [65, 59, 80, 81, 56],
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
        }
    ]}
    darkMode={false}
    className="h-64"
    title="Connexions par mois"
/>
```

### BarChart - Graphique en barres

Parfait pour comparer des valeurs.

```tsx
import { BarChart } from '@/modules/admin/components/charts';

<BarChart
    labels={['Admin', 'Prof', 'Étudiant']}
    datasets={[
        {
            label: 'Utilisateurs actifs',
            data: [12, 19, 45],
        }
    ]}
    darkMode={false}
    className="h-64"
    horizontal={false}
/>
```

**Barre horizontale :**

```tsx
<BarChart
    labels={['Admin', 'Prof', 'Étudiant']}
    datasets={[
        {
            label: 'Utilisateurs actifs',
            data: [12, 19, 45],
        }
    ]}
    horizontal={true}
/>
```

### PieChart - Graphique circulaire

Excellent pour montrer des proportions.

```tsx
import { PieChart } from '@/modules/admin/components/charts';

<PieChart
    labels={['Succès', 'Échecs', 'En attente']}
    data={[85, 10, 5]}
    backgroundColor={['#10B981', '#EF4444', '#F59E0B']}
    darkMode={false}
    className="h-64"
    doughnut={false}
/>
```

**Version Doughnut (avec trou au centre) :**

```tsx
<PieChart
    labels={['Succès', 'Échecs', 'En attente']}
    data={[85, 10, 5]}
    doughnut={true}
/>
```

## Props communes

Tous les composants acceptent :

- `darkMode` (boolean) : Active le mode sombre
- `className` (string) : Classes CSS Tailwind
- `title` (string) : Titre du graphique

## Support du Dark Mode

Le dark mode est géré automatiquement par le composant `ChartBase`. Il ajuste :

- Couleurs du texte
- Couleurs de la grille
- Couleurs des tooltips
- Fond des légendes

Pour activer le dark mode :

```tsx
const [darkMode, setDarkMode] = useState(false);

<LineChart
    // ... autres props
    darkMode={darkMode}
/>
```

## Personnalisation avancée

Si vous avez besoin de plus de contrôle, utilisez directement `ChartBase` :

```tsx
import { ChartBase } from '@/modules/admin/components/charts';
import type { ChartConfiguration } from 'chart.js/auto';

const customConfig: ChartConfiguration = {
    type: 'line',
    data: {
        labels: ['Jan', 'Fév', 'Mar'],
        datasets: [{
            label: 'Custom',
            data: [10, 20, 30],
            // ... configurations Chart.js personnalisées
        }]
    },
    options: {
        // ... options Chart.js personnalisées
    }
};

<ChartBase config={customConfig} darkMode={false} />
```

## Exemples d'utilisation dans le projet

Voir [ActivityLogsPage.tsx](../../pages/ActivityLogsPage.tsx) pour des exemples concrets d'intégration.

## Palette de couleurs par défaut

Les graphiques utilisent une palette cohérente :

- Bleu : `#3B82F6`
- Vert : `#10B981`
- Orange : `#F59E0B`
- Rouge : `#EF4444`
- Violet : `#8B5CF6`
- Rose : `#EC4899`
- Cyan : `#14B8A6`
- Orange foncé : `#F97316`
