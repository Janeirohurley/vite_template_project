import type { Survey } from "../types";
import ums from "@/assets/ums.png";

export const presentationSurvey: Survey = {
  id: 'university-app-presentation-2024',
  title: "Évaluation de la présentation de l'application de gestion universitaire",
  description:
    "Votre avis nous aide à améliorer l'application ainsi que la qualité des futures présentations.",
  logo: ums,
  multiStep: false,
  startDate: '2026-02-07T00:00:00',
  endDate: '2026-03-01T23:59:59',
  questions: [  
    {
      id: 'participant_role',
      label: 'Quel est votre rôle principal ?',
      type: 'select',
      required: true,
      section: 'Profil du participant',
      options: [
        'Étudiant',
        'Enseignant',
        'Administration',
        'Responsable académique',
        'Autre'
      ]
    },
    {
      id: 'presentation_clarity',
      label: 'La présentation était-elle claire et facile à comprendre ?',
      type: 'rating',
      required: true,
      section: 'Présentation',
      max: 5
    },
    {
      id: 'presentation_duration',
      label: 'Comment évaluez-vous la durée de la présentation ?',
      type: 'radio',
      section: 'Présentation',
      options: [
        'Trop courte',
        'Adaptée',
        'Trop longue'
      ]
    },
    {
      id: 'app_objective_understanding',
      label: 'Comprenez-vous l\'objectif principal de l\'application après la présentation ?',
      type: 'radio',
      required: true,
      section: 'Compréhension',
      options: [
        'Oui, très clairement',
        'Oui, partiellement',
        'Non'
      ]
    },
    {
      id: 'features_understanding',
      label: 'Quelles fonctionnalités avez-vous le mieux comprises ?',
      type: 'textarea',
      section: 'Compréhension',
      placeholder: 'Exemple : gestion des étudiants, emplois du temps...'
    },
    {
      id: 'app_usefulness',
      label: 'Selon vous, cette application est-elle utile pour la gestion universitaire ?',
      type: 'rating',
      required: true,
      section: 'Utilité',
      max: 5
    },
    {
      id: 'potential_users',
      label: 'Pour quels utilisateurs cette application est-elle la plus utile ?',
      type: 'checkbox',
      section: 'Utilité',
      options: [
        'Étudiants',
        'Enseignants',
        'Administration',
        'Direction universitaire'
      ]
    },
    {
      id: 'missing_features',
      label: 'Quelles fonctionnalités importantes manquent selon vous ?',
      type: 'textarea',
      section: 'Avis et suggestions',
      placeholder: 'Décrivez les fonctionnalités souhaitées...'
    },
    {
      id: 'improvement_suggestions',
      label: 'Avez-vous des suggestions pour améliorer l\'application ?',
      type: 'textarea',
      section: 'Avis et suggestions',
      placeholder: 'Vos idées et recommandations...'
    },
    {
      id: 'general_feedback',
      label: 'Avez-vous un avis général ou un commentaire sur la présentation ?',
      type: 'textarea',
      section: 'Avis et suggestions',
      placeholder: 'Votre retour global...'
    },
    {
      id: 'future_interest',
      label: 'Seriez-vous intéressé(e) à utiliser cette application à l\'avenir ?',
      type: 'radio',
      section: 'Intérêt futur',
      options: [
        'Oui',
        'Peut-être',
        'Non'
      ]
    }
  ]
};
