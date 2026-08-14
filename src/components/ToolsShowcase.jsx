import React, { useState, useEffect, useRef } from 'react';

const TOOLS = [
  { name: 'SnapGrad', path: '/tools/snapgrad.png', cta: 'Explore Schools' },
  { name: 'Snaphomz Mortgages', path: '/tools/snapinterest.png', cta: 'Track Rates' },
  { name: 'Snaphomz Closure', path: '/tools/disclosure.jpeg', cta: 'Upload Disclosure' },
  { name: 'Rent vs Buy', path: '/tools/rentvsbuy.png', cta: 'Compare Prices' }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function ToolsShowcase({ accent = '#00D4C8' }) {
  const containerRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [scrollP, setScrollP] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - vh;
      if (total <= 0) return;
      const p = clamp(-r.top / total, 0, 1);
      setScrollP(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Phase 1 (scrollP 0→0.4): Full cloud sky scrolls in, fills viewport
  // Phase 2 (scrollP 0.4→0.7): Clouds contract from 100vh to 38vh (pin to top), content fades in
  // Phase 3 (scrollP 0.7→1): Settled state, user scrolls past

  const cloudContractP = ease(clamp((scrollP - 0.35) / 0.35, 0, 1));
  const cloudHeightVh = 100 - cloudContractP * 55; // 100vh → 45vh

  const contentP = ease(clamp((scrollP - 0.45) / 0.25, 0, 1));
  const contentOpacity = contentP;
  const contentTranslateY = (1 - contentP) * 60;

  return (
    <section
      id="tools"
      data-screen-label="Tools"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '280vh',
        zIndex: 40
      }}
    >
      {/* Sticky inner viewport — pins to top while user scrolls through the 280vh */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Dynamic background fill — only appears below the cloud edge, transparent above */}
        <div
          style={{
            position: 'absolute',
            top: `${cloudHeightVh.toFixed(1)}vh`,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#F4F1EC',
            zIndex: 5
          }}
        />
        {/* CLOUD LAYER (zIndex: 20) — starts at 100vh, contracts to 45vh */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-5%',
            width: '110%',
            height: `${cloudHeightVh.toFixed(1)}vh`,
            zIndex: 20,
            pointerEvents: 'none',
            overflow: 'hidden',
            willChange: 'height',
            transition: 'none'
          }}
        >
          {/* Primary Cloud */}
          <img
            src="/cloud.png"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
              display: 'block',
              opacity: 0.95
            }}
          />
          {/* Secondary Cloud for depth */}
          <img
            src="/cloud.png"
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center bottom',
              display: 'block',
              opacity: 0.45,
              transform: 'scaleX(-1)'
            }}
          />
          {/* Soft bottom vignette */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '35px',
              background: 'linear-gradient(to bottom, rgba(244,241,236,0) 0%, rgba(244,241,236,1) 100%)'
            }}
          />
        </div>

        {/* HEADLINE LAYER (zIndex: 15 — pushed higher at 26vh, submerged behind clouds zIndex 20) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: '26vh',
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY.toFixed(1)}px)`,
            pointerEvents: 'none',
            willChange: 'transform, opacity'
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(76px, 9.6vw, 138px)',
              lineHeight: 0.9,
              letterSpacing: '-0.058em',
              fontVariationSettings: "'wdth' 106, 'wght' 800",
              color: '#0C0E10',
              whiteSpace: 'nowrap'
            }}
          >
            Behind the magic
          </h2>
        </div>

        {/* SUBTITLE & CARDS LAYER (zIndex: 30 — IN FRONT OF clouds zIndex 20, positioned cleanly below big text) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: '3.5vh',
            opacity: contentOpacity,
            transform: `translateY(${contentTranslateY.toFixed(1)}px)`,
            willChange: 'transform, opacity'
          }}
        >
          {/* Subtitle (Moved slightly higher up, sitting just below big text) */}
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(20px, 2.1vw, 30px)',
              lineHeight: 1,
              letterSpacing: '-0.018em',
              fontVariationSettings: "'wdth' 96, 'wght' 600",
              color: '#0C0E10',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              marginBottom: '8vh'
            }}
          >
            are a suite of powerful tools
          </span>

          {/* CARDS */}
          <div
            style={{
              width: '100%',
              padding: '0 54px'
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '20px',
                alignItems: 'stretch'
              }}
            >
              {TOOLS.map((t, k) => {
                const isHovered = hoveredCard === k;
                return (
                  <div
                    key={k}
                    onMouseEnter={() => setHoveredCard(k)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '16px',
                      cursor: 'pointer',
                      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                      transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        background: '#FFFFFF',
                        border: isHovered
                          ? `2px solid ${accent}`
                          : '1px solid rgba(12, 14, 16, 0.1)',
                        boxShadow: isHovered
                          ? '0 32px 70px -22px rgba(12, 14, 16, 0.28)'
                          : '0 20px 48px -20px rgba(12, 14, 16, 0.14)',
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      <img
                        src={t.path}
                        alt={t.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          display: 'block',
                          transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>

                    <span
                      style={{
                        fontSize: '16.5px',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        color: isHovered ? '#0C0E10' : '#5C626A',
                        textAlign: 'center',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {t.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
