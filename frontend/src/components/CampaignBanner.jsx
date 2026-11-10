import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function CampaignBanner({ name, desktop, mobile, alt, title, eyebrow, description, to = '/products', cta = 'Shop T-shirts', primary = false, artwork = false }) {
  const Heading = primary ? 'h1' : 'h2';
  const photo = <picture><source media="(max-width: 600px)" srcSet={mobile || desktop} /><img src={desktop} alt={alt} loading={primary ? 'eager' : 'lazy'} fetchPriority={primary ? 'high' : 'auto'} /></picture>;
  if (artwork) return <section className={`campaign-banner campaign-banner--artwork campaign-banner--${name}`} aria-label={title}><Link to={to} aria-label={`${title} — ${cta}`}>{photo}</Link></section>;
  return <section className={`campaign-banner campaign-banner--${name}`} aria-labelledby={`campaign-${name}-title`}>
    {photo}
    <div className="campaign-banner-copy"><span className="eyebrow">{eyebrow}</span><Heading id={`campaign-${name}-title`}>{title}</Heading><p>{description}</p><Link className="sun-button" to={to}>{cta}<ArrowUpRight size={18} /></Link></div>
  </section>;
}
