import { useEffect } from 'react';
import { Mail, Phone, Package, AlertTriangle, Truck, Ruler, RefreshCcw } from 'lucide-react';

const ReturnsPolicyScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container" style={{ padding: '8rem 24px 6rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title-medium" style={{ textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '2px' }}>Return & Exchange Policy</h1>
        <p className="subtitle" style={{ fontSize: '1.1rem', color: 'var(--color-text-light)' }}>
          Please review our terms directly.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Exchanges */}
        <section style={{ backgroundColor: 'var(--color-bg)', padding: '2.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.75rem', borderRadius: '50%' }}>
              <RefreshCcw size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Exchanges</h2>
          </div>
          <p style={{ lineHeight: 1.8, marginBottom: '1rem', color: '#444' }}>We accept exchanges within <strong>4 days of delivery</strong>.</p>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>To be eligible:</h3>
            <ul style={{ listStylePosition: 'inside', lineHeight: 1.8, color: '#555', paddingLeft: '1rem' }}>
              <li>Item must be unused and unworn</li>
              <li>Original packaging intact</li>
              <li>Proof of purchase required</li>
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.8rem' }}>Exchanges are available for:</h3>
            <ul style={{ listStylePosition: 'inside', lineHeight: 1.8, color: '#555', paddingLeft: '1rem' }}>
              <li>Size issues</li>
              <li>Manufacturing defects</li>
            </ul>
          </div>
        </section>

        {/* Returns */}
        <section style={{ padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--color-error)' }}>
              <AlertTriangle size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Returns</h2>
          </div>
          <p style={{ lineHeight: 1.8, color: '#444', borderLeft: '3px solid var(--color-error)', paddingLeft: '1rem' }}>
            We do not offer refunds.<br />
            Exchanges are available under the conditions above.
          </p>
        </section>

        {/* Damaged / Incorrect Items */}
        <section style={{ padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--color-primary)' }}>
              <Package size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Damaged / Incorrect Items</h2>
          </div>
          <p style={{ lineHeight: 1.8, color: '#444', marginBottom: '1rem' }}>
            If you receive a damaged, incorrect, or wrong size item, contact us within <strong>24 hours</strong>.
          </p>
          <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: 'var(--radius-sm)' }}>
             <p style={{ color: '#166534', fontWeight: 500, margin: 0 }}>👉 We will provide a free replacement, including all shipping costs.</p>
          </div>
        </section>

        {/* Shipping Responsibility */}
        <section style={{ padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: 'var(--color-text)' }}>
              <Truck size={24} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>Shipping Responsibility</h2>
          </div>
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
             <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #eee' }}>
                <p style={{ marginBottom: '0.8rem', color: '#555' }}>If the customer selects the wrong size or design:</p>
                <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>👉 The customer is responsible for all shipping costs (return & resend).</p>
             </div>
             <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid #eee' }}>
                <p style={{ marginBottom: '0.8rem', color: '#555' }}>If the error is from our side:</p>
                <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>👉 We cover all costs and send the correct item free of charge.</p>
             </div>
          </div>
        </section>

        {/* Size Guide & Limited Drops */}
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
           <section style={{ backgroundColor: 'var(--color-bg)', padding: '2rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <Ruler size={20} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase' }}>Size Guide</h3>
              </div>
              <p style={{ color: '#444', marginBottom: '1rem', fontSize: '0.95rem' }}>Please check the size guide before ordering.</p>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem', color: '#555', fontSize: '0.95rem' }}>
                 <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>👉 Size up if unsure</li>
                 <li style={{ paddingTop: '0.5rem' }}>👉 XL recommended for 6ft+</li>
              </ul>
              <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', margin: 0 }}>Not sure about your size? Contact our team — we’ll help you.</p>
           </section>

           <section style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                <AlertTriangle size={20} color="#fbbf24" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'uppercase' }}>Limited Drops</h3>
              </div>
              <p style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.95rem' }}>All items are part of limited drops.</p>
              <div style={{ borderLeft: '2px solid #fbbf24', paddingLeft: '1rem' }}>
                 <p style={{ fontWeight: 600, margin: 0, color: 'white' }}>No restocks guaranteed.</p>
              </div>
           </section>
        </div>

        {/* Note & Contact */}
        <section style={{ borderTop: '1px solid #eee', paddingTop: '3rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#666', fontStyle: 'italic', marginBottom: '2rem' }}>
            ⚡ By placing an order, you agree to this policy.
          </p>
          <div style={{ display: 'inline-flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="mailto:hello@saltandfade.com" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              <Mail size={18} /> hello@saltandfade.com
            </a>
            <a href="tel:+94771070544" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 600 }}>
              <Phone size={18} /> +94 77 107 0544
            </a>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ReturnsPolicyScreen;
