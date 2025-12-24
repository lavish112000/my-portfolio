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

const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedProject, setSelectedProject] = useState(null);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState('');
  const [showGyroscopeHint, setShowGyroscopeHint] = useState(false);

  const isMobileDevice = useCallback(() => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (typeof window !== 'undefined' && window.innerWidth <= 1024)
    );
  }, []);

  useEffect(() => {
    if (!isMobileDevice()) return;

    const timer = setTimeout(() => {
      setShowGyroscopeHint(true);
      setTimeout(() => setShowGyroscopeHint(false), 6000);
    }, 3000);

    return () => clearTimeout(timer);
  }, [isMobileDevice]);

  const hellos = [
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

  const projectData = [
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
      title: 'Resume-Parser',
      tech: 'HTML, CSS, Supabase, JavaScript',
      image: ResumeParser,
      details:
        'Developed a responsive and interactive resume parser application. The site features a clean and attractive UI/UX design. Supabase was used to store user data and resume details, enabling efficient data management and a personalized experience.',
      impact:
        'Increased user engagement by 30% in the first quarter after launch. The new UI/UX design led to a 50% increase in user satisfaction and a 20% decrease in bounce rate.',
      keyFeatures: ['Resume upload', 'Data extraction', 'User accounts', 'Analytics dashboard']
    },
    {
      id: 3,
      title: 'NeonFlux Portfolio Website',
      tech: 'React, Tailwind CSS, Three.js',
      image: NeonFlux,
      details:
        'A personal portfolio website built with modern technologies. It features a custom landing page with a 3D animated greeting, a dynamic homepage with a wave effect, and a profile page with animated sections. The site is fully responsive and designed for a smooth user experience.',
      impact:
        'Showcased my skills and projects to potential employers, leading to a 40% increase in interview requests. The animated and interactive design received positive feedback for its creativity and user engagement.',
      keyFeatures: ['3D landing page', 'Dynamic wave effect', 'Animated skill sections', 'Responsive design']
    },
    {
      id: 4,
      title: 'Cosmic Video player',
      tech: 'React Native, Node.js, Express.js, MongoDB',
      image: videoPlayerProfileImage,
      details:
        'A mobile-first Cosmic Video player application with features like dynamic UI , Fast and smooth user experience, and comments. Built with React Native for cross-platform compatibility, a Node.js backend with Express.js for REST APIs, and MongoDB for flexible data storage. The project focuses on real-time updates and user engagement.',
      impact:
        'Achieved a high-performance video playback with minimal buffering, resulting in a 95% user satisfaction rate. The cross-platform nature of React Native allowed for a 50% reduction in development time and cost.',
      keyFeatures: ['4K video playback', 'Dynamic UI', 'Real-time comments', 'Cross-platform compatibility']
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
    }
  ];

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
      trackProjectView(project.title);
    }, 200);
  };

  const handleBackToProjects = () => {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
      setCurrentPage('profile');
      setSelectedProject(null);
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

      if (currentSection === 'skills') {
        handleBackFromSkills();
      } else if (currentSection === 'projects') {
        handleBackToProjects();
      }

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
      return;
    }

    gsap.to(appElement, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => {
        setCurrentPage('home');
        gsap.to(appElement, { opacity: 1, duration: 0.4, ease: 'power2.in' });
      }
    });
  };

  const PageContent = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <div className="page-transition page-enter-active">
            <LandingPage hellos={hellos} onComplete={handleLandingComplete} />
          </div>
        );

      case 'home':
      case 'profile':
        return (
          <div className="page-transition page-enter-active">
            <ProfilePage
              onProjectClick={handleProjectClick}
              previousScrollY={previousScrollY}
              setPreviousScrollY={setPreviousScrollY}
              isVisible={true}
              projectData={projectData}
              onSkillClick={handleSkillClick}
              isMobileDevice={isMobileDevice}
              pagePath={`/${currentPage}`}
            />
          </div>
        );

      case 'project-details':
        return (
          <div className="page-transition page-enter-active">
            <ProjectDetailsPage project={selectedProject} onBack={handleBackToProjects} />
          </div>
        );

      default:
        return (
          <div className="page-transition page-enter-active">
            <LandingPage hellos={hellos} onComplete={handleLandingComplete} />
          </div>
        );
    }
  };

  return (
    <div className="App ambient-light-container">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageContent />
      </div>

      {showGyroscopeHint && isMobileDevice() && (
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
              onClick={() => setShowGyroscopeHint(false)}
              className="text-white hover:text-gray-300 text-xl font-bold bg-white/10 rounded-full w-8 h-8 flex items-center justify-center"
            >
              {'\u00D7'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
