import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const reviews = [
    { id: 1, name: 'Sarah Jenkins', role: 'Fitness Trainer', text: 'Best fresh juice in town! Super refreshing and healthy. The Mango Blast is my daily go-to after workouts.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
    { id: 2, name: 'David Chen', role: 'Local Guide', text: 'Love the custom juice builder. I can mix and match my favorite fruits. Always fresh and the delivery is super fast.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
    { id: 3, name: 'Emily Rosa', role: 'Food Blogger', text: 'The Green Detox actually tastes amazing compared to other places. 10/10 would recommend to anyone looking for a health boost.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
];

const ReviewSection = () => {
    return (
        <section id="reviews" className="section-padding mb-4">
            <div className="container">
                <div className="text-center mb-4 pb-2">
                    <span className="section-subtitle">Testimonials</span>
                    <h2 className="heading-secondary">What Our Customers Say</h2>
                </div>

                <div className="grid grid-cols-3">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            className="card review-card text-center"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                        >
                            <div className="d-flex justify-content-center mb-3">
                                {[...Array(5)].map((_, index) => (
                                    <Star key={index} fill="var(--color-accent-mango)" color="var(--color-accent-mango)" size={18} />
                                ))}
                            </div>
                            <p className="text-muted mb-4" style={{ fontStyle: 'italic' }}>"{review.text}"</p>
                            <img
                                src={review.image}
                                alt={review.name}
                                style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px auto' }}
                            />
                            <h4 style={{ marginBottom: '2px' }}>{review.name}</h4>
                            <p className="text-muted" style={{ fontSize: '0.85rem' }}>{review.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewSection;
