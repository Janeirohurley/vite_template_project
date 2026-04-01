import React, { useState } from 'react';
import type { HighSchool, CreateHighSchoolData } from '../types';

interface HighSchoolFormProps {
  highschool?: HighSchool;
  onSubmit: (data: CreateHighSchoolData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function HighSchoolForm({ highschool, onSubmit, onCancel, isLoading }: HighSchoolFormProps) {
  const [form, setForm] = useState<CreateHighSchoolData>({
    hs_name: highschool?.hs_name || '',
    zone_id: highschool?.zone?.id || '',
    code: highschool?.code || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Nom du lycée</label>
        <input
          name="hs_name"
          value={form.hs_name}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Zone ID</label>
        <input
          name="zone_id"
          value={form.zone_id}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Code</label>
        <input
          name="code"
          value={form.code || ''}
          onChange={handleChange}
          className="w-full border rounded px-2 py-1"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
