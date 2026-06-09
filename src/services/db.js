import { db } from '../firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

const USERS_KEY = 'juicebox_users';
const CURRENT_USER_KEY = 'juicebox_current_user';
const ORDERS_KEY = 'juicebox_orders';
const CATALOG_VERSION_KEY = 'juicebox_catalog_version';
const CATALOG_VERSION = '4';

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

const normalizeProduct = (product) => ({
  ...product,
  desc: product.desc || product.description || '',
  price: Number(product.price) || 0,
  calories: product.calories || 120,
  size: product.size || '350ml',
  rating: product.rating || 4.5,
});

const defaultProducts = [
  {
    id: 1,
    name: 'Tropical Sunrise',
    desc: 'Alphonso mango, pineapple, orange & guava — a sunshine blend',
    price: 149,
    category: 'Fruit Juices',
    calories: 142,
    size: '350ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 2,
    name: 'Citrus Zing',
    desc: 'Fresh orange, grapefruit, lemon & ginger kick',
    price: 129,
    category: 'Fruit Juices',
    calories: 98,
    size: '350ml',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1613478511701-04aa370f7b71?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 3,
    name: 'Mango Lassi Fusion',
    desc: 'Creamy mango, yogurt & cardamom — Indian classic',
    price: 159,
    category: 'Fruit Juices',
    calories: 168,
    size: '400ml',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1633506553767-f869018b8ac6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    name: 'Watermelon Cooler',
    desc: 'Chilled watermelon, mint & lime — ultra refreshing',
    price: 119,
    category: 'Fruit Juices',
    calories: 72,
    size: '400ml',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1563564817-c2b16df8c882?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    name: 'Berry Blast',
    desc: 'Strawberry, blueberry, raspberry & almond milk',
    price: 199,
    category: 'Smoothies',
    calories: 185,
    size: '400ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da4428?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 6,
    name: 'Chocolate Banana Smoothie',
    desc: 'Ripe banana, cocoa, dates & oat milk',
    price: 179,
    category: 'Smoothies',
    calories: 210,
    size: '400ml',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1572490122747-3969b75c6993?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 7,
    name: 'Green Detox',
    desc: 'Spinach, kale, apple, celery & lemon cleanse',
    price: 189,
    category: 'Detox Juices',
    calories: 88,
    size: '350ml',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1502741126164-b1184000106d?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 8,
    name: 'Amla Immunity Shot',
    desc: 'Pure amla, turmeric & honey — daily immunity boost',
    price: 99,
    category: 'Detox Juices',
    calories: 45,
    size: '100ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546548970-69c40f780978?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 9,
    name: 'Beet Root Vitality',
    desc: 'Beetroot, carrot, apple & ginger for natural energy',
    price: 169,
    category: 'Detox Juices',
    calories: 110,
    size: '350ml',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590412201108-23fd526749c0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 10,
    name: 'Protein Power',
    desc: 'Banana, peanut butter, whey protein & oat milk',
    price: 249,
    category: 'Protein Shakes',
    calories: 320,
    size: '450ml',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1593095948071-14c416f6a29a?auto=format&fit=crop&w=600&q=80',
    popular: true,
  },
  {
    id: 11,
    name: 'Peanut Butter Fuel',
    desc: 'Roasted peanut, banana, flax seeds & almond milk',
    price: 229,
    category: 'Protein Shakes',
    calories: 295,
    size: '450ml',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 12,
    name: 'Turmeric Golden Milk',
    desc: 'Turmeric, almond milk, cinnamon & black pepper',
    price: 159,
    category: 'Functional',
    calories: 130,
    size: '300ml',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1564890369478-c89d98d30bbb?auto=format&fit=crop&w=600&q=80',
  },
];

const defaultProductMap = Object.fromEntries(
  defaultProducts.map((p) => [p.id.toString(), normalizeProduct(p)])
);

const mergeWithCatalogDefaults = (product) => {
  const normalized = normalizeProduct(product);
  const defaults = defaultProductMap[normalized.id?.toString()];
  if (!defaults) return normalized;
  return normalizeProduct({
    ...defaults,
    ...normalized,
    name: defaults.name,
    desc: defaults.desc,
    image: defaults.image,
    category: defaults.category,
    calories: defaults.calories,
    size: defaults.size,
    rating: defaults.rating,
    popular: defaults.popular ?? normalized.popular,
  });
};

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
      await setDoc(doc(db, 'products', prod.id.toString()), prod, { merge: true });
    } catch (err) {
      console.warn(`Could not sync product ${prod.id}:`, err);
    }
  }

  localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
};

