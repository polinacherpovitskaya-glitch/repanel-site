"use client";

// Клиентский 3D-просмотр модели: аксонометрия (ортокамера) + терраццо-текстура свотча
// box-проекцией. Модели — чистая геометрия (OBJ, Z-вверх, без нормалей/UV):
// ставим «на ноги», считаем нормали, назначаем UV, центрируем по вертикали.

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, useGLTF, useTexture } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { PALETTE_12 } from "@/data/solutionObjects";

const TILES = 2.4; // повторов терраццо-свотча по наибольшему размеру предмета

/** UV по box-проекции: доминантная ось нормали треугольника. */
function applyBoxUV(geo: THREE.BufferGeometry, scale: number): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const pos = g.attributes.position;
  const uv = new Float32Array(pos.count * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();
  for (let i = 0; i < pos.count; i += 3) {
    a.fromBufferAttribute(pos, i);
    b.fromBufferAttribute(pos, i + 1);
    c.fromBufferAttribute(pos, i + 2);
    ab.subVectors(b, a); ac.subVectors(c, a); n.crossVectors(ab, ac);
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    for (let j = 0; j < 3; j++) {
      const v = j === 0 ? a : j === 1 ? b : c;
      let u: number, w: number;
      if (ax >= ay && ax >= az) { u = v.z; w = v.y; }
      else if (ay >= ax && ay >= az) { u = v.x; w = v.z; }
      else { u = v.x; w = v.y; }
      uv[(i + j) * 2] = u * scale;
      uv[(i + j) * 2 + 1] = w * scale;
    }
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

function Model({ url, colorIndex, customHex, spin = false, scale = 1 }: { url: string; colorIndex: number; customHex: string; spin?: boolean; scale?: number }) {
  const { scene } = useGLTF(url);
  const textures = useTexture(PALETTE_12.map((c) => c.img));

  useMemo(() => {
    textures.forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
    });
  }, [textures]);

  const { obj, meshes, baseY } = useMemo(() => {
    const model = scene.clone(true);
    model.rotation.x = -Math.PI / 2; // OBJ Z-вверх → three Y-вверх
    const root = new THREE.Group();
    root.add(model);
    root.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const uvScale = TILES / maxDim;
    const meshes: THREE.Mesh[] = [];
    model.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.geometry = applyBoxUV(o.geometry.clone(), uvScale);
        o.geometry.computeVertexNormals();
        o.material = new THREE.MeshStandardMaterial({ roughness: 0.82, metalness: 0.02 });
        o.castShadow = true;
        meshes.push(o);
      }
    });
    // нормализация размера (×индивидуальный scale) + центрирование по всем осям
    root.scale.setScalar(scale / maxDim);
    root.updateMatrixWorld(true);
    const b = new THREE.Box3().setFromObject(root);
    const c = new THREE.Vector3();
    b.getCenter(c);
    root.position.sub(c);
    root.updateMatrixWorld(true);
    const b2 = new THREE.Box3().setFromObject(root);
    return { obj: root, meshes, baseY: b2.min.y };
  }, [scene, scale]);

  useEffect(() => {
    const swatch = colorIndex >= 0 ? PALETTE_12[colorIndex] : null;
    const tex = swatch ? textures[colorIndex] : null;
    const translucent = !!swatch?.translucent;
    for (const m of meshes) {
      const mat = m.material as THREE.MeshStandardMaterial;
      if (tex) {
        mat.map = tex;
        mat.color.set("#ffffff");
      } else {
        mat.map = null;
        mat.color.set(customHex);
      }
      mat.transparent = translucent;
      mat.opacity = translucent ? 0.72 : 1;
      mat.needsUpdate = true;
    }
  }, [meshes, textures, colorIndex, customHex]);

  useFrame((_, dt) => {
    if (spin) obj.rotation.y += dt * 0.55;
  });

  return (
    <>
      <primitive object={obj} />
      <ContactShadows position={[0, baseY, 0]} opacity={0.36} scale={2.6} blur={2.8} far={1} resolution={512} />
    </>
  );
}

export default function Model3D({
  url,
  colorIndex,
  customHex,
  interactive = true,
  autoRotate = true,
  frameloop = "always",
  scale = 1,
}: {
  url: string;
  colorIndex: number;
  customHex: string;
  interactive?: boolean;
  autoRotate?: boolean;
  frameloop?: "always" | "demand";
  scale?: number;
}) {
  const [interacted, setInteracted] = useState(false);
  return (
    <Canvas
      orthographic
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ position: [4, 3.1, 4.4], zoom: 235, near: -50, far: 100 }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#EAEAE7"]} />
      <ambientLight intensity={0.6} />
      <hemisphereLight intensity={0.5} color="#ffffff" groundColor="#c8c8c8" />
      <directionalLight position={[5, 8, 4]} intensity={1.5} />
      <directionalLight position={[-4, 3, -3]} intensity={0.3} />
      <Suspense fallback={null}>
        <Model url={url} colorIndex={colorIndex} customHex={customHex} spin={!interactive && autoRotate} scale={scale} />
      </Suspense>
      {interactive && (
        <OrbitControls
          enablePan={false}
          enableZoom
          zoomToCursor
          minZoom={120}
          maxZoom={760}
          minPolarAngle={0.4}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate={autoRotate && !interacted}
          autoRotateSpeed={0.8}
          onStart={() => setInteracted(true)}
          target={[0, 0, 0]}
        />
      )}
    </Canvas>
  );
}
