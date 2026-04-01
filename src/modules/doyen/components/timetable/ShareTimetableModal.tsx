import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SingleSelectDropdown } from '@/components/ui/SingleSelectDropdown';
import { Modal } from '@/modules/admin/components/academic';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { useClassGroups } from '../../hooks/useTimetable';

interface ShareTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (groupIds: string[]) => void;
  classes: Array<{ id: string; class_name: string }>;
  loadingClasses: boolean;
  isLoading: boolean;
}

export default function ShareTimetableModal({
  isOpen,
  onClose,
  onConfirm,
  classes,
  loadingClasses,
  isLoading,
}: ShareTimetableModalProps) {
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [allSelectedGroups, setAllSelectedGroups] = useState<Array<{
    id: string;
    group_name: string;
    class_name: string;
  }>>([]);

  const { data: groupsData, isLoading: loadingGroups } = useClassGroups(
    { class_id: selectedClassId },
    { enabled: !!selectedClassId }
  );

  const groups = groupsData?.results || [];

  useEffect(() => {
    setSelectedGroupIds([]);
  }, [selectedClassId]);

  const handleGroupChange = (groupIds: string[]) => {
    setSelectedGroupIds(groupIds);
    
    const newGroups = groups.filter(g => groupIds.includes(g.id));
    const existingGroups = allSelectedGroups.filter(g => !groups.find(gr => gr.id === g.id));
    setAllSelectedGroups([...existingGroups, ...newGroups]);
  };

  const handleConfirm = () => {
    const allGroupIds = allSelectedGroups.map(g => g.id);
    if (allGroupIds.length > 0) {
      onConfirm(allGroupIds);
      setSelectedClassId('');
      setSelectedGroupIds([]);
      setAllSelectedGroups([]);
    }
  };

  const handleClose = () => {
    setSelectedClassId('');
    setSelectedGroupIds([]);
    setAllSelectedGroups([]);
    onClose();
  };

  const handleRemoveGroup = (groupId: string) => {
    setAllSelectedGroups(prev => prev.filter(g => g.id !== groupId));
    setSelectedGroupIds(prev => prev.filter(id => id !== groupId));
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Partager l'emploi du temps"
      subHeaderChildren="Sélectionnez le groupe avec lequel partager cet emploi du temps"
      onClose={handleClose}
    >
      <div className="space-y-4 py-4">
        <SingleSelectDropdown
          options={classes.map((cl) => ({
            id: cl.id,
            value: cl.id,
            label: cl.class_name,
          }))}
          value={selectedClassId}
          onChange={setSelectedClassId}
          placeholder={loadingClasses ? 'Chargement...' : 'Choisir une classe'}
          searchPlaceholder="Rechercher..."
          required
        />

        <MultiSelectDropdown
          options={groups.map((gr) => ({
            id: gr.id,
            value: gr.id,
            label: `${gr.group_name} (${gr.class_name})`,
          }))}
          values={selectedGroupIds}
          onChange={handleGroupChange}
          placeholder={loadingGroups ? 'Chargement...' : 'Choisir des groupes'}
          searchPlaceholder="Rechercher..."
          disabled={!selectedClassId || loadingGroups}
        />

        {allSelectedGroups.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Groupes sélectionnés ({allSelectedGroups.length}):</p>
            <div className="flex flex-wrap gap-2">
              {allSelectedGroups.map((group) => (
                <div
                  key={group.id}
                  className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 px-3 py-1 rounded-md"
                >
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {group.group_name} ({group.class_name})
                  </span>
                  <button
                    onClick={() => handleRemoveGroup(group.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className='space-x-1.5'>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={allSelectedGroups.length === 0 || isLoading}>
            {isLoading ? 'Partage...' : `Partager (${allSelectedGroups.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
