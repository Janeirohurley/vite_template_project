// Constantes et microcopy pour le module Guest

import type { UserRole, DocumentRequirement } from '../types';

// Configuration des statuts de compte
export const GUEST_STATUS_CONFIG = {
  pending: {
    label: 'En attente de validation',
    description: 'Votre compte est en cours de vérification par notre équipe.',
    color: 'amber',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: 'Clock',
  },
  under_review: {
    label: 'En cours d\'examen',
    description: 'Un administrateur examine actuellement votre dossier.',
    color: 'blue',
    bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
    icon: 'Search',
  },
  approved: {
    label: 'Compte validé',
    description: 'Félicitations ! Votre compte a été approuvé.',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: 'CheckCircle',
  },
  rejected: {
    label: 'Validation refusée',
    description: 'Votre demande n\'a pas pu être acceptée. Consultez les notifications pour plus de détails.',
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: 'XCircle',
  },
} as const;

// Configuration des statuts de documents
export const DOCUMENT_STATUS_CONFIG = {
  pending: {
    label: 'En attente',
    description: 'Document en cours de vérification',
    color: 'amber',
    bgColor: 'bg-amber-50 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
    icon: 'Clock',
  },
  verified: {
    label: 'Vérifié',
    description: 'Document validé par l\'administration',
    color: 'green',
    bgColor: 'bg-green-50 dark:bg-green-900/30',
    textColor: 'text-green-700 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
    icon: 'CheckCircle',
  },
  rejected: {
    label: 'Refusé',
    description: 'Document non conforme',
    color: 'red',
    bgColor: 'bg-red-50 dark:bg-red-900/30',
    textColor: 'text-red-700 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
    icon: 'XCircle',
  },
} as const;

// AVAILABLE_ROLES est maintenant construit dynamiquement depuis le backend
// Cette constante n'est plus utilisée, gardée pour compatibilité legacy
export const AVAILABLE_ROLES: Record<string, {
  label: string;
  description: string;
}> = {};

// Documents de base requis pour tous les rôles
const BASE_DOCUMENTS: DocumentRequirement[] = [
  {
    type: 'identity',
    label: 'Pièce d\'identité',
    description: 'Carte d\'identité nationale, passeport ou permis de conduire en cours de validité.',
    required: true,
    max_size: 5,
    accepted_formats: ['image/jpeg', 'image/png', 'application/pdf'],
  },
  {
    type: 'photo',
    label: 'Photo de profil',
    description: 'Photo récente, format portrait, fond neutre.',
    required: true,
    max_size: 2,
    accepted_formats: ['image/jpeg', 'image/png'],
  },
];

