// src/services/db.js
// A simple service to mock a backend using localStorage

const PRODUCTS_KEY = 'juicebox_products';
const ORDERS_KEY = 'juicebox_orders';
const USERS_KEY = 'juicebox_users';
const CURRENT_USER_KEY = 'juicebox_current_user';

// Default products to populate if the store is empty
const defaultProducts = [
  {
    id: 1,
    name: "Tropical Sunrise",
    description: "Mango, Pineapple, Orange, Guava",
    price: 150.00,
    category: "Fruit Juices",
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&q=80",
    popular: true
  },
  {
    id: 2,
    name: "Green Detox",
    description: "Spinach, Kale, Apple, Celery, Lemon",
    price: 180.00,
    category: "Green Juices",
    image: "https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=500",
    popular: true
  },
  {
    id: 3,
    name: "Berry Blast",
    description: "Strawberry, Blueberry, Raspberry, Almond Milk",
    price: 200.00,
    category: "Smoothies",
    image: "https://images.pexels.com/photos/255514/pexels-photo-255514.jpeg?auto=compress&cs=tinysrgb&w=500",
    popular: true
  },
  {
    id: 4,
    name: "Citrus Zing",
    description: "Grapefruit, Orange, Lemon, Ginger",
    price: 140.00,
    category: "Fruit Juices",
    image: "https://images.pexels.com/photos/434295/pexels-photo-434295.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 5,
    name: "Protein Power",
    description: "Banana, Peanut Butter, Chocolate Protein, Oat Milk",
    price: 250.00,
    category: "Smoothies",
    image: "https://images.pexels.com/photos/812875/pexels-photo-812875.jpeg?auto=compress&cs=tinysrgb&w=500"
  },
  {
    id: 6,
    name: "Beet Root Vitality",
    description: "Beet, Carrot, Apple, Ginger",
    price: 180.00,
    category: "Functional",
    image: "https://images.pexels.com/photos/4051662/pexels-photo-4051662.jpeg?auto=compress&cs=tinysrgb&w=500"
  }
];

// --- USERS ---

export const getUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const registerUser = (name, email, password) => {
  const users = getUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }
  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Invalid email or password');
  }
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
};

// --- PRODUCTS ---

export const getProducts = () => {
  let stored = localStorage.getItem(PRODUCTS_KEY);
  
  // Force update any cached default products that have broken/old images
  if (stored) {
    let products = JSON.parse(stored);
    let updated = false;
    products = products.map(p => {
      const def = defaultProducts.find(d => d.id === p.id);
      if (def && p.image !== def.image) {
        p.image = def.image;
        updated = true;
      }
      return p;
    });
    if (updated) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      stored = JSON.stringify(products);
    }
  }

  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
    return defaultProducts;
  }
  
  return JSON.parse(stored);
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now() };
  products.push(newProduct);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
  return newProduct;
};

export const deleteProduct = (id) => {
  const products = getProducts();
  const updated = products.filter(p => p.id !== id);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateProduct = (id, updatedFields) => {
  const products = getProducts();
  const updatedProducts = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
};

export const getOrders = () => {
  const stored = localStorage.getItem(ORDERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addOrder = (order) => {
  const orders = getOrders();
  const newOrder = {
    ...order,
    id: 'ORD-' + Math.floor(100000 + Math.random() * 900000), // e.g. ORD-123456
    status: 'Pending',
    date: new Date().toISOString()
  };
  const updatedOrders = [newOrder, ...orders];
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
  return newOrder;
};

export const updateOrderStatus = (id, status) => {
  const orders = getOrders();
  const updatedOrders = orders.map(o => o.id === id ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
};
