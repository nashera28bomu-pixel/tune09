import { useState } from 'react';
import { motion } from 'framer-motion';
import { downloadUrl } from '../lib/api';
import './DownloadSheet.css';

export default function DownloadSheet({ track, onClose, onDownloaded }) {
  const [activeFormat, setActiveFormat] = useState(null);

  const startDownload = (format) => {
    setActiveFormat(format);
    const link = document.createElement('a');
    link.href = downloadUrl(track.url, format);
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownloaded(track, format);
    setTimeout(() => { setActiveFormat(null); onClose(); }, 900);
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <motion.div
        className="sheet"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      >
        <div className="sheet-handle" />
        <div className="sheet-track">
          <img src={track.thumbnail} alt="" />
          <div>
            <p className="sheet-title">{track.title}</p>
            <p className="sheet-artist">{track.artist}</p>
          </div>
        </div>

        <p className="sheet-label">Choose a format</p>

        <div className="format-grid">
          <button className="format-card" onClick={() => startDownload('mp3')} disabled={!!activeFormat}>
            <WaveIcon />
            <span className="format-name">MP3</span>
            <span className="format-sub">Audio only</span>
            {activeFormat === 'mp3' && <span className="format-check">✓</span>}
          </button>
          <button className="format-card" onClick={() => startDownload('mp4')} disabled={!!activeFormat}>
            <FilmIcon />
            <span className="format-name">MP4</span>
            <span className="format-sub">Video</span>
            {activeFormat === 'mp4' && <span className="format-check">✓</span>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function WaveIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M3 12h2m3-5v10m3-14v18m3-14v10m3-6v2m2-2v2" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function FilmIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="var(--gold)" strokeWidth="1.8" />
      <path d="M10 9l6 3-6 3V9z" fill="var(--gold)" />
    </svg>
  );
}
