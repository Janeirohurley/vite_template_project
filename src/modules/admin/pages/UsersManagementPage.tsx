

import { useState, useMemo } from "react";
import { useUsers, useUpdateUser, useDeleteUser, useBulkDeleteUsers, useUploadProfilePicture } from "../hooks/useUsers";
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useDebounce } from "@/hooks/useDebounce";
import { GENDER_OPTIONS, GENDER_LABELS, MARITAL_STATUS_OPTIONS, MARITAL_STATUS_LABELS, SPOKEN_LANGUAGES_OPTIONS } from '@/modules/auth/constants/registerOptions';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Calendar,
    Clock,
    Users,
    UserCheck,
    UserX,
    Plus,
} from 'lucide-react';
import { UserAvatar } from "@/components/common/UserAvatar";
import getRoles from "@/api/getRoles";
import { transform } from "@/components/common/transformAny";
import DataTable from "@/components/ui/DataTable";
import StatsGridLoader from "@/components/ui/StatsGridLoader";
import { StatsCard } from "@/modules/doyen";
import { UserCreationWizard } from '../components/UserCreationWizard';
import { UserCreationDrafts } from '../components/UserCreationDrafts';
import type { UserCreationDraft } from '@/lib/userCreationDB';
import { notify, useSettings } from "@/lib";
import { UserCreationWithoutProfile } from "../components/UserCreationWithoutProfile";
import type { AdminUser } from "../types/adminUserTypes";


// Type pour les utilisateurs du tableau

