import React from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSection = () => {
    return (
        <section id="contact" className="section-padding" style={{ paddingBottom: '2rem' }}>
            <div className="container">
                <motion.div
                    className="card"
                    style={{ maxWidth: '800px', margin: '0 auto', border: '1px solid var(--color-primary)' }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-2" style={{ gap: '2rem' }}>
                        <div>
                            <span className="section-subtitle">Get In Touch</span>
                            <h2 className="heading-secondary">We'd Love to Hear From You</h2>
                            <p className="text-muted mb-4">Have questions about our juices, catering services, or franchise opportunities? Send us a message!</p>

                            <div className="mb-4">
                                <a href="https://wa.me/9384527136" target="_blank" rel="noreferrer" className="btn" style={{ backgroundColor: '#25D366', color: 'white', width: '100%' }}>
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        <div>
                            <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        required
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'inherit' }}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Your Message..."
                                        rows="4"
                                        required
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', fontFamily: 'inherit', resize: 'vertical' }}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary justify-content-center">
                                    <Send size={18} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactSection;
