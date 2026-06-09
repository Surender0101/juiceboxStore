import React from 'react';
import { Truck, Leaf, Clock, ShieldCheck } from 'lucide-react';
import './TrustBar.css';

const perks = [
  { icon: <Truck size={22} />, title: 'Free Delivery', desc: 'On orders above ₹199' },
  { icon: <Leaf size={22} />, title: '100% Natural', desc: 'No added preservatives' },
  { icon: <Clock size={22} />, title: 'Made Fresh Daily', desc: 'Cold-pressed every morning' },
  { icon: <ShieldCheck size={22} />, title: 'Hygienic Prep', desc: 'FSSAI compliant kitchen' },
];

const TrustBar = () => (
  <section className="trust-bar">
    <div className="container">
      <div className="trust-bar-grid">
        {perks.map((perk) => (
          <div key={perk.title} className="trust-item">
            <div className="trust-icon">{perk.icon}</div>
            <div>
              <h4>{perk.title}</h4>
              <p>{perk.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
