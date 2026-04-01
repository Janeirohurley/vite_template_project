import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import type { InscriptionStepProps } from '../../../../types/inscription.d';
import { useHighschools, useCertificates, useTrainings, useSections, useTrainingCenters } from '../../../../api/inscription';
import { createStudentHsInfoApi, createTrainingApi } from '../../api/studentServiceApi';
import { notify } from '../../../../lib';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import { Input } from '@/components/ui/input';
import { FormGroup } from '@/components/ui/FormGroup';
import { transform } from '@/components/common/transformAny';
import { Toggle } from '@/components/ui/Toggle';
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

export function Step3HighschoolInfo({ data, onNext, onPrevious, onAutoSave }: InscriptionStepProps) {
  const currentYear = new Date().getFullYear();
  const minYear = 1990;
  const [searchHighschool, setSearchHighschool] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [searchCertificates, setSearchCertificates] = useState('');
  const [searchSection, setSearchSection] = useState('');
  const { data: highschools, isLoading: highschoolsLoading } = useHighschools({ search: searchHighschool });
  const { data: certificates, isLoading: certificatesLoading } = useCertificates({ search: searchCertificates, section_name: selectedSection });
  const { data: sections, isLoading: sectionLoading } = useSections({ search: searchSection });
  const [trainingSearchInput, setTrainingSearchInput] = useState('');
  const [trainingSearch, setTrainingSearch] = useState('');
  const [searchTrainingCenter, setSearchTrainingCenter] = useState('');
  const trainingsQueryParams = {
    page: 1,
    page_size: 10,
    pagination: true,
    ...(trainingSearch ? { search: trainingSearch } : {})
  };
  const { data: trainings = [], isFetching: trainingsFetching, refetch: refetchTrainings } = useTrainings(trainingsQueryParams);
  const { data: trainingCenters, isLoading: trainingCentersLoading } = useTrainingCenters({ search: searchTrainingCenter });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingTraining, setIsCreatingTraining] = useState(false);
  const [showCreateTrainingForm, setShowCreateTrainingForm] = useState(false);
  const [isBackConfirmOpen, setIsBackConfirmOpen] = useState(false);
  const [isCancelCreateTrainingConfirmOpen, setIsCancelCreateTrainingConfirmOpen] = useState(false);
  const [newTrainingData, setNewTrainingData] = useState({
    domaine: '',
    certificate: '',
    training_center: ''
  });

  const hasUnsavedTrainingCreation = Boolean(
    newTrainingData.domaine.trim() || newTrainingData.certificate.trim() || newTrainingData.training_center
  );

  const trainingCenterOptions = transform(trainingCenters?.results || [], {
    id: 'id',
    label: (center) => center.name,
    value: 'id'
  }) as Option[];

  const [formData, setFormData] = useState<{
    highschool_id: string;
    certificate_id: string;
    se_mark: string;
    date_of_obtention: number | '';
    formation_ids: string[];
    has_university_background: boolean;
  }>({
    highschool_id: data.step3?.highschool_id || '',
    certificate_id: data.step3?.certificate_id || '',
    se_mark: data.step3?.se_mark || '',
    date_of_obtention: data.step3?.date_of_obtention || currentYear,
    formation_ids: data.step3?.formation_ids || [],
    has_university_background: false
  });

  const [formErrors, setFormErrors] = useState<{
    highschool_id?: string;
    certificate_id?: string;
    se_mark?: string;
    date_of_obtention?: string;
  }>({});

  const hasMountedRef = useRef(false);
  const highschoolFieldRef = useRef<HTMLDivElement>(null);
  const certificateFieldRef = useRef<HTMLDivElement>(null);
  const seMarkInputRef = useRef<HTMLInputElement>(null);
  const yearInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const term = trainingSearchInput.trim();
    if (term.length > 0 && term.length < 2) return;
    const handler = setTimeout(() => {
      setTrainingSearch(term);
    }, 400);
    return () => clearTimeout(handler);
  }, [trainingSearchInput]);

  const validateForm = (values: typeof formData) => {
    const errors: {
      highschool_id?: string;
      certificate_id?: string;
      se_mark?: string;
      date_of_obtention?: string;
    } = {};

    if (!values.highschool_id) {
      errors.highschool_id = 'Veuillez sélectionner un lycée.';
    }

    if (!values.certificate_id) {
      errors.certificate_id = 'Veuillez sélectionner un certificat.';
    }

    const seMarkValue = values.se_mark.trim();
    if (seMarkValue) {
      const seMarkPattern = /^\d+(\.\d{1,2})?$/;
      const parsedMark = Number(seMarkValue);
      if (!seMarkPattern.test(seMarkValue) || Number.isNaN(parsedMark)) {
        errors.se_mark = 'La note SE doit être un nombre valide (ex: 15.5).';
      } else if (parsedMark < 0 || parsedMark > 100) {
        errors.se_mark = 'La note SE doit être comprise entre 0 et 100.';
      }
    }

    if (values.date_of_obtention === '' || Number.isNaN(values.date_of_obtention)) {
      errors.date_of_obtention = "L'année d'obtention est obligatoire.";
    } else if (values.date_of_obtention < minYear || values.date_of_obtention > currentYear) {
      errors.date_of_obtention = `L'année d'obtention doit être entre ${minYear} et ${currentYear}.`;
    }

    return errors;
  };

  const focusFirstInvalidField = (errors: typeof formErrors) => {
    if (errors.highschool_id) {
      highschoolFieldRef.current?.focus();
      highschoolFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (errors.certificate_id) {
      certificateFieldRef.current?.focus();
      certificateFieldRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (errors.se_mark) {
      seMarkInputRef.current?.focus();
      return;
    }

    if (errors.date_of_obtention) {
      yearInputRef.current?.focus();
    }
  };

  useEffect(() => {
    if (!onAutoSave) return;
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    const handler = setTimeout(() => {
      onAutoSave(formData);
    }, 450);

    return () => clearTimeout(handler);
  }, [formData, onAutoSave]);

  useEffect(() => {
    if (!formData.certificate_id) return;
    if (!selectedSection) return;

    const certificateIds = new Set((certificates?.results || []).map((item) => item.id));
    if (!certificateIds.has(formData.certificate_id)) {
      setFormData((prev) => ({ ...prev, certificate_id: '' }));
      setFormErrors((prev) => ({
        ...prev,
        certificate_id: 'Le certificat a été réinitialisé car il ne correspond plus à la section choisie.'
      }));
    }
  }, [selectedSection, certificates?.results, formData.certificate_id]);

  const highSchoolOptions = transform(highschools?.results || [], {
    id: "id",
    label: (u) => `${u.hs_name}(${u.zone.zone_name})`,
    value: "id"
  }) as Option[];

  const certificatesOptions = transform(certificates?.results || [], {
    id: "id",
    label: (u) => `${u.certificate_name}-${u.section.section_name}`,
    value: "id"
  }) as Option[];

  const sectionsOptions = transform(sections?.results || [], {
    id: "section_name",
    label: "section_name",
    value: "section_name"
  }) as Option[];


  const handleTrainingToggle = (trainingId: string) => {
    const updatedFormations = formData.formation_ids.includes(trainingId)
      ? formData.formation_ids.filter(id => id !== trainingId)
      : [...formData.formation_ids, trainingId];

    const newData = { ...formData, formation_ids: updatedFormations };
    setFormData(newData);
  };

  const handleSelectAllTrainings = () => {
    const allTrainingIds = trainings.map((training) => training.id);
    const newData = { ...formData, formation_ids: allTrainingIds };
    setFormData(newData);
  };

  const handleClearAllTrainings = () => {
    const newData = { ...formData, formation_ids: [] };
    setFormData(newData);
  };

  const handleCreateTraining = async () => {
    const domaine = newTrainingData.domaine.trim();
    const certificate = newTrainingData.certificate.trim();
    const trainingCenterId = newTrainingData.training_center;

    if (!domaine || !trainingCenterId) {
      notify.error('Le domaine et le centre de formation sont obligatoires.');
      return;
    }

    setIsCreatingTraining(true);
    try {
      const createdTraining = await createTrainingApi({
        domaine,
        certificate: certificate || 'Non précisé',
        training_center: trainingCenterId,
      });

      const alreadySelected = formData.formation_ids.includes(createdTraining.id);
      const updatedFormationIds = alreadySelected
        ? formData.formation_ids
        : [...formData.formation_ids, createdTraining.id];

      const newData = { ...formData, formation_ids: updatedFormationIds };
      setFormData(newData);

      await refetchTrainings();
      setShowCreateTrainingForm(false);
      setNewTrainingData({ domaine: '', certificate: '', training_center: '' });
      notify.success('Formation créée et ajoutée avec succès.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      notify.error(message || 'Erreur lors de la création de la formation');
    } finally {
      setIsCreatingTraining(false);
    }
  };

  const resetCreateTrainingState = () => {
    setShowCreateTrainingForm(false);
    setNewTrainingData({ domaine: '', certificate: '', training_center: '' });
  };

  const handleCancelCreateTraining = () => {
    if (!hasUnsavedTrainingCreation) {
      resetCreateTrainingState();
      return;
    }

    setIsCancelCreateTrainingConfirmOpen(true);
  };

  const handlePreviousClick = () => {
    if (showCreateTrainingForm && hasUnsavedTrainingCreation) {
      setIsBackConfirmOpen(true);
      return;
    }

    onPrevious?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      focusFirstInvalidField(errors);
      return;
    }

    const studentId = data.step2?.student_id;

    if (!studentId) {
      notify.error('Étudiant non trouvé. Veuillez recommencer.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createStudentHsInfoApi({
        student: studentId,
        highschool: formData.highschool_id,
        certificate: formData.certificate_id,
        se_mark: formData.se_mark,
        date_of_obtention: Number(formData.date_of_obtention),
        formation_ids: formData.formation_ids
      });

      onNext({
        highschool_id: formData.highschool_id,
        certificate_id: formData.certificate_id,
        se_mark: formData.se_mark,
        date_of_obtention: formData.date_of_obtention,
        formation_ids: formData.formation_ids,
        has_university_background: formData.has_university_background
      });
      notify.success('Informations du lycée enregistrées');
    } catch {
      notify.error('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <fieldset disabled={isSubmitting} className="space-y-0 border-0 p-0 m-0 min-w-0">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations du Lycée</h3> 
         <div ref={highschoolFieldRef} tabIndex={-1}>
         <SingleSelectDropdown
            value={formData.highschool_id}
            onChange={(e) => {
              const newData = { ...formData, highschool_id: e };
              setFormData(newData);
              if (formErrors.highschool_id) {
                setFormErrors((prev) => ({ ...prev, highschool_id: undefined }));
              }
            }}
            isSearching={highschoolsLoading}
            isLocalSearch={false}
            onSearchChange={setSearchHighschool}
            required
            disabled={isSubmitting}
            options={highSchoolOptions}
            label='Lycée' />
            {formErrors.highschool_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {formErrors.highschool_id}
              </p>
            )}
         </div>
        <FormGroup>
          <SingleSelectDropdown
            value={selectedSection}
            onChange={(value) => {
              setSelectedSection(value);
            }}
            isSearching={sectionLoading}
            isLocalSearch={false}
            onSearchChange={setSearchSection}
            required={false}
            disabled={isSubmitting}
            options={sectionsOptions}
            label='Sections' />
          <div ref={certificateFieldRef} tabIndex={-1}>
          <SingleSelectDropdown
            value={formData.certificate_id}
            onChange={(e) => {
              const newData = { ...formData, certificate_id: e };
              setFormData(newData);
              if (formErrors.certificate_id) {
                setFormErrors((prev) => ({ ...prev, certificate_id: undefined }));
              }
            }}
            required
            isSearching={certificatesLoading}
            isLocalSearch={false}
            onSearchChange={setSearchCertificates}
            disabled={isSubmitting}
            options={certificatesOptions}
            label='Certificat' />
            {formErrors.certificate_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {formErrors.certificate_id}
              </p>
            )}
          </div>
        </FormGroup>
        <FormGroup>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Note SE
            </label>
            <Input type="text"
              id="se-mark"
              aria-invalid={Boolean(formErrors.se_mark)}
              aria-describedby={formErrors.se_mark ? 'se-mark-error' : undefined}
              ref={seMarkInputRef}
              placeholder="Ex: 15.5"
              value={formData.se_mark}
              onChange={(e) => {
                const newData = { ...formData, se_mark: e.target.value };
                setFormData(newData);
                if (formErrors.se_mark) {
                  setFormErrors((prev) => ({ ...prev, se_mark: undefined }));
                }
              }} />
            {formErrors.se_mark && (
              <p id="se-mark-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {formErrors.se_mark}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Année d'obtention *</label>
            <Input
              type="number"
              id="year-obtention"
              aria-invalid={Boolean(formErrors.date_of_obtention)}
              aria-describedby={formErrors.date_of_obtention ? 'year-obtention-error' : undefined}
              ref={yearInputRef}
              min={minYear}
              max={currentYear}
              value={formData.date_of_obtention}
              onChange={(e) => {
                const rawValue = e.target.value.trim();
                if (rawValue === '') {
                  setFormData({ ...formData, date_of_obtention: '' });
                  return;
                }

                const parsed = Number(rawValue);
                if (Number.isNaN(parsed)) {
                  setFormData({ ...formData, date_of_obtention: '' });
                  return;
                }

                const newData = { ...formData, date_of_obtention: parsed };
                setFormData(newData);
                if (formErrors.date_of_obtention) {
                  setFormErrors((prev) => ({ ...prev, date_of_obtention: undefined }));
                }
              }}
              required
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
            {formErrors.date_of_obtention && (
              <p id="year-obtention-error" className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {formErrors.date_of_obtention}
              </p>
            )}
          </div>

        </FormGroup>



        {/* Formations */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900/40 p-4  space-y-3 my-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                Formations suivies
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Sélectionnez les formations déjà suivies par l'étudiant.
              </p>
            </div>
            {formData.formation_ids.length > 0 && (
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
                {formData.formation_ids.length} sélectionné(s)
              </span>
            )}
          </div>
          <div>
            <div className="relative mb-2">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Rechercher une formation..."
                value={trainingSearchInput}
                onChange={(e) => setTrainingSearchInput(e.target.value)}
                disabled={isSubmitting || isCreatingTraining}
                className="w-full pl-9"
              />
            </div>

            <div className="mb-2 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSelectAllTrainings}
                disabled={isSubmitting || trainings.length === 0}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Tout sélectionner
              </button>
              <button
                type="button"
                onClick={handleClearAllTrainings}
                disabled={isSubmitting || formData.formation_ids.length === 0}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Tout désélectionner
              </button>
            </div>

            <div className="mb-3">
              {!showCreateTrainingForm ? (
                <button
                  type="button"
                  onClick={() => setShowCreateTrainingForm(true)}
                  disabled={isSubmitting}
                  className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  + Formation non trouvée ? Créer une nouvelle formation
                </button>
              ) : (
                <div className="space-y-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900/30">
                  <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200">Nouvelle formation</h5>
                  <FormGroup columns={2}>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Domaine *</label>
                      <Input
                        type="text"
                        placeholder="Ex: Informatique"
                        value={newTrainingData.domaine}
                        onChange={(e) => setNewTrainingData((prev) => ({ ...prev, domaine: e.target.value }))}
                      />
                    </div>
                    <div>
                      <SingleSelectDropdown
                        label="Centre de formation"
                        value={newTrainingData.training_center}
                        onChange={(value) => setNewTrainingData((prev) => ({ ...prev, training_center: value }))}
                        options={trainingCenterOptions}
                        isSearching={trainingCentersLoading}
                        isLocalSearch={false}
                        onSearchChange={setSearchTrainingCenter}
                        placeholder="Sélectionner un centre"
                        searchPlaceholder="Rechercher un centre..."
                        required
                        disabled={isCreatingTraining || isSubmitting}
                      />
                    </div>
                  </FormGroup>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Certificat (optionnel)</label>
                    <Input
                      type="text"
                      placeholder="Ex: Certificat A2"
                      value={newTrainingData.certificate}
                      onChange={(e) => setNewTrainingData((prev) => ({ ...prev, certificate: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCreateTraining}
                      disabled={isCreatingTraining || isSubmitting}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isCreatingTraining ? 'Création...' : 'Créer la formation'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelCreateTraining}
                      disabled={isCreatingTraining || isSubmitting}
                      className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </div>

            {trainingsFetching ? (
              <div className="text-sm text-gray-500 text-center">
                Recherche en cours...
              </div>
            ) : trainings.length === 0 ? (
              <div className="text-sm text-gray-500 text-center">
                {trainingSearch.trim().length > 0
                  ? 'Aucune formation ne correspond à votre recherche.'
                  : 'Aucune formation disponible pour le moment.'}
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50/70 dark:bg-gray-800/60 divide-y divide-gray-200 dark:divide-gray-700">
                {trainings.map((training) => {
                  const checked = formData.formation_ids.includes(training.id);
                  return (
                    <button
                      key={training.id}
                      type="button"
                      onClick={() => handleTrainingToggle(training.id)}
                      disabled={isSubmitting}
                      className={`w-full px-3 py-2 flex items-center justify-between text-left transition-colors ${checked
                        ? 'bg-blue-50/80 dark:bg-blue-900/20'
                        : 'hover:bg-gray-100/70 dark:hover:bg-gray-700/50'
                        } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                      aria-pressed={checked}
                    >
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {training.domaine || 'Formation'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {training.certificate || 'Certificat non précisé'}
                        </div>
                      </div>
                      <div className={`w-4 h-4 border-2 flex items-center justify-center transition-all ${checked
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 dark:border-gray-600'
                        }`}>
                        {checked && <div className="w-2 h-2 bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* University Background */}
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Toggle
            checked={formData.has_university_background}
            onChange={(checked) => {
              const newData = { ...formData, has_university_background: checked };
              setFormData(newData);
            }}
            disabled={isSubmitting}
            label="L'étudiant a déjà un parcours universitaire"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 ml-14">
            Cochez cette case si l'étudiant a déjà étudié dans une université
          </p>
        </div>
      </div>
      </fieldset>

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
          disabled={isSubmitting || !formData.highschool_id || !formData.certificate_id}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isSubmitting ? 'Enregistrement...' : 'Suivant'}
        </button>
      </div>

      <AlertDialog open={isBackConfirmOpen} onOpenChange={setIsBackConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter cette étape ?</AlertDialogTitle>
            <AlertDialogDescription>
              Une création de formation est en cours. Revenir en arrière fera perdre les informations non enregistrées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rester ici</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsBackConfirmOpen(false);
                resetCreateTrainingState();
                onPrevious?.();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Quitter et perdre les données
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isCancelCreateTrainingConfirmOpen} onOpenChange={setIsCancelCreateTrainingConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler la création de formation ?</AlertDialogTitle>
            <AlertDialogDescription>
              Les données saisies pour la nouvelle formation seront perdues.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continuer l'édition</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setIsCancelCreateTrainingConfirmOpen(false);
                resetCreateTrainingState();
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Annuler la création
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
