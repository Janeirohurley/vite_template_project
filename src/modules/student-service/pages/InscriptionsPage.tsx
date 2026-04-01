/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useInscriptions, useUpdateInscription, useDeleteInscription, useActivateInscription, useReplaceInscription } from '../hooks/useStudentService';
import DataTable from '@/components/ui/DataTable';
import { InscriptionWizard } from '../components/InscriptionWizard';
import { InscriptionDrafts } from '../components/InscriptionDrafts';
import { useInscriptionWizard } from '../hooks/useInscriptionWizard';
import type { Inscription, InscriptionFormData } from '../../../types/inscription.d';
import type { InscriptionDraft } from '../../../lib/inscriptionDB';
import { Plus } from 'lucide-react';
import { useAcademicYears, useClasses } from '@/modules/admin/hooks/useAcademicEntities';
import { transform } from '@/components/common/transformAny';
import type { Class } from '@/modules/admin/types/academicTypes';
import { notify, useAppStore } from '@/lib';
import type { ApiError } from '@/types';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/Modal';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';


export function InscriptionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page_size, setPage_saze] = useState(10)
  const [backendFiltred, setFilterBackend] = useState({})
  const [orderingBankend, setOrderingBackend] = useState("")
  const { selectedAcademicYear } = useAppStore();
  const { data: inscriptinData, isLoading, refetch } = useInscriptions({
    academic_year_id: selectedAcademicYear?.id,
    search: searchTerm,
    page_size: page_size,
    ordering: orderingBankend,
    ...backendFiltred
  });
  const [showWizard, setShowWizard] = useState(false);
  const [resumeDraft, setResumeDraft] = useState<InscriptionDraft | undefined>();
  const [draftRefreshTrigger, setDraftRefreshTrigger] = useState(0);
  const { processInscription, isLoading: isProcessing } = useInscriptionWizard();
  const [currentPage, setCurrentPage] = useState(1);
  const [activationModal, setActivationModal] = useState<{ open: boolean; inscription: Inscription | null }>({ open: false, inscription: null });
  const [replaceModal, setReplaceModal] = useState<{ open: boolean; inscription: Inscription | null; selectedClass: string }>({ open: false, inscription: null, selectedClass: '' });

  const { data: academicYears, isLoading: academicYearsLoading, error: academicYearsError } = useAcademicYears();
  const { data: classesData, isLoading: classesLoading } = useClasses();
  const updateInscriptionMutation = useUpdateInscription();
  const deleteInscriptionMutation = useDeleteInscription();
  const activateInscriptionMutation = useActivateInscription();
  const replaceInscriptionMutation = useReplaceInscription();



  if (academicYearsError) {
    notify.error("Erreur de chargement des anne academique ")
  }
  // Handler pour gérer les mises à jour de cellules   
  const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
    try {
      // Mapper les clés de colonnes aux champs API
      const fieldMap: Record<string, string> = {
        'academic_year': 'academic_year',
        'class_fk': 'class_fk_id',
        'student_first_name': 'student_first_name',
        'student_last_name': 'student_last_name',
      };

      const apiField = fieldMap[columnKey] || columnKey;

      // Utiliser le hook useUpdateInscription pour la mise à jour
      await updateInscriptionMutation.mutateAsync({
        id: String(rowId),
        data: { [apiField]: newValue }
      });

    } catch (error: unknown) {
      console.error('Erreur lors de la mise à jour:', error);
      const message = error && typeof error === 'object' && 'originalMessage' in error
        ? (error as ApiError).originalMessage
        : 'Erreur lors de la mise à jour';
      notify.error(message);
      throw error;
    }
  };



  const handleActivateInscription = async (row: Inscription) => {
    setActivationModal({ open: true, inscription: row });
  };


  const handleReplaceInscription = async (row: Inscription) => {
    setReplaceModal({ open: true, inscription: row, selectedClass: row.class_fk?.id || '' });
  };

  const confirmReplace = async () => {
    if (!replaceModal.inscription || !replaceModal.selectedClass) return;

    try {
      await replaceInscriptionMutation.mutateAsync({
        id: replaceModal.inscription.id,
        class_fk_id: replaceModal.selectedClass
      });
      notify.success('Inscription remplacée avec succès.');
      refetch?.();
      setReplaceModal({ open: false, inscription: null, selectedClass: '' });
    } catch (error:any) {
      notify.error(error.message);
    }
  };

  const confirmActivation = async () => {
    if (!activationModal.inscription) return;

    try {
      await activateInscriptionMutation.mutateAsync(activationModal.inscription.id);
      notify.success('Inscription activée avec succès.');
      refetch?.();
      setActivationModal({ open: false, inscription: null });
    } catch (error: any) {
      notify.error(error.message);
    }
  };

  const handleDeleteInscription = async (row: Inscription) => {
    try {
      await deleteInscriptionMutation.mutateAsync(row.id);
      notify.success('Inscription supprimée avec succès.');
      refetch?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      notify.error('Échec de la suppression de l\'inscription.');
    }
  };

  const columns = [
    { key: 'student_matricule', label: 'Matricule', sortable: true, editable: false },
    {
      key: 'student_last_name',
      label: 'Nom',
      sortable: true,
      editable: false,
      type: 'text' as const,
      render: (row: Inscription) => row.student_last_name || '-'

    },
    {
      key: 'student_first_name',
      label: 'Prénom',
      sortable: true,
      editable: false,
      type: 'text' as const,
      render: (row: Inscription) => row.student_first_name || '-'
    },
    {
      key: 'academic_year',
      label: 'Année',
      sortable: true,
      editable: true,
      type: 'select' as const,
      options: (academicYears?.results && Array.isArray(academicYears.results))
        ? transform(academicYears.results.filter(Boolean), {
          value: "id",
          label: "civil_year"
        }) as { value: string; label: string }[]
        : [],
      render: (row: Inscription) => row.year || '-',
    },
    {
      key: 'class_fk',
      label: 'Classe',
      sortable: true,
      editable: true,
      type: 'select' as const,
      options: (classesData?.results && Array.isArray(classesData.results))
        ? classesData.results.filter(Boolean).map((cls: Class) => ({
          value: cls.id,
          label: `${cls.class_name} - ${cls.department?.abreviation || ''} - ${cls.department?.faculty?.faculty_abreviation || ''}`
        }))
        : [],
      render: (row: Inscription) => {
        const classFk = row.class_fk;
        if (!classFk) return '-';
        return `${classFk.class_name} - ${classFk.department.abreviation || ''} - ${classFk.department?.faculty?.faculty_abreviation || ''}`;
      }
    },
    {
      key: 'regist_status',
      label: 'Statut',
      editable: false,
      render: (row: Inscription) => {
        const value = row.regist_status;
        const statusColors = {
          'Active': 'bg-green-100 text-green-800',
          'Pending': 'bg-yellow-100 text-yellow-800',
          'Completed': 'bg-blue-100 text-blue-800',
          'Withdrawn': 'bg-red-100 text-red-800',
          'Dropped': 'bg-red-100 text-red-800',
          'Suspended': 'bg-orange-100 text-orange-800',
          'Canceled': 'bg-gray-100 text-gray-800',
          'Replaced': 'bg-purple-100 text-purple-800'
        };
        return (
          <span className={`px-2 py-1 rounded-md text-xs font-semibold  ${statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: "activation",
      label: "Activation",
      editable: false,
      filtable: false,
      searchable: false,
      render: (row: Inscription) => (
      <Button size="sm" variant="outline" disabled={row.regist_status === "Active" || activateInscriptionMutation.isPending} onClick={() => handleActivateInscription(row)}>
        {activateInscriptionMutation.isPending ? 'Chargement...' : 'Activer'}
      </Button>
      )
    },
    {
      key: "replace",
      label: "Remplacer",
      editable: false,
      filtable: false,
      searchable: false,
      render: (row: Inscription) => (
        <Button size="sm" variant="outline" disabled={row.regist_status !== "Active" || replaceInscriptionMutation.isPending} onClick={() => handleReplaceInscription(row)}>
          {replaceInscriptionMutation.isPending ? 'Chargement...' : 'Remplacer'}
        </Button>
      )
    },
    {
      key: "payment_status",
      label: "Paiement",
      editable: false,
      render: (row: Inscription) => row.payment_status ? <span className="text-green-600 font-semibold">Payé</span> : <span className="text-red-600 font-semibold">Non Payé</span>
    },
    {
      key: 'date_inscription',
      label: 'Date d\'inscription',
      type: "date" as const,
      editable: false,
    },
  ];

  const handleInscriptionComplete = async (data: InscriptionFormData) => {
    console.log(data)
    const result = await processInscription(data);

    if (result.success) {
      setShowWizard(false);
      setResumeDraft(undefined);
      refetch?.(); // Refresh the inscriptions list
      console.log('Inscription créée avec succès:', result.data);
    } else {
      console.error('Erreur lors de l\'inscription:', result.error);
    }
  };

  const handleResumeDraft = (draft: InscriptionDraft) => {
    setResumeDraft(draft);
    setShowWizard(true);
  };

  const handleNewInscription = () => {
    setResumeDraft(undefined);
    setShowWizard(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestion des Inscriptions</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Total: {inscriptinData?.count} inscriptions
          </p>
        </div>
        <button
          onClick={handleNewInscription}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Nouvelle Inscription
        </button>
      </div>

      <InscriptionWizard
        isOpen={showWizard}
        onClose={() => {
          setShowWizard(false);
          setResumeDraft(undefined);
          setDraftRefreshTrigger(prev => prev + 1);
        }}
        onComplete={handleInscriptionComplete}
        resumeDraft={resumeDraft}
      />
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 <strong>Note:</strong>Pour  la colonne  classe comme: <small><i><b>BACI-PC-FTIC</b></i></small> : <small>Bac 1 , phase commune , FACULTÉ DES TECHNOLOGIES DE L'INFORMATION ET DE LA COMMUNICATION</small>
        </p>
      </div>
      <div className="space-y-4">
        <InscriptionDrafts onResumeDraft={handleResumeDraft} refreshTrigger={draftRefreshTrigger} />

        <DataTable<Inscription>
          tableId="inscriptions"
          columns={columns}
          data={inscriptinData || []}
          getRowId={(row) => row.id}
          isLoading={isLoading || isProcessing || academicYearsLoading || classesLoading}
          itemsPerPage={10}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onSearchChange={setSearchTerm}
          onBackendFiltersChange={setFilterBackend}
          onBackendOrderingChange={setOrderingBackend}
          onCellEdit={handleCellEdit}
          onDeleteRow={handleDeleteInscription}
          setItemsPerPage={setPage_saze}
          isPaginated
        />
      </div>


      <Modal
        open={activationModal.open}
        type="warning"
        title="Activer l'inscription"
        description={`Voulez-vous vraiment activer l'inscription de ${activationModal.inscription?.student_first_name} ${activationModal.inscription?.student_last_name} ?`}
        onClose={() => setActivationModal({ open: false, inscription: null })}
        actions={
          activateInscriptionMutation.isPending ? (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Activation en cours...</span>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={() => setActivationModal({ open: false, inscription: null })}>
                Annuler
              </Button>
              <Button onClick={confirmActivation}>
                Confirmer
              </Button>
            </>
          )
        }
      />

      <Modal
        open={replaceModal.open}
        type="warning"
        title="Remplacer l'inscription"
        description={undefined}
        onClose={() => setReplaceModal({ open: false, inscription: null, selectedClass: '' })}
        actions={
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <SingleSelectDropdown
                options={(classesData?.results || []).map((cls: Class) => ({
                  id: cls.id,
                  label: `${cls.class_name} - ${cls.department?.abreviation} - ${cls.department?.faculty?.faculty_abreviation}`
                }))}
                value={replaceModal.selectedClass}
                onChange={(value) => setReplaceModal({ ...replaceModal, selectedClass: value })}
                placeholder="Sélectionner une classe"
                searchPlaceholder="Rechercher..."
                label={`Choisissez la nouvelle classe pour ${replaceModal.inscription?.student_first_name} ${replaceModal.inscription?.student_last_name}`}
              />
            </div>
            <div className="flex  gap-2">
              {replaceInscriptionMutation.isPending ? (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Remplacement en cours...</span>
              </div>
            ) : (
              <>
                <Button className='flex-1' variant="outline" onClick={() => setReplaceModal({ open: false, inscription: null, selectedClass: '' })}>
                  Annuler
                </Button>
                <Button className='flex-1' onClick={confirmReplace} disabled={!replaceModal.selectedClass}>
                  Confirmer
                </Button>
              </>
            )}
            </div>
            
          </div>
        }
      />

    </div>

  );
}
