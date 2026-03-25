import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Beaker } from 'lucide-react';
import './JuiceBuilder.css';

const baseFruits = [
    { id: 'b1', name: 'Orange Base', price: 4.00, color: '#FF9800' },
    { id: 'b2', name: 'Watermelon Base', price: 4.50, color: '#FF5252' },
    { id: 'b3', name: 'Green Base (Kale+Spinach)', price: 5.00, color: '#4CAF50' },
    { id: 'b4', name: 'Carrot Base', price: 4.00, color: '#FF5722' },
];

const boosters = [
    { id: 'a1', name: 'Chia Seeds', price: 0.50 },
    { id: 'a2', name: 'Ginger Shot', price: 1.00 },
    { id: 'a3', name: 'Whey Protein', price: 1.50 },
    { id: 'a4', name: 'Mint Leaves', price: 0.50 },
    { id: 'a5', name: 'Lemon Squeeze', price: 0.50 },
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
        setSelectedBoosters(prev =>
            prev.some(b => b.id === booster.id)
                ? prev.filter(b => b.id !== booster.id)
                : [...prev, booster]
        );
    };

    const handleAddToCart = () => {
        const customId = `custom-${Date.now()}`;
        const name = `Custom ${selectedBase.name}`;
        const boosterNames = selectedBoosters.map(b => b.name).join(', ');
        const desc = `${selectedBase.name}${boosterNames ? ' + ' + boosterNames : ''} (${sweetness} Sweetness)`;

        addToCart({
            id: customId,
            name,
            price: totalPrice,
            desc,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1615486171448-4cbabacdc4a6?auto=format&fit=crop&q=80&w=400'
        });

        // Reset
        setSelectedBase(baseFruits[0]);
        setSelectedBoosters([]);
        setSweetness('Regular');
    };

    return (
        <section className="juice-builder section-padding">
            <div className="container">
                <div className="grid grid-cols-2 align-center builder-grid">

                    <motion.div
                        className="builder-visual"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="builder-glass-container">
                            <div className="blender-base">
                                <Beaker size={200} strokeWidth={1} color="var(--color-text-muted)" />
                                <div
                                    className="juice-liquid"
                                    style={{
                                        backgroundColor: selectedBase.color,
                                        height: `${40 + (selectedBoosters.length * 10)}%`
                                    }}
                                ></div>
                                {selectedBoosters.length > 0 && (
                                    <div className="bubbles">
                                        <div className="bubble"></div>
                                        <div className="bubble"></div>
                                        <div className="bubble"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="text-center mt-3">
                            <h3 className="live-price">₹{totalPrice.toFixed(2)}</h3>
                            <p className="text-muted">Live Total</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="builder-controls card"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div className="d-flex align-center gap-2 mb-3">
                            <Settings className="text-primary" />
                            <h2 className="heading-secondary mb-0">Custom Juice Builder 🧃</h2>
                        </div>
                        <p className="text-muted mb-4">Craft your perfect blend by choosing your base, adding health boosters, and adjusting sweetness.</p>

                        <div className="builder-step mb-4">
                            <h4 className="mb-2">1. Choose Base Fruit</h4>
                            <div className="options-grid base-options">
                                {baseFruits.map(base => (
                                    <button
                                        key={base.id}
                                        className={`option-btn ${selectedBase.id === base.id ? 'active' : ''}`}
                                        onClick={() => setSelectedBase(base)}
                                    >
                                        <span>{base.name}</span>
                                        <span className="price-tag">+₹{base.price.toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="builder-step mb-4">
                            <h4 className="mb-2">2. Add Boosters</h4>
                            <div className="options-grid booster-options">
                                {boosters.map(booster => {
                                    const isActive = selectedBoosters.some(b => b.id === booster.id);
                                    return (
                                        <button
                                            key={booster.id}
                                            className={`option-btn ${isActive ? 'active' : ''}`}
                                            onClick={() => handleBoosterToggle(booster)}
                                        >
                                            <span>{booster.name}</span>
                                            <span className="price-tag">+₹{booster.price.toFixed(2)}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="builder-step mb-4">
                            <h4 className="mb-2">3. Sweetness Level</h4>
                            <div className="sweetness-options d-flex gap-2">
                                {sweetnessLevels.map(lvl => (
                                    <button
                                        key={lvl}
                                        className={`filter-btn flex-1 ${sweetness === lvl ? 'active' : ''}`}
                                        onClick={() => setSweetness(lvl)}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="btn btn-primary w-100 justify-content-center mt-2 p-3" onClick={handleAddToCart}>
                            <Plus size={20} /> Add Custom Mix to Cart
                        </button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default JuiceBuilder;
