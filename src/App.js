import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';
import profileImage from './profile.jpg';
import videoPlayerProfileImage from './Videoplayerprofile.png';
import { trackPageView, trackProjectView, trackSkillGameInteraction, trackContactSubmission } from './analytics';



// This is a self-contained React component for the entire portfolio website.
// It uses modern React hooks and Tailwind CSS for styling and responsiveness.

const App = () => {
  // State to manage the current page view: 'home', 'profile', or 'project-details'
  const [currentPage, setCurrentPage] = useState('home');
  const [showProfile, setShowProfile] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [previousScrollY, setPreviousScrollY] = useState(0);
  const [currentSection, setCurrentSection] = useState(''); // Track current section (skills/projects)

  // A list of "Hello" in 10 different languages for the landing page animation
  const hellos = [
    'Hello', '你好', 'नमस्ते', 'Hola', 'Bonjour', 'أهلاً', 'হ্যালো', 'Olá', 'Здравствуйте', 'سلام'
  ];

  // Project data moved to a global scope within the App component
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
      title: 'E-commerce Website',
      tech: 'HTML, CSS, MongoDB, JavaScript',
      image: 'https://placehold.co/600x400/00FFE9/000?text=E-commerce Site',
      details: 'Developed a responsive and interactive e-commerce website for an offline business. The site features a clean and attractive UI/UX design. MongoDB was used to store customer data and product details, enabling efficient data management and a personalized shopping experience.',
      impact: 'Increased sales by 30% in the first quarter after launch. The new UI/UX design led to a 50% increase in user engagement and a 20% decrease in bounce rate.',
      keyFeatures: ['Product catalog', 'Shopping cart', 'User accounts', 'Order history'],
    },
    {
      id: 3,
      title: 'Portfolio Website',
      tech: 'React, Tailwind CSS, Three.js',
      image: 'https://placehold.co/600x400/f042ff/fff?text=Portfolio',
      details: 'A personal portfolio website built with modern technologies. It features a custom landing page with a 3D animated greeting, a dynamic homepage with a wave effect, and a profile page with animated sections. The site is fully responsive and designed for a smooth user experience.',
      impact: 'Showcased my skills and projects to potential employers, leading to a 40% increase in interview requests. The animated and interactive design received positive feedback for its creativity and user engagement.',
      keyFeatures: ['3D landing page', 'Dynamic wave effect', 'Animated skill sections', 'Responsive design'],
    },
    {
      id: 4,
      title: '4K VIdeo player',
      tech: 'React Native, Node.js, Express.js, MongoDB',
      image: videoPlayerProfileImage,
      details: 'A mobile-first 4K VIdeo player application with features like dynamic UI , Fast and smooth user experience, and comments. Built with React Native for cross-platform compatibility, a Node.js backend with Express.js for REST APIs, and MongoDB for flexible data storage. The project focuses on real-time updates and user engagement.',
      impact: 'Achieved a high-performance video playback with minimal buffering, resulting in a 95% user satisfaction rate. The cross-platform nature of React Native allowed for a 50% reduction in development time and cost.',
      keyFeatures: ['4K video playback', 'Dynamic UI', 'Real-time comments', 'Cross-platform compatibility'],
    },
    {
      id: 5,
      title: 'Task Management System',
      tech: 'Python, Django, PostgreSQL, HTML, CSS',
      image: 'https://placehold.co/600x400/87f5f5/000?text=Task Manager',
      details: 'A web-based task management system that allows users to create, assign, and track tasks. The backend is powered by Django and Python, using PostgreSQL as the database. The front end is a simple, responsive design built with HTML and CSS, focusing on usability and organization.',
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

  const handleProjectClick = (project, containerRef) => {
    if (containerRef.current) {
      setPreviousScrollY(containerRef.current.scrollTop);
    }
    setSelectedProject(project);
    setCurrentPage('project-details');
    setCurrentSection('projects'); // Remember we came from projects section
    trackProjectView(project.title);
  };

  const handleBackToProjects = () => {
    setCurrentPage('profile');
    setSelectedProject(null);
    // Scroll to projects section after a brief delay to allow page transition
    setTimeout(() => {
      const projectsElement = document.getElementById('projects');
      if (projectsElement) {
        projectsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  /**
   * Handles the click event on a skill card.
   * It opens the respective HTML page with a smooth transition.
   * @param {string} skillName - The name of the skill that was clicked.
   */
  const handleSkillClick = (skillName) => {
    setCurrentSection('skills'); // Remember we came from skills section

    let targetPath = '';

    // Map skill names to their respective HTML file paths (served from public folder)
    switch (skillName.toLowerCase()) {
      case 'python':
        targetPath = '/skill-games/python.html';
        break;
      case 'java':
        targetPath = '/skill-games/HTML.html'; // Using HTML.html for Java as well, or create Java.html
        break;
      case 'javascript':
        targetPath = '/skill-games/javascript.html';
        break;
      case 'html':
        targetPath = '/skill-games/HTML.html';
        break;
      case 'apache':
        targetPath = '/skill-games/Apache.html';
        break;
      case 'dsa':
        targetPath = '/skill-games/DSA.html';
        break;
      case 'express.js':
        targetPath = '/skill-games/ExpressJS.html';
        break;
      case 'flutter':
        targetPath = '/skill-games/flutter.html';
        break;
      case 'next.js':
        targetPath = '/skill-games/NextJS.html';
        break;
      case 'node.js':
        targetPath = '/skill-games/NodeJS.html';
        break;
      case 'react':
        targetPath = '/skill-games/React.html';
        break;
      case 'tailwind css':
        targetPath = '/skill-games/Tailwind.html';
        break;
      case 'three.js':
        targetPath = '/skill-games/ThreeJS.html';
        break;
      case 'version control':
        targetPath = '/skill-games/VersionControl.html';
        break;
      default:
        console.log(`No specific page found for skill: ${skillName}`);
        return;
    }

    // Track skill game interaction
    trackSkillGameInteraction(skillName.toLowerCase(), 'click');

    // Add smooth page transition effect
    document.body.classList.add('fade-out');

    // Open the HTML file in a new tab with smooth transition
    setTimeout(() => {
      window.open(targetPath, '_blank');
    }, 300); // Delay to allow fade-out animation
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
        { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-original.svg' },
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
            ← Back to Projects
          </button>
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left Column */}
            <div className="lg:w-1/2">
              <div className="p-8 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
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
              <div className="p-8 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm mb-8 transition-transform duration-300 hover:scale-105">
                <h4 className="text-3xl font-bold mb-4">Project Impact</h4>
                <p className="text-gray-300 text-lg leading-relaxed">{project.impact}</p>
              </div>
              <div className="p-8 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm mb-8 transition-transform duration-300 hover:scale-105">
                <h4 className="text-3xl font-bold mb-4">Key Features</h4>
                <ul className="list-disc list-inside text-gray-300 text-lg space-y-2">
                  {project.keyFeatures.map(feature => <li key={feature}>{feature}</li>)}
                </ul>
              </div>
              <div className="p-8 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
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
      </div>
    );
  };

  const ProfilePage = ({ onProjectClick, previousScrollY, setPreviousScrollY, isVisible }) => {
    const containerRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const lastScrollY = useRef(0);

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

    useEffect(() => {
      const handleScroll = () => {
        const currentRef = containerRef.current;
        if (currentRef) {
          const currentScrollY = currentRef.scrollTop;
          if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsNavbarVisible(false);
          } else {
            setIsNavbarVisible(true);
          }
          lastScrollY.current = currentScrollY;
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
        {/* Navbar */}
        <nav
          onMouseEnter={() => setIsNavbarOpen(true)}
          onMouseLeave={() => setIsNavbarOpen(false)}
          className={`fixed top-0 left-0 right-0 h-16 bg-gray-800 bg-opacity-90 backdrop-blur-md z-50 flex items-center justify-between px-10 border-b border-gray-700 transition-all duration-300 ease-in-out shadow-lg ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}
        >
          <button
            onClick={() => containerRef.current.scrollTop = 0}
            className="text-3xl font-bold font-[Playfair Display] cursor-pointer"
          >
            LC
          </button>
          <div className={`flex items-center space-x-8 text-xl font-bold font-[Playfair Display] transition-all duration-300 ease-in-out ${isNavbarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <button onClick={() => setCurrentPage('home')} className="hover:text-blue-400 transition-colors duration-200">Homepage</button>
            <button onClick={() => containerRef.current.querySelector('#projects').scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 transition-colors duration-200">Projects</button>
            <button onClick={() => containerRef.current.querySelector('#skills').scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 transition-colors duration-200">Skills</button>
            <button onClick={() => containerRef.current.querySelector('#about').scrollIntoView({ behavior: 'smooth' })} className="hover:text-blue-400 transition-colors duration-200">About Me</button>
          </div>
        </nav>

        {/* Profile Box container */}
        <div className="pt-16 p-10 min-h-screen flex flex-col items-center justify-center">
          <div id="top" className={`w-full max-w-7xl mx-auto rounded-xl shadow-2xl p-10 bg-transparent transform transition-all duration-1000 ease-out hover:scale-[1.01] ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12">

              {/* Detail Box - Styled like the left card in the image */}
              <div
                id="about"
                className={`w-full md:w-5/12 p-8 rounded-lg shadow-lg bg-gradient-to-b from-[#2E3192] to-[#00FFE9] bg-opacity-50 flex flex-col items-center text-center transform transition-all duration-1000 ease-in-out hover:scale-105 ${isMounted ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
              >
                <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-gray-700 shadow-xl">
                  {/* Placeholder for profile photo */}
                  <img
                     src={profileImage} alt="Lalit Choudhary"
                     className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-3xl font-bold font-[Playfair Display] mb-2">LALIT CHOUDHARY</h2>
                <p className="text-xl font-medium text-gray-200">FULL STACK WEB&APP DEVELOPER</p>
                <p className="text-lg text-gray-400 mt-2">5+ years of experience</p>
              </div>

              {/* Intro Box - Styled like the right card in the image */}
              <div className={`w-full md:w-7/12 p-8 rounded-lg shadow-lg text-white bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 transform transition-all duration-1000 ease-in-out hover:scale-105 ${isMounted ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
                <h2 className="text-3xl font-bold font-[Playfair Display] mb-4">About Me</h2>
                <p className="text-lg leading-relaxed text-white">
                  Hello, I am LALIT CHOUDHARY, a passionate and detail-oriented frontend developer with over 5 years of experience building beautiful and intuitive web applications. My expertise lies in crafting engaging user interfaces using modern technologies like React, Tailwind CSS, and Three.js to create dynamic and memorable digital experiences. I am dedicated to writing clean, efficient, and maintainable code that delivers both exceptional performance and user satisfaction.
                </p>
              </div>

            </div>
          </div>

          {/* Projects Section */}
          <div id="projects" className="w-full max-w-7xl mx-auto mt-20 p-10 bg-transparent text-center">
            <h1 className="text-5xl font-extrabold font-sans text-white mb-8">PROJECTS</h1>
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
            <h1 onClick={handleSkillsetsClick} className="text-5xl font-extrabold font-sans text-white mb-8 cursor-pointer">SKILLSETS</h1>
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
            <h1 className="text-5xl font-extrabold font-sans text-white mb-8">Connect with me</h1>
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
