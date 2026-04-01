import { Link } from 'react-router-dom';

const LoginScreen = () => {
  return (
    <div className="container" style={{ padding: '6rem 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '400px', backgroundColor: 'var(--color-bg)', padding: '3rem', borderRadius: 'var(--radius-lg)' }}>
        <h1 className="title-medium" style={{ textAlign: 'center', marginBottom: '2rem' }}>Sign In</h1>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email Address</label>
            <input 
              type="email" 
              id="email" 
              className="input-field" 
              placeholder="Enter email"
            />
          </div>
          
          <div>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              id="password" 
              className="input-field" 
              placeholder="Enter password"
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Sign In
          </button>
        </form>
        
        <p style={{ marginTop: '2rem', textAlign: 'center' }}>
          New customer?{' '}
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-accent)' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;
