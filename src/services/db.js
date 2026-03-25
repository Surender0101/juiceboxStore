// src/services/db.js
// Database service using Firebase Cloud Firestore for Products and Orders, 
// and localStorage for active session UserAuth tracking.

import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';

const USERS_KEY = 'juicebox_users';
const CURRENT_USER_KEY = 'juicebox_current_user';

// Default products to populate if the database is empty
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

// --- PRODUCTS (Firebase Firestore) ---

export const getProducts = async () => {
  const querySnapshot = await getDocs(collection(db, 'products'));
  let products = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

  // Populate default products if Cloud Database is empty
  if (products.length === 0) {
    for (const prod of defaultProducts) {
      // Use the static ID as the document ID for consistency
      await setDoc(doc(db, 'products', prod.id.toString()), prod);
    }
    const freshSnapshot = await getDocs(collection(db, 'products'));
    products = freshSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  }
  
  return products;
};

export const addProduct = async (product) => {
  const docRef = await addDoc(collection(db, 'products'), product);
  return { id: docRef.id, ...product };
};

export const deleteProduct = async (id) => {
  await deleteDoc(doc(db, 'products', id.toString()));
};

export const updateProduct = async (id, updatedFields) => {
  const productRef = doc(db, 'products', id.toString());
  await updateDoc(productRef, updatedFields);
};

// --- ORDERS (Firebase Firestore) ---

export const getOrders = async () => {
  const querySnapshot = await getDocs(collection(db, 'orders'));
  const orders = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  // Sort by date descending (newest first)
  return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
};

export const addOrder = async (order) => {
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
  const newOrder = {
    ...order,
    id: orderId,
    status: 'Pending',
    date: new Date().toISOString()
  };
  
  // Save order to Firestore with a custom readable ID
  await setDoc(doc(db, 'orders', orderId), newOrder);
  return newOrder;
};

export const updateOrderStatus = async (id, status) => {
  const orderRef = doc(db, 'orders', id.toString());
  await updateDoc(orderRef, { status });
};
