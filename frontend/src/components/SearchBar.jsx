import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch, isSearching }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  };

  return (
    <form className="search-bar" onSubmit={submit}>
      <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        inputMode="search"
        placeholder="Search for a song, artist..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {isSearching && <span className="search-spinner" aria-label="Searching" />}
    </form>
  );
}
