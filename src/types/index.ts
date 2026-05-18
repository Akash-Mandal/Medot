export interface Phase {
  id: string;
  name: string;
  duration: number; // in seconds
}

export interface SessionConfig {
  phases: Phase[];
}

export interface Settings {
  darkMode: boolean;
  soundEnabled: boolean;
  apiKey: string;
  model: string;
}

export interface SessionStats {
  id: string;
  date: string;
  duration: number; // in seconds
  completed: boolean;
}
