import React from 'react';
import { Send, Linkedin, Twitter, Facebook, Shield, ArrowUp } from 'lucide-react';

// 🎨 Design System Amélioré
const PRIMARY_GRADIENT = "bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 text-transparent bg-clip-text";
const BUTTON_GRADIENT = "bg-gradient-to-br from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 shadow-lg shadow-indigo-500/20";
const BACKGROUND_COLOR = "bg-[#05070a] text-gray-200 selection:bg-indigo-500/30";
const CARD_STYLE = "bg-gray-900/40 backdrop-blur-md border border-gray-800/50 hover:border-indigo-500/30 transition-all duration-300";

const StudentImagePlaceholder = 'url(/images/1.jpg)';

const ImageCardWithOverlay: React.FC = () => {
    return (
        <div className="relative w-full md:w-1/2 rounded-3xl overflow-hidden shadow-2xl transition duration-700 ease-out transform hover:scale-[1.02] group aspect-video">
            <div
                className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: StudentImagePlaceholder }}
            >
                <div className="absolute inset-0 bg-indigo-950/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-transparent to-transparent"></div>
            </div>
            {/* Overlay décoratif au hover */}
            <div className="absolute inset-0 border-2 border-indigo-400/0 group-hover:border-indigo-400/20 rounded-3xl transition-all duration-500"></div>
        </div>
    );
};

export default function Footer() {
    return (
        <footer className={`${BACKGROUND_COLOR} pt-24 pb-12 relative overflow-hidden`}>
            
            {/* Effet de lumière en arrière-plan */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-800 to-transparent"></div>

            {/* 🌟 Bouton Back to Top */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 p-4 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600 backdrop-blur-xl border border-indigo-500/30 shadow-2xl transition-all transform hover:-translate-y-1 active:scale-90 z-50 group"
            >
                <ArrowUp size={22} className="group-hover:animate-bounce" />
            </button>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* 🟦 Section Supérieure */}
                <div className="flex flex-col lg:flex-row justify-between border-b border-gray-800/60 pb-16 mb-16 gap-12">
                    <div className="lg:w-3/5 flex flex-col md:flex-row gap-10 items-center">
                        
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                                Simplifiez<br/>la gestion<br/>
                                <span className={`${PRIMARY_GRADIENT} block mt-2`}>universitaire</span>
                            </h2>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="lg:w-1/3 flex flex-col justify-between py-2">
                        <div className="text-left lg:text-right mb-10">
                            <div className="flex items-center lg:justify-end mb-3 group">
                                <Shield size={38} className="text-indigo-400 mr-3 transition-transform group-hover:rotate-12" />
                                <span className="text-4xl font-black tracking-tighter text-white">UMS</span>
                            </div>
                            <p className="text-gray-400 text-sm font-medium">L'excellence académique à l'ère numérique.</p>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-300 text-sm font-bold uppercase tracking-wider">Restez connecté</p>
                            <div className="flex p-1.5 bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl focus-within:border-indigo-500/50 transition-all shadow-inner">
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="w-full px-4 bg-transparent outline-none text-white placeholder-gray-600"
                                />
                                <button className={`p-4 rounded-xl text-white ${BUTTON_GRADIENT} transition-all`}>
                                    <Send size={20} />
                                </button>
                            </div>
                            <p className="text-gray-500 text-xs  opacity-80 pl-2 underline-offset-4 decoration-indigo-500/30">Votre vie privée est notre priorité.</p>
                        </div>
                    </div>
                </div>

                {/* 🌐 Technologies */}
                <div className="mb-20">
                    <h3 className="text-center text-xs font-black tracking-[0.2em] text-gray-500 uppercase mb-8">Propulsé par les meilleures technologies</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            'Django REST Framework', 'React 18', 'TypeScript', 
                            'PostgreSQL', 'TailwindCSS', 'Docker'
                        ].map((tech) => (
                            <span
                                key={tech}
                                className={`px-5 py-2 rounded-full ${CARD_STYLE} text-xs font-bold tracking-wide cursor-default`}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>

                {/* 🔗 Grille de Liens */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
                    {[
                        { title: "Fonctionnalités", links: ["Gestion des étudiants", "Emplois du temps", "Gestion des notes", "Bibliothèque"] },
                        { title: "Utilisateurs", links: ["Étudiants", "Enseignants", "Administrateurs", "Personnel"] },
                        { title: "Support", links: ["Centre d'aide", "Documentation", "FAQ", "Contact"] }
                    ].map((col, idx) => (
                        <div key={idx}>
                            <h4 className={`font-black text-sm uppercase tracking-widest mb-6 ${PRIMARY_GRADIENT}`}>{col.title}</h4>
                            <ul className="space-y-4 text-gray-400 text-sm font-medium">
                                {col.links.map(link => (
                                    <li key={link}><a className="hover:text-indigo-400 transition-colors flex items-center group" href="#"><span className="w-0 group-hover:w-2 h-[1px] bg-indigo-400 mr-0 group-hover:mr-2 transition-all"></span>{link}</a></li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    <div>
                        <h4 className={`font-black text-sm uppercase tracking-widest mb-6 ${PRIMARY_GRADIENT}`}>Réseaux sociaux</h4>
                        <div className="flex space-x-5">
                            {[Linkedin, Twitter, Facebook].map((Icon, i) => (
                                <a key={i} className="p-3 rounded-xl bg-gray-900 border border-gray-800 hover:border-indigo-500/50 hover:text-indigo-400 transition-all hover:-translate-y-1" href="#">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/*  Crédits & Footer legal */}
                <div className="space-y-8">
                   

                    <div className="flex flex-col md:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-widest text-gray-600 gap-4">
                        <p>© 2025 UMS. Built for the future of education.</p>
                        <div className="flex space-x-8">
                            {["Confidentialité", "Conditions", "Mentions légales"].map(item => (
                                <a key={item} className="hover:text-white transition-colors" href="#">{item}</a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Lien GitHub stylisé en bas */}
            <div className="mt-12 text-center border-t border-gray-900 pt-8">
                <a 
                    href="https://github.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-bold transition-all border border-white/5"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    VOIR LE CODE SOURCE SUR GITHUB
                </a>
            </div>
        </footer>
    );
}