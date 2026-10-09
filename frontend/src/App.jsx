import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import IntroLoader from './components/IntroLoader.jsx';
import BottomNav from './components/BottomNav.jsx';
import MiniPlayer from './components/MiniPlayer.jsx';
import FullPlayer from './components/FullPlayer.jsx';
import DownloadSheet from './components/DownloadSheet.jsx';
import Home from './pages/Home.jsx';
import Downloads from './pages/Downloads.jsx';
import Settings from './pages/Settings.jsx';
import usePlayer from './hooks/usePlayer.js';
import useDownloadHistory from './hooks/useDownloadHistory.js';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [downloadTarget, setDownloadTarget] = useState(null);

  const player = usePlayer();
  const { history, addEntry, clearHistory } = useDownloadHistory();

  const handlePlay = (track, queue) => {
    player.play(track, queue);
    setIsPlayerExpanded(true);
  };

  const handleDownloaded = (track, format) => {
    addEntry(track, format);
  };

  return (
    <div className="app-shell">
      <AnimatePresence
        onExitComplete={() => setShowIntro(false)}
      >
        {showIntro && <IntroLoaderGate onDone={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <>
          <div className="scroll-area">
            {activeTab === 'home' && (
              <Home
                currentTrackId={player.current?.id}
                onPlay={handlePlay}
                onDownload={setDownloadTarget}
              />
            )}
            {activeTab === 'downloads' && (
              <Downloads
                history={history}
                onClear={clearHistory}
                onRedownload={() => {}}
              />
            )}
            {activeTab === 'settings' && (
              <Settings onClearHistory={clearHistory} downloadCount={history.length} />
            )}
          </div>

          <MiniPlayer
            track={isPlayerExpanded ? null : player.current}
            isPlaying={player.isPlaying}
            progress={player.progress}
            duration={player.duration}
            onExpand={() => setIsPlayerExpanded(true)}
            onToggle={player.toggle}
          />

          <BottomNav active={activeTab} onChange={setActiveTab} />

          <AnimatePresence>
            {isPlayerExpanded && player.current && (
              <FullPlayer
                track={player.current}
                isPlaying={player.isPlaying}
                progress={player.progress}
                duration={player.duration}
                isBuffering={player.isBuffering}
                onClose={() => setIsPlayerExpanded(false)}
                onToggle={player.toggle}
                onSeek={player.seek}
                onNext={player.playNext}
                onPrev={player.playPrev}
                onDownload={() => setDownloadTarget(player.current)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {downloadTarget && (
              <DownloadSheet
                track={downloadTarget}
                onClose={() => setDownloadTarget(null)}
                onDownloaded={handleDownloaded}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

function IntroLoaderGate({ onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, [onDone]);
  return <IntroLoader />;
}
