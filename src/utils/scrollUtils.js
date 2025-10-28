/**
 * Scroll Utility Functions
 * Helper functions for managing scroll behavior
 */
import { gsap } from 'gsap';

/**
 * Smoothly scrolls to a section by ID
 * @param {string} sectionId - The ID of the section to scroll to
 * @param {number} duration - Animation duration in seconds
 * @param {number} offsetY - Optional offset from the top
 */
export const scrollToSection = (sectionId, duration = 0.6, offsetY = 20) => {
  const element = document.getElementById(sectionId);
  if (element) {
    gsap.to(window, {
      scrollTo: {
        y: element,
        autoKill: false,
        offsetY
      },
      duration,
      ease: 'power2.inOut'
    });
  }
};

/**
 * Smoothly scrolls to top of the page
 * @param {number} duration - Animation duration in seconds
 */
export const scrollToTop = (duration = 0.4) => {
  gsap.to(window, {
    scrollTo: {
      y: 0,
      autoKill: false
    },
    duration,
    ease: 'power2.inOut'
  });
};

/**
 * Saves current scroll position
 * @returns {number} Current scroll position
 */
export const saveScrollPosition = () => {
  return window.scrollY || window.pageYOffset;
};

/**
 * Restores scroll position
 * @param {number} position - The scroll position to restore
 */
export const restoreScrollPosition = (position) => {
  window.scrollTo(0, position);
};

/**
 * Checks if an element is in viewport
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} Whether the element is in viewport
 */
export const isElementInViewport = (element) => {
  if (!element) return false;
  
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};
