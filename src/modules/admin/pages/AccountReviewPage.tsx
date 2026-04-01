import { useEffect, useMemo, useState } from 'react';
import {
    AlertTriangle,
    Calendar,
    Check,
    CheckCircle,
    FileText,
    Info,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    ShieldX,
    User,
    X,
    XCircle,
} from 'lucide-react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAccountRequestById, useReviewAccountRequest, useRoleRequirements, useUpdateDocumentStatus } from '../hooks/useAccountRequests';
import type { DocumentStatus, ReviewAccountData, UpdateDocumentStatusData } from '../types/accountRequestTypes';
import { notify } from '@/lib/toast';
import { useGetRoles } from '@/hooks/useGetRoles';
import type { DocumentRequirement } from '@/modules/guest/types';
import { Modal } from '@/components/ui/Modal';

const statusLabelMap: Record<string, { label: string; className: string }> = {
    pending: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    under_review: { label: 'En examen', className: 'bg-blue-50 text-blue-700 border-blue-200 dark:border-blue-800' },
    approved: { label: 'Approuvée', className: 'bg-green-50 text-green-700 border-green-200' },
    rejected: { label: 'Refusée', className: 'bg-red-50 text-red-700 border-red-200' },
};

const decisionLabelMap: Record<DocumentStatus, { label: string; className: string }> = {
    pending: { label: 'À vérifier', className: 'bg-amber-50 text-amber-700 border-amber-200' },
    accepted: { label: 'Accepté', className: 'bg-green-50 text-green-700 border-green-200' },
    rejected: { label: 'Refusé', className: 'bg-red-50 text-red-700 border-red-200' },
};

const formatDate = (value?: string) =>
    value ? new Date(value).toLocaleDateString('fr-FR') : '-';

