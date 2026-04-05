import React from 'react';
import { Link } from 'react-router-dom';

const AboutScreen = () => {
  return (
    <div style={{ backgroundColor: '#fff', color: '#212121', fontFamily: 'var(--font-main)' }}>
      {/* SECTION 1: CHASING THE DREAM (TEXT LEFT / IMAGE RIGHT) */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        minHeight: '85vh', 
        alignItems: 'center',
        padding: '0'
      }}>
        {/* Left: Content */}
        <div style={{ 
          padding: '6rem 8%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', 
            fontWeight: 600, 
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}>
            Chasing the <br/>Dream.
          </h1>
          <div style={{ 
            fontSize: '1.05rem', 
            fontWeight: 300, 
            lineHeight: 1.8, 
            color: '#444',
            maxWidth: '500px'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Our story began in the tropical heat of the Sri Lankan south coast. 
              While the world was slowing down, we realized something was missing—a local surfwear brand that truly captured the independent spirit of our shores.
            </p>
            <p style={{ marginBottom: '2rem' }}>
              We started with a simple corduroy hat and a screen-printed box tee. 
              Today, Salt and Fade is a boutique collective of premium essentials designed for the golden hour.
            </p>
          </div>
          <Link 
            to="/products" 
            className="btn" 
            style={{ 
              width: 'fit-content', 
              padding: '16px 32px', 
              backgroundColor: '#212121', 
              color: '#fff', 
              borderRadius: '3px',
              fontSize: '0.9rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            SHOP NEW ARRIVALS
          </Link>
        </div>

        {/* Right: Primary Brand Image */}
        <div style={{ height: '100%', minHeight: '600px' }}>
          <img 
            src="/images/file_00000000d210720b8876980e8e5204fd.png" 
            alt="Salt and Fade Lifestyle" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>
      </section>

      {/* SECTION 2: OUR MISSION (CENTERED) */}
      <section style={{ padding: '10rem 5% 4rem 5%', backgroundColor: '#fff', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: 700, 
            letterSpacing: '3px', 
            textTransform: 'uppercase', 
            color: '#888',
            display: 'block',
            marginBottom: '2rem'
          }}>
            Our Mission
          </span>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3.5rem)', 
            fontWeight: 600, 
            lineHeight: 1.1, 
            marginBottom: '3rem',
            letterSpacing: '-1px'
          }}>
            Creating Better Clothes, <br/>Inspired by the South Coast.
          </h2>
          <div style={{ 
            fontSize: '1.1rem', 
            fontWeight: 300, 
            lineHeight: 2, 
            color: '#444', 
            maxWidth: '750px', 
            margin: '0 auto 3.5rem auto',
            textAlign: 'center'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              We believe in quality over quantity. Every piece we make is designed to be worn, faded, and loved for seasons to come. 
              Our manufacturing is ethical, localized, and driven by the craftsmanship of the island.
            </p>
            <p>
              We’re not just building a brand; we’re building a community of surfers, creatives, and explorers who find peace in the salt.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: SHARING THE STORY (IMAGE LEFT / TEXT RIGHT) */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        minHeight: '85vh', 
        alignItems: 'center',
        padding: '0'
      }}>
        {/* Left: Lifestyle Image */}
        <div style={{ height: '100%', minHeight: '600px' }}>
          <img 
            src="/images/hero_1.png" 
            alt="The Journey" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
        </div>

        {/* Right: Content */}
        <div style={{ 
          padding: '4rem 8% 6rem 8%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          gap: '2rem'
        }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 4vw, 3rem)', 
            fontWeight: 600, 
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}>
            Sharing the <br/>Story.
          </h2>
          <div style={{ 
            fontSize: '1.05rem', 
            fontWeight: 300, 
            lineHeight: 1.8, 
            color: '#444',
            maxWidth: '500px'
          }}>
            <p style={{ marginBottom: '1.5rem' }}>
              Salt and Fade is more than just fabric—it’s a collective of moments. 
              From the first light surf at Weligama to the late nights planning our next drop, everything we do is rooted in the lifestyle we lead.
            </p>
            <p>
              We’re here to share the journey with you. Follow our story as we grow, evolve, and continue to chase the golden hour.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutScreen;
