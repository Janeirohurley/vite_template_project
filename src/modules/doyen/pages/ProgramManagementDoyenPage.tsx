import { ErrorDisplay } from "@/components/ErrorDisplay"
import { useGetFacultyOverView } from "../hooks"
import { StatsCard, type StatsCardProps } from "@/components/ui/StatsCard";
import { BookOpen, Building, ContactRound, GraduationCap, PanelsTopLeft } from "lucide-react";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import { useAppStore } from "@/lib";
import { Button } from "@/components/ui/button";

export default function ProgramManagementDoyenPage() {

    const { selectedAcademicYear } = useAppStore();
    const { data: overview, isLoading: loadingOverview, refetch: refecheOverview, error: errorOverview } = useGetFacultyOverView({ academic_year_id: selectedAcademicYear?.id })
    const stats = overview

    if (errorOverview) {
        return <ErrorDisplay showBackButton={false} message={errorOverview?.message} />
    }

    const dashboardStats: StatsCardProps[] = [
        {
            label: "Départements",
            value: stats?.department_count ?? "—",
            change: "Total de departemens",
            icon: Building,
            color: "blue",
        },
        {
            label: "Enseignants",
            value: stats?.teacher_count ?? "—",
            change: "Personnel académique",
            icon: ContactRound,
            color: "indigo",
        },
        {
            label: "etudiants",
            value: stats?.student_count ?? "—",
            change: "Etudians dans le facultes",
            icon: GraduationCap,
            color: "purple",
        },
        {
            label: "Classes",
            value: stats?.class_count ?? "—",
            change: "classes dans la facultes",
            icon: BookOpen,
            color: "yellow",
        },
        {
            label: "Cours",
            value: stats?.course_count ?? "—",
            change: "Cours dans la facultes",
            icon: PanelsTopLeft,
            color: "yellow",
        },

    ];
    return (
        <div className="space-y-4">
         
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.faculty_name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {stats?.abreviation}
                    </p>
                </div>

                <Button onClick={() => refecheOverview} variant="outline" className='dark:bg-gray-800 dark:text-white dark:border-gray-500 cursor-pointer dark:hover:bg-gray-600' >
                    Actualiser
                </Button>



            </div>

            <StatsGridLoader
                isPending={loadingOverview}
                data={dashboardStats ?? []} // évite les erreurs si undefined
                renderItem={(stat, index) => (
                    <StatsCard
                        key={stat.label} // tu peux garder ta clé ici si tu veux
                        {...stat}
                        delay={index * 0.1}
                    />
                )}
            />

        </div>
    )
}