/* eslint-disable @typescript-eslint/no-explicit-any */
import { X, Merge, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface MergeListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  merges: any[];
  onViewMerge: (mergeId: string) => void;
  onDeleteMerge: (mergeId: string) => void;
}

export default function MergeListDrawer({
  isOpen,
  onClose,
  merges,
  onViewMerge,
  onDeleteMerge
}: MergeListDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/30 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Merge size={18} />
              Fusions créées
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {merges.length} fusion{merges.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {merges.length === 0 ? (
            <div className="text-center py-12">
              <Merge className="w-12 h-12 mx-auto mb-4 opacity-50 text-gray-400" />
              <p className="text-sm text-gray-500">Aucune fusion créée</p>
            </div>
          ) : (
            merges.map((merge) => (
              <div
                key={merge.id}
                className="p-3 border-2 border-purple-300 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:shadow-md transition cursor-pointer"
                onClick={() => {
                  onViewMerge(merge.id);
                  onClose();
                }}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Merge className="w-4 h-4 text-purple-600" />
                      <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        FUSION
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMerge(merge.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Supprimer"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                    {merge.name}
                  </h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <p className="flex items-center gap-1">
                      <Calendar size={12} />
                      {merge.timetables?.length || 0} emplois du temps
                    </p>
                    <p>
                      Créé le {new Date(merge.created_at || merge.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
