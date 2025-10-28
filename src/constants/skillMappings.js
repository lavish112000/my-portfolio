/**
 * ============================================================================
 * SKILL TO TUTORIAL FILE MAPPING
 * ============================================================================
 *
 * @fileoverview Maps user-friendly skill names to their corresponding HTML tutorial files
 * @description All paths are relative to the public folder and serve static HTML content
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

/**
 * Mapping of skill names to their tutorial file paths
 * @type {Object<string, string>}
 */
export const SKILL_FILE_MAPPING = {
  // Programming Languages
  'python': '/skill-games/python.html',
  'java': '/skill-games/Java.html',
  'javascript': '/skill-games/javascript.html',

  // Frontend Technologies
  'html': '/skill-games/HTML.html',
  'css': '/skill-games/HTML.html', // CSS tutorial is combined with HTML
  'react': '/skill-games/React.html',
  'react native': '/skill-games/ReactNative.html',
  'next.js': '/skill-games/NextJS.html',
  'flutter': '/skill-games/flutter.html',
  'tailwind css': '/skill-games/Tailwind.html',
  'three.js': '/skill-games/ThreeJS.html',

  // Backend Technologies
  'apache': '/skill-games/Apache.html',
  'rest api': '/skill-games/HTML.html', // REST API tutorial combined with HTML
  'dsa': '/skill-games/DSA.html',
  'version control': '/skill-games/VersionControl.html',
  'express.js': '/skill-games/ExpressJS.html',
  'node.js': '/skill-games/NodeJS.html',
  'django': '/skill-games/Django.html',
  'flask': '/skill-games/Flask.html',
  'tensorflow': '/skill-games/TensorFlow.html',

  // Database Technologies
  'oracle': '/skill-games/OracleDB.html',
  'sql': '/skill-games/SQL.html',
  'postgresql': '/skill-games/PostgreSQL.html',
  'mongodb': '/skill-games/MongoDB.html',

  // Cloud Platforms
  'gcp': '/skill-games/HTML.html', // GCP tutorial combined with HTML
  'aws': '/skill-games/AWS.html',
  'azure': '/skill-games/HTML.html', // Azure tutorial combined with HTML

  // Development Tools
  'github': '/skill-games/GitHub.html',
  'docker': '/skill-games/Docker.html',
  'kubernetes': '/skill-games/HTML.html', // Kubernetes tutorial combined with HTML
};

/**
 * Get the tutorial file path for a given skill name
 * @param {string} skillName - The name of the skill
 * @returns {string|null} The file path or null if not found
 */
export const getSkillFilePath = (skillName) => {
  return SKILL_FILE_MAPPING[skillName.toLowerCase()] || null;
};
