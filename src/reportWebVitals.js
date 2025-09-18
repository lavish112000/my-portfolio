/**
 * ============================================================================
 * WEB VITALS PERFORMANCE MONITORING
 * ============================================================================
 *
 * @fileoverview Performance monitoring utility for measuring and reporting
 *              Core Web Vitals metrics using the web-vitals library.
 *
 * CORE WEB VITALS METRICS:
 * - CLS (Cumulative Layout Shift): Measures visual stability
 * - FID (First Input Delay): Measures interactivity responsiveness
 * - FCP (First Contentful Paint): Measures loading performance
 * - LCP (Largest Contentful Paint): Measures loading performance
 * - TTFB (Time to First Byte): Measures server response time
 *
 * USAGE SCENARIOS:
 * - Development: Log metrics to console for debugging
 * - Production: Send metrics to analytics services
 * - Monitoring: Track performance regressions over time
 *
 * INTEGRATION:
 * - Dynamically imports web-vitals library for optimal bundle size
 * - Only loads when callback function is provided
 * - Graceful degradation when web-vitals is unavailable
 *
 * PERFORMANCE IMPACT:
 * - Minimal: Uses dynamic imports to avoid bundle bloat
 * - Non-blocking: Metrics collection happens asynchronously
 * - Conditional: Only runs when explicitly enabled
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

/**
 * Report Web Vitals performance metrics
 * @description Measures and reports Core Web Vitals using web-vitals library
 * @param {Function} onPerfEntry - Callback function to handle performance metrics
 * @example
 * // Log to console (development)
 * reportWebVitals(console.log);
 *
 * // Send to analytics (production)
 * reportWebVitals((metric) => {
 *   analytics.track('web_vitals', {
 *     name: metric.name,
 *     value: metric.value,
 *     id: metric.id
 *   });
 * });
 */
const reportWebVitals = onPerfEntry => {
  // ============================================================================
  // VALIDATION
  // ============================================================================
  // Only proceed if callback function is provided and is actually a function
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // ============================================================================
    // DYNAMIC IMPORT
    // ============================================================================
    // Dynamically import web-vitals to avoid increasing bundle size
    // This ensures the library is only loaded when performance monitoring is needed
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // ============================================================================
      // METRICS COLLECTION
      // ============================================================================

      /**
       * Cumulative Layout Shift (CLS)
       * Measures visual stability by quantifying unexpected layout shifts
       * Lower values are better (target: < 0.1)
       */
      getCLS(onPerfEntry);

      /**
       * First Input Delay (FID)
       * Measures responsiveness by quantifying delay between user input and response
       * Lower values are better (target: < 100ms)
       */
      getFID(onPerfEntry);

      /**
       * First Contentful Paint (FCP)
       * Measures loading performance by marking when first content is painted
       * Lower values are better (target: < 1800ms)
       */
      getFCP(onPerfEntry);

      /**
       * Largest Contentful Paint (LCP)
       * Measures loading performance by marking when largest content is painted
       * Lower values are better (target: < 2500ms)
       */
      getLCP(onPerfEntry);

      /**
       * Time to First Byte (TTFB)
       * Measures server response time by timing when first byte arrives
       * Lower values are better (target: < 800ms)
       */
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
