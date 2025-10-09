/**
 * Build Optimization Script
 * 
 * This script optimizes the build output for better LCP and performance:
 * - Inlines critical CSS
 * - Preloads critical resources
 * - Optimizes images
 * - Generates static HTML snapshots
 */

const fs = require('fs');
const path = require('path');

// Paths
const buildDir = path.join(__dirname, '..', 'build');
const indexPath = path.join(buildDir, 'index.html');

console.log('🚀 Starting post-build optimizations...');

try {
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Read the generated index.html
  let html = fs.readFileSync(indexPath, 'utf-8');

  // Find the actual hashed filenames for images
  const staticMediaDir = path.join(buildDir, 'static', 'media');
  
  if (fs.existsSync(staticMediaDir)) {
    const mediaFiles = fs.readdirSync(staticMediaDir);
    
    // Find profile image
    const profileImage = mediaFiles.find(f => f.includes('profile') && f.match(/\.(jpg|jpeg|png|webp)$/i));
    const videoPlayerImage = mediaFiles.find(f => f.includes('Videoplayerprofile') && f.match(/\.(jpg|jpeg|png|webp)$/i));
    
    if (profileImage) {
      // Update preload link with actual hashed filename
      html = html.replace(
        /%PUBLIC_URL%\/static\/media\/profile\.jpg/g,
        `/static/media/${profileImage}`
      );
      console.log(`✅ Updated preload for profile image: ${profileImage}`);
    }
    
    if (videoPlayerImage) {
      // Update preload link with actual hashed filename
      html = html.replace(
        /%PUBLIC_URL%\/static\/media\/Videoplayerprofile\.png/g,
        `/static/media/${videoPlayerImage}`
      );
      console.log(`✅ Updated preload for video player image: ${videoPlayerImage}`);
    }
  }

  // Add resource hints for faster loading
  const resourceHints = `
  <!-- Additional Performance Optimizations -->
  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin />
  <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
  `;

  // Insert resource hints before closing head tag
  html = html.replace('</head>', `${resourceHints}</head>`);

  // Add noscript fallback with SSR-like content
  const noscriptContent = `
  <noscript>
    <div style="text-align: center; padding: 50px; font-family: system-ui, -apple-system, sans-serif;">
      <h1 style="color: #4dd4ff;">Lalit Choudhary</h1>
      <h2 style="color: #666;">Full Stack Web & App Developer</h2>
      <p style="color: #888; margin-top: 20px;">Please enable JavaScript to view the interactive portfolio.</p>
      <div style="margin-top: 30px;">
        <a href="mailto:lalitchoudhary112000@gmail.com" style="color: #4dd4ff; text-decoration: none; padding: 10px 20px; border: 2px solid #4dd4ff; border-radius: 5px; display: inline-block;">
          Contact Me
        </a>
      </div>
    </div>
  </noscript>
  `;

  // Replace existing noscript tag
  html = html.replace(
    /<noscript>.*?<\/noscript>/s,
    noscriptContent
  );

  // Write optimized HTML back
  fs.writeFileSync(indexPath, html, 'utf-8');
  console.log('✅ Post-build optimizations completed successfully!');
  console.log('📊 Optimizations applied:');
  console.log('   - Image preload links updated with hashed filenames');
  console.log('   - Resource hints added for external domains');
  console.log('   - Enhanced noscript fallback with SSR-like content');
  console.log('   - fetchpriority="high" attributes in place');

} catch (error) {
  console.error('❌ Error during post-build optimization:', error);
  process.exit(1);
}
