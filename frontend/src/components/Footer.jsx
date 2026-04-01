const Footer = () => {
  return (
    <footer style={{ marginTop: 'auto', padding: '4rem 0', backgroundColor: 'var(--color-text)', color: 'var(--color-white)', textAlign: 'center' }}>
      <div className="container">
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '1px' }}>
          Salt & Fade
        </h2>
        <p style={{ color: 'var(--color-border)', marginBottom: '2rem' }}>
          Chasing the Golden Era. Home of the best tees in Aotearoa & Sri Lanka.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>
          &copy; {new Date().getFullYear()} Salt & Fade. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
