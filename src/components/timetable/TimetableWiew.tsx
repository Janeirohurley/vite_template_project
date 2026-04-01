export function TimetableWiew() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto p-6">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <i className="fas fa-chevron-left text-gray-600"></i>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900">
                            HORAIRE DU 20/10 AU 26/10-2025
                        </h1>
                        <button className="p-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                            <i className="fas fa-chevron-right text-gray-600"></i>
                        </button>
                    </div>
                    <div className="flex justify-center gap-2 mb-6">
                        <button className="px-4 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button bg-blue-600 text-white">
                            Toutes les salles
                        </button>
                        <button className="px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button bg-gray-100 text-gray-700 hover:bg-gray-200">
                            TIC-BAC1
                        </button>
                        <button className="px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button bg-gray-100 text-gray-700 hover:bg-gray-200">
                            TIC-BAC2
                        </button>
                        <button className="px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button bg-gray-100 text-gray-700 hover:bg-gray-200">
                            TIC-GL3
                        </button>
                        <button className="px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button bg-gray-100 text-gray-700 hover:bg-gray-200">
                            TIC-RT3
                        </button>
                        <button className="px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button bg-gray-100 text-gray-700 hover:bg-gray-200">
                            TIC-GL 4
                        </button>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-11 gap-0 bg-gray-50">
                        <div className="p-4 font-semibold text-gray-700 border-r border-gray-200">
                            Jours / Séance
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                TIC-BAC1
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle 120</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                TIC-BAC2
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle 120</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">TIC-GL3</div>
                            <div className="text-xs text-gray-600 mt-1"></div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">TIC-RT3</div>
                            <div className="text-xs text-gray-600 mt-1">Salle 226</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                TIC-GL 4
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle 131</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">TIC-RT4</div>
                            <div className="text-xs text-gray-600 mt-1">Salle 131</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                IS1A-IG1
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle 120</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                IS1A-EM11
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle 304</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                IS1A-IG2
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle</div>
                        </div>
                        <div className="p-4 text-center cursor-pointer transition-all duration-300 border-r border-gray-200 last:border-r-0 hover:bg-gray-100">
                            <div className="font-semibold text-gray-900 text-sm">
                                IS1A-EM12
                            </div>
                            <div className="text-xs text-gray-600 mt-1">Salle</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm">Lundi</div>
                            <div className="text-xs text-gray-600 mt-1">20-10-2025</div>
                            <div className="text-xs text-gray-500 mt-2">8h00-15h30</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-green-50 hover:bg-green-100 border-green-200">
                            <div className="flex items-start">
                                <i className="fas fa-project-diagram text-green-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    NIYONGABIRE Emmanuel Projet I
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-green-50 hover:bg-green-100 border-green-200">
                            <div className="flex items-start">
                                <i className="fas fa-project-diagram text-green-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    Remise Projet II
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-green-50 hover:bg-green-100 border-green-200">
                            <div className="flex items-start">
                                <i className="fas fa-project-diagram text-green-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    Projet II
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-purple-50 hover:bg-purple-100 border-purple-200">
                            <div className="flex items-start">
                                <i className="fas fa-laptop-code text-purple-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    TP DevOps
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de TEOEF
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de TEOEF
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    Stages du 01/9 au 30/11
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm">Mardi</div>
                            <div className="text-xs text-gray-600 mt-1">21-10-2025</div>
                            <div className="text-xs text-gray-500 mt-2">8h00-15h30</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm">
                                Mercredi
                            </div>
                            <div className="text-xs text-gray-600 mt-1">22-10-2025</div>
                            <div className="text-xs text-gray-500 mt-2">8h00-15h30</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session d'Introduction aux réseaux Informatiques
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de statistique descriptive
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session d'Analyse et conception des systèmes d'Information
                                    avec MERISE
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de Kiswahili
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de Kiswahili
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm">Jeudi</div>
                            <div className="text-xs text-gray-600 mt-1">23-10-2025</div>
                            <div className="text-xs text-gray-500 mt-2">8h00-15h30</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden transform scale-105 z-10 bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-purple-50 hover:bg-purple-100 border-purple-200">
                            <div className="flex items-start">
                                <i className="fas fa-laptop-code text-purple-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    Remise TP DevOps
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm">
                                Vendredi
                            </div>
                            <div className="text-xs text-gray-600 mt-1">24-10-2025</div>
                            <div className="text-xs text-gray-500 mt-2">8h00-12h00</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de Protocoles TCP/IP
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session d'analyse complexe
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session d'Ingénierie du logiciel
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de Probabilités et statistique
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm"></div>
                            <div className="text-xs text-gray-600 mt-1"></div>
                            <div className="text-xs text-gray-500 mt-2">12h00-17h30</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de Protocoles TCP/IP
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session d'analyse complexe
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session d'Ingénierie du logiciel
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    2e session de Probabilités et statistique
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-blue-50 hover:bg-blue-100 border-blue-200">
                            <div className="flex items-start">
                                <i className="fas fa-book text-blue-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">II</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t border-gray-200">
                        <div className="p-4 bg-gray-50 border-r border-gray-200">
                            <div className="font-semibold text-gray-900 text-sm">Samedi</div>
                            <div className="text-xs text-gray-600 mt-1">25-10-2025</div>
                            <div className="text-xs text-gray-500 mt-2">8h00-15h30</div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-green-50 hover:bg-green-100 border-green-200">
                            <div className="flex items-start">
                                <i className="fas fa-project-diagram text-green-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    Remise Projet I
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-green-50 hover:bg-green-100 border-green-200">
                            <div className="flex items-start">
                                <i className="fas fa-project-diagram text-green-500 mr-2"></i>
                                <div className="text-sm text-gray-800 leading-tight">
                                    Remise Projet II
                                </div>
                            </div>
                        </div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                        <div className="p-3 border border-gray-200 min-h-16 transition-all duration-300 cursor-pointer relative overflow-hidden bg-gray-25 hover:bg-gray-50"></div>
                    </div>
                    <div className="grid grid-cols-11 gap-0 border-t-2 border-blue-200 bg-orange-25">
                        <div className="p-4 bg-orange-100 border-r border-orange-200 flex items-center">
                            <i className="fas fa-users text-orange-600 mr-2"></i>
                            <span className="font-semibold text-orange-900">Clubs</span>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                        <div className="p-4 bg-orange-50 hover:bg-orange-100 border-r border-orange-200 last:border-r-0 cursor-pointer transition-colors text-center">
                            <div className="text-sm font-medium text-orange-800">Clubs</div>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-center">
                    <div className="flex gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                            <span className="text-gray-700">Cours</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                            <span className="text-gray-700">Projets</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                            <span className="text-gray-700">TP</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-100 border border-orange-200 rounded"></div>
                            <span className="text-gray-700">Clubs</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
