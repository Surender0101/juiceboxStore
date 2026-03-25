import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreLocator = () => {
    return (
        <section id="locations" className="section-padding" style={{ backgroundColor: 'var(--color-bg-card)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
            <div className="container">
                <div className="grid grid-cols-2 align-center" style={{ gap: '3rem' }}>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="section-subtitle">Visit Us</span>
                        <h2 className="heading-secondary">Find a JuiceBox Near You</h2>
                        <p className="text-muted mb-4">Drop by one of our stores to grab a fresh cold-pressed juice or a warm smoothie bowl. We can't wait to see you!</p>

                        <div className="store-details card mb-3">
                            <h3 className="mb-3">Anna Nagar Branch</h3>
                            <ul className="text-muted" style={{ listStyle: 'none', padding: 0 }}>
                                <li className="d-flex align-center gap-2 mb-2"><MapPin size={18} className="text-primary" style={{ color: 'var(--color-primary)' }} /> 123 Main Road, Anna Nagar, Chennai 600040</li>
                                <li className="d-flex align-center gap-2 mb-2"><Clock size={18} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Mon-Sun: 7:00 AM - 9:00 PM</li>
                                <li className="d-flex align-center gap-2"><Phone size={18} className="text-primary" style={{ color: 'var(--color-primary)' }} /> (044) 1234-5678</li>
                            </ul>
                        </div>

                        <div className="store-details card" style={{ opacity: 0.8 }}>
                            <h3 className="mb-3">T. Nagar Branch</h3>
                            <ul className="text-muted" style={{ listStyle: 'none', padding: 0 }}>
                                <li className="d-flex align-center gap-2 mb-2"><MapPin size={18} className="text-primary" style={{ color: 'var(--color-primary)' }} /> 45 Pondy Bazaar, T. Nagar, Chennai 600017</li>
                                <li className="d-flex align-center gap-2 mb-2"><Clock size={18} className="text-primary" style={{ color: 'var(--color-primary)' }} /> Mon-Sun: 8:00 AM - 10:00 PM</li>
                                <li className="d-flex align-center gap-2"><Phone size={18} className="text-primary" style={{ color: 'var(--color-primary)' }} /> (044) 8765-4321</li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.div
                        className="map-container"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}
                    >
                        {/* Visual map placeholder with iframe */}
                        <iframe
                            src="https://maps.google.com/maps?q=Chennai&t=&z=12&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Store Map"
                        ></iframe>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default StoreLocator;
