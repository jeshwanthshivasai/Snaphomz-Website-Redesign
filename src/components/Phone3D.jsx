import React, { useRef, useEffect, useState, Component, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * =========================================================================
 * 3D IPHONE POSE & ROTATION CONFIGURATION (DEVICE-SPECIFIC SETTINGS)
 * Tweak each device section independently! Changes to mobile won't touch desktop/tablet.
 * =========================================================================
 */
export const PHONE_POSE_CONFIG = {
  // --- MOBILE CONFIGURATION (< 640px) ---
  mobile: {
    facingAngleDeg: 100,  // Y-axis rotation / Yaw (Mobile facing angle)
    tiltAngleDeg: 10,     // Z-axis rotation / Roll (Mobile tilt angle)
    forwardPitchDeg: -5,  // X-axis rotation / Pitch (Mobile forward pitch)
    scale: 0.23           // 3D Phone scale on mobile
  },

  // --- TABLET CONFIGURATION (640px - 1024px) ---
  tablet: {
    facingAngleDeg: 26,   // Y-axis rotation / Yaw for tablet
    tiltAngleDeg: 10,     // Z-axis rotation / Roll for tablet
    forwardPitchDeg: -5,   // X-axis rotation / Pitch for tablet
    scale: 0.23           // 3D Phone scale on tablet
  },

  // --- DESKTOP CONFIGURATION (> 1024px) ---
  desktop: {
    facingAngleDeg: 30,   // Y-axis rotation / Yaw for desktop
    tiltAngleDeg: 10,     // Z-axis rotation / Roll for desktop
    forwardPitchDeg: -5,   // X-axis rotation / Pitch for desktop
    scale: 0.30           // 3D Phone scale on desktop
  }
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

function Model({ scrollX = 0, scrollArc = 0, scrollRot = 0, scrollSpin = 0, poseConfig = PHONE_POSE_CONFIG.desktop, isMobile = false }) {
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

      // Device-specific facing angle (Y-axis rotation)
      const baseFacingY = progressFactor * THREE.MathUtils.degToRad(-poseConfig.facingAngleDeg);
      const targetRotY = baseFacingY + scrollSpin;

      // Device-specific tilt angle (Z-axis rotation)
      const targetRotZ = progressFactor * THREE.MathUtils.degToRad(-poseConfig.tiltAngleDeg);

      // Device-specific forward pitch (X-axis rotation)
      const targetRotX = THREE.MathUtils.degToRad(poseConfig.forwardPitchDeg);

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
    }
  });

  return (
    <group ref={groupRef} scale={poseConfig.scale} position={[2.2, 0, 0]}>
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
  const [devicePose, setDevicePose] = useState(PHONE_POSE_CONFIG.desktop);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setDevicePose(PHONE_POSE_CONFIG.mobile);
        setIsMobile(true);
      } else if (w < 1024) {
        setDevicePose(PHONE_POSE_CONFIG.tablet);
        setIsMobile(false);
      } else {
        setDevicePose(PHONE_POSE_CONFIG.desktop);
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
              poseConfig={devicePose}
              isMobile={isMobile}
            />
          </Suspense>
        </Canvas>
      </div>
    </Phone3DErrorBoundary>
  );
}
