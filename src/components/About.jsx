import React from 'react';
import { Leaf, Droplet, Heart, Recycle } from 'lucide-react';
import { motion } from 'framer-motion';
import './About.css';

const features = [
    {
        icon: <Leaf size={32} />,
        title: '100% Natural',
        desc: 'No artificial flavors, colors, or preservatives. Just pure fruit goodness.',
        color: 'var(--color-secondary)'
    },
    {
        icon: <Droplet size={32} />,
        title: 'Freshly Prepared',
        desc: 'Cold-pressed daily to lock in vitamins, minerals, and enzymes.',
        color: 'var(--color-primary)'
    },
    {
        icon: <Heart size={32} />,
        title: 'No Added Sugar',
        desc: 'Naturally sweet from the best quality fruits. Healthy and delicious.',
        color: 'var(--color-accent-watermelon)'
    },
    {
        icon: <Recycle size={32} />,
        title: 'Eco Friendly',
        desc: 'Sustainable sourcing and 100% recyclable packaging materials.',
        color: 'var(--color-accent-mango)'
    }
];

const About = () => {
    return (
        <section id="about" className="about section-padding">
            <div className="container">
                <div className="text-center mb-4 pb-2">
                    <span className="section-subtitle">Our Story</span>
                    <h2 className="heading-secondary">Why Choose JuiceBox?</h2>
                    <p className="text-muted mx-auto about-desc">
                        We believe that healthy living should be pure, simple, and delicious. That's why we source the freshest seasonal fruits to craft cold-pressed juices that fuel your day with real energy.
                    </p>
                </div>

                <div className="grid grid-cols-4 about-grid mt-4">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="card text-center feature-card"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <div
                                className="feature-icon-wrapper mx-auto mb-3"
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
};

export default About;
