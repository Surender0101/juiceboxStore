import { db, ensureFirebaseAuth } from '../firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { PRODUCT_CATALOG, catalogById } from '../data/productCatalog';

const USERS_KEY = 'juicebox_users';
const CURRENT_USER_KEY = 'juicebox_current_user';
const ORDERS_KEY = 'juicebox_orders';
const CATALOG_VERSION_KEY = 'juicebox_catalog_version';
const CATALOG_VERSION = '5';
const ORDER_DOC_PREFIX = 'order_';
const CLOUD_TIMEOUT_MS = 8000;

const withTimeout = (promise, ms = CLOUD_TIMEOUT_MS) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Cloud request timed out')), ms)
    ),
  ]);

export const ORDER_STATUSES = [
  'Payment Pending',
  'Paid',
  'Preparing',
  'Completed',
  'Cancelled',
];

const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`localStorage write failed (${key}):`, err);
    return false;
  }
};

const defaultProducts = PRODUCT_CATALOG;

const normalizeProduct = (product) => {
  const catalog = catalogById[product?.id?.toString()];
  const base = catalog || product;
  return {
    ...base,
    ...product,
    id: product?.id ?? base.id,
    desc: product?.desc || product?.description || base.desc || '',
    price: Number(product?.price ?? base.price) || 0,
    calories: product?.calories ?? base.calories ?? 120,
    size: product?.size ?? base.size ?? '350ml',
    rating: product?.rating ?? base.rating ?? 4.5,
    image: catalog?.image || product?.image || base.image || '/products/fallback-juice.svg',
    name: catalog?.name || product?.name || base.name,
    category: catalog?.category || product?.category || base.category,
  };
};

const mergeWithCatalogDefaults = (product) => normalizeProduct(product);

// --- USERS ---

export const getUsers = () => safeParse(localStorage.getItem(USERS_KEY), []);

export const setCurrentUser = (user) => {
  if (user) {
    safeSetItem(CURRENT_USER_KEY, user);
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const registerUser = (name, email, password) => {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error('Please enter your full name');
  }
  if (!trimmedEmail || !trimmedEmail.includes('@')) {
    throw new Error('Please enter a valid email address');
  }
  if (!trimmedPassword || trimmedPassword.length < 4) {
    throw new Error('Password must be at least 4 characters');
  }

  const users = getUsers();
  if (users.find((u) => u.email === trimmedEmail)) {
    throw new Error('An account with this email already exists');
  }

  const newUser = { id: Date.now(), name: trimmedName, email: trimmedEmail, password: trimmedPassword, role: 'user' };
  safeSetItem(USERS_KEY, [...users, newUser]);
  setCurrentUser(newUser);
  return newUser;
};

export const loginUser = (email, password) => {
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (!trimmedEmail || !trimmedPassword) {
    throw new Error('Please enter email and password');
  }

  const users = getUsers();
  const user = users.find((u) => u.email === trimmedEmail && u.password === trimmedPassword);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const sessionUser = { ...user, role: user.role || 'user' };
  setCurrentUser(sessionUser);
  return sessionUser;
};

export const loginAdmin = (username, password) => {
  const trimmedUser = username?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  if (trimmedUser === 'surender' && trimmedPassword === '112004') {
    const adminUser = { id: 0, name: 'Admin Surender', email: 'surender', role: 'admin' };
    setCurrentUser(adminUser);
    return adminUser;
  }

  throw new Error('Invalid admin credentials');
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  const user = safeParse(localStorage.getItem(CURRENT_USER_KEY), null);
  if (!user || typeof user !== 'object') return null;
  return user;
};

// --- PRODUCTS ---

const syncProductCatalog = async () => {
  if (localStorage.getItem(CATALOG_VERSION_KEY) === CATALOG_VERSION) return;

  for (const prod of defaultProducts) {
    try {
      await setDoc(doc(db, 'products', prod.id.toString()), prod);
    } catch (err) {
      console.warn(`Could not sync product ${prod.id}:`, err);
    }
  }

  localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
};

const isRealProduct = (p) =>
  p.type !== 'order' && !String(p.id).startsWith(ORDER_DOC_PREFIX);

export const getProducts = async () => {
  const catalog = defaultProducts.map(normalizeProduct);

  try {
    await ensureFirebaseAuth();
    await syncProductCatalog();

    const querySnapshot = await withTimeout(getDocs(collection(db, 'products')));
    const cloudProducts = querySnapshot.docs
      .map((d) => ({ ...d.data(), id: d.id }))
      .filter(isRealProduct);

    if (cloudProducts.length === 0) {
      return catalog;
    }

    const cloudMap = new Map(cloudProducts.map((p) => [p.id.toString(), p]));
    const mergedCatalog = catalog.map((item) => {
      const cloud = cloudMap.get(item.id.toString());
      if (!cloud) return item;
      return normalizeProduct({ ...cloud, id: item.id });
    });

    const extraProducts = cloudProducts
      .filter((p) => !catalogById[p.id?.toString()])
      .map(normalizeProduct);

    return [...mergedCatalog, ...extraProducts].sort(
      (a, b) => Number(a.id) - Number(b.id)
    );
  } catch (err) {
    console.warn('Firestore products unavailable, using local catalog:', err.message || err);
    return catalog;
  }
};

export const addProduct = async (product) => {
  const docRef = await addDoc(collection(db, 'products'), product);
  return normalizeProduct({ id: docRef.id, ...product });
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id.toString()));
};

