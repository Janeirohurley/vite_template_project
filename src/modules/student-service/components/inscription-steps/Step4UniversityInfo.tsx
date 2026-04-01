import { useState, useMemo } from 'react';
import type { InscriptionStepProps } from '../../../../types/inscription.d';
import { useCountries, useUniversities, useFaculties, useDepartmentsByFaculty, useUniversityDegrees } from '../../../../api/inscription';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import { Input } from '@/components/ui/input';
import { FormGroup } from '@/components/ui/FormGroup';
import { transform } from '@/components/common/transformAny';

export function Step4UniversityInfo({ data, onNext, onPrevious, onAutoSave, }: InscriptionStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    country_id: data.step4?.country_id || '',
    university_id: data.step4?.university_id || '',
    faculty_id: data.step4?.faculty_id || '',
    department_id: data.step4?.department_id || '',
    option: data.step4?.option || '',
    mention: data.step4?.mention || '',
    degree_id: data.step4?.degree_id || '',
    year_obtained: data.step4?.year_obtained || undefined
  });

  // Chargement des données avec dépendances en cascade
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const { data: universities = [], isLoading: universitiesLoading } = useUniversities(formData.country_id);
  const { data: faculties = [], isLoading: facultiesLoading } = useFaculties(formData.university_id);
  const { data: departments = [], isLoading: departmentsLoading } = useDepartmentsByFaculty(formData.faculty_id);
  const { data: degrees = [], isLoading: degreesLoading } = useUniversityDegrees();

  // Note: Les champs dépendants sont gérés dans les handlers onChange pour éviter les boucles infinies

  // Transformation des données en options pour les dropdowns
  const countryOptions = useMemo(() => transform(countries, {
    id: "id",
    label: "country_name",
    value: "id"
  }) as Option[], [countries]);

  const universityOptions = useMemo(() => transform(universities, {
    id: "id",
    label: "university_name",
    value: "id"
  }) as Option[], [universities]);

  const facultyOptions = useMemo(() => transform(faculties, {
    id: "id",
    label: "faculty_name",
    value: "id"
  }) as Option[], [faculties]);

  const departmentOptions = useMemo(() => transform(departments, {
    id: "id",
    label: "department_name",
    value: "id"
  }) as Option[], [departments]);

  const degreeOptions = useMemo(() => transform(degrees, {
    id: "id",
    label: "degree_name",
    value: "id"
  }) as Option[], [degrees]);

  const mentionOptions: Option[] = [
    { id: 'Passable', label: 'Passable', value: 'Passable' },
    { id: 'Assez Bien', label: 'Assez Bien', value: 'Assez Bien' },
    { id: 'Bien', label: 'Bien', value: 'Bien' },
    { id: 'Très Bien', label: 'Très Bien', value: 'Très Bien' },
    { id: 'Excellent', label: 'Excellent', value: 'Excellent' }
  ];



  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country_id || !formData.university_id || !formData.faculty_id || !formData.department_id || !formData.mention || !formData.degree_id) return;

    setIsSubmitting(true);
    try {
      onNext({
        country_id: formData.country_id,
        university_id: formData.university_id,
        faculty_id: formData.faculty_id,
        department_id: formData.department_id,
        option: formData.option,
        mention: formData.mention,
        degree_id: formData.degree_id,
        year_obtained: formData.year_obtained
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onNext(null); // Skip this step
  };

  if (countriesLoading || degreesLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-4">Informations Universitaires Antérieures</h3>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informations Universitaires Antérieures</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Cette étape concerne les étudiants ayant déjà un parcours universitaire.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pays et Université */}
          <FormGroup columns={2}>
            <SingleSelectDropdown
              value={formData.country_id}
              onChange={(value) => {
                const newData = { ...formData, country_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={countryOptions}
              label="Pays où vous avez étudié"
              placeholder="Sélectionner un pays"
            />

            <SingleSelectDropdown
              value={formData.university_id}
              onChange={(value) => {
                const newData = { ...formData, university_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={universityOptions}
              label="Université"
              placeholder={formData.country_id ? "Sélectionner une université" : "Sélectionnez d'abord un pays"}
              disabled={!formData.country_id || universitiesLoading}
            />
          </FormGroup>

          {/* Faculté et Département */}
          <FormGroup columns={2}>
            <SingleSelectDropdown
              value={formData.faculty_id}
              onChange={(value) => {
                const newData = { ...formData, faculty_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={facultyOptions}
              label="Faculté"
              placeholder={formData.university_id ? "Sélectionner une faculté" : "Sélectionnez d'abord une université"}
              disabled={!formData.university_id || facultiesLoading}
            />

            <SingleSelectDropdown
              value={formData.department_id}
              onChange={(value) => {
                const newData = { ...formData, department_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={departmentOptions}
              label="Département"
              placeholder={formData.faculty_id ? "Sélectionner un département" : "Sélectionnez d'abord une faculté"}
              disabled={!formData.faculty_id || departmentsLoading}
            />
          </FormGroup>

          {/* Option et Mention */}
          <FormGroup columns={2}>
            <div>
              <span className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Option</span>
              <Input
                type="text"
                placeholder="Ex: Développement Web, Réseaux (optionnel)"
                value={formData.option}
                onChange={(e) => {
                  const newData = { ...formData, option: e.target.value };
                  setFormData(newData);
                  onAutoSave?.(newData);
                }}
              />
            </div>

            <SingleSelectDropdown
              value={formData.mention}
              onChange={(value) => {
                const newData = { ...formData, mention: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={mentionOptions}
              label="Mention obtenue"
              placeholder="Sélectionner une mention"
            />
          </FormGroup>

          {/* Diplôme et Année */}
          <FormGroup columns={2}>
            <SingleSelectDropdown
              value={formData.degree_id}
              onChange={(value) => {
                const newData = { ...formData, degree_id: value };
                setFormData(newData);
                onAutoSave?.(newData);
              }}
              required
              options={degreeOptions}
              label="Diplôme obtenu"
              placeholder="Sélectionner un diplôme"
            />

            <div>
              <span className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Année d'obtention (optionnel)</span>
              <Input
                type="number"
                placeholder="Ex: 2023"
                value={formData.year_obtained || ''}
                onChange={(e) => {
                  const newData = { ...formData, year_obtained: e.target.value ? parseInt(e.target.value) : undefined };
                  setFormData(newData);
                  onAutoSave?.(newData);
                }}
                min={1950}
                max={new Date().getFullYear()}
              />
            </div>
          </FormGroup>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onPrevious}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Précédent
            </button>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSkip}
                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                Passer cette étape
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !formData.country_id || !formData.university_id || !formData.faculty_id || !formData.department_id || !formData.mention || !formData.degree_id}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isSubmitting ? 'Chargement...' : 'Suivant'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}