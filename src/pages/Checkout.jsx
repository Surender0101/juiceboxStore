import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Info, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { addOrder, getCurrentUser } from '../services/db';
import './Checkout.css';

const Checkout = ({ cartItems, clearCart }) => {
    const [orderComplete, setOrderComplete] = useState(false);
    const navigate = useNavigate();

    const user = getCurrentUser();

    useEffect(() => {
        if (!user) {
            navigate('/auth', { state: { returnUrl: '/checkout' } });
        }
    }, [user, navigate]);

    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const deliveryFee = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + tax + deliveryFee;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const orderData = {
            customer: {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                zipCode: formData.get('zipCode')
            },
            items: cartItems,
            total,
            status: 'Payment Pending'
        };

        const savedOrder = await addOrder(orderData); // Save order for admin tracking

        // Redirect to Mock Payment Gateway
        navigate('/payment', { state: { order: savedOrder } });
        clearCart();
    };

    if (!user) return null; // Prevent flicker before redirect

    if (orderComplete) {
        return (
            <div className="checkout-page d-flex align-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '100px' }}>
                <motion.div
                    className="text-center card p-4"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ maxWidth: '400px', width: '100%' }}
                >
                    <CheckCircle size={64} className="text-secondary mx-auto mb-3" style={{ color: 'var(--color-secondary)' }} />
                    <h2 className="mb-2">Order Confirmed!</h2>
                    <p className="text-muted mb-4">Your fresh juices are being prepared and will be delivered soon.</p>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>Redirecting to home...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="checkout-page section-padding" style={{ paddingTop: '100px' }}>
            <div className="container">
                <Link to="/" className="d-flex align-center gap-2 text-muted mb-4" style={{ textDecoration: 'none', fontWeight: '600' }}>
                    <ArrowLeft size={20} /> Back to Menu
                </Link>

                <h1 className="heading-secondary mb-4">Checkout</h1>

                <div className="grid checkout-grid">
                    <div className="checkout-form">
                        <form onSubmit={handleSubmit} className="card p-4">
                            <h3 className="mb-3">Contact Information</h3>
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <input type="text" name="firstName" placeholder="First Name" required className="form-input" />
                                <input type="text" name="lastName" placeholder="Last Name" required className="form-input" />
                            </div>
                            <input type="email" name="email" placeholder="Email Address" required className="form-input mb-4 w-100" />
                            <input type="tel" name="phone" placeholder="Phone Number" required className="form-input mb-4 w-100" />

                            <h3 className="mb-3">Delivery Address</h3>
                            <input type="text" name="address" placeholder="Street Address" required className="form-input mb-3 w-100" />
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <input type="text" name="city" placeholder="City" required className="form-input" />
                                <input type="text" name="zipCode" placeholder="Zip Code" required className="form-input" />
                            </div>

                            <h3 className="mb-3 d-flex align-center gap-2">Secure Checkout <Lock size={16} /></h3>
                            <div className="payment-instructions p-3 mb-4" style={{ backgroundColor: 'var(--color-background-alt)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                <p className="mb-2" style={{ fontWeight: '500' }}>You will be redirected to the secure payment gateway to complete your purchase.</p>
                                <p className="mt-2 text-muted" style={{ fontSize: '0.85rem' }}>Accepted payment methods: UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, and NetBanking.</p>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-100 justify-content-center p-3 mt-4"
                                disabled={cartItems.length === 0}
                            >
                                Proced to Payment (₹{total.toFixed(2)})
                            </button>
                        </form>
                    </div>

                    <div className="checkout-summary">
                        <div className="card p-4 sticky-summary">
                            <h3 className="mb-4">Order Summary</h3>

                            {cartItems.length === 0 ? (
                                <p className="text-muted">Your cart is empty.</p>
                            ) : (
                                <>
                                    <div className="order-items mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {cartItems.map(item => (
                                            <div key={item.id} className="d-flex justify-content-between align-center mb-3">
                                                <div className="d-flex align-center gap-2">
                                                    <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                                                    <div>
                                                        <h4 style={{ fontSize: '0.9rem', margin: 0 }}>{item.name}</h4>
                                                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Qty: {item.quantity}</span>
                                                    </div>
                                                </div>
                                                <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="summary-totals" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                        <div className="d-flex justify-content-between mb-2 text-muted">
                                            <span>Subtotal</span>
                                            <span>₹{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2 text-muted">
                                            <span>Delivery Fee</span>
                                            <span>₹{deliveryFee.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-3 text-muted">
                                            <span>Estimated Tax (8%)</span>
                                            <span>₹{tax.toFixed(2)}</span>
                                        </div>
                                        <div className="d-flex justify-content-between align-center" style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1rem' }}>
                                            <span style={{ fontSize: '1.2rem', fontWeight: '800' }}>Total</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-primary)' }}>₹{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
