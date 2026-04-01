import { createFileRoute } from '@tanstack/react-router'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { GlobalLayout } from '@/layouts/GlobalLayout'
import DashboardHeader from '@/components/ui/DashboardHeader'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FileBadge } from 'lucide-react'
import { fetchStudentDashboardData } from '@/modules/student/api'
import type { StudentDashboardData } from '@/modules/student/types'

export const Route = createFileRoute('/student/dashboard')({
    component: StudentDashboard,
    pendingComponent: LoadingSpinner,
    loader: async () => {
        // Charger les données réelles depuis l'API
        const studentData = await fetchStudentDashboardData()
        return { studentData }
    },
})

import { useLoaderData } from '@tanstack/react-router'

function StudentDashboard() {
    return (
        <ProtectedRoute requiredRole="student">
            <GlobalLayout>
                <div className="p-6">
                    <DashboardHeader
                        name="Jean-Claude NIYONGABO"
                        subtitle="Tableau de bord — Étudiant"
                        greeting="Bienvenue"
                        align="left"
                    />

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Cours récents</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Algorithmique</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Dupont</p>
                                    </div>
                                    <span className="text-sm text-green-600">En cours</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Base de données</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Prof. Martin</p>
                                    </div>
                                    <span className="text-sm text-blue-600">À venir</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                            <h3 className="text-lg font-semibold mb-4">Prochains examens</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Mathématiques</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">15 Décembre 2024</p>
                                    </div>
                                    <FileBadge className="w-5 h-5 text-red-500" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div>
                                        <p className="font-medium">Physique</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">20 Décembre 2024</p>
                                    </div>
                                    <FileBadge className="w-5 h-5 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GlobalLayout>
        </ProtectedRoute>
    )
}
