import DataTable from "@/components/ui/DataTable";
import { useParentsList } from "../hooks";
import { useState } from "react";
import { useSearch } from "@tanstack/react-router";

export function ParentsPage() {
    const [currentPage, SetCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")
    const [backendFilters, setBackendFilters] = useState({})
    const { studentId } = useSearch({ from: '/student-service/parents/list' })
    const { data, isLoading, } = useParentsList({ page: currentPage, page_size: itemsPerPage, student_id: studentId, search: searchQuery, ...backendFilters });
    return (
        <div className="space-y-6">
            {/* En-tête */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Gestion des Parents Étudiants</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        Suivi et gestion des parents des étudiants
                    </p>
                </div>
            </div>

            {/* Contenu principal */}



            <DataTable
                getRowId={(row) => row.id}
                tableId="parents-list"
                columns={[
                    { label: 'Nom', key: 'parent_name' },
                    { label: 'Telephone', key: 'parent_phone' },
                    { label: 'Email', key: 'parent_email' },
                    { label: 'Proffession', key: 'profession_name', accessor: "profession.profession_name" },
                    { label: 'personne de contact', key: 'is_contact_person', type: "boolean",searchable:false,render:(row)=>row.is_contact_person?"Oui":"Non" },
                    { label: 'en vie', key: 'is_alive', type: "boolean" ,searchable:false,render:(row)=>row.is_alive?"Oui":"Non"},
                ]}
                data={data || []}
                isLoading={isLoading}
                isPaginated={true}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                currentPage={currentPage}
                setCurrentPage={SetCurrentPage}
                onSearchChange={setSearchQuery}
                onBackendFiltersChange={setBackendFilters}
            />
        </div>
    )
}