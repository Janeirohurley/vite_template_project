import { CustomDatePicker } from "@/components/ui/CustomDatePicker"
import FolderCard from "@/components/ui/FolderCard"
import { Input } from "@/components/ui/input"
import { SingleSelectDropdown } from "@/components/ui/SingleSelectDropdown"
import { StatsCard, type StatsCardProps } from "@/components/ui/StatsCard"
import StatsGridLoader from "@/components/ui/StatsGridLoader"
import { useNavigate } from "@tanstack/react-router"
import { Dock, Loader, User, Users } from "lucide-react"
import { useState, useMemo, useEffect, useRef } from "react"
import { useAccountRequests, useAccountRequestStats, useMarkAsUnderReview } from "../hooks/useAccountRequests"
import type { AccountRequestStatus, AccountRequestListItem } from "../types/accountRequestTypes"
export function AccountRequestedPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<AccountRequestStatus | ''>('');
    const [dateFilter, setDateFilter] = useState<Date | undefined>();
    const [allData, setAllData] = useState<AccountRequestListItem[]>([]);
    const observerRef = useRef<HTMLDivElement>(null);

    const { data: statsData, isPending: statsLoading } = useAccountRequestStats();
    const { data: requestsData, isPending: requestsLoading } = useAccountRequests({
        page,
        page_size: itemsPerPage,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        date: dateFilter?.toISOString().split('T')[0],
    });

    console.log({ requestsData })
    const markAsUnderReviewMutation = useMarkAsUnderReview();

    useEffect(() => {
        if (requestsData?.results) {
            setAllData(prev => page === 1 ? requestsData.results : [...prev, ...requestsData.results]);
        }
    }, [requestsData, page]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !requestsLoading && requestsData?.next) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [requestsLoading, requestsData]);

    const resetFilters = () => {
        setPage(1);
        setAllData([]);
    };

    const handleFolderClick = async (folderId: string, currentStatus: AccountRequestStatus) => {
        if (currentStatus !== 'under_review') {
            try {
                await markAsUnderReviewMutation.mutateAsync(folderId);
            } catch {
                // Continue navigation even if marking fails
            }
        }
        navigate({ to: "/admin/account-review", search: { id: folderId } });
    };

    const dashboardAcount: StatsCardProps[] = useMemo(() => [
        {
            label: "Account",
            value: statsData?.total_requests.toString() || "0",
            change: "Total Demande",
            icon: Users,
            color: "blue",
        },
        {
            label: "Type de compte",
            value: statsData?.total_account_types.toString() || "0",
            change: "Total de compte demande",
            icon: Users,
            color: "green",
        },
        {
            label: "Compte",
            value: statsData?.pending_review.toString() || "0",
            change: "Total de compte non review",
            icon: Loader,
            color: "purple",
        },
        {
            label: "Documents",
            value: statsData?.total_documents.toString() || "0",
            change: "Total de Document demande",
            icon: Dock,
            color: "purple",
        },
        {
            label: "Documents",
            value: statsData?.rejected_documents.toString() || "0",
            change: "Total de Document refusee",
            icon: Dock,
            color: "red",
        },
        {
            label: "Account",
            value: statsData?.rejected_accounts.toString() || "0",
            change: "Total de compte refusee",
            icon: User,
            color: "red",
        },
    ], [statsData]);

    const isLoading = statsLoading || requestsLoading;
    const folderData = allData;
    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestion des Demandes</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">La verification et approbation des compte demande</p>
            </div>
            <StatsGridLoader
                isPending={isLoading}
                data={dashboardAcount ?? []} // évite les erreurs si undefined
                renderItem={(stat, index) => (
                    <StatsCard
                        key={stat.label} // tu peux garder ta clé ici si tu veux
                        {...stat}
                        delay={index * 0.1}
                    />
                )}
            />

            {/* filter  */}
            {isLoading ? (
                <FilterSkeleton />
            ) : (
                <div className="flex justify-between my-10">
                    <Input
                        placeholder="Recherche le par dossier"
                        className="w-1/3"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            resetFilters();
                        }}
                    />
                    <div className="w-1/2 flex">
                        <SingleSelectDropdown
                            onChange={(value) => {
                                setStatusFilter(value as AccountRequestStatus);
                                resetFilters();
                            }}
                            options={[
                                { id: '1', value: '', label: 'Tous les statuts' },
                                { id: '2', value: 'pending', label: 'En attente' },
                                { id: '3', value: 'under_review', label: 'En révision' },
                                { id: '4', value: 'approved', label: 'Approuvé' },
                                { id: '5', value: 'rejected', label: 'Rejeté' },
                            ]}
                            placeholder="Choisir pour filtrer un dossier"
                            className=" flex-1 mr-1.5"
                        />
                        <CustomDatePicker
                            placeholder="Filter par date"
                            onChange={(date) => {
                                setDateFilter(date ? new Date(date) : undefined);
                                resetFilters();
                            }}
                            className="flex-1"
                        />
                    </div>

                </div>
            )}

            <div className="py-3.5 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">

                {isLoading && page === 1
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <FolderCardSkeleton key={i} />
                    ))
                    : folderData.map((folder) => (
                        <FolderCard
                            key={folder.id}
                            fullName={folder.full_name}
                            requested_role={folder.requested_role}
                            status={folder.status}
                            date={new Date(folder.submitted_at).toLocaleString('fr-FR')}
                            avatarUrl={folder.profile_image_url}
                            isLoading={markAsUnderReviewMutation.isPending}
                            onClick={() => handleFolderClick(folder.id, folder.status)}
                        />
                    ))
                }

                {requestsLoading && page > 1 && Array.from({ length: 5 }).map((_, i) => (
                    <FolderCardSkeleton key={`loading-${i}`} />
                ))}

            </div>

            <div ref={observerRef} className="h-10" />


            {/* ================empty====================== */}
            {folderData.length === 0 && !isLoading &&
                <div className="w-1/2 mx-auto p-10">
                    <FolderCard
                        fullName=""
                        status="pending"
                        key={0}
                        requested_role=""
                        empty
                        className="justify-center flex"

                    />

                </div>
            }

        </div>
    )
}


const FolderCardSkeleton = () => {
    return (
        <div className="w-60 h-40 rounded-xl border border-gray-200 dark:border-gray-800 p-4
                    bg-white dark:bg-gray-900 animate-pulse flex flex-col justify-between">

            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800" />

                <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="h-2 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
                </div>
            </div>

            <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
    );
};

const FilterSkeleton = () => {
    return (
        <div className="flex justify-between animate-pulse">
            <div className="h-10 w-1/3 rounded-md bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-1/4 rounded-md bg-gray-200 dark:bg-gray-800" />
        </div>
    );
};
