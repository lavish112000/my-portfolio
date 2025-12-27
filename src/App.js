/**
 * ============================================================================
 * PORTFOLIO WEBSITE - MAIN APPLICATION COMPONENT
 * ============================================================================
 */

import React, { useCallback, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/dist/ScrollToPlugin';

import videoPlayerProfileImage from './Videoplayerprofile.png';
import TaskTracker from './TaskTracker.png';
import ResumeParser from './ResumeParser.png';
import NeonFlux from './NeonFlux.png';

import { trackProjectView, trackSkillGameInteraction } from './analytics';
import { getSkillGameRoute } from './constants/skillGameRoutes';

import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';

gsap.registerPlugin(ScrollToPlugin);

const BASE_PATH = (process.env.PUBLIC_URL || '').replace(/\/+$/, '');

const ROUTES = {
  landing: '/',
  home: '/home',
  profile: '/profile'
};

const withBasePath = (routePath) => {
  const cleanRoute = routePath || ROUTES.landing;
  if (!BASE_PATH) return cleanRoute;
  if (cleanRoute === ROUTES.landing) return BASE_PATH || '/';
  return `${BASE_PATH}${cleanRoute}`;
};

const getProjectRoute = (projectId) => `/project/${projectId}`;

const parseAppRoute = (pathname, projectData) => {
  const rawPath = typeof pathname === 'string' ? pathname : '/';
  const pathWithoutBase = BASE_PATH && rawPath.startsWith(BASE_PATH) ? rawPath.slice(BASE_PATH.length) || '/' : rawPath;
  const cleanPath = pathWithoutBase.replace(/\/+$/, '') || '/';

  if (cleanPath === ROUTES.landing || cleanPath === '/landing') {
    return { page: 'landing', project: null };
  }

  if (cleanPath === ROUTES.home) {
    return { page: 'home', project: null };
  }

  if (cleanPath === ROUTES.profile) {
    return { page: 'profile', project: null };
  }

  const projectMatch = cleanPath.match(/^\/project\/(\d+)$/);
  if (projectMatch) {
    const projectId = Number(projectMatch[1]);
    const project = projectData.find((item) => item.id === projectId) || null;
    return project ? { page: 'project-details', project } : { page: 'profile', project: null };
  }

  return { page: 'landing', project: null };
};

const pushRoute = (url) => {
  if (typeof window === 'undefined') return;
  const nextUrl = withBasePath(url || ROUTES.landing);
  if (window.location.pathname === nextUrl) return;
  window.history.pushState({}, '', nextUrl);
};

const HELLOS = [
  'Hello',
  '\u4F60\u597D',
  '\u0928\u092E\u0938\u094D\u0924\u0947',
  'Hola',
  'Bonjour',
  '\u0623\u0647\u0644\u0627\u064B',
  '\u09B9\u09CD\u09AF\u09BE\u09B2\u09CB',
  'Ol\u00E1',
  '\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439\u0442\u0435',
  '\u0633\u0644\u0627\u0645'
];

const PROJECT_DATA = [
  {
    id: 1,
    title: 'Scalable URL Shortener',
    tech: 'JavaScript, Node.js, Express.js, MongoDB, React',
    image: 'https://placehold.co/600x400/2E3192/fff?text=URL Shortener',
    details:
      "This project demonstrates a full-stack application for shortening URLs. The backend uses Node.js, Express.js, and MongoDB to handle URL redirection and storage. The frontend is built with React, providing a user-friendly interface for creating and managing short links. The project emphasizes scalability and performance.",
    impact:
      "Reduced link length by an average of 70%, improving user experience on a partner's social media platform. Handled over 10 million requests in the first month without downtime.",
    keyFeatures: ['Custom short URLs', 'Link analytics (clicks, location)', 'User authentication', 'RESTful API']
  },
  {
    id: 2,
    title: 'ResumeForge (Resume Parser)',
    tech: 'Next.Js, Tailwind CSS, JavaScript, Rest API',
    image: ResumeParser,
    details:
      'Created an enterprise-style resume builder focused on ATS optimization with template-driven editing, type-safe validation, and export capabilities (PDF/DOCX). The app emphasizes a smooth multi-step UX, responsive layout, and measurable feedback (ATS scoring + suggestions) to help users ship stronger resumes faster.',
    impact:
      'Improved completion rates through a guided workflow and reduced editing friction with reusable templates and validation-driven feedback, supporting a faster path from draft → export-ready resume.',
    achievements: [
      'Delivered an enterprise resume builder with 3 professional templates (Modern, Classic, ATS) and multi-step forms validated with Zod.',
      'Implemented real-time ATS-focused guidance and high-fidelity export to 2 formats (PDF, DOCX), reducing iteration cycles for job seekers.',
      'Integrated type-safe form handling (React Hook Form) and reusable UI components to improve accessibility and reliability across steps.',
      'Established a quality pipeline (typecheck, ESLint, Jest/RTL) to ensure consistent behavior before release.'
    ],
    keyFeatures: ['ATS-friendly templates', 'Multi-step builder flow', 'Type-safe validation', 'PDF/DOCX export']
  },
  {
    id: 3,
    title: 'NeonFlux Portfolio',
    tech: 'Next.Js, Tailwind CSS, Three.js',
    image: NeonFlux,
    details:
      'Crafted a glassmorphism-first portfolio with modern motion, strong performance hygiene, and curated project storytelling. The experience emphasizes polished visuals (3D + micro-interactions) while keeping navigation and content structure maintainable.',
    impact:
      'Demonstrates modern UI engineering patterns and performance-first delivery for a portfolio experience that stays responsive across devices.',
    achievements: [
      'Built a glassmorphism portfolio with 5+ core sections and AI-powered project curation.',
      'Implemented comprehensive quality tooling (typecheck, lint, format, tests) via “check-all” scripts to catch regressions early.',
      'Integrated AI development workflows and Firebase client libraries to enable scalable AI features.',
      'Optimized App Router performance with image optimization and fast dev tooling to improve developer velocity and runtime efficiency.'
    ],
    keyFeatures: ['Glassmorphism UI', '3D visual accents', 'Animated sections', 'Performance-focused UX']
  },
  {
    id: 4,
    title: 'Cosmic Player',
    tech: 'Next.Js, Tailwind CSS, JavaScript, GitHub',
    image: videoPlayerProfileImage,
    details:
      'Developed a 4K-ready video player experience with a modern web UI and desktop packaging workflow. The project focuses on playback UX, maintainability, and release discipline via strong testing and code-quality gates.',
    impact:
      'Improved delivery confidence via automated checks and repeatable builds, reducing regressions while iterating on UI and playback behaviors.',
    achievements: [
      'Developed a 4K-capable video player packaged for desktop (Electron + NSIS), extending reach beyond browsers.',
      'Enforced a 10-point code review checklist and a 70%+ test coverage quality gate across CI (GitHub Actions) to raise release rigor.',
      'Automated security audits, type checks, linting, formatting, and builds to reduce defects pre-merge and speed reviews.',
      'Standardized UI with Tailwind + reusable components and typed interfaces for maintainable, scalable features.'
    ],
    keyFeatures: ['4K playback UX', 'Desktop packaging workflow', 'Quality gates (tests/lint)', 'Reusable player components']
  },
  {
    id: 5,
    title: 'Task Management Application',
    tech: 'Python, Django, PostgreSQL, HTML, CSS',
    image: TaskTracker,
    details:
      'A Mobile-based task management application that allows users to create, assign, and track tasks. The backend is powered by Django and Python, using PostgreSQL as the database. The front end is a simple, responsive design built with HTML and CSS, focusing on usability and organization.',
    impact:
      'Improved team productivity by 25% by providing a centralized platform for task management. The intuitive design and clear organization of tasks led to a significant reduction in missed deadlines.',
    keyFeatures: ['Task creation and assignment', 'Task tracking', 'User roles and permissions', 'Email notifications']
  },
  {
    id: 6,
    title: 'Machine Learning Model API',
    tech: 'Python, Flask, TensorFlow, AWS',
    image: 'https://placehold.co/600x400/2E3192/fff?text=ML API',
    details:
      'Developed a REST API for a machine learning model. The model was trained using TensorFlow and Python, and the API was built with Flask. The application is deployed on AWS using Lambda and API Gateway, showcasing skills in cloud deployment and serving ML models.',
    impact:
      'Enabled real-time predictions with an average response time of 200ms. The serverless architecture on AWS resulted in a 60% cost saving compared to a traditional server-based deployment.',
    keyFeatures: ['RESTful API for ML model', 'TensorFlow integration', 'AWS Lambda and API Gateway deployment', 'Scalable and cost-effective']
  },
  {
    id: 7,
    title: 'EconomyTimes',
    tech: 'Next.Js, Tailwind CSS, JavaScript, Rest API',
    image: 'https://placehold.co/600x400/111827/fff?text=EconomyTimes',
    details:
      'Delivered a modern finance/economy platform with dashboard-style experiences, calculators, and MDX-based content. The architecture balances content workflows with interactive UI while keeping performance and accessibility top-of-mind.',
    impact:
      'Supports scalable content publishing and interactive engagement (dashboards + calculators) with instrumentation designed to improve reliability and iteration speed.',
    achievements: [
      'Built 5 specialized dashboards (Investing, Banking, Fintech, Global Finance, Economy) and 2 calculators (SIP, EMI) to cover key financial user journeys.',
      'Structured MDX content across 8 categories with auto TOC, reading time, and progress bars to lift content engagement quality.',
      'Instrumented the app with OpenTelemetry SDK + exporters, enabling end-to-end tracing and faster diagnostics across routes/components.',
      'Shipped responsive, accessible UX with Next.js App Router, Tailwind v4 patterns, and dark mode for cross-device usability.'
    ],
    keyFeatures: ['MDX content pipeline', 'Dashboards & calculators', 'API routes for market data', 'Observability-ready instrumentation']
  },
  {
    id: 8,
    title: 'Tech-Knowlogia (Blogging Platform)',
    tech: 'Next.Js, Tailwind CSS, JavaScript, Three.js',
    image: 'https://placehold.co/600x400/2E3192/fff?text=Tech-Knowlogia',
    details:
      'Engineered an SEO-first publishing platform with an MDX workflow and CMS-friendly content structure. The app separates public content from admin workflows and produces SEO artifacts like sitemaps and RSS for discoverability.',
    impact:
      'Improves editorial velocity and search visibility by automating SEO outputs and structuring content for scalable publishing.',
    achievements: [
      'Shipped an SEO-first platform with 2 admin surfaces (Decap CMS, Private Admin Dashboard) and 3 discovery assets (sitemap, Google News sitemap, RSS).',
      'Implemented animated category pages using Three.js and motion patterns to elevate UX across 5 content categories.',
      'Enabled optional persistence via MongoDB Atlas (Mongoose), plus role-based permissions for safer editorial operations.',
      'Automated metadata, JSON-LD, canonical URLs, and sitemaps for scalable publishing.'
    ],
    keyFeatures: ['MDX publishing workflow', 'SEO utilities (sitemap/RSS)', 'Admin vs public surfaces', 'Optional MongoDB persistence']
  },
  {
    id: 9,
    title: 'Finance Website',
    tech: 'Next.Js, Tailwind CSS, JavaScript, Rest API',
    image: 'https://placehold.co/600x400/065F46/fff?text=Finance+Website',
    details:
      'Built a finance media platform optimized for Discover/News-style SEO with a content pipeline and dynamic SEO assets. The project focuses on structured metadata, fast rendering, and repeatable publishing workflows.',
    impact:
      'Boosts search readiness via automated RSS/sitemaps and consistent metadata/OG generation, enabling scalable content operations.',
    achievements: [
      'Built a finance media platform that automates 3 SEO assets (dynamic OG images, News sitemap, RSS), accelerating distribution and visibility.',
      'Implemented role-based admin across 3 roles (Admin, Editor, Analyst) with private dashboards and editorial workflows to streamline publishing.',
      'Achieved Core Web Vitals optimization with Lighthouse 95+ targets via image optimization and code splitting strategies.',
      'Structured MDX content for 5 categories with trending and breaking systems to enable prioritized surfacing of high-impact articles.'
    ],
    keyFeatures: ['News/Discover SEO readiness', 'Dynamic OG/RSS/sitemaps', 'MDX-friendly content utilities', 'Performance-focused UI']
  },
  {
    id: 10,
    title: 'Erp-Wala (School Chale Hum)',
    tech: 'HTML, CSS, JavaScript, Tailwind CSS',
    image: 'https://placehold.co/600x400/7C3AED/fff?text=Erp-Wala',
    details:
      'Shipped a responsive, animation-rich educational ERP marketing site with multiple module pages and form flows. The implementation stays lightweight while still delivering a polished product experience.',
    impact:
      'Demonstrates strong static-site delivery with practical serverless form handling and accessibility-minded UI composition.',
    achievements: [
      'Shipped a responsive static ERP site comprising 7 core module pages + 3 themed lead forms (10+ pages total) with accessible UX.',
      'Integrated serverless email forms via FormSubmit (honeypot, table-format emails) with 0 secrets required and one-time email verification.',
      'Implemented 8+ CSS keyframe animations and 6+ interaction patterns (scroll reveal, hover effects) to improve engagement.',
      'Documented multiple deployment paths (GitHub Pages, Netlify, Vercel) and performance targets (90+ Lighthouse) for repeatable launches.'
    ],
    keyFeatures: ['Multi-page module site', 'Responsive layout', 'Serverless form handling', 'No-backend deployment simplicity']
  }
];

const isMobileUserAgent = (userAgent) => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
};

