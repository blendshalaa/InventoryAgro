import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, AlertTriangle, Wallet, ArrowRight, Download, X } from 'lucide-react';
import { format } from 'date-fns';
import { sq } from 'date-fns/locale';
import {
  getProducts,
  getRecentTransactions,
  getLowStockProducts,
} from '../db';
import { t } from '../lib/i18n';

const INSTALL_DISMISSED_KEY = 'inventory-pwa-install-dismissed';

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(true);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia('(display-mode: standalone)').matches ||
      !!window.navigator.standalone
    );
    try {
      setShowInstallBanner(!localStorage.getItem(INSTALL_DISMISSED_KEY));
    } catch {
      setShowInstallBanner(true);
    }
  }, []);

  const dismissInstall = () => {
    setShowInstallBanner(false);
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
    } catch {}
  };

  useEffect(() => {
    async function load() {
      const [p, tx, low] = await Promise.all([
        getProducts(),
        getRecentTransactions(8),
        getLowStockProducts(),
      ]);
      setProducts(p);
      setTransactions(tx);
      setLowStock(low);
      setLoading(false);
    }
    load();
  }, []);

  const totalValue = products.reduce(
    (sum, p) => sum + p.currentStock * (p.price || 0),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">{t.dashboard.title}</h1>

      {showInstallBanner && !isStandalone && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Download className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-blue-900">Instalo aplikacionin në laptop</h3>
            <p className="text-sm text-blue-800 mt-1">
              Në <strong>Chrome</strong>: kliko <strong>⋮</strong> (tre pika) lart djathtas në shfletues → zgjidh <strong>&quot;Instalo Menaxhimi i Inventarit&quot;</strong> ose <strong>&quot;Install app&quot;</strong>. Pastaj e gjen si program në desktop.
            </p>
          </div>
          <button
            type="button"
            onClick={dismissInstall}
            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors shrink-0"
            aria-label="Mbyll"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{t.dashboard.totalProducts}</p>
              <p className="text-2xl font-bold text-slate-800">{products.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{t.dashboard.lowStock}</p>
              <p className="text-2xl font-bold text-amber-600">{lowStock.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">{t.dashboard.totalValue}</p>
              <p className="text-2xl font-bold text-slate-800">
                {totalValue.toLocaleString('sq-AL')} €
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h2 className="font-semibold text-amber-800 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5" />
            {t.dashboard.alertLowStock}
          </h2>
          <ul className="space-y-1 text-sm text-amber-900">
            {lowStock.slice(0, 5).map((p) => (
              <li key={p.id}>
                <Link
                  to={`/products/edit/${p.id}`}
                  className="hover:underline font-medium"
                >
                  {p.name}
                </Link>
                — {p.currentStock} / {p.minStock} {p.unit}
              </li>
            ))}
            {lowStock.length > 5 && (
              <li className="text-amber-700">
                +{lowStock.length - 5} të tjerë...
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            {t.dashboard.recentTransactions}
          </h2>
          <Link
            to="/history"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            {t.dashboard.viewAll}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <p className="p-6 text-slate-500 text-sm">
              {t.dashboard.noTransactions}
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="px-4 py-3 font-medium">{t.history.date}</th>
                  <th className="px-4 py-3 font-medium">{t.history.product}</th>
                  <th className="px-4 py-3 font-medium">{t.history.type}</th>
                  <th className="px-4 py-3 font-medium">{t.history.quantity}</th>
                  <th className="px-4 py-3 font-medium">{t.history.total}</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t border-slate-100 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 text-slate-600">
                      {format(new Date(tx.date), 'dd MMM yyyy', { locale: sq })}
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
                    <td className="px-4 py-3 font-medium">
                      {tx.totalValue?.toLocaleString('sq-AL')} €
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
