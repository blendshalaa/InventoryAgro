import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { sq } from 'date-fns/locale';
import { getTransactions } from '../db';
import { t } from '../lib/i18n';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export default function History() {
  const [transactions, setTransactions] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const list = await getTransactions({
      type: typeFilter || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    });
    setTransactions(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [typeFilter, dateFrom, dateTo]);

  const handleExportExcel = () => {
    const rows = transactions.map((tx) => ({
      [t.history.date]: format(new Date(tx.date), 'dd.MM.yyyy HH:mm', {
        locale: sq,
      }),
      [t.history.product]: tx.productName,
      [t.history.type]: tx.type === 'IN' ? t.history.in : t.history.out,
      [t.history.quantity]: tx.quantity,
      [t.history.pricePerUnit]: tx.pricePerUnit,
      [t.history.total]: tx.totalValue,
      [t.history.note]: tx.note || '',
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transaksione');
    XLSX.writeFile(wb, `Historiku_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm' });
    doc.setFontSize(14);
    doc.text(t.history.title, 14, 12);
    doc.setFontSize(10);
    const headers = [
      t.history.date,
      t.history.product,
      t.history.type,
      t.history.quantity,
      t.history.total,
    ];
    const colWidths = [35, 60, 25, 25, 35];
    let y = 22;
    headers.forEach((h, i) => {
      doc.text(h, 14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y);
    });
    y += 6;
    doc.setFontSize(9);
    transactions.slice(0, 25).forEach((tx) => {
      const row = [
        format(new Date(tx.date), 'dd.MM.yyyy', { locale: sq }),
        tx.productName.substring(0, 28),
        tx.type === 'IN' ? t.history.in : t.history.out,
        String(tx.quantity),
        `${(tx.totalValue || 0).toFixed(2)} €`,
      ];
      row.forEach((cell, i) => {
        doc.text(
          cell,
          14 + colWidths.slice(0, i).reduce((a, b) => a + b, 0),
          y
        );
      });
      y += 6;
    });
    doc.save(`Historiku_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t.history.title}</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            {t.history.type}
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="">{t.history.all}</option>
            <option value="IN">{t.history.in}</option>
            <option value="OUT">{t.history.out}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            {t.history.dateFrom}
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            {t.history.dateTo}
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleExportExcel}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm"
          >
            {t.history.exportExcel}
          </button>
          <button
            type="button"
            onClick={handleExportPdf}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            {t.history.exportPdf}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              {t.common.loading}
            </div>
          ) : transactions.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              {t.history.noResults}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="px-4 py-3 font-medium">{t.history.date}</th>
                  <th className="px-4 py-3 font-medium">{t.history.product}</th>
                  <th className="px-4 py-3 font-medium">{t.history.type}</th>
                  <th className="px-4 py-3 font-medium">{t.history.quantity}</th>
                  <th className="px-4 py-3 font-medium">
                    {t.history.pricePerUnit}
                  </th>
                  <th className="px-4 py-3 font-medium">{t.history.total}</th>
                  <th className="px-4 py-3 font-medium">{t.history.note}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 text-slate-600">
                      {format(new Date(tx.date), 'dd MMM yyyy HH:mm', {
                        locale: sq,
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium">{tx.productName}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          tx.type === 'IN'
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }
                      >
                        {tx.type === 'IN' ? t.history.in : t.history.out}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tx.quantity}</td>
                    <td className="px-4 py-3">
                      {(tx.pricePerUnit ?? 0).toLocaleString('sq-AL')} €
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {(tx.totalValue ?? 0).toLocaleString('sq-AL')} €
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">
                      {tx.note || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
