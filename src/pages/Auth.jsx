import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser } from '../services/db';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // If redirected from checkout, go back to checkout, else go to home
    const returnUrl = location.state?.returnUrl || '/';

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        try {
            if (isLogin) {
                // Admin Login Override
                if (formData.email === 'surender' && formData.password === '112004') {
                    const adminUser = { id: 0, name: 'Admin Surender', email: 'surender', role: 'admin' };
                    localStorage.setItem('juicebox_current_user', JSON.stringify(adminUser));
                    window.dispatchEvent(new Event('authChange'));
                    navigate('/admin');
                    return;
                }
                
                loginUser(formData.email, formData.password);
                window.dispatchEvent(new Event('authChange'));
                navigate(returnUrl);
            } else {
                registerUser(formData.name, formData.email, formData.password);
                window.dispatchEvent(new Event('authChange'));
                navigate(returnUrl);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="section-padding d-flex align-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '100px' }}>
            <div className="card p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="mb-4 text-center">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
                
                <div className="d-flex mb-4" style={{ borderBottom: '2px solid var(--color-border)' }}>
                    <button 
                        className={`flex-1 p-2 ${isLogin ? 'active' : ''}`} 
                        onClick={() => { setIsLogin(true); setError(''); }}
                        style={{ borderBottom: isLogin ? '2px solid var(--color-primary)' : 'none', fontWeight: isLogin ? 'bold' : 'normal', background: 'transparent', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
                    >
                        Login
                    </button>
                    <button 
                        className={`flex-1 p-2 ${!isLogin ? 'active' : ''}`} 
                        onClick={() => { setIsLogin(false); setError(''); }}
                        style={{ borderBottom: !isLogin ? '2px solid var(--color-primary)' : 'none', fontWeight: !isLogin ? 'bold' : 'normal', background: 'transparent', borderTop: 'none', borderLeft: 'none', borderRight: 'none', cursor: 'pointer', color: 'var(--color-text)' }}
                    >
                        Register
                    </button>
                </div>

                {error && <div className="p-2 mb-3 rounded text-center" style={{ backgroundColor: '#ffebee', color: '#c62828', fontSize: '0.9rem' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <input type="text" placeholder="Full Name" required className="form-input mb-3 w-100" 
                               value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    )}
                    <input type={isLogin ? "text" : "email"} placeholder={isLogin ? "Email or Admin Username" : "Email Address"} required className="form-input mb-3 w-100" 
                           value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="password" placeholder="Password" required className="form-input mb-4 w-100" 
                           value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    
                    <button type="submit" className="btn btn-primary w-100 justify-content-center">
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;
