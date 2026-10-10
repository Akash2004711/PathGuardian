import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Sparkles, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface PotholeMarkerProps {
  position: [number, number, number];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  label: string;
}

const PotholeMarker: React.FC<PotholeMarkerProps> = ({ position, severity, label }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const color = severity === 'CRITICAL' || severity === 'HIGH' ? '#EF4444' : severity === 'MEDIUM' ? '#F59E0B' : '#10B981';

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 1.5;
    }
  });

  return (
    <group position={position}>
      {/* Hazard Glowing Core */}
      <mesh ref={meshRef} position={[0, 0.5, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} wireframe />
      </mesh>
      
      {/* Ground Pulse Ring */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.7, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* Floating 3D Text Label */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 1.3, 0]}
          fontSize={0.28}
          color={color}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </Float>
    </group>
  );
};

const AnimatedVehicle: React.FC = () => {
  const carRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (carRef.current) {
      // Move vehicle along z-axis (-15 to +15)
      const t = (clock.getElapsedTime() * 4) % 30;
      carRef.current.position.z = -15 + t;
    }
  });

  return (
    <group ref={carRef} position={[1.5, 0.35, 0]}>
      {/* Car Chassis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.6, 2.4]} />
        <meshStandardMaterial color="#00F0FF" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Headlight Beams */}
      <spotLight position={[0, 0.2, 1.2]} angle={0.6} penumbra={0.5} intensity={5} color="#00F0FF" target-position={[0, 0, 5]} />
    </group>
  );
};

const ScanningBeam: React.FC = () => {
  const beamRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (beamRef.current) {
      const t = (clock.getElapsedTime() * 5) % 30;
      beamRef.current.position.z = -15 + t;
    }
  });

  return (
    <mesh ref={beamRef} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[12, 0.2]} />
      <meshBasicMaterial color="#00F0FF" transparent opacity={0.8} side={THREE.DoubleSide} />
    </mesh>
  );
};

const RoadSurface: React.FC = () => {
  return (
    <group>
      {/* Asphalt Road Plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 40]} />
        <meshStandardMaterial color="#1E293B" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Lane Center Dashed Lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[0, 0.01, -18 + i * 4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 2.0]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>
      ))}

      {/* Road Curbs / Side Lines */}
      <mesh position={[-5.8, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 40]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
      <mesh position={[5.8, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.15, 40]} />
        <meshBasicMaterial color="#00F0FF" />
      </mesh>
    </group>
  );
};

export const Road3DScene: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[450px] relative rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[8, 7, 12]} fov={50} />
        <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2.1} minDistance={5} maxDistance={25} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} castShadow />
        <pointLight position={[-5, 5, -5]} color="#00F0FF" intensity={3} />
        <pointLight position={[5, 5, 5]} color="#EF4444" intensity={2} />

        {/* 3D Elements */}
        <RoadSurface />
        <ScanningBeam />
        <AnimatedVehicle />
        
        {/* Simulated Potholes in 3D */}
        <PotholeMarker position={[-2.5, 0, -6]} severity="CRITICAL" label="HAZARD #1 (CRITICAL)" />
        <PotholeMarker position={[1.8, 0, 2]} severity="HIGH" label="HAZARD #2 (HIGH)" />
        <PotholeMarker position={[-1.2, 0, 8]} severity="MEDIUM" label="HAZARD #3 (MEDIUM)" />

        {/* Cyber Particles */}
        <Sparkles count={80} scale={[15, 10, 30]} size={2} speed={0.4} color="#00F0FF" />
      </Canvas>

      {/* Overlay Badge */}
      <div className="absolute top-4 left-4 glass-panel px-4 py-2 rounded-xl border border-cyan-500/30 flex items-center space-x-2">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-glow animate-ping" />
        <span className="text-xs font-mono text-cyan-glow uppercase tracking-wider font-semibold">
          Interactive 3D Road Telemetry • R3F Real-Time Engine
        </span>
      </div>
    </div>
  );
};
