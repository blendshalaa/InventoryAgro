import { useState, useRef } from 'react';
import { Download, Upload, Database } from 'lucide-react';
import { exportBackup, importBackup } from '../db';
import { t } from '../lib/i18n';

export default function Backup() {
  const [message, setMessage] = useState({ type: '', text: '' });
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleExport = async () => {
    setMessage({ type: '', text: '' });
    try {
      const data = await exportBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventar-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: 'success', text: t.backup.exportSuccess });
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || t.common.error });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.confirm(t.backup.importConfirm)) {
      e.target.value = '';
      return;
    }
    setMessage({ type: '', text: '' });
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importBackup(data);
      setMessage({ type: 'success', text: t.backup.importSuccess });
      window.location.reload();
    } catch (err) {
      setMessage({ type: 'error', text: err?.message || t.common.error });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">{t.backup.title}</h1>

      {message.text && (
        <div
          className={`p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">{t.backup.export}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t.backup.exportHint}</p>
            <button
              type="button"
              onClick={handleExport}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Shkarko backup
            </button>
          </div>
        </div>
        <div className="p-6 flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <Upload className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">{t.backup.import}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{t.backup.importHint}</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              disabled={importing}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium disabled:opacity-50"
            >
              {importing ? t.common.loading : 'Zgjidh skedar dhe restore'}
            </button>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 flex items-center gap-2">
        <Database className="w-4 h-4" />
        Të dhënat mbahen vetëm në këtë shfletues. Bëni backup rregullisht për të mos i humbur.
      </p>
    </div>
  );
}
