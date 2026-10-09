import { motion, AnimatePresence } from 'framer-motion';
import './MiniPlayer.css';

export default function MiniPlayer({ track, isPlaying, progress, duration, onExpand, onToggle }) {
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <AnimatePresence>
      {track && (
        <motion.button
          className="mini-player"
          onClick={onExpand}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        >
          <div className="mini-progress" style={{ width: `${pct}%` }} />
          <img className="mini-art" src={track.thumbnail} alt="" />
          <div className="mini-meta">
            <p className="mini-title">{track.title}</p>
            <p className="mini-artist">{track.artist}</p>
          </div>
          <span
            className="mini-toggle"
            role="button"
            aria-label={isPlaying ? 'Pause' : 'Play'}
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
          >
            {isPlaying ? <PauseGlyph /> : <PlayGlyph />}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function PlayGlyph() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text)"><path d="M8 5v14l11-7z" /></svg>;
}
function PauseGlyph() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--text)"><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>;
}
