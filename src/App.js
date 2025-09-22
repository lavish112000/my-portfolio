/**
 * ============================================================================
 * PORTFOLIO WEBSITE - MAIN APPLICATION COMPONENT
 * ============================================================================
 *
 * @fileoverview Main React application component for a comprehensive portfolio website
 * @description This component serves as the root of the portfolio application, managing
 *              state, navigation, animations, and rendering of all portfolio sections.
 *
 * FEATURES:
 * - Multi-page navigation (Home, Profile, Project Details)
 * - Interactive skill games with external HTML tutorials
 * - Animated landing page with multilingual greetings
 * - Scroll-based animations and transitions
 * - Contact form with email integration
 * - Analytics tracking for user interactions
 * - Responsive design with Tailwind CSS
 * - 3D animations using Three.js
 *
 * ARCHITECTURE:
 * - Single-page application with state-based navigation
 * - Component composition with reusable sub-components
 * - External skill game integration via window.open()
 * - Scroll-triggered animations using GSAP
 * - Email functionality via EmailJS
 *
 * DEPENDENCIES:
 * - React: Core framework for component-based UI
 * - Three.js: 3D graphics and animations
 * - GSAP: Animation library for smooth transitions
 * - EmailJS: Client-side email sending
 * - Tailwind CSS: Utility-first CSS framework
 * - Analytics: Custom tracking functions
 *
 * @author Lalit Choudhary
 * @version 1.0.0
 * @since 2024
 */

