import { useState, useEffect, useCallback } from 'react';
import { startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { getTransactions } from '../db';
import { t } from '../lib/i18n';
import { jsPDF } from 'jspdf';

const MONTHS = [
  'Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor',
  'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor',
];

export default function Reports() {
  const currentYear = new Date().getFullYear();
  const [reportType, setReportType] = useState('monthly');
  const [month, setMonth] = useState(String(new Date().getMonth() + 1));
  const [year, setYear] = useState(String(currentYear));
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadReport = useCallback(async () => {
    setLoading(true);
    let dateFrom, dateTo;
    if (reportType === 'monthly') {
      const m = parseInt(month, 10) - 1;
      dateFrom = startOfMonth(new Date(year, m));
      dateTo = endOfMonth(new Date(year, m));
    } else {
      dateFrom = startOfYear(new Date(parseInt(year, 10), 0));
      dateTo = endOfYear(new Date(parseInt(year, 10), 0));
    }
    const list = await getTransactions({
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
    });
    const totalIn = list
      .filter((tx) => tx.type === 'IN')
      .reduce((s, tx) => s + (tx.totalValue || 0), 0);
    const totalOut = list
      .filter((tx) => tx.type === 'OUT')
      .reduce((s, tx) => s + (tx.totalValue || 0), 0);
    setSummary({
      totalIn,
      totalOut,
      count: list.length,
      transactions: list,
      period:
        reportType === 'monthly'
          ? `${MONTHS[parseInt(month, 10) - 1]} ${year}`
          : year,
    });
    setLoading(false);
  }, [reportType, month, year]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleDownloadPdf = () => {
    if (!summary) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(t.reports.title, 14, 16);
    doc.setFontSize(11);
    doc.text(
      `${reportType === 'monthly' ? t.reports.monthly : t.reports.yearly}: ${summary.period}`,
      14,
      24
    );
    doc.setFontSize(10);
    let y = 34;
    doc.text(`${t.reports.totalIn}: ${summary.totalIn.toFixed(2)} €`, 14, y);
    y += 7;
    doc.text(`${t.reports.totalOut}: ${summary.totalOut.toFixed(2)} €`, 14, y);
    y += 7;
    doc.text(
      `${t.reports.transactionsCount}: ${summary.count}`,
      14,
      y
    );
    doc.save(`Raport_${summary.period.replace(/\s/g, '_')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t.reports.title}</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Lloji raporti
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg"
            >
              <option value="monthly">{t.reports.monthly}</option>
              <option value="yearly">{t.reports.yearly}</option>
            </select>
          </div>
          {reportType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {t.reports.month}
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="px-4 py-2 border border-slate-200 rounded-lg"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={String(i + 1)}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.reports.year}
            </label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg"
            >
              {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                (y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                )
              )}
            </select>
          </div>
          <button
            type="button"
            onClick={loadReport}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? t.common.loading : t.reports.generate}
          </button>
        </div>
      </div>

      {summary && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-800 mb-4">
            {t.reports.summary} — {summary.period}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-700">{t.reports.totalIn}</p>
              <p className="text-xl font-bold text-emerald-800">
                {summary.totalIn.toLocaleString('sq-AL')} €
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-700">{t.reports.totalOut}</p>
              <p className="text-xl font-bold text-amber-800">
                {summary.totalOut.toLocaleString('sq-AL')} €
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">
                {t.reports.transactionsCount}
              </p>
              <p className="text-xl font-bold text-slate-800">
                {summary.count}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t.reports.downloadPdf}
          </button>
        </div>
      )}
    </div>
  );
}
