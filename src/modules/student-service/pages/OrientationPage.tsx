import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import { FormModal } from '../components';
import { Plus, MessageSquare } from 'lucide-react';

export function OrientationPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Remplacer par useOrientationSessions() quand l'API sera prête
  const sessions = [
    { id: '1', title: 'Orientation Nouveaux Étudiants L1', type: 'Collectif', date: '2024-09-15', participants: 120, status: 'Planifié' },
    { id: '2', title: 'Conseil Académique - Étudiant X', type: 'Individuel', date: '2024-03-20', participants: 1, status: 'Terminé' },
  ];

  const columns = [
    { key: 'title', label: 'Titre' },
    { key: 'type', label: 'Type' },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { key: 'participants', label: 'Participants' },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Planifié' ? 'bg-blue-100 text-blue-800' : 
          value === 'En Cours' ? 'bg-green-100 text-green-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      ),
    },
  ];

  return (
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Orientation et Conseil</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Sessions d'orientation et de conseil académique
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">12</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Sessions Planifiées</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400" />
            <div>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">45</p>
              <p className="text-sm text-green-700 dark:text-green-300">Sessions Terminées</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            <div>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">234</p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Étudiants Conseillés</p>
            </div>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={showForm}
        title="Planifier une Session"
        onClose={() => setShowForm(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setShowForm(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              type="text"
              placeholder="Ex: Orientation L1"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>Collectif</option>
              <option>Individuel</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="datetime-local"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Détails de la session"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      <DataTable
        tableId="orientation"
        columns={columns.map(col => ({ ...col, sortable: true, editable: false }))}
        data={sessions}
        getRowId={(row) => row.id}
        isLoading={false}
      />
    </div>
    
  );
}
