import React, { useState, useEffect, useRef } from 'react';

const FAQ_A =
  "Snaphomz is a modern real estate platform that brings buying, selling, and working with an agent into one clear, guided experience. Just search homes, connect with an agent, manage your offers, and track the deal all the way to close - every step in one place. It's designed to feel simpler and more transparent, so you always know what's happening next.";

const FAQS = [
  { q: 'What is Snaphomz and how does it work?', align: 'flex-start', width: '940px' },
  { q: 'Is Snaphomz free to use?', align: 'flex-end', width: '940px' },
  { q: 'Do I still need a real estate agent?', align: 'flex-start', width: '940px' },
  { q: 'Is Snaphomz legit, and is my data safe?', align: 'flex-end', width: '940px' },
  { q: 'Which areas does Snaphomz cover?', align: 'flex-start', width: '940px' },
  { q: 'How is Snaphomz different from Zillow or Redfin?', align: 'flex-end', width: '940px' }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function FAQ() {
  const cardRefs = useRef([]);
  const sectionRef = useRef(null);
  const [scrollP, setScrollP] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      setScrollP(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const r = card.getBoundingClientRect();
    const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
    const dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);

    const img = card.querySelector('img');

    card.style.transition = 'transform .12s cubic-bezier(0.16, 1, 0.3, 1)';
    card.style.transform = `perspective(1000px) rotateY(${(dx * 22).toFixed(2)}deg) rotateX(${(-dy * 16).toFixed(2)}deg)`;
    
    if (img) {
      img.style.transition = 'filter .2s ease';
      img.style.filter = `drop-shadow(${(-dx * 12).toFixed(1)}px ${(20 - dy * 8).toFixed(1)}px 28px rgba(12,14,16,0.24))`;
    }
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const img = card.querySelector('img');

    card.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
    card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';

    if (img) {
      img.style.transition = 'filter .55s cubic-bezier(.16,1,.3,1)';
      img.style.filter = 'drop-shadow(0px 14px 24px rgba(12,14,16,0.15))';
    }
  };

  const floatParallaxY = ((scrollP - 0.5) * 35).toFixed(1);

  return (
    <section ref={sectionRef} id="about" data-screen-label="FAQ" style={{ position: 'relative', width: '100%', background: '#F4F1EC', padding: '0 0 128px' }}>
      <div style={{ padding: '118px 54px 20px' }}>
        <h2
          style={{
            margin: 0,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(120px, 13vw, 186px)',
            lineHeight: 0.82,
            letterSpacing: '-0.02em',
            color: '#0C0E10'
          }}
        >
          FAQ
        </h2>
      </div>

      <div style={{ height: '1px', background: 'rgba(12,14,16,.12)', margin: '0 54px 54px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '34px', padding: '0 54px', perspective: '1400px' }}>
        {FAQS.map((q, k) => (
          <div key={k} style={{ display: 'flex', justifyContent: q.align }}>
            <div
              style={{
                position: 'relative',
                width: q.width,
                maxWidth: '100%',
                display: 'flex',
                alignItems: 'center',
                perspective: '1200px'
              }}
            >
              {/* White FAQ Text Card */}
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  minWidth: 0,
                  justifyContent: 'center',
                  padding: '38px 44px 38px 315px',
                  borderRadius: '24px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(12,14,16,.08)',
                  boxShadow: '0 24px 50px -28px rgba(12,14,16,.22)'
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '26px',
                    lineHeight: 1.12,
                    letterSpacing: '-0.032em',
                    fontVariationSettings: "'wdth' 96, 'wght' 600",
                    color: '#0C0E10'
                  }}
                >
                  {q.q}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: '15.5px',
                    lineHeight: 1.6,
                    letterSpacing: '-0.01em',
                    color: '#6A7078',
                    maxWidth: '640px',
                    textWrap: 'pretty'
                  }}
                >
                  {FAQ_A}
                </p>
              </div>

              {/* Overlapping Transparent 3D Graphic (Enlarged size) */}
              <div
                ref={(el) => (cardRefs.current[k] = el)}
                onMouseMove={(e) => handleMouseMove(e, k)}
                onMouseLeave={() => handleMouseLeave(k)}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  width: '270px',
                  height: '325px',
                  marginTop: '-162.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transformStyle: 'preserve-3d',
                  willChange: 'transform',
                  zIndex: 10
                }}
              >
                <img
                  src="/SnaphomzFAQ.png"
                  alt="3D Figure Render"
                  style={{
                    width: '110%',
                    height: '110%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 16px 28px rgba(12,14,16,0.18))',
                    transform: `translateY(${floatParallaxY}px)`,
                    transition: 'transform 0.1s linear'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
