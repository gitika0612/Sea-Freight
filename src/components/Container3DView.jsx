import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

function ShipHull() {
  const shape = new THREE.Shape();
  shape.moveTo(-4, 0);
  shape.lineTo(-3.5, 0.5);  // Curve the bow
  shape.lineTo(3.5, 0.5);
  shape.lineTo(4, 0);
  shape.lineTo(3.5, -0.5); // Curve the stern
  shape.lineTo(-3.5, -0.5);
  shape.lineTo(-4, 0);

  const extrudeSettings = {
    steps: 1,
    depth: 3,
    bevelEnabled: false,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.rotateX(-Math.PI / 2);
  geometry.translate(0, 0.5, -1.5); // Position hull base

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color="#1c1c1c" />
    </mesh>
  );
}


function StylizedShip({ packageList }) {
  const containerColors = ["#e63946", "#f1fa8c", "#a8dadc", "#457b9d", "#ff6b6b"];

  const totalPackages = packageList.reduce((sum, pkg) => sum + parseInt(pkg.noOfPackages || 0), 0);

  const boxes = [];

  // Layout config
  const itemsPerRow = 6; // X-axis (columns)
  const itemsPerColumn = 3; // Y-axis (stack height)
  const spacingX = 1;
  const spacingY = 0.7;
  const spacingZ = 0.7;

  for (let i = 0; i < totalPackages; i++) {
    const layer = Math.floor(i / (itemsPerRow * itemsPerColumn)); // Z-axis (rows)
    const indexInLayer = i % (itemsPerRow * itemsPerColumn);
    const col = indexInLayer % itemsPerRow; // X-axis
    const row = Math.floor(indexInLayer / itemsPerRow); // Y-axis stack

    boxes.push(
      <RoundedBox
        key={`box-${i}`}
        args={[0.9, 0.6, 0.6]}
        position={[
          -col * spacingX + 1,
          1 + row * spacingY,
          -layer * spacingZ
        ]}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial color={containerColors[i % containerColors.length]} />
      </RoundedBox>
    );
  }

  return (
    <group position={[0, 0.5, 0]}>
      {/* Ship Base */}
      <mesh position={[-1, 0, -1]}>
        <boxGeometry args={[8, 1, 3]} />
        <meshStandardMaterial color="#1c1c1c" />
      </mesh>

      {/* Bridge */}
      <mesh position={[2.5, 1.5, 0]}>
        <boxGeometry args={[1.5, 1, 1.5]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Chimneys */}
      <mesh position={[2.2, 2.1, -0.4]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[2.8, 2.1, -0.4]}>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Dynamic containers */}
      {boxes}
    </group>
  );
}


function FlatOcean() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#00ccee" />
    </mesh>
  );
}

function AnimatedScene({ packageList }) {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <group ref={groupRef}>
        <FlatOcean />
        <StylizedShip packageList={packageList} />
      </group>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 3} />
    </>
  );
}

export default function ContainerShipView({ packageList }) {
  return (
    <div className="container-3d-wrapper" style={{ height: "100vh", background: "#00ccee" }}>
      <Canvas shadows orthographic camera={{ zoom: 40, position: [10, 10, 10] }}>
        <AnimatedScene packageList={packageList} />
      </Canvas>
    </div>
  );
}

