import { BarChart3, Download, FileText, TrendingUp } from 'lucide-react';

export function ReportsPage() {
  const reports = [
    { id: '1', title: 'Effectifs par Classe', description: 'Nombre d\'étudiants par classe et année académique', icon: BarChart3, color: 'blue' },
    { id: '2', title: 'Taux de Réussite', description: 'Statistiques de réussite par programme', icon: TrendingUp, color: 'green' },
    { id: '3', title: 'Inscriptions Mensuelles', description: 'Évolution des inscriptions', icon: FileText, color: 'purple' },
    { id: '4', title: 'Absences par Étudiant', description: 'Rapport des absences justifiées et non justifiées', icon: FileText, color: 'red' },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400',
    green: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400',
    red: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
  };

  return (
          <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Rapports et Statistiques</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Générer des rapports pour l'aide à la décision
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className={`border rounded-lg p-6 ${colorClasses[report.color as keyof typeof colorClasses]}`}
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-10 h-10" />
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium">
                  <Download size={16} />
                  Générer
                </button>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {report.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {report.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Rapport Personnalisé</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de Rapport</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>Effectifs</option>
              <option>Inscriptions</option>
              <option>Absences</option>
              <option>Bourses</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Année Académique</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>2024-2025</option>
              <option>2023-2024</option>
              <option>2022-2023</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Début</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Date Fin</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
        <button className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <Download size={20} />
          Générer le Rapport
        </button>
      </div>
    </div>

  );
}
