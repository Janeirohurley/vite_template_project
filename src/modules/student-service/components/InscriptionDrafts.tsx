import { useState, useEffect } from 'react';
import { Clock, Trash2, Play } from 'lucide-react';
import { getAllIncompleteDrafts, type InscriptionDraft } from '../../../lib/inscriptionDB';
import { deleteDraft } from '../../../lib/inscriptionDraftService';

import { notify } from '../../../lib';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { getInscriptionDraftsApi } from './inscriptionDraft/api/inscriptionDraftApi';

interface InscriptionDraftsProps {
  onResumeDraft: (draft: InscriptionDraft) => void;
  refreshTrigger?: number;
}

export function InscriptionDrafts({ onResumeDraft, refreshTrigger }: InscriptionDraftsProps) {
  const [drafts, setDrafts] = useState<InscriptionDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmStep, setDeleteConfirmStep] = useState<1 | 2>(1);
  const [pendingDeleteSessionId, setPendingDeleteSessionId] = useState<string | null>(null);

  const loadDrafts = async () => {
    try {
      // Synchronise les brouillons backend et locaux
      const backendDraftsResponse = await getInscriptionDraftsApi();
      const backendDrafts = backendDraftsResponse.results ?? [];
      const localDrafts = await getAllIncompleteDrafts();
      // Fusion simple : priorite au local, ajoute ceux du backend non presents
      const mergedDrafts = localDrafts.map(ld => {
        const match = backendDrafts.find(bd => bd.sessionId === ld.sessionId);
        if (match?.backendId && !ld.backendId) {
          return { ...ld, backendId: match.backendId };
        }
        return ld;
      });
      backendDrafts.forEach((bd: InscriptionDraft) => {
        if (!localDrafts.find(ld => ld.sessionId === bd.sessionId)) {
          mergedDrafts.push(bd);
        }
      });
      setDrafts(mergedDrafts);
    } catch (error) {
      console.error('Error loading drafts:', error);
      notify.error('Erreur lors du chargement des brouillons');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    loadDrafts();
  }, [refreshTrigger]);

  const openDeleteConfirm = (sessionId: string) => {
    setPendingDeleteSessionId(sessionId);
    setDeleteConfirmStep(1);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDraft = async () => {
    if (!pendingDeleteSessionId) return;
    try {
      await deleteDraft(pendingDeleteSessionId);
      await loadDrafts();
      notify.success('Brouillon supprime');
    } catch (error) {
      console.error('Error deleting draft:', error);
      notify.error('Erreur lors de la suppression');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeleteConfirmStep(1);
      setPendingDeleteSessionId(null);
    }
  };
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-sm text-gray-600">Chargement des brouillons...</span>
      </div>
    );
  }

  if (drafts.length === 0) {
    return (
      <div className="text-center p-4 text-gray-500 dark:text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Aucune inscription en cours</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          if (!open) {
            setDeleteConfirmStep(1);
            setPendingDeleteSessionId(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteConfirmStep === 1 ? 'Supprimer ce brouillon ?' : 'Confirmation finale'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirmStep === 1
                ? 'Cette action supprimera le brouillon local.'
                : 'Le brouillon sera supprime definitivement. Voulez-vous continuer ?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <button
              type="button"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteConfirmStep(1);
                setPendingDeleteSessionId(null);
              }}
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-300 bg-transparent px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={() => {
                if (deleteConfirmStep === 1) {
                  setDeleteConfirmStep(2);
                  return;
                }
                handleDeleteDraft();
              }}
              className={`inline-flex h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ${deleteConfirmStep === 2 ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {deleteConfirmStep === 1 ? 'Continuer' : 'Confirmer la suppression'}
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Inscriptions non terminées ({drafts.length})
      </h3>
      
      <div className="space-y-2">
        {drafts.map((draft) => (
          <div
            key={draft.sessionId}
            className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {draft.title} de {draft.formData.step1?.user_display}
                </h4>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-md dark:bg-blue-900/30 dark:text-blue-300">
                  Étape {draft.currentStep}/6
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Dernière modification: {formatDate(draft.updatedAt)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onResumeDraft(draft)}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Reprendre l'inscription"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => openDeleteConfirm(draft.sessionId)}
                className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                title="Supprimer le brouillon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
