/**
 * ============================================================================
 * APPLICATION ENTRY POINT - REACT ROOT RENDERER
 * ============================================================================
 *
 * @fileoverview Main entry point for the React portfolio application.
 *              Handles application initialization, Google Analytics setup,
 *              service worker registration, and root component rendering.
 *
 * RESPONSIBILITIES:
 * - Initialize Google Analytics tracking
 * - Create React root and render main App component
 * - Set up error boundary for crash protection
 * - Register service worker for PWA functionality
 * - Configure performance monitoring
 *
 * INITIALIZATION SEQUENCE:
 * 1. Import all necessary dependencies and components
 * 2. Initialize Google Analytics (if tracking ID provided)
 * 3. Create React root container
 * 4. Render application with error boundary
 * 5. Register service worker for offline functionality
 * 6. Set up performance monitoring
 *
 * ERROR HANDLING:
 * - Wrapped in React.StrictMode for development warnings
 * - ErrorBoundary component catches JavaScript errors
 * - Graceful degradation for missing GA tracking ID
 *
 * PERFORMANCE:
 * - Async GA script loading to avoid blocking
 * - Service worker for caching and offline support
 * - Web vitals reporting for performance monitoring
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorker';

// ============================================================================
// GOOGLE ANALYTICS INITIALIZATION
// ============================================================================

/**
 * Initialize Google Analytics tracking
 * @description Dynamically loads and configures Google Analytics 4 (GA4)
 *              Only initializes if tracking ID is provided in environment variables
 * @function initializeGA
 * @returns {void}
 */
const initializeGA = () => {
  // Check if GA tracking ID is configured in environment
  if (process.env.REACT_APP_GA_TRACKING_ID) {
    // ============================================================================
    // DYNAMIC SCRIPT LOADING
    // ============================================================================
    // Create script element for Google Tag Manager
    const script = document.createElement('script');
    script.async = true; // Load asynchronously to avoid blocking page render
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.REACT_APP_GA_TRACKING_ID}`;
    document.head.appendChild(script); // Add to document head

    // ============================================================================
    // GTAG FUNCTION INITIALIZATION
    // ============================================================================
    // Initialize dataLayer array if it doesn't exist
    window.dataLayer = window.dataLayer || [];

    // Define gtag function for pushing events to dataLayer
    function gtag(){window.dataLayer.push(arguments);}

    // Configure GA4 with current timestamp and tracking ID
    gtag('js', new Date()); // Initialize with current date
    gtag('config', process.env.REACT_APP_GA_TRACKING_ID); // Configure with tracking ID
  }
};

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Initialize Google Analytics before rendering
initializeGA();

// ============================================================================
// REACT ROOT CREATION AND RENDERING
// ============================================================================

/**
 * Create React root and render the application
 * @description Sets up the main React rendering pipeline with error boundaries
 *              and strict mode for development debugging
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Error boundary to catch and handle JavaScript errors gracefully */}
    <ErrorBoundary>
      {/* Main application component */}
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// ============================================================================
// SERVICE WORKER REGISTRATION
// ============================================================================

/**
 * Register service worker for Progressive Web App functionality
 * @description Enables offline support, caching, and background sync
 *              Only registers in production builds for optimal performance
 */
serviceWorkerRegistration.register();

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Web Vitals performance monitoring
 * @description Measures and reports core web vitals metrics
 *              Can be configured to send data to analytics or logging services
 *              Currently set up for development logging (can be customized)
 *
 * Available metrics:
 * - First Contentful Paint (FCP)
 * - Largest Contentful Paint (LCP)
 * - First Input Delay (FID)
 * - Cumulative Layout Shift (CLS)
 *
 * @see https://web.dev/vitals/
 */
reportWebVitals();
