/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
  Trash2,
  Loader2,
  Send,
  XCircle,
  Info,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { StatusBanner, ProfileImageUpload } from '../components';
import {
  DOCUMENT_STATUS_CONFIG
} from '../constants';
import {
  useGuestProfile,
  useUpdateProfile,
  useGuestDocuments,
  useProfileImage,
  useProfileCompletion,
} from '../hooks';
import { useGuestStore } from '../store';
import type { DocumentType } from '../types';
import { useAuthStore } from '@/modules/auth';
import { Input } from '@/components/ui/input';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { CustomDatePicker } from '@/components/ui/CustomDatePicker';
import GuestProfileSkeleton from '../components/shimmer/GuestProfileSkeleton';
import { useGetRoles } from '@/hooks/useGetRoles';

export function GuestProfile() {
  const { user: authUser } = useAuthStore();
  const { user, isLoading: isLoadingProfile, refetch: refetchProfile } = useGuestProfile();
  const { updateProfile, isUpdating } = useUpdateProfile();
  const { uploadProfileImage, isUploading: isUploadingImage } = useProfileImage();
  const { data: DataRoles } = useGetRoles({ pagination: false })

  // Tous les rôles viennent du backend
  const availableRoles = Array.isArray(DataRoles) 
    ? DataRoles.map((role: any) => ({
        value: role.id, // Utiliser l'ID du rôle
        label: role.name,
        description: role.description || '',
      }))
    : [];


  const {
    documents,
    documentRequirements,
    isUploading: isUploadingDoc,
    uploadDocument,
    deleteDocument,
    getRejectedDocuments,
  } = useGuestDocuments();
  const { completion, missingFields, isComplete } = useProfileCompletion();
  const { status, isProfileSubmitted, isSubmittingProfile } = useGuestStore();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    birth_date: '',
    address: '',
    requested_role: '' as any,
  });

  console.log(formData)
  const [saved, setSaved] = useState(false);
  const [showRoleDetails, setShowRoleDetails] = useState(false);

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || authUser?.first_name || '',
        last_name: user.last_name || authUser?.last_name || '',
        email: user.email || authUser?.email || '',
        phone: user.phone || authUser?.phone_number || '',
        birth_date: user.birth_date || authUser?.birth_date || '',
        address: user.address || '',
        requested_role: user.requested_role || '',
      });
    } else if (authUser) {
      setFormData((prev) => ({
        ...prev,
        first_name: authUser.first_name || '',
        last_name: authUser.last_name || '',
        email: authUser.email || '',
        phone: authUser.phone_number || '',
        birth_date: authUser.birth_date || '',
      }));
    }
  }, [user, authUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  // Gérer le changement de rôle avec requête immédiate
  const handleRoleChange = async (roleValue: string) => {
    setFormData((prev) => ({ ...prev, requested_role: roleValue }));
    try {
      await updateProfile({ ...formData, requested_role: roleValue });
      await refetchProfile(); // Refetch pour obtenir les nouveaux documents requis
      toast.success('Rôle mis à jour');
    } catch {
      toast.error('Erreur lors de la mise à jour du rôle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      updateProfile(formData);
      setSaved(true);
      toast.success('Profil enregistré avec succès');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handleSubmitForValidation = async () => {
    if (!isComplete) {
      toast.error('Veuillez compléter tous les champs requis avant de soumettre');
      return;
    }
    try {
      updateProfile({ ...formData, requested_role: formData.requested_role });
      toast.success('Profil soumis pour validation');
    } catch {
      toast.error('Erreur lors de la soumission');
    }
  };

  const handleDocumentUpload = async (file: File, type: DocumentType) => {
    try {
      uploadDocument({ file, type });
      toast.success('Document téléchargé avec succès');
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  const handleDocumentDelete = async (id: string) => {
    try {
      deleteDocument(id);
      toast.success('Document supprimé');
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      await uploadProfileImage(file);
      toast.success('Photo de profil mise à jour');
    } catch {
      toast.error('Erreur lors du téléchargement de la photo');
    }
  };

  const getDocumentForType = (type: DocumentType) => {
    return documents.find((doc) => doc.type === type);
  };

  const rejectedDocs = getRejectedDocuments();
  const selectedRoleInfo = availableRoles.find(r => r.value === formData.requested_role);

  if (isLoadingProfile) {
    return (
      <GuestProfileSkeleton />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Bannière de statut */}
      <StatusBanner status={status} showDetails={false} />

      {/* Alerte documents refusés */}
      <AnimatePresence>
        {rejectedDocs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 dark:text-red-400">Documents refusés</h3>
                <p className="text-sm text-red-700 dark:text-red-500 mt-1">
                  Certains documents ont été refusés. Veuillez les corriger et les soumettre à nouveau.
                </p>
                <ul className="mt-2 space-y-1">
                  {rejectedDocs.map((doc) => (
                    <li key={doc.id} className="text-sm text-red-600 dark:text-red-500">
                      • {doc.name}: {doc.rejection_reason || 'Document non conforme'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* En-tête */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mon profil</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complétez vos informations pour accélérer la validation de votre compte.
        </p>
      </div>

      {/* Barre de progression */}
      <div className="mb-6 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Complétion du profil
          </span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{completion}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${completion}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        {missingFields.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Champs manquants : {missingFields.join(', ')}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo de profil */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Photo de profil
            </h2>
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <ProfileImageUpload
                currentImageUrl={user?.profile_image_url}
                onUpload={handleProfileImageUpload}
                isUploading={isUploadingImage}
                disabled={isProfileSubmitted}
              />

              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ajoutez une photo de profil professionnelle. Cette photo sera visible
                  par l'administration lors de la validation de votre compte.
                </p>

                <ul className="mt-3 text-xs text-gray-500 dark:text-gray-400 space-y-1">
                  <li>• Photo récente et nette</li>
                  <li>• Format portrait, fond neutre</li>
                  <li>• Visage clairement visible</li>
                </ul>
              </div>
            </div>

          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Informations personnelles
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Prénom */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    disabled={isProfileSubmitted}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    disabled={isProfileSubmitted}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isProfileSubmitted}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Date de naissance */}
              <div>
                <CustomDatePicker
                  label="Date de naissance"
                  value={formData.birth_date}
                  onChange={(date) => handleChange({ target: { name: 'birth_date', value: date } } as any)}
                  required
                  placeholder="JJ/MM/AAAA"
                  allowManualInput
                />
              </div>

              {/* Adresse */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    disabled={isProfileSubmitted}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
                  />
                </div>
              </div>

              {/* Type de compte */}
              <div className="sm:col-span-2">
                <SingleSelectDropdown
                  label='Type de compte demandé'
                  options={availableRoles.map((role) => ({
                    id: role.value,
                    label: role.label,
                    value: role.value
                  }))}
                  required
                  value={formData.requested_role}
                  onChange={handleRoleChange}
                  disabled={isProfileSubmitted}
                  placeholder="Sélectionnez un type de compte"
                />

                {/* Détails du rôle sélectionné */}
                {selectedRoleInfo && (
                  <div className="mt-2">
                    <button
                      type="button"
                      onClick={() => setShowRoleDetails(!showRoleDetails)}
                      className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      <Info className="w-4 h-4" />
                      {showRoleDetails ? 'Masquer les détails' : 'Voir les détails du rôle'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${showRoleDetails ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {showRoleDetails && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-400"
                        >
                          {selectedRoleInfo.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {!isProfileSubmitted && (
                <>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Enregistrer
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmitForValidation}
                    disabled={!isComplete || isSubmittingProfile}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmittingProfile ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Soumettre pour validation
                  </button>
                </>
              )}

              {saved && (
                <span className="inline-flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  Modifications enregistrées
                </span>
              )}
            </div>

            {!isComplete && (
              <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Complétez tous les champs requis et téléchargez les documents pour soumettre votre profil.
              </p>
            )}

            {isProfileSubmitted && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-400 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Votre profil a été soumis et est en attente de validation. Vous ne pouvez plus modifier vos informations.
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Sidebar - Documents */}
        <div className="space-y-6">
          {/* Documents requis */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Documents requis
            </h2>

            <div className="space-y-4">
              {documentRequirements.map((req) => {
                const uploadedDoc = getDocumentForType(req.type);
                const statusConfig = uploadedDoc
                  ? DOCUMENT_STATUS_CONFIG[uploadedDoc.status]
                  : null;
                const documentVerified = uploadedDoc?.status === 'verified';
                const canDeleteDocument =
                  !documentVerified &&
                  ((!isProfileSubmitted && uploadedDoc?.status !== 'verified') ||
                    (isProfileSubmitted && uploadedDoc?.status === 'rejected'));

                const noDocumentYet = !uploadedDoc;
                const documentRejected = uploadedDoc?.status === 'rejected';
                const profileNotSubmitted = !isProfileSubmitted;

                const canUploadDocument =
                  !documentVerified &&
                  (profileNotSubmitted || noDocumentYet || documentRejected) &&
                  !isUploadingDoc;


                return (
                  <div key={req.type} className="border border-gray-200 dark:border-gray-800 rounded-lg p-3">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {req.label}
                          {req.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{req.description}</p>
                      </div>
                      {statusConfig && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bgColor} ${statusConfig.textColor}`}
                        >
                          {statusConfig.label}
                        </span>
                      )}
                    </div>

                    {uploadedDoc ? (
                      <div className="flex flex-col gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded sm:flex-row sm:items-center sm:flex-wrap">
                        <FileText className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate flex-1 min-w-0">
                          {uploadedDoc.name}
                        </span>
                        {canDeleteDocument && (
                          <button
                            onClick={() => handleDocumentDelete(uploadedDoc.id)}
                            className="p-1 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
                        {isUploadingDoc ? (
                          <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Cliquez pour télécharger
                            </span>
                          </>
                        )}
                          <input
                            type="file"
                            className="hidden"
                            accept={req.accepted_formats.join(',')}
                            disabled={!canUploadDocument}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleDocumentUpload(file, req.type);
                              }
                            }}
                          />

                      </label>
                    )}

                    {uploadedDoc?.status === 'verified' && (
                      <p className="mt-2 text-xs text-green-600 dark:text-green-400">
                        Document validé. Modification impossible.
                      </p>
                    )}

                    {uploadedDoc?.status === 'rejected' && uploadedDoc.rejection_reason && (
                      <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                        Motif : {uploadedDoc.rejection_reason}
                      </p>
                    )}

                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                      Max {req.max_size} Mo • {req.accepted_formats.map((f) => f.split('/')[1].toUpperCase()).join(', ')}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Aide */}
          <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 dark:text-blue-400">Besoin d'aide ?</h3>
                <p className="text-sm text-blue-700 dark:text-blue-500 mt-1">
                  Si vous rencontrez des difficultés, contactez le support à{' '}
                  <a href="mailto:support@ums.edu" className="underline">
                    support@ums.edu
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
