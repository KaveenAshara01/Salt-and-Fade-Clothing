import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
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
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      try {
        setLoading(true);
        setMessage(null);
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };

        const { data } = await axios.post(
          '/api/users',
          { name, email, password },
          config
        );

        login(data);
        setLoading(false);
        navigate(redirect);
      } catch (error) {
        setLoading(false);
        setMessage(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        );
      }
    }
  };

  return (
    <div className="container" style={{ padding: '6rem 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px', backgroundColor: 'var(--color-bg)', padding: '3rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)' }}>
        <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Create Account</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Join the Salt & Fade community.</p>

        {message && <div style={{ color: 'var(--color-error)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>{message}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Full Name</label>
            <input 
              type="text" 
              id="name" 
              className="input-field" 
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Password</label>
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

          <div>
            <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="input-field" 
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '16px' }}>
            Register Now
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ fontWeight: 600, color: 'var(--color-text)', borderBottom: '1px solid var(--color-text)' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;
