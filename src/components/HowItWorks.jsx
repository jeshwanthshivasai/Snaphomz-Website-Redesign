import React, { useState, useEffect, useRef } from 'react';
import Phone3D from './Phone3D';

const DISCOVER_BODY =
  "No filters. No forms. No endless checkboxes. Say it the way you'd say it out loud, and Snaphomz reads meaning - not just keywords - turning your words into real listings that match the home you're picturing.";

const STEPS = [
  {
    word: 'Discover',
    tag: 'Natural search',
    headline: 'Describe the home in your own words.',
    body: DISCOVER_BODY
  },
  {
    word: 'Personalize',
    tag: 'Tuned to you',
    headline: 'Describe the home in your own words.',
    body: DISCOVER_BODY
  },
  {
    word: 'Engage',
    tag: 'Your AI agent',
    headline: 'Talk to your agent, anytime.',
    body: "Richard answers questions, books tours, and pulls comps at 2am if that's when you're looking. No callbacks, no waiting on a human to get back to you - just answers when you need them."
  },
  {
    word: 'Close',
    tag: 'Offer to keys',
    headline: 'Describe the home in your own words.',
    body: DISCOVER_BODY
  }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function HowItWorks({ accent = '#00D4C8' }) {
  const sectionRef = useRef(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [phone3D, setPhone3D] = useState({ x: 2.2, arc: 0, rot: 0 });
  const [wordStyle, setWordStyle] = useState({ opacity: 1, transform: 'translate(0px, 0px)' });
  const [copyStyle, setCopyStyle] = useState({ opacity: 1, transform: 'translate(0px, 0px)' });

  useEffect(() => {
    let animationFrameId;

    const updateScrollState = () => {
      const el = sectionRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - vh;
      const p = clamp(-r.top / total, 0, 1);

      const seg = 1 / STEPS.length;
      const idx = clamp(Math.floor(p / seg), 0, STEPS.length - 1);
      const local = clamp((p - idx * seg) / seg, 0, 1);

      setStepIndex(idx);

      const w = window.innerWidth;
      const rightX = w * 0.26;
      const leftX = -w * 0.26;
      const fromRight = idx % 2 === 0;
      const t = ease(local);
      const x = (fromRight ? rightX : leftX) + ((fromRight ? leftX : rightX) - (fromRight ? rightX : leftX)) * t;
      const arc = Math.sin(local * Math.PI) * (fromRight ? -62 : 62);
      const rot = (fromRight ? 1 : -1) * (6 - t * 12);

      // Convert pixel scroll coordinates to 3D world units for Three.js camera viewport
      const normX = (x / (w * 0.26)) * 2.3;
      const normArc = (arc / 62) * 0.45;

      setPhone3D({ x: normX, arc: normArc, rot });

      const inOut = local < 0.12 ? local / 0.12 : local > 0.88 ? (1 - local) / 0.12 : 1;
      const side = fromRight ? t : 1 - t;
      const fade = clamp(inOut, 0, 1);

      const travelWord = Math.max(0, w - 108 - 400);
      const travelCopy = Math.max(0, w - 108 - 500);

      setWordStyle({
        opacity: fade,
        transform: `translate(${(travelWord * side).toFixed(1)}px, ${((1 - fade) * 26).toFixed(1)}px)`
      });

      setCopyStyle({
        opacity: fade,
        transform: `translate(${(travelCopy * side).toFixed(1)}px, ${((1 - fade) * 20).toFixed(1)}px)`
      });
    };

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(updateScrollState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentStep = STEPS[stepIndex];

  return (
    <section
      id="services"
      data-screen-label="How it works"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '520vh',
        background: '#F4F1EC'
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <h2
          style={{
            position: 'absolute',
            left: '50px',
            top: '88px',
            margin: 0,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: 'clamp(78px, 9.4vw, 134px)',
            lineHeight: 0.86,
            letterSpacing: '-0.025em',
            color: '#0C0E10',
            zIndex: 3
          }}
        >
          How it works
        </h2>

        {/* Dynamic Step Word */}
        <div
          style={{
            position: 'absolute',
            left: '54px',
            top: '268px',
            zIndex: 2,
            willChange: 'transform, opacity',
            ...wordStyle
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 'clamp(58px, 6.6vw, 96px)',
              lineHeight: 0.9,
              letterSpacing: '-0.052em',
              fontVariationSettings: "'wdth' 76, 'wght' 500",
              color: '#0C0E10'
            }}
          >
            {currentStep.word}
          </h3>
        </div>

        {/* Dynamic Step Copy */}
        <div
          style={{
            position: 'absolute',
            left: '54px',
            bottom: '96px',
            width: 'min(540px, 40vw)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            zIndex: 2,
            willChange: 'transform, opacity',
            ...copyStyle
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: 'clamp(30px, 2.9vw, 42px)',
              lineHeight: 1.08,
              letterSpacing: '-0.038em',
              fontVariationSettings: "'wdth' 98, 'wght' 600",
              color: '#0C0E10'
            }}
          >
            {currentStep.headline}
          </h4>
          <p
            style={{
              margin: 0,
              fontSize: '17px',
              lineHeight: 1.62,
              letterSpacing: '-0.012em',
              color: '#5C626A',
              textWrap: 'pretty'
            }}
          >
            {currentStep.body}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: accent, display: 'block' }} />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '10.5px',
                letterSpacing: '.15em',
                textTransform: 'uppercase',
                color: '#0C0E10'
              }}
            >
              {currentStep.tag}
            </span>
          </div>
        </div>

        {/* Interactive 3D iPhone 16 Model Canvas */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 4,
            pointerEvents: 'none'
          }}
        >
          <Phone3D scrollX={phone3D.x} scrollArc={phone3D.arc} scrollRot={phone3D.rot} />
        </div>

        {/* Step Dots Progress */}
        <div style={{ position: 'absolute', right: '54px', bottom: '52px', display: 'flex', gap: '9px', alignItems: 'center', zIndex: 3 }}>
          {STEPS.map((_, k) => (
            <span
              key={k}
              style={{
                width: '26px',
                height: '3px',
                borderRadius: '2px',
                background: k === stepIndex ? '#0C0E10' : 'rgba(12,14,16,.16)',
                display: 'block',
                transition: 'background .4s ease'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
