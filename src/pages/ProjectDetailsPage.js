import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import RollingGallery from '../components/RollingGallery';
import { ALL_SKILLS } from '../constants/skillsCatalog';

const PARTICLE_COUNT = 14;

const PROJECT_DETAILS_STYLES = `
  .pd-panel {
    position: relative;
    --glow-color-rgb: 132,0,255;
    --glow-alpha: 0;
    transition: box-shadow .35s ease, transform .3s ease;
    will-change: transform, box-shadow;
    transform-style: preserve-3d;
    perspective: 1200px;
  }
  .pd-panel::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: inherit;
    background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(var(--glow-color-rgb),0.35) 0%, rgba(var(--glow-color-rgb),0.15) 35%, transparent 70%);
    opacity: var(--glow-alpha);
    transition: opacity .3s ease;
    mix-blend-mode: screen;
  }
  .pd-particle {
    position:absolute;
    width:6px;height:6px;
    background:rgba(var(--glow-color-rgb),0.9);
    border-radius:50%;
    box-shadow:0 0 8px rgba(var(--glow-color-rgb),0.8);
    opacity:0;
  }
`;

const setPanelPointerVars = (panel, rect, x, y) => {
  panel.style.setProperty('--mx', (x / rect.width) * 100 + '%');
  panel.style.setProperty('--my', (y / rect.height) * 100 + '%');
  panel.style.setProperty('--glow-alpha', '1');
};

const animatePanelHover = (panel, rect, x, y) => {
  const rx = (y / rect.height - 0.5) * -18;
  const ry = (x / rect.width - 0.5) * 18;
  setPanelPointerVars(panel, rect, x, y);
  gsap.to(panel, { rotateX: rx, rotateY: ry, duration: 0.35, ease: 'power2.out' });
  gsap.to(panel, {
    boxShadow: '0 15px 35px -6px rgba(132,0,255,0.35), 0 0 55px -6px rgba(132,0,255,0.55)',
    duration: 0.45,
    ease: 'power2.out'
  });
};

const resetPanelHover = (panel) => {
  panel.style.setProperty('--glow-alpha', '0');
  gsap.to(panel, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power3.out' });
  gsap.to(panel, { boxShadow: '0 4px 12px rgba(0,0,0,0.4)', duration: 0.6, ease: 'power3.out' });
};

const createRipple = (panel, rect, x, y) => {
  const ripple = document.createElement('div');
  const maxDist = Math.max(
    Math.hypot(x, y),
    Math.hypot(rect.width - x, y),
    Math.hypot(x, rect.height - y),
    Math.hypot(rect.width - x, rect.height - y)
  );

  ripple.style.cssText = `position:absolute;left:${x - maxDist}px;top:${y - maxDist}px;width:${
    maxDist * 2
  }px;height:${maxDist * 2}px;border-radius:50%;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle, rgba(132,0,255,0.55) 0%, rgba(132,0,255,0.25) 35%, transparent 70%);opacity:0.85;`;
  panel.appendChild(ripple);

  gsap.fromTo(
    ripple,
    { scale: 0, opacity: 0.85 },
    { scale: 1, opacity: 0, duration: 0.9, ease: 'power3.out', onComplete: () => ripple.remove() }
  );
  gsap.fromTo(panel, { scale: 1 }, { scale: 1.035, duration: 0.18, ease: 'power2.out', yoyo: true, repeat: 1 });
  gsap.fromTo(panel, { '--glow-alpha': 1 }, { '--glow-alpha': 0.4, duration: 0.6, ease: 'sine.out' });
};

const startParticleDrift = (particleEl) => {
  const drift = () => {
    gsap.to(particleEl, {
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      duration: 6 + Math.random() * 6,
      ease: 'sine.inOut',
      onComplete: drift
    });
    gsap.to(particleEl, {
      opacity: 0.3 + Math.random() * 0.7,
      duration: 3 + Math.random() * 3,
      ease: 'sine.inOut'
    });
  };

  drift();
};

const createParticleLayer = (panel, particleCount) => {
  const layer = document.createElement('div');
  layer.style.position = 'absolute';
  layer.style.inset = '0';
  layer.style.overflow = 'hidden';
  layer.style.pointerEvents = 'none';
  layer.style.zIndex = '0';
  panel.appendChild(layer);

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    p.className = 'pd-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    layer.appendChild(p);
    gsap.to(p, { duration: 0.6, opacity: 1, delay: Math.random() * 1 });
    startParticleDrift(p);
  }

  return layer;
};

