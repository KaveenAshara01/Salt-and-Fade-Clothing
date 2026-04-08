import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '5rem 0 3rem',
      backgroundColor: '#111',
      color: '#fff',
      borderTop: '1px solid #222'
    }}>
      <div className="container">

        {/* Desktop Footer (Restoring Original Layout) */}
        <div className="footer-grid hide-mobile">
          {/* Column 1: Brand */}
          <div className="footer-section footer-brand">
            <Link to="/">
              <img
                src="/images/logo-transparent.png"
                alt="Salt & Fade"
                style={{ height: '90px', width: 'auto', marginBottom: '1.5rem', filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p style={{ color: '#888', lineHeight: 1.8, fontSize: '0.9rem', maxWidth: '300px' }}>
              Chasing the Golden Era. Home of premium, independent surfwear crafted for the tropical heat.
            </p>
          </div>

          {/* Column 2: Shop */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px', color: '#555' }}>Shop</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('new-arrivals');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else window.location.href = '/#new-arrivals';
                  }}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'center', font: 'inherit' }}
                >
                  New Arrivals
                </button>
              </li>
              <li><Link to="/products" className="footer-link">All Products</Link></li>
              <li><Link to="/cart" className="footer-link">Cart</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px', color: '#555' }}>Company</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
              <li><Link to="/about" className="footer-link">Our Story</Link></li>
            </ul>
          </div>

          {/* Column 4: Social & Connect */}
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', letterSpacing: '1px', color: '#555' }}>Connect</h3>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link"><Instagram size={22} /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-link"><Facebook size={22} /></a>
              <a href="https://wa.me/94762707848" target="_blank" rel="noreferrer" className="footer-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
              <a href="mailto:hello@saltandfadeclothing.com" className="footer-link" style={{ fontSize: '0.85rem' }}>hello@saltandfadeclothing.com</a>
              <a href="tel:+94762707848" className="footer-link" style={{ fontSize: '0.85rem' }}>+94 76 270 7848</a>
            </div>
          </div>
        </div>

        {/* Mobile Footer (Keeping New Split Layout) */}
        <div className="mobile-only" style={{ flexDirection: 'column' }}>
          <div className="footer-section footer-brand" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <Link to="/">
              <img
                src="/images/logo-transparent.png"
                alt="Salt & Fade"
                style={{ height: '80px', width: 'auto', marginBottom: '1.5rem', filter: 'brightness(0) invert(1)' }}
              />
            </Link>
            <p style={{ color: '#888', lineHeight: 1.8, fontSize: '0.85rem', maxWidth: '280px', margin: '0 auto' }}>
              Home of premium, independent surfwear crafted for the tropical heat.
            </p>
          </div>

          <div className="footer-bottom-wrapper">
            <div className="footer-col-left">
              <div className="footer-section">
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.25rem', color: '#555' }}>Shop</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><Link to="/products" className="footer-link">All Products</Link></li>
                  <li><Link to="/cart" className="footer-link">Cart</Link></li>
                </ul>
              </div>
              <div className="footer-section">
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.25rem', color: '#555' }}>Company</h3>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><Link to="/about" className="footer-link">Our Story</Link></li>
                </ul>
              </div>
            </div>

            <div className="footer-col-right">
              <div className="footer-section">
                <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.25rem', color: '#555' }}>Connect</h3>
                <div className="footer-social-icons" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-link"><Instagram size={20} /></a>
                  <a href="https://wa.me/94762707848" target="_blank" rel="noreferrer" className="footer-link">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                  </a>
                </div>
                <div className="footer-contact-links" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <a href="mailto:hello@saltandfadeclothing.com" className="footer-link" style={{ fontSize: '0.8rem' }}>hello@saltandfadeclothing.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #222', paddingTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#555', letterSpacing: '1px' }}>
            &copy; {new Date().getFullYear()} SALT & FADE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
