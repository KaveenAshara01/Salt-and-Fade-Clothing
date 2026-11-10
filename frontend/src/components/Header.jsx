import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, ArrowUpRight, ChevronDown, Info } from 'lucide-react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import './header.css';

export const Brand = () => <img className="original-brand" src="/images/salt-fade-bright.svg" alt="Salt & Fade" />;
const Header = () => {
  const { userInfo, logout } = useUser();
  const { clearCart, cartItems } = useCart();
  const [open, setOpen] = useState(false);
  const [collections, setCollections] = useState([]);
  const header = useRef(null);
  const menuToggle = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => { axios.get('/api/collections').then(({ data }) => setCollections(data)).catch(() => {}); }, []);
  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') { setOpen(false); menuToggle.current?.focus(); } };
    const onOutsideClick = e => { if (!header.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutsideClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutsideClick); };
  }, [open]);
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1025px)');
    const closeOnDesktop = e => { if (e.matches) setOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  const signOut = () => { setOpen(false); clearCart(); logout(); navigate('/'); };
  return <header ref={header} id="storefront-header" className="sun-header">
    <div className="sun-announcement"><span>COMPLIMENTARY DELIVERY ON ORDERS OF RS. 9,000 AND ABOVE</span></div>
      <div className="sun-nav container">
        <div className="sun-nav-actions sun-nav-utilities">
          <button ref={menuToggle} type="button" className="sun-menu-toggle" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="sun-mobile-menu" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
          {userInfo ? <details className="sun-account sun-desktop-account" key={location.pathname + location.search}><summary aria-label="Account menu"><User size={24} /></summary><div className="sun-account-menu"><Link to="/profile">My account & orders</Link>{userInfo.isAdmin && <><Link to="/admin/productlist">Inventory</Link><Link to="/admin/collectionlist">Collections</Link><Link to="/admin/orderlist">Orders</Link><Link to="/admin/settings">Settings</Link></>}<button onClick={signOut}>Sign out</button></div></details> : <Link className="sun-desktop-account" to="/login" aria-label="Sign in"><User size={24} /></Link>}
          <Link className="sun-info-link" to="/about" aria-label="About Salt & Fade"><Info size={24} /></Link>
        </div>
        <nav className="sun-desktop-nav sun-nav-left" aria-label="Shop navigation">
          <Link to="/products?sort=latest">New arrivals</Link>
          <details className="collection-menu" key={location.pathname + location.search}><summary>Collections <ChevronDown size={13} /></summary><div className="collection-menu-panel"><Link to="/products">All T-shirts <ArrowUpRight size={15} /></Link>{collections.map(collection => <Link key={collection._id} to={`/products?collection=${collection._id}&sort=latest`}>{collection.name}<ArrowUpRight size={15} /></Link>)}</div></details>
        </nav>
        <Link className="sun-brand-link" to="/" aria-label="Salt & Fade home"><Brand /></Link>
        <nav className="sun-desktop-nav sun-nav-right" aria-label="About and contact">
          <Link to="/about">About</Link>
          <a href="https://wa.me/94771070544" target="_blank" rel="noreferrer">Contact</a>
        </nav>
        <div className="sun-nav-actions">
          <Link className="sun-cart" to="/cart" aria-label={`Shopping bag, ${cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0)} items`}><ShoppingBag size={28} /><span>{cartItems.reduce((sum, item) => sum + Number(item.qty || 0), 0)}</span></Link>
        </div>
      </div>
      {open && <nav id="sun-mobile-menu" className="sun-mobile-nav" aria-label="Mobile navigation" onClick={event => { if (event.target.closest('a')) setOpen(false); }}>
        <Link to="/products?sort=latest">New arrivals <ArrowUpRight size={18} /></Link>
        <Link to="/products">All T-shirts <ArrowUpRight size={18} /></Link>
        <details className="sun-mobile-group"><summary>Collections <ChevronDown size={18} /></summary><div>{collections.map(c => <Link to={`/products?collection=${c._id}&sort=latest`} key={c._id}>{c.name}<ArrowUpRight size={15} /></Link>)}{!collections.length && <Link to="/products">Browse all tees</Link>}</div></details>
        <Link to="/about">Our story <ArrowUpRight size={18} /></Link>
        <a href="https://wa.me/94771070544" target="_blank" rel="noreferrer">Contact <ArrowUpRight size={18} /></a>
        {userInfo ? <details className="sun-mobile-group"><summary>Your account <ChevronDown size={18} /></summary><div><Link to="/profile">My account & orders</Link>{userInfo.isAdmin && <><Link to="/admin/productlist">Inventory</Link><Link to="/admin/collectionlist">Manage collections</Link><Link to="/admin/orderlist">Orders</Link><Link to="/admin/settings">Settings</Link></>}<button type="button" onClick={signOut}>Sign out</button></div></details> : <Link to="/login">Sign in <User size={18} /></Link>}
      </nav>}
    </header>;
};
export default Header;
