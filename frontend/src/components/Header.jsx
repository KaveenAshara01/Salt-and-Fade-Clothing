import { Link } from 'react-router-dom';
import { ShoppingBag, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="header-glass">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'var(--header-height)' }}>
        <Link to="/">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-0.5px' }}>
            Salt & Fade
          </h1>
        </Link>
        <nav>
          <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <li>
              <Link to="/products" style={{ fontWeight: 600 }}>Shop</Link>
            </li>
            <li>
              <Link to="/cart" className="flex-center" style={{ gap: '0.5rem', fontWeight: 600 }}>
                <ShoppingBag size={20} />
                <span>Cart</span>
              </Link>
            </li>
            <li>
              <Link to="/login" className="flex-center" style={{ gap: '0.5rem', fontWeight: 600 }}>
                <User size={20} />
                <span>Login</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
