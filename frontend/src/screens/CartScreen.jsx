import { Link } from 'react-router-dom';

const CartScreen = () => {
  return (
    <div className="container" style={{ padding: '4rem 24px', minHeight: '60vh' }}>
      <h1 className="title-medium" style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
      <div style={{ padding: '2rem', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-lg)' }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>Your Cart feels a little empty.</p>
        <Link to="/" className="btn btn-primary" style={{ display: 'inline-block' }}>
          Back to Shop
        </Link>
      </div>
    </div>
  );
};

export default CartScreen;
