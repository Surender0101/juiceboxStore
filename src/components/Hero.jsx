import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Star } from 'lucide-react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-bg-pattern" />
      <div className="container hero-container grid grid-cols-2 align-center">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="hero-badge">
            <span className="badge-pulse" />
            Hosur&apos;s #1 Fresh Juice Bar
          </span>

          <h1 className="heading-primary mt-4 mb-3">
            Sip Fresh.<br />
            <span className="text-gradient">Live Vibrant.</span>
          </h1>

          <p className="text-large text-muted mb-4">
            Handcrafted cold-pressed juices &amp; smoothies made from farm-fresh Indian fruits.
            Delivered across Hosur in under 45 minutes.
          </p>

          <div className="hero-actions d-flex gap-2 flex-wrap">
            <a href="#menu" className="btn btn-primary">
              <ShoppingBag size={20} /> Order Now
            </a>
            <a href="#menu" className="btn btn-outline">
              Explore Menu <ArrowRight size={20} />
            </a>
          </div>

          <div className="hero-rating d-flex align-center gap-2 mt-4">
            <div className="rating-stars d-flex align-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#F4A261" color="#F4A261" />
              ))}
            </div>
            <span className="rating-text">
              <strong>4.9</strong> from 2,400+ happy customers
            </span>
          </div>

          <div className="hero-stats d-flex mt-4 pt-4">
            <div className="stat-item">
              <h3 className="stat-value">12+</h3>
              <p className="stat-label">Signature Blends</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-value">45min</h3>
              <p className="stat-label">Avg. Delivery</p>
            </div>
            <div className="stat-item">
              <h3 className="stat-value">100%</h3>
              <p className="stat-label">Natural Ingredients</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero-image-wrapper"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="hero-blob" />
          <div className="hero-price-tag">
            <span className="price-from">Starting at</span>
            <span className="price-amount">₹99</span>
          </div>
          <motion.img
            src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800"
            alt="Fresh orange juice"
            className="hero-image main-img"
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          />
          <motion.div
            className="hero-float-card glass"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
          >
            <span className="float-emoji">🥭</span>
            <div>
              <strong>Alphonso Mango</strong>
              <p>Seasonal special — ₹149</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
