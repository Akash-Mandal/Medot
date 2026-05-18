import React from 'react';
import { useTimer } from '../context/TimerContext';
import { Play, Pause, Square, SkipForward } from 'lucide-react';

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

export const Timer: React.FC = () => {
  const {
    config, activePhaseIndex, timeRemaining, isActive, isPaused,
    startTimer, pauseTimer, resetTimer, skipPhase, totalTime, totalTimeRemaining
  } = useTimer();

  const currentPhase = config.phases[activePhaseIndex];
  if (!currentPhase) return null;

  const phaseProgress = 1 - (timeRemaining / currentPhase.duration);
  const totalProgress = 1 - (totalTimeRemaining / totalTime);

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const phaseStrokeDashoffset = circumference - phaseProgress * circumference;

  const outerRadius = 135;
  const outerCircumference = 2 * Math.PI * outerRadius;
  const totalStrokeDashoffset = outerCircumference - totalProgress * outerCircumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md mx-auto">
      <div className="relative flex items-center justify-center w-80 h-80 mb-8">
        <svg className="absolute w-full h-full transform -rotate-90">
          {/* Total Progress Track */}
          <circle cx="160" cy="160" r={outerRadius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-200 dark:text-gray-700" />
          {/* Total Progress Line */}
          <circle cx="160" cy="160" r={outerRadius} stroke="currentColor" strokeWidth="4" fill="transparent"
            className="text-blue-500/50 transition-all duration-1000 ease-linear"
            strokeDasharray={outerCircumference} strokeDashoffset={totalStrokeDashoffset} />

          {/* Phase Progress Track */}
          <circle cx="160" cy="160" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
          {/* Phase Progress Line */}
          <circle cx="160" cy="160" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent"
            className="text-purple-600 dark:text-purple-400 transition-all duration-1000 ease-linear"
            strokeDasharray={circumference} strokeDashoffset={phaseStrokeDashoffset} strokeLinecap="round" />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{currentPhase.name}</div>
          <div className="text-5xl font-bold font-mono tracking-tighter text-gray-900 dark:text-white">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Phase {activePhaseIndex + 1} of {config.phases.length}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button onClick={resetTimer} className="p-3 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
          <Square size={24} />
        </button>
        {(!isActive || isPaused) ? (
          <button onClick={startTimer} className="p-5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30">
            <Play size={32} className="ml-1" />
          </button>
        ) : (
          <button onClick={pauseTimer} className="p-5 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/30">
            <Pause size={32} />
          </button>
        )}
        <button onClick={skipPhase} className="p-3 rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
          <SkipForward size={24} />
        </button>
      </div>
    </div>
  );
};
