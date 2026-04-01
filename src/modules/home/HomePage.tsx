import React from "react";
import {
  User, BookOpen, Calendar, ClipboardList, Users, Wallet, Library, BarChart3,
  CheckCircle, Settings, GraduationCap, Monitor, Shield, Zap, Smartphone, Cloud,
  Code, Database, PaintBucket, LogIn, UserPlus
} from "lucide-react";

import backgroundImage from "@/assets/images/upg_mob.jpg";
import ctaImage from "@/assets/images/alumni1.jpg";

import Footer from "@/components/ui/Footer";
import { Header } from "@/components/ui/Header"; // Header gère le toggle dark/light

// -----------------------------------------------------------------------------
// Interfaces
// -----------------------------------------------------------------------------
interface Feature {
  icon: React.ElementType;
  iconColor: string;
  title: string;
  description: string;
}

interface ProfileCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBgColor: string;
  titleColor: string;
  listColor: string;
  features: string[];
  link: string;
}

interface TechnologyCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  highlightColor?: string;
}

interface CTAProfileIconProps {
  title: string;
  icon: React.ElementType;
}

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------
const featuresData: Feature[] = [
  { icon: User, iconColor: "text-orange-500", title: "Gestion des Étudiants", description: "Inscriptions, dossiers académiques, suivi personnalisé et historique complet." },
  { icon: BookOpen, iconColor: "text-teal-500", title: "Gestion des Cours", description: "Organisation des programmes, modules et contenus pédagogiques." },
  { icon: Calendar, iconColor: "text-amber-500", title: "Emplois du Temps", description: "Planification automatique des cours, salles et ressources." },
  { icon: ClipboardList, iconColor: "text-violet-500", title: "Gestion des Notes", description: "Saisie, calcul automatique des moyennes et bulletins." },
  { icon: Users, iconColor: "text-pink-500", title: "Gestion du Personnel", description: "Enseignants, administratifs, charges horaires et évaluations." },
  { icon: Wallet, iconColor: "text-green-500", title: "Gestion Financière", description: "Frais, paiements, bourses et suivi des transactions." },
  { icon: Library, iconColor: "text-blue-500", title: "Bibliothèque", description: "Catalogue numérique, emprunts et réservations." },
  { icon: BarChart3, iconColor: "text-red-500", title: "Statistiques & Rapports", description: "Tableaux de bord, analyses détaillées et indicateurs." },
];

const profilesData: ProfileCardProps[] = [
  {
    title: "Administrateurs",
    description: "Accès complet au système pour gérer tous les aspects.",
    icon: Settings,
    iconBgColor: "bg-blue-100 dark:bg-blue-900",
    titleColor: "text-blue-600 dark:text-blue-400",
    listColor: "text-blue-500",
    features: ["Gestion globale", "Rapports avancés", "Configuration système", "Contrôle total"],
    link: "/features",
  },
  {
    title: "Enseignants",
    description: "Outils pour la gestion des cours, notes et suivi.",
    icon: Users,
    iconBgColor: "bg-teal-100 dark:bg-teal-900",
    titleColor: "text-teal-600 dark:text-teal-400",
    listColor: "text-teal-500",
    features: ["Saisie des notes", "Emploi du temps", "Suivi pédagogique", "Ressources"],
    link: "/teachers-portal",
  },
  {
    title: "Étudiants",
    description: "Portail personnel pour consulter notes et emplois du temps.",
    icon: GraduationCap,
    iconBgColor: "bg-violet-100 dark:bg-violet-900",
    titleColor: "text-violet-600 dark:text-violet-400",
    listColor: "text-violet-500",
    features: ["Relevés de notes", "Emploi du temps", "Bibliothèque", "Paiements"],
    link: "/students-portal",
  },
];

const technologyData: TechnologyCardProps[] = [
  { icon: Code, title: "React + Vite + TypeScript", subtitle: "Frontend ultra-rapide et typé (Vite + React + TS)", highlightColor: "text-blue-500" },
  { icon: Monitor, title: "Django REST Framework", subtitle: "API REST robuste en Python (Django + DRF)", highlightColor: "text-green-600" },
  { icon: Database, title: "PostgreSQL", subtitle: "Base relationnelle fiable et performante", highlightColor: "text-indigo-500" },
  { icon: Cloud, title: "API REST", subtitle: "Endoints RESTful sécurisés (JWT / OAuth si besoin)", highlightColor: "text-yellow-500" },
];

const ctaProfiles: CTAProfileIconProps[] = [
  { title: "Étudiants", icon: GraduationCap },
  { title: "Enseignants", icon: Users },
  { title: "Administrateurs", icon: Settings },
];

