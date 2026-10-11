import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from '../components/SearchBar.jsx';
import ResultCard from '../components/ResultCard.jsx';
import { searchTracks } from '../lib/api.js';
import './Home.css';

const CHIPS = ['Afrobeats', 'Gospel', 'Amapiano', 'Hip Hop', 'Bongo', 'Gengetone', 'Top Hits 2026', 'Chill'];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home({ currentTrackId, onPlay, onDownload }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState('');

  const runSearch = async (query) => {
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    setLastQuery(query);
    try {
      const tracks = await searchTracks(query);
      setResults(tracks);
    } catch (err) {
      setError('Could not search right now. Check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="page home-page">
      <div className="home-hero">
        <div className="hero-bars" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map(i => (
            <span key={i} className="hero-bar" style={{ animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <p className="home-eyebrow">{greeting()}</p>
        <h1 className="home-title display">What are we{'\u00A0'}playing today?</h1>
      </div>

      <SearchBar onSearch={runSearch} isSearching={isSearching} />

      {!hasSearched && (
        <div className="chip-row">
          {CHIPS.map(chip => (
            <button key={chip} className="chip" onClick={() => runSearch(chip)}>{chip}</button>
          ))}
        </div>
      )}

      {error && <p className="home-error">{error}</p>}

      {hasSearched && !isSearching && results.length === 0 && !error && (
        <div className="home-empty">
          <p>No results for "{lastQuery}". Try a different search.</p>
        </div>
      )}

      {hasSearched && results.length > 0 && (
        <p className="results-heading">Results for "{lastQuery}"</p>
      )}

      <div className="results-list">
        <AnimatePresence>
          {results.map(track => (
            <ResultCard
              key={track.id}
              track={track}
              isPlaying={currentTrackId === track.id}
              onPlay={() => onPlay(track, results)}
              onDownload={() => onDownload(track)}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