const setupPanelInteractivity = (panel) => {
  const handleMove = (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    animatePanelHover(panel, rect, x, y);
  };

  const handleLeave = () => {
    resetPanelHover(panel);
  };

  const handleClick = (e) => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createRipple(panel, rect, x, y);
  };

  panel.addEventListener('mousemove', handleMove);
  panel.addEventListener('mouseleave', handleLeave);
  panel.addEventListener('click', handleClick);

  return () => {
    panel.removeEventListener('mousemove', handleMove);
    panel.removeEventListener('mouseleave', handleLeave);
    panel.removeEventListener('click', handleClick);
  };
};

const ProjectDetailsPage = ({ project, onBack }) => {
  const panelRefs = useRef([]);
  const particleLayers = useRef([]);

  useEffect(() => {
    const panels = panelRefs.current.filter(Boolean);
    if (!panels.length) return undefined;

    const cleanups = panels.map((panel) => {
      particleLayers.current.push(createParticleLayer(panel, PARTICLE_COUNT));
      return setupPanelInteractivity(panel);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup && cleanup());
      particleLayers.current.forEach((layer) => layer && layer.remove());
      particleLayers.current = [];
    };
  }, []);

  const allSkills = ALL_SKILLS;

  return (
    <div className="w-screen h-[100dvh] text-white font-sans overflow-auto bg-gradient-to-b from-[#2E3192] to-[#00FFE9] p-4 md:p-10">
      <div className="container mx-auto max-w-7xl">
        <button
          onClick={onBack}
          className="text-white text-lg md:text-xl font-bold hover:text-blue-400 transition-colors duration-200 mb-6 md:mb-8 flex items-center gap-2"
        >
          ← Back to My Work
        </button>
        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          <div className="lg:w-1/2">
            <div ref={(el) => (panelRefs.current[0] = el)} className="pd-panel p-4 md:p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm">
              <div className="w-full h-48 md:h-auto mb-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-xl relative">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" loading="eager" fetchpriority="high" />
                <div className="absolute inset-0 border-4 border-transparent rounded-lg animate-glow" style={{ '--glow-color': '#00FFE9' }}></div>
              </div>
              <h3 className="text-responsive-2xl md:text-3xl lg:text-4xl font-bold mt-4">{project.title}</h3>
              <p className="text-gray-300 text-responsive-base md:text-lg mt-2">{project.details}</p>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div ref={(el) => (panelRefs.current[1] = el)} className="pd-panel p-4 md:p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm mb-6 md:mb-8">
              <h4 className="text-responsive-xl md:text-2xl lg:text-3xl font-bold mb-4">Project Impact</h4>
              <p className="text-gray-300 text-responsive-base md:text-lg leading-relaxed">{project.impact}</p>
            </div>
            <div ref={(el) => (panelRefs.current[2] = el)} className="pd-panel p-4 md:p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm mb-6 md:mb-8">
              <h4 className="text-responsive-xl md:text-2xl lg:text-3xl font-bold mb-4">Key Features</h4>
              <ul className="list-disc list-inside text-gray-300 text-responsive-base md:text-lg space-y-2">
                {project.keyFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
            <div ref={(el) => (panelRefs.current[3] = el)} className="pd-panel p-4 md:p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm">
              <h4 className="text-responsive-xl md:text-2xl lg:text-3xl font-bold mb-4">Technologies Used</h4>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {project.tech.split(',').map((techName, index) => {
                  const tech = allSkills.find((t) => t.name.toLowerCase() === techName.trim().toLowerCase());
                  if (tech) {
                    return (
                      <div
                        key={tech.name}
                        className="flex items-center space-x-2 bg-gray-700 bg-opacity-50 px-3 py-2 rounded-lg animate-float-icon-1"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {tech.customIcon ? tech.customIcon : (
                          <img src={tech.icon} alt={tech.name} className="w-8 h-8 animate-spin-slow" />
                        )}
                        <span className="text-white font-bold">{tech.name}</span>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div ref={(el) => (panelRefs.current[4] = el)} className="pd-panel p-4 md:p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm">
            <h4 className="text-responsive-xl md:text-2xl lg:text-3xl font-bold mb-6 text-center">Gallery</h4>
            <RollingGallery autoplay={true} pauseOnHover={true} />
          </div>
        </div>
      </div>

      <style>
        {`
            ${PROJECT_DETAILS_STYLES}
          `}
      </style>
    </div>
  );
};

export default ProjectDetailsPage;
