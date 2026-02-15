import { useState, useEffect } from 'react';
import { getProducts, addTransaction } from '../db';
import { t } from '../lib/i18n';

export default function StockOut() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(() =>
    new Date().toISOString().slice(0, 16)
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const selectedProduct = products.find((p) => p.id === Number(productId));
  const available = selectedProduct?.currentStock ?? 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !quantity || Number(quantity) <= 0) return;
    if (Number(quantity) > available) {
      setMessage({ type: 'error', text: t.stockOut.errorLowStock });
      return;
    }
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await addTransaction({
        productId: Number(productId),
        type: 'OUT',
        quantity: Number(quantity),
        pricePerUnit: pricePerUnit ? Number(pricePerUnit) : undefined,
        note: note.trim() || undefined,
        date: new Date(date).toISOString(),
      });
      setMessage({ type: 'success', text: t.stockOut.success });
      setQuantity('');
      setNote('');
      setPricePerUnit(selectedProduct?.price ?? '');
      const updated = await getProducts();
      setProducts(updated);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err?.message || t.common.error,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProduct) {
      setPricePerUnit(selectedProduct.price ?? '');
    }
  }, [productId, selectedProduct]);

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t.stockOut.title}</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4"
      >
        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.stockOut.product}
          </label>
          <select
            required
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="">{t.stockOut.selectProduct}</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {t.stockOut.available}: {p.currentStock} {p.unit}
              </option>
            ))}
          </select>
        </div>
        {selectedProduct && (
          <p className="text-sm text-slate-600">
            {t.stockOut.available}: <strong>{available} {selectedProduct.unit}</strong>
          </p>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.stockOut.quantity}
          </label>
          <input
            type="number"
            required
            min={0.001}
            max={available}
            step="any"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.stockOut.pricePerUnit}
          </label>
          <input
            type="number"
            min={0}
            step={0.01}
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Data
          </label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {t.stockOut.note}
          </label>
          <input
            type="text"
            placeholder={t.stockOut.notePlaceholder}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !productId || available <= 0}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? t.common.loading : t.stockOut.register}
        </button>
      </form>
    </div>
  );
}
