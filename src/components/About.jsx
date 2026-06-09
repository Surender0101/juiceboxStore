import React from 'react';
import { Leaf, Droplet, Heart, Recycle } from 'lucide-react';
import { motion } from 'framer-motion';
import './About.css';

const features = [
  {
    icon: <Leaf size={28} />,
    title: 'Farm-Fresh Fruits',
    desc: 'Sourced daily from local farms across Tamil Nadu for peak ripeness and flavour.',
    color: 'var(--color-secondary)',
  },
  {
    icon: <Droplet size={28} />,
    title: 'Cold-Pressed Daily',
    desc: 'Slow-pressed to retain vitamins, enzymes, and natural taste in every bottle.',
    color: 'var(--color-primary)',
  },
  {
    icon: <Heart size={28} />,
    title: 'Zero Added Sugar',
    desc: 'Naturally sweetened by real fruits — no syrups, concentrates, or artificial sweeteners.',
    color: 'var(--color-accent-watermelon)',
  },
  {
    icon: <Recycle size={28} />,
    title: 'Eco Packaging',
    desc: '100% recyclable PET bottles and compostable cups for a greener Hosur.',
    color: 'var(--color-accent-mango)',
  },
];

const About = () => (
  <section id="about" className="about section-padding">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Our Story</span>
        <h2 className="heading-secondary">Why JuiceBox?</h2>
        <p>
          Born in Hosur, JuiceBox was built on a simple belief — healthy living should taste incredible.
          We craft every drink with love, using recipes inspired by Indian flavours and global wellness trends.
        </p>
      </div>

      <div className="grid grid-cols-4 about-grid">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="card feature-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div
              className="feature-icon-wrapper mb-3"
              style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
            >
              {feature.icon}
            </div>
            <h3 className="mb-2">{feature.title}</h3>
            <p className="text-muted">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default About;
