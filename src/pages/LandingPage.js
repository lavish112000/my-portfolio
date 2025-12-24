import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const LandingPage = ({ hellos, onComplete }) => {
  const mountRef = useRef(null);
  const [currentHello, setCurrentHello] = useState(hellos[0]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    if (!renderer || typeof renderer.setSize !== 'function' || typeof renderer.render !== 'function') {
      return undefined;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (typeof renderer.setClearColor === 'function') {
      renderer.setClearColor(0x000000, 0);
    }
    currentMount.appendChild(renderer.domElement);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    let index = 0;
    const intervalId = setInterval(() => {
      index = (index + 1) % hellos.length;
      setCurrentHello(hellos[index]);
    }, 200);

    const timerId = setTimeout(() => {
      clearInterval(intervalId);
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }, 2500);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      clearInterval(intervalId);
      clearTimeout(timerId);
      window.removeEventListener('resize', handleResize);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [hellos, onComplete]);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #2E3192, #00FFE9)',
        minHeight: '100vh',
        width: '100vw'
      }}
    >
      <div ref={mountRef} className="absolute inset-0 z-0" style={{ pointerEvents: 'none' }}></div>

      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out p-4 z-10 ${
          isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div
          key={currentHello}
          className="text-white font-bold text-center break-words"
          style={{
            fontSize: 'clamp(2.5rem, 10vw, 10.5rem)',
            textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.3)',
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          {currentHello}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
