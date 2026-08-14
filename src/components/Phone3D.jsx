import React, { useRef, useEffect, Component, Suspense } from 'react';
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

function Model({ scrollX = 0, scrollArc = 0, scrollRot = 0 }) {
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
            child.material.envMapIntensity = 1.4;
          }
        }
      }
    });
  }, [scene, texture]);

  useFrame(() => {
    if (groupRef.current) {
      // Lerp position tracking
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, scrollX, 0.1);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, scrollArc, 0.1);

      // Match Screenshot 1 baseline tilt pose (-30deg Y, 12deg X, 14deg Z) + dynamic scroll rotation
      const targetRotY = THREE.MathUtils.degToRad(-30) + THREE.MathUtils.degToRad(-scrollRot * 0.8);
      const targetRotX = THREE.MathUtils.degToRad(12);
      const targetRotZ = THREE.MathUtils.degToRad(14) + THREE.MathUtils.degToRad(scrollRot * 0.5);

      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1);
      groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotZ, 0.1);
    }
  });

  return (
    <group ref={groupRef} scale={0.17} position={[1.8, 0, 0]}>
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
        width: 'min(360px, 25vw)',
        aspectRatio: '372 / 736',
        borderRadius: '54px',
        background: '#0C0E10',
        padding: '10px',
        boxShadow: '0 60px 120px -40px rgba(12,14,16,.45), 0 8px 26px -10px rgba(12,14,16,.25)',
        zIndex: 4
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: '45px',
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

export default function Phone3D({ scrollX = 0, scrollArc = 0, scrollRot = 0 }) {
  return (
    <Phone3DErrorBoundary fallback={<Phone2DFallback />}>
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <Canvas
          camera={{ position: [0, 0, 10], fov: 35 }}
          style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[10, 10, 10]} intensity={2.4} />
          <directionalLight position={[-10, -10, -5]} intensity={0.8} />
          <pointLight position={[0, 5, 5]} intensity={1.5} color="#00D4C8" />

          <Suspense fallback={null}>
            <Model scrollX={scrollX} scrollArc={scrollArc} scrollRot={scrollRot} />
          </Suspense>
        </Canvas>
      </div>
    </Phone3DErrorBoundary>
  );
}