// Documents spécifiques par rôle
export const ROLE_DOCUMENT_REQUIREMENTS: Record<UserRole, DocumentRequirement[]> = {
  guest: [...BASE_DOCUMENTS],

  student: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Dernier diplôme obtenu',
      description: 'Copie certifiée de votre dernier diplôme (Bac, Licence, etc.).',
      required: true,
      max_size: 5,
      accepted_formats: ['image/jpeg', 'image/png', 'application/pdf'],
    },
    {
      type: 'transcript',
      label: 'Relevé de notes',
      description: 'Relevé de notes du dernier établissement fréquenté.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  alumni: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplôme UMS',
      description: 'Copie de votre diplôme obtenu à l\'UMS.',
      required: true,
      max_size: 5,
      accepted_formats: ['image/jpeg', 'image/png', 'application/pdf'],
    },
  ],

  delegate: [
    ...BASE_DOCUMENTS,
    {
      type: 'recommendation',
      label: 'Lettre de recommandation',
      description: 'Lettre de recommandation d\'un enseignant ou du doyen.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  teacher: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes académiques',
      description: 'Copies certifiées de vos diplômes (Master, Doctorat, etc.).',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé avec parcours académique et professionnel.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'teaching_cert',
      label: 'Certificat d\'enseignement',
      description: 'Attestation de capacité d\'enseigner ou expérience pédagogique.',
      required: false,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  supervisor: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplôme de Doctorat',
      description: 'Copie certifiée de votre doctorat.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé avec publications et expérience de recherche.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'research_proposal',
      label: 'Projet de recherche',
      description: 'Description de vos axes de recherche et projets en cours.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
  ],

  dean: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes académiques',
      description: 'Copies certifiées de vos diplômes.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé avec expérience de gestion académique.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'admin_appointment',
      label: 'Lettre de nomination',
      description: 'Lettre officielle de nomination au poste de doyen.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  director_academic: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes académiques',
      description: 'Copies certifiées de vos diplômes.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'admin_appointment',
      label: 'Lettre de nomination',
      description: 'Lettre officielle de nomination.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  director_quality_assurance: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes académiques',
      description: 'Copies certifiées de vos diplômes.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé avec expérience en assurance qualité.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'admin_appointment',
      label: 'Lettre de nomination',
      description: 'Lettre officielle de nomination.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  academic_affairs: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes',
      description: 'Copies de vos diplômes.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'work_contract',
      label: 'Contrat de travail',
      description: 'Copie de votre contrat ou attestation d\'emploi.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  student_service: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes',
      description: 'Copies de vos diplômes.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'work_contract',
      label: 'Contrat de travail',
      description: 'Copie de votre contrat ou attestation d\'emploi.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  finance_service: [
    ...BASE_DOCUMENTS,
    {
      type: 'diploma',
      label: 'Diplômes en comptabilité/finance',
      description: 'Copies de vos diplômes en comptabilité, finance ou gestion.',
      required: true,
      max_size: 10,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé avec expérience financière.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'work_contract',
      label: 'Contrat de travail',
      description: 'Copie de votre contrat ou attestation d\'emploi.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  general_service: [
    ...BASE_DOCUMENTS,
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'work_contract',
      label: 'Contrat de travail',
      description: 'Copie de votre contrat ou attestation d\'emploi.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  rector: [
    ...BASE_DOCUMENTS,
    {
      type: 'admin_appointment',
      label: 'Lettre de nomination',
      description: 'Lettre officielle de nomination au poste de recteur.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  rector_office: [
    ...BASE_DOCUMENTS,
    {
      type: 'cv',
      label: 'Curriculum Vitae',
      description: 'CV détaillé.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
    {
      type: 'work_contract',
      label: 'Contrat de travail',
      description: 'Copie de votre contrat ou attestation d\'emploi.',
      required: true,
      max_size: 5,
      accepted_formats: ['application/pdf'],
    },
  ],

  admin: [...BASE_DOCUMENTS],
  super_admin: [...BASE_DOCUMENTS],
};

// Messages rassurants pour l'utilisateur guest
export const GUEST_MESSAGES = {
  welcome: {
    title: 'Bienvenue sur UMS !',
    subtitle: 'Votre compte a été créé avec succès',
    description: 'Complétez votre profil et téléchargez les documents requis pour finaliser votre inscription.',
  },
  whatNext: {
    title: 'Prochaines étapes',
    steps: [
      {
        icon: 'UserCheck',
        title: 'Compléter le profil',
        description: 'Renseignez vos informations personnelles',
      },
      {
        icon: 'Mail',
        title: 'Télécharger les documents',
        description: 'Fournissez les pièces justificatives',
      },
      {
        icon: 'Unlock',
        title: 'Validation du compte',
        description: 'Un administrateur validera votre dossier',
      },
    ],
  },
  profilePending: {
    title: 'Profil en attente de soumission',
    description: 'Complétez tous les champs obligatoires et téléchargez vos documents pour soumettre votre profil.',
  },
  profileSubmitted: {
    title: 'Profil soumis',
    description: 'Votre profil a été soumis et est en attente de validation par l\'administration.',
  },
  profileIncomplete: {
    title: 'Profil incomplet',
    description: 'Certaines informations sont manquantes dans votre profil.',
    cta: 'Compléter mon profil',
  },
  noAction: {
    title: 'Profil complet',
    description: 'Votre profil est complet et en attente de validation.',
  },
  documentsUnderReview: {
    title: 'Documents en cours d\'examen',
    description: 'L\'administration vérifie actuellement vos documents. Vous serez notifié de toute mise à jour.',
  },
  approved: {
    title: 'Félicitations !',
    description: 'Votre compte a été validé. Vous allez être redirigé vers votre espace personnel.',
  },
  rejected: {
    title: 'Demande refusée',
    description: 'Votre demande n\'a pas été acceptée. Consultez les notifications pour connaître le motif.',
  },
  documentRejected: {
    title: 'Document refusé',
    description: 'Un ou plusieurs documents ont été refusés. Veuillez les corriger et les soumettre à nouveau.',
  },
  tips: {
    title: 'Conseils pour accélérer la validation',
    items: [
      'Assurez-vous que tous vos documents sont lisibles et en haute qualité',
      'Vérifiez que les informations correspondent à votre pièce d\'identité',
      'Répondez rapidement aux demandes de l\'administration',
      'Consultez régulièrement vos notifications',
    ],
  },
  estimatedTime: {
    title: 'Délai de traitement',
    description: 'Votre dossier sera traité dans un délai de 24 à 48 heures ouvrables.',
    note: 'Ce délai peut varier selon le volume de demandes.',
  },
} as const;

// Actions autorisées et interdites
export const GUEST_PERMISSIONS = {
  allowed: [
    { action: 'view_profile', label: 'Consulter votre profil', icon: 'User' },
    { action: 'edit_profile', label: 'Modifier vos informations', icon: 'Edit' },
    { action: 'view_notifications', label: 'Recevoir vos notifications', icon: 'Bell' },
    { action: 'upload_documents', label: 'Télécharger des documents', icon: 'Upload' },
    { action: 'upload_photo', label: 'Ajouter une photo de profil', icon: 'Camera' },
  ],
  forbidden: [
    { action: 'access_courses', label: 'Accéder aux cours', icon: 'BookOpen', reason: 'Disponible après validation' },
    { action: 'view_grades', label: 'Consulter les notes', icon: 'Award', reason: 'Disponible après validation' },
    { action: 'register_courses', label: 'S\'inscrire aux cours', icon: 'PlusCircle', reason: 'Disponible après validation' },
  ],
} as const;

// Messages de notification selon le type d'action
export const NOTIFICATION_TEMPLATES = {
  account_created: {
    type: 'info' as const,
    title: 'Compte créé',
    message: 'Votre compte a été créé avec succès. Complétez votre profil pour continuer.',
  },
  profile_submitted: {
    type: 'info' as const,
    title: 'Profil soumis',
    message: 'Votre profil a été soumis pour validation. Un administrateur l\'examinera prochainement.',
  },
  document_uploaded: {
    type: 'info' as const,
    title: 'Document téléchargé',
    message: 'Votre document a été téléchargé et sera examiné par l\'administration.',
  },
  document_verified: {
    type: 'success' as const,
    title: 'Document validé',
    message: 'Votre document a été vérifié et validé par l\'administration.',
  },
  document_rejected: {
    type: 'error' as const,
    title: 'Document refusé',
    message: 'Votre document a été refusé. Motif : {reason}. Veuillez soumettre un nouveau document.',
  },
  account_approved: {
    type: 'success' as const,
    title: 'Compte validé',
    message: 'Félicitations ! Votre compte a été validé. Vous pouvez maintenant accéder à toutes les fonctionnalités.',
  },
  account_rejected: {
    type: 'error' as const,
    title: 'Compte refusé',
    message: 'Votre demande de compte a été refusée. Motif : {reason}.',
  },
  under_review: {
    type: 'info' as const,
    title: 'Dossier en cours d\'examen',
    message: 'Un administrateur examine actuellement votre dossier.',
  },
} as const;

// Fonction pour obtenir les documents requis selon le rôle
export function getDocumentRequirementsForRole(role: UserRole): DocumentRequirement[] {
  return ROLE_DOCUMENT_REQUIREMENTS[role] || BASE_DOCUMENTS;
}

// Fonction pour obtenir les rôles que les guests peuvent demander
// Cette fonction n'est plus utilisée car les rôles viennent du backend
export function getRequestableRoles(): Array<{ value: string; label: string; description: string; category: string; isRequestable: boolean }> {
  return [];
}
