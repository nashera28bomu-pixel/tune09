import { motion } from 'framer-motion';
import './BottomNav.css';

const TABS = [
  { id: 'home', label: 'Home', icon: HomeIcon },
  { id: 'downloads', label: 'Downloads', icon: DownloadIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon }
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav">
      {TABS.map(tab => {
        const Icon = tab.icon;
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-item ${isActive ? 'is-active' : ''}`}
            onClick={() => onChange(tab.id)}
            aria-label={tab.label}
            aria-current={isActive}
          >
            {isActive && (
              <motion.span className="nav-pill" layoutId="nav-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
            )}
            <Icon active={isActive} />
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M4 11.5L12 4l8 7.5M6 10v9a1 1 0 001 1h3v-5a2 2 0 012-2 2 2 0 012 2v5h3a1 1 0 001-1v-9"
        stroke={active ? 'var(--ink)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 18.5h14" stroke={active ? 'var(--ink)' : 'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SettingsIcon({ active }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={active ? 'var(--ink)' : 'currentColor'} strokeWidth="1.8" />
      <path d="M19.4 13.5a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6v.2a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1h-.2a2 2 0 110-4h.1A1.7 1.7 0 004.6 7.1a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3h.1a1.7 1.7 0 001-1.6v-.2a2 2 0 114 0v.1a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9v.1a1.7 1.7 0 001.6 1h.2a2 2 0 110 4h-.1a1.7 1.7 0 00-1.6 1z"
        stroke={active ? 'var(--ink)' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
