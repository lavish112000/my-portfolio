/**
 * ============================================================================
 * SERVICE WORKER REGISTRATION - PROGRESSIVE WEB APP SUPPORT
 * ============================================================================
 *
 * @fileoverview Service worker registration and management for PWA functionality.
 *              Enables offline support, caching, and background sync capabilities.
 *
 * FEATURES:
 * - Automatic service worker registration in production
 * - Offline content caching and serving
 * - Background updates and cache management
 * - Localhost development support with enhanced logging
 * - Graceful error handling and recovery
 *
 * PWA BENEFITS:
 * - Fast loading from cache
 * - Offline functionality
 * - Background updates
 * - Installable web app experience
 * - Improved performance and reliability
 *
 * BROWSER SUPPORT:
 * - Modern browsers with Service Worker API support
 * - Graceful degradation for unsupported browsers
 * - Localhost detection for development workflow
 *
 * CACHE STRATEGY:
 * - Cache-first for static assets
 * - Network-first for dynamic content
 * - Background updates for new content
 * - Automatic cache cleanup and management
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

// ============================================================================
// LOCALHOST DETECTION UTILITY
// ============================================================================

/**
 * Detect if the application is running on localhost
 * @description Checks various localhost patterns including IPv4 and IPv6 addresses
 * @constant {boolean} isLocalhost - True if running on localhost, false otherwise
 */
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

// ============================================================================
// SERVICE WORKER REGISTRATION
// ============================================================================

/**
 * Register service worker for PWA functionality
 * @description Main function to register the service worker with proper error handling
 *              and environment-specific behavior
 * @param {Object} [config] - Configuration object for callbacks
 * @param {Function} [config.onSuccess] - Called when SW is successfully registered
 * @param {Function} [config.onUpdate] - Called when new SW content is available
 * @example
 * register({
 *   onSuccess: (registration) => console.log('SW registered:', registration),
 *   onUpdate: (registration) => console.log('SW updated:', registration)
 * });
 */
export function register(config) {
  // ============================================================================
  // ENVIRONMENT AND BROWSER CHECKS
  // ============================================================================

  // Only register in production environment
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // ============================================================================
    // ORIGIN VALIDATION
    // ============================================================================
    // Create public URL object to validate origin
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);

    // Check if PUBLIC_URL is on different origin (e.g., CDN)
    if (publicUrl.origin !== window.location.origin) {
      // Service worker won't work across different origins
      // This prevents issues with CDN-hosted assets
      return;
    }

    // ============================================================================
    // DELAYED REGISTRATION
    // ============================================================================
    // Wait for page load to complete before registering SW
    window.addEventListener('load', () => {
      // Construct service worker URL
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // ============================================================================
        // LOCALHOST DEVELOPMENT MODE
        // ============================================================================
        // Check if service worker exists and is valid
        checkValidServiceWorker(swUrl, config);

        // Add development logging for localhost
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        // ============================================================================
        // PRODUCTION MODE
        // ============================================================================
        // Register service worker directly
        registerValidSW(swUrl, config);
      }
    });
  }
}

// ============================================================================
// SERVICE WORKER REGISTRATION HELPERS
// ============================================================================

/**
 * Register a valid service worker
 * @description Handles the actual service worker registration process
 * @param {string} swUrl - URL of the service worker script
 * @param {Object} [config] - Configuration object for callbacks
 * @private
 */
function registerValidSW(swUrl, config) {
  // Register the service worker
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // ============================================================================
      // UPDATE HANDLING
      // ============================================================================
      registration.onupdatefound = () => {
        // Get the installing worker
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }

        // Listen for state changes
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // ============================================================================
              // UPDATE AVAILABLE
              // ============================================================================
              // New content is available but old SW is still active
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://cra.link/PWA.'
              );

              // Execute update callback if provided
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // ============================================================================
              // FIRST INSTALL
              // ============================================================================
              // Everything has been precached for the first time
              console.log('Content is cached for offline use.');

              // Execute success callback if provided
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      // Log registration errors
      console.error('Error during service worker registration:', error);
    });
}

/**
 * Check if service worker is valid on localhost
 * @description Validates service worker existence and handles localhost-specific scenarios
 * @param {string} swUrl - URL of the service worker script
 * @param {Object} [config] - Configuration object for callbacks
 * @private
 */
function checkValidServiceWorker(swUrl, config) {
  // ============================================================================
  // SERVICE WORKER VALIDATION
  // ============================================================================
  // Fetch the service worker script to check if it exists
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Check response status and content type
      const contentType = response.headers.get('content-type');

      if (
        response.status === 404 || // Service worker not found
        (contentType != null && contentType.indexOf('javascript') === -1) // Not a JS file
      ) {
        // ============================================================================
        // INVALID SERVICE WORKER
        // ============================================================================
        // Unregister invalid service worker and reload page
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // ============================================================================
        // VALID SERVICE WORKER
        // ============================================================================
        // Proceed with normal registration
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // ============================================================================
      // OFFLINE MODE
      // ============================================================================
      // No internet connection, app is running offline
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

// ============================================================================
// SERVICE WORKER UNREGISTRATION
// ============================================================================

/**
 * Unregister service worker
 * @description Completely removes the service worker registration
 *              Useful for development or when disabling PWA features
 * @returns {void}
 * @example
 * unregister(); // Remove service worker completely
 */
export function unregister() {
  // Check if service worker is supported
  if ('serviceWorker' in navigator) {
    // Wait for service worker to be ready, then unregister
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        // Log any errors during unregistration
        console.error(error.message);
      });
  }
}
