import React, { useState } from 'react';

const TOOLS = [
  { name: 'SnapGrad', path: '/tools/snapgrad.png', cta: 'Explore Schools' },
  { name: 'Snaphomz Mortgages', path: '/tools/snapinterest.png', cta: 'Track Rates' },
  { name: 'Snaphomz Closure', path: '/tools/disclosure.jpeg', cta: 'Upload Disclosure' },
  { name: 'Rent vs Buy', path: '/tools/rentvsbuy.png', cta: 'Compare Prices' }
];

export default function ToolsShowcase({ accent = '#00D4C8' }) {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section
      id="tools"
      data-screen-label="Tools"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#F4F1EC',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '3.5vh',
        zIndex: 40,
        transform: 'translate3d(0,0,10px)',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
    >
      {/* PROMINENT CLOUD HEADER BACKGROUND (Extends above, zIndex 45 to mask listings completely in 3D space) */}
      <div
        style={{
          position: 'absolute',
          top: '-6vh',
          left: '-5%',
          width: '110%',
          height: '44vh',
          zIndex: 45,
          transform: 'translate3d(0,0,15px)',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        {/* Layer 1 Primary Cloud */}
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
        {/* Layer 2 Secondary Cloud */}
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
        {/* Soft bottom vignette into #F4F1EC */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to bottom, rgba(244,241,236,0) 0%, rgba(244,241,236,1) 100%)'
          }}
        />
      </div>

      {/* TEXT CONTENT CONTAINER (Big text and small text pushed higher into clouds) */}
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '8.5vh',
          transform: 'translateY(-3.5vh)'
        }}
      >
        {/* BIG HEADLINE: "Behind the magic" */}
        <h2
          style={{
            margin: 0,
            fontSize: 'clamp(76px, 9.6vw, 138px)',
            lineHeight: 0.9,
            letterSpacing: '-0.058em',
            fontVariationSettings: "'wdth' 106, 'wght' 800",
            color: '#0C0E10',
            whiteSpace: 'nowrap',
            marginBottom: '2vh'
          }}
        >
          Behind the magic
        </h2>

        {/* SUBTITLE: "are a suite of powerful tools" */}
        <span
          style={{
            display: 'block',
            fontSize: 'clamp(20px, 2.1vw, 30px)',
            lineHeight: 1,
            letterSpacing: '-0.018em',
            fontVariationSettings: "'wdth' 92, 'wght' 450",
            color: '#5C626A',
            whiteSpace: 'nowrap',
            textAlign: 'center'
          }}
        >
          are a suite of powerful tools
        </span>
      </div>

      {/* CARDS CONTAINER (Spreads 100% to match Listings row padding 0 54px & gap 20px) */}
      <div
        style={{
          position: 'relative',
          zIndex: 25,
          width: '100%',
          padding: '0 54px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {/* 4 Tool Cards Grid */}
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
                {/* Image Card Frame */}
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

                {/* Card Title Label Below Image */}
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
    </section>
  );
}







