// src/pages/TeacherPortalPage.tsx
import React from 'react';
import { 
    Users, ClipboardList, Clock, FileText, UploadCloud, CheckCircle, Shield, LogIn, Sun, Moon 
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';


// 🌙 Composant AdvantageCard
interface AdvantageCardProps {
    icon: React.ElementType;
    title: string;
    description: string;
    iconBg: string;
}

const AdvantageCard: React.FC<AdvantageCardProps> = ({ icon: Icon, title, description, iconBg }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition duration-300">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${iconBg} text-white`}>
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
);

// 🌟 Styles et couleurs
const SECTION_BG = "bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-500";
const ACCENT_COLOR = "text-blue-600 dark:text-teal-400"; // Accent color

export default function TeacherPortalPage() {
    const teacherAdvantages = [
        { icon: ClipboardList, title: "Saisie et Contrôle des Notes", description: "Interface intuitive pour la saisie des notes (par cours). Contrôlez que toutes les notes sont entrées avant les jurys. Le système calcule automatiquement les moyennes et les validations.", iconBg: "bg-indigo-500" },
        { icon: Clock, title: "Gestion des Charges et Créances", description: "Suivez votre charge horaire totale. Saisissez et validez les déclarations de créance qui sont ensuite automatiquement transmises au service financier.", iconBg: "bg-pink-500" },
        { icon: FileText, title: "Coordination des Examens", description: "Consultez la planification des épreuves, les listes d'émargement et les affectations de surveillants.", iconBg: "bg-red-500" },
        { icon: UploadCloud, title: "Partage de Ressources", description: "Téléversez et gérez les supports de cours et documents mis à disposition des étudiants via leur portail.", iconBg: "bg-green-600" },
        { icon: Users, title: "Suivi Étudiant et Réclamations", description: "Accédez au dossier académique de vos étudiants. Gérez les demandes de réclamation de notes soumises.", iconBg: "bg-cyan-500" },
        { icon: CheckCircle, title: "Communication Officielle", description: "Recevez des notes de service ou circulaires officielles et utilisez la messagerie intégrée.", iconBg: "bg-teal-500" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            {/* Header */}
            <Header />

            {/* Section principale */}
            <section className={`${SECTION_BG} pt-20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        <span className={ACCENT_COLOR}>Le Portail Enseignant UMS :</span> Optimisez votre gestion académique
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                        Des outils puissants pour les professeurs et les membres de l'administration académique (Doyens, Secrétaires, Chefs de Département).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teacherAdvantages.map((card, index) => (
                            <AdvantageCard key={index} {...card} />
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                        <a 
                            href="/auth/login" 
                            className={`inline-block bg-blue-600 dark:bg-teal-500 text-white font-bold py-3 px-8 rounded-lg transition duration-300 hover:opacity-90`}
                        >
                            <LogIn size={18} className="inline mr-2" />
                            Accéder au Portail Enseignant
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}
