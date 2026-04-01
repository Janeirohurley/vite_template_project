import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { GlobalLayout } from '@/layouts/GlobalLayout'
import DashboardHeader from '@/components/ui/DashboardHeader'
import StatCard from '@/components/ui/StatCard'
import { Activity, BarChart3, BookOpen, Users, Trophy } from 'lucide-react'

export const Route = createFileRoute('/teacher/dashboard')({
    component: TeacherDashboard,
})

function TeacherDashboard() {
    return (
        <ProtectedRoute requiredRole="teacher">
            <GlobalLayout>
                <div className="p-6">
                    <DashboardHeader
                        name="Marie DUPONT"
                        subtitle="Tableau de bord — Enseignant"
                        greeting="Bienvenue"
                        align="left"
                    />

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mt-6">
                        <StatCard
                            value="12"
                            label="Cours enseignés"
                            color="blue"
                            icon={BookOpen}
                        >

                        </StatCard>

                        <StatCard
                            value="156"
                            label="Étudiants"

                            color="purple"
                            icon={Users}
                        >

                        </StatCard>

                        <StatCard
                            value="87%"
                            label="Taux de réussite"

                            color="orange"
                            icon={Trophy}
                        >

                        </StatCard>

                        <StatCard
                            value="94%"
                            label="Participation"
                            color="purple"
                            icon={Activity}
                        >

                        </StatCard>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Mes cours</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Algorithmique Avancée</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">L2 Informatique - 45 étudiants</p>
                                    </div>
                                    <span className="text-sm text-green-600">Actif</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Structures de Données</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">L3 Informatique - 38 étudiants</p>
                                    </div>
                                    <span className="text-sm text-blue-600">Planifié</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Évaluations à venir</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Examen Final - Algorithmique</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">15 Décembre 2024</p>
                                    </div>
                                    <BarChart3 className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Contrôle Continu - Structures</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">10 Décembre 2024</p>
                                    </div>
                                    <BarChart3 className="w-5 h-5 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlobalLayout>
        </ProtectedRoute>
    )
}
