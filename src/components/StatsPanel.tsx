import React from 'react';
import { useStats } from '../context/StatsContext';
import { Trophy, Calendar, Clock, Activity } from 'lucide-react';

export const StatsPanel: React.FC = () => {
  const { stats, getStreak, clearStats } = useStats();

  const totalSessions = stats.filter(s => s.completed).length;
  const totalMinutes = Math.floor(stats.reduce((acc, s) => acc + (s.completed ? s.duration : 0), 0) / 60);

  return (
    <div className="w-full max-w-md mx-auto mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Progress</h2>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl flex flex-col items-center justify-center">
          <Trophy className="text-purple-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{getStreak()}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Day Streak</span>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex flex-col items-center justify-center">
          <Calendar className="text-blue-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalSessions}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sessions</span>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl flex flex-col items-center justify-center col-span-2">
          <Clock className="text-green-500 mb-2" size={24} />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">{totalMinutes} <span className="text-lg font-medium text-gray-500">min</span></span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Time Meditated</span>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">History</h3>
        <button onClick={clearStats} className="text-xs text-red-500 hover:text-red-700">Clear Data</button>
      </div>

      <div className="mt-4 space-y-3 max-h-48 overflow-y-auto pr-2">
        {stats.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-sm">No sessions recorded yet. Start meditating!</div>
        ) : (
          [...stats].reverse().map(session => (
            <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity size={16} className={session.completed ? "text-green-500" : "text-gray-400"} />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-200">
                  {new Date(session.date).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.floor(session.duration / 60)} min
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
