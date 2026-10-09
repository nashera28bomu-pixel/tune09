import { useEffect, useState } from 'react';
import './Settings.css';

export default function Settings({ onClearHistory, downloadCount }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsInstalled(standalone);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
  };

  return (
    <div className="page settings-page">
      <header className="settings-header">
        <h1 className="display">Settings</h1>
      </header>

      <section className="settings-card dev-card">
        <div className="dev-avatar">LC</div>
        <div>
          <p className="dev-name">Legendary Smiley Cymor</p>
          <p className="dev-role">Developer · Cymor Tech Services</p>
        </div>
      </section>

      {!isInstalled && (
        <section className="settings-card install-card">
          <div>
            <p className="settings-item-title">Install Cymor Tune</p>
            <p className="settings-item-sub">Add it to your home screen for the full app experience.</p>
          </div>
          <button className="install-btn" onClick={install} disabled={!installPrompt}>
            {installPrompt ? 'Install' : 'Use browser menu'}
          </button>
        </section>
      )}

      <section className="settings-card">
        <div>
          <p className="settings-item-title">Download history</p>
          <p className="settings-item-sub">{downloadCount} track{downloadCount === 1 ? '' : 's'} logged</p>
        </div>
        <button className="danger-btn" onClick={onClearHistory} disabled={downloadCount === 0}>Clear</button>
      </section>

      <section className="settings-card">
        <div>
          <p className="settings-item-title">App version</p>
          <p className="settings-item-sub">Cymor Tune 1.0.0</p>
        </div>
      </section>

      <p className="settings-footer">Built with ❤️ by Cymor Tech Services, Nairobi</p>
    </div>
  );
}
