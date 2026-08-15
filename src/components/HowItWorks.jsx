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
  const stepWordRef = useRef(null);
  const stepCopyRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [phone3D, setPhone3D] = useState({ x: 2.2, arc: 0, rot: 0, spin: 0 });
  const [isRightText, setIsRightText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [wordStyle, setWordStyle] = useState({ opacity: 1, transform: 'translate(0px, 0px)', textAlign: 'left' });
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

      const rightX = w * (isMob ? 0.22 : 0.26);
      const leftX = -w * (isMob ? 0.22 : 0.26);
      const fromRight = rawIdx % 2 === 0;
      const t = ease(local);

      // Straight horizontal 3D position (no vertical lifting arc)
      const x = (fromRight ? rightX : leftX) + ((fromRight ? leftX : rightX) - (fromRight ? rightX : leftX)) * t;

      // Continuous cumulative spin across total section scroll
      const passProgress = rawIdx + t;
      const spinAngle = passProgress * Math.PI * 2;

      // Calculate max world X based on viewport aspect ratio so phone is NEVER clipped on mobile
      const aspect = w / vh;
      const maxWorldX = Math.min(2.2, Math.max(0.45, (6.31 * aspect * 0.5) - 0.70));
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

      const wordW = stepWordRef.current ? stepWordRef.current.offsetWidth : (isMob ? 200 : 350);
      const copyW = stepCopyRef.current ? stepCopyRef.current.offsetWidth : (isMob ? 300 : 500);

      const edgePadding = isMob ? 32 : 108;
      const travelWord = Math.max(0, w - edgePadding - wordW);
      const travelCopy = Math.max(0, w - edgePadding - copyW);

      setWordStyle({
        opacity: fade,
        transform: `translate(${(travelWord * sideProgress).toFixed(1)}px, ${((1 - fade) * 26).toFixed(1)}px)`,
        textAlign: isRight ? 'right' : 'left'
      });

      setCopyStyle({
        opacity: fade,
        transform: `translate(${(travelCopy * sideProgress).toFixed(1)}px, ${((1 - fade) * 20).toFixed(1)}px)`,
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
            left: isMobile ? '16px' : '50px',
            top: isMobile ? '64px' : '88px',
            margin: 0,
            fontFamily: "'Instrument Serif', serif",
            fontStyle: 'italic',
            fontWeight: 400,
            fontSize: isMobile ? 'clamp(40px, 9.5vw, 76px)' : 'clamp(78px, 9.4vw, 134px)',
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
          ref={stepWordRef}
          style={{
            position: 'absolute',
            left: isMobile ? '16px' : '54px',
            top: isMobile ? '145px' : '268px',
            zIndex: 2,
            willChange: 'transform, opacity',
            ...wordStyle
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: isMobile ? 'clamp(34px, 8vw, 60px)' : 'clamp(58px, 6.6vw, 96px)',
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
          ref={stepCopyRef}
          style={{
            position: 'absolute',
            left: isMobile ? '16px' : '54px',
            bottom: isMobile ? '36px' : '96px',
            width: isMobile ? 'calc(100vw - 32px)' : 'min(540px, 40vw)',
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? '10px' : '20px',
            zIndex: 2,
            willChange: 'transform, opacity',
            ...copyStyle
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: isMobile ? 'clamp(20px, 5vw, 28px)' : 'clamp(30px, 2.9vw, 42px)',
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
              fontSize: isMobile ? '13.5px' : '17px',
              lineHeight: 1.55,
              letterSpacing: '-0.012em',
              color: '#5C626A',
              textWrap: 'pretty'
            }}
          >
            {currentStep.body}
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isRightText ? 'flex-end' : 'flex-start',
              gap: '10px',
              marginTop: '4px',
              width: '100%'
            }}
          >
            {isRightText ? (
              <>
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
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: accent, display: 'block' }} />
              </>
            ) : (
              <>
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
              </>
            )}
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
          <Phone3D scrollX={phone3D.x} scrollArc={phone3D.arc} scrollRot={phone3D.rot} scrollSpin={phone3D.spin} />
        </div>

        {/* Step Dots Progress */}
        <div style={{ position: 'absolute', right: isMobile ? '16px' : '54px', bottom: isMobile ? '14px' : '52px', display: 'flex', gap: '9px', alignItems: 'center', zIndex: 3 }}>
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
