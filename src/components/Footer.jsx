import React from 'react';
import { Droplet, Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container grid grid-cols-4">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <Droplet className="logo-icon" fill="var(--color-primary)" color="var(--color-primary)" size={28} />
                        <span>JuiceBox</span>
                    </div>
                    <p className="footer-desc text-muted mb-3">
                        Fresh, cold-pressed juices made from real fruits every day. Pure energy in every drop.
                    </p>
                    <div className="social-links d-flex gap-2">
                        <a href="#" className="social-icon"><Instagram size={20} /></a>
                        <a href="#" className="social-icon"><Facebook size={20} /></a>
                        <a href="#" className="social-icon"><Twitter size={20} /></a>
                    </div>
                </div>

                <div className="footer-links">
                    <h4 className="footer-title">Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#locations">Store Locations</a></li>
                        <li><a href="#blog">Health Blog</a></li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4 className="footer-title">Our Menu</h4>
                    <ul>
                        <li><a href="#menu">Fruit Juices</a></li>
                        <li><a href="#menu">Smoothies</a></li>
                        <li><a href="#menu">Detox Blends</a></li>
                        <li><a href="#menu">Protein Shakes</a></li>
                    </ul>
                </div>

                <div className="footer-newsletter">
                    <h4 className="footer-title">Newsletter</h4>
                    <p className="text-muted mb-2">Subscribe to get 10% off your first order!</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your email address" required />
                        <button type="submit" className="btn btn-primary btn-icon" aria-label="Subscribe">
                            <Mail size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <div className="footer-bottom text-center">
                <p className="text-muted">&copy; {new Date().getFullYear()} JuiceBox. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
