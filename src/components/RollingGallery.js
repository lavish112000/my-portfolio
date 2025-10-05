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

  const [isScreenSizeSm, setIsScreenSizeSm] = useState(typeof window !== 'undefined' ? window.innerWidth <= 640 : false);
  
  useEffect(() => {
    const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cylinderWidth = isScreenSizeSm ? 1320 : 2160;
  const faceCount = images.length;
  const faceWidth = (cylinderWidth / faceCount) * 1.8;
  const radius = cylinderWidth / (2 * Math.PI);

  const dragFactor = 0.05;
  const rotation = useMotionValue(0);
  const controls = useAnimation();

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
    <div className="relative h-[600px] w-full overflow-hidden">
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

      <div className="flex h-full items-center justify-center [perspective:1000px] [transform-style:preserve-3d]">
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
          {images.map((url, i) => (
            <div
              key={i}
              className="group absolute flex h-fit items-center justify-center [backface-visibility:hidden]"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${(360 / faceCount) * i}deg) translateZ(${radius}px)`,
                backgroundColor: 'transparent'
              }}
            >
              <img
                src={url}
                alt="gallery"
                className="pointer-events-none h-[144px] w-[360px] rounded-[15px] object-contain
                           transition-transform duration-300 ease-out group-hover:scale-110
                           sm:h-[120px] sm:w-[264px]"
                style={{ backgroundColor: 'transparent' }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default RollingGallery;
