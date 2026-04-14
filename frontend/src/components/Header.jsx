import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, ChevronDown, Menu, X, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';

// Custom SVG components for Brand Icons
const InstagramIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const Header = () => {
  const { userInfo, logout } = useUser();
  const { clearCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [collections, setCollections] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopExpanded, setIsShopExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // ... collections fetch ...
    const fetchCollections = async () => {
      try {
        const { data } = await axios.get('/api/collections');
        setCollections(data);
      } catch (error) {
        console.error('Error fetching collections:', error);
      }
    };
    fetchCollections();

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    clearCart();
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <div className="marquee-container" id="top-bar">
        <div className="marquee-content">
          <span style={{ paddingRight: '120px' }}>★ FREE DELIVERY FOR ORDERS OVER RS. 6,000</span>
          <span style={{ paddingRight: '120px' }}>★ CREATE AN ACCOUNT AND UNLOCK LOYALTY BENEFITS</span>
          <span style={{ paddingRight: '120px' }}>★ FREE DELIVERY FOR ORDERS OVER RS. 6,000</span>
          <span style={{ paddingRight: '120px' }}>★ CREATE AN ACCOUNT AND UNLOCK LOYALTY BENEFITS</span>
          <span style={{ paddingRight: '120px' }}>★ FREE DELIVERY FOR ORDERS OVER RS. 6,000</span>
          <span style={{ paddingRight: '120px' }}>★ CREATE AN ACCOUNT AND UNLOCK LOYALTY BENEFITS</span>
        </div>
      </div>

      <header 
        className={isScrolled ? 'header-solid' : 'header-transparent'}
        style={!isScrolled ? { top: '36px' } : { top: '0' }}
      >
        <div className="container" style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 'var(--header-height)' }}>
          
          {/* Mobile Hamburger / Desktop Socials */}
          <div style={{ flex: 1, display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <button className="mobile-only" onClick={() => setIsMenuOpen(true)} style={{ color: 'inherit' }}>
              <Menu size={24} />
            </button>
            <div className="hide-mobile" style={{ gap: '1.5rem' }}>
              <a href="https://www.instagram.com/salt_and_fade?igsh=MWZueDJ0ZDJ2cjUyZA==" target="_blank" rel="noreferrer" className="flex-center">
                <InstagramIcon size={20} />
              </a>
              <a href="https://www.facebook.com/share/1GSfTBfHgc/" target="_blank" rel="noreferrer" className="flex-center">
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>

          {/* Logo - Centered */}
          <Link to="/" style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
            <img 
              src="/images/Salt & Fade.svg" 
              alt="Salt & Fade Logo" 
              style={{ 
                height: isScrolled ? '25px' : '50px', 
                transition: 'all 0.4s ease',
                objectFit: 'contain'
              }} 
            />
          </Link>

          {/* Desktop Nav / Mobile Cart Only */}
          <nav style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <ul style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <li className="nav-item hide-mobile">
                <Link to="/products" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Shop <ChevronDown size={14} />
                </Link>
                <div className="dropdown-menu">
                  <Link to="/products?sort=latest" className="dropdown-item">All Products</Link>
                  {collections.map(collection => (
                    <Link key={collection._id} to={`/products?collection=${collection._id}&sort=latest`} className="dropdown-item">
                      {collection.name}
                    </Link>
                  ))}
                </div>
              </li>
              <li>
                <Link to="/cart" className="flex-center" style={{ gap: '0.5rem', fontWeight: 600 }}>
                  <ShoppingBag size={20} />
                  <span className="hide-mobile">Cart</span>
                </Link>
              </li>
              <li className="hide-mobile">
                {userInfo ? (
                  <div className="nav-item">
                    <button className="flex-center" style={{ gap: '0.5rem', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.9rem' }}>
                      <User size={20} />
                      <span>{userInfo.name.split(' ')[0]}</span>
                      {userInfo.isAdmin && <span className="admin-badge">Admin</span>}
                      <ChevronDown size={14} />
                    </button>
                    <div className="dropdown-menu">
                      <Link to="/profile" className="dropdown-item">My Orders</Link>
                      {userInfo.isAdmin && (
                        <>
                          <div style={{ padding: '0.5rem 1.5rem', borderTop: '1px solid var(--color-border)', marginTop: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-light)' }}>ADMIN CP</div>
                          <Link to="/admin/productlist" className="dropdown-item">Inventory</Link>
                          <Link to="/admin/collectionlist" className="dropdown-item">Collections</Link>
                          <Link to="/admin/orderlist" className="dropdown-item">Full Order List</Link>
                        </>
                      )}
                      <button onClick={logoutHandler} className="dropdown-item" style={{ color: 'var(--color-error)', borderTop: '1px solid var(--color-border)', width: '100%', textAlign: 'left', marginTop: '0.5rem' }}>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="flex-center" style={{ gap: '0.5rem', fontWeight: 600 }}>
                    <User size={20} />
                    <span>Login</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-drawer-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Mobile Drawer Content */}
      <div className={`mobile-drawer ${isMenuOpen ? 'active' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <img src="/images/logo-transparent.png" alt="Logo" style={{ height: '50px' }} />
          <button onClick={closeMenu} style={{ color: 'var(--color-primary)' }}><X size={24} /></button>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          
          {/* Expandable Shop Menu */}
          <div 
            className="mobile-nav-link" 
            onClick={() => setIsShopExpanded(!isShopExpanded)}
            style={{ cursor: 'pointer' }}
          >
            Shop <ChevronDown size={18} style={{ transform: isShopExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
          </div>

          {isShopExpanded && (
            <div style={{ paddingLeft: '1rem', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
              <Link to="/products?sort=latest" className="mobile-nav-link" onClick={closeMenu} style={{ fontSize: '0.95rem', fontWeight: 600, borderBottom: '1px solid var(--color-border)' }}>
                All Products <ChevronRight size={16} />
              </Link>
              {collections.map(c => (
                <Link key={c._id} to={`/products?collection=${c._id}&sort=latest`} className="mobile-nav-link" onClick={closeMenu} style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  {c.name} <ChevronRight size={16} />
                </Link>
              ))}
            </div>
          )}

          <Link to="/cart" className="mobile-nav-link" onClick={closeMenu} style={{ marginTop: '0.5rem' }}>
            My Cart <ShoppingBag size={18} />
          </Link>

          {userInfo ? (
            <>
              <Link to="/profile" className="mobile-nav-link" onClick={closeMenu}>
                My Account ({userInfo.name.split(' ')[0]}) <User size={18} />
              </Link>
              {userInfo.isAdmin && (
                <Link to="/admin/productlist" className="mobile-nav-link" onClick={closeMenu} style={{ color: 'var(--color-accent)' }}>
                  Admin Dashboard <ChevronRight size={16} />
                </Link>
              )}
              <button 
                onClick={logoutHandler} 
                className="mobile-nav-link" 
                style={{ color: 'var(--color-error)', border: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>
              Login / Register <User size={18} />
            </Link>
          )}
        </div>

        <div style={{ display: 'flex', gap: '2rem', marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
          <a href="https://www.instagram.com/salt_and_fade?igsh=MWZueDJ0ZDJ2cjUyZA==" target="_blank" rel="noreferrer"><InstagramIcon size={24} /></a>
          <a href="https://www.facebook.com/share/1GSfTBfHgc/" target="_blank" rel="noreferrer"><FacebookIcon size={24} /></a>
        </div>
      </div>
    </>
  );
};

export default Header;
