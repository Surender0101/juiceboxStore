import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getOrders } from '../services/db';
import { ShieldCheck, CheckCircle, Smartphone, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentGateway = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const orderData = location.state?.order; 
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!orderData) {
            navigate('/', { replace: true }); 
            return;
        }

        // Poll the mock database every 2 seconds to check if the Admin has verified the payment
        // by changing the order status to 'Preparing' or 'Completed'
        const interval = setInterval(() => {
            const allOrders = getOrders();
            const currentOrder = allOrders.find(o => o.id === orderData.id);
            
            if (currentOrder && (currentOrder.status === 'Preparing' || currentOrder.status === 'Completed')) {
                setIsSuccess(true);
                setIsProcessing(false);
                clearInterval(interval);
                
                setTimeout(() => {
                    navigate('/my-orders', { replace: true, state: { paymentSuccess: true } });
                }, 3000);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [orderData, navigate]);

    // Build the UPI Deep Link according to standard specifications
    const upiLink = `upi://pay?pa=9344820371@ptsbi&pn=JuiceBox&am=${orderData.total}&cu=INR&tn=Order_${orderData.id}`;
    
    // Generate QR Code URL using api.qrserver.com
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}&margin=10`;

    const handleMockPayment = () => {
        setIsProcessing(true);
        // Button just spins to show waiting state. The success is strictly handled by the polling interval above.
    };

    if (isSuccess) {
        return (
            <div className="section-padding d-flex align-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f0fdf4', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
                <motion.div
                    className="text-center card p-5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ maxWidth: '400px', width: '100%', borderColor: '#86efac', borderWidth: '2px' }}
                >
                    <CheckCircle size={80} color="#22c55e" className="mx-auto mb-4" />
                    <h2 className="mb-2" style={{ color: '#166534' }}>Payment Placed!</h2>
                    <p className="text-muted mb-4">We are verifying your ₹{orderData.total?.toFixed(2)} transfer.</p>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>Redirecting to your orders...</div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="section-padding d-flex align-center justify-content-center" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
            
            <motion.div 
                className="card shadow-lg" 
                style={{ maxWidth: '450px', width: '100%', overflow: 'hidden', padding: 0 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {/* Gateway Header */}
                <div className="p-4" style={{ backgroundColor: '#0f172a', color: 'white' }}>
                    <div className="d-flex justify-content-between align-center mb-2">
                        <span style={{ fontWeight: '600', letterSpacing: '1px' }}>UPI SECURE PAY</span>
                        <ShieldCheck size={20} color="#4ade80" />
                    </div>
                    <div className="text-muted mb-1" style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Paying to JuiceBox</div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold' }}>₹{orderData.total?.toFixed(2)}</div>
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>Order Ref: {orderData.id}</div>
                </div>

                {/* Gateway Body */}
                <div className="p-4 bg-white text-center">
                    <p className="mb-3 text-muted" style={{ fontSize: '1rem', fontWeight: '500' }}>
                        Scan QR Code with any UPI App
                    </p>

                    <div className="qr-container mx-auto mb-4 p-3" style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', display: 'inline-block' }}>
                        <img src={qrUrl} alt="UPI QR Code" style={{ width: '200px', height: '200px' }} />
                    </div>

                    <div className="d-flex align-center gap-2 justify-content-center mb-4 text-muted" style={{ fontSize: '0.85rem' }}>
                        <QrCode size={16} /> GPay • PhonePe • Paytm • BHIM
                    </div>

                    <p className="mb-2 text-muted" style={{ fontSize: '0.9rem' }}>Or pay directly on your mobile device:</p>
                    <a 
                        href={upiLink}
                        className="btn w-100 d-flex justify-content-center align-center gap-2 py-3 mb-4"
                        style={{ backgroundColor: '#0ea5e9', color: 'white', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '600', textDecoration: 'none' }}
                    >
                        <Smartphone size={20} /> Open UPI App
                    </a>

                    <hr className="mb-4" style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

                    <button 
                        className="btn w-100 d-flex justify-content-center align-center gap-2 py-3"
                        style={{ backgroundColor: '#22c55e', color: 'white', borderRadius: '8px', fontSize: '1rem', fontWeight: '600' }}
                        onClick={handleMockPayment}
                        disabled={isProcessing}
                    >
                        {isProcessing ? (
                            <span className="d-flex align-center gap-2">
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                                    <ShieldCheck size={20} />
                                </motion.div>
                                Waiting for Admin Verification...
                            </span>
                        ) : (
                            "I have completed the payment"
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentGateway;
