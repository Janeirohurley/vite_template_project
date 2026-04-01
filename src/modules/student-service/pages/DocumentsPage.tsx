import { useMemo, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import DataTable from '@/components/ui/DataTable';
import { Button } from '@/components/ui/button';
import { Modal } from '@/modules/admin/components/academic';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/Textarea';
import { notify } from '@/lib';
import type {
  DocumentRequest,
  DocumentRequestStatus,
  DocumentRequestType,
} from '../types';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import {
  useCreateDocumentRequest,
  useDeleteDocumentRequest,
  useDocumentRequests,
  useUpdateDocumentRequest,
} from '../hooks/useDocumentRequests';
import { useStudents } from '../hooks/useStudentService';

const documentTypeOptions: { value: DocumentRequestType; label: string }[] = [
  { value: 'diploma', label: 'Diplome' },
  { value: 'success_certificate', label: 'Attestation de reussite' },
  { value: 'attendance_certificate', label: 'Attestation de frequentation' },
  { value: 'generic_certificate', label: 'Attestation a qui de droit' },
];

const statusOptions: { value: DocumentRequestStatus; label: string }[] = [
  { value: 'pending', label: 'En attente' },
  { value: 'processing', label: 'En traitement' },
  { value: 'ready', label: 'Pret' },
  { value: 'delivered', label: 'Livre' },
  { value: 'rejected', label: 'Rejete' },
];

const getLabel = (value: string, options: { value: string; label: string }[]) =>
  options.find(opt => opt.value === value)?.label || value;

type DocumentRequestFormState = {
  id: string;
  student: string;
  document_type: DocumentRequestType;
  purpose: string;
  status: DocumentRequestStatus;
  notes: string;
};

export function DocumentsPage() {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [formData, setFormData] = useState<DocumentRequestFormState>({
    id: '',
    student: '',
    document_type: 'diploma',
    purpose: '',
    status: 'pending',
    notes: '',
  });

  const { data, isLoading, error } = useDocumentRequests({
    page: currentPage,
    page_size: itemsPerPage,
    search,
  });

  const createDocumentRequest = useCreateDocumentRequest();
  const updateDocumentRequest = useUpdateDocumentRequest();
  const deleteDocumentRequest = useDeleteDocumentRequest();

  const { data: studentsData, isFetching: studentsFetching } = useStudents({
    page: 1,
    page_size: 20,
    search: studentSearch,
  });

  const studentOptions: Option[] = useMemo(() => {
    const results = studentsData && 'results' in studentsData ? studentsData.results : [];
    return (results || []).map((student) => {
      const firstName = student.user_obj?.first_name ?? '';
      const lastName = student.user_obj?.last_name ?? '';
      const name = `${firstName} ${lastName}`.trim();
      const matricule = student.matricule || 'N/A';
      return {
        id: student.id,
        label: name ? `${matricule} - ${name}` : matricule,
      };
    });
  }, [studentsData]);

  const studentLabelById = useMemo(() => {
    return new Map(studentOptions.map(option => [option.id, option.label]));
  }, [studentOptions]);

  const openModal = () => {
    setEditing(false);
    setFormData({
      id: '',
      student: '',
      document_type: 'diploma',
      purpose: '',
      status: 'pending',
      notes: '',
    });
    setModalOpen(true);
  };

  const handleEdit = (row: DocumentRequest) => {
    setEditing(true);
    setFormData({
      id: row.id,
      student: row.student,
      document_type: row.document_type,
      purpose: row.purpose,
      status: row.status,
      notes: row.notes || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (row: DocumentRequest) => {
    try {
      await deleteDocumentRequest.mutateAsync(row.id);
      notify.success('Demande supprimee');
    } catch {
      notify.error('Erreur lors de la suppression');
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        student: formData.student,
        document_type: formData.document_type,
        purpose: formData.purpose,
        status: formData.status,
        notes: formData.notes || null,
      };

      if (editing) {
        await updateDocumentRequest.mutateAsync({ id: formData.id, data: payload });
        notify.success('Demande modifiee');
      } else {
        await createDocumentRequest.mutateAsync(payload);
        notify.success('Demande creee');
      }

      setModalOpen(false);
      setEditing(false);
    } catch {
      notify.error('Operation echouee');
    }
  };

  return (
    <div>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Demandes de Documents</h1>
            <p className="mt-1">Gestion des demandes et traitement</p>
          </div>
          <Button onClick={openModal} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle size={18} /> Nouvelle demande
          </Button>
        </div>

        <DataTable
          data={data || []}
          tableId="document-requests-table"
          columns={[
            {
              key: 'student_label',
              label: 'Etudiant',
              sortable: false,
              render: (row: DocumentRequest) => studentLabelById.get(row.student) || row.student,
            },
            {
              key: 'document_type',
              label: 'Type',
              sortable: true,
              render: (row: DocumentRequest) => getLabel(row.document_type, documentTypeOptions),
            },
            {
              key: 'status',
              label: 'Statut',
              sortable: true,
              render: (row: DocumentRequest) => (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                  {getLabel(row.status, statusOptions)}
                </span>
              ),
            },
            {
              key: 'requested_at',
              label: 'Demande le',
              sortable: true,
              render: (row: DocumentRequest) => new Date(row.requested_at).toLocaleDateString(),
            },
            {
              key: 'processed_at',
              label: 'Traite le',
              sortable: true,
              render: (row: DocumentRequest) =>
                row.processed_at ? new Date(row.processed_at).toLocaleDateString() : '-',
            },
          ]}
          getRowId={(row) => row.id}
          isLoading={isLoading}
          isPaginated={true}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          onSearchChange={setSearch}
          onEditRow={handleEdit}
          onDeleteRow={handleDelete}
          error={error ? 'Erreur de chargement' : null}
        />

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editing ? 'Modifier la demande' : 'Nouvelle demande'}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label htmlFor="student" className="text-sm font-semibold">
                Etudiant
              </Label>
              <SingleSelectDropdown
                options={studentOptions}
                value={formData.student}
                onChange={(value) => setFormData({ ...formData, student: value })}
                placeholder="Selectionner un etudiant"
                searchPlaceholder="Rechercher par nom ou matricule..."
                isLocalSearch={false}
                onSearchChange={setStudentSearch}
                isSearching={studentsFetching}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document_type" className="text-sm font-semibold">
                Type de document
              </Label>
              <select
                id="document_type"
                value={formData.document_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    document_type: e.target.value as DocumentRequestType,
                  })
                }
                className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                required
              >
                {documentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-sm font-semibold">
                Motif
              </Label>
              <Textarea
                id="purpose"
                placeholder="Raison de la demande"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-semibold">
                Statut
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as DocumentRequestStatus,
                  })
                }
                className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-semibold">
                Notes (optionnel)
              </Label>
              <Textarea
                id="notes"
                placeholder="Notes internes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={createDocumentRequest.isPending || updateDocumentRequest.isPending}
                className="bg-blue-600 min-w-[100px]"
              >
                {createDocumentRequest.isPending || updateDocumentRequest.isPending
                  ? 'Traitement...'
                  : editing
                    ? 'Mettre a jour'
                    : 'Creer'}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
