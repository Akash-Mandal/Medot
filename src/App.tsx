import { useState } from 'react';
import { Timer } from './components/Timer';
import { PhaseManager } from './components/PhaseManager';
import { SettingsPanel } from './components/SettingsPanel';
import { StatsPanel } from './components/StatsPanel';
import { Settings, Timer as TimerIcon, List, BarChart2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'timer' | 'phases' | 'stats' | 'settings'>('timer');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Medito
          </h1>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('timer')}
              className={`p-2 rounded-md flex items-center gap-2 transition-colors ${activeTab === 'timer' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <TimerIcon size={20} /> <span className="hidden sm:inline">Timer</span>
            </button>
            <button
              onClick={() => setActiveTab('phases')}
              className={`p-2 rounded-md flex items-center gap-2 transition-colors ${activeTab === 'phases' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <List size={20} /> <span className="hidden sm:inline">Phases</span>
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`p-2 rounded-md flex items-center gap-2 transition-colors ${activeTab === 'stats' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <BarChart2 size={20} /> <span className="hidden sm:inline">Stats</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`p-2 rounded-md flex items-center gap-2 transition-colors ${activeTab === 'settings' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
              <Settings size={20} /> <span className="hidden sm:inline">Settings</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'timer' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Timer />
          </div>
        )}
        {activeTab === 'phases' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PhaseManager />
          </div>
        )}
        {activeTab === 'stats' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StatsPanel />
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SettingsPanel />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
