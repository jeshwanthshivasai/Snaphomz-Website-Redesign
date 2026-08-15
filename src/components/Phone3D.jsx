import React, { useRef, useEffect, useState, Component, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * =========================================================================
 * 3D IPHONE POSE & ROTATION CONFIGURATION (TWEAK THESE VALUES TO ADJUST POSE)
 * =========================================================================
 */
export const PHONE_POSE_CONFIG = {
  // --- FACING ANGLE (Y-axis rotation / Yaw) ---
  // Angle in degrees that the phone turns inward toward the text on each side
  // Increase to turn more sideways, decrease to face more straight forward
  facingAngleDeg: 100,

  // --- TILT ANGLE (Z-axis rotation / Roll) ---
  // Angle in degrees that the phone tilts sideways when moving to left/right
  // Increase for more side tilt, decrease for straighter vertical alignment
  tiltAngleDeg: 10,

  // --- FORWARD PITCH (X-axis rotation / Pitch) ---
  // Angle in degrees that the phone pitches forward toward the viewer
  // Positive value = top leans forward; 0 = perfectly upright
  forwardPitchDeg: -5,

  // --- SCALE (3D Phone size relative to viewport) ---
  scaleMobile: 0.23,   // Mobile screen scale (< 640px)
  scaleTablet: 0.23,   // Tablet screen scale (640px - 1024px)
  scaleDesktop: 0.30   // Desktop screen scale (> 1024px)
};

class Phone3DErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Phone3D Canvas error, rendering 2D fallback:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function Model({ scrollX = 0, scrollArc = 0, scrollRot = 0, scrollSpin = 0, scale = 0.30, isMobile = false }) {
  const { scene } = useGLTF('/iphone_16.glb');
  const texture = useTexture('/phone-screen.png');
  const groupRef = useRef();

  useEffect(() => {
    if (!scene || !texture) return;

    // Configure texture mapping for GLTF UV space
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = false; // UV Y=0 corresponds to top of phone
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1 / 0.4618, 1);
    texture.offset.set(-0.0181 / 0.4618, 0);
    texture.needsUpdate = true;

    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Object_3' || child.material?.name === '4130c6244c49c5d5712e') {
          const screenMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.1,
            metalness: 0.05,
            toneMapped: true
          });
          child.material = screenMat;
        } else {
          if (child.material) {
            child.material.envMapIntensity = 1.5;
          }
        }
      }
    });
  }, [scene, texture]);

  useFrame(() => {
    if (groupRef.current) {
      // Horizontal tracking with Y centered in open space between top title and bottom description
      const targetY = isMobile ? 0.20 : 0.0;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, scrollX, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);

      const curX = groupRef.current.position.x;
      const progressFactor = THREE.MathUtils.clamp(curX / 2.2, -1, 1);

      // 🌟 FACING ANGLE (Y-axis rotation): Configured by PHONE_POSE_CONFIG.facingAngleDeg
      const baseFacingY = progressFactor * THREE.MathUtils.degToRad(-PHONE_POSE_CONFIG.facingAngleDeg);
      const targetRotY = baseFacingY + scrollSpin;

      // 🌟 TILT ANGLE (Z-axis rotation): Configured by PHONE_POSE_CONFIG.tiltAngleDeg
      const targetRotZ = progressFactor * THREE.MathUtils.degToRad(-PHONE_POSE_CONFIG.tiltAngleDeg);

      // 🌟 FORWARD PITCH (X-axis rotation): Configured by PHONE_POSE_CONFIG.forwardPitchDeg
      const targetRotX = THREE.MathUtils.degToRad(PHONE_POSE_CONFIG.forwardPitchDeg);

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
    }
  });

  return (
    <group ref={groupRef} scale={scale} position={[2.2, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}

// Preload assets gracefully
try {
  useGLTF.preload('/iphone_16.glb');
  useTexture.preload('/phone-screen.png');
} catch (e) {
  console.warn('Preload warning:', e);
}

function Phone2DFallback() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '45%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(260px, 60vw)',
        aspectRatio: '372 / 736',
        borderRadius: '44px',
        background: '#0C0E10',
        padding: '8px',
        boxShadow: '0 40px 90px -30px rgba(12,14,16,.45)',
        zIndex: 4
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '36px',
          overflow: 'hidden',
          background: '#F4F1EC'
        }}
      >
        <img
          src="/phone-screen.png"
          alt="Phone Screen App Interface"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}

export default function Phone3D({ scrollX = 0, scrollArc = 0, scrollRot = 0, scrollSpin = 0 }) {
  const [responsiveScale, setResponsiveScale] = useState(PHONE_POSE_CONFIG.scaleDesktop);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setResponsiveScale(PHONE_POSE_CONFIG.scaleMobile);
        setIsMobile(true);
      } else if (w < 1024) {
        setResponsiveScale(PHONE_POSE_CONFIG.scaleTablet);
        setIsMobile(false);
      } else {
        setResponsiveScale(PHONE_POSE_CONFIG.scaleDesktop);
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Phone3DErrorBoundary fallback={<Phone2DFallback />}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 35 }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={2.0} />
          <directionalLight position={[10, 10, 10]} intensity={2.6} />
          <directionalLight position={[-10, -10, -5]} intensity={0.8} />
          <pointLight position={[0, 5, 5]} intensity={1.5} color="#00D4C8" />

          <Suspense fallback={null}>
            <Model
              scrollX={scrollX}
              scrollArc={scrollArc}
              scrollRot={scrollRot}
              scrollSpin={scrollSpin}
              scale={responsiveScale}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>
      </div>
    </Phone3DErrorBoundary>
  );
}
