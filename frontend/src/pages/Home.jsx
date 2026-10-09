import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar.jsx';
import ResultCard from '../components/ResultCard.jsx';
import { searchTracks } from '../lib/api.js';
import './Home.css';

export default function Home({ currentTrackId, onPlay, onDownload }) {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const runSearch = async (query) => {
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
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
      <header className="home-header">
        <p className="home-eyebrow">Good to have you</p>
        <h1 className="home-title display">What are we playing today?</h1>
      </header>

      <SearchBar onSearch={runSearch} isSearching={isSearching} />

      {error && <p className="home-error">{error}</p>}

      {!hasSearched && !error && (
        <div className="home-empty">
          <p>Search any song, artist, or video and it'll show up here, ready to stream or download.</p>
        </div>
      )}

      {hasSearched && !isSearching && results.length === 0 && !error && (
        <div className="home-empty">
          <p>No results. Try a different search.</p>
        </div>
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
