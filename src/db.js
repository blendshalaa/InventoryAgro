import Dexie from 'dexie';

export const db = new Dexie('InventoryAgroDB');

db.version(1).stores({
  products: '++id, name, currentStock, minStock, price, createdAt, updatedAt',
  transactions:
    '++id, productId, productName, type, quantity, totalValue, date, createdAt',
});

// Products CRUD
export async function getProducts() {
  return db.products.orderBy('name').toArray();
}

export async function getProduct(id) {
  return db.products.get(id);
}

export async function addProduct(product) {
  const now = Date.now();
  const id = await db.products.add({
    name: product.name.trim(),
    unit: product.unit || 'copë',
    currentStock: Number(product.currentStock) || 0,
    minStock: Number(product.minStock) || 0,
    price: Number(product.price) || 0,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateProduct(id, updates) {
  const existing = await db.products.get(id);
  if (!existing) return;
  const now = Date.now();
  await db.products.update(id, {
    ...updates,
    name: updates.name != null ? String(updates.name).trim() : existing.name,
    unit: updates.unit ?? existing.unit,
    currentStock:
      updates.currentStock != null
        ? Number(updates.currentStock)
        : existing.currentStock,
    minStock:
      updates.minStock != null ? Number(updates.minStock) : existing.minStock,
    price: updates.price != null ? Number(updates.price) : existing.price,
    updatedAt: now,
  });
}

export async function deleteProduct(id) {
  await db.transactions.where('productId').equals(id).delete();
  await db.products.delete(id);
}

// Transactions CRUD and stock updates
export async function getTransactions(filters = {}) {
  let list;
  if (filters.type) {
    list = await db.transactions.where('type').equals(filters.type).toArray();
  } else if (filters.productId) {
    list = await db.transactions
      .where('productId')
      .equals(filters.productId)
      .toArray();
  } else {
    list = await db.transactions.orderBy('date').reverse().toArray();
  }
  if (filters.dateFrom || filters.dateTo) {
    const from = filters.dateFrom ? new Date(filters.dateFrom).getTime() : 0;
    const to = filters.dateTo
      ? new Date(filters.dateTo).setHours(23, 59, 59, 999)
      : Infinity;
    list = list.filter((tx) => {
      const d = new Date(tx.date).getTime();
      return d >= from && d <= to;
    });
  }
  if (filters.type || filters.productId) {
    list.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  return list;
}

export async function addTransaction(tx) {
  const product = await db.products.get(tx.productId);
  if (!product) throw new Error('Produkti nuk u gjet');
  const quantity = Number(tx.quantity) || 0;
  const pricePerUnit = Number(tx.pricePerUnit) ?? product.price;
  const totalValue = quantity * pricePerUnit;
  const type = tx.type === 'OUT' ? 'OUT' : 'IN';
  if (type === 'OUT' && product.currentStock < quantity) {
    throw new Error(
      `Stoku i mbetur (${product.currentStock} ${product.unit}) nuk mjafton. Sasia e kërkuar: ${quantity}`
    );
  }
  const now = Date.now();
  const date = tx.date ? new Date(tx.date).toISOString() : new Date().toISOString();
  const id = await db.transactions.add({
    productId: product.id,
    productName: product.name,
    type,
    quantity,
    pricePerUnit,
    totalValue,
    note: tx.note || '',
    date,
    createdAt: now,
  });
  const newStock =
    type === 'IN'
      ? product.currentStock + quantity
      : product.currentStock - quantity;
  await db.products.update(product.id, {
    currentStock: newStock,
    updatedAt: now,
  });
  return id;
}

export async function getRecentTransactions(limit = 10) {
  return db.transactions.orderBy('date').reverse().limit(limit).toArray();
}

export async function getLowStockProducts() {
  const all = await db.products.toArray();
  return all.filter((p) => p.minStock > 0 && p.currentStock < p.minStock);
}