// -----------------------------------------------------------------------------
// Small UI components
// -----------------------------------------------------------------------------
const FeatureCard: React.FC<Feature> = ({ icon: Icon, iconColor, title, description }) => (
  <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1">
    <div className={`p-3 rounded-xl w-fit mb-4 bg-gray-100 dark:bg-gray-800 ${iconColor}`}>
      <Icon size={22} />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const ProfileCard: React.FC<ProfileCardProps> = ({ title, description, icon: Icon, iconBgColor, titleColor, listColor, features, link }) => (
  <a href={link} className="block h-full">
    <div className="p-8 rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-1 h-full">
      <div className={`${iconBgColor} p-3 rounded-xl inline-block mb-4`}>
        <Icon size={26} />
      </div>
      <h3 className={`text-xl font-bold ${titleColor} mb-2`}>{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
      <ul className="space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-center text-gray-700 dark:text-gray-300">
            <CheckCircle size={16} className={`${listColor} mr-2`} />
            <span className="text-sm">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  </a>
);

const TechnologyCard: React.FC<TechnologyCardProps> = ({ icon: Icon, title, subtitle, highlightColor }) => (
  <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition">
    <div className="flex items-center mb-4">
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 mr-3">
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`text-lg font-bold ${highlightColor} dark:${highlightColor.replace('text-','text-')}`}>{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
      </div>
    </div>
  </div>
);

const CTAProfileIcon: React.FC<CTAProfileIconProps> = ({ title, icon: Icon }) => (
  <div className="flex flex-col items-center text-gray-800 dark:text-gray-200">
    <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-2">
      <Icon size={20} />
    </div>
    <span className="text-sm font-medium">{title}</span>
  </div>
);

// -----------------------------------------------------------------------------
// Homepage Component
// -----------------------------------------------------------------------------
export default function HomePage(): JSX.Element {
  const ACCENT = "text-blue-600";

  const backgroundStyle: React.CSSProperties = { backgroundImage: `url(${backgroundImage})` };
  const ctaBackgroundStyle: React.CSSProperties = { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${ctaImage})` };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header (gère toggle dark/light) */}
      <Header />

      {/* Hero */}
      <div className="relative h-screen bg-cover bg-center" style={backgroundStyle}>
        <div className="absolute inset-0 bg-black/45 flex items-center">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
              Système de Gestion
              <br />
              <span className={ACCENT}>Universitaire Moderne</span>
            </h1>
            <p className="text-lg text-gray-200 max-w-3xl mx-auto mb-8">
              Plateforme complète pour  gestion universitaire
            </p>

            <div className="flex justify-center gap-4">
              <a className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition" href="/featurespage">
                Découvrir les fonctionnalités
              </a>
              <a className="inline-flex items-center border border-white text-white px-6 py-3 rounded-lg hover:bg-white/10 transition" href="/auth/login">
                <LogIn size={16} className="mr-2" /> Se connecter
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fonctionnalités */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Fonctionnalités Complètes</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-3">Un système tout-en-un pour gérer efficacement tous les aspects de votre établissement universitaire.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuresData.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* Profiles */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Pour Tous les Utilisateurs</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-2xl mx-auto">Des interfaces adaptées à chaque profil: administrateurs, enseignants et étudiants.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {profilesData.map((p, i) => (
              <ProfileCard key={i} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Technologies / Languages (Requested) */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Technologies et Architecture</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-3 max-w-3xl mx-auto">Stack technique principal utilisé par le projet — API REST en Django, frontend moderne avec React + Vite + TypeScript, et PostgreSQL en base de données.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {technologyData.map((t, i) => (
              <TechnologyCard key={i} {...t} />
            ))}
          </div>

          <div className="mt-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Brève architecture (exemple)</h3>
            <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-2">
              <li><strong>Frontend</strong>: React + Vite + TypeScript. Build ultra-rapide, routage React Router / Remix selon le besoin.</li>
              <li><strong>Backend</strong>: Django + Django REST Framework (DRF) pour exposer des endpoints RESTful (CRUD, auth JWT/OAuth).</li>
              <li><strong>Base</strong>: PostgreSQL gérant relations, transactions et sauvegardes.</li>
              <li><strong>Déploiement</strong>: Conteneurs (Docker), CI/CD, sauvegardes & monitoring (Prometheus / Grafana optionnel).</li>
              <li><strong>Sécurité</strong>: Authentification centralisée, chiffrement des données sensibles, rôles et permissions (Admin/Teacher/Student).</li>
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white dark:bg-gray-950 transition-colors">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl overflow-hidden shadow-xl" style={ctaBackgroundStyle}>
            <div className="bg-black/50 p-10 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Prêt à commencer ?</h2>
              <p className="text-gray-200 max-w-2xl mx-auto mb-8">Connectez-vous ou créez un compte pour accéder à votre espace et commencer à gérer votre établissement.</p>

              <div className="flex justify-center gap-4">
                <a href="/auth/login" className="inline-flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-bold shadow"> <LogIn size={16} className="mr-2" /> Se connecter</a>
                <a href="/auth/register" className="inline-flex items-center border border-white text-white px-6 py-3 rounded-lg"> <UserPlus size={16} className="mr-2" /> Créer un compte</a>
              </div>

              <div className="mt-8 flex justify-center gap-6">
                {ctaProfiles.map((p, i) => <CTAProfileIcon key={i} {...p} />)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
