import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { token } = useParams();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.put(
        `/api/users/resetpassword/${token}`,
        { password },
        config
      );

      setMessage(data.message);
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);

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
        <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '1.5rem', textTransform: 'uppercase' }}>Reset Password</h1>
        <p className="subtitle" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>Enter your new password below.</p>
        
        {message && <div style={{ color: 'var(--color-primary)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>{message}. Redirecting...</div>}
        {error && <div style={{ color: 'var(--color-error)', textAlign: 'center', marginBottom: '1.5rem', fontWeight: 600 }}>{error}</div>}
        
        <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>New Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="Enter new password"
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
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', padding: '16px' }} disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
