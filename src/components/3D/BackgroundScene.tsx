import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { ParticleField, AnimatedSphere } from './ThreeComponents';

export function BackgroundScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#667eea" />
          
          <Stars 
            radius={100} 
            depth={50} 
            count={5000} 
            factor={4} 
            saturation={0} 
            fade 
            speed={1}
          />
          
          <ParticleField />
          
          <AnimatedSphere position={[-3, 2, -5]} color="#667eea" size={0.3} />
          <AnimatedSphere position={[3, -2, -5]} color="#764ba2" size={0.4} />
          <AnimatedSphere position={[0, 3, -8]} color="#10b981" size={0.25} />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