const isMobileViewport = (width) => width <= 1024;

const detectIsMobileDevice = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const width = typeof window !== 'undefined' ? window.innerWidth : Number.POSITIVE_INFINITY;
  return isMobileUserAgent(ua) || isMobileViewport(width);
};

const GyroscopeHint = ({ onClose }) => {
  return (
    <div className="fixed top-20 left-4 right-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 rounded-lg shadow-2xl z-50 animate-pulse border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-3xl animate-spin">{'\u21BB'}</div>
          <div>
            <p className="text-white font-bold text-sm">Gyroscope Mode Active!</p>
            <p className="text-blue-100 text-xs">
              <span className="font-semibold">Tilt</span>{' '}your device to interact with the profile card
            </p>
            <p className="text-purple-100 text-xs mt-1">
              <span className="font-semibold">Tap</span>{' '}the profile card on iOS for permission
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-300 text-xl font-bold bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
        >
          {'\u00D7'}
        </button>
      </div>
    </div>
  );
};

const PageContent = ({
  currentPage,
  hellos,
  onLandingComplete,
  onProjectClick,
  previousScrollY,
  setPreviousScrollY,
  projectData,
  onSkillClick,
  isMobileDevice,
  selectedProject,
  onBackToProjects
}) => {
  switch (currentPage) {
    case 'landing':
      return (
        <div className="page-transition page-enter-active">
          <LandingPage hellos={hellos} onComplete={onLandingComplete} />
        </div>
      );

    case 'home':
    case 'profile':
      return (
        <div className="page-transition page-enter-active">
          <ProfilePage
            onProjectClick={onProjectClick}
            previousScrollY={previousScrollY}
            setPreviousScrollY={setPreviousScrollY}
            isVisible={true}
            projectData={projectData}
            onSkillClick={onSkillClick}
            isMobileDevice={isMobileDevice}
            pagePath={`/${currentPage}`}
          />
        </div>
      );

    case 'project-details':
      return (
        <div className="page-transition page-enter-active">
          <ProjectDetailsPage project={selectedProject} onBack={onBackToProjects} />
        </div>
      );

    default:
      return (
        <div className="page-transition page-enter-active">
          <LandingPage hellos={hellos} onComplete={onLandingComplete} />
        </div>
      );
  }
};

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedProject, setSelectedProject] = useState(null);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState('');
  const [showGyroscopeHint, setShowGyroscopeHint] = useState(false);

  const isMobileDevice = useCallback(() => {
    return detectIsMobileDevice();
  }, []);

  useEffect(() => {
    if (!isMobileDevice()) return;

    const timer = setTimeout(() => {
      setShowGyroscopeHint(true);
      setTimeout(() => setShowGyroscopeHint(false), 6000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isMobileDevice]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const applyRouteToState = () => {
      const { page, project } = parseAppRoute(window.location.pathname, PROJECT_DATA);
      setSelectedProject(project);
      setCurrentPage(page);
    };

    applyRouteToState();

    const onPopState = () => {
      applyRouteToState();
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);


  const handleProjectClick = (project, containerRef) => {
    if (containerRef.current) {
      setPreviousScrollY(containerRef.current.scrollTop);
    }

    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 0.4,
      ease: 'power2.inOut'
    });

    setTimeout(() => {
      setSelectedProject(project);
      setCurrentPage('project-details');
      setCurrentSection('projects');
      pushRoute(getProjectRoute(project.id));
      trackProjectView(project.title);
    }, 200);
  };

  const handleBackToProjects = (options = {}) => {
    const { skipHistory } = options;
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
      setCurrentPage('profile');
      setSelectedProject(null);
      if (!skipHistory) pushRoute(ROUTES.profile);
      setTimeout(() => {
        const projectsElement = document.getElementById('projects');
        projectsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    gsap.to(mainContent, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setCurrentPage('profile');
        setSelectedProject(null);
        if (!skipHistory) pushRoute(ROUTES.profile);

        gsap.to(mainContent, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.in'
        });

        setTimeout(() => {
          const projectsElement = document.getElementById('projects');
          projectsElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    });
  };

  const handleSkillClick = (skillName) => {
    setCurrentSection('skills');

    const targetPath = getSkillGameRoute(skillName);
    if (!targetPath) {
      console.log(`No specific page found for skill: ${skillName}`);
      return;
    }

    trackSkillGameInteraction(skillName.toLowerCase(), 'click');

    const body = document.body;
    if (!body) {
      window.open(targetPath, '_blank');
      return;
    }

    gsap.to(body, {
      opacity: 0.7,
      duration: 0.2,
      ease: 'power2.out',
      onComplete: () => {
        window.open(targetPath, '_blank');
        gsap.to(body, { opacity: 1, duration: 0.2, ease: 'power2.in' });
      }
    });
  };

  const handleBackFromSkills = useCallback(() => {
    const skillsElement = document.getElementById('skills');
    if (!skillsElement) return;

    gsap.to(window, {
      scrollTo: { y: skillsElement, autoKill: false, offsetY: 20 },
      duration: 0.6,
      ease: 'power2.inOut'
    });
  }, []);

  const handleWindowFocus = useCallback(() => {
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');

    setTimeout(() => {
      document.body.classList.remove('fade-in');

      const focusHandlers = {
        skills: handleBackFromSkills,
        projects: () => handleBackToProjects({ skipHistory: true })
      };
      focusHandlers[currentSection]?.();

      setCurrentSection('');
    }, 500);
  }, [currentSection, handleBackFromSkills]);

  useEffect(() => {
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [handleWindowFocus]);

  const handleLandingComplete = () => {
    const appElement = document.querySelector('.App');
    if (!appElement) {
      setCurrentPage('home');
      pushRoute(ROUTES.home);
      return;
    }

    gsap.to(appElement, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setCurrentPage('home');
        pushRoute(ROUTES.home);
        gsap.to(appElement, { opacity: 1, duration: 0.4, ease: 'power2.in' });
      }
    });
  };

  return (
    <div className="App ambient-light-container">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageContent
          currentPage={currentPage}
          hellos={HELLOS}
          onLandingComplete={handleLandingComplete}
          onProjectClick={handleProjectClick}
          previousScrollY={previousScrollY}
          setPreviousScrollY={setPreviousScrollY}
          projectData={PROJECT_DATA}
          onSkillClick={handleSkillClick}
          isMobileDevice={isMobileDevice}
          selectedProject={selectedProject}
          onBackToProjects={handleBackToProjects}
        />
      </div>

      {showGyroscopeHint && isMobileDevice() && (
        <GyroscopeHint onClose={() => setShowGyroscopeHint(false)} />
      )}
    </div>
  );
};

export default App;
