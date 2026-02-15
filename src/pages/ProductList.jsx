import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getProducts, deleteProduct } from '../db';
import { t } from '../lib/i18n';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const list = await getProducts();
    setProducts(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.unit && p.unit.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id, name) => {
    if (!window.confirm(t.products.confirmDelete + ` "${name}"?`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      await load();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-slate-800">{t.products.title}</h1>
        <Link
          to="/products/add"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t.products.addFirst}
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <input
            type="search"
            placeholder={t.products.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-500">
              {t.common.loading}
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              {t.products.noProducts}
              <Link
                to="/products/add"
                className="block mt-2 text-blue-600 hover:underline"
              >
                {t.products.addFirst}
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-left">
                  <th className="px-4 py-3 font-medium">{t.products.name}</th>
                  <th className="px-4 py-3 font-medium">{t.products.unit}</th>
                  <th className="px-4 py-3 font-medium">
                    {t.products.currentStock}
                  </th>
                  <th className="px-4 py-3 font-medium">
                    {t.products.minStock}
                  </th>
                  <th className="px-4 py-3 font-medium">{t.products.price}</th>
                  <th className="px-4 py-3 font-medium w-28">
                    {t.products.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const isLow =
                    p.minStock > 0 && p.currentStock < p.minStock;
                  return (
                    <tr
                      key={p.id}
                      className={`border-t border-slate-100 hover:bg-slate-50/50 ${
                        isLow ? 'bg-amber-50/50' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-slate-600">{p.unit}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            isLow ? 'text-amber-600 font-medium' : ''
                          }
                        >
                          {p.currentStock}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {p.minStock}
                      </td>
                      <td className="px-4 py-3">
                        {(p.price || 0).toLocaleString('sq-AL')} €
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/products/edit/${p.id}`}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title={t.products.edit}
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title={t.products.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
