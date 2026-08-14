import React, { useState, useEffect } from 'react';

export default function Footer({ accent = '#00D4C8' }) {
  const [localTime, setLocalTime] = useState('');
  const [localCity, setLocalCity] = useState('');

  useEffect(() => {
    const tick = () => {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const timeStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const cityStr = (tz.split('/').pop() || 'Local').replace(/_/g, ' ');
      setLocalTime(timeStr);
      setLocalCity(cityStr);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer id="blog" data-screen-label="Footer" style={{ width: '100%', background: '#F4F1EC', overflow: 'hidden' }}>
      {/* Live Time Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          padding: '20px 54px',
          borderTop: '1px solid rgba(12,14,16,.1)',
          borderBottom: '1px solid rgba(12,14,16,.1)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: accent, display: 'block' }} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10.5px',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              color: '#0C0E10'
            }}
          >
            {localTime || '10:55:00'}
          </span>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10.5px',
              letterSpacing: '.15em',
              textTransform: 'uppercase',
              color: '#9AA0A8'
            }}
          >
            {localCity || 'LOCAL'}
          </span>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '10.5px',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: '#9AA0A8'
          }}
        >
          Browsing from your area
        </span>
      </div>

      {/* Grand Sign Up CTA Banner */}
      <a
        id="signup"
        href="#"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '40px',
          margin: '38px 54px 0',
          padding: '52px 54px',
          borderRadius: '26px',
          overflow: 'hidden',
          background: '#0C0E10',
          textDecoration: 'none'
        }}
      >
        <img
          src="/listings/2.jpg"
          alt="Sign-up background"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.4
          }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(100deg, rgba(12,14,16,.95) 0%, rgba(12,14,16,.84) 44%, rgba(12,14,16,.42) 100%)',
            pointerEvents: 'none'
          }}
        />

        <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10.5px',
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: 'rgba(244,241,236,.5)'
            }}
          >
            Your agent is waiting
          </span>
          <span
            style={{
              fontSize: 'clamp(58px, 6.6vw, 92px)',
              lineHeight: 0.9,
              letterSpacing: '-0.05em',
              fontVariationSettings: "'wdth' 108, 'wght' 700",
              color: '#F4F1EC'
            }}
          >
            Sign up
          </span>
        </span>

        <span
          style={{
            position: 'relative',
            fontSize: '15px',
            lineHeight: 1.55,
            letterSpacing: '-0.012em',
            color: 'rgba(244,241,236,.8)',
            maxWidth: '300px',
            textAlign: 'right'
          }}
        >
          Free to use. Your AI agent works the whole deal, from first search to close.
        </span>
      </a>

      {/* Footer Navigation Columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '40px', padding: '64px 54px 54px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <img
            src="/logo-black.png"
            alt="Snaphomz"
            style={{ height: '60px', width: 'auto', display: 'block', alignSelf: 'flex-start', objectFit: 'contain' }}
          />
          <p style={{ margin: 0, fontSize: '14.5px', lineHeight: 1.6, letterSpacing: '-0.01em', color: '#6A7078', maxWidth: '290px' }}>
            Buying, selling, and working with an agent in one guided experience.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: accent }}>
            Platform
          </span>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Buy</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Sell</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Agents</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Snap tools</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: accent }}>
            Company
          </span>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>About us</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Blog</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Careers</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Contact</a>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '.16em', textTransform: 'uppercase', color: accent }}>
            Legal
          </span>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Privacy</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>Terms</a>
          <a href="#" style={{ fontSize: '14.5px', fontWeight: 500, color: '#0C0E10' }}>NMLS + licensing</a>
        </div>
      </div>

      {/* Copyright & Legal Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', padding: '0 54px 26px' }}>
        <span style={{ fontSize: '12.5px', letterSpacing: '-0.005em', color: '#9AA0A8' }}>© 2026 Snaphomz. All rights reserved.</span>
        <span style={{ fontSize: '12.5px', letterSpacing: '-0.005em', color: '#9AA0A8' }}>Equal Housing Opportunity</span>
      </div>

      {/* Edge-to-Edge Typography Branding */}
      <div style={{ lineHeight: 0, overflow: 'hidden', height: '14.2vw', display: 'flex', alignItems: 'flex-end' }}>
        <span
          style={{
            display: 'block',
            width: '100%',
            fontSize: '14vw',
            lineHeight: 0.74,
            letterSpacing: '-0.06em',
            fontVariationSettings: "'wdth' 120, 'wght' 800",
            color: '#0C0E10',
            whiteSpace: 'nowrap',
            textAlign: 'center'
          }}
        >
          SNAPHOMZ
        </span>
      </div>
    </footer>
  );
}
