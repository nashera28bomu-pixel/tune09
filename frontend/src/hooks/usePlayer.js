import { useCallback, useEffect, useRef, useState } from 'react';
import { videoStreamUrl } from '../lib/api';

// Manages a single persistent <video> element (ref exposed as videoRef,
// rendered once in FullPlayer and never unmounted - see FullPlayer.jsx)
// so that minimizing/expanding the player never interrupts playback.
export default function usePlayer() {
  const videoRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => setProgress(video.currentTime);
    const onDuration = () => setDuration(video.duration || 0);
    const onWaiting = () => setIsBuffering(true);
    const onPlaying = () => setIsBuffering(false);
    const onEnded = () => playNext();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTime);
    video.addEventListener('durationchange', onDuration);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('ended', onEnded);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('durationchange', onDuration);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const play = useCallback((track, newQueue) => {
    const video = videoRef.current;
    if (!video) return;
    setCurrent(track);
    if (newQueue) setQueue(newQueue);
    video.src = videoStreamUrl(track.url);
    video.play().catch(() => {});
    setProgress(0);
  }, []);

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.src) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }, []);

  const seek = useCallback((seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = seconds;
    setProgress(seconds);
  }, []);

  const playNext = useCallback(() => {
    setQueue(prevQueue => {
      setCurrent(prevCurrent => {
        const idx = prevQueue.findIndex(t => t.id === prevCurrent?.id);
        const next = prevQueue[idx + 1];
        if (next) {
          const video = videoRef.current;
          video.src = videoStreamUrl(next.url);
          video.play().catch(() => {});
          setProgress(0);
          return next;
        }
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
          const video = videoRef.current;
          video.src = videoStreamUrl(prev.url);
          video.play().catch(() => {});
          setProgress(0);
          return prev;
        }
        return prevCurrent;
      });
      return prevQueue;
    });
  }, []);

  return { videoRef, current, isPlaying, progress, duration, isBuffering, play, toggle, seek, playNext, playPrev, queue };
}
