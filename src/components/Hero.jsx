import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="container hero-container grid grid-cols-2 align-center">
                <motion.div
                    className="hero-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="hero-badge group">
                        <span className="badge-pulse"></span>
                        100% Organic & Fresh
                    </span>
                    <h1 className="heading-primary mt-4 mb-3">
                        Fresh Juice.<br />
                        <span className="text-gradient">Pure Energy.</span>
                    </h1>
                    <p className="text-large text-muted mb-4">
                        Cold-pressed juices made from real fruits every day. Boost your immunity and refresh your day with nature's best ingredients.
                    </p>
                    <div className="hero-actions d-flex gap-2">
                        <a href="#menu" className="btn btn-primary">
                            <ShoppingBag size={20} /> Order Now
                        </a>
                        <a href="#about" className="btn btn-outline">
                            View Menu <ArrowRight size={20} />
                        </a>
                    </div>

                    <div className="hero-stats d-flex mt-4 pt-4">
                        <div className="stat-item">
                            <h3 className="stat-value">50k+</h3>
                            <p className="stat-label">Happy Customers</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-value">25+</h3>
                            <p className="stat-label">Fresh Flavors</p>
                        </div>
                        <div className="stat-item">
                            <h3 className="stat-value">100%</h3>
                            <p className="stat-label">Natural</p>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    className="hero-image-wrapper"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="hero-blob"></div>
                    {/* Main Hero Image */}
                    <motion.img
                        src="https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=800"
                        alt="Fresh Orange Juice splash"
                        className="hero-image main-img"
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    />

                    {/* Floating fruits for effect */}
                    <motion.img
                        src="https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=200&q=80"
                        alt="Sliced Orange"
                        className="floating-fruit fruit-1"
                        animate={{ y: [0, 20, 0], rotate: [0, 10, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                    />
                    <motion.img
                        src="https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=200&q=80"
                        alt="Pineapple"
                        className="floating-fruit fruit-2 glass"
                        animate={{ y: [0, -20, 0], rotate: [0, -15, 15, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 1 }}
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
