import { motion } from 'framer-motion';
import { X, Search } from 'lucide-react';

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  hasFilters: boolean;
  onClearFilters: () => void;
  children?: React.ReactNode;
}

export function FilterBar({
  searchValue,
  onSearchChange,
  hasFilters,
  onClearFilters,
  children,
}: FilterBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {hasFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50"
          >
            <X size={16} />
            Réinitialiser
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
}
