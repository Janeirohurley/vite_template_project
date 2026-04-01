import React from 'react';
import { 
    Users, BookOpen, Calendar, FileText, UploadCloud, CheckCircle, MessageCircle, Bell, Clock, FileMinus, FilePlus 
} from 'lucide-react';
import { Header } from '@/components/ui/Header';
import Footer from '@/components/ui/Footer';

const SECTION_BG = "bg-gray-50 dark:bg-gray-900 py-16 transition-colors duration-500";
const ACCENT_COLOR = "text-blue-600 dark:text-teal-400";

// ⭐ Composant AdvantageCard intégré
const AdvantageCard = ({ icon: Icon, title, description, iconBg }: any) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition duration-300 hover:scale-105">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${iconBg} text-white mb-4`}>
            <Icon size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
);

export default function StudentPortalPage() {
    const studentAdvantages = [
        { icon: Users, title: "Inscription / Réinscription", description: "Complétez les formulaires, payez les frais de scolarité et validez votre inscription en ligne.", iconBg: "bg-indigo-500" },
        { icon: BookOpen, title: "Mise à Jour du Profil", description: "Gérez vos informations personnelles (adresse, téléphone, email, etc.) pour que l'administration dispose de données exactes.", iconBg: "bg-pink-500" },
        { icon: FileText, title: "Consultation des Notes", description: "Accédez à vos résultats d'examens et travaux pratiques en temps réel, sous condition d’avoir payé la tranche requise.", iconBg: "bg-red-500" },
        { icon: FileMinus, title: "Relevés et Bulletins", description: "Téléchargez vos relevés de notes officiels et le parcours académique une fois l'année clôturée.", iconBg: "bg-green-600" },
        { icon: Clock, title: "Suivi de la Progression", description: "Vérifiez l'avancement dans votre cursus et les crédits restants pour l'obtention du diplôme.", iconBg: "bg-cyan-500" },
        { icon: Calendar, title: "Emploi du Temps & Calendrier", description: "Consultez votre horaire de cours mis à jour, dates importantes, examens et jours fériés.", iconBg: "bg-teal-500" },
        { icon: MessageCircle, title: "Messagerie Intégrée", description: "Communiquez directement avec vos professeurs, assistants et administration.", iconBg: "bg-indigo-500" },
        { icon: UploadCloud, title: "Plateforme de Cours (LMS)", description: "Téléchargez supports de cours, rendez vos devoirs et accédez aux ressources documentaires.", iconBg: "bg-pink-500" },
        { icon: Bell, title: "Notifications", description: "Recevez alertes importantes sur paiement, emploi du temps, inscriptions et résultats.", iconBg: "bg-red-500" },
        { icon: FilePlus, title: "Consultation et Demande de Documents", description: "Accédez aux certificats, relevés, attestations, et soumettez des demandes spécifiques.", iconBg: "bg-green-600" },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-500">
            <Header />

            <section className={`${SECTION_BG} pt-20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
                        <span className={ACCENT_COLOR}>Portail Étudiant UMS :</span> Gérez vos études facilement
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto">
                        Tous les outils essentiels pour suivre vos cours, travaux, notes, communications et documents officiels.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {studentAdvantages.map((card, index) => (
                            <AdvantageCard key={index} {...card} />
                        ))}
                    </div>

                    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-center items-center gap-4">
                        <a
                            href="/"
                            className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                        >
                            Accueil
                        </a>
                        <a
                            href="/auth/register"
                            className="bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                        >
                            S'inscrire
                        </a>
                        <a
                            href="/auth/login"
                            className={`${ACCENT_COLOR.replace('text-', 'bg-').replace('dark:text-', 'dark:bg-')} text-white font-bold py-3 px-8 rounded-lg shadow-md hover:opacity-90 transition duration-300`}
                        >
                            Accéder au Portail
                        </a>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
