import React, { useEffect, useRef, useCallback, useMemo } from 'react';
/**
 * ProfileCard (Refined Design)
 * Responsive, subtle-tilt profile presentation card.
 * Key visual sections:
 *  - Centered name/title header
 *  - Large centered portrait image
 *  - Bottom glass bar with handle/status and action button
 * Design tokens (customizable via props setting CSS variables):
 *  width, height, borderRadius, glowColor, accentColor, backgroundColor.
 * Tilt: pointer-tracked, reduced motion safe, mobile opt-in.
 */
import './ProfileCard.css';

const DEFAULT_BEHIND_GRADIENT = 'radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)';
const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';


const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const adjust = (value, fromMin, fromMax, toMin, toMax) => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

const ProfileCardComponent = ({
  avatarUrl = '<Placeholder for avatar URL>',
  iconUrl = '<Placeholder for icon URL>',
  grainUrl = '<Placeholder for grain URL>',
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = 'Lalit Choudhary',
  title = 'Software Engineer',
  handle = 'Loveiisshhcodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick,
  width = 420,
  height = 560,
  borderRadius = 32,
  glowColor = '#4dd4ff',
  accentColor = '#4dd4ff',
  backgroundColor = '#transparent'
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  // Accept external overrides using props (default values defined above if not provided)
  const { maxTiltX = 14, maxTiltY = 14, maxTiltZ = 8, responsiveTilt = true } = {};

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null;
    let smoothingRaf = null;
    const targetRot = { x: 0, y: 0, z: 0 };
    const currentRot = { x: 0, y: 0, z: 0 };
    const SMOOTHING_FACTOR = 0.12; // lerp factor per frame
    // Max tilt configuration (degrees) - allow override via data attributes set from props later
    let MAX_TILT_X = parseFloat(wrapRef.current?.dataset.maxTiltX) || 14; // affects rotateX (derived from pointer Y)
    let MAX_TILT_Y = parseFloat(wrapRef.current?.dataset.maxTiltY) || 14; // affects rotateY (derived from pointer X)
    let MAX_TILT_Z = parseFloat(wrapRef.current?.dataset.maxTiltZ) || 8;  // subtle spin on circular pointer movement
    // Auto scaling for small screens (will be optionally adjusted later by prop logic)
    if (responsiveTilt && typeof window !== 'undefined' && window.innerWidth < 480) {
      MAX_TILT_X *= 0.8; MAX_TILT_Y *= 0.8; MAX_TILT_Z *= 0.8;
    }

    const updateCardTransform = (offsetX, offsetY, card, wrap) => {
      const width = card.clientWidth;
      const height = card.clientHeight;
      const percentX = clamp((100 / width) * offsetX);
      const percentY = clamp((100 / height) * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      // Normalized (-1 to 1) distances from center
      const normX = centerX / 50; // left -1, right +1
      const normY = centerY / 50; // top -1, bottom +1
      // Distance from center (0..1)
      const radial = Math.min(1, Math.hypot(normX, normY));
      // Angle for circular / orbital motion influence
      const angleRad = Math.atan2(normY, normX); // -PI .. PI
      const angleDeg = angleRad * (180 / Math.PI);
      // Map directly to max tilt (edge saturation). We keep mapping consistent with existing axis usage.
      const rotateXDeg = normY * MAX_TILT_X;          // card tilts up/down following Y
      const rotateYDeg = -normX * MAX_TILT_Y;         // card tilts left/right following X (negative to keep previous visual feel)
      // Z spin scales with angle and radial distance so nearer center contributes less.
      const rotateZDeg = (angleDeg * (MAX_TILT_Z / 180)) * radial;
      // Respect reduced motion preference (disable dynamic tilt/spin beyond light tilt)
      let reduceMotion = false;
      try { reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_) { /* no-op */ }

      // Update instantaneous pointer-related variables (not smoothed)
      const immediate = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`
      };
      Object.entries(immediate).forEach(([property, value]) => wrap.style.setProperty(property, value));
      // Set target rotations (will be eased toward in smoothing loop)
      if (!reduceMotion) {
        targetRot.x = rotateYDeg; // maintain naming alignment
        targetRot.y = rotateXDeg;
        targetRot.z = rotateZDeg;
        if (!smoothingRaf) {
          const smoothStep = () => {
            const dx = targetRot.x - currentRot.x;
            const dy = targetRot.y - currentRot.y;
            const dz = targetRot.z - currentRot.z;
            // If movement is negligible skip extra writes next frame
            if (Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01 && Math.abs(dz) < 0.01) {
              currentRot.x = targetRot.x; currentRot.y = targetRot.y; currentRot.z = targetRot.z;
              wrap.style.setProperty('--rotate-x', `${round(currentRot.x)}deg`);
              wrap.style.setProperty('--rotate-y', `${round(currentRot.y)}deg`);
              wrap.style.setProperty('--rotate-z', `${round(currentRot.z)}deg`);
              smoothingRaf = null;
              return;
            }
            currentRot.x += dx * SMOOTHING_FACTOR;
            currentRot.y += dy * SMOOTHING_FACTOR;
            currentRot.z += dz * SMOOTHING_FACTOR;
            wrap.style.setProperty('--rotate-x', `${round(currentRot.x)}deg`);
            wrap.style.setProperty('--rotate-y', `${round(currentRot.y)}deg`);
            wrap.style.setProperty('--rotate-z', `${round(currentRot.z)}deg`);
            smoothingRaf = requestAnimationFrame(smoothStep);
          };
          smoothingRaf = requestAnimationFrame(smoothStep);
        }
      } else {
        // Reduced motion: snap quickly (one write)
        wrap.style.setProperty('--rotate-x', '0deg');
        wrap.style.setProperty('--rotate-y', '0deg');
        wrap.style.setProperty('--rotate-z', '0deg');
      }
    };

    const createSmoothAnimation = (duration, startX, startY, card, wrap) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;
      const animationLoop = currentTime => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const eased = easeInOutCubic(progress);
        const currentX = adjust(eased, 0, 1, startX, targetX);
        const currentY = adjust(eased, 0, 1, startY, targetY);
        updateCardTransform(currentX, currentY, card, wrap);
        if (progress < 1) rafId = requestAnimationFrame(animationLoop);
      };
      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } if (smoothingRaf) { cancelAnimationFrame(smoothingRaf); smoothingRaf = null; } }
    };
  }, [enableTilt, responsiveTilt]);

  const handlePointerMove = useCallback(event => {
    const card = cardRef.current; const wrap = wrapRef.current; if (!card || !wrap || !animationHandlers) return;
    const rect = wrap.getBoundingClientRect();
    animationHandlers.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
  }, [animationHandlers]);

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current; const wrap = wrapRef.current; if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation(); wrap.classList.add('active'); card.classList.add('active');
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(event => {
    const card = cardRef.current; const wrap = wrapRef.current; if (!card || !wrap || !animationHandlers) return;
    animationHandlers.createSmoothAnimation(600, event.offsetX, event.offsetY, card, wrap);
    wrap.classList.remove('active'); card.classList.remove('active');
  }, [animationHandlers]);

  const handleDeviceOrientation = useCallback(event => {
    const card = cardRef.current; const wrap = wrapRef.current; if (!card || !wrap || !animationHandlers) return;
    const { beta, gamma } = event; if (beta == null || gamma == null) return;
    animationHandlers.updateCardTransform(
      card.clientHeight / 2 + gamma * mobileTiltSensitivity,
      card.clientWidth / 2 + (beta - 20) * mobileTiltSensitivity,
      card,
      wrap
    );
  }, [animationHandlers, mobileTiltSensitivity]);

  // Touch drag fallback (simulates pointer movement over wrapper)
  useEffect(() => {
    const wrap = wrapRef.current; const card = cardRef.current; if (!wrap || !card || !animationHandlers || !enableTilt) return;
    let active = false;
    let rect = null;
    const onTouchStart = e => {
      rect = wrap.getBoundingClientRect();
      active = true;
      wrap.classList.add('active'); card.classList.add('active');
    };
    const onTouchMove = e => {
      if (!active) return;
      const t = e.touches[0];
      animationHandlers.updateCardTransform(t.clientX - rect.left, t.clientY - rect.top, card, wrap);
    };
    const onTouchEnd = e => {
      if (!active) return;
      active = false;
      animationHandlers.createSmoothAnimation(500, (rect.width/2), (rect.height/2), card, wrap);
      wrap.classList.remove('active'); card.classList.remove('active');
    };
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove', onTouchMove, { passive: true });
    wrap.addEventListener('touchend', onTouchEnd, { passive: true });
    wrap.addEventListener('touchcancel', onTouchEnd, { passive: true });
    return () => {
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove', onTouchMove);
      wrap.removeEventListener('touchend', onTouchEnd);
      wrap.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [enableTilt, animationHandlers]);

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;
  const card = cardRef.current; const wrap = wrapRef.current; if (!card || !wrap) return;
    const pointerMoveHandler = handlePointerMove;
    const pointerEnterHandler = handlePointerEnter;
    const pointerLeaveHandler = handlePointerLeave;
    const deviceOrientationHandler = handleDeviceOrientation;

    const handleClick = () => {
      if (!enableMobileTilt) return;
      
      if (typeof window.DeviceOrientationEvent?.requestPermission === 'function') {
        // iOS 13+ requires permission
        window.DeviceOrientationEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', deviceOrientationHandler);
              console.log('Gyroscope permission granted!');
            }
          })
          .catch(console.error);
      } else {
        // Android and other devices
        window.addEventListener('deviceorientation', deviceOrientationHandler);
        console.log('Gyroscope activated!');
      }
    };

    // Auto-activate gyroscope for mobile devices (non-iOS)
    if (enableMobileTilt && typeof window.DeviceOrientationEvent?.requestPermission !== 'function') {
      window.addEventListener('deviceorientation', deviceOrientationHandler);
    }

  // Attach events to wrapper so the entire visual area (including top half where card had pointer-events none) responds.
  wrap.addEventListener('pointerenter', pointerEnterHandler);
  wrap.addEventListener('pointermove', pointerMoveHandler);
  wrap.addEventListener('pointerleave', pointerLeaveHandler);
  wrap.addEventListener('click', handleClick);

    const initialX = wrap.clientWidth - 70; const initialY = 60;
    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(1500, initialX, initialY, card, wrap);

    return () => {
  wrap.removeEventListener('pointerenter', pointerEnterHandler);
  wrap.removeEventListener('pointermove', pointerMoveHandler);
  wrap.removeEventListener('pointerleave', pointerLeaveHandler);
  wrap.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
      animationHandlers.cancelAnimation();
    };
  }, [enableTilt, enableMobileTilt, animationHandlers, handlePointerMove, handlePointerEnter, handlePointerLeave, handleDeviceOrientation]);

  const cardStyle = useMemo(() => ({
    '--icon': iconUrl ? `url(${iconUrl})` : 'none',
    '--grain': grainUrl ? `url(${grainUrl})` : 'none',
    '--behind-gradient': showBehindGradient ? (behindGradient ?? DEFAULT_BEHIND_GRADIENT) : 'none',
    '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
    '--pc-width': width + 'px',
    '--pc-height': height + 'px',
    '--pc-radius': borderRadius + 'px',
    '--pc-glow': glowColor,
    '--pc-accent': accentColor,
    '--pc-bg': backgroundColor
  }), [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient, width, height, borderRadius, glowColor, accentColor, backgroundColor]);

  const handleContactClick = useCallback(() => { onContactClick?.(); }, [onContactClick]);

  // (Moved destructuring earlier for hook dependency ordering)

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
      data-max-tilt-x={maxTiltX}
      data-max-tilt-y={maxTiltY}
      data-max-tilt-z={maxTiltZ}
    >
      <section ref={cardRef} className="pc-card" aria-label={`${name} profile card`}>
        <header className="pc-header">
          <h3 className="pc-name">{name}</h3>
          <p className="pc-title">{title}</p>
        </header>
        <div className="pc-image-shell">
          <img className="pc-avatar-img" src={avatarUrl} alt={name} loading="lazy" onError={e => { e.target.style.visibility='hidden'; }} />
        </div>
        {showUserInfo && (
          <div className="pc-glassbar" role="contentinfo">
            <div className="pc-glass-left">
              <div className="pc-mini-avatar"><img src={miniAvatarUrl || avatarUrl} alt="mini" loading="lazy" onError={e => { e.target.style.opacity='0.4'; e.target.src=avatarUrl; }} /></div>
              <div className="pc-glass-text">
                <div className="pc-handle">@{handle}</div>
                <div className="pc-status">{status}</div>
              </div>
            </div>
            <button className="pc-contact-btn" onClick={handleContactClick} type="button" aria-label={`Contact ${name}`}>{contactText}</button>
          </div>
        )}
        <div className="pc-overlay-shine" />
        <div className="pc-overlay-glow" />
        <div className="pc-dynamic-shadow" aria-hidden="true" />
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
