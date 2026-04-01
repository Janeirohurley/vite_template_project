import { useState, useEffect } from 'react';
import { Clock, Trash2, Play } from 'lucide-react';
import { getAllIncompleteUserDrafts, deleteUserDraft, type UserCreationDraft } from '@/lib/userCreationDB';
import { notify } from '@/lib';

interface UserCreationDraftsProps {
  onResumeDraft: (draft: UserCreationDraft) => void;
  refreshTrigger?: number;
}

export function UserCreationDrafts({ onResumeDraft, refreshTrigger }: UserCreationDraftsProps) {
  const [drafts, setDrafts] = useState<UserCreationDraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDrafts = async () => {
    try {
      const incompleteDrafts = await getAllIncompleteUserDrafts();
      setDrafts(incompleteDrafts);
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

  const handleDeleteDraft = async (sessionId: string) => {
    try {
      await deleteUserDraft(sessionId);
      await loadDrafts();
      notify.success('Brouillon supprimé');
    } catch (error) {
      console.error('Error deleting draft:', error);
      notify.error('Erreur lors de la suppression');
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
        <p className="text-sm">Aucune création en cours</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Créations non terminées ({drafts.length})
      </h3>
      
      <div className="space-y-2">
        {drafts.map((draft) => (
          <div
            key={draft.sessionId}
            className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {draft.title}
                </h4>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                  Étape {draft.currentStep}/2
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {draft.userData.email || 'Email non renseigné'} • Dernière modification: {formatDate(draft.updatedAt)}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onResumeDraft(draft)}
                className="p-2 text-green-600 hover:text-green-700 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                title="Reprendre la création"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteDraft(draft.sessionId)}
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
