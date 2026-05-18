import { useState } from 'react';
import { useTimer } from '../context/TimerContext';
import type { Phase } from '../types';
import { Plus, Trash2, GripVertical, Download, Upload, Wand2, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { generateSequenceWithAI } from '../utils/ai';

export const PhaseManager = () => {
  const { config, updateConfig } = useTimer();
  const { settings } = useSettings();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const addPhase = () => {
    const newPhase: Phase = {
      id: Date.now().toString(),
      name: 'New Phase',
      duration: 300,
    };
    updateConfig({ phases: [...config.phases, newPhase] });
  };

  const removePhase = (id: string) => {
    updateConfig({ phases: config.phases.filter(p => p.id !== id) });
  };

  const updatePhase = (id: string, updates: Partial<Phase>) => {
    updateConfig({
      phases: config.phases.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const exportConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "meditation_sequence.json");
    dlAnchorElem.click();
  };

  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string);
          if (imported && Array.isArray(imported.phases)) {
            updateConfig(imported);
          }
        } catch (error) {
          console.error("Invalid JSON format");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
        <h3 className="text-sm font-bold text-purple-800 dark:text-purple-300 mb-2 flex items-center gap-2"><Wand2 size={16}/> AI Sequence Generator</h3>
        {settings.apiKey ? (
          <div className="flex gap-2">
            <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="E.g., A 15 minute sequence for deep sleep" className="flex-1 px-3 py-2 text-sm border border-purple-200 dark:border-purple-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
            <button onClick={async () => {
              if (!aiPrompt) return;
              setIsGenerating(true);
              try {
                const result = await generateSequenceWithAI(settings.apiKey, settings.model, aiPrompt);
                if (result && result.phases) updateConfig(result);
                setAiPrompt('');
              } catch (e) {
                alert("Failed to generate sequence. Check API key and quota.");
              } finally {
                setIsGenerating(false);
              }
            }} disabled={isGenerating} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2">
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : "Generate"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-purple-600 dark:text-purple-400">Please enter your OpenAI API key in Settings to use the AI generator.</p>
        )}
      </div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Session Sequence</h2>
        <div className="flex gap-2">
          <label className="cursor-pointer p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Upload size={20} />
            <input type="file" accept=".json" className="hidden" onChange={importConfig} />
          </label>
          <button onClick={exportConfig} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
            <Download size={20} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {config.phases.map((phase) => (
          <div key={phase.id} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
            <GripVertical size={16} className="text-gray-400 cursor-grab" />
            <div className="flex-1 grid grid-cols-2 gap-3">
              <input
                type="text"
                value={phase.name}
                onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={Math.floor(phase.duration / 60)}
                onChange={(e) => updatePhase(phase.id, { duration: parseInt(e.target.value) * 60 })}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1 text-sm text-center"
                min="1"
              />
            </div>
            <button onClick={() => removePhase(phase.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addPhase} className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl text-gray-500 hover:text-gray-700 hover:border-gray-400 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500 transition-colors">
        <Plus size={20} /> Add Phase
      </button>
    </div>
  );
};
