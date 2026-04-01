import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown";
import { useClasses, useProposeTeacher } from "../hooks/useTimetable";
import { useMemo, useState } from "react";
import { useCourses, useTeachers } from "../hooks";
import { Button } from "@/components/ui/button";
import type { ProposeData } from "../types/backend";
import { useSettings } from "@/lib";



interface TeacherProposerInterface {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TeacherProposer({
    isOpen,
    setOpen
}: TeacherProposerInterface) {

    const { selectedAcademicYear } = useSettings();
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [selectedCaurseId, setSelectedCaurseId] = useState<string>('');
    const [selectedFirstTeacherId, setSelectedFirstTeacherId] = useState<string>('');
    const [selectedSecondTeacherId, setSelectedSecondTeacherId] = useState<string>('');
    const { data: classesData, isLoading: loadingClasses } = useClasses({ pagination: false, });
    const { data: coursesData, isLoading: loadingCourses } = useCourses({
        class_id: selectedClassId,
        pagination: false,
    }, {
        enabled: !!selectedClassId
    });
    const createPropositionsMutation = useProposeTeacher()

    const { data: teachersData, isLoading: loadingTeachers } = useTeachers({
        pagination: false,
    }, {});



    const createPropositons = (data: ProposeData) => {
        createPropositionsMutation.mutate(data)
    }


    const classes = classesData?.results || [];
    const courses = coursesData?.results || [];
    const teachers = teachersData?.results || [];

    const secondTeachers = useMemo(() => {
        return teachersData?.results.filter((t) => t.id !== selectedFirstTeacherId) || []
    }, [selectedFirstTeacherId, teachersData?.results])
    if (createPropositionsMutation.isSuccess) {
        setOpen(false)
    }

    if (!isOpen) return

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 block text-right">

                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Nouvelle Proposition</h2>
                        <div className="flex items-center gap-2">

                            <button
                                onClick={() => setOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-6 pb-0 overflow-y-auto max-h-[60vh] ">
                        <div className="mb-10 flex flex-col lg:flex-row gap-4 items-end max-w-4xl mx-auto ">
                            {/* Sélecteur Classe */}

                           
                                <SingleSelectDropdown
                                    className='flex-1 text-start'
                                    label="choisir une classe"
                                    options={classes.map((cl) => ({
                                        id: cl.id,
                                        value: cl.id,
                                        label: `${cl.class_name}-->(${cl.department_name})`
                                    }))}
                                    value={selectedClassId}
                                    onChange={(e) => setSelectedClassId(e)}
                                    placeholder={loadingClasses ? 'Chargement...' : `Choisir une classe dans laquelle vous voulez attribue (${classes.length}) `}
                                    searchPlaceholder="Rechercher..."
                                    required

                                />
                           

                                <SingleSelectDropdown
                                    className='flex-1 text-start'
                                    label="choisir un Cours"
                                    options={courses.map((c) => ({
                                        id: c.id,
                                        value: c.id,
                                        label: `${c.course_name} `
                                    }))}
                                    value={selectedCaurseId}
                                    onChange={(e) => setSelectedCaurseId(e)}
                                    placeholder={loadingCourses ? 'Chargement...' : `Choisir un cours a attribue (${courses.length})`}
                                    searchPlaceholder="Rechercher..."
                                    required
                                    disabled={!selectedClassId}

                                />
                           
                        </div>
                        <div className="mb-10 flex flex-col lg:flex-row gap-4 items-end max-w-4xl mx-auto">
                            {/* Sélecteur teachers */}


                           
                                <SingleSelectDropdown
                                    className='flex-1 text-start'
                                    label="Choisir un Enseignant principal"
                                    options={teachers.map((t) => ({
                                        id: t.id,
                                        value: t.id,
                                        label: `(${t.user_obj.first_name}) ${t.user_obj.last_name} ${t.user_obj.phone_number}`
                                    }))}
                                    value={selectedFirstTeacherId}
                                    onChange={(e) => setSelectedFirstTeacherId(e)}
                                    placeholder={loadingTeachers ? 'Chargement...' : `Choisir une classe dans laquelle vous voulez attribue (${teachers.length})`}
                                    searchPlaceholder="Rechercher..."
                                    required
                                    disabled={!selectedCaurseId}

                                />
                        


                            
                                <SingleSelectDropdown
                                    className='flex-1 text-start'
                                    label="Choisir un Enseignant secondaire"
                                    options={secondTeachers.map((t) => ({
                                        id: t.id,
                                        value: t.id,
                                        label: `(${t.user_obj.first_name}) ${t.user_obj.last_name} ${t.user_obj.phone_number}`
                                    }))}
                                    value={selectedSecondTeacherId}
                                    onChange={(e) => setSelectedSecondTeacherId(e)}
                                    placeholder={loadingTeachers ? 'Chargement...' : `Choisir un enseignant Secondaire (${secondTeachers.length})`}
                                    searchPlaceholder="Rechercher..."
                                    required
                                    disabled={!selectedFirstTeacherId}

                                />
                            
                        </div>

                    </div>
                    {
                        selectedClassId && selectedCaurseId && selectedFirstTeacherId && selectedSecondTeacherId && <Button
                            onClick={() => createPropositons({
                                course_id: selectedCaurseId,
                                principal_teacher_id: selectedFirstTeacherId,
                                substitute_teacher_id: selectedSecondTeacherId,
                                academic_year_id: selectedAcademicYear ? selectedAcademicYear.id : ""
                            })}
                            disabled={createPropositionsMutation.isPending}
                            variant="outline" className='inline-block dark:bg-gray-800 dark:text-white dark:border-gray-500 cursor-pointer dark:hover:bg-gray-600' >
                            {createPropositionsMutation.isPending ? 'En cours...' : 'Proposer'}
                        </Button>
                    }


                </div>
            </div>
        </div>
    )
}