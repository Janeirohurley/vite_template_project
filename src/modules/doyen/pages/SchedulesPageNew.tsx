/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useDoyenStore } from '../store/doyenStore';
import { TimetableBuilder } from '../components';
import MergeListDrawer from '../components/timetable/MergeListDrawer';
import {
  Calendar,
  Grid,
  Clock,
  CheckCircle2,
  Merge,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  useDeleteTimetable,
  usePublishTimetable,
  useScheduleSlots,
  useClasses,
  useClassGroups,
  useTimetableMerges,
  useDeleteTimetableMerge,
} from '../hooks/useTimetable';
import {
  useTimetablesWithStats,
  useTimetableStats,
  useValidateMerge,
  useCreateMergeBackend,
  useMergePreview,
  useAddToMergeBackend,
  useRemoveFromMergeBackend,
  useShareTimetable,
  useUnshareTimetable,
} from '../hooks/useTimetableBackend';
import type { ScheduleSlot, Timetable } from '../types/backend';
import { StatsCard, type StatsCardProps } from "@/components/ui/StatsCard";
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import { useAppStore } from '@/lib';
import TimetableListItem from '../components/timetable/TimetableListItem';
import getStatusInfo from '../components/timetable/getStatusInfo';
import TimetableDetailView from '../components/timetable/TimetableDetailView';
import TimetableMergedDetailView from '../components/timetable/TimetableMergedDetailView';
import MergeNameModal from '../components/timetable/MergeNameModal';
import AddToMergeModal from '../components/timetable/AddToMergeModal';
import { Modal } from '@/components/ui/Modal';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import ShareTimetableModal from '../components/timetable/ShareTimetableModal';



