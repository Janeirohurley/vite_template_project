import { useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import DataTable from '@/components/ui/DataTable';
import { FormModal } from '../components';
import { Plus } from 'lucide-react';
export function ClubsPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Remplacer par useClubs() quand l'API sera prête
  const clubs = [
    { id: '1', name: 'Club Informatique', type: 'Académique', members: 45, status: 'Actif', created_at: '2024-01-15' },
    { id: '2', name: 'Club Football', type: 'Sport', members: 32, status: 'Actif', created_at: '2024-02-10' },
  ];

  const columns = [
    { key: 'name', label: 'Nom du Club' },
    { key: 'type', label: 'Type' },
    { key: 'members', label: 'Membres' },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${value === 'Actif' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {value}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Date de Création',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Clubs et Associations</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Total: {clubs.length} clubs
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouveau Club
        </button>
      </div>

      <FormModal
        isOpen={showForm}
        title="Créer un Club"
        onClose={() => setShowForm(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setShowForm(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom du Club</label>
            <input
              type="text"
              placeholder="Ex: Club Informatique"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>Académique</option>
              <option>Sport</option>
              <option>Culturel</option>
              <option>Social</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              placeholder="Description du club"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      <DataTable
        tableId="clubs"
        columns={columns.map(col => ({ ...col, sortable: true, editable: false }))}
        data={clubs}
        getRowId={(row) => row.id}
        isLoading={false}
      />
    </div>

  );
}
