import React from 'react';
import { Droplet, Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-container grid grid-cols-4">
      <div className="footer-brand">
        <div className="footer-logo">
          <Droplet className="logo-icon" fill="var(--color-primary)" color="var(--color-primary)" size={28} />
          <span>JuiceBox</span>
        </div>
        <p className="footer-desc text-muted mb-3">
          Hosur&apos;s favourite fresh juice bar. Cold-pressed daily, delivered fast, priced fairly in INR.
        </p>
        <div className="footer-contact text-muted mb-3">
          <p className="d-flex align-center gap-2 mb-1"><MapPin size={16} /> Bharathi Nagar, Hosur 635126</p>
          <p className="d-flex align-center gap-2"><Phone size={16} /> +91 93448 20371</p>
        </div>
        <div className="social-links d-flex gap-2">
          <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={20} /></a>
          <a href="#" className="social-icon" aria-label="Facebook"><Facebook size={20} /></a>
        </div>
      </div>

      <div className="footer-links">
        <h4 className="footer-title">Quick Links</h4>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#locations">Store Locations</a></li>
        </ul>
      </div>

      <div className="footer-links">
        <h4 className="footer-title">Our Menu</h4>
        <ul>
          <li><a href="#menu">Fruit Juices — from ₹119</a></li>
          <li><a href="#menu">Smoothies — from ₹179</a></li>
          <li><a href="#menu">Detox Juices — from ₹99</a></li>
          <li><a href="#builder">Custom Builder</a></li>
        </ul>
      </div>

      <div className="footer-newsletter">
        <h4 className="footer-title">Get 15% Off</h4>
        <p className="text-muted mb-2">Subscribe for exclusive offers &amp; new flavour launches.</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="your@email.com" required />
          <button type="submit" className="btn btn-primary btn-icon" aria-label="Subscribe">
            <Mail size={18} />
          </button>
        </form>
      </div>
    </div>

    <div className="footer-bottom text-center">
      <p className="text-muted">&copy; {new Date().getFullYear()} JuiceBox Hosur. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
