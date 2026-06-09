import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import './StoreLocator.css';

const stores = [
  {
    name: 'Bharathi Nagar — Flagship',
    address: 'Bharathi Nagar, Hosur, Tamil Nadu 635126',
    hours: 'Mon–Sun: 7:00 AM – 10:00 PM',
    phone: '+91 93448 20371',
  },
  {
    name: 'Rayakottah Road',
    address: 'Rayakottah Road, Near Bus Stand, Hosur 635109',
    hours: 'Mon–Sun: 8:00 AM – 9:00 PM',
    phone: '+91 93448 20371',
  },
];

const StoreLocator = () => (
  <section id="locations" className="section-padding store-locator">
    <div className="container">
      <div className="grid grid-cols-2 align-center store-grid">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="section-header" style={{ margin: '0 0 2rem', textAlign: 'left' }}>
            <span className="section-subtitle">Visit Us</span>
            <h2 className="heading-secondary">Find JuiceBox in Hosur</h2>
            <p>Walk in for a fresh cold-press or order online for doorstep delivery across Hosur.</p>
          </div>

          {stores.map((store, i) => (
            <div key={store.name} className="card store-card mb-3" style={{ opacity: i === 1 ? 0.92 : 1 }}>
              <h3 className="mb-3">{store.name}</h3>
              <ul className="text-muted store-info">
                <li><MapPin size={18} /> {store.address}</li>
                <li><Clock size={18} /> {store.hours}</li>
                <li><Phone size={18} /> {store.phone}</li>
              </ul>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="map-container"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <iframe
            src="https://maps.google.com/maps?q=Hosur,Tamil+Nadu,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="JuiceBox Hosur Map"
          />
        </motion.div>
      </div>
    </div>
  </section>
);

export default StoreLocator;
