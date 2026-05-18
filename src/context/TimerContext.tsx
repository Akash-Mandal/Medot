import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { Phase, SessionConfig } from '../types';
import { useSettings } from './SettingsContext';

interface TimerContextType {
  config: SessionConfig;
  updateConfig: (config: SessionConfig) => void;
  activePhaseIndex: number;
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  totalTime: number;
  totalTimeRemaining: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipPhase: () => void;
}

const defaultPhases: Phase[] = [
  { id: '1', name: 'Puvarma', duration: 120 },
  { id: '2', name: 'Focus', duration: 900 },
  { id: '3', name: 'Awareness', duration: 180 },
];

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  const [config, setConfig] = useState<SessionConfig>(() => {
    const saved = localStorage.getItem('medito_config');
    return saved ? JSON.parse(saved) : { phases: defaultPhases };
  });

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('medito_config', JSON.stringify(config));
  }, [config]);

  // Reset time remaining when active phase changes and not running
  useEffect(() => {
    if (!isActive && !isPaused && config.phases[activePhaseIndex]) {
      setTimeRemaining(config.phases[activePhaseIndex].duration);
    }
  }, [activePhaseIndex, config, isActive, isPaused]);

  const totalTime = config.phases.reduce((acc, phase) => acc + phase.duration, 0);

  const totalTimeRemaining = config.phases.slice(activePhaseIndex + 1).reduce((acc, phase) => acc + phase.duration, 0) + timeRemaining;

  const playNotification = () => {
    if (settings.soundEnabled) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1.5);
      } catch (e) {
        console.log('Audio error:', e);
      }
    }

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }
  };

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = window.setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (activePhaseIndex === config.phases.length - 1) {
              // End of session
              const saved = localStorage.getItem('medito_stats');
              const stats = saved ? JSON.parse(saved) : [];
              const statsSession = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                duration: config.phases.reduce((acc, p) => acc + p.duration, 0),
                completed: true
              };
              localStorage.setItem('medito_stats', JSON.stringify([...stats, statsSession]));
            }
            playNotification();

            if (activePhaseIndex < config.phases.length - 1) {
              setActivePhaseIndex(i => i + 1);
              return config.phases[activePhaseIndex + 1].duration;
            } else {
              setIsActive(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused, activePhaseIndex, config]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setActivePhaseIndex(0);
    if (config.phases.length > 0) {
      setTimeRemaining(config.phases[0].duration);
    }
  };

  const skipPhase = () => {
    if (activePhaseIndex < config.phases.length - 1) {
      setActivePhaseIndex(i => i + 1);
      setTimeRemaining(config.phases[activePhaseIndex + 1].duration);
    } else {
      resetTimer();
    }
  };

  const updateConfig = (newConfig: SessionConfig) => {
    setConfig(newConfig);
    resetTimer();
  };

  return (
    <TimerContext.Provider value={{
      config,
      updateConfig,
      activePhaseIndex,
      timeRemaining,
      isActive,
      isPaused,
      totalTime,
      totalTimeRemaining,
      startTimer,
      pauseTimer,
      resetTimer,
      skipPhase
    }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
