/**
 * ============================================================================
 * SCROLLFLOAT COMPONENT - ANIMATED TEXT REVEAL
 * ============================================================================
 *
 * @fileoverview A React component that creates smooth, character-by-character
 *               floating text animations triggered by scroll position.
 *
 * FEATURES:
 * - Character-by-character text animation
 * - Scroll-triggered reveal effects
 * - Customizable animation parameters
 * - GSAP-powered smooth animations
 * - Responsive design support
 * - Performance optimized with will-change
 *
 * ANIMATION BEHAVIOR:
 * - Text splits into individual character spans
 * - Characters start below viewport with scale distortion
 * - On scroll trigger, characters float up with elastic easing
 * - Staggered animation creates flowing text effect
 *
 * USE CASES:
 * - Hero section headings
 * - Section titles with impact
 * - Call-to-action text reveals
 * - Portfolio project titles
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// ============================================================================
// GSAP PLUGIN REGISTRATION
// ============================================================================
// Register ScrollTrigger plugin for scroll-based animations
if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * ============================================================================
 * SCROLLFLOAT COMPONENT
 * ============================================================================
 *
 * @component ScrollFloat
 * @description Creates animated text reveals with floating character effects
 * @param {Object} props - Component props
 * @param {string|ReactNode} props.children - Text content to animate
 * @param {Object} props.scrollContainerRef - Reference to scrollable container (optional)
 * @param {string} props.containerClassName - Additional CSS classes for container
 * @param {string} props.textClassName - Additional CSS classes for text spans
 * @param {number} props.animationDuration - Duration of animation in seconds (default: 1)
 * @param {string} props.ease - GSAP easing function (default: 'back.inOut(2)')
 * @param {string} props.scrollStart - ScrollTrigger start position (default: 'center bottom+=50%')
 * @param {string} props.scrollEnd - ScrollTrigger end position (default: 'bottom bottom-=40%')
 * @param {number} props.stagger - Delay between character animations in seconds (default: 0.03)
 * @returns {JSX.Element} Animated text component
 */
const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}) => {
  // ============================================================================
  // REFS AND STATE
  // ============================================================================

  /**
   * Reference to the container element for GSAP targeting
   * @type {React.RefObject<HTMLDivElement>}
   */
  const containerRef = useRef(null);

  // ============================================================================
  // TEXT PROCESSING
  // ============================================================================

  /**
   * Splits text into individual character spans for animation
   * @description Converts string content into array of JSX spans, one per character
   * @type {Array<JSX.Element>}
   */
  const splitText = useMemo(() => {
    // Ensure children is a string, fallback to empty string
    const text = typeof children === 'string' ? children : '';

    // Split text into characters and map to span elements
    return text.split('').map((char, index) => (
      <span className="inline-block word" key={index}>
        {/* Preserve spaces using non-breaking space Unicode character */}
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  }, [children]);

  // ============================================================================
  // ANIMATION SETUP
  // ============================================================================

  useEffect(() => {
    // Get the container element reference
    const el = containerRef.current;
    if (!el) return; // Exit if element not found

    // Determine scroll container (custom container or window)
    const scroller = scrollContainerRef && scrollContainerRef.current
      ? scrollContainerRef.current
      : window;

    // Select all character span elements for animation
    const charElements = el.querySelectorAll('.inline-block');

    // ============================================================================
    // GSAP ANIMATION TIMELINE
    // ============================================================================

    gsap.fromTo(
      charElements,
      // ============================================================================
      // STARTING STATE (BEFORE ANIMATION)
      // ============================================================================
      {
        willChange: 'opacity, transform', // Performance optimization hint
        opacity: 0,                       // Start fully transparent
        yPercent: 120,                    // Start 120% below normal position
        scaleY: 2.3,                      // Vertically stretched
        scaleX: 0.7,                      // Horizontally compressed
        transformOrigin: '50% 0%'         // Transform from center-top
      },
      // ============================================================================
      // ENDING STATE (AFTER ANIMATION)
      // ============================================================================
      {
        duration: animationDuration,      // Animation duration in seconds
        ease: ease,                       // Easing function for natural motion
        opacity: 1,                       // Fade to fully visible
        yPercent: 0,                      // Move to normal vertical position
        scaleY: 1,                        // Return to normal vertical scale
        scaleX: 1,                        // Return to normal horizontal scale
        stagger: stagger,                 // Delay between each character animation

        // ============================================================================
        // SCROLL TRIGGER CONFIGURATION
        // ============================================================================
        scrollTrigger: {
          trigger: el,                    // Element that triggers animation
          scroller,                       // Scroll container (window or custom)
          start: scrollStart,             // When animation should start
          end: scrollEnd,                 // When animation should end
          scrub: true                     // Smooth scrubbing with scroll position
        }
      }
    );

    // ============================================================================
    // CLEANUP
    // ============================================================================
    // ScrollTrigger automatically handles cleanup on component unmount
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <h2 ref={containerRef} className={`my-5 overflow-hidden ${containerClassName}`}>
      <span className={`inline-block text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] ${textClassName}`}>
        {splitText}
      </span>
    </h2>
  );
};

export default ScrollFloat;