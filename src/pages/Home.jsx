import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import MenuSection from '../components/MenuSection';
import JuiceBuilder from '../components/JuiceBuilder';
import StoreLocator from '../components/StoreLocator';
import ReviewSection from '../components/ReviewSection';
import BlogSection from '../components/BlogSection';
import ContactSection from '../components/ContactSection';

const Home = ({ addToCart }) => {
    return (
        <div className="home-page" style={{ paddingTop: '80px' }}>
            <Hero />
            <About />
            <MenuSection addToCart={addToCart} />
            <JuiceBuilder addToCart={addToCart} />
            <ReviewSection />
            <StoreLocator />
            <BlogSection />
            <ContactSection />
        </div>
    );
};

export default Home;
