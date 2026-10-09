import { motion } from 'framer-motion';
import './ResultCard.css';

export default function ResultCard({ track, isPlaying, onPlay, onDownload }) {
  return (
    <motion.div
      className={`result-card ${isPlaying ? 'is-playing' : ''}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button className="result-thumb" onClick={onPlay} aria-label={`Play ${track.title}`}>
        <img src={track.thumbnail} alt="" loading="lazy" />
        <span className="result-thumb-overlay">
          {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
        </span>
      </button>
      <button className="result-info" onClick={onPlay}>
        <p className="result-title">{track.title}</p>
        <p className="result-artist">{track.artist} · {track.duration}</p>
      </button>
      <button className="result-download" onClick={onDownload} aria-label="Download">
        <DownloadGlyph />
      </button>
    </motion.div>
  );
}

function PlayGlyph() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ink)"><path d="M8 5v14l11-7z" /></svg>;
}
function PauseGlyph() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ink)"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
}
function DownloadGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3v11m0 0l-4-4m4 4l4-4M5 18.5h14" stroke="var(--text)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
