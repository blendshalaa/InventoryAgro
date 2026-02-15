import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../db';
import { t } from '../lib/i18n';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    const list = await getCategories();
    setCategories(list);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    const name = newName.trim();
    if (!name) return;
    try {
      await addCategory(name);
      setNewName('');
      await load();
    } catch (err) {
      setError(err?.message || t.common.error);
    }
  };

  const startEdit = (cat) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  };

  const handleSaveEdit = async () => {
    if (editingId == null) return;
    setError('');
    const name = editName.trim();
    if (!name) return;
    try {
      await updateCategory(editingId, name);
      setEditingId(null);
      setEditName('');
      await load();
    } catch (err) {
      setError(err?.message || t.common.error);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(t.categories.confirmDelete)) return;
    try {
      await deleteCategory(id);
      await load();
      if (editingId === id) setEditingId(null);
    } catch (err) {
      setError(err?.message || t.common.error);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">{t.categories.title}</h1>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <form onSubmit={handleAdd} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-500 mb-1">
            {t.categories.name}
          </label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="p.sh. Farë, Mjete, ..."
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          {t.categories.add}
        </button>
      </form>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500">{t.common.loading}</div>
        ) : categories.length === 0 ? (
          <p className="p-8 text-center text-slate-500">{t.categories.noCategories}</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/50">
                {editingId === cat.id ? (
                  <>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      {t.common.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
                    >
                      {t.common.cancel}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium text-slate-800">{cat.name}</span>
                    <button
                      type="button"
                      onClick={() => startEdit(cat)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                      title={t.categories.edit}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title={t.categories.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
