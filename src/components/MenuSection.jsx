import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/db';
import './MenuSection.css';

const categories = ['All', 'Fruit Juices', 'Smoothies', 'Detox Juices', 'Protein Shakes', 'Functional'];

const MenuSection = ({ addToCart }) => {
    const [activeTab, setActiveTab] = useState('All');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts(getProducts());
    }, []);

    const filteredProducts = activeTab === 'All'
        ? products
        : products.filter(p => p.category === activeTab);

    return (
        <section id="menu" className="menu section-padding">
            <div className="container">
                <div className="text-center mb-4 pb-2">
                    <span className="section-subtitle">Our Menu</span>
                    <h2 className="heading-secondary">Freshly Squeezed For You</h2>
                </div>

                <div className="menu-filters mb-4 pb-2 d-flex justify-content-center">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`filter-btn ${activeTab === category ? 'active' : ''}`}
                            onClick={() => setActiveTab(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <motion.div layout className="grid grid-cols-4 menu-grid">
                    <AnimatePresence>
                        {filteredProducts.map(product => (
                            <motion.div
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="card product-card"
                            >
                                <div className="product-img-wrapper">
                                    <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                                    <span className="product-calories">{product.calories} kcal</span>
                                </div>
                                <div className="product-info mt-3">
                                    <div className="d-flex justify-content-between align-center mb-1">
                                        <h3 className="product-title">{product.name}</h3>
                                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                                    </div>
                                    <p className="product-desc text-muted mb-3">{product.desc}</p>

                                    <button
                                        className="btn btn-primary w-100 justify-content-center"
                                        onClick={() => addToCart(product)}
                                    >
                                        <Plus size={18} /> Add to Cart
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default MenuSection;
