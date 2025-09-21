// Prism.js - WebGL spotlight prism background effect using OGL
// Provides a subtle animated spectral light backdrop behind the ProfileCard.
// Props:
//  - mode: 'rotate' | 'hover' | '3drotate' (determines interaction/animation style)
//  - animate: boolean (toggle animation loop)
//  - suspendWhenOffscreen: boolean (pause animation when not in viewport)
//  - className: optional extra CSS classes for container
//
// Implementation notes:
//  - Uses OGL for lightweight WebGL rendering.
//  - Fragment shader performs a spectral gradient distorted by noise and rotation.
//  - Pointer position influences rotation in 'hover' mode.
//  - Cleanly disposes GL resources on unmount.
//  - Resize observer adjusts resolution uniform & canvas size.
//  - Offscreen suspension uses an IntersectionObserver.

import React, { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';

const vertex = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}`;

const fragment = `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform float uPrismAngle;
uniform float uRotationSpeed;
uniform vec2 uMouse;
varying vec2 vUv;

// Simple hash noise
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec3 spectrum(float n) {
  return clamp(vec3(
    sin(3.1415 * n),
    sin(3.1415 * (n + 0.33)),
    sin(3.1415 * (n + 0.66))
  ), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  vec2 centered = uv - 0.5;

  float angle = uPrismAngle + uRotationSpeed * uTime * 0.05;

  // Mouse parallax influence (hover mode)
  angle += (uMouse.x - 0.5) * 0.4;

  float s = sin(angle);
  float c = cos(angle);
  mat2 rot = mat2(c, -s, s, c);
  centered = rot * centered;

  float dist = length(centered);
  float glow = smoothstep(0.5, 0.0, dist);

  float bands = dist * 4.0 + noise(centered * 3.0 + uTime * 0.1);
  vec3 col = spectrum(bands);

  col *= glow;
  col += pow(glow, 8.0) * 0.65;

  // Subtle vignette
  float vignette = smoothstep(0.95, 0.4, dist);
  col *= vignette;

  gl_FragColor = vec4(col, glow * 0.85);
}`;

const Prism = ({ mode = 'rotate', animate = true, suspendWhenOffscreen = true, className = '' }) => {
  const containerRef = useRef(null);
  const glRef = useRef(null);
  const meshRef = useRef(null);
  const frameRef = useRef(0);
  const startTimeRef = useRef(performance.now());
  const uniformsRef = useRef(null);
  const isVisibleRef = useRef(true);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
    const gl = renderer.gl;
    glRef.current = gl;
    gl.clearColor(0, 0, 0, 0);

    const canvas = gl.canvas;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.pointerEvents = 'none'; // allow interactions to pass through
    el.appendChild(canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [el.clientWidth, el.clientHeight] },
        uPrismAngle: { value: 0 },
        uRotationSpeed: { value: mode === 'rotate' ? 1 : 0 },
        uMouse: { value: [0.5, 0.5] }
      }
    });

    uniformsRef.current = program.uniforms;

    const geometry = new Triangle(gl);
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const handleResize = () => {
      if (!el || !gl) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      if (uniformsRef.current) {
        uniformsRef.current.uResolution.value = [w, h];
      }
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(el);

    let intersectionObserver;
    if (suspendWhenOffscreen && 'IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          isVisibleRef.current = entry.isIntersecting;
          if (isVisibleRef.current && animate) {
            // restart timestamp to avoid jump
            startTimeRef.current = performance.now();
            loop();
          }
        });
      }, { threshold: 0.01 });
      intersectionObserver.observe(el);
    }

    const onPointerMove = e => {
      if (mode === 'hover' || mode === '3drotate') {
        const rect = el.getBoundingClientRect();
        mouseRef.current.x = (e.clientX - rect.left) / rect.width;
        mouseRef.current.y = (e.clientY - rect.top) / rect.height;
      }
    };
    window.addEventListener('pointermove', onPointerMove);

    const loop = () => {
      if (!animate) return;
      if (suspendWhenOffscreen && !isVisibleRef.current) return;
      const now = performance.now();
      const t = (now - startTimeRef.current) / 1000;
      if (uniformsRef.current) {
        const u = uniformsRef.current;
        u.uTime.value = t;
        if (mode === 'rotate') {
          u.uPrismAngle.value = t * 0.4;
        } else if (mode === '3drotate') {
          // combine auto rotation + mouse offset
            u.uPrismAngle.value = t * 0.25 + (mouseRef.current.x - 0.5) * 1.2;
        } else if (mode === 'hover') {
          u.uPrismAngle.value = (mouseRef.current.x - 0.5) * 1.5;
        }
        u.uMouse.value = [mouseRef.current.x, mouseRef.current.y];
      }
      renderer.render({ scene: meshRef.current });
      frameRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('pointermove', onPointerMove);
      resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      // OGL cleans up when context lost; manual disposal minimal
    };
  }, [mode, animate, suspendWhenOffscreen]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};

export default Prism;
