const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export async function searchTracks(query) {
  const res = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  const data = await res.json();
  return data.results || [];
}

export function streamUrl(youtubeUrl) {
  return `${BASE_URL}/api/stream/audio?url=${encodeURIComponent(youtubeUrl)}`;
}

export function downloadUrl(youtubeUrl, format) {
  return `${BASE_URL}/api/download/${format}?url=${encodeURIComponent(youtubeUrl)}`;
}

export async function fetchTrackMeta(youtubeUrl) {
  const res = await fetch(`${BASE_URL}/api/stream/meta?url=${encodeURIComponent(youtubeUrl)}`);
  if (!res.ok) throw new Error('Could not load track info');
  return res.json();
}
