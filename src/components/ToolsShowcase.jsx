import React, { useState, useEffect, useRef } from 'react';

const TOOLS = [
  { name: 'SnapGrad', path: '/tools/snapgrad.png', cta: 'Explore Schools' },
  { name: 'Snaphomz Mortgages', path: '/tools/snapinterest.png', cta: 'Track Rates' },
  { name: 'Snaphomz Closure', path: '/tools/disclosure.jpeg', cta: 'Upload Disclosure' },
  { name: 'Rent vs Buy', path: '/tools/rentvsbuy.png', cta: 'Compare Prices' }
];

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function ToolsShowcase({ accent = '#00D4C8' }) {
  const containerRef = useRef(null);
  const [activeTool, setActiveTool] = useState(0);
  const [verticalState, setVerticalState] = useState(false);

  // Parallax & animation states
  const [cloud1Transform, setCloud1Transform] = useState({ transform: 'translateY(0px)', opacity: 0.95 });
  const [cloud2Transform, setCloud2Transform] = useState({ transform: 'translateY(0px)', opacity: 0.8 });
  const [cloud3Transform, setCloud3Transform] = useState({ transform: 'translateY(0px)', opacity: 0.55 });
  const [headOpacity, setHeadOpacity] = useState(1);
  const [stageStyle, setStageStyle] = useState({ opacity: 1, transform: 'translateY(0px)', top: '47%' });
  const [listStyle, setListStyle] = useState({ opacity: 1, width: '100%' });
  const [panelOpacity, setPanelOpacity] = useState(0);

  const autoToolTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const vh = window.innerHeight;
      const r = el.getBoundingClientRect();
      const total = el.offsetHeight - vh;
      const p = clamp(-r.top / total, 0, 1);

      const turnP = clamp((p - 0.58) / 0.26, 0, 1);
      const tp = ease(turnP);
      const isVert = turnP > 0.5;
      setVerticalState(isVert);

      const clear = 1 - ease(clamp((p - 0.5) / 0.14, 0, 1));
      const lift = ease(clamp(p / 0.17, 0, 1));

      // Clouds transform
      setCloud1Transform({
        transform: `translateY(${(vh * 0.42 - lift * (vh * 0.42 + 300)).toFixed(1)}px)`,
        opacity: clear
      });
      setCloud2Transform({
        transform: `translateY(${(vh * 0.55 - lift * (vh * 0.55 + 250)).toFixed(1)}px)`,
        opacity: clear
      });
      setCloud3Transform({
        transform: `translateY(${(vh * 0.66 - lift * (vh * 0.66 + 200)).toFixed(1)}px)`,
        opacity: clear
      });

      // Headline
      const headP = clamp((p - 0.08) / 0.16, 0, 1);
      setHeadOpacity(ease(headP) * clear);

      // Stage
      const riseP = clamp((p - 0.26) / 0.18, 0, 1);
      setStageStyle({
        opacity: riseP,
        transform: `translateY(${((1 - ease(riseP)) * vh * 0.48).toFixed(1)}px)`,
        top: `${(47 - tp * 32).toFixed(2)}%`
      });

      // List & Panel
      const dip = 1 - Math.sin(clamp(turnP, 0, 1) * Math.PI) * 0.88;
      setListStyle({
        opacity: dip,
        width: `${(100 - tp * 68).toFixed(2)}%`
      });

      setPanelOpacity(tp);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto rotation timer when vertical
  useEffect(() => {
    if (verticalState) {
      autoToolTimer.current = setInterval(() => {
        setActiveTool((prev) => (prev + 1) % TOOLS.length);
      }, 3200);
    } else {
      if (autoToolTimer.current) clearInterval(autoToolTimer.current);
    }

    return () => {
      if (autoToolTimer.current) clearInterval(autoToolTimer.current);
    };
  }, [verticalState]);

  const active = TOOLS[activeTool];

  return (
    <section
      id="tools"
      data-screen-label="Tools"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '380vh',
        background: '#F4F1EC'
      }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Layer 3 Cloud */}
        <div
          style={{
            position: 'absolute',
            left: '-6%',
            width: '112%',
            top: 0,
            zIndex: 5,
            willChange: 'transform',
            pointerEvents: 'none',
            ...cloud3Transform
          }}
        >
          <img
            src="/cloud.png"
            alt=""
            style={{ width: '100%', display: 'block', filter: 'hue-rotate(10deg) saturate(.68) brightness(1.05)', opacity: 0.55 }}
          />
        </div>

        {/* Layer 2 Cloud */}
        <div
          style={{
            position: 'absolute',
            left: '-14%',
            width: '128%',
            top: 0,
            zIndex: 7,
            willChange: 'transform',
            pointerEvents: 'none',
            ...cloud2Transform
          }}
        >
          <img
            src="/cloud.png"
            alt=""
            style={{ width: '100%', display: 'block', transform: 'scaleX(-1)', opacity: 0.8 }}
          />
        </div>

        {/* Tools Headline */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '19%',
            padding: '0 54px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 6,
            willChange: 'opacity',
            opacity: headOpacity
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 'clamp(76px, 9.6vw, 138px)',
              lineHeight: 0.9,
              letterSpacing: '-0.058em',
              fontVariationSettings: "'wdth' 106, 'wght' 800",
              color: '#0C0E10',
              whiteSpace: 'nowrap'
            }}
          >
            Behind the magic
          </h2>
          <span
            style={{
              display: 'block',
              marginTop: '16px',
              fontSize: 'clamp(20px, 2vw, 30px)',
              lineHeight: 1,
              letterSpacing: '-0.018em',
              fontVariationSettings: "'wdth' 92, 'wght' 450",
              color: '#5C626A',
              whiteSpace: 'nowrap'
            }}
          >
            A suite of powerful tools
          </span>
        </div>

        {/* Tool Stage Container */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '8%',
            padding: '0 54px',
            zIndex: 6,
            willChange: 'transform, opacity',
            ...stageStyle
          }}
        >
          <div style={{ width: '100%', height: '100%', display: 'flex', gap: '48px', minHeight: 0 }}>
            {/* Tool Buttons List */}
            <div
              style={{
                flex: 'none',
                display: 'flex',
                gap: verticalState ? '18px' : '24px',
                minHeight: 0,
                alignItems: 'stretch',
                flexDirection: verticalState ? 'column' : 'row',
                ...listStyle
              }}
            >
              {TOOLS.map((t, k) => (
                <button
                  key={k}
                  onClick={() => {
                    setActiveTool(k);
                    if (autoToolTimer.current) {
                      clearInterval(autoToolTimer.current);
                      autoToolTimer.current = setInterval(() => {
                        setActiveTool((prev) => (prev + 1) % TOOLS.length);
                      }, 3200);
                    }
                  }}
                  style={{
                    all: 'unset',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    flex: '1 1 0',
                    minWidth: 0,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: verticalState ? 'row' : 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: verticalState ? '18px' : '14px'
                  }}
                >
                  <span
                    style={{
                      width: verticalState ? 'clamp(56px, 7vh, 86px)' : '100%',
                      aspectRatio: '1 / 1',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      background: '#E9E5DD',
                      backgroundImage: `url("${t.path}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      display: 'block',
                      flex: 'none',
                      transition: 'outline-color .3s ease',
                      outline: `2px solid ${k === activeTool ? accent : 'transparent'}`,
                      outlineOffset: '3px'
                    }}
                  />
                  <span
                    style={{
                      fontSize: verticalState ? '17px' : '16.5px',
                      fontWeight: 600,
                      letterSpacing: '-0.024em',
                      color: k === activeTool ? '#0C0E10' : '#7C828A',
                      flex: verticalState ? 1 : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      textAlign: verticalState ? 'left' : 'center',
                      transition: 'color .3s ease'
                    }}
                  >
                    {t.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Tool Active Preview Panel */}
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 0,
                minHeight: 0,
                opacity: panelOpacity
              }}
            >
              <span
                role="img"
                aria-label={active.name}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'block',
                  backgroundImage: `url("${active.path}")`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  filter: 'drop-shadow(0 40px 60px rgba(12,14,16,.3))'
                }}
              />
            </div>
          </div>
        </div>

        {/* Layer 1 Foreground Cloud */}
        <div
          style={{
            position: 'absolute',
            left: '-20%',
            width: '140%',
            top: 0,
            zIndex: 9,
            willChange: 'transform',
            pointerEvents: 'none',
            ...cloud1Transform
          }}
        >
          <img src="/cloud.png" alt="" style={{ width: '100%', display: 'block', opacity: 0.95 }} />
        </div>
      </div>
    </section>
  );
}
