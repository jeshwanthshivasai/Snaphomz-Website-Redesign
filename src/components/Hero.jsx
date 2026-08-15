import React, { useState, useEffect, useRef } from 'react';

const BEDS = ['4 bed', '3 bed', '5 bed', '2 bed'];
const CITIES = ['San Jose', 'Austin', 'Los Angeles', 'Houston', 'San Diego'];
const VIBES = ['natural light', 'a modern kitchen', 'mountain views', 'a garden'];
const NEAR = ['hiking trails', 'good schools', 'parks', 'the downtown'];
const PRICES = ['$900K', '$650K', '$1.2M', '$475K'];

export default function Hero({ accent = '#00D4C8' }) {
  const [index, setIndex] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.volume = 0;
      video.loop = true;
      video.play().catch(() => {});
    }

    const timer = setInterval(() => {
      setIndex((i) => i + 1);
    }, 2900);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  const pick = (arr) => arr[index % arr.length];
  const animName = index % 2 === 1 ? 'swB' : 'swA';
  const getAnim = (delay) => `${animName} 0.75s cubic-bezier(.16,1,.3,1) ${index === 0 ? delay : '0s'} both`;

  // RGBA accent helpers
  const hex = accent.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 212;
  const b = parseInt(hex.substring(4, 6), 16) || 200;
  const accentSoft = `rgba(${r},${g},${b},0.6)`;
  const accentWash = `rgba(${r},${g},${b},0.14)`;

  const heroTranslateY = (scrollY * 0.42).toFixed(1);
  const heroOpacity = Math.max(0, 1 - scrollY / 650).toFixed(2);

  return (
    <section
      data-screen-label="Hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#0C0E10',
        overflow: 'hidden'
      }}
    >
      <video
        ref={videoRef}
        src="/hero.mp4"
        autoPlay
        playsInline
        muted
        preload="auto"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(12,14,16,.36) 0%, rgba(12,14,16,0) 26%, rgba(12,14,16,.24) 54%, rgba(12,14,16,.78) 100%)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '54px',
          right: '54px',
          bottom: '76px',
          transform: `translateY(${heroTranslateY}px)`,
          opacity: heroOpacity,
          willChange: 'transform, opacity'
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 'clamp(42px, 4.4vw, 65px)',
            lineHeight: 1.34,
            letterSpacing: '-0.035em',
            color: '#F4F1EC',
            fontVariationSettings: "'wdth' 96, 'wght' 450",
            maxWidth: '1380px'
          }}
        >
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .05s both' }}>I</span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .1s both' }}>want</span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .15s both' }}>a</span>{' '}
          <span
            key={`beds-${index}`}
            style={{
              display: 'inline-block',
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: '1.08em',
              color: accent,
              borderBottom: `2px solid ${accentSoft}`,
              lineHeight: 1,
              animation: getAnim('.2s')
            }}
          >
            {pick(BEDS)}
          </span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .25s both' }}>home</span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .3s both' }}>in</span>{' '}
          <span
            key={`city-${index}`}
            style={{
              display: 'inline-block',
              fontFamily: "'Instrument Serif', serif",
              fontStyle: 'italic',
              fontSize: '1.08em',
              lineHeight: 1,
              padding: '.06em .18em .1em',
              margin: '0 -.1em',
              borderRadius: '7px',
              color: accent,
              background: accentWash,
              animation: getAnim('.35s')
            }}
          >
            {pick(CITIES)}
          </span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .4s both' }}>with</span>{' '}
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            <span
              key={`vibe-${index}`}
              style={{
                display: 'inline-block',
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                fontSize: '1.08em',
                color: accent,
                borderBottom: `2px solid ${accentSoft}`,
                lineHeight: 1,
                animation: getAnim('.45s')
              }}
            >
              {pick(VIBES)}
            </span>
            <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .45s both' }}>,</span>
          </span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .5s both' }}>near</span>{' '}
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            <span
              key={`near-${index}`}
              style={{
                display: 'inline-block',
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                fontSize: '1.08em',
                color: accent,
                borderBottom: `2px solid ${accentSoft}`,
                lineHeight: 1,
                animation: getAnim('.55s')
              }}
            >
              {pick(NEAR)}
            </span>
            <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .55s both' }}>,</span>
          </span>{' '}
          <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .6s both' }}>around</span>{' '}
          <span style={{ display: 'inline-block', whiteSpace: 'nowrap' }}>
            <span
              key={`price-${index}`}
              style={{
                display: 'inline-block',
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic',
                fontSize: '1.08em',
                color: accent,
                borderBottom: `2px solid ${accentSoft}`,
                lineHeight: 1,
                animation: getAnim('.65s')
              }}
            >
              {pick(PRICES)}
            </span>
            <span style={{ display: 'inline-block', animation: 'wIn .9s cubic-bezier(.16,1,.3,1) .65s both' }}>.</span>
          </span>
        </p>
      </div>
    </section>
  );
}
