import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, userInfo } = useUser();
  const { search } = useLocation();
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  // Check if user is already logged in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/login',
        { email, password },
        config
      );

      login(data);
      setLoading(false);
      navigate(redirect);
    } catch (err) {
      setLoading(false);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-bg)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Login</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Welcome back to Salt & Fade.</p>
        
        {error && <div style={{ color: 'var(--color-error)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label htmlFor="password" style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: 0 }}>Password</label>
              <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--color-text-light)', fontWeight: 500 }}>Forgot Password?</Link>
            </div>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '16px' }}>
            Login Now
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-text)', borderBottom: '1px solid var(--color-text)' }}>
            Join us
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
