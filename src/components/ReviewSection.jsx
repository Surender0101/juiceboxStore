import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import './ReviewSection.css';

const reviews = [
  {
    id: 1,
    name: 'Priya Sundaram',
    role: 'Yoga Instructor, Hosur',
    text: 'The Green Detox is my morning ritual. Fresh, clean taste and delivered before my class starts. Absolutely love JuiceBox!',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 2,
    name: 'Arjun Krishnan',
    role: 'Software Engineer',
    text: 'Custom juice builder is brilliant — I add ginger and protein to my orange base after gym. Best value at ₹99 starting price.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
  },
  {
    id: 3,
    name: 'Meera Reddy',
    role: 'Food Blogger',
    text: 'Tropical Sunrise tastes like vacation in a glass. The mango lassi fusion is authentic and not overly sweet. 10/10 recommend!',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
  },
];

const ReviewSection = () => (
  <section id="reviews" className="reviews section-padding">
    <div className="container">
      <div className="section-header text-center">
        <span className="section-subtitle">Testimonials</span>
        <h2 className="heading-secondary">Loved by Hosur</h2>
        <p>Real reviews from customers who make JuiceBox part of their daily routine.</p>
      </div>

      <div className="grid grid-cols-3 reviews-grid">
        {reviews.map((review, i) => (
          <motion.div
            key={review.id}
            className="card review-card"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <Quote size={28} className="quote-icon" color="var(--color-primary)" />
            <div className="d-flex align-center gap-1 mb-3">
              {[...Array(5)].map((_, index) => (
                <Star key={index} size={16} fill="#F4A261" color="#F4A261" />
              ))}
            </div>
            <p className="review-text text-muted mb-4">&ldquo;{review.text}&rdquo;</p>
            <div className="review-author d-flex align-center gap-3">
              <img src={review.image} alt={review.name} className="review-avatar" />
              <div>
                <h4>{review.name}</h4>
                <p className="text-muted">{review.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ReviewSection;
