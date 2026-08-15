import React, { useState, useEffect, useRef } from 'react';
import Phone3D from './Phone3D';

const DISCOVER_BODY =
  "No filters. No forms. No endless checkboxes. Say it the way you'd say it out loud, and Snaphomz reads meaning - not just keywords - turning your words into real listings that match the home you're picturing.";

const STEPS = [
  {
    word: 'Discover',
    tag: 'Natural search',
    headline: 'Describe in your own words.',
    body: DISCOVER_BODY
  },
  {
    word: 'Personalize',
    tag: 'Tuned to you',
    headline: 'Describe in your own words.',
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
    headline: 'Describe in your own words.',
    body: DISCOVER_BODY
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

      const seg = 1 / STEPS.length;
      const rawIdx = clamp(Math.floor(p / seg), 0, STEPS.length - 1);
      const local = clamp((p - rawIdx * seg) / seg, 0, 1);

      // Step content switches MIDWAY (at local = 0.5)
      const displayIdx = local >= 0.5 ? Math.min(rawIdx + 1, STEPS.length - 1) : rawIdx;
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

      const copyW = stepCopyRef.current ? stepCopyRef.current.offsetWidth : (isMob ? 280 : 440);
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

  // Calculate exact font size based on word length so longer words (like Personalize) fit 100% with ZERO overflow
  const desktopVw = Math.min(5.6, 52 / charLength);
  const mobileVw = Math.min(8.2, 42 / charLength);

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

        {/* Content Block: Sharp Pop Square Box (main title at full bottom width with ZERO padding) + Subtitle + Description */}
        <div
          ref={stepCopyRef}
          style={{
            position: 'absolute',
            left: isMobile ? '16px' : '54px',
            bottom: isMobile ? '28px' : '64px',
            width: isMobile ? 'calc(100vw - 32px)' : 'min(440px, 36vw)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            zIndex: 2,
            willChange: 'transform, opacity',
            ...copyStyle
          }}
        >
          {/* Sharp Pop-Accent Square Box (borderRadius: 0px, padding: 0px) */}
          <div
            style={{
              width: '100%',
              aspectRatio: '1 / 1',
              maxWidth: isMobile ? '220px' : '320px',
              maxHeight: isMobile ? '220px' : '320px',
              borderRadius: '0px',
              background: accent,
              padding: '0px', // Zero padding inside box as strictly requested!
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              alignItems: isRightText ? 'flex-end' : 'flex-start',
              boxShadow: '0 24px 60px -20px rgba(0, 212, 200, 0.35)',
              transition: 'background .4s ease',
              overflow: 'hidden'
            }}
          >
            {/* Main Title sitting flush at the bottom edge with ZERO padding and dynamic character length fitting */}
            <h3
              style={{
                margin: 0,
                padding: 0,
                width: '100%',
                fontSize: isMobile ? `clamp(24px, ${mobileVw}vw, 44px)` : `clamp(38px, ${desktopVw}vw, 76px)`,
                lineHeight: 0.82,
                letterSpacing: '-0.06em',
                fontVariationSettings: "'wdth' 85, 'wght' 700",
                color: '#0C0E10',
                textAlign: isRightText ? 'right' : 'left',
                whiteSpace: 'nowrap'
              }}
            >
              {currentStep.word}
            </h3>
          </div>

          {/* Sub Title (Headline) */}
          <h4
            style={{
              margin: isMobile ? '14px 0 6px' : '20px 0 8px',
              fontSize: isMobile ? 'clamp(18px, 4.5vw, 24px)' : 'clamp(26px, 2.4vw, 34px)',
              lineHeight: 1.12,
              letterSpacing: '-0.035em',
              fontVariationSettings: "'wdth' 98, 'wght' 600",
              color: '#0C0E10'
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
        <div style={{ position: 'absolute', right: isMobile ? '16px' : '54px', bottom: isMobile ? '12px' : '52px', display: 'flex', gap: '8px', alignItems: 'center', zIndex: 3 }}>
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