export function SchedulesPageNew() {
  const { selectedClass } = useDoyenStore();
  const { selectedAcademicYear, selectedDeanProfile } = useAppStore();
  const [selectedTimetableId, setSelectedTimetableId] = useState<string | null>(null);
  const [selectedTimetableIdToEdit, setSelectedTimetableIdToEdit] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'builder'>('list');

  // États pour la sélection multiple et le merge
  const [selectedTimetableIds, setSelectedTimetableIds] = useState<string[]>([]);
  const [mergedData, setMergedData] = useState<any>(null);
  const [showMergedView, setShowMergedView] = useState(false);
  const [showMergeNameModal, setShowMergeNameModal] = useState(false);
  const [showMergeListDrawer, setShowMergeListDrawer] = useState(false);
  const [showAddToMergeModal, setShowAddToMergeModal] = useState(false);
  const [selectedTimetableForMerge, setSelectedTimetableForMerge] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{ open: boolean; type: 'info' | 'success' | 'danger' | 'warning'; title: string; description: string; onConfirm?: () => void }>(
    { open: false, type: 'info', title: '', description: '' }
  );
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<Date | undefined>();
  const [selectedMergeIdForPreview, setSelectedMergeIdForPreview] = useState<string | undefined>();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedTimetableForShare, setSelectedTimetableForShare] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [allTimetables, setAllTimetables] = useState<any[]>([]);

  const { data: classesData, isLoading: loadingClasses } = useClasses();
  const { data: groupsData, isLoading: loadingGroups } = useClassGroups(
    { class_id: selectedClassId },
    {
      enabled: !!selectedClassId, // ne s'exécute que si selectedClassId est truthy
    }
  );


  const classes = classesData?.results || [];
  const groups = groupsData?.results || [];
  
  // Fetch data avec stats depuis le backend
  const {
    data: timetablesData,
    isLoading,
    isFetching,
  } = useTimetablesWithStats({
    academic_year_id: selectedAcademicYear?.id,
    class_group: selectedGroupId || selectedClass || undefined,
    faculty_id: selectedDeanProfile?.faculty,
    date: dateFilter?.toISOString().split('T')[0],
    page,
    page_size: 10,
  });

  const { data: statsData } = useTimetableStats({
    academic_year_id: selectedAcademicYear?.id,
    class_group: selectedGroupId || selectedClass || undefined,
    faculty_id: selectedDeanProfile?.faculty,
    date: dateFilter?.toISOString().split('T')[0],
  });

  const { data: slotsData } = useScheduleSlots({ pagination: false });

  const deleteScheduleMutation = useDeleteTimetable();
  const publishScheduleMutation = usePublishTimetable();

  const { data: mergesData } = useTimetableMerges({ pagination: false });
  const validateMergeMutation = useValidateMerge();
  const createMergeMutation = useCreateMergeBackend();
  const addToMergeMutation = useAddToMergeBackend();
  const removeFromMergeMutation = useRemoveFromMergeBackend();
  const deleteMergeMutation = useDeleteTimetableMerge();
  const shareTimetableMutation = useShareTimetable();
  const unshareTimetableMutation = useUnshareTimetable();
  const { data: mergePreviewData } = useMergePreview(selectedMergeIdForPreview || null);

  const savedMerges = mergesData?.results || [];
  const slots = slotsData?.results || [];
  const stats = statsData;
  const hasNextPage = !!timetablesData?.next;

  useEffect(() => {
    if (timetablesData?.results) {
      setAllTimetables(prev => page === 1 ? timetablesData.results : [...prev, ...timetablesData.results]);
    }
  }, [timetablesData, page]);

  useEffect(() => {
    setPage(1);
  }, [selectedAcademicYear?.id, selectedGroupId, selectedClass, dateFilter]);

  const timetables = allTimetables;

  // Gérer la sélection multiple avec Ctrl+Click
  const handleTimetableSelect = (id: string, ctrlKey: boolean) => {
    if (ctrlKey) {
      setSelectedTimetableIds(prev =>
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedTimetableId(id);
    }
  };

  // Fusionner les timetables sélectionnés
  const handleMergeSelected = async () => {
    if (selectedTimetableIds.length < 2) {
      setModalState({ open: true, type: 'warning', title: 'Sélection insuffisante', description: 'Veuillez sélectionner au moins 2 emplois du temps' });
      return;
    }

    // Valider avec le backend
    try {
      const validation = await validateMergeMutation.mutateAsync(selectedTimetableIds);
      
      if (!validation.valid && validation.errors) {
        const error = validation.errors[0];
        setModalState({ 
          open: true, 
          type: 'danger', 
          title: 'Impossible de fusionner', 
          description: `${error.message}: ${error.details.join(', ')}` 
        });
        return;
      }
      
      setShowMergeNameModal(true);
    } catch (err) {
      setModalState({ open: true, type: 'danger', title: 'Erreur', description: 'Erreur lors de la validation' });
    }
  };

  const performMerge = async (mergeName: string) => {
    try {
      const response = await createMergeMutation.mutateAsync({
        name: mergeName,
        timetable_ids: selectedTimetableIds,
      });

      setMergedData(response.merged_data);
      setShowMergedView(true);
      setSelectedTimetableIds([]);
      setShowMergeNameModal(false);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || 'Erreur lors de la fusion';
      const errorDetails = err?.response?.data?.error?.details?.join(', ') || '';
      setModalState({ 
        open: true, 
        type: 'danger', 
        title: 'Erreur de fusion', 
        description: errorDetails ? `${errorMsg}: ${errorDetails}` : errorMsg 
      });
    }
  };

  const handleViewMerge = (mergeId: string) => {
    console.log('handleViewMerge called with:', mergeId);
    setSelectedMergeIdForPreview(mergeId);
  };

  useEffect(() => {
    console.log('useEffect triggered:', { mergePreviewData, selectedMergeIdForPreview });
    if (mergePreviewData) {
      console.log('Setting merged data and opening view');
      // Adapter la structure pour correspondre à ce que TimetableMergedDetailView attend
      const adaptedData = {
        merged: mergePreviewData.merged_data,
        conflicts: mergePreviewData.merged_data?.conflicts || []
      };
      setMergedData(adaptedData);
      setShowMergedView(true);
      setShowMergeListDrawer(false);
      setSelectedMergeIdForPreview(undefined);
    }
  }, [mergePreviewData, selectedMergeIdForPreview]);

  const handleDeleteMerge = (mergeId: string) => {
    setModalState({
      open: true,
      type: 'danger',
      title: 'Supprimer cette fusion ?',
      description: 'Cette action est irréversible',
      onConfirm: async () => {
        await deleteMergeMutation.mutateAsync(mergeId);
        setModalState({ open: false, type: 'info', title: '', description: '' });
      }
    });
  };

  const handleAddToMerge = async (timetableId: string, mergeId: string) => {
    try {
      const response = await addToMergeMutation.mutateAsync({
        mergeId,
        request: { timetable_id: timetableId },
      });

      if (!response.success && response.error) {
        setModalState({ 
          open: true, 
          type: 'danger', 
          title: 'Impossible d\'ajouter', 
          description: `${response.error.message}: ${response.error.details.join(', ')}` 
        });
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || 'Erreur lors de l\'ajout';
      setModalState({ open: true, type: 'danger', title: 'Erreur', description: errorMsg });
    }
  };


  const handleRemoveFromMerge = async (timetableId: string, mergeId: string) => {
    try {
      const response = await removeFromMergeMutation.mutateAsync({
        mergeId,
        timetableId,
      });

      if (!response.success && response.error) {
        if (response.error.type === 'INSUFFICIENT_TIMETABLES') {
          setModalState({
            open: true,
            type: 'warning',
            title: 'Supprimer la fusion ?',
            description: response.error.message,
            onConfirm: () => {
              handleDeleteMerge(mergeId);
              setModalState({ open: false, type: 'info', title: '', description: '' });
            }
          });
        } else {
          setModalState({ 
            open: true, 
            type: 'danger', 
            title: 'Erreur', 
            description: response.error.message 
          });
        }
      }
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || 'Erreur lors du retrait';
      setModalState({ open: true, type: 'danger', title: 'Erreur', description: errorMsg });
    }
  };

  const handleOpenAddToMerge = (timetableId: string) => {
    setSelectedTimetableForMerge(timetableId);
    setShowAddToMergeModal(true);
  };

  const handleShare = (timetableId: string) => {
    setSelectedTimetableForShare(timetableId);
    setShowShareModal(true);
  };

  const handleShareConfirm = async (groupIds: string[]) => {
    if (!selectedTimetableForShare) return;

    try {
      await shareTimetableMutation.mutateAsync({
        timetableId: selectedTimetableForShare,
        groupIds,
      });
      setShowShareModal(false);
      setSelectedTimetableForShare(null);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.error?.message || 'Erreur lors du partage';
      setModalState({ open: true, type: 'danger', title: 'Erreur', description: errorMsg });
    }
  };

  const handleUnshare = async (timetableId: string, groupId: string) => {
    setModalState({
      open: true,
      type: 'warning',
      title: 'Retirer le partage ?',
      description: 'Êtes-vous sûr de vouloir retirer le partage de cet emploi du temps avec ce groupe ?',
      onConfirm: async () => {
        try {
          await unshareTimetableMutation.mutateAsync({ timetableId, groupId });
          setModalState({ open: false, type: 'info', title: '', description: '' });
        } catch (err: any) {
          const errorMsg = err?.response?.data?.error?.message || 'Erreur lors du retrait du partage';
          setModalState({ open: true, type: 'danger', title: 'Erreur', description: errorMsg });
        }
      }
    });
  };

  const handleDelete = async (id: string) => {
    setModalState({
      open: true,
      type: 'danger',
      title: 'Supprimer cet emploi du temps ?',
      description: 'Cette action est irréversible',
      onConfirm: async () => {
        try {
          await deleteScheduleMutation.mutateAsync(id);
          if (selectedTimetableId === id) setSelectedTimetableId(null);
          setModalState({ open: false, type: 'info', title: '', description: '' });
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handlePublish = async (id: string) => {
    setModalState({
      open: true,
      type: 'warning',
      title: 'Publier cet emploi du temps ?',
      description: 'Il sera visible par tous les utilisateurs',
      onConfirm: async () => {
        try {
          await publishScheduleMutation.mutateAsync(id);
          setModalState({ open: false, type: 'info', title: '', description: '' });
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const selectedTimetable = selectedTimetableId
    ? timetables.find(t => t.id === selectedTimetableId) as any
    : null;

  const selectedTimetableToEdit = selectedTimetableIdToEdit
    ? timetables.find(t => t.id === selectedTimetableIdToEdit) as any
    : null;

  const dashboardStats: StatsCardProps[] = [
    { label: "Total", value: stats?.total || 0, change: "emplois du temps", icon: Calendar, color: "blue" },
    { label: "Brouillons", value: stats?.drafts || 0, change: "en préparation", icon: Clock, color: "yellow" },
    { label: "Publiés", value: stats?.published || 0, change: "visibles", icon: CheckCircle2, color: "green" },
    { label: "Créneaux", value: stats?.slots || 0, change: "disponibles", icon: BookOpen, color: "purple" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Gestion des Emplois du Temps
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Consultation, création, publication et fusion intelligente
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              onClick={() => setActiveTab('list')}
              className="gap-2"
            >
              <Calendar className="w-4 h-4" />
              Consultation
            </Button>
            <Button
              variant={activeTab === 'builder' ? 'default' : 'outline'}
              onClick={() => setActiveTab('builder')}
              className="gap-2"
            >
              <Grid className="w-4 h-4" />
              Créateur
            </Button>
          </div>
        </div>
      </div>

      {activeTab === 'list' ? (
        <>
          {/* Stats */}
          <StatsGridLoader
            isPending={isLoading}
            data={dashboardStats}
            renderItem={(stat, index) => (
              <StatsCard key={stat.label} {...stat} delay={index * 0.1} />
            )}
          />

          {/* Bouton merge */}
          <div className='fixed -bottom-3 z-50  right-2 space-y-1.5'>
            {selectedTimetableIds.length >= 2 && (

              <Button onClick={handleMergeSelected} className="gap-2  py-0 h-9  cursor-pointer flex">
                <Merge className="w-3.5 h-3.5 inline" />
                <span >fusionner {selectedTimetableIds.length}</span>

              </Button>

            )}
            {savedMerges.length > 0 && (
              <Button
                onClick={() => setShowMergeListDrawer(true)}
                variant="outline"
                className="gap-2  py-0 h-9  cursor-pointer flex"
              >
                <Merge className="w-4 h-4 inline" />
                fusions ({savedMerges.length})
              </Button>
            )}
          </div>


          {/* Liste des emplois du temps individuels */}
          <div className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Emplois du Temps Individuels</CardTitle>
              <CardDescription>
                {timetables.length} emploi{timetables.length > 1 ? 's' : ''} du temps
              </CardDescription>
            </CardHeader>
            {/* Sélecteurs classe/groupe + Bouton créer créneau */}
            <div className="mb-2 flex flex-col lg:flex-row gap-4 items-end justify-end w-full mx-auto">
              {/* Sélecteur Classe */}


              <SingleSelectDropdown
                className='w-1/4'
                options={classes.map((cl) => ({
                  id: cl.id,
                  value: cl.id,
                  label: `${cl.class_name}`
                }))}
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e)}
                placeholder={loadingClasses ? 'Chargement...' : 'Choisir un groupe'}
                searchPlaceholder="Rechercher..."
                required

              />


              <SingleSelectDropdown
                className='w-1/4'
                options={groups.map((gr) => ({
                  id: gr.id,
                  value: gr.id,
                  label: `${gr.group_name}-->(${gr.class_name})`
                }))}
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e)}
                placeholder={loadingGroups ? 'Chargement...' : 'Choisir un groupe'}
                searchPlaceholder="Rechercher..."
                required
                disabled={!selectedClassId || loadingGroups}
              />

              <CustomDatePicker
                className='w-1/4'
                placeholder="Filtrer par date"
                onChange={(date) => setDateFilter(date ? new Date(date) : undefined)}
              />
            </div>
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading && page === 1 ? (
                  <div className="col-span-full flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
                  </div>
                ) : timetables.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-400" />
                    <p className="text-lg font-medium text-gray-500">Aucun emploi du temps</p>
                    <p className="text-sm text-gray-400 mt-2">Passez à l'onglet Créateur pour commencer</p>
                  </div>
                ) : (
                  timetables.map((timetable) => {
                    const statusInfo = getStatusInfo(timetable.status, timetable.published_date);

                    return (
                      <TimetableListItem
                        key={timetable.id}
                        timetable={timetable as any}
                        statusInfo={statusInfo}
                        isSelected={selectedTimetableId === timetable.id}
                        isMultiSelected={selectedTimetableIds.includes(timetable.id)}
                        isMerged={true}
                        mergeNames={timetable?.merges?.map((m: any) => m.name) || []}
                        merges={timetable.merges}
                        isShared={timetable.is_shared}
                        sharedGroups={timetable.shared_groups}
                        onSelect={(ctrlKey) => handleTimetableSelect(timetable.id, ctrlKey)}
                        onEdit={() => {
                          setSelectedTimetableIdToEdit(timetable.id);
                          setActiveTab('builder');
                        }}
                        onPublish={handlePublish}
                        onDelete={handleDelete}
                        onAddToMerge={() => handleOpenAddToMerge(timetable.id)}
                        onRemoveFromMerge={handleRemoveFromMerge}
                        onShare={handleShare}
                        onUnshare={handleUnshare}
                        onViewMerge={handleViewMerge}
                        isPublishing={publishScheduleMutation.isPending}
                        isDeleting={deleteScheduleMutation.isPending}
                      />
                    );
                  })
                )}
              </div>
              {hasNextPage && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={() => setPage(prev => prev + 1)}
                    disabled={isFetching}
                    variant="outline"
                    className="gap-2"
                  >
                    {isFetching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
                        Chargement...
                      </>
                    ) : (
                      'Voir plus'
                    )}
                  </Button>
                </div>
              )}
            </>
          </div>

          {/* Modal détail normal */}
          <TimetableDetailView
            timetable={selectedTimetable}
            slots={slots}
            isOpen={!!selectedTimetable}
            onClose={() => setSelectedTimetableId(null)}
          />

          {/* Modal détail MERGÉ */}
          <TimetableMergedDetailView
            mergedData={mergedData}
            isOpen={showMergedView}
            onClose={() => setShowMergedView(false)}
          />

          {/* Modal nom du merge */}
          <MergeNameModal
            isOpen={showMergeNameModal}
            onClose={() => setShowMergeNameModal(false)}
            onConfirm={performMerge}
            selectedCount={selectedTimetableIds.length}
            isLoading={createMergeMutation.isPending}
          />

          {/* Modal ajouter à une fusion */}
          <AddToMergeModal
            isOpen={showAddToMergeModal}
            onClose={() => {
              setShowAddToMergeModal(false);
              setSelectedTimetableForMerge(null);
            }}
            onConfirm={(mergeId) => {
              if (selectedTimetableForMerge) {
                handleAddToMerge(selectedTimetableForMerge, mergeId);
              }
            }}
            availableMerges={savedMerges}
            timetableName={timetables.find(t => t.id === selectedTimetableForMerge)?.course_name || ''}
          />
          {/* ================liste of merged data */}

          <MergeListDrawer
            isOpen={showMergeListDrawer}
            onClose={() => setShowMergeListDrawer(false)}
            merges={savedMerges}
            onViewMerge={handleViewMerge}
            onDeleteMerge={handleDeleteMerge}
          />

          {/* Modal partage */}
          <ShareTimetableModal
            isOpen={showShareModal}
            onClose={() => {
              setShowShareModal(false);
              setSelectedTimetableForShare(null);
            }}
            onConfirm={handleShareConfirm}
            classes={classes}
            loadingClasses={loadingClasses}
            isLoading={shareTimetableMutation.isPending}
          />

        </>
      ) : (
        <TimetableBuilder timetableToEdit={selectedTimetableToEdit} onEditComplete={
          () => {
            setActiveTab('list')
            setSelectedTimetableIdToEdit(null)
          }

        } />
      )}

      {/* Modal de confirmation/erreur */}
      <Modal
        open={modalState.open}
        type={modalState.type}
        title={modalState.title}
        description={modalState.description}
        onClose={() => setModalState({ open: false, type: 'info', title: '', description: '' })}
        actions={modalState.onConfirm && (
          <>
            <Button variant="outline" onClick={() => setModalState({ open: false, type: 'info', title: '', description: '' })}>
              Annuler
            </Button>
            <Button onClick={modalState.onConfirm}>
              Confirmer
            </Button>
          </>
        )}
      />
    </div>
  );
}


export interface SlotWithTimetable extends ScheduleSlot {
  timetableInfo: Timetable;
}