export const getProducts = async () => {
  await syncProductCatalog();

  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    let products = querySnapshot.docs.map((d) => mergeWithCatalogDefaults({ ...d.data(), id: d.id }));

    if (products.length === 0) {
      for (const prod of defaultProducts) {
        try {
          await setDoc(doc(db, 'products', prod.id.toString()), prod);
        } catch (err) {
          console.warn(`Could not seed product ${prod.id}:`, err);
        }
      }
      return defaultProducts.map(normalizeProduct);
    }

    const existingIds = new Set(products.map((p) => p.id.toString()));
    for (const prod of defaultProducts) {
      if (!existingIds.has(prod.id.toString())) {
        try {
          await setDoc(doc(db, 'products', prod.id.toString()), prod);
        } catch (err) {
          console.warn(`Could not add missing product ${prod.id}:`, err);
        }
      }
    }

    const updatedSnapshot = await getDocs(collection(db, 'products'));
    products = updatedSnapshot.docs.map((d) => mergeWithCatalogDefaults({ ...d.data(), id: d.id }));
    return products.sort((a, b) => Number(a.id) - Number(b.id));
  } catch (err) {
    console.warn('Firestore products unavailable, using local catalog:', err);
    return defaultProducts.map(normalizeProduct);
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
};

const buildOrder = (order) => {
  const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  return {
    ...order,
    id: orderId,
    status: order.status || 'Payment Pending',
    date: new Date().toISOString(),
    items: (order.items || []).map(({ id, name, price, quantity, image }) => ({
      id: String(id),
      name: String(name),
      price: Number(price) || 0,
      quantity: Number(quantity) || 1,
      image: image || null,
    })),
    total: Number(order.total) || 0,
    customer: order.customer || {},
  };
};

const mergeOrders = (firestoreOrders, localOrders) => {
  const orderMap = new Map();
  localOrders.forEach((o) => orderMap.set(o.id, o));
  firestoreOrders.forEach((o) => orderMap.set(o.id, { ...orderMap.get(o.id), ...o }));
  return Array.from(orderMap.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const getOrderById = async (id) => {
  const localOrder = getLocalOrders().find((o) => o.id === id);
  if (localOrder) return localOrder;

  try {
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
  const localOrders = getLocalOrders();
  let firestoreOrders = [];

  try {
    const querySnapshot = await getDocs(collection(db, 'orders'));
    firestoreOrders = querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }));
    firestoreOrders.forEach((order) => saveLocalOrder(order));
  } catch (err) {
    console.warn('Firestore orders fetch failed, using local orders:', err);
  }

  return mergeOrders(firestoreOrders, getLocalOrders());
};

export const addOrder = async (order) => {
  const newOrder = buildOrder(order);

  // Always save locally first so admin tab on same browser sees orders immediately
  saveLocalOrder({ ...newOrder, storedLocally: true });

  try {
    await setDoc(doc(db, 'orders', newOrder.id), { ...newOrder, storedLocally: false });
    const syncedOrder = { ...newOrder, storedLocally: false };
    saveLocalOrder(syncedOrder);
    return syncedOrder;
  } catch (err) {
    console.warn('Firestore save failed, order kept in local storage:', err);
    return { ...newOrder, storedLocally: true };
  }
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
    await setDoc(doc(db, 'orders', id.toString()), updatedOrder, { merge: true });
  } catch (err) {
    console.warn('Firestore status update failed, saved locally:', err);
  }

  return updatedOrder;
};

export const subscribeToOrders = (callback) => {
  const refresh = async () => {
    const orders = await getOrders();
    callback(orders);
  };

  refresh();

  const onOrdersChange = () => refresh();
  const onStorage = (e) => {
    if (e.key === ORDERS_KEY) refresh();
  };

  window.addEventListener('ordersChange', onOrdersChange);
  window.addEventListener('storage', onStorage);
  const interval = setInterval(refresh, 4000);

  return () => {
    window.removeEventListener('ordersChange', onOrdersChange);
    window.removeEventListener('storage', onStorage);
    clearInterval(interval);
  };
};
