import React, { useRef, useEffect, useState, Component, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

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

function Model({ scrollX = 0, scrollArc = 0, scrollRot = 0, scrollSpin = 0, scale = 0.30 }) {
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
      // Pure horizontal position tracking (Y fixed at 0 - no vertical lifting up/down)
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, scrollX, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, 0, 0.1);

      const curX = groupRef.current.position.x;
      const progressFactor = THREE.MathUtils.clamp(curX / 2.2, -1, 1);

      // Baseline inward facing angle + 360 degree spin during travel
      const baseFacingY = progressFactor * THREE.MathUtils.degToRad(-26);
      const targetRotY = baseFacingY + scrollSpin;

      // Dynamic Z tilt matching side position (-12deg when on right, +12deg when on left)
      const targetRotZ = progressFactor * THREE.MathUtils.degToRad(-12);

      // Upright forward pitch
      const targetRotX = THREE.MathUtils.degToRad(3);

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
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(280px, 60vw)',
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
  const [responsiveScale, setResponsiveScale] = useState(0.30);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) {
        setResponsiveScale(0.15);
      } else if (w < 1024) {
        setResponsiveScale(0.22);
      } else {
        setResponsiveScale(0.30);
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
            />
          </Suspense>
        </Canvas>
      </div>
    </Phone3DErrorBoundary>
  );
}
