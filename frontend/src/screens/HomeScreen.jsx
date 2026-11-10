import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
import CampaignBanner from '../components/CampaignBanner';
import LifestyleRail from '../components/LifestyleRail';
import ProductCarousel, { ProductCard } from '../components/ProductCarousel';
import '../home-campaigns.css';

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [status, setStatus] = useState('loading');
  const collectionRail = useRef(null);
  const [collectionEdges, setCollectionEdges] = useState({ start: true, end: true });
  const updateCollectionEdges = () => {
    const rail = collectionRail.current;
    if (rail) setCollectionEdges({ start: rail.scrollLeft <= 2, end: rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2 });
  };
  const browseCollections = direction => {
    const rail = collectionRail.current;
    rail?.scrollBy({ left: direction * rail.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  const location = useLocation();
  const collectionId = new URLSearchParams(location.search).get('collection');
  useEffect(() => {
    const rail = collectionRail.current;
    if (!rail) return;
    const observer = new ResizeObserver(updateCollectionEdges);
    observer.observe(rail);
    updateCollectionEdges();
    return () => observer.disconnect();
  }, [collections, collectionId]);
  useEffect(() => {
    let active = true;
    setStatus('loading');
    axios.get(`/api/products?sort=latest${collectionId ? `&collection=${encodeURIComponent(collectionId)}` : ''}`)
      .then(({ data }) => { if (active) { setProducts(data); setStatus('ready'); } })
      .catch(() => { if (active) setStatus('error'); });
    axios.get('/api/collections').then(({ data }) => { if (active) setCollections(data); }).catch(() => {});
    return () => { active = false; };
  }, [collectionId]);
  const latestProducts = [...products].sort((a, b) => (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)).slice(0, 12);
  const collectionLink = pattern => {
    const collection = collections.find(item => pattern.test(item.name));
    return collection ? `/products?collection=${collection._id}&sort=latest` : '/products?sort=latest';
  };
  const activities = [
    { title: 'Surf', image: '/images/campaigns/surf-lifestyle-v4.jpg', alt: 'A Salt & Fade tee worn on a yellow surfboard', to: collectionLink(/surf club|east/i) },
    { title: 'Courtside', image: '/images/campaigns/tennis-mobile.jpg', alt: 'Ride the East graphics on the tennis court', to: collectionLink(/east/i) },
    { title: 'Off duty', image: '/images/campaigns/pool-original.jpg', alt: 'Relaxing poolside in a white island graphic tee', to: collectionLink(/island made/i) },
    { title: 'Everyday', image: '/images/product-references/island-state-of-mind-black-0.webp', alt: 'Island State of Mind graphic tee', to: collectionLink(/state of mind/i) },
  ];
  const islandMade = products.filter(product => /island made|island state/i.test(product.name));
  if (collectionId) return <div className="editorial-store"><section className="sun-products container"><div className="sun-section-heading"><div><span className="eyebrow">SALT & FADE / T-SHIRTS</span><h1>{collections.find(collection => collection._id === collectionId)?.name || 'The collection'}</h1></div><Link className="text-link" to="/products">Shop all <ArrowUpRight size={18} /></Link></div>{status === 'loading' ? <p role="status">Loading tees...</p> : status === 'error' ? <p role="alert">We could not load these tees. Please refresh to try again.</p> : !products.length ? <p>No tees in this collection just yet.</p> : <div className="sun-product-grid">{products.map(product => <ProductCard key={product._id} product={product} />)}</div>}</section></div>;
  return <div className="sunshine-home editorial-store campaign-home">
    <CampaignBanner name="surf" desktop="/images/campaigns/surf-desktop-v4.jpg" mobile="/images/campaigns/surf-mobile-editorial-v5.jpg" alt="Salt & Fade graphic tee worn on a yellow surfboard in Sri Lankan waters" eyebrow="SALT & FADE / ISLAND MADE" title={<>A sunshine<br /><em>state of mind.</em></>} description="Original island graphics. Made for days outside." primary cta="Explore the tees" />
    <ProductCarousel title="Shop the latest styles" products={latestProducts} status={status} />
    <CampaignBanner name="volleyball" desktop="/images/campaigns/volleyball-desktop.jpg" mobile="/images/campaigns/volleyball-mobile.jpg" alt="Play Outside - Salt & Fade beach volleyball campaign" title="Play outside" cta="Shop the collection" artwork />
    {!collectionId && collections.length > 0 && <section className="collection-discovery container" aria-labelledby="collection-discovery-title">
      <div className="collection-discovery-heading"><div><span className="eyebrow">BUILD YOUR ISLAND ROTATION</span><h2 id="collection-discovery-title">Shop by collection</h2></div><div className="collection-discovery-controls"><button type="button" aria-label="Previous collections" aria-controls="collection-rail" disabled={collectionEdges.start} onClick={() => browseCollections(-1)}><ChevronLeft size={18} /></button><button type="button" aria-label="Next collections" aria-controls="collection-rail" disabled={collectionEdges.end} onClick={() => browseCollections(1)}><ChevronRight size={18} /></button></div></div>
      <nav id="collection-rail" ref={collectionRail} onScroll={updateCollectionEdges} className="collection-discovery-grid" aria-label="Shop by collection">{collections.map(collection => <Link className="collection-discovery-card" key={collection._id} to={`/products?collection=${collection._id}&sort=latest`}>
        <div className="collection-discovery-image"><img src={collection.image || '/images/salt-fade-bright.svg'} alt="" loading="lazy" onError={event => { event.currentTarget.onerror = null; event.currentTarget.src = '/images/salt-fade-bright.svg'; }} /></div>
        <div className="collection-discovery-caption"><h3>{collection.name}</h3></div>
      </Link>)}</nav>
    </section>}
    <LifestyleRail items={activities} />
    <CampaignBanner name="pool" desktop="/images/campaigns/pool-desktop.jpg" mobile="/images/campaigns/pool-mobile.jpg" alt="Salt & Fade graphic T-shirt and blue shorts beside a sunlit swimming pool" eyebrow="OFF DUTY / ON ISLAND TIME" title={<>Take the<br />long way off.</>} description="Easy tees. Slow afternoons. Nowhere else to be." cta="Find your everyday tee" />
    <section className="home-story-tiles" aria-label="Explore Salt & Fade">
      <Link to={collectionLink(/island made|state of mind/i)}><img src="/images/campaigns/pool-original.jpg" alt="White Salt & Fade tee worn poolside" loading="lazy" /><span>Shop island graphics <ArrowUpRight size={22} /></span></Link>
      <Link to={collectionLink(/east/i)}><img src="/images/campaigns/tennis-mobile.jpg" alt="Ride the East T-shirt worn courtside" loading="lazy" /><span>Shop Ride the East <ArrowUpRight size={22} /></span></Link>
      <Link to="/about"><img src="/images/campaigns/surf-lifestyle-v4.jpg" alt="Salt & Fade island wear on the water" loading="lazy" /><span>Our island story <ArrowUpRight size={22} /></span></Link>
    </section>
    <ProductCarousel title="The island rotation" eyebrow="ORIGINAL GRAPHICS / EVERYDAY TEES" products={islandMade.length ? islandMade : products.slice(0, 8)} status={status} />
    <div className="store-service-strip"><span>Delivery across Sri Lanka</span><Link to="/returns">Returns & exchanges <ArrowUpRight size={15} /></Link><a href="https://wa.me/94771070544" target="_blank" rel="noreferrer">Customer support <ArrowUpRight size={15} /></a></div>
  </div>;
};
export default HomeScreen;
