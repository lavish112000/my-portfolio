// Google Analytics utility functions
export const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID;

// Track page views
export const trackPageView = (pagePath) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: pagePath,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track navigation events
export const trackNavigation = (from, to) => {
  trackEvent('navigation', 'user_interaction', `from_${from}_to_${to}`);
};

// Track project views
export const trackProjectView = (projectName) => {
  trackEvent('project_view', 'engagement', projectName);
};

// Track skill game interactions
export const trackSkillGameInteraction = (gameType, action) => {
  trackEvent(action, 'skill_games', gameType);
};

// Track contact form submissions
export const trackContactSubmission = (success) => {
  trackEvent('contact_form', 'engagement', success ? 'success' : 'error');
};

// Track social media clicks
export const trackSocialClick = (platform) => {
  trackEvent('social_click', 'engagement', platform);
};
