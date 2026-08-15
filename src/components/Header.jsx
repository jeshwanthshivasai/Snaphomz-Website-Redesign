import React, { useState, useEffect } from 'react';

const SERVICES = [
  { name: 'Buy a home', desc: 'Search in plain language' },
  { name: 'Sell a home', desc: 'List, price and negotiate' },
  { name: 'Work with an agent', desc: 'Richard, on call around the clock' },
  { name: 'Track your deal', desc: 'Offer through to close' }
];

export default function Header() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const past = window.scrollY > window.innerHeight * 0.5;
      setScrolledPast(past);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 900);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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
        padding: isMobile ? (scrolledPast ? '12px 20px' : '18px 20px') : scrolledPast ? '16px 54px' : '28px 54px',
        background: scrolledPast ? 'rgba(244, 241, 236, 0.88)' : 'transparent',
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
            height: isMobile ? '32px' : scrolledPast ? '38px' : '41px',
            width: 'auto',
            display: 'block',
            filter: scrolledPast ? 'none' : 'brightness(0) invert(1)',
            transition: 'filter .45s ease, height .4s ease'
          }}
        />
      </a>

      {/* Desktop Nav */}
      {!isMobile && (
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
                  background: 'rgba(255, 255, 255, 0.94)',
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

          <a href="#tools" style={{ color: scrolledPast ? '#0C0E10' : 'rgba(244,241,236,0.88)' }}>
            Snap tools
          </a>

          <a href="#blog" style={{ color: scrolledPast ? '#0C0E10' : 'rgba(244,241,236,0.88)' }}>
            Blog
          </a>
        </nav>
      )}

      {/* Action Buttons / Mobile Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '10px' : '22px' }}>
        {!isMobile && (
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
        )}
        <a
          href="#signup"
          style={{
            padding: isMobile ? '8px 16px' : '11px 22px',
            borderRadius: '999px',
            background: scrolledPast ? '#0C0E10' : '#F4F1EC',
            color: scrolledPast ? '#F4F1EC' : '#0C0E10',
            fontSize: isMobile ? '13px' : '14px',
            fontWeight: 600,
            letterSpacing: '-0.008em',
            transition: 'background .3s ease, color .3s ease'
          }}
        >
          Sign up
        </a>

        {/* Mobile Hamburger Toggle */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '5px',
              cursor: 'pointer',
              zIndex: 70
            }}
          >
            <span
              style={{
                width: '22px',
                height: '2px',
                background: mobileMenuOpen ? '#0C0E10' : scrolledPast ? '#0C0E10' : '#F4F1EC',
                transition: 'transform .3s ease',
                transform: mobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                background: mobileMenuOpen ? '#0C0E10' : scrolledPast ? '#0C0E10' : '#F4F1EC',
                opacity: mobileMenuOpen ? 0 : 1,
                transition: 'opacity .3s ease'
              }}
            />
            <span
              style={{
                width: '22px',
                height: '2px',
                background: mobileMenuOpen ? '#0C0E10' : scrolledPast ? '#0C0E10' : '#F4F1EC',
                transition: 'transform .3s ease',
                transform: mobileMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'
              }}
            />
          </button>
        )}
      </div>

      {/* Compact Mobile Menu Card Dropdown */}
      {isMobile && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: '16px',
            width: 'min(280px, 85vw)',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: '20px',
            padding: '18px 20px',
            boxShadow: '0 20px 50px -15px rgba(12,14,16,0.25), 0 0 0 1px rgba(12,14,16,0.08)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            opacity: mobileMenuOpen ? 1 : 0,
            transform: mobileMenuOpen ? 'translateY(0) scale(1)' : 'translateY(-10px) scale(0.95)',
            pointerEvents: mobileMenuOpen ? 'auto' : 'none',
            transition: 'opacity .25s ease, transform .25s cubic-bezier(.16,1,.3,1)',
            zIndex: 70
          }}
        >
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: 600, color: '#0C0E10', padding: '4px 0' }}
          >
            About us
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: 600, color: '#0C0E10', padding: '4px 0' }}
          >
            Services
          </a>
          <a
            href="#tools"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: 600, color: '#0C0E10', padding: '4px 0' }}
          >
            Snap tools
          </a>
          <a
            href="#blog"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '15px', fontWeight: 600, color: '#0C0E10', padding: '4px 0' }}
          >
            Blog
          </a>

          <div style={{ height: '1px', background: 'rgba(12,14,16,0.08)', margin: '2px 0' }} />

          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="#signin"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#0C0E10',
                borderRadius: '999px',
                border: '1px solid rgba(12,14,16,0.15)'
              }}
            >
              Sign in
            </a>
            <a
              href="#signup"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '9px 12px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#F4F1EC',
                background: '#0C0E10',
                borderRadius: '999px'
              }}
            >
              Sign up
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
