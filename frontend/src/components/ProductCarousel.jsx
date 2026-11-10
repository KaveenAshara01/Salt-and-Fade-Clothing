import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const money = value => new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', maximumFractionDigits: 0 }).format(value);
export function ProductCard({ product }) {
  const soldOut = !product.countInStock || Object.values(product.countInStock).reduce((sum, n) => sum + Number(n), 0) === 0;
  return <Link className="sun-product" to={`/product/${product._id}`}><div className="sun-product-photo"><img loading="lazy" src={product.images?.[0]?.url || '/images/salt-fade-bright.svg'} alt={product.name} />{product.images?.[1]?.url && <img className="product-alternate" src={product.images[1].url} alt="" loading="lazy" />}{soldOut && <span className="product-label">Sold out</span>}<span className="product-view">View tee <ArrowUpRight size={17} /></span></div><div className="sun-product-info"><h3>{product.name}</h3><span>{money(product.price)}</span></div></Link>;
}

export default function ProductCarousel({ title, eyebrow = 'SALT & FADE / T-SHIRTS', products, children, status = 'ready', to = '/products?sort=latest', campaign }) {
  const rail = useRef(null);
  const id = useId();
  const productKey = products.map(product => product._id).join(',');
  const [edges, setEdges] = useState({ start: true, end: true });
  const update = () => {
    const node = rail.current;
    if (node) setEdges({ start: node.scrollLeft <= 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 });
  };
  useEffect(() => {
    const node = rail.current;
    if (!node) return;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    node.scrollLeft = 0;
    update();
    return () => observer.disconnect();
  }, [productKey, status]);
  const browse = direction => rail.current?.scrollBy({ left: direction * rail.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  return <section className={`home-product-carousel container${campaign ? ' home-product-carousel--mixed' : ''}`} aria-labelledby={`${id}-title`}>
    <div className="home-carousel-heading"><div><span className="eyebrow">{eyebrow}</span><h2 id={`${id}-title`}>{title}</h2></div><div className="home-carousel-actions"><Link className="text-link" to={to}>Shop all <ArrowUpRight size={17} /></Link><div className="home-carousel-controls"><button type="button" onClick={() => browse(-1)} disabled={edges.start || !products.length || status !== 'ready'} aria-label={`Previous ${title}`} aria-controls={`${id}-rail`}><ChevronLeft size={18} /></button><button type="button" onClick={() => browse(1)} disabled={edges.end || !products.length || status !== 'ready'} aria-label={`Next ${title}`} aria-controls={`${id}-rail`}><ChevronRight size={18} /></button></div></div></div>
    {children}
    <div className="home-carousel-row">
      {campaign && <Link className="home-carousel-campaign" to={campaign.to || to} aria-label={`Explore ${title}`}><img src={campaign.src} alt={campaign.alt} loading="lazy" style={{ '--campaign-position': campaign.position || 'center' }} /></Link>}
      <div className="home-carousel-products">{status === 'loading' ? <p className="catalog-message" role="status">Loading the latest tees…</p> : status === 'error' ? <div className="catalog-message" role="alert"><p>We couldn’t load the tees. Please try again.</p><button className="text-link" onClick={() => window.location.reload()}>Try again</button></div> : !products.length ? <p className="catalog-message" role="status">No tees in this collection just yet.</p> : <div ref={rail} id={`${id}-rail`} className="home-product-rail" onScroll={update}>{products.map(product => <ProductCard key={product._id} product={product} />)}</div>}</div>
    </div>
  </section>;
}
