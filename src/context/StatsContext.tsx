import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { SessionStats } from '../types';

interface StatsContextType {
  stats: SessionStats[];
  addSession: (session: SessionStats) => void;
  clearStats: () => void;
  getStreak: () => number;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const StatsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<SessionStats[]>(() => {
    const saved = localStorage.getItem('medito_stats');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('medito_stats', JSON.stringify(stats));
  }, [stats]);

  const addSession = (session: SessionStats) => {
    setStats((prev) => [...prev, session]);
  };

  const clearStats = () => {
    setStats([]);
  };

  const getStreak = () => {
    if (stats.length === 0) return 0;

    // Simple streak calculation
    const sortedDates = [...new Set(stats.map(s => s.date.split('T')[0]))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

    let currentDate = new Date(sortedDates[0]);
    for (let i = 0; i < sortedDates.length; i++) {
      const d = new Date(sortedDates[i]);
      const diffTime = Math.abs(currentDate.getTime() - d.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        currentDate = d;
      } else {
        break;
      }
    }
    return streak;
  };

  return (
    <StatsContext.Provider value={{ stats, addSession, clearStats, getStreak }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
};
