import React, { useState, useEffect } from 'react';

const SERVICES = [
  { name: 'Buy a home', desc: 'Search in plain language' },
  { name: 'Sell a home', desc: 'List, price and negotiate' },
  { name: 'Work with an agent', desc: 'Richard, on call around the clock' },
  { name: 'Track your deal', desc: 'Offer through to close' }
];

const SNAP_TOOLS_ROW1 = [
  {
    name: 'Disclosures',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="#5B6EF0" />
        <path d="M8 11h8M8 14.5h8M8 18h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'Rent vs. Buy',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.2" fill="#5B6EF0" />
        <path d="M8 10.4h7l-2-2M16 13.6H9l2 2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Grad',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 5 2.8 9.4 12 13.8l9.2-4.4L12 5z" fill="#5B6EF0" />
        <path d="M6.4 11.6v3.9c0 1.4 2.5 2.6 5.6 2.6s5.6-1.2 5.6-2.6v-3.9" fill="#5B6EF0" />
        <path d="M20.6 10v4.4" stroke="#5B6EF0" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'Audit',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="13" height="16" rx="2.2" fill="#5B6EF0" />
        <path d="M7 7.5h7M7 11h4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="15.4" cy="15.4" r="5" fill="#5B6EF0" stroke="#fff" strokeWidth="1.5" />
        <path d="m13.4 15.5 1.4 1.4 2.6-2.7" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Pre Approvals',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 4.6 5.9v5.6c0 4.3 3 8.2 7.4 9.5 4.4-1.3 7.4-5.2 7.4-9.5V5.9L12 3z" fill="#5B6EF0" />
        <path d="m8.8 12.2 2.3 2.3 4.2-4.4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Interest',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M3.5 16.5 8 11.8l3.2 3.1 5.4-6.2" stroke="#5B6EF0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.6 8h4.4v4.4" stroke="#5B6EF0" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Snap Predict',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M10 3.6c.9 3.7 2.2 5 5.9 5.9-3.7.9-5 2.2-5.9 5.9-.9-3.7-2.2-5-5.9-5.9 3.7-.9 5-2.2 5.9-5.9z" fill="#5B6EF0" />
        <path d="M17.6 13.4c.4 1.8 1 2.5 2.8 2.9-1.8.4-2.4 1-2.8 2.9-.4-1.8-1-2.5-2.8-2.9 1.8-.4 2.4-1 2.8-2.9z" fill="#5B6EF0" />
      </svg>
    )
  },
  {
    name: 'Offer Strength Analyzer',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="3.6" y="10.6" width="4.2" height="9.4" rx="1" fill="#5B6EF0" />
        <rect x="9.9" y="4" width="4.2" height="16" rx="1" fill="#5B6EF0" />
        <rect x="16.2" y="8.2" width="4.2" height="11.8" rx="1" fill="#5B6EF0" />
      </svg>
    )
  },
  {
    name: 'Listing Health Check',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 20.4S3.2 15.3 3.2 9.6a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9c0 5.7-8.8 10.8-8.8 10.8z" fill="#5B6EF0" />
        <path d="M5.4 11.6h3l1.6-2.8 2 5.2 1.6-2.4h5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
];

