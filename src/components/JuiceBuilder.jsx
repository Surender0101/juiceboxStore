import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus, Beaker } from 'lucide-react';
import { formatINR } from '../utils/formatPrice';
import './JuiceBuilder.css';

const baseFruits = [
  { id: 'b1', name: 'Orange Base', price: 99, color: '#FF9800' },
  { id: 'b2', name: 'Watermelon Base', price: 109, color: '#FF5252' },
  { id: 'b3', name: 'Green Base', price: 129, color: '#2D6A4F' },
  { id: 'b4', name: 'Carrot Base', price: 99, color: '#FF5722' },
];

const boosters = [
  { id: 'a1', name: 'Chia Seeds', price: 25 },
  { id: 'a2', name: 'Ginger Shot', price: 35 },
  { id: 'a3', name: 'Whey Protein', price: 55 },
  { id: 'a4', name: 'Mint Leaves', price: 20 },
  { id: 'a5', name: 'Lemon Squeeze', price: 20 },
];

const sweetnessLevels = ['None', 'Light', 'Regular', 'Extra'];

const JuiceBuilder = ({ addToCart }) => {
  const [selectedBase, setSelectedBase] = useState(baseFruits[0]);
  const [selectedBoosters, setSelectedBoosters] = useState([]);
  const [sweetness, setSweetness] = useState('Regular');
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const boostTotal = selectedBoosters.reduce((acc, curr) => acc + curr.price, 0);
    setTotalPrice(selectedBase.price + boostTotal);
  }, [selectedBase, selectedBoosters]);

  const handleBoosterToggle = (booster) => {
    setSelectedBoosters((prev) =>
      prev.some((b) => b.id === booster.id)
        ? prev.filter((b) => b.id !== booster.id)
        : [...prev, booster]
    );
  };

  const handleAddToCart = () => {
    const customId = `custom-${Date.now()}`;
    const name = `Custom ${selectedBase.name}`;
    const boosterNames = selectedBoosters.map((b) => b.name).join(', ');
    const desc = `${selectedBase.name}${boosterNames ? ' + ' + boosterNames : ''} (${sweetness} sweetness)`;

    addToCart({
      id: customId,
      name,
      price: totalPrice,
      desc,
      quantity: 1,
      image: '/products/fallback-juice.svg',
    });

    setSelectedBase(baseFruits[0]);
    setSelectedBoosters([]);
    setSweetness('Regular');
  };

  return (
    <section id="builder" className="juice-builder section-padding">
      <div className="container">
        <div className="section-header text-center mb-4">
          <span className="section-subtitle">Build Your Own</span>
          <h2 className="heading-secondary">Custom Juice Builder</h2>
          <p>Mix your favourite base, add health boosters, and set your sweetness level.</p>
        </div>

        <div className="grid grid-cols-2 align-center builder-grid">
          <motion.div
            className="builder-visual"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="builder-glass-container">
              <div className="blender-base">
                <Beaker size={180} strokeWidth={1} color="var(--color-text-muted)" />
                <div
                  className="juice-liquid"
                  style={{
                    backgroundColor: selectedBase.color,
                    height: `${40 + selectedBoosters.length * 10}%`,
                  }}
                />
                {selectedBoosters.length > 0 && (
                  <div className="bubbles">
                    <div className="bubble" />
                    <div className="bubble" />
                    <div className="bubble" />
                  </div>
                )}
              </div>
            </div>
            <div className="builder-price-display text-center mt-3">
              <h3 className="live-price">{formatINR(totalPrice)}</h3>
              <p className="text-muted">Your custom blend total</p>
            </div>
          </motion.div>

          <motion.div
            className="builder-controls card"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="d-flex align-center gap-2 mb-3">
              <Sparkles className="text-primary" color="var(--color-primary)" />
              <h3 className="builder-title">Craft Your Blend</h3>
            </div>

            <div className="builder-step mb-4">
              <h4 className="step-label">1. Choose Base</h4>
              <div className="options-grid base-options">
                {baseFruits.map((base) => (
                  <button
                    key={base.id}
                    type="button"
                    className={`option-btn ${selectedBase.id === base.id ? 'active' : ''}`}
                    onClick={() => setSelectedBase(base)}
                  >
                    <span>{base.name}</span>
                    <span className="price-tag">{formatINR(base.price)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="builder-step mb-4">
              <h4 className="step-label">2. Add Boosters</h4>
              <div className="options-grid booster-options">
                {boosters.map((booster) => {
                  const isActive = selectedBoosters.some((b) => b.id === booster.id);
                  return (
                    <button
                      key={booster.id}
                      type="button"
                      className={`option-btn ${isActive ? 'active' : ''}`}
                      onClick={() => handleBoosterToggle(booster)}
                    >
                      <span>{booster.name}</span>
                      <span className="price-tag">+{formatINR(booster.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="builder-step mb-4">
              <h4 className="step-label">3. Sweetness</h4>
              <div className="sweetness-options d-flex gap-2">
                {sweetnessLevels.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    className={`filter-btn flex-1 ${sweetness === lvl ? 'active' : ''}`}
                    onClick={() => setSweetness(lvl)}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <button type="button" className="btn btn-primary w-100 justify-content-center p-3" onClick={handleAddToCart}>
              <Plus size={20} /> Add to Cart — {formatINR(totalPrice)}
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default JuiceBuilder;
