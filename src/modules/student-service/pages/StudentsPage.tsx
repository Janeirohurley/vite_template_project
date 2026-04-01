import { useDeleteStudent, useStudents } from '../hooks/useStudentService';
import DataTable from '@/components/ui/DataTable';
import { useState } from 'react';
import { UserAvatar } from '@/components/common/UserAvatar';
import { Eye, MessageCircle, Phone, Users } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import type { Student } from '../types';
import { notify } from '@/lib';


export function StudentsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBackend, setFilterBackend] = useState({});
  const navigate = useNavigate(); // <-- ICI, au top level
  const { data: studentsData, isLoading, refetch } = useStudents(
    { search: searchTerm, ...filterBackend, page_size: itemsPerPage, page: currentPage }
  );


  const deleteStudentMutation = useDeleteStudent();


  const handleDeleteStudent = async (row: Student) => {
    try {
      await deleteStudentMutation.mutateAsync(row.id);
      notify.success('Student supprimée avec succès.');
      refetch?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      notify.error('Échec de la suppression de l\'Student.');
    }
  };
  // Transformation des données de l'API en format utilisable par le DataTable


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Gestion des Étudiants</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Total: {studentsData?.count} étudiants
        </p>
      </div>

      <DataTable
        tableId="students"
        columns={[
          {
            key: "profile_picture",
            label: "Profil",
            searchable: false,
            sortable: false,
            editable: false,
            filterable: false,
            render: (student, setImageModal) => (
              <UserAvatar
                onClick={() => setImageModal?.({ src: student.user_obj.profile_picture as string, alt: student.user })}
                size="sm"
                fullName={student.user_obj.first_name.concat(student.user_obj.first_name)}
                imageUrl={student.user_obj.profile_picture as string}
              />
            )

          },
          { key: 'matricule', label: 'Matricule', searchable: true },
          { key: 'first_name', label: 'Nom ', editable: true, accessor: "user_obj.first_name" },
          { key: 'last_name', label: 'Prenom ', accessor: "user_obj.last_name" },
          {
            key: "marital_status",
            label: "Status",
            accessor: "user_obj.marital_status",
            render: (student) => {
              switch (student.user_obj.marital_status) {
                case "S":
                  return "Célibataire";
                case "M":
                  return "Marié(e)";
                case "D":
                  return "Divorcé(e)";
                case "W":
                  return "Veuf / Veuve";
                default:
                  return "-";
              }
            },
          },
          {
            key: "gender",
            label: "Genre",
            accessor: "user_obj.gender",
            render: (student) => {
              const gender = student.user_obj.gender;

              switch (gender) {
                case "M":
                  return (
                    <span className="px-2 py-1 rounded-md text-xs font-medium
          bg-blue-100 text-blue-700
          dark:bg-blue-900/40 dark:text-blue-300">
                      Masculin
                    </span>
                  );
                case "F":
                  return (
                    <span className="px-2 py-1 rounded-md text-xs font-medium
          bg-pink-100 text-pink-700
          dark:bg-pink-100/20 dark:text-pink-300">
                      Féminin
                    </span>
                  );
                case "O":
                  return (
                    <span className="px-2 py-1 rounded-md text-xs font-medium
          bg-purple-100 text-purple-700
          dark:bg-purple-900/40 dark:text-purple-300">
                      Autre
                    </span>
                  );
                default:
                  return (
                    <span className="px-2 py-1 rounded-md text-xs font-medium
          bg-gray-100 text-gray-600
          dark:bg-gray-800 dark:text-gray-400">
                      -
                    </span>
                  );
              }
            },

          },

          {
            key: 'email',
            label: 'Email',
            render: (student) => {
              const email = student.user_obj.email;

              if (!email) return '-';

              return (
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline
                   dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {email}
                </a>
              );
            },
          },
          {
            key: 'phone_number',
            label: 'Téléphone',
            render: (student) => {
              const phone = student.user_obj.phone_number;

              if (!phone) return '-';

              const cleanPhone = phone.replace(/\s+/g, '');

              return (
                <div className="flex flex-col gap-1">
                  {/* Appel */}
                  <a
                    href={`tel:${cleanPhone}`}
                    className="flex items-center gap-2 text-blue-600 hover:underline
                     dark:text-blue-400 dark:hover:text-blue-300"
                    title="Appeler"
                  >
                    <Phone size={14} />
                    <span className="text-xs">{phone}</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/${cleanPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 hover:underline
                     dark:text-green-400 dark:hover:text-green-300"
                    title="WhatsApp"
                  >
                    <MessageCircle size={14} />
                    <span className="text-xs">WhatsApp</span>
                  </a>
                </div>
              );
            },
          },


          { key: 'colline_name', label: 'Colline' },
          { key: 'cam', label: 'CAM' },
          {
            key: 'parent',
            label: 'Parents',
            accessor: 'parent_obj',
            render: (student) => {
              const parents = student.parent_obj;

              // Rendu si pas de parents
              if (!parents || parents.length === 0) {
                return <span className="text-gray-400  text-xs ml-4">Aucun</span>;
              }

              return (
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate({
                        to: '/student-service/parents/list',
                        // Si vous utilisez des Search Params (recommandé pour les listes) :
                        search: (prev) => ({ ...prev, studentId: student.id }),
                        // OU si vous utilisez des Path Params :
                        // params: { id: student.id } 
                      });
                    }}
                    className="
            group flex items-center gap-2 px-3 py-1.5 
            text-sm font-medium text-indigo-600 
            bg-indigo-50 hover:bg-indigo-100 
            dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 
            rounded-lg transition-all duration-200 ease-in-out
            border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700
          "
                    title={`Voir les ${parents.length} parents`}
                  >
                    <Users size={16} className="transition-transform group-hover:scale-110" />

                    <span>Parents</span>

                    {/* Pastille discrète pour le nombre */}
                    <span className="
            flex h-5 min-w-5 items-center justify-center px-1
            rounded-md bg-white/80 dark:bg-indigo-950/50 
            text-[10px] font-bold shadow-sm border border-indigo-100 dark:border-indigo-800
          ">
                      {parents.length}
                    </span>
                  </button>
                </div>
              );
            },
            editable: false,
            sortable: false
          },
          {
            key: "actions",
            label: "Dossier", // Capitalisé pour plus de propreté
            render: (row) => ( // Ajout de row pour accéder aux données si besoin
              <div className="flex items-center justify-center">
                <button
                  onClick={() => console.log("Voir le dossier de :", row)}
                  className="
          group flex items-center gap-2 px-3 py-1.5 
          text-sm font-medium text-blue-600 
          bg-blue-50 hover:bg-blue-100 
          dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 
          rounded-lg transition-all duration-200 ease-in-out
          border border-transparent hover:border-blue-200 dark:hover:border-blue-700
        "
                  title="Consulter le dossier"
                >
                  <Eye
                    size={16}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span>Voir le dossier</span>
                </button>
              </div>
            ),
            editable: false,
            sortable: false
          }



        ]}
        data={studentsData || []}
        getRowId={(row) => row.id}
        isLoading={isLoading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        onSearchChange={setSearchTerm}
        onBackendFiltersChange={setFilterBackend}
        onDeleteRow={handleDeleteStudent}
        isPaginated
      />
    </div>
  );
}
