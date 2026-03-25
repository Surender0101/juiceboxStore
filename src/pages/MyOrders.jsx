import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrders, getCurrentUser } from '../services/db';
import { Package, Clock, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const user = getCurrentUser();
    
    // Check if we just arrived from a successful payment
    const [showSuccess, setShowSuccess] = useState(location.state?.paymentSuccess || false);

    useEffect(() => {
        if (!user || !user.email) {
            navigate('/auth');
            return;
        }
        // Fetch and filter orders for this user by email
        const allOrders = getOrders();
        const myOrders = allOrders.filter(
            o => o.customer && o.customer.email === user.email
        );
        setOrders(myOrders);
    }, [user?.email, navigate]);

    if (!user) return null;

    const StatusIcon = ({ status }) => {
        if (status === 'Completed') return <CheckCircle size={20} color="#22c55e" />;
        if (status === 'Preparing') return <Package size={20} color="#eab308" />;
        return <Clock size={20} color="#64748b" />;
    };

    return (
        <div className="section-padding" style={{ minHeight: '80vh', paddingTop: '100px' }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card mb-4 p-3 d-flex align-center justify-content-between"
                            style={{ backgroundColor: '#f0fdf4', borderColor: '#86efac', borderWidth: '2px', color: '#166534' }}
                        >
                            <div className="d-flex align-center gap-2">
                                <CheckCircle size={24} color="#22c55e" />
                                <strong>Payment Successful!</strong> Your order has been placed successfully.
                            </div>
                            <button className="icon-btn" onClick={() => setShowSuccess(false)} style={{ color: '#166534' }}>
                                <X size={20} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <h1 className="heading-secondary mb-4">My Orders</h1>
                
                {orders.length === 0 ? (
                    <div className="card p-5 text-center">
                        <Package size={48} className="mx-auto mb-3 text-muted" />
                        <h3 className="mb-2">No orders yet</h3>
                        <p className="text-muted mb-4">You haven't placed any orders with JuiceBox yet.</p>
                        <button className="btn btn-primary" onClick={() => navigate('/')}>
                            View our Menu
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {orders.map((order, index) => (
                            <motion.div 
                                key={order.id} 
                                className="card p-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                style={{ borderLeft: `4px solid ${order.status === 'Completed' ? '#22c55e' : (order.status === 'Preparing' ? '#eab308' : '#cbd5e1')}` }}
                            >
                                <div className="d-flex flex-wrap justify-content-between align-center mb-3 pb-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>{order.id}</div>
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>{new Date(order.date).toLocaleString()}</div>
                                    </div>
                                    <div className="d-flex align-center gap-2" style={{ fontWeight: '600' }}>
                                        <StatusIcon status={order.status} />
                                        {order.status}
                                    </div>
                                </div>
                                
                                <div className="order-items mb-3">
                                    {order.items?.map(item => (
                                        <div key={item.id} className="d-flex justify-content-between align-center mb-2">
                                            <div className="d-flex align-center gap-3">
                                                <img src={item.image} alt={item.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                                <span>{item.quantity}x {item.name}</span>
                                            </div>
                                            <span className="text-muted">₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between align-center pt-3" style={{ borderTop: '1px dashed var(--color-border)' }}>
                                    <span className="text-muted">Total Paid via UPI</span>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{order.total?.toFixed(2)}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
