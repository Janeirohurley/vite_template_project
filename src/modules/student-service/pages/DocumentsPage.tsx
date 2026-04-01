import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import { FormModal } from '../components';
import { Plus } from 'lucide-react';

export function DocumentsPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Remplacer par useDocuments() quand l'API sera prête
  const documents = [
    { id: '1', student_name: 'Jean Dupont', student_matricule: 'STU001', type: 'Attestation', status: 'Délivré', date: '2024-03-15' },
    { id: '2', student_name: 'Marie Martin', student_matricule: 'STU002', type: 'Relevé de notes', status: 'En attente', date: '2024-03-14' },
  ];

  const columns = [
    { key: 'student_matricule', label: 'Matricule' },
    { key: 'student_name', label: 'Étudiant' },
    { key: 'type', label: 'Type de Document' },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Délivré' ? 'bg-green-100 text-green-800' : 
          value === 'En attente' ? 'bg-orange-100 text-orange-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Documents</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Demandes et délivrance de documents
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle Demande
        </button>
      </div>

      <FormModal
        isOpen={showForm}
        title="Demande de Document"
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
            <label className="block text-sm font-medium mb-1">Type de Document</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
              <option>Attestation d'inscription</option>
              <option>Relevé de notes</option>
              <option>Certificat de scolarité</option>
              <option>Carte d'étudiant</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motif</label>
            <textarea
              placeholder="Raison de la demande"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
        </div>
      </FormModal>

      <DataTable
        tableId="documents"
        columns={columns.map(col => ({ ...col, sortable: true, editable: false }))}
        data={documents}
        getRowId={(row) => row.id}
        isLoading={false}
      />
    </div>
  );
}
