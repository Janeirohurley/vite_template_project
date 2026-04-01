/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, type ReactNode } from 'react';
import type { InscriptionStepProps } from '../../../../types/inscription.d';
import {
  useAcademicYears,
  useClasses,
  useClassesById,
  useTrainings,
  useCountries,
  useUniversities,
  useFaculties,
  useDepartmentsByFaculty,
  useUniversityDegrees,
  useHighschoolsById,
  useCertificatesById
} from '../../../../api/inscription';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import { transform } from '@/components/common/transformAny';
import { DebugDisplay } from '@/components/common/DebugDisplay';
import { FormGroup } from '@/components/ui/FormGroup';
import { createInscriptionApi } from '../../api/studentServiceApi';
import { notify } from '../../../../lib';

export function Step5FinalInscription({ data, onNext, onPrevious, onAutoSave }: InscriptionStepProps) {
  const [backendSearchClasses, setBackendSearchClasses] = useState("");
  const { data: academicYears = [], isLoading: academicYearsLoading } = useAcademicYears();
  const { data: classes = [], isLoading: classesLoading } = useClasses({ search: backendSearchClasses });
  const { data: highschools } = useHighschoolsById(data.step3?.highschool_id || "");
  const { data: certificates } = useCertificatesById(data.step3?.certificate_id || "");
  const { data: trainings = [] } = useTrainings({ pagination: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdInscriptionId, setCreatedInscriptionId] = useState<string | null>((data.step5 as any)?.inscription_id || null);

  const [formData, setFormData] = useState({
    academic_year_id: data.step5?.academic_year_id || '',
    class_fk_id: data.step5?.class_fk_id || '',
    date_inscription: data.step5?.date_inscription || new Date().toISOString().split('T')[0]
  });
  const { data: selectedClassById } = useClassesById(formData.class_fk_id);

  const academicYearOptions = useMemo(() => transform(academicYears, {
    id: "id",
    label: (year) => `${year.civil_year} ${!year.is_closed ? '(Active)' : 'Inactive'}`,
    value: "id"
  }) as Option[], [academicYears]);

  const classOptions = useMemo(() => transform(classes, {
    id: "id",
    label: (cls) => `${cls.class_name} - ${cls.department?.department_name} - ${cls.department?.faculty?.faculty_abreviation}`,
    value: "id"
  }) as Option[], [classes]);

  const parentTypeLabel = (type?: 'F' | 'M' | 'G') => {
    if (type === 'F') return 'Pere';
    if (type === 'M') return 'Mere';
    if (type === 'G') return 'Tuteur';
    return 'Parent';
  };

  const selectedAcademicYear = academicYears.find((year) => year.id === formData.academic_year_id);
  const selectedClass = selectedClassById?.id === formData.class_fk_id ? selectedClassById : undefined;

  const seMarkRaw = String(data.step3?.se_mark ?? '').trim();
  const seMarkMatch = seMarkRaw.replace(',', '.').match(/\d+(\.\d+)?/);
  const seMarkValue = seMarkMatch ? Number(seMarkMatch[0]) : null;

  const selectedClassFacultyCode = String(selectedClass?.department?.faculty?.types?.code || '').trim().toUpperCase();
  const selectedClassFacultyTypeName = String(selectedClass?.department?.faculty?.types?.name || '').trim().toUpperCase();
  const selectedClassName = String(selectedClass?.class_name || '').trim().toUpperCase();

  const isSelectedClassBac = [selectedClassFacultyCode, selectedClassFacultyTypeName, selectedClassName].some((value) => {
    if (!value) return false;
    return value === 'F' || value === 'BAC' || value.includes('BAC') || value.includes('BACC');
  });

  const hasClassNatureSignal = Boolean(selectedClassFacultyCode || selectedClassFacultyTypeName || selectedClassName);
  const isSelectedClassNonBac = Boolean(selectedClass) && hasClassNatureSignal && !isSelectedClassBac;
  const hasValidSeMark = seMarkValue !== null && !Number.isNaN(seMarkValue);
  const isSeRuleInvalid = hasValidSeMark && (
    (isSelectedClassBac && seMarkValue < 50)
    || (isSelectedClassNonBac && seMarkValue >= 50)
  );
  const seRuleErrorMessage = isSelectedClassBac
    ? 'Classe BAC : la note SE doit être supérieure ou égale à 50.'
    : 'Classe non-BAC : la note SE doit être inférieure à 50.';

  const selectedTrainings = useMemo(() => {
    const ids = data.step3?.formation_ids || [];
    if (ids.length == 0) return [];
    const trainingMap = new Map(trainings.map((t) => [t.id, t]));
    return ids.map((id) => {
      const training = trainingMap.get(id);
      if (!training) return { id, label: id };
      return { id, label: `${training.domaine} - ${training.certificate}` };
    });
  }, [data.step3?.formation_ids, trainings]);

  const userDisplay = data.step1?.user_display
    || (data.step1?.user_first_name || data.step1?.user_last_name
      ? `${data.step1?.user_first_name || ''} ${data.step1?.user_last_name || ''}`.trim()
      : undefined)
    || data.step1?.user_id;


  const ensureInscriptionCreated = async () => {
    if (createdInscriptionId) return createdInscriptionId;

    if (!formData.academic_year_id || !formData.class_fk_id) {
      notify.error("Veuillez renseigner l'année académique et la classe");
      return null;
    }

    if (isSeRuleInvalid) {
      notify.error(seRuleErrorMessage);
      return null;
    }

    const studentId = data.step2?.student_id;
    if (!studentId) {
      notify.error("ID de l'etudiant manquant");
      return null;
    }

    setIsSubmitting(true);
    try {
      const inscriptionData = {
        student: studentId,
        academic_year: formData.academic_year_id,
        class_fk_id: formData.class_fk_id,
        date_inscription: formData.date_inscription
      };

      const createdInscription = await createInscriptionApi(inscriptionData);
      const newInscriptionId = createdInscription?.id;

      if (!newInscriptionId) {
        notify.error("Impossible de récupérer l'identifiant de l'inscription créée");
        return null;
      }

      setCreatedInscriptionId(newInscriptionId);
      notify.success('Inscription creee avec succes!');

      return newInscriptionId;
    } catch (error: any) {
      console.error("Erreur lors de la creation de l'inscription:", error);
      notify.error(error?.message || "Erreur lors de la creation de l'inscription");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSeRuleInvalid) {
      notify.error(seRuleErrorMessage);
      return;
    }

    const inscriptionId = await ensureInscriptionCreated();
    if (!inscriptionId) return;

    onNext({
      academic_year_id: formData.academic_year_id,
      class_fk_id: formData.class_fk_id,
      date_inscription: formData.date_inscription,
      inscription_created: true,
      inscription_id: inscriptionId,
    });
  };

  if (academicYearsLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Inscription Finale</h3>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="grid grid-cols-3 gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Inscription Finale</h3>

        {/* Summary */}
        <div className="rounded-xl dark:border-gray-700 bg-white dark:bg-gray-900/40  mb-6">
          <h4 className="font-semibold">Resume de l'inscription</h4>
          <div className="grid grid-cols-1 gap-4 mt-3">
            <SummaryCard title="Utilisateur & Lieu de naissance">

              <SummaryRow
                label="Utilisateur"
                value={userDisplay || 'Non renseigne'}
              />
              <SummaryRow
                label="Email"
                value={data.step1?.user_email || 'Non renseigne'}
              />
              <SummaryRow
                label="Pays"
                value={data.step1?.country_name || data.step1?.country_id || 'Non renseigne'}
              />
              <SummaryRow
                label="Province"
                value={data.step1?.province_name || data.step1?.province_id || 'Non renseignee'}
              />
              <SummaryRow
                label="Commune"
                value={data.step1?.commune_name || data.step1?.commune_id || 'Non renseignee'}
              />
              <SummaryRow
                label="Zone"
                value={data.step1?.zone_name || data.step1?.zone_id || 'Non renseignee'}
              />
              <SummaryRow
                label="Colline"
                value={data.step1?.colline_name || data.step1?.colline_id || 'Non renseignee'}
              />
              <SummaryRow label="Numero CAM" value={data.step1?.cam ?? 'Non renseigne'} />


            </SummaryCard>

            <SummaryCard title="Parents / Tuteurs">
              {data.step2?.parents?.length ? (
                <div className="space-y-2">
                  {data.step2.parents.map((parent, index) => (
                    <div key={parent.id ?? index} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {parent.parent_name || 'Parent'}
                        </div>
                        {parent.parent_phone && (
                          <div className="text-xs text-gray-500">{parent.parent_phone}</div>
                        )}
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span className="text-xs px-2 py-0.5 rounded-md bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200">
                            {parentTypeLabel(parent.parent_type)}
                          </span>
                          {parent.is_contact_person && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200">
                              Contact
                            </span>
                          )}
                          {!parent.is_alive && (
                            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
                              Decede
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 ">Aucun parent selectionne.</div>
              )}
            </SummaryCard>

            <SummaryCard title="Lycee & Certificat">
              <SummaryRow
                label="Lycee"
                value={highschools ? `${highschools.hs_name} (${highschools.zone?.zone_name || 'Zone'})` : 'Non renseigne'}
              />
              <SummaryRow
                label="Certificat"
                value={certificates ? `${certificates.certificate_name} - ${certificates.section?.section_name}` : 'Non renseigne'}
              />
              <SummaryRow label="Note SE" value={data.step3?.se_mark || 'Non renseignee'} />
              <SummaryRow label="Annee d'obtention" value={data.step3?.date_of_obtention || 'Non renseignee'} />
            </SummaryCard>

            <SummaryCard title="Formations suivies">
              {selectedTrainings.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedTrainings.map((training) => (
                    <span
                      key={training.id}
                      className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200"
                    >
                      {training.label}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 ">Aucune formation selectionnee.</div>
              )}
            </SummaryCard>

            {data.step4 ? (
              <UniversitySummary step4={data.step4} />
            ) : (
              <SummaryCard title="Parcours universitaire">
                <div className="text-sm text-gray-500 ">Non renseigne.</div>
              </SummaryCard>
            )}

            <SummaryCard title="Inscription finale">
              <SummaryRow
                label="Annee academique"
                value={selectedAcademicYear ? `${selectedAcademicYear.civil_year} ${!selectedAcademicYear.is_closed ? '(Active)' : '(Inactive)'}` : (formData.academic_year_id || 'Non renseignee')}
              />
              <SummaryRow
                label="Classe"
                value={selectedClass ? `${selectedClass.class_name} - ${selectedClass.department?.department_name} - ${selectedClass.department?.faculty?.faculty_abreviation}` : (formData.class_fk_id || 'Non renseignee')}
              />
              <SummaryRow label="Date d'inscription" value={formData.date_inscription || 'Non renseignee'} />
            </SummaryCard>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormGroup columns={3}>
            <SingleSelectDropdown
              value={formData.academic_year_id}
              onChange={(value) => {
                const newData = { ...formData, academic_year_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={academicYearOptions}
              label="Annee Academique"
            />

            <SingleSelectDropdown
              value={formData.class_fk_id}
              onChange={(value) => {
                const newData = { ...formData, class_fk_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={classOptions}
              label="Classe"
              isSearching={classesLoading}
              onSearchChange={setBackendSearchClasses}
              isLocalSearch={false}
            />

            <CustomDatePicker
              value={formData.date_inscription}
              onChange={(date) => {
                const newData = { ...formData, date_inscription: date };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              label="Date d'inscription"
              required
            />

          </FormGroup>

          {isSeRuleInvalid && (
            <p className="text-sm text-red-600 dark:text-red-400" role="alert">
              {seRuleErrorMessage} (note actuelle: {seMarkRaw})
            </p>
          )}

          <DebugDisplay
            title="rule-debug"
            data={{
              classId: formData.class_fk_id || 'n/a',
              className: selectedClassName || 'n/a',
              facultyTypeCode: selectedClassFacultyCode || 'n/a',
              facultyTypeName: selectedClassFacultyTypeName || 'n/a',
              seRaw: seMarkRaw || 'n/a',
              seValue: seMarkValue ?? 'n/a',
              isBac: isSelectedClassBac,
              isNonBac: isSelectedClassNonBac,
              invalid: isSeRuleInvalid,
              selectedClass,
            }}
          />

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h5 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              Informations importantes
            </h5>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1 list-disc pl-5">
              <li>Le matricule sera genere automatiquement apres l'inscription</li>
              <li>L'inscription sera en statut "Pending" en attente de validation</li>
              <li>Une carte etudiant sera creee automatiquement</li>
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onPrevious}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Precedent
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.academic_year_id || !formData.class_fk_id || isSeRuleInvalid}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isSubmitting ? 'Traitement en cours...' : 'Suivant - Frais d\'inscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SummaryCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50/60 dark:bg-gray-800/50 p-3">
      <h5 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">{title}</h5>
      <div className="space-y-1 ml-2">{children}</div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="text-sm text-gray-700 dark:text-gray-300">
      <span className="font-medium text-gray-900 dark:text-gray-100">{label}:</span>{' '}
      <span className="text-gray-700 dark:text-gray-300">{value}</span>
    </div>
  );
}

function UniversitySummary({ step4 }: { step4: NonNullable<InscriptionStepProps['data']['step4']> }) {
  const { data: countries = [] } = useCountries();
  const { data: universities = [] } = useUniversities(step4.country_id);
  const { data: faculties = [] } = useFaculties(step4.university_id);
  const { data: departments = [] } = useDepartmentsByFaculty(step4.faculty_id);
  const { data: degrees = [] } = useUniversityDegrees();

  const country = countries.find((c) => c.id === step4.country_id);
  const university = universities.find((u) => u.id === step4.university_id);
  const faculty = faculties.find((f) => f.id === step4.faculty_id);
  const department = departments.find((d) => d.id === step4.department_id);
  const degree = degrees.find((d) => d.id === step4.degree_id);

  return (
    <SummaryCard title="Parcours universitaire">
      <SummaryRow label="Pays" value={country?.country_name || step4.country_id} />
      <SummaryRow label="Universite" value={university?.university_name || step4.university_id} />
      <SummaryRow label="Faculte" value={faculty?.faculty_name || step4.faculty_id} />
      <SummaryRow label="Departement" value={department?.department_name || step4.department_id} />
      <SummaryRow label="Diplome" value={degree?.degree_name || step4.degree_id} />
      <SummaryRow label="Mention" value={step4.mention} />
      <SummaryRow label="Option" value={step4.option || 'Non renseignee'} />
      <SummaryRow label="Annee d'obtention" value={step4.year_obtained || 'Non renseignee'} />
    </SummaryCard>
  );
}
