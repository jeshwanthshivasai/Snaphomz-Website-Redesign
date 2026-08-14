import React, { useState, useEffect, useRef } from 'react';

const RAILS = [
  {
    title: 'New To Market Homes',
    count: '4 homes',
    homes: [
      { price: '$492,000', specs: '3 bd · 3 ba · 1,850 sqft', addr: '1234 Silver Lake Blvd, San Jose', image: '/listings/1.jpg' },
      { price: '$475,000', specs: '3 bd · 3 ba · 2,100 sqft', addr: '5678 Olympic Blvd, San Jose', image: '/listings/2.jpg' },
      { price: '$499,000', specs: '3 bd · 3 ba · 1,920 sqft', addr: '890 Fairfax Ave, San Jose', image: '/listings/3.jpg' },
      { price: '$510,000', specs: '3 bd · 3 ba · 1,975 sqft', addr: '2200 Sunset Dr, San Jose', image: '/listings/4.jpg' }
    ]
  },
  {
    title: 'Price Drop Homes',
    count: '4 homes',
    homes: [
      { price: '$544,000', specs: '3 bd · 2 ba · 1,780 sqft', addr: '901 Redwood Ave, San Jose', image: '/listings/1.jpg' },
      { price: '$612,500', specs: '4 bd · 3 ba · 2,210 sqft', addr: '77 Cypress Ct, San Jose', image: '/listings/2.jpg' },
      { price: '$389,000', specs: '2 bd · 2 ba · 1,340 sqft', addr: '460 Maple Row, San Jose', image: '/listings/3.jpg' },
      { price: '$725,000', specs: '4 bd · 3 ba · 2,450 sqft', addr: '18 Birchwood Ln, San Jose', image: '/listings/4.jpg' }
    ]
  },
  {
    title: 'New Construction Homes',
    count: '4 homes',
    homes: [
      { price: '$689,000', specs: '3 bd · 3 ba · 2,020 sqft', addr: '212 Harvest Way, San Jose', image: '/listings/1.jpg' },
      { price: '$758,000', specs: '4 bd · 3 ba · 2,380 sqft', addr: '55 Meadowbrook Dr, San Jose', image: '/listings/2.jpg' },
      { price: '$599,000', specs: '3 bd · 2 ba · 1,890 sqft', addr: '9 Aspen Terrace, San Jose', image: '/listings/3.jpg' },
      { price: '$845,000', specs: '4 bd · 4 ba · 2,650 sqft', addr: '301 Willow Creek Rd, San Jose', image: '/listings/4.jpg' }
    ]
  },
  {
    title: 'Luxury Homes',
    count: '4 homes',
    homes: [
      { price: '$1,895,000', specs: '5 bd · 4 ba · 3,620 sqft', addr: '4 Vista Ridge Ct, San Jose', image: '/listings/1.jpg' },
      { price: '$2,150,000', specs: '5 bd · 5 ba · 4,100 sqft', addr: '88 Skyline Dr, San Jose', image: '/listings/2.jpg' },
      { price: '$1,650,000', specs: '4 bd · 4 ba · 3,300 sqft', addr: '210 Ocean View Ter, San Jose', image: '/listings/3.jpg' },
      { price: '$2,490,000', specs: '6 bd · 5 ba · 4,800 sqft', addr: '12 Grandview Estates, San Jose', image: '/listings/4.jpg' }
    ]
  }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Listings({ accent = '#00D4C8' }) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      const lr = el.getBoundingClientRect();

      if (lr.bottom > -200 && lr.top < vh + 200) {
        cardRefs.current.forEach((card) => {
          if (!card) return;
          const top = card.getBoundingClientRect().top;
          const t = ease(clamp((vh - top) / (vh * 0.5), 0, 1));
          card.style.transform = `translateY(${((1 - t) * 56).toFixed(1)}px)`;
          card.style.opacity = (0.25 + t * 0.75).toFixed(3);
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  let cardIndexCounter = 0;

  return (
    <section
      data-screen-label="Listings"
      ref={containerRef}
      style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        background: '#F4F1EC'
      }}
    >
      <div>
        {RAILS.map((r, ri) => (
          <div
            key={ri}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 5,
              background: '#F4F1EC',
              borderTop: '1px solid rgba(12,14,16,.12)',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
              padding: '104px 0 46px'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '24px',
                padding: '0 54px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '32px',
                    lineHeight: 1,
                    letterSpacing: '-0.036em',
                    fontVariationSettings: "'wdth' 96, 'wght' 600",
                    color: '#0C0E10'
                  }}
                >
                  {r.title}
                </h3>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10.5px',
                    letterSpacing: '.15em',
                    color: '#B4B9BF'
                  }}
                >
                  {r.count}
                </span>
              </div>
              <a
                href="#"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  letterSpacing: '-0.012em',
                  color: '#0C0E10'
                }}
              >
                See all <span style={{ width: '22px', height: '1px', background: 'currentColor', display: 'block' }} />
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', padding: '0 54px' }}>
              {r.homes.map((h, hi) => {
                const currentIndex = cardIndexCounter++;
                return (
                  <a
                    key={hi}
                    href="#"
                    ref={(el) => (cardRefs.current[currentIndex] = el)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      background: '#FFFFFF',
                      border: '1px solid rgba(12,14,16,.08)',
                      transition: 'transform .5s cubic-bezier(.16,1,.3,1), box-shadow .45s ease',
                      willChange: 'transform'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.boxShadow = '0 26px 50px -28px rgba(12,14,16,.34)')}
                    onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                  >
                    <span style={{ position: 'relative', display: 'block', height: '200px', background: '#E9E5DD' }}>
                      <img
                        src={h.image}
                        alt={h.addr}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '7px 12px',
                          borderRadius: '999px',
                          background: accent,
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '9px',
                          fontWeight: 500,
                          letterSpacing: '.14em',
                          textTransform: 'uppercase',
                          color: '#0C0E10',
                          pointerEvents: 'none',
                          boxShadow: '0 4px 14px -4px rgba(12,14,16,.4)'
                        }}
                      >
                        For sale
                      </span>
                    </span>

                    <span style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '16px 17px 18px' }}>
                      <span style={{ fontSize: '21px', fontWeight: 650, letterSpacing: '-0.03em', color: '#0C0E10' }}>
                        {h.price}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '-0.006em', color: '#6A7078' }}>
                        {h.specs}
                      </span>
                      <span style={{ fontSize: '13px', letterSpacing: '-0.006em', color: '#9AA0A8' }}>{h.addr}</span>
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