export const updateProduct = async (id, updatedFields) => {
  await updateDoc(doc(db, 'products', id.toString()), updatedFields);
};

// --- ORDERS ---

const getLocalOrders = () => safeParse(localStorage.getItem(ORDERS_KEY), []);

let ordersBroadcast = null;
try {
  ordersBroadcast = new BroadcastChannel('juicebox-orders');
} catch {
  ordersBroadcast = null;
}

/** Instant read — use in admin for immediate display */
export const getOrdersLocal = () =>
  getLocalOrders().sort((a, b) => new Date(b.date) - new Date(a.date));

const saveLocalOrder = (order) => {
  const orders = getLocalOrders();
  const index = orders.findIndex((o) => o.id === order.id);
  if (index >= 0) {
    orders[index] = order;
  } else {
    orders.push(order);
  }
  safeSetItem(ORDERS_KEY, orders);
  window.dispatchEvent(new Event('ordersChange'));
  ordersBroadcast?.postMessage({ type: 'orders-updated' });
};

const sanitizeCustomer = (customer = {}) => ({
  firstName: String(customer.firstName || ''),
  lastName: String(customer.lastName || ''),
  email: String(customer.email || ''),
  phone: String(customer.phone || ''),
  address: String(customer.address || ''),
  city: String(customer.city || ''),
  zipCode: String(customer.zipCode || ''),
});

const buildOrder = (order) => {
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const items = (order.items || []).map(({ id, name, price, quantity, image, desc }) => ({
    id: String(id),
    name: String(name),
    price: Number(price) || 0,
    quantity: Number(quantity) || 1,
    image: image ? String(image) : '',
    desc: desc ? String(desc) : '',
  }));

  return {
    id: orderId,
    status: order.status || 'Payment Pending',
    date: new Date().toISOString(),
    items,
    total: Number(order.total) || 0,
    customer: sanitizeCustomer(order.customer),
    subtotal: Number(order.subtotal) || 0,
    tax: Number(order.tax) || 0,
    deliveryFee: Number(order.deliveryFee) || 0,
  };
};

const toFirestoreOrder = (order) => ({
  id: order.id,
  status: order.status,
  date: order.date,
  total: order.total,
  subtotal: order.subtotal || 0,
  tax: order.tax || 0,
  deliveryFee: order.deliveryFee || 0,
  customer: order.customer,
  items: order.items,
});

