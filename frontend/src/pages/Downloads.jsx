import { downloadUrl } from '../lib/api.js';
import './Downloads.css';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Downloads({ history, onClear, onRedownload }) {
  return (
    <div className="page downloads-page">
      <header className="downloads-header">
        <h1 className="display">Downloads</h1>
        {history.length > 0 && (
          <button className="clear-btn" onClick={onClear}>Clear</button>
        )}
      </header>

      {history.length === 0 ? (
        <div className="home-empty" style={{ margin: '12px 20px' }}>
          <p>Your download history shows up here once you save a track. This lists what you've downloaded — saved files live wherever your browser puts downloads.</p>
        </div>
      ) : (
        <div className="downloads-list">
          {history.map((entry, i) => (
            <div className="download-row" key={`${entry.id}-${entry.format}-${i}`}>
              <img src={entry.thumbnail} alt="" />
              <div className="download-meta">
                <p className="download-title">{entry.title}</p>
                <p className="download-sub">
                  <span className={`format-pill format-${entry.format}`}>{entry.format.toUpperCase()}</span>
                  {' '}· {timeAgo(entry.downloadedAt)}
                </p>
              </div>
              <a
                className="redownload-btn"
                href={downloadUrl(entry.url, entry.format)}
                onClick={() => onRedownload(entry)}
                aria-label="Download again"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 18.5h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
