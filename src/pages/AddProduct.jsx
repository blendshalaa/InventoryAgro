import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addProduct, getProduct, updateProduct, getCategories } from '../db';
import { t } from '../lib/i18n';

const defaultForm = {
  name: '',
  unit: 'copë',
  categoryId: '',
  currentStock: '',
  minStock: '',
  price: '',
};

export default function AddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (isEdit && id) {
      getProduct(Number(id)).then((p) => {
        if (p)
          setForm({
            name: p.name || '',
            unit: p.unit || 'copë',
            categoryId: p.categoryId ?? '',
            currentStock: p.currentStock ?? 0,
            minStock: p.minStock ?? 0,
            price: p.price ?? 0,
          });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const payload = {
      ...form,
      currentStock: Number(form.currentStock) || 0,
      minStock: Number(form.minStock) || 0,
      price: Number(form.price) || 0,
    };
    try {
      if (isEdit) {
        await updateProduct(Number(id), payload);
        navigate('/products');
      } else {
        await addProduct(payload);
        navigate('/products');
      }
    } catch (err) {
      setError(err?.message || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">
        {isEdit ? t.addProduct.editTitle : t.addProduct.title}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
      >
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.addProduct.name}
          </label>
          <input
            type="text"
            required
            placeholder={t.addProduct.namePlaceholder}
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.addProduct.category}
          </label>
          <select
            value={form.categoryId}
            onChange={(e) => update('categoryId', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">{t.addProduct.categoryOptional}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.addProduct.unit}
          </label>
          <input
            type="text"
            placeholder={t.addProduct.unitPlaceholder}
            value={form.unit}
            onChange={(e) => update('unit', e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.addProduct.currentStock}
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={form.currentStock}
              onChange={(e) =>
                update('currentStock', e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t.addProduct.minStock}
            </label>
            <input
              type="number"
              min={0}
              step={1}
              value={form.minStock}
              onChange={(e) =>
                update('minStock', e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))
              }
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.addProduct.price}
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={form.price}
            onChange={(e) =>
              update('price', e.target.value === '' ? '' : (parseFloat(e.target.value) || 0))
            }
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? t.common.loading : t.addProduct.save}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
          >
            {t.addProduct.cancel}
          </button>
        </div>
      </form>
    </div>
  );
}
