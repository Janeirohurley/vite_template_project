import { useState, useEffect } from 'react';
import type { InscriptionStepProps } from '@/types/inscription.d';
import { useUsers } from '@/api/inscription';
import { useCountries, getProvincesByCountry, getCommunesByProvince, getZonesByCommune, getCollinesByZone } from '@/api/geo';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import { Input } from '@/components/ui/input';
import { FormGroup } from '@/components/ui/FormGroup';
import { UserCreationForm } from './UserCreationForm';
import { transform } from '@/components/common/transformAny';
import { cn } from '@/lib/utils';

export function Step1UserSelection({ data, onNext, onAutoSave, isLoading }: InscriptionStepProps) {

  const { data: countries = [], isLoading: countriesLoading } = useCountries();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedUser, setSelectedUser] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedColline, setSelectedColline] = useState('');
  const [cam, setCam] = useState('');
  const [showUserCreation, setShowUserCreation] = useState(false);
  const [backendSearch, setBackendSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const { data: users = [], refetch: refetchUsers, isLoading: usersLoading, isFetching } = useUsers({ pagination: true, search: backendSearch });

  useEffect(() => {
    setIsSearching(backendSearch ? isFetching : false);
  }, [isFetching, backendSearch]);
  // Load persisted data
  useEffect(() => {
    if (data.step1) {
      setSelectedUser(data.step1.user_id || '');
      setSelectedColline(data.step1.colline_id || '');
      setCam(data.step1.cam !== undefined && data.step1.cam !== null ? String(data.step1.cam) : '');

      // Find and set geographic hierarchy from colline_id
      if (data.step1.colline_id && countries.length > 0) {
        for (const country of countries) {
          for (const province of country.provinces || []) {
            for (const commune of province.communes || []) {
              for (const zone of commune.zones || []) {
                const colline = zone.collines?.find(c => c.id === data.step1?.colline_id);
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
  }, [data.step1, countries]);

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
  ;




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

  const isCamInvalid = cam !== '' && !/^\d{4}$/.test(cam);

  const getStep1Payload = (overrides?: Partial<{
    user_id: string;
    colline_id: string;
    cam: string;
  }>) => {
    const resolvedUserId = overrides?.user_id ?? selectedUser;
    const resolvedCollineId = overrides?.colline_id ?? selectedColline;
    const resolvedCam = overrides?.cam ?? cam;

    const selectedUserData = users.find(u => u.id === resolvedUserId);
    const selectedCountryData = countries.find(c => c.id === selectedCountry);
    const selectedProvinceData = provinces.find(p => p.id === selectedProvince);
    const selectedCommuneData = communes.find(c => c.id === selectedCommune);
    const selectedZoneData = zones.find(z => z.id === selectedZone);
    const selectedCollineData = collines.find(c => c.id === resolvedCollineId);

    return {
      user_id: resolvedUserId,
      user_display: selectedUserData
        ? `${selectedUserData.first_name} ${selectedUserData.last_name} (${selectedUserData.email})`
        : resolvedUserId,
      user_first_name: selectedUserData?.first_name,
      user_last_name: selectedUserData?.last_name,
      user_email: selectedUserData?.email,
      colline_id: resolvedCollineId,
      colline_name: selectedCollineData?.colline_name,
      zone_id: selectedZoneData?.id,
      zone_name: selectedZoneData?.zone_name,
      commune_id: selectedCommuneData?.id,
      commune_name: selectedCommuneData?.commune_name,
      province_id: selectedProvinceData?.id,
      province_name: selectedProvinceData?.province_name,
      country_id: selectedCountryData?.id,
      country_name: selectedCountryData?.country_name,
      cam: resolvedCam ? parseInt(resolvedCam) : undefined,
    };
  };

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
    console.log(userId)
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedColline || isCamInvalid) return;

    setIsSubmitting(true);
    try {
      onNext(getStep1Payload());
    } finally {
      setIsSubmitting(false);
    }
  };

  const isInitialLoading = (usersLoading && !backendSearch) || countriesLoading;

  if (isInitialLoading) {
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
              onSearchChange={setBackendSearch}
              isLocalSearch={false}
              isSearching={isSearching}
              onChange={(value) => {
                setSelectedUser(value);
                if (value && selectedColline) {
                  onAutoSave?.(getStep1Payload({ user_id: value }));
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
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                + L'utilisateur n'existe pas ? Créer un nouveau compte
              </button>
            </div>
          </div>

          {showUserCreation && (
            <UserCreationForm
              onUserCreated={(userId) => {
                handleUserCreated(userId)
              }}
              onCancel={() => setShowUserCreation(false)}
              isLoading={isLoading}
            />
          )}

          <div className="space-y-4">
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
                    onAutoSave?.(getStep1Payload({ colline_id: value }));
                  }
                }}
                label="Colline"
                placeholder="Sélectionner une colline"
                disabled={!selectedZone}
                required
              />
            </FormGroup>
          </div>

          <div className="w-full md:w-1/3">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Numéro CAM (optionnel)
            </label>
            <Input
              type="number"
              placeholder="Numéro CAM  comment 1234"
              value={cam}
              min={0}
              minLength={4}
              defaultValue={0}
              onChange={(e) => {
                setCam(e.target.value);
                if (selectedUser && selectedColline) {
                  onAutoSave?.(getStep1Payload({ cam: e.target.value }));
                }
              }}
            />
            {isCamInvalid && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                Le CAM est optionnel, mais une fois saisi il doit contenir exactement 4 chiffres.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !selectedUser || !selectedColline || isCamInvalid}
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
