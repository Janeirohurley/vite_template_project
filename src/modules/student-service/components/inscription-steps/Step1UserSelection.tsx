import { useState, useEffect, useCallback } from 'react';
import type { InscriptionStepProps } from '@/types/inscription.d';
import { useUsers } from '@/api/inscription';
import { useCountries, getProvincesByCountry, getCommunesByProvince, getZonesByCommune, getCollinesByZone } from '@/api/geo';
import { SingleSelectDropdown, type Option } from '@/components/ui/SingleSelectDropdown';
import { Input } from '@/components/ui/input';
import { FormGroup } from '@/components/ui/FormGroup';
import { UserCreationForm } from './UserCreationForm';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';

import { getAllIncompleteDrafts } from '@/lib/inscriptionDB';

import { transform } from '@/components/common/transformAny';
import { cn } from '@/lib/utils';
import { notify } from '@/lib';
import { getInscriptionDraftsApi } from '../inscriptionDraft/api/inscriptionDraftApi';

export function Step1UserSelection({ data, onNext, onAutoSave, isLoading, sessionId }: InscriptionStepProps) {

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
  const [hasExistingDraft, setHasExistingDraft] = useState(false);
  const [isCheckingDraft, setIsCheckingDraft] = useState(false);

  // Double confirmation d'annulation pour la création d'utilisateur
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelConfirmStep, setCancelConfirmStep] = useState<1 | 2>(1);
  // Handler pour double confirmation d'annulation
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
    setShowUserCreation(false);
  };

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

  const checkExistingDraftForUser = useCallback(async (userId: string) => {
    if (!userId) {
      setHasExistingDraft(false);
      return false;
    }

    setIsCheckingDraft(true);
    try {
      const localDrafts = await getAllIncompleteDrafts();
      const localMatch = localDrafts.some(draft =>
        draft.sessionId !== sessionId &&
        draft.formData?.step1?.user_id === userId &&
        draft.isCompleted === false
      );
      if (localMatch) {
        setHasExistingDraft(true);
        return true;
      }

      const backendDraftsResponse = await getInscriptionDraftsApi({ pagination: false });
      const backendDrafts = backendDraftsResponse.results ?? [];
      const backendMatch = backendDrafts.some(draft =>
        draft.sessionId !== sessionId &&
        draft.formData?.step1?.user_id === userId &&
        draft.isCompleted === false
      );
      setHasExistingDraft(backendMatch);
      return backendMatch;
    } catch (error) {
      console.error('Error checking existing drafts:', error);
      return false;
    } finally {
      setIsCheckingDraft(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (!selectedUser) {
      setHasExistingDraft(false);
      return;
    }

    let isActive = true;
    (async () => {
      const exists = await checkExistingDraftForUser(selectedUser);
      if (!isActive) return;
      setHasExistingDraft(exists);
    })();

    return () => {
      isActive = false;
    };
  }, [selectedUser, checkExistingDraftForUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedColline || isCamInvalid) return;

    setIsSubmitting(true);
    try {
      const exists = await checkExistingDraftForUser(selectedUser);
      if (exists) {
        notify.error("Une inscription en cours existe déjà pour cet utilisateur. Veuillez choisir une autre personne.");
        return;
      }
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
            {hasExistingDraft && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                Une inscription en cours existe déjà pour cet utilisateur. Veuillez choisir une autre personne.
              </p>
            )}

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


          {/* Modal pour la création d'utilisateur */}
          <AlertDialog
            open={showUserCreation}
            onOpenChange={(open: boolean) => {
              if (!open) handleCancelWithDoubleConfirm();
            }}
          >
            <AlertDialogContent className="max-w-4xl h-dvh overflow-y-auto">
              <UserCreationForm
                onUserCreated={(userId) => {
                  handleUserCreated(userId);
                }}
                onCancel={handleCancelWithDoubleConfirm}
                isLoading={isLoading}
              />
            </AlertDialogContent>
          </AlertDialog>

          {/* Double confirmation d'annulation */}
          <AlertDialog
            open={isCancelDialogOpen}
            onOpenChange={(open) => {
              setIsCancelDialogOpen(open);
              if (!open) setCancelConfirmStep(1);
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {cancelConfirmStep === 1
                    ? "Annuler la création de l'utilisateur ?"
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
                  {cancelConfirmStep === 1 ? 'Continuer' : "Confirmer l'annulation"}
                </button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
          disabled={isSubmitting || isCheckingDraft || hasExistingDraft || !selectedUser || !selectedColline || isCamInvalid}
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
