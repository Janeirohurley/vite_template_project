import { useState, useEffect } from 'react';
import { FormGroup } from '@/components/ui/FormGroup';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import { useCountries, getProvincesByCountry, getCommunesByProvince, getZonesByCommune, getCollinesByZone } from '@/api/geo';
import type { UserCreationDraft } from '@/lib/userCreationDB';
import { UserCreationForm } from '@/modules/student-service/components/inscription-steps/UserCreationForm';
import { useUsers } from '@/api/inscription';
import { transform } from '@/components/common/transformAny';
import { cn } from '@/lib/utils';

interface Step1UserInfoProps {
  data: Partial<UserCreationDraft>;
  onNext: (data: UserCreationDraft['userData']) => void;
  onAutoSave: (data: UserCreationDraft['userData']) => void;
}

export function Step1UserInfo({ data, onNext, onAutoSave }: Step1UserInfoProps) {
  const { data: users = [], refetch: refetchUsers, isLoading: usersLoading } = useUsers({pagination: false});
  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedColline, setSelectedColline] = useState('');
  const [showUserCreation, setShowUserCreation] = useState(false);

  // Load persisted data
  useEffect(() => {
    if (data.userData) {
      setSelectedUser(data.userData.id || '');
      setSelectedColline(data.userData.place_of_birth || '');

      // Find and set geographic hierarchy from place_of_birth (colline_id)
      if (data.userData.place_of_birth && countries.length > 0) {
        for (const country of countries) {
          for (const province of country.provinces || []) {
            for (const commune of province.communes || []) {
              for (const zone of commune.zones || []) {
                const colline = zone.collines?.find(c => c.id === data.userData?.place_of_birth);
                if (colline) {
                  setSelectedCountry(country.id);
                  setSelectedProvince(province.id);
                  setSelectedCommune(commune.id);
                  setSelectedZone(zone.id);
                  return;
                }
              }
            }
          }
        }
      }
    }
  }, [data.userData, countries]);

  // Extract nested data from countries
  const provinces = getProvincesByCountry(countries, selectedCountry);
  const communes = getCommunesByProvince(countries, selectedCountry, selectedProvince);
  const zones = getZonesByCommune(countries, selectedCountry, selectedProvince, selectedCommune);
  const collines = getCollinesByZone(countries, selectedCountry, selectedProvince, selectedCommune, selectedZone);

  // transformation
  const userOptions = transform(users, {
    id: "id",
    label: (u) => `${u.first_name} ${u.last_name} (${u.email})`,
    value: "id"
  }) as Option[];

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

  const handleCountryChange = (countryId: string) => {
    setSelectedCountry(countryId);
    setSelectedProvince('');
    setSelectedCommune('');
    setSelectedZone('');
    setSelectedColline('');
  };

  const handleProvinceChange = (provinceId: string) => {
    setSelectedProvince(provinceId);
    setSelectedCommune('');
    setSelectedZone('');
    setSelectedColline('');
  };

  const handleCommuneChange = (communeId: string) => {
    setSelectedCommune(communeId);
    setSelectedZone('');
    setSelectedColline('');
  };

  const handleZoneChange = (zoneId: string) => {
    setSelectedZone(zoneId);
    setSelectedColline('');
  };

  const handleUserCreated = (userId: string) => {
    setSelectedUser(userId);
    setShowUserCreation(false);
    refetchUsers();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedColline) return;

    setIsSubmitting(true);
    try {
      onNext({
        id: selectedUser,
        first_name: selectedUser,
        place_of_birth: selectedColline,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (usersLoading || countriesLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold mb-6">Sélection de l'utilisateur</h3>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
          </div>
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-6">Sélection de l'utilisateur</h3>

        <div className="space-y-6">
          <div>
            <SingleSelectDropdown
              options={userOptions}
              value={selectedUser}
              onChange={(value) => {
                setSelectedUser(value);
                if (value && selectedColline) {
                  onAutoSave?.({
                    id: value,
                    first_name: value,
                    place_of_birth: selectedColline,
                  });
                }
              }}
              label="Utilisateur"
              placeholder="Sélectionner un utilisateur"
              searchPlaceholder="Rechercher par nom ou email..."
              required
              disabled={showUserCreation}
            />

            <div className={cn(
              "mt-2",
              selectedUser ? "hidden" : ""
            )}>
              <button
                type="button"
                onClick={() => setShowUserCreation(true)}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
              >
                + L'utilisateur n'existe pas ? Créer un nouveau compte
              </button>
            </div>
          </div>

          {showUserCreation && (
            <UserCreationForm
              onUserCreated={handleUserCreated}
              onCancel={() => setShowUserCreation(false)}
            />
          )}

          <div className={`space-y-4 ${!selectedUser &&"hidden"}`}>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">Lieu de naissance</h4>

            <FormGroup columns={2}>
              <SingleSelectDropdown
                options={countryOptions}
                value={selectedCountry}
                onChange={handleCountryChange}
                label="Pays"
                placeholder="Sélectionner un pays"
                required
              />

              <SingleSelectDropdown
                options={provinceOptions}
                value={selectedProvince}
                onChange={handleProvinceChange}
                label="Province"
                placeholder="Sélectionner une province"
                disabled={!selectedCountry}
                required
              />
            </FormGroup>

            <FormGroup columns={3}>
              <SingleSelectDropdown
                options={communeOptions}
                value={selectedCommune}
                onChange={handleCommuneChange}
                label="Commune"
                placeholder="Sélectionner une commune"
                disabled={!selectedProvince}
                required
              />

              <SingleSelectDropdown
                options={zoneOptions}
                value={selectedZone}
                onChange={handleZoneChange}
                label="Zone"
                placeholder="Sélectionner une zone"
                disabled={!selectedCommune}
                required
              />

              <SingleSelectDropdown
                options={collineOptions}
                value={selectedColline}
                onChange={(value) => {
                  setSelectedColline(value);
                  if (selectedUser && value) {
                    onAutoSave?.({
                      id: selectedUser,
                      first_name: selectedUser,
                      place_of_birth: value,
                    });
                  }
                }}
                label="Colline"
                placeholder="Sélectionner une colline"
                disabled={!selectedZone}
                required
              />
            </FormGroup>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !selectedUser || !selectedColline}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-2"
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
    </form>
  );
}
