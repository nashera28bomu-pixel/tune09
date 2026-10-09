import { useCallback, useEffect, useRef, useState } from 'react';
import { streamUrl } from '../lib/api';

export default function usePlayer() {
  const audioRef = useRef(null);
  const [current, setCurrent] = useState(null); // track object
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTime = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onEnded = () => playNext();

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback((track, newQueue) => {
    const audio = audioRef.current;
    setCurrent(track);
    if (newQueue) setQueue(newQueue);
    audio.src = streamUrl(track.url);
    audio.play().catch(() => {});
    setIsPlaying(true);
    setProgress(0);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().catch(() => {});
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const seek = useCallback((seconds) => {
    const audio = audioRef.current;
    audio.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const playNext = useCallback(() => {
    setQueue(prevQueue => {
      setCurrent(prevCurrent => {
        const idx = prevQueue.findIndex(t => t.id === prevCurrent?.id);
        const next = prevQueue[idx + 1];
        if (next) {
          const audio = audioRef.current;
          audio.src = streamUrl(next.url);
          audio.play().catch(() => {});
          setIsPlaying(true);
          setProgress(0);
          return next;
        }
        setIsPlaying(false);
        return prevCurrent;
      });
      return prevQueue;
    });
  }, []);

  const playPrev = useCallback(() => {
    setQueue(prevQueue => {
      setCurrent(prevCurrent => {
        const idx = prevQueue.findIndex(t => t.id === prevCurrent?.id);
        const prev = prevQueue[idx - 1];
        if (prev) {
          const audio = audioRef.current;
          audio.src = streamUrl(prev.url);
          audio.play().catch(() => {});
          setIsPlaying(true);
          setProgress(0);
          return prev;
        }
        return prevCurrent;
      });
      return prevQueue;
    });
  }, []);

  return { current, isPlaying, progress, duration, isBuffering, play, toggle, seek, playNext, playPrev, queue };
}
