import React, { useRef } from 'react';

const FAQ_A =
  "Snaphomz is a modern real estate platform that brings buying, selling, and working with an agent into one clear, guided experience. Just search homes, connect with an agent, manage your offers, and track the deal all the way to close - every step in one place. It's designed to feel simpler and more transparent, so you always know what's happening next.";

const FAQS = [
  { q: 'What is Snaphomz and how does it work?', align: 'flex-start', width: '1030px' },
  { q: 'Is Snaphomz free to use?', align: 'flex-end', width: '880px' },
  { q: 'Do I still need a real estate agent?', align: 'flex-start', width: '820px' },
  { q: 'Is Snaphomz legit, and is my data safe?', align: 'flex-end', width: '880px' },
  { q: 'Which areas does Snaphomz cover?', align: 'flex-start', width: '820px' },
  { q: 'How is Snaphomz different from Zillow or Redfin?', align: 'flex-end', width: '880px' }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function FAQ() {
  const cardRefs = useRef([]);

  const handleMouseMove = (e, index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const r = card.getBoundingClientRect();
    const dx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1);
    const dy = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1);

    card.style.transition = 'box-shadow .4s ease';
    card.style.transform = `rotateY(${(dx * 12).toFixed(2)}deg) rotateX(${(-dy * 9).toFixed(2)}deg) scale(1.04)`;
    card.style.boxShadow = '0 30px 60px -26px rgba(12,14,16,.45)';
  };

  const handleMouseLeave = (index) => {
    const card = cardRefs.current[index];
    if (!card) return;

    card.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1), box-shadow .4s ease';
    card.style.transform = 'none';
    card.style.boxShadow = 'none';
  };

  return (
    <section id="about" data-screen-label="FAQ" style={{ position: 'relative', width: '100%', background: '#F4F1EC', padding: '0 0 128px' }}>
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
                width: q.width,
                maxWidth: '100%',
                display: 'flex',
                gap: '26px',
                alignItems: 'stretch',
                padding: '30px',
                borderRadius: '24px',
                background: '#FFFFFF',
                border: '1px solid rgba(12,14,16,.08)',
                boxShadow: '0 30px 60px -34px rgba(12,14,16,.3)',
                perspective: '900px'
              }}
            >
              {/* 3D Tilt Image Card */}
              <div
                ref={(el) => (cardRefs.current[k] = el)}
                onMouseMove={(e) => handleMouseMove(e, k)}
                onMouseLeave={() => handleMouseLeave(k)}
                style={{
                  position: 'relative',
                  width: '236px',
                  aspectRatio: '1 / 1',
                  flex: 'none',
                  alignSelf: 'center',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#EDE9E1',
                  cursor: 'pointer'
                }}
              >
                <img
                  src="/faq-figure.png"
                  alt="3D Figure Render"
                  style={{
                    position: 'absolute',
                    top: '-8%',
                    left: '-8%',
                    width: '116%',
                    height: '116%',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px', minWidth: 0, justifyContent: 'center' }}>
                <h3
                  style={{
                    margin: 0,
                    fontSize: '27px',
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
                    lineHeight: 1.62,
                    letterSpacing: '-0.01em',
                    color: '#6A7078',
                    maxWidth: '640px',
                    textWrap: 'pretty'
                  }}
                >
                  {FAQ_A}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