const mergeOrders = (firestoreOrders, localOrders) => {
  const orderMap = new Map();
  localOrders.forEach((o) => orderMap.set(o.id, o));
  firestoreOrders.forEach((o) => orderMap.set(o.id, { ...orderMap.get(o.id), ...o }));
  return Array.from(orderMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
};

const parseOrderDoc = (docId, data) => {
  const orderId = data.id || docId.replace(ORDER_DOC_PREFIX, '');
  return { ...data, id: orderId };
};

const fetchFirestoreOrders = async () => {
  await ensureFirebaseAuth();
  const found = new Map();

  try {
    const ordersSnap = await withTimeout(getDocs(collection(db, 'orders')));
    ordersSnap.docs.forEach((d) => {
      const order = parseOrderDoc(d.id, d.data());
      found.set(order.id, order);
    });
  } catch (err) {
    console.warn('orders collection read failed:', err.message || err);
  }

  try {
    const productsSnap = await withTimeout(getDocs(collection(db, 'products')));
    productsSnap.docs.forEach((d) => {
      const data = d.data();
      if (data.type === 'order' || d.id.startsWith(ORDER_DOC_PREFIX)) {
        const order = parseOrderDoc(d.id, data);
        found.set(order.id, order);
      }
    });
  } catch (err) {
    console.warn('products order fallback read failed:', err.message || err);
  }

  return Array.from(found.values());
};

const saveOrderToCloud = async (order) => {
  await ensureFirebaseAuth();
  const payload = toFirestoreOrder(order);

  try {
    await withTimeout(setDoc(doc(db, 'orders', order.id), payload));
    return true;
  } catch (err) {
    console.warn('orders collection write failed, using products fallback:', err.message || err);
  }

  try {
    await withTimeout(
      setDoc(doc(db, 'products', `${ORDER_DOC_PREFIX}${order.id}`), {
        ...payload,
        type: 'order',
        name: `Order ${order.id}`,
        category: 'Order',
        price: order.total,
        image: order.items?.[0]?.image || '',
      })
    );
    return true;
  } catch (err) {
    console.warn('products order fallback write failed:', err.message || err);
    return false;
  }
};

export const getOrderById = async (id) => {
  const localOrder = getLocalOrders().find((o) => o.id === id);
  if (localOrder) return localOrder;

  try {
    await ensureFirebaseAuth();
    const docSnap = await getDoc(doc(db, 'orders', id));
    if (docSnap.exists()) {
      const order = { ...docSnap.data(), id: docSnap.id };
      saveLocalOrder(order);
      return order;
    }
  } catch (err) {
    console.warn('Firestore order lookup failed:', err);
  }

  return null;
};

export const getOrders = async () => {
  let firestoreOrders = [];

  try {
    firestoreOrders = await fetchFirestoreOrders();
    firestoreOrders.forEach((order) => saveLocalOrder(order));
  } catch (err) {
    console.warn('Firestore orders fetch failed, using local orders:', err);
  }

  return mergeOrders(firestoreOrders, getLocalOrders());
};

export const addOrder = async (order) => {
  const newOrder = buildOrder({
    ...order,
    subtotal: order.subtotal,
    tax: order.tax,
    deliveryFee: order.deliveryFee,
  });

  saveLocalOrder({ ...newOrder, storedLocally: true });

  const syncedToCloud = await saveOrderToCloud(newOrder);
  const finalOrder = { ...newOrder, storedLocally: !syncedToCloud };
  saveLocalOrder(finalOrder);
  return finalOrder;
};

export const updateOrderStatus = async (id, status) => {
  if (!ORDER_STATUSES.includes(status)) {
    throw new Error('Invalid order status');
  }

  const localOrders = getLocalOrders();
  const localIndex = localOrders.findIndex((o) => o.id === id);
  const existing = localIndex >= 0 ? localOrders[localIndex] : await getOrderById(id);

  if (!existing) {
    throw new Error('Order not found');
  }

  const updatedOrder = { ...existing, status };
  saveLocalOrder(updatedOrder);

  try {
    await ensureFirebaseAuth();
    const patch = { status, updatedAt: new Date().toISOString() };
    try {
      await withTimeout(setDoc(doc(db, 'orders', id.toString()), patch, { merge: true }));
    } catch {
      await withTimeout(
        setDoc(doc(db, 'products', `${ORDER_DOC_PREFIX}${id}`), patch, { merge: true })
      );
    }
  } catch (err) {
    console.warn('Cloud status update failed, saved locally:', err.message || err);
  }

  return updatedOrder;
};

const notifyOrderListeners = (callback, cloudOrders = []) => {
  try {
    const merged = mergeOrders(cloudOrders, getLocalOrders());
    callback(merged);
  } catch (err) {
    console.warn('Order listener error:', err);
    callback(getOrdersLocal());
  }
};

export const subscribeToOrders = (callback) => {
  let firestoreUnsub = () => {};
  let cancelled = false;

  const pushUpdate = (cloudOrders = []) => {
    if (!cancelled) notifyOrderListeners(callback, cloudOrders);
  };

  // 1. Show local orders immediately (same browser)
  pushUpdate([]);

  const refreshFromCloud = async () => {
    try {
      const cloudOrders = await fetchFirestoreOrders();
      if (cancelled) return;
      cloudOrders.forEach((order) => saveLocalOrder(order));
      pushUpdate(cloudOrders);
    } catch (err) {
      console.warn('Cloud order refresh failed:', err.message || err);
      if (!cancelled) pushUpdate([]);
    }
  };

  // 2. Cloud sync in background (cross-device)
  refreshFromCloud();

  ensureFirebaseAuth().then(() => {
    if (cancelled) return;
    firestoreUnsub = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const cloudOrders = snapshot.docs.map((d) => parseOrderDoc(d.id, d.data()));
        pushUpdate(cloudOrders);
      },
      () => refreshFromCloud()
    );
  });

  const onLocalChange = () => pushUpdate([]);
  const onStorage = (e) => {
    if (e.key === ORDERS_KEY) pushUpdate([]);
  };
  const onBroadcast = () => pushUpdate([]);

  window.addEventListener('ordersChange', onLocalChange);
  window.addEventListener('storage', onStorage);
  ordersBroadcast?.addEventListener('message', onBroadcast);
  const interval = setInterval(refreshFromCloud, 5000);

  return () => {
    cancelled = true;
    firestoreUnsub();
    window.removeEventListener('ordersChange', onLocalChange);
    window.removeEventListener('storage', onStorage);
    ordersBroadcast?.removeEventListener('message', onBroadcast);
    clearInterval(interval);
  };
};