const SNAP_TOOLS_ROW2 = [
  {
    name: 'HOA Analyzer',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.4 2.8 11.2h2.6v8.4h5V14h3.2v5.6h5v-8.4h2.6L12 3.4z" fill="#5B6EF0" />
      </svg>
    )
  },
  {
    name: 'Reverse Image Search',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="3.4" y="4.6" width="17.2" height="14.8" rx="2.6" stroke="#5B6EF0" strokeWidth="2.1" />
        <circle cx="15.8" cy="9.4" r="1.8" fill="#5B6EF0" />
        <path d="m4.6 17.4 5-5.4 5.2 5.4" stroke="#5B6EF0" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: 'Hold or Sell',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M7 11.4V5.6a1.5 1.5 0 0 1 3 0v5M10 10.6V4.4a1.5 1.5 0 0 1 3 0v6M13 10.6V5.4a1.5 1.5 0 0 1 3 0v5.8M16 11.6V8a1.5 1.5 0 0 1 3 0v6.4c0 3.6-2.6 6.4-6 6.4s-6-2.4-6-5.4v-3" fill="#5B6EF0" />
      </svg>
    )
  },
  {
    name: 'Price Predictor',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.2" fill="#5B6EF0" />
        <path d="M14.6 9.1c-.5-.9-1.5-1.4-2.6-1.4-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2.1c1.6.4 2.8.9 2.8 2.2s-1.2 2.1-2.8 2.1c-1.2 0-2.3-.5-2.8-1.5M12 6.2v11.6" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'Inspection Rebuttal Engine',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 3.6c-4.9 0-8.8 3.2-8.8 7.2 0 2.3 1.3 4.4 3.4 5.7l-.9 3.9 4-2.3c.7.1 1.5.2 2.3.2 4.9 0 8.8-3.2 8.8-7.5S16.9 3.6 12 3.6z" fill="#5B6EF0" />
        <circle cx="8.4" cy="10.9" r="1.1" fill="#fff" />
        <circle cx="12" cy="10.9" r="1.1" fill="#fff" />
        <circle cx="15.6" cy="10.9" r="1.1" fill="#fff" />
      </svg>
    )
  },
  {
    name: 'Snap Viral',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M13.6 3.4c3.6-.9 6.2.4 7 1.2.8.8 2.1 3.4 1.2 7-1.6 4.2-6.4 7.4-6.4 7.4l-2-2.1-3.1-3.2-2.1-2s3.2-4.9 7.4-6.4z" fill="#5B6EF0" />
        <circle cx="15.6" cy="8.4" r="1.7" fill="#fff" />
        <path d="M8.6 15.4c-1.6-.4-3 .3-3.7 1.4-.8 1.2-.9 3.6-.9 3.6s2.4-.1 3.6-.9c1.1-.7 1.8-2.1 1.4-3.7" fill="#5B6EF0" />
      </svg>
    )
  },
  {
    name: 'Reel to Listing',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="3.6" y="4.4" width="16.8" height="15.2" rx="2.4" stroke="#5B6EF0" strokeWidth="2.1" />
        <path d="M8.6 4.6v14.8M15.4 4.6v14.8M3.8 12h16.4" stroke="#5B6EF0" strokeWidth="2.1" />
      </svg>
    )
  },
  {
    name: 'Property Comps',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path d="M12 4v15M5 7.4h14M4.6 7.4 2.4 13h4.4L4.6 7.4zM19.4 7.4 17.2 13h4.4l-2.2-5.6z" stroke="#5B6EF0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.6 19h4.8" stroke="#5B6EF0" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: 'STR vs LTR',
    icon: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13.6" r="7.4" fill="#5B6EF0" />
        <path d="M12 9.8v3.8" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9.6 3.2h4.8" stroke="#5B6EF0" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function Header() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.5;
      setScrolledPast(past);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px',
        padding: scrolledPast ? '16px 54px' : '28px 54px',
        background: scrolledPast ? 'rgba(244, 241, 236, 0.65)' : 'transparent',
        backdropFilter: scrolledPast ? 'blur(24px) saturate(1.8)' : 'none',
        WebkitBackdropFilter: scrolledPast ? 'blur(24px) saturate(1.8)' : 'none',
        borderBottom: scrolledPast ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid transparent',
        boxShadow: scrolledPast ? '0 8px 32px 0 rgba(12, 14, 16, 0.05)' : 'none',
        transition: 'padding .4s cubic-bezier(.16,1,.3,1), background .4s ease, border-bottom-color .4s ease, box-shadow .4s ease'
      }}
    >
      <a href="#">
        <img
          src="/logo-black.png"
          alt="Snaphomz"
          style={{
            height: scrolledPast ? '38px' : '41px',
            width: 'auto',
            display: 'block',
            filter: scrolledPast ? 'none' : 'brightness(0) invert(1)',
            transition: 'filter .45s ease, height .4s ease'
          }}
        />
      </a>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '34px',
          fontSize: '14px',
          fontWeight: 500,
          letterSpacing: '-0.008em'
        }}
      >
        <a href="#about" style={{ color: scrolledPast ? '#0C0E10' : 'rgba(244, 241, 236, 0.88)' }}>
          About us
        </a>

        {/* Services Dropdown */}
        <div
          onMouseEnter={() => setActiveMenu('services')}
          onMouseLeave={() => setActiveMenu(null)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            padding: '10px 0'
          }}
        >
          <span style={{ color: scrolledPast ? '#0C0E10' : 'rgba(244, 241, 236, 0.88)' }}>Services</span>
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRight: scrolledPast ? '1.4px solid #0C0E10' : '1.4px solid rgba(244, 241, 236, 0.6)',
              borderBottom: scrolledPast ? '1.4px solid #0C0E10' : '1.4px solid rgba(244, 241, 236, 0.6)',
              transform: 'rotate(45deg)',
              display: 'block',
              marginTop: '-3px'
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '-14px',
              paddingTop: '12px',
              transition: 'opacity .28s ease, transform .34s cubic-bezier(.16,1,.3,1)',
              opacity: activeMenu === 'services' ? 1 : 0,
              transform: activeMenu === 'services' ? 'translateY(0)' : 'translateY(-10px)',
              pointerEvents: activeMenu === 'services' ? 'auto' : 'none',
              visibility: activeMenu === 'services' ? 'visible' : 'hidden'
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(20px)',
                borderRadius: '18px',
                padding: '10px',
                width: 'max-content',
                boxShadow: '0 30px 70px -30px rgba(12,14,16,.3)',
                border: '1px solid rgba(12,14,16,.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              {SERVICES.map((s, idx) => (
                <a
                  key={idx}
                  href="#services"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    padding: '11px 13px',
                    borderRadius: '11px',
                    transition: 'background .25s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F2EE')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.018em', color: '#0C0E10' }}>
                    {s.name}
                  </span>
                  <span style={{ fontSize: '12.5px', letterSpacing: '-0.006em', color: '#8A9098' }}>
                    {s.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Snap Tools Mega Menu */}
        <div
          onMouseEnter={() => setActiveMenu('tools')}
          onMouseLeave={() => setActiveMenu(null)}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            cursor: 'pointer',
            padding: '10px 0'
          }}
        >
          <span style={{ color: scrolledPast ? '#0C0E10' : 'rgba(244, 241, 236, 0.88)' }}>Snap tools</span>
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRight: scrolledPast ? '1.4px solid #0C0E10' : '1.4px solid rgba(244, 241, 236, 0.6)',
              borderBottom: scrolledPast ? '1.4px solid #0C0E10' : '1.4px solid rgba(244, 241, 236, 0.6)',
              transform: 'rotate(45deg)',
              display: 'block',
              marginTop: '-3px'
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              paddingTop: '14px',
              width: 'min(1160px, 90vw)',
              transition: 'opacity .28s ease, transform .34s cubic-bezier(.16,1,.3,1)',
              opacity: activeMenu === 'tools' ? 1 : 0,
              transform: activeMenu === 'tools' ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-10px)',
              pointerEvents: activeMenu === 'tools' ? 'auto' : 'none',
              visibility: activeMenu === 'tools' ? 'visible' : 'hidden'
            }}
          >
            <div
              style={{
                background: 'rgba(242, 240, 236, 0.94)',
                backdropFilter: 'blur(24px)',
                borderRadius: '26px',
                padding: '14px',
                boxShadow: '0 40px 90px -34px rgba(12,14,16,.35)',
                border: '1px solid rgba(12,14,16,.07)'
              }}
            >
              <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '24px 26px 26px' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '23px',
                    fontWeight: 700,
                    letterSpacing: '-0.032em',
                    color: '#2E3238',
                    marginBottom: '20px'
                  }}
                >
                  Snap tools
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '22px 16px' }}>
                  {SNAP_TOOLS_ROW1.map((t, i) => (
                    <a
                      key={i}
                      href="#tools"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '11px',
                        padding: '12px 8px',
                        borderRadius: '14px',
                        transition: 'background .25s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#F4F2EE')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {t.icon}
                      <span
                        style={{
                          fontSize: '13.5px',
                          letterSpacing: '-0.012em',
                          color: '#2E3238',
                          textAlign: 'center',
                          lineHeight: 1.28
                        }}
                      >
                        {t.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '22px 16px', padding: '26px 26px 20px' }}>
                {SNAP_TOOLS_ROW2.map((t, i) => (
                  <a
                    key={i}
                    href="#tools"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '11px',
                      padding: '12px 8px',
                      borderRadius: '14px',
                      transition: 'background .25s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,.7)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {t.icon}
                    <span
                      style={{
                        fontSize: '13.5px',
                        letterSpacing: '-0.012em',
                        color: '#2E3238',
                        textAlign: 'center',
                        lineHeight: 1.28
                      }}
                    >
                      {t.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <a href="#blog" style={{ color: scrolledPast ? '#0C0E10' : 'rgba(244,241,236,0.88)' }}>
          Blog
        </a>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <a
          href="#signin"
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: scrolledPast ? '#0C0E10' : 'rgba(244, 241, 236, 0.7)',
            transition: 'color .3s ease'
          }}
        >
          Sign in
        </a>
        <a
          href="#signup"
          style={{
            padding: '11px 22px',
            borderRadius: '999px',
            background: scrolledPast ? '#0C0E10' : '#F4F1EC',
            color: scrolledPast ? '#F4F1EC' : '#0C0E10',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '-0.008em',
            transition: 'background .3s ease, color .3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#00D4C8';
            e.currentTarget.style.color = '#0C0E10';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = scrolledPast ? '#0C0E10' : '#F4F1EC';
            e.currentTarget.style.color = scrolledPast ? '#F4F1EC' : '#0C0E10';
          }}
        >
          Sign up
        </a>
      </div>
    </header>
  );
}
