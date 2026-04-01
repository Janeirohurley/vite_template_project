import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import { FormModal } from '../components';
import { Plus } from 'lucide-react';

export function ActivitiesPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Remplacer par useActivities() quand l'API sera prête
  const activities = [
    { id: '1', title: 'Journée Portes Ouvertes', type: 'Événement', date: '2024-04-15', participants: 250, status: 'Planifié' },
    { id: '2', title: 'Conférence Tech', type: 'Conférence', date: '2024-03-20', participants: 80, status: 'Terminé' },
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
          <h2 className="text-3xl font-bold">Gestion des Activités</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Événements et activités étudiantes
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle Activité
        </button>
      </div>

      <FormModal
        isOpen={showForm}
        title="Créer une Activité"
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
              placeholder="Ex: Journée Portes Ouvertes"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>Événement</option>
              <option>Conférence</option>
              <option>Atelier</option>
              <option>Séminaire</option>
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
              placeholder="Détails de l'activité"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      <DataTable
        tableId="activities"
        columns={columns.map(col => ({ ...col, sortable: true, editable: false }))}
        data={activities}
        getRowId={(row) => row.id}
        isLoading={false}
      />
    </div>
  );
}