import React, { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';
import profileImage from './profile.jpg';
import ProfileCard from './components/ProfileCard';
import videoPlayerProfileImage from './Videoplayerprofile.png';
import TaskTracker from './TaskTracker.png';
import ResumeParser from './ResumeParser.png';
import NeonFlux from './NeonFlux.png';
import { trackPageView, trackProjectView, trackSkillGameInteraction, trackContactSubmission } from './analytics';
import ScrollFloat from './ScrollFloat';
// Lazy load advanced Prism effect (declared after other imports for lint ordering)
const Prism = lazy(() => import('./Prism'));

// Lazy load StaggeredMenu
const StaggeredMenu = lazy(() => import('./StaggeredMenu'));

/**
 * ============================================================================
 * MAIN APPLICATION COMPONENT
 * ============================================================================
 *
 * @component App
 * @description Root component that orchestrates the entire portfolio website
 * @returns {JSX.Element} Complete portfolio application
 */
const App = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Navigation state for managing different views
   * @type {string} currentPage - Current active page ('home', 'profile', 'project-details')
   */
  const [currentPage, setCurrentPage] = useState('home');

  /**
   * Profile page visibility state
   * @type {boolean} showProfile - Controls profile page display
   */
  const [showProfile, setShowProfile] = useState(false);

  /**
   * Selected project for detailed view
   * @type {Object|null} selectedProject - Currently selected project object
   */
  const [selectedProject, setSelectedProject] = useState(null);

  /**
   * Scroll position tracking for smooth transitions
   * @type {number} previousScrollY - Previous scroll position for restoration
   */
  const [previousScrollY, setPreviousScrollY] = useState(0);

  /**
   * Current section tracking for navigation context
   * @type {string} currentSection - Current active section ('skills' or 'projects')
   */
  const [currentSection, setCurrentSection] = useState('');

  // ============================================================================
  // STATIC DATA
  // ============================================================================

  /**
   * Multilingual greeting array for landing page animation
   * @description Array of "Hello" in different languages for the initial loading animation
   * @type {string[]}
   */
  const hellos = [
    'Hello',      // English
    '你好',       // Chinese (Mandarin)
    'नमस्ते',     // Hindi
    'Hola',       // Spanish
    'Bonjour',    // French
    'أهلاً',      // Arabic
    'হ্যালো',     // Bengali
    'Olá',        // Portuguese
    'Здравствуйте', // Russian
    'سلام'        // Persian
  ];

  /**
   * Portfolio projects data
   * @description Array of project objects containing detailed information about each project
   * @type {Array<Object>}
   */
  const projectData = [
    {
      id: 1,
      title: 'Scalable URL Shortener',
      tech: 'JavaScript, Node.js, Express.js, MongoDB, React',
      image: 'https://placehold.co/600x400/2E3192/fff?text=URL Shortener',
      details: 'This project demonstrates a full-stack application for shortening URLs. The backend uses Node.js, Express.js, and MongoDB to handle URL redirection and storage. The frontend is built with React, providing a user-friendly interface for creating and managing short links. The project emphasizes scalability and performance.',
      impact: 'Reduced link length by an average of 70%, improving user experience on a partner\'s social media platform. Handled over 10 million requests in the first month without downtime.',
      keyFeatures: ['Custom short URLs', 'Link analytics (clicks, location)', 'User authentication', 'RESTful API'],
    },
    {
      id: 2,
      title: 'Resume-Parser',
      tech: 'HTML, CSS, Supabase, JavaScript',
      image: ResumeParser,
      details: 'Developed a responsive and interactive resume parser application. The site features a clean and attractive UI/UX design. Supabase was used to store user data and resume details, enabling efficient data management and a personalized experience.',
      impact: 'Increased user engagement by 30% in the first quarter after launch. The new UI/UX design led to a 50% increase in user satisfaction and a 20% decrease in bounce rate.',
      keyFeatures: ['Resume upload', 'Data extraction', 'User accounts', 'Analytics dashboard'],
    },
    {
      id: 3,
      title: 'NeonFlux Portfolio Website',
      tech: 'React, Tailwind CSS, Three.js',
      image: NeonFlux,
      details: 'A personal portfolio website built with modern technologies. It features a custom landing page with a 3D animated greeting, a dynamic homepage with a wave effect, and a profile page with animated sections. The site is fully responsive and designed for a smooth user experience.',
      impact: 'Showcased my skills and projects to potential employers, leading to a 40% increase in interview requests. The animated and interactive design received positive feedback for its creativity and user engagement.',
      keyFeatures: ['3D landing page', 'Dynamic wave effect', 'Animated skill sections', 'Responsive design'],
    },
    {
      id: 4,
      title: 'Cosmic Video player',
      tech: 'React Native, Node.js, Express.js, MongoDB',
      image: videoPlayerProfileImage,
      details: 'A mobile-first Cosmic Video player application with features like dynamic UI , Fast and smooth user experience, and comments. Built with React Native for cross-platform compatibility, a Node.js backend with Express.js for REST APIs, and MongoDB for flexible data storage. The project focuses on real-time updates and user engagement.',
      impact: 'Achieved a high-performance video playback with minimal buffering, resulting in a 95% user satisfaction rate. The cross-platform nature of React Native allowed for a 50% reduction in development time and cost.',
      keyFeatures: ['4K video playback', 'Dynamic UI', 'Real-time comments', 'Cross-platform compatibility'],
    },
    {
      id: 5,
      title: 'Task Management Application',
      tech: 'Python, Django, PostgreSQL, HTML, CSS',
      image: TaskTracker,
      details: 'A Mobile-based task management application that allows users to create, assign, and track tasks. The backend is powered by Django and Python, using PostgreSQL as the database. The front end is a simple, responsive design built with HTML and CSS, focusing on usability and organization.',
      impact: 'Improved team productivity by 25% by providing a centralized platform for task management. The intuitive design and clear organization of tasks led to a significant reduction in missed deadlines.',
      keyFeatures: ['Task creation and assignment', 'Task tracking', 'User roles and permissions', 'Email notifications'],
    },
    {
      id: 6,
      title: 'Machine Learning Model API',
      tech: 'Python, Flask, TensorFlow, AWS',
      image: 'https://placehold.co/600x400/2E3192/fff?text=ML API',
      details: 'Developed a REST API for a machine learning model. The model was trained using TensorFlow and Python, and the API was built with Flask. The application is deployed on AWS using Lambda and API Gateway, showcasing skills in cloud deployment and serving ML models.',
      impact: 'Enabled real-time predictions with an average response time of 200ms. The serverless architecture on AWS resulted in a 60% cost saving compared to a traditional server-based deployment.',
      keyFeatures: ['RESTful API for ML model', 'TensorFlow integration', 'AWS Lambda and API Gateway deployment', 'Scalable and cost-effective'],
    },
  ];

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  /**
   * Handles project selection and navigation to project details page
   * @function handleProjectClick
   * @param {Object} project - The selected project object containing all project details
   * @param {Object} containerRef - Reference to the scrollable container for position tracking
   * @description
   * - Saves current scroll position for restoration
   * - Updates selected project state
   * - Navigates to project details view
   * - Tracks the navigation context (projects section)
   * - Sends analytics event for project view tracking
   */
  const handleProjectClick = (project, containerRef) => {
    // Preserve scroll position for smooth return navigation
    if (containerRef.current) {
      setPreviousScrollY(containerRef.current.scrollTop);
    }

    // Update application state for project details view
    setSelectedProject(project);
    setCurrentPage('project-details');
    setCurrentSection('projects'); // Track navigation context

    // Track user interaction for analytics
    trackProjectView(project.title);
  };

  /**
   * Handles navigation back to projects section from project details
   * @function handleBackToProjects
   * @description
   * - Resets to profile page view
   * - Clears selected project
   * - Smoothly scrolls to projects section after transition
   * - Uses timeout to ensure DOM is ready for scrolling
   */
  const handleBackToProjects = () => {
    // Reset navigation state
    setCurrentPage('profile');
    setSelectedProject(null);

    // Smooth scroll to projects section after page transition
    setTimeout(() => {
      const projectsElement = document.getElementById('projects');
      if (projectsElement) {
        projectsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100); // Brief delay for DOM readiness
  };

  /**
   * Handles skill card clicks and navigation to external skill tutorials
   * @function handleSkillClick
   * @param {string} skillName - The name of the clicked skill (case-insensitive)
   * @description
   * Core navigation function that:
   * - Maps skill names to their corresponding HTML tutorial files
   * - Opens tutorials in new tabs for better UX
   * - Tracks navigation context for return navigation
   * - Applies smooth page transitions
   * - Sends analytics events for skill interaction tracking
   *
   * SUPPORTED SKILLS:
   * - Programming Languages: Python, Java, JavaScript
   * - Frontend: HTML, CSS, React, Next.js, Flutter, Tailwind CSS, Three.js
   * - Backend: Apache, Django, Flask, TensorFlow, Express.js, Node.js
   * - Databases: Oracle, SQL, PostgreSQL, MongoDB
   * - Cloud: GCP, AWS, Azure
   * - Tools: GitHub, Docker, Kubernetes
   */
  const handleSkillClick = (skillName) => {
    // Track navigation context for return navigation
    setCurrentSection('skills');

    // Initialize target path variable
    let targetPath = '';

    // ============================================================================
    // SKILL NAME TO FILE PATH MAPPING
    // ============================================================================
    // Maps user-friendly skill names to their corresponding HTML tutorial files
    // All paths are relative to the public folder and serve static HTML content
    switch (skillName.toLowerCase()) {
      // Programming Languages
      case 'python':
        targetPath = '/skill-games/python.html';
        break;
      case 'java':
        targetPath = '/skill-games/Java.html';
        break;
      case 'javascript':
        targetPath = '/skill-games/javascript.html';
        break;

      // Frontend Technologies
      case 'html':
        targetPath = '/skill-games/HTML.html';
        break;
      case 'css':
        targetPath = '/skill-games/HTML.html'; // CSS tutorial is combined with HTML
        break;
      case 'react':
        targetPath = '/skill-games/React.html';
        break;
      case 'react native':
        targetPath = '/skill-games/ReactNative.html';
        break;
      case 'next.js':
        targetPath = '/skill-games/NextJS.html';
        break;
      case 'flutter':
        targetPath = '/skill-games/flutter.html';
        break;
      case 'tailwind css':
        targetPath = '/skill-games/Tailwind.html';
        break;
      case 'three.js':
        targetPath = '/skill-games/ThreeJS.html';
        break;

      // Backend Technologies
      case 'apache':
        targetPath = '/skill-games/Apache.html';
        break;
      case 'rest api':
        targetPath = '/skill-games/HTML.html'; // REST API tutorial combined with HTML
        break;
      case 'dsa':
        targetPath = '/skill-games/DSA.html';
        break;
      case 'version control':
        targetPath = '/skill-games/VersionControl.html';
        break;
      case 'express.js':
        targetPath = '/skill-games/ExpressJS.html';
        break;
      case 'node.js':
        targetPath = '/skill-games/NodeJS.html';
        break;
      case 'django':
        targetPath = '/skill-games/Django.html';
        break;
      case 'flask':
        targetPath = '/skill-games/Flask.html';
        break;
      case 'tensorflow':
        targetPath = '/skill-games/TensorFlow.html';
        break;

      // Database Technologies
      case 'oracle':
        targetPath = '/skill-games/OracleDB.html';
        break;
      case 'sql':
        targetPath = '/skill-games/SQL.html';
        break;
      case 'postgresql':
        targetPath = '/skill-games/PostgreSQL.html';
        break;
      case 'mongodb':
        targetPath = '/skill-games/MongoDB.html';
        break;

      // Cloud Platforms
      case 'gcp':
        targetPath = '/skill-games/HTML.html'; // GCP tutorial combined with HTML
        break;
      case 'aws':
        targetPath = '/skill-games/AWS.html';
        break;
      case 'azure':
        targetPath = '/skill-games/HTML.html'; // Azure tutorial combined with HTML
        break;

      // Development Tools
      case 'github':
        targetPath = '/skill-games/GitHub.html';
        break;
      case 'docker':
        targetPath = '/skill-games/Docker.html';
        break;
      case 'kubernetes':
        targetPath = '/skill-games/HTML.html'; // Kubernetes tutorial combined with HTML
        break;

      // Default case for unmapped skills
      default:
        console.log(`No specific page found for skill: ${skillName}`);
        return; // Exit function if skill is not mapped
    }

    // ============================================================================
    // ANALYTICS TRACKING
    // ============================================================================
    // Track skill game interaction for user behavior analysis
    trackSkillGameInteraction(skillName.toLowerCase(), 'click');

    // ============================================================================
    // SMOOTH PAGE TRANSITION
    // ============================================================================
    // Apply fade-out effect before opening new window
    document.body.classList.add('fade-out');

    // Open skill tutorial in new tab with transition delay
    setTimeout(() => {
      window.open(targetPath, '_blank');
    }, 300); // 300ms delay to allow fade-out animation to complete
  };

  // Handle back navigation from skill games
  const handleBackFromSkills = useCallback(() => {
    // Scroll to skills section after a brief delay to allow page transition
    setTimeout(() => {
      const skillsElement = document.getElementById('skills');
      if (skillsElement) {
        skillsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  }, []);

  // Handle smooth transition when returning from skill games
  const handleWindowFocus = useCallback(() => {
    document.body.classList.remove('fade-out');
    document.body.classList.add('fade-in');
    setTimeout(() => {
      document.body.classList.remove('fade-in');
      // Navigate back to the appropriate section based on where user came from
      if (currentSection === 'skills') {
        handleBackFromSkills();
      } else if (currentSection === 'projects') {
        handleBackToProjects();
      }
      setCurrentSection(''); // Reset the section tracking
    }, 500);
  }, [currentSection, handleBackFromSkills]);

  // Add event listener for when user returns to the main page
  useEffect(() => {
    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [handleWindowFocus]);

  const HomeAndLandingPage = ({ onTransitionEnd }) => {
    const mountRef = useRef(null);
    const [currentHello, setCurrentHello] = useState(hellos[0]);
    const [showButton, setShowButton] = useState(false);
    const backgroundGradient = 'from-[#2E3192] to-[#00FFE9]';

    useEffect(() => {
      const currentMount = mountRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      currentMount.appendChild(renderer.domElement);
      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      let index = 0;
      const intervalId = setInterval(() => {
        index = (index + 1) % hellos.length;
        setCurrentHello(hellos[index]);
      }, 250);

      const timerId = setTimeout(() => {
        clearInterval(intervalId);
        setShowButton(true);
        setTimeout(onTransitionEnd, 1000); // Signal to the parent component to start the transition
      }, 2500);

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      animate();

      return () => {
        clearInterval(intervalId);
        clearTimeout(timerId);
        window.removeEventListener('resize', handleResize);
        if (currentMount) {
          currentMount.removeChild(renderer.domElement);
        }
        renderer.dispose();
      };
    }, [onTransitionEnd]);

    return (
      <div className={`relative w-screen h-screen overflow-hidden bg-gradient-to-b ${backgroundGradient}`}>
        <div ref={mountRef} className="absolute inset-0"></div>
        
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${showButton ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div key={currentHello} className="text-white text-6xl font-bold transition-all duration-200 ease-in-out scale-[400%]">
            {currentHello}
          </div>
        </div>
      </div>
    );
  };

  const ProjectDetailsPage = ({ project, onBack }) => {
    // Refs for interactive panels
    const panelRefs = useRef([]);
    const particleLayers = useRef([]);

    // Initialize particle + interaction effects
    useEffect(() => {
      const panels = panelRefs.current.filter(Boolean);
      if (!panels.length) return;

      // Helper to create floating particles inside a panel
      const createParticles = (panel) => {
        const layer = document.createElement('div');
        layer.style.position = 'absolute';
        layer.style.inset = '0';
        layer.style.overflow = 'hidden';
        layer.style.pointerEvents = 'none';
        layer.style.zIndex = '0';
        panel.appendChild(layer);
        for (let i = 0; i < 14; i++) {
          const p = document.createElement('div');
            p.className = 'pd-particle';
            const x = Math.random()*100;
            const y = Math.random()*100;
            p.style.left = x+'%';
            p.style.top = y+'%';
            layer.appendChild(p);
            // animate
            gsap.to(p, {duration: 0.6, opacity:1, delay: Math.random()*1});
            const drift = () => {
              gsap.to(p, { x: (Math.random()-0.5)*40, y:(Math.random()-0.5)*40, duration: 6+Math.random()*6, ease:'sine.inOut', onComplete: drift});
              gsap.to(p, { opacity: 0.3+Math.random()*0.7, duration: 3+Math.random()*3, ease:'sine.inOut'});
            };
            drift();
        }
        return layer;
      };

      panels.forEach(panel => {
        // create particle layer
        particleLayers.current.push(createParticles(panel));
        const handleMove = (e) => {
          const rect = panel.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          // Increased tilt intensity (previously 10deg each axis → now 18deg)
          const rx = ((y / rect.height) - 0.5) * -18;
          const ry = ((x / rect.width) - 0.5) * 18;
          panel.style.setProperty('--mx', (x/rect.width*100)+'%');
          panel.style.setProperty('--my', (y/rect.height*100)+'%');
          panel.style.setProperty('--glow-alpha', '1');
          gsap.to(panel, { rotateX: rx, rotateY: ry, duration: 0.35, ease:'power2.out'});
          gsap.to(panel, { boxShadow: '0 15px 35px -6px rgba(132,0,255,0.35), 0 0 55px -6px rgba(132,0,255,0.55)', duration:0.45, ease:'power2.out'});
        };
        const handleLeave = () => {
          panel.style.setProperty('--glow-alpha', '0');
          gsap.to(panel, { rotateX:0, rotateY:0, duration:0.6, ease:'power3.out'});
          gsap.to(panel, { boxShadow: '0 4px 12px rgba(0,0,0,0.4)', duration:0.6, ease:'power3.out'});
        };
        const handleClick = (e) => {
          const rect = panel.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          // Create ripple element
          const ripple = document.createElement('div');
          const maxDist = Math.max(
            Math.hypot(x, y),
            Math.hypot(rect.width - x, y),
            Math.hypot(x, rect.height - y),
            Math.hypot(rect.width - x, rect.height - y)
          );
          ripple.style.cssText = `position:absolute;left:${x - maxDist}px;top:${y - maxDist}px;width:${maxDist*2}px;height:${maxDist*2}px;border-radius:50%;pointer-events:none;mix-blend-mode:screen;background:radial-gradient(circle, rgba(132,0,255,0.55) 0%, rgba(132,0,255,0.25) 35%, transparent 70%);opacity:0.85;`; 
          panel.appendChild(ripple);
          // Animate ripple
          gsap.fromTo(ripple,{scale:0,opacity:0.85},{scale:1,opacity:0, duration:0.9, ease:'power3.out', onComplete:()=>ripple.remove()});
          // Panel pulse + glow flash
          gsap.fromTo(panel, { scale:1 }, { scale:1.035, duration:0.18, ease:'power2.out', yoyo:true, repeat:1 });
          gsap.fromTo(panel, { '--glow-alpha': 1 }, { '--glow-alpha': 0.4, duration:0.6, ease:'sine.out'});
        };
        panel.addEventListener('mousemove', handleMove);
        panel.addEventListener('mouseleave', handleLeave);
        panel.addEventListener('click', handleClick);
        panel.__cleanup = () => {
          panel.removeEventListener('mousemove', handleMove);
          panel.removeEventListener('mouseleave', handleLeave);
          panel.removeEventListener('click', handleClick);
        };
      });

      return () => {
        panels.forEach(p => { p.__cleanup && p.__cleanup(); });
        particleLayers.current.forEach(layer => layer && layer.remove());
        particleLayers.current = [];
      };
    }, []);
    const skillsByCategory = {
      'Languages': [
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      ],
      'Frontend': [
        { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
        { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg' },
        { name: 'Next.Js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      ],
      'Backend': [
        { name: 'Apache', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg' },
        { name: 'Rest API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: 'DSA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
        { name: 'Version control', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
        { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
        { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
      ],
      'Databases': [
        { name: 'Oracle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      ],
      'Cloud': [
        { name: 'GCP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
        { name: 'AWS', icon: 'https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000' },
        { name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
      ],
      'Tools': [
        { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg' },
      ],
      'App Development': [
        { name: 'App studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg' },
        { name: 'VS code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
        { name: 'Windurf', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg' },
      ]
    };
    const allSkills = Object.values(skillsByCategory).flat();

    return (
      <div className="w-screen h-screen text-white font-sans overflow-auto bg-gradient-to-b from-[#2E3192] to-[#00FFE9] p-10">
        <div className="container mx-auto max-w-7xl">
          <button onClick={onBack} className="text-white text-xl font-bold hover:text-blue-400 transition-colors duration-200 mb-8">
            ← Back to My Work
          </button>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column */}
            <div className="lg:w-1/2">
              <div ref={el => panelRefs.current[0]=el} className="pd-panel p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm">
                <div className="w-full h-auto mb-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-xl relative">
                  <img src={project.image} alt={project.title} className="w-full object-cover"/>
                  <div className="absolute inset-0 border-4 border-transparent rounded-lg animate-glow" style={{'--glow-color': '#00FFE9'}}></div>
                </div>
                <h3 className="text-4xl font-bold mt-4">{project.title}</h3>
                <p className="text-gray-300 text-lg mt-2">{project.details}</p>
              </div>
            </div>
            {/* Right Column */}
            <div className="lg:w-1/2">
              <div ref={el => panelRefs.current[1]=el} className="pd-panel p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm mb-8">
                <h4 className="text-3xl font-bold mb-4">Project Impact</h4>
                <p className="text-gray-300 text-lg leading-relaxed">{project.impact}</p>
              </div>
              <div ref={el => panelRefs.current[2]=el} className="pd-panel p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm mb-8">
                <h4 className="text-3xl font-bold mb-4">Key Features</h4>
                <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
                  {project.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
              <div ref={el => panelRefs.current[3]=el} className="pd-panel p-8 rounded-xl shadow-2xl bg-gray-800/60 backdrop-blur-sm">
                <h4 className="text-3xl font-bold mb-4">Technologies Used</h4>
                <div className="flex flex-wrap gap-4">
                  {project.tech.split(',').map((techName, index) => {
                    const tech = allSkills.find(t => t.name.toLowerCase() === techName.trim().toLowerCase());
                    if (tech) {
                      return (
                        <div key={tech.name} className="flex items-center space-x-2 bg-gray-700 bg-opacity-50 px-3 py-2 rounded-lg animate-float-icon-1" style={{animationDelay: `${index * 100}ms`}}>
                          {tech.customIcon ? tech.customIcon : <img src={tech.icon} alt={tech.name} className="w-8 h-8 animate-spin-slow"/>}
                          <span className="text-white font-bold">{tech.name}</span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced interactive effects (glow, tilt, particles) */}
        <style>
          {`
            .pd-panel {
              position: relative;
              --glow-color-rgb: 132,0,255;
              --glow-alpha: 0;
              transition: box-shadow .35s ease, transform .3s ease;
              will-change: transform, box-shadow;
              transform-style: preserve-3d;
              perspective: 1200px;
            }
            .pd-panel::after {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              border-radius: inherit;
              background: radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(var(--glow-color-rgb),0.35) 0%, rgba(var(--glow-color-rgb),0.15) 35%, transparent 70%);
              opacity: var(--glow-alpha);
              transition: opacity .3s ease;
              mix-blend-mode: screen;
            }
            .pd-particle {
              position:absolute;
              width:6px;height:6px;
              background:rgba(var(--glow-color-rgb),0.9);
              border-radius:50%;
              box-shadow:0 0 8px rgba(var(--glow-color-rgb),0.8);
              opacity:0;
            }
          `}
        </style>
      </div>
    );
  };

  const ProfilePage = ({ onProjectClick, previousScrollY, setPreviousScrollY, isVisible }) => {
    const containerRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [enablePrism, setEnablePrism] = useState(false);

    // Decrypted text animation state
    const [displayedText, setDisplayedText] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);
    const [animationCompleted, setAnimationCompleted] = useState(false);
    const fullText = "Hello, I am LALIT CHOUDHARY, a passionate and detail-oriented frontend developer with over 5 years of experience building beautiful and intuitive web applications. My expertise lies in crafting engaging user interfaces using modern technologies like React, Tailwind CSS, and Three.js to create dynamic and memorable digital experiences. I am dedicated to writing clean, efficient, and maintainable code that delivers both exceptional performance and user satisfaction.";
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

    const menuItems = [
      { label: 'Home', ariaLabel: 'Go to home page', link: '#' },
      { label: 'My Work', ariaLabel: 'View my work', link: '#projects' },
      { label: 'Skills', ariaLabel: 'View skills', link: '#skills' },
      { label: 'About Me', ariaLabel: 'Learn about me', link: '#about' }
    ];

    const socialItems = [
      { label: 'Twitter', link: 'https://twitter.com' },
      { label: 'GitHub', link: 'https://github.com' },
      { label: 'LinkedIn', link: 'https://linkedin.com' }
    ];

    const handleSkillsetsClick = () => {
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = 'stack.html';
      }, 500);
    };

    const [skillsVisible, setSkillsVisible] = useState({});
    const skillsRef = useRef([]);
    const [projectsVisible, setProjectsVisible] = useState({});
    const projectsRef = useRef([]);

    const form = useRef();
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(''); // '', 'success', 'error'

    const sendEmail = (e) => {
      e.preventDefault();
      setIsSending(true);
      setSendStatus('');

      // IMPORTANT: Replace with your actual EmailJS IDs from your dashboard
      emailjs.sendForm('service_x4eo2tt', 'template_qso6min', form.current, 'JRxqzQ62gWdVI6-Lr')
        .then((result) => {
            console.log('SUCCESS!', result.text);
            setSendStatus('success');
            form.current.reset(); // Reset form fields on success
            trackContactSubmission(true); // Track successful submission
        }, (error) => {
            console.log('FAILED...', error.text);
            setSendStatus('error');
            trackContactSubmission(false); // Track failed submission
        }).finally(() => {
            setIsSending(false);
        });
    };

    useEffect(() => {
      const timer = setTimeout(() => setIsMounted(true), 100); // Slight delay for a smoother entry
      return () => clearTimeout(timer);
    }, []);

    // Defer Prism activation until first interaction or fallback timeout
    useEffect(() => {
      if (!isMounted || enablePrism) return;
      const activate = () => setEnablePrism(true);
      const interactionEvents = ['mousemove','touchstart','scroll','keydown'];
      interactionEvents.forEach(ev => window.addEventListener(ev, activate, { once: true, passive: true }));
      const fallback = setTimeout(activate, 2500); // ensure it appears even without interaction
      return () => {
        interactionEvents.forEach(ev => window.removeEventListener(ev, activate));
        clearTimeout(fallback);
      };
    }, [isMounted, enablePrism]);

    useEffect(() => {
      const handleScroll = () => {
        const currentRef = containerRef.current;
        if (currentRef) {
          const viewportHeight = window.innerHeight;
          skillsRef.current.forEach((ref, index) => {
            if (ref) {
              const rect = ref.getBoundingClientRect();
              const isVisible = rect.top < viewportHeight - 100;
              setSkillsVisible(prev => ({ ...prev, [index]: isVisible }));
            }
          });

          projectsRef.current.forEach((ref, index) => {
            if (ref) {
              const rect = ref.getBoundingClientRect();
              const isVisible = rect.top < viewportHeight - 100;
              setProjectsVisible(prev => ({ ...prev, [index]: isVisible }));
            }
          });
        }
      };

      const currentContainer = containerRef.current;
      if (currentContainer) {
        currentContainer.addEventListener('scroll', handleScroll);
        handleScroll();
      }
      return () => {
        if (currentContainer) {
          currentContainer.removeEventListener('scroll', handleScroll);
        }
      };
    }, []);

    useEffect(() => {
      if (previousScrollY && containerRef.current) {
        containerRef.current.scrollTop = previousScrollY;
        setPreviousScrollY(0);
      }
    }, [previousScrollY, setPreviousScrollY]);

    // Track page changes for analytics
    useEffect(() => {
      trackPageView(`/${currentPage}`);
    }, []);

    // Decrypted text animation effect
    useEffect(() => {
      if (isMounted && !isAnimating && !animationCompleted) {
        setIsAnimating(true);
        let currentIndex = 0;
        let animationInterval;

        const animateText = () => {
          if (currentIndex < fullText.length) {
            // Calculate how many characters to reveal per step to complete in 1500ms
            const totalSteps = 1500 / 50; // 50ms intervals for 1500ms total
            const charsPerStep = Math.ceil(fullText.length / totalSteps);

            // Reveal multiple characters at once
            const nextIndex = Math.min(currentIndex + charsPerStep, fullText.length);

            // Create random characters for the remaining text
            const randomText = fullText.slice(nextIndex).split('').map(() =>
              chars[Math.floor(Math.random() * chars.length)]
            ).join('');

            // Update displayed text with correct characters up to next index + random for rest
            setDisplayedText(fullText.slice(0, nextIndex) + randomText);
            currentIndex = nextIndex;
          } else {
            // Animation complete - show full text
            setDisplayedText(fullText);
            setIsAnimating(false);
            setAnimationCompleted(true);
            clearInterval(animationInterval);
          }
        };

        // Start animation with a slight delay after the box slides in
        setTimeout(() => {
          animationInterval = setInterval(animateText, 50); // 50ms delay between steps
        }, 500); // Wait 500ms after slide-in animation

        return () => {
          if (animationInterval) {
            clearInterval(animationInterval);
          }
        };
      }
    }, [isMounted, isAnimating, animationCompleted, fullText, chars]);

    const skillsByCategory = {
      'Languages': [
        { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
        { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
        { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      ],
      'Frontend': [
        { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
        { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg' },
        { name: 'Next.Js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
        { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
        { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
        { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      ],
      'Backend': [
        { name: 'Apache', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg' },
        { name: 'Rest API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
        { name: 'DSA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
        { name: 'Version control', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
        { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
        { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
        { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
        { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
        { name: 'TensorFlow', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
      ],
      'Databases': [
        { name: 'Oracle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
        { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
        { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      ],
      'Cloud': [
        { name: 'GCP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
        { name: 'AWS', icon: 'https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000' },
        { name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
      ],
      'Tools': [
        { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
        { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
        { name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg' },
      ],
      'App Development': [
        { name: 'App studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg' },
        { name: 'VS code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
        { name: 'Windurf', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg' },
      ]
    };

    return (
      <div
        className={`w-screen h-screen text-white font-sans overflow-auto bg-gradient-to-b from-[#2E3192] to-[#00FFE9] transition-opacity duration-1000 ease-in-out ${isMounted && isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        ref={containerRef}
      >
        <Suspense fallback={null}>
          <StaggeredMenu
            position="right"
            items={menuItems}
            socialItems={socialItems}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#fff"
            openMenuButtonColor="#fff"
            changeMenuColorOnOpen={true}
            colors={['#B19EEF', '#5227FF']}
            logoUrl="/path-to-your-logo.svg"
            accentColor="#ff6b6b"
          />
        </Suspense>

        {/* Spotlight Hero Section with advanced Prism background and ProfileCard */}
  <section className="relative w-full flex items-center justify-center min-h-[92vh] overflow-visible bg-[#06040a]">
          {/* Dark gradient base */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,#1a0f29_0%,#08060d_55%,#050309_100%)] opacity-90" />
            {/* Prism background (lazy) */}
            <div className={`absolute inset-0 overflow-hidden ${isMounted && enablePrism ? 'opacity-100 transition-opacity duration-[2500ms] ease-out' : 'opacity-0'}`}>
              {enablePrism && (
                <Suspense fallback={<div className="w-full h-full" />}> 
                  <Prism
                    animationType="3drotate"
                    timeScale={0.5}
                    height={3.9}
                    baseWidth={5.8}
                    scale={3.9}
                    hueShift={0.0}
                    colorFrequency={1.0}
                    noise={0.45}
                    glow={1.1}
                    bloom={1.15}
                    suspendWhenOffscreen={true}
                  />
                </Suspense>
              )}
              {/* Focus overlay + bottom fade */}
              <div className="absolute inset-0 pointer-events-none mix-blend-overlay" style={{background:'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.22), rgba(40,0,80,0.05) 55%, rgba(0,0,0,0.9) 90%)'}} />
              <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{background:'linear-gradient(to bottom, rgba(5,3,9,0) 0%, #050309 65%, #050309 100%)'}} />
            </div>
            {/* Profile Card in spotlight */}
            <div className={`relative z-10 transform transition-all duration-1000 ease-out px-4 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <ProfileCard
                avatarUrl={profileImage}
                name="LALIT CHOUDHARY"
                title="FULL STACK WEB & APP DEVELOPER"
                handle="lavish112000"
                status="Available"
                contactText="Contact"
                onContactClick={() => {
                  if (containerRef.current) {
                    const connectEl = containerRef.current.querySelector('#connect');
                    connectEl && connectEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="scale-[0.88] md:scale-100"
              />
            </div>
        </section>

        {/* About Section separated below spotlight */}
        <section id="about" className="w-full max-w-5xl mx-auto mt-24 px-8">
          <div className={`rounded-xl shadow-2xl p-10 bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 backdrop-blur-sm transform transition-all duration-1000 ease-out hover:scale-[1.01] ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold font-[Playfair Display] mb-6">About Me</h2>
            <p className="text-lg leading-relaxed text-white">
              {displayedText || 'Hello, I am LALIT CHOUDHARY, a passionate and detail-oriented frontend developer with over 5 years of experience building beautiful and intuitive web applications. My expertise lies in crafting engaging user interfaces using modern technologies like React, Tailwind CSS, and Three.js to create dynamic and memorable digital experiences. I am dedicated to writing clean, efficient, and maintainable code that delivers both exceptional performance and user satisfaction.'}
            </p>
          </div>
        </section>

          {/* My Work Section */}
          <div id="projects" className="w-full max-w-7xl mx-auto mt-20 p-10 bg-transparent text-center">
            <ScrollFloat
              scrollContainerRef={containerRef}
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='center bottom+=50%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}
              textClassName="text-white font-extrabold font-sans"
            >
              MY WORK
            </ScrollFloat>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {projectData.map((project, index) => {
                const isLeft = index % 2 === 0;
                const animationClass = projectsVisible[index] ? 'translate-x-0 opacity-100' : (isLeft ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0');

                return (
                  <div
                    key={project.id}
                    ref={el => projectsRef.current[index] = el}
                    className={`relative group p-6 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm skill-card-hover cursor-pointer ${animationClass}`}
                    onClick={() => onProjectClick(project, containerRef)}
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Project Box Content */}
                      <div className="w-full h-64 mb-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-xl relative">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 border-4 border-transparent rounded-lg animate-glow" style={{'--glow-color': index % 2 === 0 ? '#00FFE9' : '#f042ff'}}></div>
                      </div>
                      <h3 className="text-3xl font-bold cursor-pointer">{project.title}</h3>
                      <p className="text-gray-300">{project.tech}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Skillset Section */}
          <div id="skills" className="w-full max-w-7xl mx-auto mt-20 p-10 rounded-xl shadow-2xl bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 text-center transform transition-transform duration-300 hover:scale-[1.01]">
            <div onClick={handleSkillsetsClick} className="cursor-pointer">
              <ScrollFloat
                scrollContainerRef={containerRef}
                animationDuration={1}
                ease='back.inOut(2)'
                scrollStart='center bottom+=50%'
                scrollEnd='bottom bottom-=40%'
                stagger={0.03}
                textClassName="text-white font-extrabold font-sans"
              >
                SKILLSETS
              </ScrollFloat>
            </div>
            <div className="space-y-8">
              {Object.entries(skillsByCategory).map(([category, skills], categoryIndex) => (
                <div key={category}>
                  <h2 className="text-3xl font-bold text-white mb-4">{category}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {skills.map((item, skillIndex) => {
                      const globalIndex = Object.values(skillsByCategory).flat().findIndex(s => s.name === item.name);
                      let animationClass = '';
                      if (skillIndex % 3 === 0) { // Left column
                        animationClass = skillsVisible[globalIndex] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0';
                      } else if (skillIndex % 3 === 2) { // Right column
                        animationClass = skillsVisible[globalIndex] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';
                      } else { // Middle column
                        animationClass = skillsVisible[globalIndex] ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0';
                      }

                      return (
                        <button
                          key={`${item.name}-${category}`}
                          ref={el => skillsRef.current[globalIndex] = el}
                          onClick={() => handleSkillClick(item.name)}
                          className={`p-6 rounded-xl shadow-lg bg-gray-800 bg-opacity-70 backdrop-blur-sm flex items-center space-x-4 skill-card-hover cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 ${animationClass}`}
                        >
                          <div className="w-12 h-12 flex-shrink-0">
                            {item.customIcon ? item.customIcon : <img src={item.icon} alt={`${item.name} icon`} className="w-full h-full object-contain animate-spin-slow" />}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-left">{item.name}</h3>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Connect with me Section */}
          <div id="connect" className="w-full max-w-7xl mx-auto mt-20 p-10 rounded-xl shadow-2xl bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 text-center transform transition-transform duration-300 hover:scale-[1.01]">
            <ScrollFloat
              scrollContainerRef={containerRef}
              animationDuration={1}
              ease='back.inOut(2)'
              scrollStart='center bottom+=50%'
              scrollEnd='bottom bottom-=40%'
              stagger={0.03}
              textClassName="text-white font-extrabold font-sans"
            >
              Connect with me
            </ScrollFloat>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-12">
              
              {/* Gmail Form */}
              <form ref={form} onSubmit={sendEmail} className="w-full md:w-1/2 p-8 rounded-lg shadow-lg bg-gray-800 bg-opacity-70 backdrop-blur-sm flex flex-col space-y-4">
                <input type="text" name="user_name" placeholder="Your Name" required className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="email" name="user_email" placeholder="Your Email" required className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="text" name="subject" placeholder="Subject" required className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <textarea name="message" placeholder="Your Message" rows="5" required className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"></textarea>
                <button type="submit" disabled={isSending} className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-bold py-3 px-6 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed">
                  {isSending ? 'Sending...' : 'Send Message'}
                </button>
                {sendStatus === 'success' && (
                  <p className="text-green-400 mt-2">Message sent successfully! I\'ll get back to you soon.</p>
                )}
                {sendStatus === 'error' && (
                  <p className="text-red-400 mt-2">Failed to send message. Please try again or contact me via my social links.</p>
                )}
              </form>

              {/* Social Media Icons */}
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-8">
                {/* GitHub Icon */}
                <a href="https://github.com/lavish112000" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="transform transition-transform duration-300 hover:scale-110 animate-float-icon-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </a>
                {/* LinkedIn Icon */}
                <a href="https://linkedin.com/in/lalit11" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="transform transition-transform duration-300 hover:scale-110 animate-float-icon-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
                {/* Twitter/X Icon */}
                <a href="https://twitter.com/your-username" target="_blank" rel="noopener noreferrer" aria-label="Twitter Profile" className="transform transition-transform duration-300 hover:scale-110 animate-float-icon-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
          body { font-family: 'Playfair Display', serif; }

          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 5s linear infinite;
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px var(--glow-color), 0 0 10px var(--glow-color); }
            50% { box-shadow: 0 0 20px var(--glow-color), 0 0 40px var(--glow-color); }
            100% { box-shadow: 0 0 5px var(--glow-color), 0 0 10px var(--glow-color); }
          }
          .animate-glow {
            animation: glow 2s ease-in-out infinite;
          }
          @keyframes float-up-down {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }
          .animate-float-icon-1 {
            animation: float-up-down 2s ease-in-out infinite;
          }
          .animate-float-icon-2 {
            animation: float-up-down 2.2s ease-in-out infinite;
          }
          .animate-float-icon-3 {
            animation: float-up-down 2.4s ease-in-out infinite;
          }
          body.fade-out {
            opacity: 0;
            transform: scale(0.98);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          body.fade-in {
            opacity: 1;
            transform: scale(1);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Smooth page transitions */
          .page-transition {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .page-enter {
            opacity: 0;
            transform: translateY(20px);
          }

          .page-enter-active {
            opacity: 1;
            transform: translateY(0);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .page-exit {
            opacity: 1;
            transform: translateY(0);
          }

          .page-exit-active {
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }

          /* Enhanced skill card hover effects */
          .skill-card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .skill-card-hover:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          }
          @keyframes fade-in-slow { from { opacity:0 } to { opacity:1 } }
          .animate-fade-in-slow { animation: fade-in-slow 2.5s ease forwards; }
          `}
        </style>
      </div>
    );
  };

  // Main component rendering logic based on the current page state
  const handleTransitionEnd = () => {
    setCurrentPage('profile');
    setShowProfile(true);
  };

  const PageContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div className={`absolute inset-0 page-transition ${!showProfile ? 'page-enter-active' : 'page-exit-active'}`}>
              <HomeAndLandingPage onTransitionEnd={handleTransitionEnd} />
            </div>
            <div className={`absolute inset-0 page-transition ${showProfile ? 'page-enter-active' : 'page-exit-active'}`}>
              {showProfile && <ProfilePage onProjectClick={handleProjectClick} previousScrollY={previousScrollY} setPreviousScrollY={setPreviousScrollY} isVisible={showProfile} />}
            </div>
          </>
        );
      case 'profile':
        return <div className="page-transition page-enter-active"><ProfilePage onProjectClick={handleProjectClick} previousScrollY={previousScrollY} setPreviousScrollY={setPreviousScrollY} isVisible={true} /></div>;
      case 'project-details':
          return <div className="page-transition page-enter-active"><ProjectDetailsPage project={selectedProject} onBack={handleBackToProjects} /></div>;
      default:
        return <div className="page-transition page-enter-active"><HomeAndLandingPage onTransitionEnd={handleTransitionEnd} /></div>;
    }
  };

  return (
    <div className="ambient-light-container">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageContent />
      </div>
    </div>
  );
};

export default App;