export function UsersManagementPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [creatingUser, setCreatingUser] = useState(false);
    const [resumeDraft, setResumeDraft] = useState<UserCreationDraft | undefined>();
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { selectedAcademicYear } = useSettings()
    const [backendFiltred, setbackendFiltred] = useState({})
    const [orderingBankend, setorderingBankend] = useState("")

    // Debounce search term pour éviter les requêtes excessives
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Récupération des utilisateurs depuis l'API
    const { data: usersData, isLoading, isError, error: apiError, refetch } = useUsers({
        page: currentPage,
        page_size: itemsPerPage,
        search: debouncedSearchTerm || undefined,
        academic_year_id: selectedAcademicYear?.id || undefined,
        ordering: orderingBankend,
        ...backendFiltred
    });

    // Mutations pour les opérations CRUD
    const updateUserMutation = useUpdateUser();
    const deleteUserMutation = useDeleteUser();
    const bulkDeleteMutation = useBulkDeleteUsers();
    const uploadProfilePictureMutation = useUploadProfilePicture();


    const error = isError ? (apiError?.message || "Erreur lors du chargement des utilisateurs") : null;

    const { data: rolesData } = useQuery({
        queryKey: ['roles'],
        queryFn: getRoles
    });

    const Avaible_roles = useMemo(() => {
        if (!rolesData) return [];
        return transform(rolesData, {
            id: "id",
            label: "name",
            value: "id"
        }) as { value: string; label: string; }[];
    }, [rolesData]);


    // Gérer les actions groupées
    const handleBulkAction = async (action: string, selectedIds: Set<string>) => {
        console.log(`Bulk action: ${action}`, Array.from(selectedIds));

        if (action === 'delete') {
            if (confirm(`Êtes-vous sûr de vouloir supprimer ${selectedIds.size} utilisateur(s) ?`)) {
                try {
                    await bulkDeleteMutation.mutateAsync(Array.from(selectedIds));
                } catch (error) {
                    throw new Error("Erreur lors de la suppression des utilisateurs", { cause: error });
                }
            }
        } else {
            notify.info(`Action "${action}" non implémentée - ${selectedIds.size} utilisateur(s) sélectionné(s)`);
        }
    };

    // Ajouter un nouvel utilisateur
    const handleAddUser = () => {
        setCreatingUser(true);
    };
    const handleAddUserProfile = () => {
        setResumeDraft(undefined);
        setIsWizardOpen(true);
    };
    const handleResumeDraft = (draft: UserCreationDraft) => {
        setResumeDraft(draft);
        setIsWizardOpen(true);
    };

    const handleWizardComplete = () => {
        setIsWizardOpen(false);
        setResumeDraft(undefined);
        setRefreshTrigger(prev => prev + 1);
        queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    // Ajouter un utilisateur après une ligne spécifique (copie)
    const handleAddUserAfter = (afterUser: AdminUser) => {
        // Pour l'instant, cette fonctionnalité nécessite un formulaire complet
        notify.info(`Fonctionnalité en développement - Copie de ${afterUser.first_name}`);
    };

    // Supprimer un utilisateur
    const handleDeleteUser = async (user: AdminUser) => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer ${user.first_name} ?`)) {
            try {
                await deleteUserMutation.mutateAsync(user.id);
                alert(`${user.first_name} supprimé avec succès`);
            } catch (error) {
                throw new Error("Erreur lors de la suppression de l'utilisateur", { cause: error });
            }
        }
    };

    // Modifier une cellule
    const handleCellEdit = async (rowId: string | number, columnKey: string, newValue: string) => {
        try {
            // Mise à jour optimiste: on met à jour immédiatement l'UI
            // React Query va gérer l'invalidation et le rechargement

            if (columnKey === "role") {
                columnKey = "role_id"
            }
            await updateUserMutation.mutateAsync({
                id: String(rowId),
                userData: { [columnKey]: newValue }
            });
        } catch (error) {
            alert("Erreur lors de la mise à jour de l'utilisateur");
            throw new Error("Erreur lors de la mise à jour de l'utilisateur", { cause: error });
        }
    };

    const queryClient = useQueryClient();

    // Réorganiser les lignes
    const handleReorder = (newData: AdminUser[]) => {
        // Sauvegarde locale de l'ordre des lignes
        console.log('Data reordered locally:', newData.map(u => u.id).join(', '));

        // Mettre à jour le cache React Query avec les nouvelles données
        queryClient.setQueryData(['users'], (oldData: AdminUser) => {
            if (!oldData) return oldData;
            return {
                ...oldData,
                results: newData
            };
        });

        // Les données sont automatiquement sauvegardées dans IndexedDB par le DataTable
    };

    // Upload d'image pour un utilisateur
    const handleImageUpload = async (file: File, userId: string | number): Promise<string> => {
        try {
            return await uploadProfilePictureMutation.mutateAsync({
                file,
                userId: String(userId)
            });
        } catch (error) {
            throw new Error('Erreur lors de l\'upload de l\'image', { cause: error });
        }
    };

    // Calcul des statistiques côté frontend
    const statsData = useMemo(() => {
        if (!usersData?.results) return [];

        const total = usersData.results.length;
        const active = usersData.results.filter(user => user.is_active).length;
        const inactive = usersData.results.filter(user => !user.is_active).length;
        const pending = usersData.results.filter(user => !user.email_verified).length;

        return [
            {
                label: "Total Utilisateurs",
                value: total,
                icon: Users,
                color: "blue" as const,
                change: "-"
            },
            {
                label: "Utilisateurs Actifs",
                value: active,
                change: total > 0 ? `${Math.round((active / total) * 100)}%` : "0%",
                icon: UserCheck,
                color: "yellow" as const
            },
            {
                label: "Utilisateurs Inactifs",
                value: inactive,
                change: total > 0 ? `${Math.round((inactive / total) * 100)}%` : "0%",
                icon: UserX,
                color: "red" as const
            },
            {
                label: "En Attente",
                value: pending,
                change: total > 0 ? `${Math.round((pending / total) * 100)}%` : "0%",
                icon: Clock,
                color: "orange" as const
            }
        ];
    }, [usersData]);

    return <div className="w-full max-w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Créer et gérer les utilisateurs du système</p>
            </div>
            <Button onClick={handleAddUserProfile} className="bg-blue-600 hover:bg-blue-700">
                <Plus size={16} className="mr-2" />
                Créer Profile
            </Button>
        </div>

        {/* Drafts */}
        <div className="mb-6">
            <UserCreationDrafts onResumeDraft={handleResumeDraft} refreshTrigger={refreshTrigger} />
        </div>

        {/* Statistiques */}
        <div className="mb-6">
            <StatsGridLoader
                isPending={isLoading}
                data={statsData ?? []} // évite les erreurs si undefined
                renderItem={(stat, index) => (
                    <StatsCard
                        key={stat.label} // tu peux garder ta clé ici si tu veux
                        {...stat}
                        delay={index * 0.1}
                    />
                )}
            />
        </div>



        <DataTable
            tableId="users-management"
            columns={[
                {
                    key: "profile_picture",
                    label: "Avatar",
                    sortable: false,
                    searchable: false,
                    editable: true,
                    type: "image",
                    render: (user, setImageModal) => (
                        <UserAvatar
                            onClick={() => setImageModal?.({ src: user.profile_picture as string, alt: user.first_name })}
                            size="sm"
                            fullName={user.first_name.concat(user.last_name)}
                            imageUrl={user.profile_picture}
                        />
                    )
                },
                { key: "first_name", label: "Prénom", sortable: true, editable: true, type: "text", searchable: true },
                { key: "last_name", label: "Nom", sortable: true, editable: true, type: "text" },
                { key: "email", label: "Email", sortable: true, editable: false },
                { key: "phone_number", label: "Téléphone", sortable: true, editable: true, type: "text" },
                {
                    key: "gender",
                    label: "Genre",
                    sortable: true,
                    editable: true,
                    type: "select",
                    options: GENDER_OPTIONS,
                    render: (user) => {
                        return GENDER_LABELS[user.gender as keyof typeof GENDER_LABELS] || user.gender;
                    }
                },
                { key: "birth_date", label: "Date naissance", sortable: true, editable: true, type: "date" },
                { key: "nationality_name", label: "Nationalité", sortable: true, editable: true },

                {
                    key: "marital_status",
                    label: "État civil",
                    sortable: true,
                    editable: true,
                    type: "select",
                    options: MARITAL_STATUS_OPTIONS,
                    render: (user) => {
                        return MARITAL_STATUS_LABELS[user.marital_status as keyof typeof MARITAL_STATUS_LABELS] || user.marital_status;
                    }
                },
                {
                    key: "profile",
                    label: "profile",
                    editable: false,
                    render: (user) => {

                        return user.profile.map((e) => e.position).join()
                    }

                },

                {
                    key: "role",
                    label: "Rôle",
                    sortable: true,
                    editable: true,
                    type: "select",
                    options: Avaible_roles,
                    render: (user) => {
                        const roleColors = {
                            admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                            teacher: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            student: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
                            staff: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                            guest: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                        };
                        const roleColor = roleColors[user.role.name as keyof typeof roleColors] || roleColors.guest;
                        return (
                            <Badge className={roleColor}>
                                {user.role.name}
                            </Badge>
                        );
                    }
                },
                {
                    key: "faculty",
                    label: "Faculté",
                    sortable: true,
                    editable: true
                },
                {
                    key: "spoken_languages",
                    label: "Langues",
                    sortable: true,
                    editable: true,
                    type: "multiselect",
                    options: SPOKEN_LANGUAGES_OPTIONS
                },
                { key: "residence", label: "Résidence", sortable: true, editable: true, render: (row) => row.residence.map((r) => r.colline_name).join() },

                {
                    key: "email_verified",
                    label: "Email vérifié",
                    sortable: true,
                    editable: true,
                    type: "boolean",
                    searchable: false,
                },
                {
                    key: "is_active",
                    label: "Actif",
                    sortable: true,
                    editable: true,
                    type: "boolean",
                    searchable: false,
                },
                {
                    key: "requires_2fa",
                    label: "2FA Principal",
                    sortable: true,
                    editable: true,
                    type: "boolean",
                    searchable: false,
                },
                {
                    key: "requires_2fa_qr",
                    label: "2FA QR",
                    sortable: true,
                    editable: true,
                    type: "boolean",
                    searchable: false,
                },
                {
                    key: "requires_2fa_email",
                    label: "2FA Email",
                    sortable: true,
                    editable: true,
                    type: "boolean",
                    searchable: false,
                },
                {
                    key: "requires_2fa_static",
                    label: "2FA Code",
                    sortable: true,
                    editable: true,
                    type: "boolean",
                    searchable: false,
                },
                {
                    key: "created_at",
                    label: "Créé le",
                    sortable: true,
                    editable: false,
                    render: (user) => (
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>{new Date(user.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                    )
                },
                {
                    key: "last_login",
                    label: "Dernière connexion",
                    sortable: true,
                    editable: false,
                    render: (user) => (
                        user.last_login ? (
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <span>{new Date(user.last_login).toLocaleDateString('fr-FR')}</span>
                            </div>
                        ) : (
                            <span className="text-gray-400">Jamais</span>
                        )
                    )
                },
            ]}
            data={usersData || []}
            getRowId={(row) => row.id}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            onSearchChange={setSearchTerm}
            isLoading={isLoading}
            error={error}
            onBulkAction={handleBulkAction}
            onAddRow={handleAddUser}
            onAddRowAfter={handleAddUserAfter}
            onDeleteRow={handleDeleteUser}
            onCellEdit={handleCellEdit}
            onReorder={handleReorder}
            enableDragDrop={false}
            uploadFunction={handleImageUpload}
            isPaginated={true}
            onBackendFiltersChange={setbackendFiltred}
            onBackendOrderingChange={setorderingBankend}

        />

        {/* Wizard */}
        <UserCreationWizard
            isOpen={isWizardOpen}
            onClose={() => {
                setIsWizardOpen(false);
                setResumeDraft(undefined);
            }}
            onComplete={handleWizardComplete}
            resumeDraft={resumeDraft}
        />

        <UserCreationWithoutProfile
            isOpen={creatingUser}
            onClose={() => setCreatingUser(false)}
            onComplete={() => {
                refetch()
                setCreatingUser(false)
            }}

        />
    </div>

}