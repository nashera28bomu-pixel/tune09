import { motion } from 'framer-motion';
import './FullPlayer.css';

function formatTime(sec) {
  if (!Number.isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function FullPlayer({ track, isPlaying, progress, duration, isBuffering, onClose, onToggle, onSeek, onNext, onPrev, onDownload }) {
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <motion.div
      className="full-player"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 32 }}
    >
      <div className="full-player-backdrop" style={{ backgroundImage: `url(${track.thumbnail})` }} />
      <div className="full-player-scrim" />

      <div className="full-player-content">
        <div className="full-player-topbar">
          <button className="icon-btn" onClick={onClose} aria-label="Minimize player">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <p className="full-player-eyebrow">Now Playing</p>
          <button className="icon-btn" onClick={onDownload} aria-label="Download">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v11m0 0l-4-4m4 4l4-4M5 18.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>

        <motion.div
          className="full-player-art"
          animate={{ scale: isPlaying ? 1 : 0.94 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <img src={track.thumbnail} alt="" />
          {isBuffering && <div className="art-spinner" />}
        </motion.div>

        <div className="full-player-meta">
          <h2 className="full-player-title">{track.title}</h2>
          <p className="full-player-artist">{track.artist}</p>
        </div>

        <div className="seek-row">
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={progress}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="seek-bar"
            style={{ '--pct': `${pct}%` }}
            aria-label="Seek"
          />
          <div className="seek-times">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="transport">
          <button className="icon-btn" onClick={onPrev} aria-label="Previous">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h2v12H6zM19 6v12l-9-6z" /></svg>
          </button>
          <button className="play-pause" onClick={onToggle} aria-label={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
          </button>
          <button className="icon-btn" onClick={onNext} aria-label="Next">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6h2v12h-2zM5 6v12l9-6z" /></svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function PlayGlyph() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--ink)"><path d="M8 5v14l11-7z" /></svg>;
}
function PauseGlyph() {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--ink)"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
}
