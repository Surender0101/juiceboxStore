import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, Sun, Moon, Droplet, User as UserIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { getCurrentUser, logoutUser } from '../services/db';
import './Navbar.css';

const Navbar = ({ toggleCart, cartCount }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(getCurrentUser());
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        const handleAuthChange = () => {
            setUser(getCurrentUser());
        };
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('authChange', handleAuthChange);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        logoutUser();
        window.dispatchEvent(new Event('authChange'));
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
            <div className="container navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <Droplet className="logo-icon" fill="var(--color-primary)" color="var(--color-primary)" size={28} />
                    <span>JuiceBox</span>
                </Link>

                {/* Desktop Nav */}
                <div className="navbar-links desktop-only">
                    <a href="#home">Home</a>
                    <a href="#about">About</a>
                    <a href="#menu">Menu</a>
                    <a href="#locations">Locations</a>
                </div>

                {/* Actions */}
                <div className="navbar-actions">
                    <button className="icon-btn theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    <button className="icon-btn cart-toggle" onClick={toggleCart} aria-label="Open cart">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    <div className="desktop-only d-flex align-center" style={{ marginLeft: '10px', gap: '8px' }}>
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link to="/admin" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', backgroundColor: '#8b5cf6' }}>
                                        Admin Dashboard
                                    </Link>
                                ) : (
                                    <Link to="/my-orders" className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                        My Orders
                                    </Link>
                                )}
                                <button className="btn btn-outline d-flex align-center gap-2" onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                    <UserIcon size={16} /> Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/auth" className="btn btn-primary d-flex align-center gap-2" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                                <UserIcon size={16} /> Login
                            </Link>
                        )}
                    </div>

                    <button
                        className="icon-btn mobile-menu-toggle mobile-only"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <div className="mobile-menu glass">
                    <a href="#home" onClick={() => setIsMobileMenuOpen(false)}>Home</a>
                    <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
                    <a href="#menu" onClick={() => setIsMobileMenuOpen(false)}>Menu</a>
                    <a href="#locations" onClick={() => setIsMobileMenuOpen(false)}>Locations</a>
                    {user ? (
                        <>
                            {user.role === 'admin' ? (
                                <Link to="/admin" className="btn btn-primary w-100 justify-content-center mt-2" onClick={() => setIsMobileMenuOpen(false)} style={{backgroundColor: '#8b5cf6'}}>
                                    Admin Dashboard
                                </Link>
                            ) : (
                                <Link to="/my-orders" className="btn btn-primary w-100 justify-content-center mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    My Orders
                                </Link>
                            )}
                            <button className="btn btn-outline mt-2 w-100 justify-content-center" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/auth" className="btn btn-primary w-100 justify-content-center mt-2" onClick={() => setIsMobileMenuOpen(false)}>
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
