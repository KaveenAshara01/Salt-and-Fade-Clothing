import { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User as UserIcon, Loader } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const LoginModal = ({ isOpen, onClose, onSuccess }) => {
  const { login } = useUser();
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);

    if (activeTab === 'register' && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const endpoint = activeTab === 'login' ? '/api/users/login' : '/api/users';
      const payload = activeTab === 'login' ? { email, password } : { name, email, password };

      const { data } = await axios.post(endpoint, payload, config);
      
      login(data);
      onSuccess(data);
      onClose();
    } catch (err) {
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose}></div>
      
      <div className="animate-fade-in" style={{ 
        width: '100%', 
        maxWidth: '400px', 
        backgroundColor: 'var(--color-white)', 
        borderRadius: 'var(--radius-lg)', 
        position: 'relative', 
        padding: '2.5rem',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--color-text-light)', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
           <h2 className="title-medium" style={{ marginBottom: '0.5rem' }}>{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
           <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
             {activeTab === 'login' ? 'Login to sync your cart and orders' : 'Join Salt & Fade for a better experience'}
           </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', backgroundColor: '#f5f5f5', borderRadius: 'var(--radius-sm)', padding: '4px', marginBottom: '2rem' }}>
          <button 
            onClick={() => setActiveTab('login')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: 'none', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: activeTab === 'login' ? 'white' : 'transparent',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'login' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Login
          </button>
          <button 
            onClick={() => setActiveTab('register')}
            style={{ 
              flex: 1, 
              padding: '10px', 
              border: 'none', 
              borderRadius: 'var(--radius-sm)', 
              backgroundColor: activeTab === 'register' ? 'white' : 'transparent',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'register' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fff5f5', color: 'var(--color-error)', padding: '0.75rem', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '1.5rem', border: '1px solid #ffebeb' }}>
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {activeTab === 'register' && (
            <div style={{ position: 'relative' }}>
              <UserIcon size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="input-field" 
                style={{ paddingLeft: '40px' }} 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          
          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field" 
              style={{ paddingLeft: '40px' }} 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field" 
              style={{ paddingLeft: '40px' }} 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {activeTab === 'register' && (
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)' }} />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                className="input-field" 
                style={{ paddingLeft: '40px' }} 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem', padding: '14px', gap: '0.5rem' }}
          >
            {loading ? <Loader size={18} className="spin" /> : (activeTab === 'login' ? <LogIn size={18} /> : <UserPlus size={18} />)}
            {activeTab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
