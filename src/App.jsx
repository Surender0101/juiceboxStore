import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import { ThemeProvider } from './components/ThemeContext';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import PaymentGateway from './pages/PaymentGateway';
import MyOrders from './pages/MyOrders';
import './index.css';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleCart = () => setIsCartOpen(!isCartOpen);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, newQuantity) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar toggleCart={toggleCart} cartCount={cartCount} />

          <main>
            <Routes>
              <Route path="/" element={<Home addToCart={addToCart} />} />
              <Route path="/checkout" element={<Checkout cartItems={cartItems} clearCart={clearCart} />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/payment" element={<PaymentGateway />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Routes>
          </main>

          <Footer />

          <CartSidebar
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
