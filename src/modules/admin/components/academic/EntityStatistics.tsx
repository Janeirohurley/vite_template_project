import { useFaculties, useDepartments, useClasses, useModules, useCourses } from '../../hooks/useAcademicEntities';
import { GraduationCap, Building2, Users, BookOpen, FileText, Award, Clock } from 'lucide-react';
import { StatsCard } from '@/modules/doyen';
import StatsGridLoader from '@/components/ui/StatsGridLoader';
import type { StatsCardProps } from '@/components/ui/StatsCard';

type EntityType = 'faculty' | 'department' | 'class' | 'module' | 'course';

interface EntityStatisticsProps {
    entityType: EntityType;
}

export function EntityStatistics({ entityType }: EntityStatisticsProps) {
    const { data: facultiesData } = useFaculties();
    const { data: departmentsData } = useDepartments();
    const { data: classesData } = useClasses();
    const { data: modulesData } = useModules();
    const { data: coursesData } = useCourses();

    const faculties = facultiesData?.results || [];
    const departments = departmentsData?.results || [];
    const classes = classesData?.results || [];
    const modules = modulesData?.results || [];
    const courses = coursesData?.results || [];

    const getTotalCredits = () => {
        return courses.reduce((sum, course) => sum + course.credits, 0);
    };

    const getTotalHours = () => {
        return courses.reduce((sum, course) => sum + course.cm + course.td + course.tp, 0);
    };

    const getStatsByEntityType = (): StatsCardProps[] => {
        switch (entityType) {
            case 'faculty':
                // Grouper les programmes par type de formation
                {
                    const programsByType = faculties.reduce((acc, faculty) => {
                        const typeName = faculty.types?.name || 'Autre';
                        acc[typeName] = (acc[typeName] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>);

                    const typeEntries = Object.entries(programsByType);
                    const stats: StatsCardProps[] = [
                        { label: 'Total Programmes', value: facultiesData?.count as number, icon: GraduationCap, color: 'blue' },
                    ];

                    // Ajouter jusqu'à 4 types de formation les plus représentés
                    const colors: Array<'emerald' | 'purple' | 'orange' | 'red'> = ['emerald', 'purple', 'orange', 'red'];
                    const icons = [BookOpen, FileText, Award, Building2];
                    typeEntries.slice(0, 4).forEach(([typeName, count], index) => {
                        stats.push({
                            label: typeName,
                            value: count,
                            icon: icons[index],
                            color: colors[index],
                        });
                    });

                    // Compléter avec d'autres stats si moins de 3 types
                    if (typeEntries.length < 3) {
                        if (typeEntries.length === 0) {
                            stats.push(
                                { label: 'Départements associés', value: departments.length, icon: Building2, color: 'emerald' },
                                { label: 'Classes totales', value: classes.length, icon: Users, color: 'purple' },
                                { label: 'Modules totaux', value: modules.length, icon: BookOpen, color: 'orange' }
                            );
                        } else if (typeEntries.length === 1) {
                            stats.push(
                                { label: 'Départements', value: departments.length, icon: Building2, color: 'purple' },
                                { label: 'Classes', value: classes.length, icon: Users, color: 'orange' }
                            );
                        } else {
                            stats.push({ label: 'Départements', value: departments.length, icon: Building2, color: 'orange' });
                        }
                    }

                    return stats;
                }
            case 'department':
                return [
                    { label: 'Total départements', value: departmentsData?.count as number, icon: Building2, color: 'blue' },
                    { label: 'Classes associées', value: classes.length, icon: Users, color: 'emerald' },
                    { label: 'Modules associés', value: modules.length, icon: BookOpen, color: 'purple' },
                ];
            case 'class':
                return [
                    { label: 'Total des classes', value: classesData?.count as number, icon: Users, color: 'blue' },
                    { label: 'Modules associés', value: modules.length, icon: BookOpen, color: 'emerald' },
                    { label: 'Cours associés', value: courses.length, icon: FileText, color: 'purple' },
                ];
            case 'module':
                return [
                    { label: 'Total des modules', value: modulesData?.count as number, icon: BookOpen, color: 'blue' },
                    { label: 'Cours associés', value: courses.length, icon: FileText, color: 'emerald' },
                    { label: 'Crédits totaux', value: getTotalCredits(), icon: Award, color: 'purple' },
                ];
            case 'course':
                return [
                    { label: 'Total des cours', value: coursesData?.count as number, icon: FileText, color: 'blue' },
                    { label: 'Heures totales', value: `${getTotalHours()}h`, icon: Clock, color: 'emerald' },
                    { label: 'Crédits totaux', value: getTotalCredits(), icon: Award, color: 'purple' },
                ];
            default:
                return [];
        }
    };

    const stats = getStatsByEntityType();
    return <div className='pb-6'>
        <StatsGridLoader
            isPending={false}
            data={stats ?? []} // évite les erreurs si undefined
            renderItem={(stat, index) => (
                <StatsCard
                    key={stat.label} // tu peux garder ta clé ici si tu veux
                    {...stat}
                    delay={index * 0.1}
                />
            )}
        /></div>




}
