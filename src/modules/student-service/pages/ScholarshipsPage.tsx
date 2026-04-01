import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import { FormModal } from '../components';
import { Plus } from 'lucide-react';

export function ScholarshipsPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Remplacer par useScholarships() quand l'API sera prête
  const scholarships = [
    { id: '1', student_name: 'Jean Dupont', student_matricule: 'STU001', type: 'Mérite', amount: 5000, status: 'Active', start_date: '2024-01-01', end_date: '2024-12-31' },
    { id: '2', student_name: 'Marie Martin', student_matricule: 'STU002', type: 'Sociale', amount: 3000, status: 'En attente', start_date: '2024-01-01', end_date: '2024-12-31' },
  ];

  const columns = [
    { key: 'student_matricule', label: 'Matricule' },
    { key: 'student_name', label: 'Étudiant' },
    { key: 'type', label: 'Type de Bourse' },
    {
      key: 'amount',
      label: 'Montant',
      render: (value: number) => `${value.toLocaleString()} FCFA`,
    },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Active' ? 'bg-green-100 text-green-800' : 
          value === 'En attente' ? 'bg-orange-100 text-orange-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'start_date',
      label: 'Début',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Bourses</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Attribution et suivi des bourses d'études
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle Bourse
        </button>
      </div>

      <FormModal
        isOpen={showForm}
        title="Attribuer une Bourse"
        onClose={() => setShowForm(false)}
        onSubmit={(e) => {
          e.preventDefault();
          setShowForm(false);
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Matricule Étudiant</label>
            <input
              type="text"
              placeholder="STU001"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type de Bourse</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>Mérite</option>
              <option>Sociale</option>
              <option>Sportive</option>
              <option>Excellence</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Montant (FCFA)</label>
            <input
              type="number"
              placeholder="5000"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date Début</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date Fin</label>
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>
      </FormModal>

      <DataTable
        tableId="scholarships"
        columns={columns.map(col => ({ ...col, sortable: true, editable: false }))}
        data={scholarships}
        getRowId={(row) => row.id}
        isLoading={false}
      />
    </div>
  );
}
