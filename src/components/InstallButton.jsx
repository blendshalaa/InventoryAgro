import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { t } from '../lib/i18n';

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const installedHandler = () => {
      setInstalled(true);
      setShowButton(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      !!window.navigator.standalone;
    setIsStandalone(standalone);
    if (standalone) setShowButton(false);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowButton(false);
    setDeferredPrompt(null);
  };

  if (installed || isStandalone) return null;

  return (
    <div className="p-3 border-t border-slate-600/50 space-y-3">
      <p className="text-xs font-medium text-slate-300 uppercase tracking-wide px-1">
        Instalo në laptop
      </p>
      {showButton ? (
        <button
          type="button"
          onClick={handleInstall}
          className="w-full flex items-center justify-center gap-2 px-3 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors"
          title={t.common.installAppHint}
        >
          <Download className="w-5 h-5 shrink-0" />
          {t.common.installApp}
        </button>
      ) : (
        <div className="text-xs text-slate-400 bg-slate-800/50 rounded-lg p-3 space-y-1.5">
          <p className="font-medium text-slate-300">Në Chrome:</p>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Kliko <span className="font-bold text-white">⋮</span> (tre pika lart djathtas)</li>
            <li>Zgjidh <strong className="text-slate-200">&quot;Instalo Menaxhimi i Inventarit&quot;</strong> ose &quot;Install app&quot;</li>
          </ol>
        </div>
      )}
    </div>
  );
}
