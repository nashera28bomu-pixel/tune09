import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cymor-tune-downloads';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

function save(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (_) {
    /* storage unavailable - history just won't persist this session */
  }
}

export default function useDownloadHistory() {
  const [history, setHistory] = useState(load);

  useEffect(() => { save(history); }, [history]);

  const addEntry = useCallback((track, format) => {
    setHistory(prev => [
      { ...track, format, downloadedAt: Date.now() },
      ...prev.filter(e => !(e.id === track.id && e.format === format))
    ].slice(0, 100));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addEntry, clearHistory };
}
