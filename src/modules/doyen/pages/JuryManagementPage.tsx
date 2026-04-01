/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { JurySessionsTab } from '../components/jury/JurySessionsTab';
import { JuryDecisionsTab } from '../components/jury/JuryDecisionsTab';
import { GradeComplaintsTab } from '../components/jury/GradeComplaintsTab';

export function JuryManagementPage() {
  const [activeTab, setActiveTab] = useState('sessions');

  const tabs = [
    { id: 'sessions', label: 'Sessions de Jury' },
    { id: 'decisions', label: 'Décisions' },
    { id: 'complaints', label: 'Réclamations' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Gestion des Jurys
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Gérer les sessions de jury, décisions et réclamations de notes
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'sessions' && <JurySessionsTab />}
          {activeTab === 'decisions' && <JuryDecisionsTab />}
          {activeTab === 'complaints' && <GradeComplaintsTab />}
        </div>
      </div>
    </div>
  );
}
