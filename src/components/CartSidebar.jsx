import React from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose, cartItems, updateQuantity, removeFromCart }) => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <>
            <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h3>Your Cart</h3>
                    <button className="icon-btn" onClick={onClose} aria-label="Close cart">
                        <X size={24} />
                    </button>
                </div>

                <div className="cart-content">
                    {cartItems.length === 0 ? (
                        <div className="cart-empty">
                            <ShoppingBag size={48} className="text-muted mb-3" />
                            <p>Your cart is empty.</p>
                            <button className="btn btn-outline mt-4" onClick={onClose}>Continue Shopping</button>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="cart-item-img">
                                        <img src={item.image || 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=200'} alt={item.name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <div className="d-flex justify-content-between">
                                            <h4>{item.name}</h4>
                                            <button className="cart-item-remove" onClick={() => removeFromCart(item.id)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                        <p className="cart-item-price">₹{item.price.toFixed(2)}</p>
                                        <div className="cart-item-controls">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="quantity-btn"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="quantity-btn"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-summary mb-3">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Subtotal</span>
                                <strong>₹{subtotal.toFixed(2)}</strong>
                            </div>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>Shipping and taxes calculated at checkout.</p>
                        </div>
                        <Link to="/checkout" className="btn btn-primary w-100 justify-content-center" onClick={onClose}>
                            Go to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
