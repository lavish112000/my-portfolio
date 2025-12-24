// Skill name -> static HTML page route mapping for /public/skill-games

const normalizeSkillName = (skillName) => {
  if (typeof skillName !== 'string') return '';
  return skillName.trim().toLowerCase().replace(/\s+/g, ' ');
};

const SKILL_GAME_ROUTES = Object.freeze({
  // Programming Languages
  python: '/skill-games/python.html',
  java: '/skill-games/Java.html',
  javascript: '/skill-games/javascript.html',

  // Frontend Technologies
  html: '/skill-games/HTML.html',
  css: '/skill-games/HTML.html',
  react: '/skill-games/React.html',
  'react native': '/skill-games/ReactNative.html',
  'next.js': '/skill-games/NextJS.html',
  flutter: '/skill-games/flutter.html',
  'tailwind css': '/skill-games/Tailwind.html',
  'three.js': '/skill-games/ThreeJS.html',

  // Backend Technologies
  apache: '/skill-games/Apache.html',
  'rest api': '/skill-games/HTML.html',
  dsa: '/skill-games/DSA.html',
  'version control': '/skill-games/VersionControl.html',
  'express.js': '/skill-games/ExpressJS.html',
  'node.js': '/skill-games/NodeJS.html',
  django: '/skill-games/Django.html',
  flask: '/skill-games/Flask.html',
  tensorflow: '/skill-games/TensorFlow.html',

  // Database Technologies
  oracle: '/skill-games/OracleDB.html',
  sql: '/skill-games/SQL.html',
  postgresql: '/skill-games/PostgreSQL.html',
  mongodb: '/skill-games/MongoDB.html',

  // Cloud Platforms
  gcp: '/skill-games/HTML.html',
  aws: '/skill-games/AWS.html',
  azure: '/skill-games/HTML.html',

  // Development Tools
  github: '/skill-games/GitHub.html',
  docker: '/skill-games/Docker.html',
  kubernetes: '/skill-games/HTML.html'
});

export const getSkillGameRoute = (skillName) => {
  const key = normalizeSkillName(skillName);
  return SKILL_GAME_ROUTES[key] || '';
};
