import React, { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  RoundedBox,
  shaderMaterial,
} from "@react-three/drei";
import * as THREE from "three";

// Custom wave shader material
const WaveShaderMaterial = shaderMaterial(
  { time: 0 },
  `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z += sin(pos.x * 10.0 + time * 2.0) * 0.06;
    pos.z += cos(pos.y * 15.0 + time * 1.5) * 0.06;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  void main() {
    float wave = 0.5 + 0.5 * sin(vUv.x * 20.0) * cos(vUv.y * 20.0);
    vec3 color = mix(vec3(0.0, 0.4, 0.6), vec3(0.0, 0.7, 1.0), wave);
    gl_FragColor = vec4(color, 0.85);
  }
  `
);

extend({ WaveShaderMaterial });

function WaterSurface() {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[6, 0, 0]}>
      <planeGeometry args={[30, 15, 64, 64]} />
      <waveShaderMaterial ref={ref} />
    </mesh>
  );
}

function Ship() {
  return (
    <group position={[6, 0.5, 0]}>
      {/* Hull */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 1, 1.5]} />
        <meshStandardMaterial color="#8B4513" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Bow */}
      <mesh position={[2.1, 0, 0]}>
        <cylinderGeometry args={[0, 0.75, 1.5, 12, 1]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Cabin */}
      <RoundedBox
        args={[1.5, 0.8, 1]}
        radius={0.1}
        smoothness={4}
        position={[-0.5, 0.9, 0]}
      >
        <meshStandardMaterial color="#f0f0f0" />
      </RoundedBox>

      {/* Windows */}
      {[[-0.9, 0.9, 0.51], [-0.5, 0.9, 0.51], [-0.1, 0.9, 0.51]].map((pos, i) => (
        <mesh position={pos} key={i}>
          <planeGeometry args={[0.2, 0.2]} />
          <meshStandardMaterial color="#00ccee" emissive="#003344" />
        </mesh>
      ))}

      {/* Chimney */}
      <mesh position={[-0.5, 1.5, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.6, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Chimney Glow */}
      <mesh position={[-0.5, 1.8, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#ff4444"
          emissive="#ff0000"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Mast */}
      <mesh position={[1.5, 1.2, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
        <meshStandardMaterial color="#444" />
      </mesh>

      {/* Flag */}
      <mesh position={[1.5, 2.2, 0]}>
        <planeGeometry args={[0.4, 0.3]} />
        <meshStandardMaterial color="#e63946" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function PackageBox({ length, width, height, color, position }) {
  return (
    <RoundedBox
      args={[length, height, width]}
      radius={0.05}
      smoothness={4}
      position={position}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial color={color || `hsl(${Math.random() * 360}, 60%, 60%)`} />
    </RoundedBox>
  );
}

function ContainerBox({ length, width, height }) {
  return (
    <group>
      {/* Floor */}
      <mesh position={[length / 2, 0.01, width / 2]}>
        <boxGeometry args={[length, 0.02, width]} />
        <meshStandardMaterial color="#bbb" />
      </mesh>

      {/* Walls */}
      <mesh position={[length / 2, height / 2, 0]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial
          color="#ccc"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[length / 2, height / 2, width]}>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial
          color="#ccc"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, height / 2, width / 2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#ccc"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[length, height / 2, width / 2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#ccc"
          transparent
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[length / 2, height, width / 2]}>
        <planeGeometry args={[length, width]} />
        <meshStandardMaterial
          color="#eee"
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

function AnimatedScene({ packageList = [], containerType = "20' GP" }) {
  const groupRef = useRef();

  const containerDimensions = {
    "20' GP": { length: 6.06, width: 2.44, height: 2.59 },
    "40' GP": { length: 12.19, width: 2.44, height: 2.59 },
    "40' HC": { length: 12.19, width: 2.44, height: 2.90 },
  };
  const { length: cLength, width: cWidth, height: cHeight } =
    containerDimensions[containerType] || containerDimensions["20' GP"];

  // Auto-rotate container group
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  // Simple bin-packing layout
  let x = 0,
    y = 0,
    z = 0;
  let rowHeight = 0,
    maxRowDepth = 0;
  const positions = [];

  for (let pkg of packageList) {
    const pl = Math.min(pkg.length, cLength);
    const pw = Math.min(pkg.width, cWidth);
    const ph = Math.min(pkg.height, cHeight);

    if (x + pl > cLength) {
      x = 0;
      z += maxRowDepth;
      maxRowDepth = 0;
      if (z + pw > cWidth) {
        z = 0;
        y += rowHeight;
        rowHeight = 0;
      }
    }

    positions.push([x + pl / 2, y + ph / 2, z + pw / 2]);

    x += pl;
    maxRowDepth = Math.max(maxRowDepth, pw);
    rowHeight = Math.max(rowHeight, ph);
  }

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 7]} intensity={1} castShadow />
      <group ref={groupRef}>
        <ContainerBox length={cLength} width={cWidth} height={cHeight} />
        {packageList.map((pkg, i) => (
          <PackageBox
            key={i}
            length={pkg.length}
            width={pkg.width}
            height={pkg.height}
            color={pkg.color}
            position={positions[i]}
          />
        ))}
        <Ship />
        <WaterSurface />
      </group>
      <OrbitControls />
      <Environment preset="sunset" />
    </>
  );
}

export default function Container3DView({ packageList, containerType }) {
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <Canvas shadows camera={{ position: [10, 10, 15], fov: 40 }}>
        <AnimatedScene packageList={packageList} containerType={containerType} />
      </Canvas>
    </div>
  );
}
