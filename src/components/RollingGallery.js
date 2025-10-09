import { useEffect, useState } from 'react';
import { motion, useMotionValue, useAnimation, useTransform } from 'motion/react';

// Import local images
import HomePage from './RollingGalleryImg/HomePage.png';
import Aboutme from './RollingGalleryImg/Aboutme.png';
import ConnectWithMe from './RollingGalleryImg/ConnectWithMe.png';
import DSA from './RollingGalleryImg/DSA.png';
import Menu from './RollingGalleryImg/Menu.png';
import Mywork from './RollingGalleryImg/Mywork.png';
import PortfolioPage from './RollingGalleryImg/PortfolioPage.png';
import Skillsets from './RollingGalleryImg/Skillsets.png';
import Tailwind from './RollingGalleryImg/Tailwind.png';
import ThreeJS from './RollingGalleryImg/Three.js.png';

const IMGS = [
  HomePage,
  Aboutme,
  ConnectWithMe,
  DSA,
  Menu,
  Mywork,
  PortfolioPage,
  Skillsets,
  Tailwind,
  ThreeJS
];

const RollingGallery = ({ autoplay = false, pauseOnHover = false, images = [] }) => {
  images = images.length > 0 ? images : IMGS;

  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= 480) return 'mobile';
    if (width <= 768) return 'tablet';
    if (width <= 1024) return 'laptop';
    return 'desktop';
  });
  const [currentRotation, setCurrentRotation] = useState(0);
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 480) setScreenSize('mobile');
      else if (width <= 768) setScreenSize('tablet');
      else if (width <= 1024) setScreenSize('laptop');
      else setScreenSize('desktop');
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Device-specific cylinder dimensions for optimal viewing
  const cylinderConfig = {
    mobile: { width: 1000, multiplier: 1.5, radius: 1.3 },
    tablet: { width: 1400, multiplier: 1.6, radius: 1.4 },
    laptop: { width: 1800, multiplier: 1.7, radius: 1.45 },
    desktop: { width: 2160, multiplier: 1.8, radius: 1.5 }
  };
  
  const config = cylinderConfig[screenSize] || cylinderConfig.desktop;
  const cylinderWidth = config.width;
  const faceCount = images.length;
  const faceWidth = (cylinderWidth / faceCount) * config.multiplier;
  const radius = (cylinderWidth / (2 * Math.PI)) * config.radius;

  const dragFactor = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();
  
  // Helper function to calculate visibility based on angle
  const calculateVisibility = (imageAngle, currentRot) => {
    const totalAngle = (imageAngle - currentRot) % 360;
    const normalizedAngle = totalAngle > 180 ? totalAngle - 360 : totalAngle < -180 ? totalAngle + 360 : totalAngle;
    const angleDiff = Math.abs(normalizedAngle);
    
    // Fade out images beyond 90 degrees from center
    if (angleDiff > 120) {
      return { opacity: Math.max(0, 1 - (angleDiff - 120) / 60), zIndex: Math.round(500 - angleDiff) };
    }
    return { opacity: 1, zIndex: Math.round(1000 - angleDiff) };
  };

  const transform = useTransform(rotation, val => `rotate3d(0,1,0,${val}deg)`);

  const startInfiniteSpin = startAngle => {
    controls.start({
      rotateY: [startAngle, startAngle - 360],
      transition: {
        duration: 20,
        ease: 'linear',
        repeat: Infinity
      }
    });
  };

  useEffect(() => {
    if (autoplay) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    } else {
      controls.stop();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplay]);

  const handleUpdate = latest => {
    if (typeof latest.rotateY === 'number') {
      rotation.set(latest.rotateY);
      setCurrentRotation(latest.rotateY);
    }
  };

  const handleDrag = (_, info) => {
    controls.stop();
    rotation.set(rotation.get() + info.offset.x * dragFactor);
  };

  const handleDragEnd = (_, info) => {
    const finalAngle = rotation.get() + info.velocity.x * dragFactor;
    rotation.set(finalAngle);

    if (autoplay) {
      startInfiniteSpin(finalAngle);
    }
  };

  const handleMouseEnter = () => {
    if (autoplay && pauseOnHover) {
      controls.stop();
    }
  };
  
  const handleMouseLeave = () => {
    if (autoplay && pauseOnHover) {
      const currentAngle = rotation.get();
      startInfiniteSpin(currentAngle);
    }
  };

  return (
    <div className="relative w-full overflow-hidden" style={{ height: screenSize === 'mobile' ? '400px' : screenSize === 'tablet' ? '500px' : '600px' }}>
      <div
        className="absolute top-0 left-0 h-full w-[48px] z-10"
        style={{
          background: 'linear-gradient(to left, rgba(0,0,0,0) 0%, #060010 100%)'
        }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[48px] z-10"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0) 0%, #060010 100%)'
        }}
      />

      <div className="flex h-full items-center justify-center [perspective:2000px] [transform-style:preserve-3d]">
        <motion.div
          drag="x"
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={controls}
          onUpdate={handleUpdate}
          style={{
            transform: transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: 'preserve-3d'
          }}
          className="flex min-h-[200px] cursor-grab items-center justify-center [transform-style:preserve-3d]"
        >
          {images.map((url, i) => {
            // Calculate angle for this image in the carousel
            const angle = (360 / faceCount) * i;
            
            // Get dynamic visibility based on current rotation
            const { opacity, zIndex } = calculateVisibility(angle, currentRotation);
            
            return (
              <div
                key={i}
                className="group absolute flex h-fit items-center justify-center"
                style={{
                  width: `${faceWidth}px`,
                  transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
                  backgroundColor: 'transparent',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  opacity: opacity,
                  zIndex: zIndex,
                  transition: 'opacity 0.2s ease-out',
                  willChange: 'opacity, z-index'
                }}
              >
                <img
                  src={url}
                  alt="gallery"
                  className="pointer-events-none rounded-[15px] object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                  style={{ 
                    backgroundColor: 'transparent',
                    height: screenSize === 'mobile' ? '100px' : screenSize === 'tablet' ? '120px' : '144px',
                    width: screenSize === 'mobile' ? '240px' : screenSize === 'tablet' ? '288px' : '360px'
                  }}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
