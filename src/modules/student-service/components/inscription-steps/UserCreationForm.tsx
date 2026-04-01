/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../../../components/ui/input';
import { SingleSelectDropdown } from '../../../../components/ui/SingleSelectDropdown';
import { CustomDatePicker } from '../../../../components/ui/CustomDatePicker';
import { FormGroup } from '../../../../components/ui/FormGroup';
import { useCountries, getProvincesByCountry, getCommunesByProvince, getZonesByCommune, getCollinesByZone } from '../../../../api/geo';
import { notify } from '../../../../lib';
import { createUserApi, type CreateUserData } from '../../api/studentServiceApi';

interface UserCreationData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender?: string;
  phone_number?: string;
  birth_date?: string;
  nationality?: string;
  marital_status?: string;
  residence: string[]
}

interface UserCreationFormProps {
  onUserCreated: (userId: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserCreationForm({ onUserCreated, onCancel, isLoading }: UserCreationFormProps) {
  const { data: countries = [] } = useCountries();
  const [formData, setFormData] = useState<UserCreationData>({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    phone_number: '',
    birth_date: '',
    nationality: '',
    marital_status: '',
    residence: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedColline, setSelectedColline] = useState('');

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password, confirmPassword: password }));
    notify.success('Mot de passe généré automatiquement');
  };

  const genderOptions = [
    { id: 'M', label: 'Homme' },
    { id: 'F', label: 'Femme' },
    { id: 'O', label: 'Autre' }
  ];

  const maritalStatusOptions = [
    { id: 'S', label: 'Célibataire' },
    { id: 'M', label: 'Marié(e)' },
    { id: 'D', label: 'Divorcé(e)' },
    { id: 'W', label: 'Veuf/Veuve' }
  ];

  const provinces = getProvincesByCountry(countries, selectedCountry);
  const communes = getCommunesByProvince(countries, selectedCountry, selectedProvince);
  const zones = getZonesByCommune(countries, selectedCountry, selectedProvince, selectedCommune);
  const collines = getCollinesByZone(countries, selectedCountry, selectedProvince, selectedCommune, selectedZone);

  const countryOptions = countries.map(country => ({
    id: country.id,
    label: country.country_name
  }));

  const provinceOptions = provinces.map(province => ({
    id: province.id,
    label: province.province_name
  }));

  const communeOptions = communes.map(commune => ({
    id: commune.id,
    label: commune.commune_name
  }));

  const zoneOptions = zones.map(zone => ({
    id: zone.id,
    label: zone.zone_name
  }));

  const collineOptions = collines.map(colline => ({
    id: colline.id,
    label: colline.colline_name
  }));

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est requis';
    }
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setCreating(true);
    try {
      const userData: CreateUserData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender || null,
        phone_number: formData.phone_number || null,
        birth_date: formData.birth_date || null,
        nationality: formData.nationality || null,
        marital_status: formData.marital_status || null,
        email_verified: false,
        role: null,
        residence_ids: selectedColline ? [selectedColline] : []
      };

      const user = await createUserApi(userData);
      notify.success('Compte créé avec succès!');
      onUserCreated(String(user.id) || user.email);
    } catch (error: any) {
      console.error('User creation error:', error);
      if (error.response?.data) {
        const { errors, message } = error.response.data;
        if (errors === 'EmailAlreadyExists' || message === 'Email already exists') {
          setErrors({ email: 'Cet email est déjà utilisé' });
          notify.error('Cet email est déjà utilisé');
        } else if (typeof errors === 'object') {
          setErrors(errors);
          notify.error('Erreur de validation');
        } else {
          setErrors({ general: message || 'Erreur lors de la création du compte' });
          notify.error(message || 'Erreur lors de la création du compte');
        }
      } else {
        setErrors({ general: 'Erreur lors de la création du compte' });
        notify.error('Erreur lors de la création du compte');
      }
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (field: keyof UserCreationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <h4 className="text-lg font-semibold mb-4">Créer un nouveau compte utilisateur</h4>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        <FormGroup columns={2}>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Prénom *
            </label>
            <Input
              type="text"
              placeholder="Prénom"
              value={formData.first_name}
              onChange={(e) => handleChange('first_name', e.target.value)}
              className={errors.first_name ? 'border-red-500' : ''}
            />
            {errors.first_name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Nom *
            </label>
            <Input
              type="text"
              placeholder="Nom"
              value={formData.last_name}
              onChange={(e) => handleChange('last_name', e.target.value)}
              className={errors.last_name ? 'border-red-500' : ''}
              required
            />
            {errors.last_name && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.last_name}</p>
            )}
          </div>
        </FormGroup>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Email *
          </label>
          <Input
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        <FormGroup columns={2}>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mot de passe *
              </label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:hover:bg-blue-900/50"
              >
                Générer
              </button>
            </div>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                required
                disabled
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </FormGroup>

        <FormGroup columns={3}>
          <SingleSelectDropdown
            options={genderOptions}
            value={formData.gender}
            onChange={(value) => handleChange('gender', value)}
            label="Genre"
            placeholder="Sélectionner"
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Téléphone
            </label>
            <Input
              type="tel"
              placeholder="+25761234567"
              value={formData.phone_number}
              onChange={(e) => handleChange('phone_number', e.target.value)}
            />
          </div>

          <CustomDatePicker
            value={formData.birth_date}
            onChange={(value) => handleChange('birth_date', value)}
            label="Date de naissance"
            placeholder="Sélectionner une date"
          />
        </FormGroup>

        <FormGroup columns={3}>
          <SingleSelectDropdown
            options={countryOptions}
            value={formData.nationality}
            onChange={(value) => handleChange('nationality', value)}
            label="Nationalité"
            placeholder="Sélectionner un pays"
            required
          />

          <SingleSelectDropdown
            options={maritalStatusOptions}
            value={formData.marital_status}
            onChange={(value) => handleChange('marital_status', value)}
            label="État civil"
            placeholder="Sélectionner"
            required
          />
        </FormGroup>

        <div className="space-y-4">
          <h5 className="text-md font-medium text-gray-700 dark:text-gray-300">Résidence actuelle</h5>
          
          <FormGroup columns={2}>
            <SingleSelectDropdown
              options={countryOptions}
              value={selectedCountry}
              onChange={(value) => {
                setSelectedCountry(value);
                setSelectedProvince('');
                setSelectedCommune('');
                setSelectedZone('');
                setSelectedColline('');
              }}
              label="Pays"
              placeholder="Sélectionner un pays"
            />
            
            <SingleSelectDropdown
              options={provinceOptions}
              value={selectedProvince}
              onChange={(value) => {
                setSelectedProvince(value);
                setSelectedCommune('');
                setSelectedZone('');
                setSelectedColline('');
              }}
              label="Province"
              placeholder="Sélectionner une province"
              disabled={!selectedCountry}
            />
          </FormGroup>

          <FormGroup columns={3}>
            <SingleSelectDropdown
              options={communeOptions}
              value={selectedCommune}
              onChange={(value) => {
                setSelectedCommune(value);
                setSelectedZone('');
                setSelectedColline('');
              }}
              label="Commune"
              placeholder="Sélectionner une commune"
              disabled={!selectedProvince}
            />
            
            <SingleSelectDropdown
              options={zoneOptions}
              value={selectedZone}
              onChange={(value) => {
                setSelectedZone(value);
                setSelectedColline('');
              }}
              label="Zone"
              placeholder="Sélectionner une zone"
              disabled={!selectedCommune}
            />
            
            <SingleSelectDropdown
              options={collineOptions}
              value={selectedColline}
              onChange={setSelectedColline}
              label="Colline"
              placeholder="Sélectionner une colline"
              disabled={!selectedZone}
            />
          </FormGroup>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-2">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            💡 Un compte sera créé avec ces informations. L'utilisateur pourra se connecter avec son email et mot de passe, puis vérifier son email et configurer son profil.
          </p>
        </div>
      </form>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={creating || isLoading}
          className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {creating ? 'Création...' : 'Créer'}
        </button>
      </div>
    </div>
  );
}