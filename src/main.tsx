import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SettingsProvider } from './context/SettingsContext'
import { StatsProvider } from './context/StatsContext'
import { TimerProvider } from './context/TimerContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <StatsProvider>
        <TimerProvider>
          <App />
        </TimerProvider>
      </StatsProvider>
    </SettingsProvider>
  </StrictMode>,
)
