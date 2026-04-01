import { Link, useParams, useNavigate } from 'react-router-dom';

const ProductScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy products array matching HomeScreen
  const products = [
    {
      _id: '1',
      name: 'Oversized Sand Tee',
      price: 3500,
      image: '/images/mockup_tee_beige.png',
      category: 'T-Shirts',
      description: 'A stylish, modern minimalist oversized t-shirt in sand beige. Crafted with premium heavy-weight cotton perfect for catching the tropical breeze.',
      countInStock: 10,
    },
    {
      _id: '2',
      name: 'Washed Charcoal Oversized',
      price: 4200,
      image: '/images/mockup_tee_charcoal.png',
      category: 'T-Shirts',
      description: 'Vintage washed charcoal black tee. Flat lay texture with a clean streetwear aesthetic. High definition printing.',
      countInStock: 5,
    },
    {
      _id: '3',
      name: 'Surf Green Boxy Fit',
      price: 3800,
      image: '/images/mockup_tee_surf_green.png',
      category: 'T-Shirts',
      description: 'Muted surf green boxy fit. Perfect for the casual beach streetwear vibe. Stand out from the crowd.',
      countInStock: 0,
    },
  ];

  const product = products.find((p) => p._id === id);

  if (!product) {
    return <div className="container" style={{ paddingTop: '100px' }}><h2>Product not found</h2></div>;
  }

  const addToCartHandler = () => {
    navigate('/cart');
  };

  return (
    <div className="container" style={{ padding: '4rem 24px' }}>
      <Link to="/" className="btn btn-outline" style={{ marginBottom: '2rem' }}>
        &larr; Go Back
      </Link>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
        <div style={{ backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <img src={product.image} alt={product.name} style={{ width: '100%', display: 'block' }} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--color-text-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>{product.category}</p>
            <h1 className="title-medium" style={{ margin: '0.5rem 0' }}>{product.name}</h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 600 }}>Rs. {product.price}</p>
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{product.description}</p>
          
          <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
              <span>Status:</span>
              <span style={{ fontWeight: 600 }}>{product.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}</span>
            </div>
            
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '16px' }}
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
