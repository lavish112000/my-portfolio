/**
 * ============================================================================
 * ANALYTICS MODULE - GOOGLE ANALYTICS TRACKING UTILITIES
 * ============================================================================
 *
 * @fileoverview Centralized Google Analytics tracking functions for the portfolio website.
 *              Provides comprehensive event tracking for user interactions, navigation,
 *              and engagement metrics.
 *
 * FEATURES:
 * - Page view tracking
 * - Custom event tracking
 * - Navigation flow analysis
 * - Project engagement metrics
 * - Skill game interaction tracking
 * - Contact form conversion tracking
 * - Social media engagement tracking
 *
 * INTEGRATION:
 * - Uses Google Analytics 4 (GA4) gtag function
 * - Environment variable configuration for tracking ID
 * - Safe execution with window object checks
 * - Graceful degradation when GA is not available
 *
 * PRIVACY CONSIDERATIONS:
 * - Only tracks when GA is properly configured
 * - Respects user's browser privacy settings
 * - No personal data collection
 * - Analytics can be disabled via environment variables
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Google Analytics Tracking ID
 * @description Retrieves GA tracking ID from environment variables
 * @constant {string|undefined} GA_TRACKING_ID - GA4 measurement ID from REACT_APP_GA_TRACKING_ID
 */
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

// ============================================================================
// PAGE VIEW TRACKING
// ============================================================================

/**
 * Track page view events
 * @description Sends page view data to Google Analytics when users navigate between pages
 * @param {string} pagePath - The path of the page being viewed (e.g., '/projects', '/contact')
 * @example
 * trackPageView('/about'); // Tracks visit to about page
 * trackPageView(window.location.pathname); // Track current page
 */
export const trackPageView = (pagePath) => {
  // Safety check: ensure we're in browser environment with gtag available
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: pagePath, // Override default page path with custom path
    });
  }
};

// ============================================================================
// CUSTOM EVENT TRACKING
// ============================================================================

/**
 * Track custom events with detailed parameters
 * @description Generic event tracking function for any custom analytics events
 * @param {string} action - The action performed (e.g., 'click', 'submit', 'play')
 * @param {string} category - Event category for grouping (e.g., 'engagement', 'interaction')
 * @param {string} label - Additional descriptive label for the event
 * @param {number} [value] - Optional numeric value associated with the event
 * @example
 * trackEvent('button_click', 'navigation', 'hero_cta', 1);
 * trackEvent('video_play', 'engagement', 'portfolio_demo');
 */
export const trackEvent = (action, category, label, value) => {
  // Safety check: ensure we're in browser environment with gtag available
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,    // GA4 event category parameter
      event_label: label,          // GA4 event label parameter
      value: value,                // Optional numeric value
    });
  }
};

// ============================================================================
// NAVIGATION TRACKING
// ============================================================================

/**
 * Track navigation events between sections
 * @description Specialized tracking for user navigation patterns within the portfolio
 * @param {string} from - The section/page the user is navigating from
 * @param {string} to - The section/page the user is navigating to
 * @example
 * trackNavigation('home', 'projects'); // User navigated from home to projects
 * trackNavigation('projects', 'contact'); // User navigated from projects to contact
 */
export const trackNavigation = (from, to) => {
  // Use the generic trackEvent function with navigation-specific parameters
  trackEvent('navigation', 'user_interaction', `from_${from}_to_${to}`);
};

// ============================================================================
// PROJECT ENGAGEMENT TRACKING
// ============================================================================

/**
 * Track project view events
 * @description Monitors which projects users are viewing to understand content popularity
 * @param {string} projectName - The name or identifier of the project being viewed
 * @example
 * trackProjectView('React Portfolio Website');
 * trackProjectView('E-commerce Platform');
 */
export const trackProjectView = (projectName) => {
  // Track project views as engagement events
  trackEvent('project_view', 'engagement', projectName);
};

// ============================================================================
// SKILL GAME INTERACTION TRACKING
// ============================================================================

/**
 * Track skill game interactions
 * @description Monitors user engagement with interactive skill demonstration games
 * @param {string} gameType - The type of skill game (e.g., 'javascript', 'react', 'python')
 * @param {string} action - The action performed (e.g., 'start', 'complete', 'click')
 * @example
 * trackSkillGameInteraction('javascript', 'start'); // User started JS game
 * trackSkillGameInteraction('react', 'complete'); // User completed React game
 */
export const trackSkillGameInteraction = (gameType, action) => {
  // Track skill game interactions as engagement events
  trackEvent(action, 'skill_games', gameType);
};

// ============================================================================
// CONTACT FORM TRACKING
// ============================================================================

/**
 * Track contact form submission events
 * @description Monitors contact form conversions and success rates
 * @param {boolean} success - Whether the form submission was successful
 * @example
 * trackContactSubmission(true); // Successful form submission
 * trackContactSubmission(false); // Failed form submission
 */
export const trackContactSubmission = (success) => {
  // Track contact form events with success/failure status
  trackEvent('contact_form', 'engagement', success ? 'success' : 'error');
};

// ============================================================================
// SOCIAL MEDIA TRACKING
// ============================================================================

/**
 * Track social media link clicks
 * @description Monitors which social platforms users are engaging with
 * @param {string} platform - The social media platform (e.g., 'linkedin', 'github', 'twitter')
 * @example
 * trackSocialClick('linkedin'); // User clicked LinkedIn link
 * trackSocialClick('github'); // User clicked GitHub link
 */
export const trackSocialClick = (platform) => {
  // Track social media engagement as engagement events
  trackEvent('social_click', 'engagement', platform);
};
