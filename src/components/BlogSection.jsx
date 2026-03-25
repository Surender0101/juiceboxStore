import React from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const articles = [
    { id: 1, title: '7 Benefits of Cold-Pressed Juices', date: 'Oct 12, 2023', image: 'https://images.pexels.com/photos/1337825/pexels-photo-1337825.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Health Base' },
    { id: 2, title: 'Best Juices for Immunity Boost', date: 'Oct 05, 2023', image: 'https://images.pexels.com/photos/4051662/pexels-photo-4051662.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Immunity' },
    { id: 3, title: 'Morning Detox Tips to Start Your Day', date: 'Sep 28, 2023', image: 'https://images.pexels.com/photos/1233319/pexels-photo-1233319.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Detox' },
];

const BlogSection = () => {
    return (
        <section id="blog" className="section-padding">
            <div className="container">
                <div className="d-flex justify-content-between align-center mb-4 pb-2">
                    <div>
                        <span className="section-subtitle">Health Tips</span>
                        <h2 className="heading-secondary mb-0">From Our Blog</h2>
                    </div>
                    <button className="btn btn-outline" style={{ display: 'none' }}></button> {/* For spacing if needed */}
                </div>

                <div className="grid grid-cols-3">
                    {articles.map((article, i) => (
                        <motion.div
                            key={article.id}
                            className="card p-0"
                            style={{ overflow: 'hidden', padding: 0 }}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div style={{ position: 'relative', height: '200px' }}>
                                <img src={article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                <span className="product-calories" style={{ top: '10px', right: 'auto', left: '10px', backgroundColor: 'var(--color-primary)', color: '#fff' }}>
                                    {article.tag}
                                </span>
                            </div>
                            <div className="p-4" style={{ padding: '1.5rem' }}>
                                <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>{article.date}</p>
                                <h3 className="mb-3" style={{ fontSize: '1.2rem' }}>{article.title}</h3>
                                <a href="#" className="d-flex align-center gap-2" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '700' }}>
                                    Read More <ArrowRight size={16} />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BlogSection;
