import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, ShoppingBag, Ruler, Plus, Minus, X, Expand, Truck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { PRODUCT_SIZES, canAddSelection, sizeStock, totalStock } from '../utils/productSelection';
import ReactPixel from 'react-facebook-pixel';
import './product-page.css';

const money = amount => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(amount);

const ProductScreen = () => {
  const { id: productId } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [modal, setModal] = useState(null);
  const dialog = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');
    setProduct(null);
    setRelated([]);
    setSelectedSize('');
    setQuantity(1);
    setImageIndex(0);
    setModal(null);
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${productId}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setProduct(data);
        setLoading(false);
        try {
          ReactPixel.track('ViewContent', { content_ids: [data._id], content_name: data.name, content_type: 'product', currency: 'LKR', value: data.price });
        } catch { /* Analytics must not interrupt shopping. */ }
        const collection = data.collectionRef?._id || (typeof data.collectionRef === 'string' ? data.collectionRef : '');
        try {
          const response = await axios.get(`/api/products${collection ? `?collection=${encodeURIComponent(collection)}` : ''}`, { signal: controller.signal });
          if (!controller.signal.aborted) {
            setRelated(response.data.filter(item => item._id !== data._id).slice(0, 4));
            const collectionDetails = response.data.find(item => item.collectionRef?._id === collection)?.collectionRef;
            if (collectionDetails) setProduct({ ...data, collectionRef: collectionDetails });
          }
        } catch { /* Recommendations are optional; the product remains available. */ }
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err.response?.data?.message || 'We could not load this product. Please try again.');
        setLoading(false);
      }
    };
    fetchProduct();
    return () => controller.abort();
  }, [productId]);

  useEffect(() => {
    if (!modal || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [modal]);

  const images = product?.images?.filter(image => image.url) || [];
  const mainImage = images[imageIndex]?.url || '/images/salt-fade-bright.svg';
  const available = sizeStock(product, selectedSize);
  const soldOut = totalStock(product) === 0;
  const collection = product?.collectionRef;
  const collectionId = collection?._id || (typeof collection === 'string' ? collection : '');
  const collectionPath = collectionId ? `/products?collection=${encodeURIComponent(collectionId)}` : '/products';
  const chooseSize = size => { setSelectedSize(size); setQuantity(1); };
  const changeImage = direction => setImageIndex(index => (index + direction + images.length) % images.length);
  const addToBag = () => {
    if (canAddSelection(product, selectedSize, quantity) && images.length) addToCart(product, selectedSize, quantity);
  };

  if (loading) return <div className="pdp-state" role="status"><span className="pdp-loading-dot" />Loading your next favourite.</div>;
  if (error || !product) return <div className="pdp-state pdp-error"><span className="pdp-kicker">SALT & FADE</span><h1>Something went off course.</h1><p role="alert">{error || 'This product is unavailable.'}</p><div><button className="pdp-secondary" onClick={() => window.location.reload()}>Try again</button><Link to="/products" className="pdp-inline-link">Back to shop <ArrowRight size={17} /></Link></div></div>;

  return <div className="pdp-page">
    <div className="pdp-shell">
      <nav className="pdp-breadcrumbs" aria-label="Breadcrumb"><Link to="/products"><ArrowLeft size={14} />Shop</Link><span>/</span>{collection?.name && <><Link to={collectionPath}>{collection.name}</Link><span>/</span></>}<span aria-current="page">{product.name}</span></nav>
      <div className="pdp-layout">
        <section className="pdp-gallery" aria-label={`${product.name} gallery`}>
          <div className="pdp-main-photo">
            <button className="pdp-open-image" onClick={() => images.length && setModal('image')} disabled={!images.length} aria-label={`Enlarge ${product.name} image ${imageIndex + 1}`}><img key={mainImage} src={mainImage} alt={`${product.name}, view ${imageIndex + 1}`} fetchPriority="high" /></button>
            {soldOut && <span className="pdp-image-label">Sold out</span>}
            {images.length > 0 && <button className="pdp-expand" onClick={() => setModal('image')} aria-label="Enlarge product photo"><Expand size={19} /></button>}
            {images.length > 1 && <div className="pdp-gallery-controls"><button onClick={() => changeImage(-1)} aria-label="Previous image"><ChevronLeft size={20} /></button><span aria-live="polite">{String(imageIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}</span><button onClick={() => changeImage(1)} aria-label="Next image"><ChevronRight size={20} /></button></div>}
          </div>
          {images.length > 1 && <div className="pdp-thumbnails" aria-label="Choose product image">{images.map((image, index) => <button key={image._id || `${image.url}-${index}`} aria-label={`Show image ${index + 1} of ${product.name}`} aria-pressed={imageIndex === index} onClick={() => setImageIndex(index)}><img src={image.url} alt="" loading="lazy" /></button>)}</div>}
          <p className="pdp-gallery-note">{images.length ? 'A closer look at the details.' : 'Product photography is currently unavailable.'}</p>
        </section>
        <section className="pdp-info" aria-labelledby="pdp-title">
          <div className="pdp-heading"><Link className="pdp-kicker" to={collectionPath}>{collection?.name || product.category || 'Salt & Fade'}</Link><h1 id="pdp-title">{product.name}</h1><p className="pdp-price">{money(product.price)}</p><span className="pdp-category">{product.category}</span></div>
          <div className="pdp-selection">
            <div className="pdp-size-heading"><span>Size <strong>{selectedSize || 'Select your size'}</strong></span>{product.sizeChart?.url && <button className="pdp-inline-link" onClick={() => setModal('size')}><Ruler size={15} />Size guide</button>}</div>
            <fieldset className="pdp-sizes"><legend className="pdp-sr-only">Choose a size</legend>{PRODUCT_SIZES.map(size => { const count = sizeStock(product, size); return <label key={size} className={count === 0 ? 'pdp-size-unavailable' : ''}><input type="radio" name="product-size" value={size} checked={selectedSize === size} disabled={count === 0} onChange={() => chooseSize(size)} /><span>{size}</span><span className="pdp-sr-only">{count === 0 ? ', sold out' : ', available'}</span></label>; })}</fieldset>
            <p className={`pdp-stock ${soldOut ? 'pdp-stock-empty' : ''}`} role="status">{soldOut ? 'This design is currently sold out.' : !selectedSize ? 'Choose a size to check availability.' : available < 5 ? `Only ${available} left in size ${selectedSize}.` : `Size ${selectedSize} is available.`}</p>
            <div className="pdp-purchase-row"><div className="pdp-quantity" role="group" aria-label="Quantity"><button disabled={!selectedSize || quantity <= 1} onClick={() => setQuantity(value => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus size={16} /></button><output aria-live="polite" aria-label="Selected quantity">{quantity}</output><button disabled={!selectedSize || quantity >= available} onClick={() => setQuantity(value => Math.min(available, value + 1))} aria-label="Increase quantity"><Plus size={16} /></button></div><button className="pdp-add" disabled={!canAddSelection(product, selectedSize, quantity) || !images.length} onClick={addToBag}><ShoppingBag size={18} />{soldOut ? 'Sold out' : !selectedSize ? 'Select a size' : 'Add to bag'}<ArrowRight size={19} /></button></div>
            <div className="pdp-delivery-note"><Truck size={18} /><span>Delivery across Sri Lanka.<br /><strong>Complimentary on orders of Rs. 9,000 and above.</strong></span></div>
          </div>
          <div className="pdp-details">
            <details open><summary>The details<ChevronDown size={17} /></summary><div className="pdp-rich-copy" dangerouslySetInnerHTML={{ __html: (product.description || '').replace(/&nbsp;/g, ' ') }} /></details>
            <details><summary>Delivery<ChevronDown size={17} /></summary><div className="pdp-detail-copy"><p>Shipping is calculated in your bag. Delivery is complimentary when your order reaches Rs. 9,000.</p><p>For orders below Rs. 9,000, delivery is Rs. 450 for one or two items, or Rs. 550 for three or more.</p></div></details>
            <details><summary>Returns & exchanges<ChevronDown size={17} /></summary><div className="pdp-detail-copy"><p>Exchanges are accepted within 4 days of delivery for size issues or manufacturing defects. Items must be unused, unworn, and in their original packaging, with proof of purchase.</p><p>Refunds are not offered. Contact us within 24 hours for damaged or incorrect items.</p><Link className="pdp-inline-link" to="/returns">Read the full policy<ArrowUpRight size={15} /></Link></div></details>
          </div>
          <a className="pdp-help" href={`https://wa.me/94771070544?text=${encodeURIComponent(`Hello Salt & Fade, I have a question about ${product.name}.`)}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /><span>Need a hand with fit or sizing?</span><ArrowUpRight size={16} /></a>
        </section>
      </div>
      {related.length > 0 && <section className="pdp-related" aria-labelledby="pdp-related-title"><div className="pdp-related-heading"><div><span className="pdp-kicker">KEEP EXPLORING</span><h2 id="pdp-related-title">In good company.</h2></div><Link className="pdp-inline-link" to={collectionPath}>Explore the collection<ArrowUpRight size={17} /></Link></div><div className="pdp-related-grid">{related.map(item => <Link key={item._id} className="pdp-related-card" to={`/product/${item._id}`}><div><img src={item.images?.[0]?.url || '/images/salt-fade-bright.svg'} alt={item.name} loading="lazy" />{totalStock(item) === 0 && <span>Sold out</span>}<ArrowUpRight size={19} /></div><h3>{item.name}</h3><p>{money(item.price)}</p></Link>)}</div></section>}
    </div>
    {modal && <dialog ref={dialog} className={`pdp-dialog pdp-dialog-${modal}`} aria-labelledby="pdp-dialog-title" onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) setModal(null); }}><div className="pdp-dialog-content"><div className="pdp-dialog-heading"><h2 id="pdp-dialog-title">{modal === 'size' ? 'Size guide' : product.name}</h2><button autoFocus aria-label="Close dialog" onClick={() => setModal(null)}><X size={22} /></button></div><div className="pdp-dialog-image"><img src={modal === 'size' ? product.sizeChart.url : mainImage} alt={modal === 'size' ? `${product.name} size chart` : `${product.name}, enlarged view ${imageIndex + 1}`} /></div>{modal === 'image' && images.length > 1 && <div className="pdp-dialog-navigation"><button className="pdp-inline-link" onClick={() => changeImage(-1)}><ChevronLeft size={18} />Previous</button><span aria-live="polite">{imageIndex + 1} / {images.length}</span><button className="pdp-inline-link" onClick={() => changeImage(1)}>Next<ChevronRight size={18} /></button></div>}</div></dialog>}
  </div>;
};
export default ProductScreen;
