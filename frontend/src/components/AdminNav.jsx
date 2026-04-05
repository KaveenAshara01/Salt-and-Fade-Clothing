import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="admin-nav-container">
      <Link 
        to="/admin/productlist" 
        className={`admin-nav-item ${pathname === '/admin/productlist' ? 'active' : ''}`}
      >
        Inventory
      </Link>
      <Link 
        to="/admin/collectionlist" 
        className={`admin-nav-item ${pathname === '/admin/collectionlist' ? 'active' : ''}`}
      >
        Collections
      </Link>
      <Link 
        to="/admin/orderlist" 
        className={`admin-nav-item ${pathname === '/admin/orderlist' ? 'active' : ''}`}
      >
        Orders
      </Link>
    </div>
  );
};

export default AdminNav;
