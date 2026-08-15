import React, { useState, useEffect, useRef } from 'react';
import Phone3D from './Phone3D';

const STEPS = [
  {
    word: 'Discover',
    tag: 'Natural search',
    headline: 'Describe the home in your own words.',
    body: "No filters. No forms. No endless checkboxes. Say it the way you'd say it out loud, and Snaphomz reads meaning - not just keywords - turning your words into real listings that match the home you're picturing."
  },
  {
    word: 'Personalize',
    tag: 'Tuned to you',
    headline: 'Tuned to your preferences and lifestyle.',
    body: "Your agent learns what matters to you - school districts, natural light, commute times, or renovation potential - refining recommendations automatically as you browse and react to properties."
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
    headline: 'From first offer all the way to keys.',
    body: "Structure competitive offers, review property disclosures, and track closing milestones effortlessly. Your AI agent guides every step of the transaction to a seamless close."
  }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function HowItWorks({ accent = '#00D4C8' }) {
  const sectionRef = useRef(null);
  const stepCopyRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [phone3D, setPhone3D] = useState({ x: 2.2, arc: 0, rot: 0, spin: 0 });
  const [isRightText, setIsRightText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [copyStyle, setCopyStyle] = useState({ opacity: 1, transform: 'translate(0px, 0px)', alignItems: 'flex-start', textAlign: 'left' });

  useEffect(() => {
    let animationFrameId;

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    const updateScrollState = () => {
      const el = sectionRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - vh;
      const p = clamp(-r.top / total, 0, 1);

      // Exactly N-1 transitions for N steps (3 transitions for 4 steps: Discover -> Personalize -> Engage -> Close)
      const numTransitions = STEPS.length - 1;
      const seg = 1 / numTransitions;
      const rawIdx = clamp(Math.floor(p / seg), 0, numTransitions - 1);
      const local = clamp((p - rawIdx * seg) / seg, 0, 1);

      // Step content switches MIDWAY during transition (at local = 0.5)
      const displayIdx = local >= 0.5 ? rawIdx + 1 : rawIdx;
      setStepIndex(displayIdx);

      const w = window.innerWidth;
      const isMob = w < 768;

      const rightX = w * (isMob ? 0.20 : 0.26);
      const leftX = -w * (isMob ? 0.20 : 0.26);
      const fromRight = rawIdx % 2 === 0;
      const t = ease(local);

      // Straight horizontal 3D position
      const x = (fromRight ? rightX : leftX) + ((fromRight ? leftX : rightX) - (fromRight ? rightX : leftX)) * t;

      // Continuous cumulative spin across total section scroll
      const passProgress = rawIdx + t;
      const spinAngle = passProgress * Math.PI * 2;

      // Calculate max world X based on viewport aspect ratio so phone is NEVER clipped on mobile
      const aspect = w / vh;
      const maxWorldX = Math.min(2.2, Math.max(0.38, (6.31 * aspect * 0.5) - 0.70));
      const normX = (x / (w * 0.26)) * maxWorldX;

      setPhone3D({ x: normX, arc: 0, rot: 0, spin: spinAngle });

      // Continuous horizontal sliding progress from 0 -> 1 across the viewport
      const sideProgress = fromRight ? t : 1 - t;

      // Midway fade transition: subtle dip at 0.5 during section change
      let fade;
      if (local < 0.35) {
        fade = 1;
      } else if (local < 0.5) {
        fade = (0.5 - local) / 0.15;
      } else if (local < 0.65) {
        fade = (local - 0.5) / 0.15;
      } else {
        fade = 1;
      }

      // Alignment switches at midpoint 0.5
      const isRight = local >= 0.5 ? fromRight : !fromRight;
      setIsRightText(isRight);

      const copyW = stepCopyRef.current ? stepCopyRef.current.offsetWidth : (isMob ? 280 : 500);
      const edgePadding = isMob ? 28 : 108;
      const travelCopy = Math.max(0, w - edgePadding - copyW);

      // 100% straight horizontal line translation (Y fixed at 0px)
      setCopyStyle({
        opacity: fade,
        transform: `translate(${(travelCopy * sideProgress).toFixed(1)}px, 0px)`,
        alignItems: isRight ? 'flex-end' : 'flex-start',
        textAlign: isRight ? 'right' : 'left'
      });
    };

    const handleScroll = () => {
      animationFrameId = requestAnimationFrame(updateScrollState);
    };

    handleResize();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const currentStep = STEPS[stepIndex];
  const charLength = currentStep.word.length;

  // Exact character length scaling to fit Personalize (11 chars) with equal side and bottom spacing
  const desktopVw = Math.min(5.2, 54 / charLength);
  const mobileVw = Math.min(7.8, 42 / charLength);

  return (
    <section
      id="services"
      data-screen-label="How it works"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '420vh',
        background: '#F4F1EC'
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Section Header: how it works */}
        <h2
          style={{
            position: 'absolute',
            left: isMobile ? '16px' : '54px',
            top: isMobile ? '88px' : '88px',
            margin: 0,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: isMobile ? 'clamp(38px, 9vw, 68px)' : 'clamp(76px, 9vw, 130px)',
            lineHeight: 0.86,
            letterSpacing: '-0.025em',
            color: '#0C0E10',
            zIndex: 3
          }}
        >
          How it works
        </h2>

        {/* Content Block: Scaled Pop Square Box + Subtitle + Description */}
        <div
          ref={stepCopyRef}
          style={{
            position: 'absolute',
            left: isMobile ? '16px' : '54px',
            bottom: isMobile ? '40px' : '92px',
            width: isMobile ? 'calc(100vw - 32px)' : 'min(500px, 41vw)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            zIndex: 2,
            willChange: 'transform, opacity',
            ...copyStyle
          }}
        >
          {/* Slightly Larger Sharp Pop-Accent Square Box (equal side & bottom padding) */}
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: isMobile ? '270px' : '395px',
              maxHeight: isMobile ? '270px' : '395px',
              borderRadius: '0px',
              background: accent,
              padding: isMobile ? '12px' : '16px', // Equal spacing on side and bottom
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: isRightText ? 'flex-end' : 'flex-start',
              boxShadow: '0 28px 70px -20px rgba(0, 212, 200, 0.4)',
              transition: 'background .4s ease',
              overflow: 'hidden'
            }}
          >
            {/* Main Title sitting flush with descenders ('g', 'p') fully inside the box */}
            <h3
              style={{
                margin: 0,
                padding: 0,
                width: '100%',
                fontSize: isMobile ? `clamp(24px, ${mobileVw}vw, 46px)` : `clamp(38px, ${desktopVw}vw, 76px)`,
                lineHeight: 1.0, // Ensures descenders like 'g' stay 100% inside box
                letterSpacing: '-0.05em',
                fontVariationSettings: "'wdth' 85, 'wght' 700",
                color: '#0C0E10',
                textAlign: isRightText ? 'right' : 'left',
                whiteSpace: 'nowrap'
              }}
            >
              {currentStep.word}
            </h3>
          </div>

          {/* Sub Title (Headline - Single Line) */}
          <h4
            style={{
              margin: isMobile ? '16px 0 6px' : '22px 0 8px',
              fontSize: isMobile ? 'clamp(15px, 4vw, 20px)' : 'clamp(20px, 1.9vw, 28px)',
              lineHeight: 1.1,
              letterSpacing: '-0.035em',
              fontVariationSettings: "'wdth' 98, 'wght' 600",
              color: '#0C0E10',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}
          >
            {currentStep.headline}
          </h4>

          {/* Description (Body - Exactly 3 Lines) */}
          <p
            style={{
              margin: 0,
              fontSize: isMobile ? '13px' : '15px',
              lineHeight: 1.5,
              letterSpacing: '-0.012em',
              color: '#5C626A',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {currentStep.body}
          </p>
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
          <Phone3D scrollX={phone3D.x} scrollArc={phone3D.arc} scrollRot={phone3D.rot} scrollSpin={phone3D.spin} />
        </div>

        {/* Step Dots Progress */}
        <div style={{ position: 'absolute', right: isMobile ? '16px' : '54px', bottom: isMobile ? '12px' : '44px', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 3 }}>
          {STEPS.map((_, k) => (
            <span
              key={k}
              style={{
                width: '24px',
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
