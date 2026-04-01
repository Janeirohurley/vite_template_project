/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import { Search, Trash2, Loader2 } from 'lucide-react';
import type { InscriptionStepProps } from '../../../../types/inscription.d';
import { useParents, useProfessions, useStudentByMatricule } from '../../../../api/inscription';
import { createParentApi, submitInscriptionStepApi } from '../../api/studentServiceApi';
import type { CreateParentData } from '../../types';
import { SingleSelectDropdown } from '../../../../components/ui/SingleSelectDropdown';
import { Input } from '../../../../components/ui/input';
import { FormGroup } from '../../../../components/ui/FormGroup';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { notify } from '../../../../lib';

export function Step2ParentInfo({ data, onNext, onPrevious, onAutoSave }: InscriptionStepProps) {
  const [parentSearch, setParentSearch] = useState('');
  const parentsQueryParams = {
    page: 1,
    page_size: 10,
    pagination: true,
    ...(parentSearch ? { search: parentSearch } : {})
  };
  const {
    data: parents = [],
    refetch: refetchParents,
    isFetching: parentsFetching
  } = useParents(parentsQueryParams);
  const { data: professions = [], isLoading: professionsLoading } = useProfessions({ pagination: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedParents, setSelectedParents] = useState<Array<{
    id?: string;
    parent_name?: string;
    parent_phone?: string;
    parent_email?: string;
    profession_id: string;
    parent_type: 'F' | 'M' | 'G' | 'T';
    is_alive: boolean;
    is_contact_person: boolean;
  }>>(data.step2?.parents || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [matricule, setMatricule] = useState('');
  const selectedParentIds = selectedParents
    .filter(parent => parent.id)
    .map(parent => parent.id as string);
  const [searchMethod, setSearchMethod] = useState<'none' | 'matricule' | 'existing'>('none');
  const [shouldSearch, setShouldSearch] = useState(false);

  // Utiliser le hook avec enabled conditionnel
  const {
    data: studentData,
    refetch: searchStudent,
    isLoading: isSearching,
    isError,
    error
  } = useStudentByMatricule(matricule, {
    enabled: false // Désactivé par défaut, on va utiliser refetch manuellement
  });

  // Effet pour gérer le résultat de la recherche
  useEffect(() => {
    if (shouldSearch && studentData) {
      setSelectedParents(studentData);
      setSearchMethod('matricule');
      notify.success(`Parents trouvés pour l'étudiant`);
      setShouldSearch(false);
    }
  }, [studentData, shouldSearch]);

  // Effet pour gérer les erreurs
  useEffect(() => {
    if (shouldSearch && isError) {
      notify.error(error?.message || 'Étudiant non trouvé');
      setShouldSearch(false);
    }
  }, [isError, error, shouldSearch]);

  const handleMatriculeSearch = async () => {
    if (!matricule.trim()) {
      notify.error('Veuillez entrer un matricule');
      return;
    }

    setShouldSearch(true);
    await searchStudent();
  };





  const addNewParent = async (parentData: any) => {
    try {
      const createdParent = await createParentApi(parentData);
      const newParents = [...selectedParents, {
        id: createdParent.id,
        parent_name: createdParent.parent_name,
        parent_phone: createdParent.parent_phone,
        profession_id: createdParent.profession.id,
        parent_type: createdParent.parent_type as 'F' | 'M' | 'T',
        is_alive: createdParent.is_alive,
        is_contact_person: createdParent.is_contact_person
      }];
      setSelectedParents(newParents);
      setShowAddForm(false);
      refetchParents();
      notify.success('Parent créé avec succès');
      onAutoSave?.({ parents: newParents });
    } catch (error) {
      notify.error('Erreur lors de la création du parent', error);
    }
  };

  const removeParent = (index: number) => {
    const newParents = selectedParents.filter((_, i) => i !== index);
    setSelectedParents(newParents);
    onAutoSave?.({ parents: newParents });
    if (newParents.length === 0) {
      setSearchMethod('none');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedParents.length === 0) {
      notify.error('Veuillez sélectionner au moins un parent');
      return;
    }

    if (!data.step1?.user_id || !data.step1?.colline_id) {
      notify.error('Données manquantes de l\'étape 1');
      return;
    }

    setIsSubmitting(true);
    try {
      // Extract parent IDs only
      const parentIds = selectedParents
        .filter(p => p.id) // Only include parents with IDs (existing or newly created)
        .map(p => p.id!);

      // Prepare data for submission
      const submissionData = {
        user: data.step1.user_id,
        colline: data.step1.colline_id,
        cam: data.step1.cam,
        parent_ids: parentIds
      };

      console.log('Submitting inscription step data:', submissionData);

      // Submit to API using generic function
      const result = await submitInscriptionStepApi('/student/students/', submissionData);

      notify.success('Étudiant créé avec succès');
      console.log('Step submission result:', result);

      // Pass the created student ID and parent data to the next step
      onNext({
        parents: selectedParents,
        student_id: result.id
      });
    } catch (error: any) {
      console.error('Error submitting step:', error);
      notify.error(error?.message || 'Erreur lors de la soumission');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousClick = () => {
    if (showAddForm) {
      setIsBackConfirmOpen(true);
      return;
    }

    onPrevious?.();
  };

  if (professionsLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Informations des Parents/Tuteurs</h3>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Informations des Parents/Tuteurs</h3>

        {/* Matricule Search */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                Rechercher par matricule d'un étudiant existant
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Utilisez le matricule pour récupérer automatiquement les parents déjà enregistrés.
              </p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Entrer le matricule de l'étudiant..."
                value={matricule}
                onChange={(e) => {
                  setMatricule(e.target.value);
                  if (e.target.value) {
                    setSearchMethod('matricule');
                    setSelectedParents([]);
                    onAutoSave?.({ parents: [] });
                  }
                }}
                disabled={searchMethod === 'existing' || isSearching}
                className={`${searchMethod === 'existing' ? 'opacity-50' : ''}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleMatriculeSearch();
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={handleMatriculeSearch}
              disabled={!matricule.trim() || searchMethod === 'existing' || isSearching}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recherche...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Rechercher
                </>
              )}
            </button>
          </div>
        </div>
        {/* Existing Parents Selection - Modern MultiSelect */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-4 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                Ou sélectionner des parents existants
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recherche serveur avec pagination. Affiche jusqu'à 10 parents par requête.
              </p>
            </div>
            {selectedParentIds.length > 0 && (
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                {selectedParentIds.length} sélectionné(s)
              </span>
            )}
          </div>
          <div className="mt-3">
            <ModernMultiSelect
              options={parents.map(parent => ({
                id: parent.id,
                label: `${parent.parent_name} - ${parent.parent_phone} (${parent.parent_type === 'F' ? 'Père' : parent.parent_type === 'M' ? 'Mère' : 'Tuteur'})`
              }))}
              value={selectedParentIds}
              onChange={(values) => {
                if (values.length > 0) {
                  setSearchMethod('existing');
                  setMatricule('');
                  // Add selected parents to the list, keep existing details when available
                  const newParents: typeof selectedParents = values.map(id => {
                    const existing = selectedParents.find(p => p.id === id);
                    if (existing) return existing;
                    const parent = parents.find(p => p.id === id)!;
                    return {
                      id: parent.id,
                      parent_name: parent.parent_name,
                      parent_phone: parent.parent_phone,
                      profession_id: parent.profession.id,
                      parent_type: parent.parent_type as 'F' | 'M' | 'T',
                      is_alive: parent.is_alive,
                      is_contact_person: parent.is_contact_person
                    };
                  });
                  setSelectedParents(newParents);
                  onAutoSave?.({ parents: newParents });
                } else {
                  setSearchMethod('none');
                  setSelectedParents([]);
                  onAutoSave?.({ parents: [] });
                }
              }}
              placeholder="Choisir des parents existants..."
              onSearch={setParentSearch}
              isLoading={parentsFetching}
            />
          </div>
        </div>

        {/* Add New Parent Button */}
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="mb-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm"
        >
          Ajouter un nouveau parent
        </button>

        {/* New Parent Form (Popup) */}
        <AlertDialog
          open={showAddForm}
          onOpenChange={(open) => {
            if (open) {
              setShowAddForm(true);
            }
          }}
        >
          <AlertDialogContent className="max-w-2xl">
            <NewParentForm
              professions={professions}
              onAdd={addNewParent}
              onCancel={() => setShowAddForm(false)}
            />
          </AlertDialogContent>
        </AlertDialog>

        {/* Selected Parents List */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Parents sélectionnés</h4>
            <span className="text-xs text-gray-500">{selectedParents.length} total</span>
          </div>
          {isSearching ? (
            <div className="space-y-3 mt-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-1/2" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-2/3" />
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded animate-pulse w-1/3" />
                </div>
              </div>
            </div>
          ) : selectedParents.length > 0 ? (
            <div className="mt-3 space-y-2">
              {selectedParents.map((parent, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/60 rounded-lg">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {parent.parent_name ?? parents.find(p => p.id === parent.id)?.parent_name ?? parent.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                        {parent.parent_type === 'F' ? 'Père' : parent.parent_type === 'M' ? 'Mère' : 'Tuteur'}
                      </span>
                      {parent.is_contact_person && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                          Contact
                        </span>
                      )}
                      {!parent.is_alive && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                          Décédé
                        </span>
                      )}
                    </div>
                    {parent.parent_phone && (
                      <div className="text-xs text-gray-500 mt-1">
                        {parent.parent_phone}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeParent(index)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                    aria-label="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-gray-500 text-sm ">
              Aucun parent sélectionné. Ajoutez un parent existant ou créez-en un nouveau.
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={handlePreviousClick}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Précédent
        </button>
        <button
          type="submit"
          disabled={isSubmitting || selectedParents.length === 0}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? 'Création en cours...' : 'Suivant'}
        </button>
      </div>

      <AlertDialog open={isBackConfirmOpen} onOpenChange={setIsBackConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter cette étape ?</AlertDialogTitle>
            <AlertDialogDescription>
              Vous avez un formulaire de création de parent en cours. Revenir en arrière va perdre les informations non enregistrées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rester ici</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsBackConfirmOpen(false);
                setShowAddForm(false);
                onPrevious?.();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Quitter et perdre les données
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

function NewParentForm({ professions, onAdd, onCancel }: {
  professions: any[];
  onAdd: (data: CreateParentData) => Promise<void>;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<CreateParentData>({
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    profession_id: '',
    parent_type: 'F' as 'F' | 'M' | 'T',
    is_alive: true,
    is_contact_person: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelConfirmStep, setCancelConfirmStep] = useState<1 | 2>(1);

  const normalizedName = formData.parent_name.trim();
  const normalizedPhone = formData.parent_phone.trim();
  const normalizedEmail = (formData.parent_email || '').trim();
  const hasAtLeastOneContactInfo = Boolean(normalizedPhone || normalizedEmail);

  useEffect(() => {
    if (!hasAtLeastOneContactInfo && formData.is_contact_person) {
      setFormData(prev => ({ ...prev, is_contact_person: false }));
    }
  }, [hasAtLeastOneContactInfo, formData.is_contact_person]);

  const nameError = !normalizedName
    ? 'Le nom complet est obligatoire.'
    : normalizedName.length < 3
      ? 'Le nom complet doit contenir au moins 3 caractères.'
      : '';

  const phoneError = !normalizedPhone
    ? ''
    : !/^\+?[0-9]{8,15}$/.test(normalizedPhone)
      ? 'Le téléphone doit contenir entre 8 et 15 chiffres (avec + optionnel).'
      : '';

  const emailError = normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ? 'Veuillez saisir un email valide.'
    : '';

  const professionError = !formData.profession_id
    ? 'La profession est obligatoire.'
    : '';

  const isFormInvalid = Boolean(nameError || phoneError || emailError || professionError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    const payload: CreateParentData = {
      ...formData,
      parent_name: normalizedName,
      parent_phone: normalizedPhone || '',
      parent_email: normalizedEmail || undefined,
      is_contact_person: hasAtLeastOneContactInfo ? formData.is_contact_person : false,
    };

    setIsSubmitting(true);
    try {
      await onAdd(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelWithDoubleConfirm = () => {
    setCancelConfirmStep(1);
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirmAction = () => {
    if (cancelConfirmStep === 1) {
      setCancelConfirmStep(2);
      return;
    }

    setIsCancelDialogOpen(false);
    setCancelConfirmStep(1);
    onCancel();
  };

  return (
    <div>
      <h5 className="font-medium mb-3">Nouveau Parent</h5>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormGroup columns={2}>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Nom complet *
            </label>
            <Input
              type="text"
              placeholder="Nom complet"
              value={formData.parent_name}
              onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
              required
            />
            {nameError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{nameError}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Téléphone (optionnel)
            </label>
            <Input
              type="tel"
              placeholder="Téléphone"
              value={formData.parent_phone}
              onChange={(e) => setFormData({ ...formData, parent_phone: e.target.value })}
            />
            {phoneError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{phoneError}</p>}
          </div>
        </FormGroup>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email (optionnel)
          </label>
          <Input
            type="email"
            placeholder="Email"
            value={formData.parent_email}
            onChange={(e) => setFormData({ ...formData, parent_email: e.target.value })}
          />
          {emailError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>}
        </div>

        <FormGroup columns={2}>
          <div className='flex flex-col'><SingleSelectDropdown
            options={professions.map(prof => ({
              id: prof.id,
              label: prof.profession_name
            }))}
            value={formData.profession_id}
            onChange={(value) => setFormData({ ...formData, profession_id: value })}
            label="Profession"
            placeholder="Sélectionner une profession"
            required
          />
            {professionError && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{professionError}</p>}
          </div>


          <SingleSelectDropdown
            options={[
              { id: 'F', label: 'Père' },
              { id: 'M', label: 'Mère' },
              { id: 'T', label: 'Tuteur' }
            ]}
            value={formData.parent_type}
            onChange={(value) => setFormData({ ...formData, parent_type: value as 'F' | 'M' | 'T' })}
            label="Type de parent"
            placeholder="Sélectionner le type"
            required
          />
        </FormGroup>

        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_alive}
              onChange={(e) => setFormData({ ...formData, is_alive: e.target.checked })}
              className="mr-2"
            />
            En vie
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_contact_person}
              disabled={!hasAtLeastOneContactInfo}
              onChange={(e) => setFormData({ ...formData, is_contact_person: e.target.checked })}
              className="mr-2"
            />
            Personne de contact
          </label>
        </div>
        {!hasAtLeastOneContactInfo && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Renseignez au moins le téléphone ou l'email pour activer « Personne de contact ».
          </p>
        )}

        <div className="flex gap-2">
          <button type="button" onClick={handleSubmit} disabled={isSubmitting || isFormInvalid} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {isSubmitting ? 'Création...' : 'Ajouter'}
          </button>
          <button type="button" onClick={handleCancelWithDoubleConfirm} disabled={isSubmitting} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50">
            Annuler
          </button>
        </div>
      </form>

      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={(open) => {
          setIsCancelDialogOpen(open);
          if (!open) {
            setCancelConfirmStep(1);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {cancelConfirmStep === 1
                ? 'Annuler la création du parent ?'
                : 'Confirmation finale'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {cancelConfirmStep === 1
                ? 'Vous êtes sur le point de fermer ce formulaire.'
                : 'Toutes les données saisies seront perdues. Voulez-vous vraiment continuer ?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              type="button"
              onClick={() => {
                setIsCancelDialogOpen(false);
                setCancelConfirmStep(1);
              }}
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={handleCancelConfirmAction}
              className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${cancelConfirmStep === 2 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {cancelConfirmStep === 1 ? 'Continuer' : 'Confirmer l\'annulation'}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Modern MultiSelect Component
function ModernMultiSelect({ options, value, onChange, placeholder, disabled, onSearch, isLoading }: {
  options: { id: string; label: string }[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const lastSubmittedRef = useRef('');

  useEffect(() => {
    if (!onSearch) return;
    const term = searchTerm.trim();
    if (term.length > 0 && term.length < 2) return;
    const handler = setTimeout(() => {
      if (term === lastSubmittedRef.current) return;
      lastSubmittedRef.current = term;
      onSearch(term);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  const toggleOption = (optionId: string) => {
    const newValue = value.includes(optionId)
      ? value.filter(id => id !== optionId)
      : [...value, optionId];
    onChange(newValue);
  };

  const getDisplayText = () => {
    if (value.length === 0) return placeholder || 'Sélectionner...';
    if (value.length === 1) {
      const option = options.find(opt => opt.id === value[0]);
      return option?.label || value[0];
    }
    return `${value.length} parents sélectionnés`;
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-3 py-2 text-left bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 shadow-sm ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
      >
        <span className={value.length === 0 ? 'text-gray-500' : ''}>
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-2 text-gray-500">
          {value.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              {value.length}
            </span>
          )}
          <Search className="w-4 h-4" />
        </div>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl">
          <div className="p-2 border-b border-gray-200 dark:border-gray-600">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9"
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto">

            {isLoading ? (
              <div className="px-3 py-2 text-sm text-gray-500">Chargement...</div>
            ) : options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500">Aucun parent trouvé</div>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`flex items-center px-3 py-2 cursor-pointer transition-colors duration-150 ${isSelected
                      ? 'bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <div className={`w-4 h-4 border-2 mr-3 flex items-center justify-center transition-all duration-150 ${isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300 dark:border-gray-600'
                      }`}>
                      {isSelected && (
                        <div className="w-2 h-2 bg-white" />
                      )}
                    </div>
                    <span className={`text-sm ${isSelected
                      ? 'text-blue-700 dark:text-blue-300 font-medium'
                      : 'text-gray-900 dark:text-gray-100'
                      }`}>
                      {option.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