export function AccountReviewPage() {
    const navigate = useNavigate();
    const { id } = useSearch({ strict: false }) as { id: string };
    const { data: user, isPending } = useAccountRequestById(id);
    const reviewAccountMutation = useReviewAccountRequest();
    const updateDocumentStatusMutation = useUpdateDocumentStatus();
    const { data: rolesData } = useGetRoles({ pagination: false });

    const [decisions, setDecisions] = useState<Record<string, UpdateDocumentStatusData>>({});
    const [accountRejectionReason, setAccountRejectionReason] = useState('');
    const [accountRejectTouched, setAccountRejectTouched] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean;
        type: 'info' | 'success' | 'danger' | 'warning';
        title: string;
        description?: string;
        confirmLabel?: string;
        onConfirm?: () => void | Promise<void>;
    }>({
        open: false,
        type: 'info',
        title: '',
        description: '',
        confirmLabel: 'Confirmer',
        onConfirm: undefined,
    });

    useEffect(() => {
        if (!user) return;
        setDecisions(prev => {
            if (Object.keys(prev).length > 0) return prev;
            const initial: Record<string, UpdateDocumentStatusData> = {};
            user.documents.forEach(doc => {
                if (doc.status !== 'pending') {
                    initial[doc.id] = { status: doc.status, comment: doc.comment };
                }
            });
            return initial;
        });
    }, [user]);

    const documents = user?.documents ?? [];
    const roles = Array.isArray(rolesData) ? rolesData : [];
    const resolvedRole = useMemo(() => {
        if (!user) return undefined;
        return roles.find(
            role => role.id === user.requested_role || role.name === user.requested_role
        );
    }, [roles, user]);
    const requestedRoleName = resolvedRole?.name || user?.requested_role || '';
    const requestedRoleDescription = resolvedRole?.description || '';
    const roleId = resolvedRole?.id;

    const {
        data: roleRequirements = [],
        isLoading: isLoadingRequirements,
    } = useRoleRequirements(roleId);

    const requirementByType = useMemo(
        () => new Map<string, DocumentRequirement>(roleRequirements.map(req => [req.type as string, req])),
        [roleRequirements]
    );

    const documentsByType = useMemo(
        () => new Map(documents.map(doc => [doc.type, doc])),
        [documents]
    );

    const missingRequiredDocs = roleRequirements.filter(
        req => req.required && !documentsByType.get(req.type)
    );
    const requiredCount = roleRequirements.filter(req => req.required).length;
    const uploadedRequiredCount = roleRequirements.filter(
        req => req.required && documentsByType.get(req.type)
    ).length;

    const getDocumentDecision = (docId: string) =>
        decisions[docId] || { status: 'pending' as DocumentStatus };

    const setDecision = (docId: string, status: DocumentStatus, comment?: string) => {
        setDecisions(prev => ({
            ...prev,
            [docId]: { status, comment },
        }));
    };

    const resetDecision = (docId: string) => {
        setDecisions(prev => {
            const next = { ...prev };
            delete next[docId];
            return next;
        });
    };

    const decisionSummary = documents.reduce(
        (acc, doc) => {
            const status = getDocumentDecision(doc.id).status;
            acc[status] += 1;
            return acc;
        },
        { accepted: 0, rejected: 0, pending: 0 } as Record<DocumentStatus, number>
    );

    const rejectedDocsMissingReason = documents.filter(doc => {
        const decision = getDocumentDecision(doc.id);
        return decision.status === 'rejected' && !decision.comment?.trim();
    });

    const canApprove =
        documents.length > 0 &&
        decisionSummary.pending === 0 &&
        decisionSummary.rejected === 0 &&
        (roleRequirements.length === 0 || missingRequiredDocs.length === 0);

    const canRejectAccount =
        accountRejectionReason.trim().length > 0 && rejectedDocsMissingReason.length === 0;

    const decisionsForReview = useMemo(() => {
        const payload: Record<string, UpdateDocumentStatusData> = {};
        documents.forEach(doc => {
            const decision = getDocumentDecision(doc.id);
            if (decision.status !== 'pending') {
                payload[doc.id] = decision;
            }
        });
        return payload;
    }, [documents, decisions]);

    const openConfirmModal = (config: {
        type: 'info' | 'success' | 'danger' | 'warning';
        title: string;
        description?: string;
        confirmLabel?: string;
        onConfirm: () => void | Promise<void>;
    }) => {
        setConfirmModal({
            open: true,
            type: config.type,
            title: config.title,
            description: config.description,
            confirmLabel: config.confirmLabel || 'Confirmer',
            onConfirm: config.onConfirm,
        });
    };

    const closeConfirmModal = () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
    };

    const handleConfirmAction = async () => {
        const action = confirmModal.onConfirm;
        closeConfirmModal();
        if (action) {
            await action();
        }
    };

    const handleDocumentAccept = (docId: string) => {
        if (!user) return;
        openConfirmModal({
            type: 'success',
            title: "Confirmer l'acceptation",
            description: 'Voulez-vous accepter ce document ?',
            confirmLabel: 'Accepter',
            onConfirm: async () => {
                try {
                    await updateDocumentStatusMutation.mutateAsync({
                        requestId: user.id,
                        documentId: docId,
                        data: { status: 'accepted' },
                    });
                    setDecision(docId, 'accepted');
                    notify.success('Document accepte');
                } catch {
                    notify.error('Erreur lors de la mise a jour du document');
                }
            },
        });
    };

    const handleDocumentRejectConfirm = (docId: string) => {
        if (!user) return;
        const decision = getDocumentDecision(docId);
        const comment = decision.comment?.trim() || '';
        if (!comment) {
            notify.error('Veuillez preciser le motif du refus pour ce document.');
            return;
        }
        openConfirmModal({
            type: 'danger',
            title: 'Confirmer le refus',
            description: 'Voulez-vous refuser ce document ?',
            confirmLabel: 'Refuser',
            onConfirm: async () => {
                try {
                    await updateDocumentStatusMutation.mutateAsync({
                        requestId: user.id,
                        documentId: docId,
                        data: { status: 'rejected', comment },
                    });
                    setDecision(docId, 'rejected', comment);
                    notify.success('Document refuse');
                } catch {
                    notify.error('Erreur lors de la mise a jour du document');
                }
            },
        });
    };

    const handleDocumentReset = (docId: string) => {
        if (!user) return;
        openConfirmModal({
            type: 'warning',
            title: 'Remettre en attente',
            description: 'Voulez-vous remettre ce document en attente ?',
            confirmLabel: 'Remettre',
            onConfirm: async () => {
                try {
                    await updateDocumentStatusMutation.mutateAsync({
                        requestId: user.id,
                        documentId: docId,
                        data: { status: 'pending' },
                    });
                    resetDecision(docId);
                    notify.success('Document remis en attente');
                } catch {
                    notify.error('Erreur lors de la mise a jour du document');
                }
            },
        });
    };

    const handleApprove = async () => {
        if (!user) return;
        if (!canApprove) {
            notify.error('Tous les documents doivent etre acceptes pour valider le compte.');
            return;
        }
        openConfirmModal({
            type: 'success',
            title: "Confirmer l'approbation",
            description: 'Voulez-vous approuver ce compte ?',
            confirmLabel: 'Approuver',
            onConfirm: async () => {
                const reviewData: ReviewAccountData = {
                    status: 'approved',
                    documents: decisionsForReview,
                };

                try {
                    await reviewAccountMutation.mutateAsync({ requestId: user.id, data: reviewData });
                    notify.success('Compte approuve');
                    navigate({ to: '/admin/account-requested' });
                } catch {
                    notify.error('Erreur lors de la validation');
                }
            },
        });
    };

    const handleReject = async () => {
        if (!user) return;
        setAccountRejectTouched(true);

        if (!accountRejectionReason.trim()) {
            notify.error('Veuillez preciser le motif du refus du compte.');
            return;
        }

        if (rejectedDocsMissingReason.length > 0) {
            notify.error('Veuillez preciser le motif pour chaque document refuse.');
            return;
        }

        openConfirmModal({
            type: 'danger',
            title: 'Confirmer le refus',
            description: 'Voulez-vous refuser ce compte ?',
            confirmLabel: 'Refuser',
            onConfirm: async () => {
                const reviewData: ReviewAccountData = {
                    status: 'rejected',
                    documents: decisionsForReview,
                    rejection_reason: accountRejectionReason.trim(),
                };

                try {
                    await reviewAccountMutation.mutateAsync({ requestId: user.id, data: reviewData });
                    notify.success('Demande refusee');
                    navigate({ to: '/admin/account-requested' });
                } catch {
                    notify.error('Erreur lors du refus');
                }
            },
        });
    };
    const orderedDocuments = useMemo(() => {
        return [...documents].sort((a, b) => a.name.localeCompare(b.name));
    }, [documents]);

    if (isPending) {
        return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center">Demande introuvable</div>;
    }

    const statusBadge = statusLabelMap[user.status] || statusLabelMap.pending;
    const confirmActionClass =
        confirmModal.type === 'danger'
            ? 'bg-red-600 hover:bg-red-700'
            : confirmModal.type === 'warning'
                ? 'bg-amber-500 hover:bg-amber-600'
                : confirmModal.type === 'success'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-blue-600 hover:bg-blue-700';

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50">
            <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
                <header className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                {user.profile_image_url ? (
                                    <img
                                        src={user.profile_image_url}
                                        alt={`${user.first_name} ${user.last_name}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-7 h-7 text-slate-400 dark:text-slate-500" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                                    {user.first_name} {user.last_name}
                                </h1>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    {user.email} · Soumis le {formatDate(user.submitted_at)}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                    <span className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200">
                                        Rôle demandé : {requestedRoleName}
                                    </span>
                                    <span className={`px-2 py-1 rounded-md border ${statusBadge.className}`}>
                                        {statusBadge.label}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => navigate({ to: '/admin/account-requested' })}
                                className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800"
                            >
                                Retour
                            </button>
                        </div>
                    </div>
                </header>

                <section className="grid gap-4 lg:grid-cols-3">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                            Informations personnelles
                        </h2>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <span>{user.email}</span>
                            </div>
                            {user.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    <span>{user.phone}</span>
                                </div>
                            )}
                            {user.birth_date && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    <span>{formatDate(user.birth_date)}</span>
                                </div>
                            )}
                            {user.address && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    <span>{user.address}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                            Résumé du dossier
                        </h2>
                        <div className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
                            <div className="flex items-center justify-between">
                                <span>Documents reçus</span>
                                <span className="font-medium">
                                    {documents.length}
                                </span>
                            </div>
                            {roleRequirements.length > 0 && (
                                <div className="flex items-center justify-between">
                                    <span>Documents obligatoires</span>
                                    <span className="font-medium">
                                        {uploadedRequiredCount} / {requiredCount}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between">
                                <span>Acceptés</span>
                                <span className="font-medium text-green-600">
                                    {decisionSummary.accepted}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Refusés</span>
                                <span className="font-medium text-red-600">
                                    {decisionSummary.rejected}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>À vérifier</span>
                                <span className="font-medium text-amber-600">
                                    {decisionSummary.pending}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-slate-500 dark:text-slate-400 dark:text-slate-500" />
                            Règles de validation
                        </h2>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                                Tous les documents doivent être acceptés pour approuver le compte.
                            </li>
                            <li className="flex items-start gap-2">
                                <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                                Un motif est obligatoire pour chaque document refusé.
                            </li>
                            <li className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                                Le compte peut être refusé à tout moment avec un motif clair.
                            </li>
                        </ul>
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contexte de la demande</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Les documents visibles ci-dessous proviennent directement du backend pour cet utilisateur.
                            </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300">
                            {documents.length} document(s) soumis
                        </span>
                    </div>

                    {requestedRoleDescription && (
                        <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                            <span className="font-medium text-slate-700 dark:text-slate-200">Description du rôle :</span> {requestedRoleDescription}
                        </div>
                    )}

                    {isLoadingRequirements && (
                        <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                            Chargement des exigences du rôle demandé...
                        </div>
                    )}

                    {!isLoadingRequirements && !roleId && (
                        <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            Impossible de charger les exigences du rôle. Le rôle demandé n’a pas été trouvé.
                        </div>
                    )}

                    {!isLoadingRequirements && roleId && roleRequirements.length === 0 && (
                        <div className="text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
                            Aucune exigence de documents n’a été retournée pour ce rôle.
                        </div>
                    )}

                    {!isLoadingRequirements && roleRequirements.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-slate-800">Documents requis (obligatoires et optionnels)</h3>
                                <span className="text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300">
                                    {uploadedRequiredCount} / {requiredCount} obligatoires reçus
                                </span>
                            </div>

                            <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                {roleRequirements.map(req => {
                                    const uploadedDoc = documentsByType.get(req.type);
                                    const status = uploadedDoc
                                        ? { label: 'Reçu', className: 'bg-green-50 text-green-700 border-green-200' }
                                        : req.required
                                            ? { label: 'Manquant', className: 'bg-red-50 text-red-700 border-red-200' }
                                            : { label: 'Optionnel', className: 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800' };
                                    const formats = req.accepted_formats?.length
                                        ? req.accepted_formats.map((f) => f.split('/')[1]?.toUpperCase() || f.toUpperCase()).join(', ')
                                        : 'Tous formats';

                                    return (
                                        <div key={req.type} className="p-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="font-medium text-slate-900 dark:text-slate-100">{req.label}</span>
                                                    {req.required && (
                                                        <span className="text-xs text-red-600">Obligatoire</span>
                                                    )}
                                                    <span className={`text-xs px-2 py-1 rounded-md border ${status.className}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">{req.description}</p>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 flex flex-wrap gap-3">
                                                    <span>Type : {req.type}</span>
                                                    <span>Max : {req.max_size} Mo</span>
                                                    <span>Formats : {formats}</span>
                                                </div>
                                            </div>
                                            {uploadedDoc && (
                                                <div className="flex items-center gap-2">
                                                    <a
                                                        href={uploadedDoc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                                                    >
                                                        Voir le document
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!isLoadingRequirements && roleRequirements.length > 0 && missingRequiredDocs.length > 0 && (
                        <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            <div>
                                <p className="font-medium">Documents obligatoires manquants</p>
                                <p className="text-xs mt-1">
                                    {missingRequiredDocs.map(doc => doc.label).join(', ')}
                                </p>
                            </div>
                        </div>
                    )}
                </section>
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Documents reçus</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Vérifiez chaque document et décidez de l’accepter ou de le refuser.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {orderedDocuments.map(doc => {
                            const requirement = requirementByType.get(doc.type);
                            const decision = getDocumentDecision(doc.id);
                            const decisionBadge = decisionLabelMap[decision.status];
                            const missingReason =
                                decision.status === 'rejected' && !decision.comment?.trim();

                            return (
                                <div
                                    key={doc.id}
                                    className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 shadow-sm"
                                >
                                    <div className="flex flex-col gap-4 lg:flex-row">
                                        <div className="w-full lg:w-28 lg:h-28 h-40 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
                                            {doc.preview_url ? (
                                                <img
                                                    src={doc.preview_url}
                                                    alt={doc.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <FileText className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-2">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                                                        {requirement?.label || doc.name}
                                                    </h3>
                                                    {requirement?.description && (
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
                                                            {requirement.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <span className={`text-xs px-2 py-1 rounded-md border ${decisionBadge.className}`}>
                                                    {decisionBadge.label}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                                                <span>Nom : {doc.name}</span>
                                                <span>Type : {doc.type}</span>
                                                <span>Reçu le : {formatDate(doc.uploaded_at)}</span>
                                                {requirement?.required && (
                                                    <span className="text-red-600">Obligatoire</span>
                                                )}
                                            </div>

                                            {decision.status === 'rejected' && (
                                                <div className="mt-3">
                                                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                                                        Motif du refus
                                                    </label>
                                                    <textarea
                                                        value={decision.comment || ''}
                                                        onChange={e => setDecision(doc.id, 'rejected', e.target.value)}
                                                        placeholder="Expliquez clairement pourquoi ce document est refusé."
                                                        rows={2}
                                                        className={`w-full text-xs rounded-md border shadow-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 ${missingReason
                                                                ? 'border-red-300'
                                                                : 'border-slate-200 dark:border-slate-800'
                                                            }`}
                                                    />
                                                    {missingReason && (
                                                        <p className="text-xs text-red-600 mt-1">
                                                            Le motif est obligatoire pour valider le refus.
                                                        </p>
                                                    )}
                                                    <button
                                                        onClick={() => handleDocumentRejectConfirm(doc.id)}
                                                        disabled={updateDocumentStatusMutation.isPending}
                                                        className="mt-2 w-full py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
                                                    >
                                                        Confirmer le refus
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2 w-full lg:w-44">
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="py-2 text-center text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-md hover:bg-blue-50"
                                            >
                                                Voir le fichier
                                            </a>
                                            <button
                                                onClick={() => handleDocumentAccept(doc.id)}
                                                disabled={updateDocumentStatusMutation.isPending}
                                                className={`py-2 text-xs font-medium rounded-md border transition-colors ${decision.status === 'accepted'
                                                        ? 'bg-green-100 text-green-800 border-green-200'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-green-50'
                                                    }`}
                                            >
                                                Accepter
                                            </button>
                                            <button
                                                onClick={() => setDecision(doc.id, 'rejected', decision.comment || '')}
                                                disabled={updateDocumentStatusMutation.isPending}
                                                className={`py-2 text-xs font-medium rounded-md border transition-colors flex items-center justify-center gap-1 ${decision.status === 'rejected'
                                                        ? 'bg-red-100 text-red-800 border-red-200'
                                                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-50'
                                                    }`}
                                            >
                                                <X className="w-3 h-3" />
                                                Refuser
                                            </button>
                                            {decision.status !== 'pending' && (
                                                <button
                                                    onClick={() => handleDocumentReset(doc.id)}
                                                    disabled={updateDocumentStatusMutation.isPending}
                                                    className="py-2 text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:text-slate-200"
                                                >
                                                    Remettre en attente
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Décision finale</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Choisissez d’approuver ou de refuser la demande une fois la vérification terminée.
                        </p>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-2">
                        <div className="border border-red-200 bg-red-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 text-red-700">
                                <ShieldX className="w-4 h-4" />
                                <h3 className="font-semibold">Refuser la demande</h3>
                            </div>
                            <p className="text-sm text-red-700">
                                Vous pouvez refuser le compte à tout moment. Le motif est obligatoire.
                            </p>
                            <textarea
                                value={accountRejectionReason}
                                onChange={e => setAccountRejectionReason(e.target.value)}
                                placeholder="Motif du refus du compte..."
                                rows={3}
                                className={`w-full text-sm rounded-md border shadow-sm focus:ring-2 focus:ring-red-200 focus:border-red-400 ${accountRejectTouched && !accountRejectionReason.trim()
                                        ? 'border-red-300'
                                        : 'border-red-200'
                                    }`}
                            />
                            {accountRejectTouched && !accountRejectionReason.trim() && (
                                <p className="text-xs text-red-600">
                                    Merci de préciser le motif du refus.
                                </p>
                            )}
                            {rejectedDocsMissingReason.length > 0 && (
                                <p className="text-xs text-red-600">
                                    Certains documents refusés n’ont pas de motif.
                                </p>
                            )}
                            <button
                                onClick={handleReject}
                                disabled={!canRejectAccount || reviewAccountMutation.isPending}
                                className={`w-full py-2 rounded-md text-sm font-medium text-white transition-colors ${canRejectAccount
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-red-300 cursor-not-allowed'
                                    }`}
                            >
                                {reviewAccountMutation.isPending ? 'Traitement...' : 'Refuser le compte'}
                            </button>
                        </div>

                        <div className="border border-green-200 bg-green-50 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-2 text-green-700">
                                <ShieldCheck className="w-4 h-4" />
                                <h3 className="font-semibold">Valider le compte</h3>
                            </div>
                            <p className="text-sm text-green-700">
                                L’approbation est possible uniquement si tous les documents sont acceptés.
                            </p>
                            <div className="text-xs text-green-800 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Check className="w-3 h-3" />
                                    {decisionSummary.accepted} document(s) accepté(s)
                                </div>
                                <div className="flex items-center gap-2">
                                    <X className="w-3 h-3" />
                                    {decisionSummary.pending} document(s) à vérifier
                                </div>
                                <div className="flex items-center gap-2">
                                    <X className="w-3 h-3" />
                                    {decisionSummary.rejected} document(s) refusé(s)
                                </div>
                            </div>
                            <button
                                onClick={handleApprove}
                                disabled={!canApprove || reviewAccountMutation.isPending}
                                className={`w-full py-2 rounded-md text-sm font-medium text-white transition-colors ${canApprove
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-green-300 cursor-not-allowed'
                                    }`}
                            >
                                {reviewAccountMutation.isPending ? 'Traitement...' : 'Approuver le compte'}
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <Modal
                open={confirmModal.open}
                type={confirmModal.type}
                title={confirmModal.title}
                description={confirmModal.description}
                onClose={closeConfirmModal}
                actions={(
                    <>
                        <button
                            onClick={closeConfirmModal}
                            className="px-4 py-2 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirmAction}
                            className={`px-4 py-2 text-sm font-medium rounded-md text-white ${confirmActionClass}`}
                        >
                            {confirmModal.confirmLabel || 'Confirmer'}
                        </button>
                    </>
                )}
            />
        </div>
    );
}
