import type { NavItem } from '@/types';
import {
  LayoutDashboard,
  FileText,
  Users,
  Clock,
  Gift,
  Activity,
  UserCheck,
  MessageSquare,
  BarChart3,
  Settings,
  GraduationCap,
  Shield,
  Database,
  User,
  List,
  Plus,
  Landmark,
  Layers,
  LayersPlus,
  Calendar,
  BookOpen,
  TrendingUp,
  Award,
  CheckCircle,
  BrickWall,
  Hammer,
  Newspaper,
  Group,
  Loader,
  ShieldQuestionMark,
  ClipboardList,
  House,
} from 'lucide-react';


export const studentServiceNavItems: Array<NavItem> = [
  { label: 'Tableau de bord', to: '/student-service/dashboard', icon: LayoutDashboard },
  { label: 'Inscriptions', to: '/student-service/inscriptions', icon: UserCheck },
  {
    label: 'Étudiants',
    to: '/student-service/students',
    icon: Users,
    children: [
      { label: 'Ajouter un étudiant', to: '/student-service/students/add', icon: Plus },
      { label: 'Liste des étudiants', to: '/student-service/students', icon: List },
      {
        label: "population",
        to: "/student-service/populations",
        icon: Group
      },
      {
        label: "Ecole secondaire",
        to: "/student-service/highschool-infos",
        icon: House
      }
    ],

  },
  {
    label: 'Parents',
    to: '/student-service/students/parents',
    icon: User,
    children: [
      { label: 'Ajouter un parent', to: '/student-service/parents/add', icon: Plus },
      { label: 'Liste des parents', to: '/student-service/parents/list', icon: List },
    ],
  },
  { label: 'Documents', to: '/student-service/documents', icon: FileText },
  { label: 'Absences', to: '/student-service/absences', icon: Clock },
  { label: 'Bourses', to: '/student-service/scholarships', icon: Gift },
  { label: 'Activités', to: '/student-service/activities', icon: Activity },
  { label: 'Clubs', to: '/student-service/clubs', icon: GraduationCap },
  { label: 'Orientation', to: '/student-service/orientation', icon: MessageSquare },
  { label: 'Rapports', to: '/student-service/reports', icon: BarChart3 },
];


export const AdminNavItems: Array<NavItem> = [
  { label: "Tableau de bord", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Utilisateurs", to: "/admin/users", icon: Users },
  { label: "Compte demande", to: "/admin/account-requested", icon: Loader },
  {
    label: "Programmes", icon: GraduationCap, children: [
      { label: "Gestion des programmes", to: "/admin/programs", icon: BookOpen },
      { label: "Annee accademique", to: "/admin/programs/academic", icon: Calendar },
    ]
  },
  { label: "cree Sondage", to: "/admin/survey-builder", icon: ShieldQuestionMark },
  { label: "Sondages", to: "/admin/surveys", icon: ClipboardList },
  { label: "Configuration", to: "/admin/configs", icon: Settings },
  { label: "Sécurité", to: "/admin/security", icon: Shield },
  { label: "Audit", to: "/admin/logs", icon: FileText },
  { label: "Sauvegarde", to: "/admin/backup", icon: Database },
];

export const FinanceNavItems: NavItem[] = [
  {
    label: "Général",
    to: "/finance/dashboard",
    icon: LayoutDashboard,
    children: [
      { label: "Dashboard", to: "/finance/dashbord", icon: BarChart3 },
      { label: "Banques", to: "/finance/banks", icon: Landmark },
      { label: "Catégories de Frais", to: "/finance/wording", icon: LayersPlus },
      { label: "Feuilles de Frais", to: "/finance/feessheets", icon: Layers },

    ]
  },



  {
    label: "Plans de Paiement",
    to: "/finance/payment/paymentplan",
    icon: Calendar
  },

  {
    label: "Enregistrement des  Paiements",
    to: "/finance/payment/addpayment",
    icon: FileText
  },
  {
    label: "Progression de Paiements ",
    to: "/finance/payment/studentpaymentdetails",
    icon: TrendingUp
  },


]



export const DirectorAcademicNavItems: Array<NavItem> = [
  { label: "Tableau de bord", to: "/director-academic/dashboard", icon: LayoutDashboard },
  { label: "Validations", to: "/director-academic/validations", icon: Hammer },
  { label: "Supervision", to: "/director-academic/Shield", icon: Shield },
  { label: "Consultation", to: "/director-academic/consultations", icon: BrickWall },
];

export const deanNavListSimple: Array<NavItem> = [
  { label: 'Tableau de bord', to: '/dean/dashboard', icon: LayoutDashboard },
  {
    label: "Créer Emploi du Temps",
    to: "/dean/schedules",
    icon: Calendar,
  },
  {
    label: "Gérer Programmes", // Mis à jour pour refléter la description détaillée
    to: "/dean/programs",
    icon: BookOpen,
  },
  {
    label: "Gérer les Examens", // Mis à jour pour refléter la description détaillée
    to: "/dean/exam",
    icon: Newspaper,
  },
  {
    label: "Gérer Enseignants",
    to: "/dean/teachers",
    icon: Users,
  },
  {
    label: "Gérer Étudiants",
    to: "/dean/students",
    icon: GraduationCap,
  },
  {
    label: "Suivi Progression",
    to: "/dean/progress",
    icon: TrendingUp,
  },
  {
    label: "Résultats Académiques",
    to: "/dean/results",
    icon: Award,
  },
  {
    label: "Délibérations et Jurys",
    to: "/dean/deliberations",
    icon: CheckCircle,
  },
];