import { X, Merge, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mergeId: string) => void;
  availableMerges: any[];
  timetableName: string;
}

export default function AddToMergeModal({
  isOpen,
  onClose,
  onConfirm,
  availableMerges,
  timetableName
}: AddToMergeModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Ajouter à une fusion
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Sélectionnez une fusion pour y ajouter "{timetableName}"
        </p>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {availableMerges.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Aucune fusion disponible
            </p>
          ) : (
            availableMerges.map((merge) => (
              <button
                key={merge.id}
                onClick={() => {
                  onConfirm(merge.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 transition"
              >
                <div className="flex items-center gap-2">
                  <Merge size={16} className="text-purple-600" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900 dark:text-white">{merge.name}</p>
                    <p className="text-xs text-gray-500">
                      {merge.timetable_ids?.length || merge.timetableIds?.length || 0} emplois du temps
                    </p>
                  </div>
                </div>
                <Plus size={16} className="text-gray-400" />
              </button>
            ))
          )}
        </div>

        <div className="mt-4">
          <Button variant="outline" onClick={onClose} className="w-full">
            Annuler
          </Button>
        </div>
      </div>
    </>
  );
}
