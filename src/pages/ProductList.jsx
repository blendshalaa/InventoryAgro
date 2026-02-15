import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getProducts, getCategories, deleteProduct } from '../db';
import { t } from '../lib/i18n';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    const [list, cats] = await Promise.all([getProducts(), getCategories()]);
    setProducts(list);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const categoryMap = Object.fromEntries((categories || []).map((c) => [c.id, c.name]));

  const filtered = products.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) &&
        !(p.unit && p.unit.toLowerCase().includes(search.toLowerCase())))
      return false;
    if (categoryFilter && p.categoryId !== Number(categoryFilter)) return false;
    return true;
  });

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
        <div className="p-4 border-b border-slate-200 flex flex-wrap gap-3 items-end">
          <input
            type="search"
            placeholder={t.products.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-w-[160px]"
          >
            <option value="">{t.products.filterCategory}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
                  <th className="px-4 py-3 font-medium">{t.products.category}</th>
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
                      <td className="px-4 py-3 text-slate-600">
                        {p.categoryId ? (categoryMap[p.categoryId] || '—') : '—'}
                      </td>
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
