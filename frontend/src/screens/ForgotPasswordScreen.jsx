import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        '/api/users/forgotpassword',
        { email },
        config
      );

      setMessage(data.message);
      setLoading(false);
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
        <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Forgot Password</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Enter your email address to receive a password reset link.</p>
        
        {message && <div style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>{message}</div>}
        {error && <div style={{ color: 'var(--color-error)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '16px' }} disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-text)', borderBottom: '1px solid var(--color-text)' }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
