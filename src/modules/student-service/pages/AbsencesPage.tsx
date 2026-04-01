import { useState } from 'react';
import DataTable from '@/components/ui/DataTable';
import { FormModal } from '../components';
import { Plus } from 'lucide-react';

export function AbsencesPage() {
  const [showForm, setShowForm] = useState(false);

  // TODO: Remplacer par useAbsences() quand l'API sera prête
  const absences = [
    { id: '1', student_name: 'Jean Dupont 1', student_matricule: 'STU001', date: '2024-03-15', reason: 'Maladie', status: 'Justifiée', document: 'certificat_medical.pdf' },
    { id: '2', student_name: 'Marie Martin', student_matricule: 'STU002', date: '2024-03-14', reason: 'Rendez-vous médical', status: 'En attente', document: null },
  ];

  const columns = [
    { key: 'student_matricule', label: 'Matricule' },
    { key: 'student_name', label: 'Étudiant' },
    {
      key: 'date',
      label: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    { key: 'reason', label: 'Motif' },
    {
      key: 'status',
      label: 'Statut',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          value === 'Justifiée' ? 'bg-green-100 text-green-800' : 
          value === 'En attente' ? 'bg-orange-100 text-orange-800' : 
          'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'document',
      label: 'Document',
      render: (value: string | null) => value ? '✓' : '-',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Absences</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Suivi et justification des absences
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Déclarer Absence
        </button>
      </div>

      <FormModal
        isOpen={showForm}
        title="Déclarer une Absence"
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
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Motif</label>
            <textarea
              placeholder="Raison de l'absence"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Document Justificatif</label>
            <input
              type="file"
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
        </div>
      </FormModal>

      <DataTable
        tableId="absences"
        columns={columns.map(col => ({ ...col, sortable: true, editable: true }))}
        data={absences}
        getRowId={(row) => row.id}
        isLoading={false}
      />
    </div>
  );
}
