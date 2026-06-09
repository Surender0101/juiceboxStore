import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, registerUser, loginAdmin } from '../services/db';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const returnUrl = location.state?.returnUrl || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const emailInput = formData.email.trim();
      const passwordInput = formData.password.trim();

      if (isLogin) {
        if (emailInput.toLowerCase() === 'surender') {
          loginAdmin(emailInput, passwordInput);
          window.dispatchEvent(new Event('authChange'));
          navigate('/admin', { replace: true });
          return;
        }

        loginUser(emailInput, passwordInput);
        window.dispatchEvent(new Event('authChange'));
        navigate(returnUrl, { replace: true });
      } else {
        registerUser(formData.name, emailInput, passwordInput);
        window.dispatchEvent(new Event('authChange'));
        navigate(returnUrl, { replace: true });
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (loginMode) => {
    setIsLogin(loginMode);
    setError('');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <div className="section-padding d-flex align-center justify-content-center" style={{ minHeight: '80vh', paddingTop: '100px' }}>
      <div className="card p-4" style={{ maxWidth: '420px', width: '100%' }}>
        <h2 className="mb-2 text-center">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        <p className="text-muted text-center mb-4" style={{ fontSize: '0.9rem' }}>
          {isLogin ? 'Sign in to order fresh juices from JuiceBox Hosur' : 'Join JuiceBox for faster checkout & order tracking'}
        </p>

        <div className="d-flex mb-4" style={{ borderBottom: '2px solid var(--color-border)' }}>
          <button
            type="button"
            className="flex-1 p-2"
            onClick={() => switchMode(true)}
            style={{
              borderBottom: isLogin ? '2px solid var(--color-primary)' : 'none',
              fontWeight: isLogin ? 'bold' : 'normal',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            Login
          </button>
          <button
            type="button"
            className="flex-1 p-2"
            onClick={() => switchMode(false)}
            style={{
              borderBottom: !isLogin ? '2px solid var(--color-primary)' : 'none',
              fontWeight: !isLogin ? 'bold' : 'normal',
              background: 'transparent',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 mb-3 rounded text-center" style={{ backgroundColor: '#ffebee', color: '#c62828', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="form-input mb-3 w-100"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              autoComplete="name"
            />
          )}
          <input
            type={isLogin ? 'text' : 'email'}
            placeholder={isLogin ? 'Email or admin username' : 'Email Address'}
            required
            className="form-input mb-3 w-100"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            autoComplete={isLogin ? 'username' : 'email'}
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="form-input mb-4 w-100"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />

          <button type="submit" className="btn btn-primary w-100 justify-content-center" disabled={isSubmitting}>
            {isSubmitting ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {isLogin && (
          <p className="text-muted text-center mt-3" style={{ fontSize: '0.8rem' }}>
            Admin? Use username <strong>surender</strong>
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
