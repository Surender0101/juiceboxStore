import React, { useState, useEffect } from 'react';
import { Plus, Star, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../services/db';
import { formatINR } from '../utils/formatPrice';
import './MenuSection.css';

const categories = ['All', 'Fruit Juices', 'Smoothies', 'Detox Juices', 'Protein Shakes', 'Functional'];

const MenuSection = ({ addToCart }) => {
  const [activeTab, setActiveTab] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = activeTab === 'All'
    ? products
    : products.filter((p) => p.category === activeTab);

  return (
    <section id="menu" className="menu section-padding">
      <div className="container">
        <div className="section-header text-center">
          <span className="section-subtitle">Our Menu</span>
          <h2 className="heading-secondary">Freshly Crafted For You</h2>
          <p>Every drink is cold-pressed to order using premium seasonal fruits. All prices in INR.</p>
        </div>

        <div className="menu-filters d-flex justify-content-center mb-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${activeTab === category ? 'active' : ''}`}
              onClick={() => setActiveTab(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="menu-grid grid grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="product-card skeleton-card" />
            ))}
          </div>
        ) : (
          <motion.div layout className="menu-grid grid grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="product-card card"
                >
                  <div className="product-img-wrapper">
                    <img src={product.image} alt={product.name} className="product-img" loading="lazy" />
                    {product.popular && (
                      <span className="product-badge popular">
                        <Flame size={12} /> Bestseller
                      </span>
                    )}
                    <span className="product-badge calories">{product.calories} kcal</span>
                  </div>

                  <div className="product-info">
                    <div className="product-meta d-flex align-center justify-content-between mb-1">
                      <span className="product-category">{product.category}</span>
                      <span className="product-size">{product.size}</span>
                    </div>

                    <div className="d-flex justify-content-between align-center mb-1">
                      <h3 className="product-title">{product.name}</h3>
                    </div>

                    <div className="product-rating d-flex align-center gap-1 mb-2">
                      <Star size={14} fill="#F4A261" color="#F4A261" />
                      <span>{product.rating}</span>
                    </div>

                    <p className="product-desc text-muted mb-3">{product.desc}</p>

                    <div className="product-footer d-flex align-center justify-content-between">
                      <span className="product-price">{formatINR(product.price)}</span>
                      <button
                        type="button"
                        className="btn btn-primary add-btn"
                        onClick={() => addToCart(product)}
                      >
                        <Plus size={18} /> Add
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <p className="text-center text-muted mt-4">No items in this category yet. Check back soon!</p>
        )}
      </div>
    </section>
  );
};

export default MenuSection;
