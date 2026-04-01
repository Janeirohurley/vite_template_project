import React from 'react';
import { 
    Shield, BarChart3, Clock, DollarSign, Users, Settings, BookOpen, CheckCircle
} from "lucide-react";
// Importez un composant Header si nécessaire
import {Header} from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

// Variables de Design
const PRIMARY_ACCENT = "text-indigo-600 dark:text-cyan-400"; // Bleu/Indigo moderne
const SECONDARY_ACCENT = "bg-indigo-600 hover:bg-indigo-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"; // Pour le bouton CTA
// Ajout d'un gradient léger pour la section
const SECTION_BG = "bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-24 transition-colors duration-500"; 

// --- Composant de bloc de fonctionnalité (plus détaillé) ---
interface FeatureBlockProps {
    icon: React.ElementType;
    title: string;
    description: string;
    roleFocus: string[]; // Qui utilise cette fonction
    listItems: string[];
}

const FeatureBlock: React.FC<FeatureBlockProps> = ({ icon: Icon, title, description, roleFocus, listItems }) => (
    // Style conservé mais légèrement affiné pour la couleur d'icône.
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:scale-[1.01] border-t-4 border-transparent hover:border-indigo-500 dark:hover:border-cyan-500 h-full flex flex-col justify-between">
        
        {/* En-tête de la carte */}
        <div>
            <div className="flex items-start mb-4">
                {/* Icône principale : Retrait du fond plein pour un look plus léger, utilisation de l'accentuation textuelle */}
                <div className={`p-2 rounded-lg w-fit mr-4 shadow-sm transition duration-300`}>
                    <Icon size={32} className={`${PRIMARY_ACCENT.replace('text-', 'text-')}`} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white leading-snug">{title}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Pour :</span> {roleFocus.join(', ')}
                    </p>
                </div>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mt-4 mb-6 leading-relaxed border-l-4 border-indigo-200 dark:border-cyan-700 pl-3">
                {description}
            </p>
        </div>

        {/* Liste des avantages clés */}
        <ul className="space-y-3 pt-6 border-t border-gray-100 dark:border-gray-700">
            {listItems.map((item, index) => (
                <li key={index} className="flex items-start text-base text-gray-600 dark:text-gray-400">
                    {/* Icône de coche plus visible */}
                    <CheckCircle size={16} className={`mr-3 ${PRIMARY_ACCENT.replace('text-', 'text-')} mt-1 flex-shrink-0`} />
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

// --- Page principale ---
export default function FeaturesPage() {
    const featureData = [
        {
            icon: Users,
            title: "Gestion Complète des Étudiants et du Personnel",
            description: "Centralisez les dossiers, gérez les inscriptions/réinscriptions (Service des Étudiants) et suivez le personnel académique et administratif (RH).",
            roleFocus: ["Service des Étudiants", "Super Admin", "Doyen"],
            listItems: [
                "Validation des pièces justificatives, gestion des cas spéciaux (abandons, exclusions).",
                "Mise à jour des profils, production des documents administratifs.",
                "Suivi des charges horaires des professeurs, gestion des congés/absences."
            ]
        },
        {
            icon: Clock,
            title: "Planification Académique et Emplois du Temps",
            description: "Le Doyen et les Secrétaires Académiques pilotent la structuration des études et l'organisation logistique.",
            roleFocus: ["Doyen", "Secrétaire Académique"],
            listItems: [
                "Création et publication des emplois du temps (Doyen).",
                "Attribution des cours aux professeurs (permanents/visiteurs) et des salles.",
                "Gestion des programmes, définition des UE, crédits et règles de validation."
            ]
        },
        {
            icon: DollarSign,
            title: "Recouvrement et Gestion Financière (Minerval)",
            description: "Un module ciblé pour optimiser le suivi des créances et les procédures de paiement, essentiel à la santé financière de l'établissement.",
            roleFocus: ["Agent de Recouvrement", "Recteur"],
            listItems: [
                "Extraction des listes d'impayés, gestion des tranches et des échéanciers.",
                "Génération de notifications et mises en demeure automatiques (email/SMS).",
                "Octroi et suivi des dérogations de paiement (Recteur).",
                "Alerte administrative en cas de non-paiement persistant."
            ]
        },
        {
            icon: BarChart3,
            title: "Pilotage Stratégique et Assurance Qualité",
            description: "Des outils d'analyse pour la direction pour guider les décisions et assurer la conformité et l'excellence académique.",
            roleFocus: ["DAQ", "Recteur", "Directeur Académique"],
            listItems: [
                "Analyse agrégée de la performance (taux de réussite, d'échec) par cours/programme.",
                "Audit des taux de rétention, d'abandon et des effectifs (DAQ).",
                "Évaluation des cours et enseignants via des enquêtes de satisfaction.",
                "Consultation des rapports de qualité pour orienter la politique générale."
            ]
        },
        {
            icon: Settings,
            title: "Administration et Sécurité du Système",
            description: "Le Super Administrateur assure la stabilité, la sécurité et la configuration globale de l'UMS, garantissant une plateforme fiable.",
            roleFocus: ["Super Administrateur"],
            listItems: [
                "Création, modification et attribution des rôles et permissions.",
                "Gestion des paramètres globaux (années académiques, types de frais).",
                "Audit et journalisation des activités critiques, gestion des sauvegardes/restaurations.",
                "Gestion de la sécurité globale et des accès d'urgence."
            ]
        },
        {
            icon: BookOpen,
            title: "Gestion Documentaire et Bibliothèque",
            description: "Centralisation des ressources et des procédures documentaires pour tous les acteurs (administration, étudiants, alumni).",
            roleFocus: ["Bibliothèque", "Étudiant", "Alumni"],
            listItems: [
                "Catalogue numérique des ouvrages et gestion des emprunts/retours.",
                "Archivage sécurisé des documents officiels (PV de jury, relevés signés).",
                "Processus de commande en ligne pour les documents post-diplomation (Alumni)."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Header />
            
            <section className={SECTION_BG}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        {/* Typographie améliorée avec un contraste fort */}
                        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
                            <span className={PRIMARY_ACCENT}>Système UMS :</span> La Gestion Unifiée
                        </h1>
                        <p className="text-xl text-gray-700 dark:text-gray-400 max-w-4xl mx-auto">
                            Découvrez les **six modules fondamentaux** qui optimisent la gestion académique, administrative, financière et la qualité de votre établissement d'enseignement supérieur.
                        </p>
                    </div>

                    {/* Grille Mosaïque (3 colonnes sur grand écran) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
                        {featureData.map((block, index) => (
                            <FeatureBlock key={index} {...block} />
                        ))}
                    </div>

                    <div className="mt-20 pt-10 text-center border-t border-gray-200 dark:border-gray-800">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Prêt à Transformer votre Gestion ?</h2>
                        <a href="/contact" className={`text-white font-bold py-3 px-10 rounded-lg shadow-2xl transition duration-300 ${SECONDARY_ACCENT} transform hover:scale-[1.02]`}>
                            Demander une Démonstration
                        </a>
                    </div>
                </div>
            </section>
            
            <Footer />
        </div>
    );
}