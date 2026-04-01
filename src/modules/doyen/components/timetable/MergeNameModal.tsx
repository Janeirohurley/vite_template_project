import { useState } from 'react';
import { X, Merge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MergeNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  selectedCount: number;
  isLoading?: boolean;
}

export default function MergeNameModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount,
  isLoading = false,
}: MergeNameModalProps) {
  const [mergeName, setMergeName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mergeName.trim() && !isLoading) {
      onConfirm(mergeName.trim());
      setMergeName('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Merge className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Nommer la fusion
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mergeName">Nom de la fusion *</Label>
            <Input
              id="mergeName"
              value={mergeName}
              onChange={(e) => setMergeName(e.target.value)}
              placeholder="Ex: Emploi du temps BAC I - Semestre 1"
              required
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              {selectedCount} emplois du temps seront fusionnés
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? 'Fusion en cours...' : 'Fusionner'}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
