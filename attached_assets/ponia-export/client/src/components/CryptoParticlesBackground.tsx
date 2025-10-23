import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function CryptoParticlesBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGLRenderer | null = null;
    
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 5;

      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      
      if (!renderer) {
        console.warn('WebGL not available, skipping particle background');
        return;
      }
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      containerRef.current.appendChild(renderer.domElement);

    // Créer texture circulaire pour les particules
    const createCircleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      // Dégradé radial pour effet de glow
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 215, 63, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 215, 63, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 215, 63, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    // Créer les particules
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ));
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xFFD73F,
      size: 0.08,
      map: createCircleTexture(),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      // Animation
      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);

        const positions = geometry.attributes.position.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i].x;
          positions[i * 3 + 1] += velocities[i].y;
          positions[i * 3 + 2] += velocities[i].z;

          if (Math.abs(positions[i * 3]) > 15) velocities[i].x *= -1;
          if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i].y *= -1;
          if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i].z *= -1;
        }

        geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.0005;

        if (renderer) renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        if (renderer) renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationId);
        if (renderer) {
          renderer.dispose();
          geometry.dispose();
          material.dispose();
          if (containerRef.current && renderer.domElement.parentNode) {
            containerRef.current.removeChild(renderer.domElement);
          }
        }
      };
    } catch (error) {
      console.warn('Failed to initialize WebGL particle background:', error);
      return;
    }
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.4 }}
    />
  );
}
