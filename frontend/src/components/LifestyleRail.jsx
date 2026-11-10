import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LifestyleRail({ items }) {
  const rail = useRef(null);
  const id = useId();
  const [edges, setEdges] = useState({ start: true, end: true });
  const update = () => {
    const node = rail.current;
    if (node) setEdges({ start: node.scrollLeft <= 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 });
  };
  useEffect(() => {
    const node = rail.current;
    const observer = new ResizeObserver(update);
    observer.observe(node);
    update();
    return () => observer.disconnect();
  }, []);
  const browse = direction => rail.current?.scrollBy({ left: direction * rail.current.clientWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  return <section className="home-lifestyle" aria-labelledby={`${id}-title`}>
    <div className="home-carousel-heading"><div><span className="eyebrow">FIND YOUR EVERYDAY ESCAPE</span><h2 id={`${id}-title`}>Shop by activity</h2></div><div className="home-carousel-controls"><button type="button" disabled={edges.start} onClick={() => browse(-1)} aria-label="Previous activities" aria-controls={`${id}-rail`}><ChevronLeft size={18} /></button><button type="button" disabled={edges.end} onClick={() => browse(1)} aria-label="Next activities" aria-controls={`${id}-rail`}><ChevronRight size={18} /></button></div></div>
    <nav className="home-lifestyle-rail" ref={rail} id={`${id}-rail`} onScroll={update} aria-label="Shop by activity">{items.map(item => <Link key={item.title} to={item.to}><img src={item.image} alt={item.alt} loading="lazy" /><h3>{item.title}</h3></Link>)}</nav>
  </section>;
}
