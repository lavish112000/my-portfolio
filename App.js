import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import emailjs from '@emailjs/browser';
import profileImage from './profile.jpg';
import videoPlayerProfileImage from './Videoplayerprofile.png';


// This is a self-contained React component for the entire portfolio website.
// It uses modern React hooks and Tailwind CSS for styling and responsiveness.

const App = () => {
  // State to manage the current page view: 'home', 'profile', or 'project-details'
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [previousScrollY, setPreviousScrollY] = useState(0);

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
    },
    {
      id: 2,
      title: 'E-commerce Website',
      tech: 'HTML, CSS, MongoDB, JavaScript',
      image: 'https://placehold.co/600x400/00FFE9/000?text=E-commerce Site',
      details: 'Developed a responsive and interactive e-commerce website for an offline business. The site features a clean and attractive UI/UX design. MongoDB was used to store customer data and product details, enabling efficient data management and a personalized shopping experience.',
    },
    {
      id: 3,
      title: 'Portfolio Website',
      tech: 'React, Tailwind CSS, Three.js',
      image: 'https://placehold.co/600x400/f042ff/fff?text=Portfolio',
      details: 'A personal portfolio website built with modern technologies. It features a custom landing page with a 3D animated greeting, a dynamic homepage with a wave effect, and a profile page with animated sections. The site is fully responsive and designed for a smooth user experience.',
    },
    {
      id: 4,
      title: '4K VIdeo player',
      tech: 'React Native, Node.js, Express.js, MongoDB',
      image: videoPlayerProfileImage,
      details: 'A mobile-first 4K VIdeo player application with features like dynamic UI , Fast and smooth user experience, and comments. Built with React Native for cross-platform compatibility, a Node.js backend with Express.js for REST APIs, and MongoDB for flexible data storage. The project focuses on real-time updates and user engagement.',
    },
    {
      id: 5,
      title: 'Task Management System',
      tech: 'Python, Django, PostgreSQL, HTML, CSS',
      image: 'https://placehold.co/600x400/87f5f5/000?text=Task Manager',
      details: 'A web-based task management system that allows users to create, assign, and track tasks. The backend is powered by Django and Python, using PostgreSQL as the database. The front end is a simple, responsive design built with HTML and CSS, focusing on usability and organization.',
    },
    {
      id: 6,
      title: 'Machine Learning Model API',
      tech: 'Python, Flask, TensorFlow, AWS',
      image: 'https://placehold.co/600x400/2E3192/fff?text=ML API',
      details: 'Developed a REST API for a machine learning model. The model was trained using TensorFlow and Python, and the API was built with Flask. The application is deployed on AWS using Lambda and API Gateway, showcasing skills in cloud deployment and serving ML models.',
    },
  ];

  const handleProjectClick = (project, containerRef) => {
    if (containerRef.current) {
      setPreviousScrollY(containerRef.current.scrollTop);
    }
    setSelectedProject(project);
    setCurrentPage('project-details');
  };

  const handleBackToProjects = () => {
    setCurrentPage('profile');
  };

  const HomeAndLandingPage = () => {
    const mountRef = useRef(null);
    const [currentHello, setCurrentHello] = useState(hellos[0]);
    const [showButton, setShowButton] = useState(false);
    const [backgroundGradient, setBackgroundGradient] = useState('from-[#2E3192] to-[#00FFE9]');
    const [isButtonHeld, setIsButtonHeld] = useState(false);

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
        setBackgroundGradient('from-[#FFA249] to-[#9E00F6]');
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
    }, []);

    const canvasRef = useRef(null);
    const spaceshipRef = useRef(null);
    const wavesRef = useRef([]);
    const animationFrameIdRef = useRef();

    const startWaveEffect = (e) => {
      const canvas = canvasRef.current;
      if (!canvas || !spaceshipRef.current) return;
      const ctx = canvas.getContext('2d');
      const rect = spaceshipRef.current.getBoundingClientRect();
      const clickX = e.clientX || rect.left + rect.width / 2;
      const clickY = e.clientY || rect.top + rect.height / 2;
      
      const totalWaves = 5;
      const maxRadius = Math.max(canvas.width, canvas.height);
      const startTime = performance.now();
      
      wavesRef.current = Array.from({ length: totalWaves }, (_, i) => ({
        startTime: startTime + i * 150
      }));

      const drawWaves = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const currentTime = performance.now();
        let allWavesFinished = true;
        
        wavesRef.current.forEach(wave => {
          const elapsedTime = currentTime - wave.startTime;

          if (elapsedTime > 0) {
            const waveRadius = elapsedTime * 0.5;
            const waveOpacity = 1 - (waveRadius / maxRadius);
            
            if (waveRadius < maxRadius) {
              allWavesFinished = false;
              ctx.beginPath();
              ctx.arc(clickX, clickY, waveRadius, 0, 2 * Math.PI);
              ctx.strokeStyle = `rgba(255, 255, 255, ${waveOpacity})`;
              ctx.lineWidth = 5;
              ctx.stroke();
            }
          }
        });

        if (!allWavesFinished) {
          animationFrameIdRef.current = requestAnimationFrame(drawWaves);
        } else {
          setCurrentPage('profile');
        }
      };

      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      animationFrameIdRef.current = requestAnimationFrame(drawWaves);
    };

    useEffect(() => {
      const canvas = canvasRef.current;
      const handleResize = () => {
        if (canvas) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
        }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        if (animationFrameIdRef.current) {
          cancelAnimationFrame(animationFrameIdRef.current);
        }
      };
    }, []);

    return (
      <div className={`relative w-screen h-screen overflow-hidden bg-gradient-to-b ${backgroundGradient} transition-colors duration-1000`}>
        <div ref={mountRef} className="absolute inset-0"></div>
        
        <canvas ref={canvasRef} className="absolute inset-0"></canvas>
        
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ease-in-out ${showButton ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <div key={currentHello} className="text-white text-6xl font-bold transition-all duration-200 ease-in-out scale-[400%]">
            {currentHello}
          </div>
        </div>

        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-out ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
          <button
            ref={spaceshipRef}
            onClick={startWaveEffect}
            onMouseDown={() => setIsButtonHeld(true)}
            onMouseUp={() => setIsButtonHeld(false)}
            onMouseLeave={() => setIsButtonHeld(false)}
            onTouchStart={() => setIsButtonHeld(true)}
            onTouchEnd={() => setIsButtonHeld(false)}
            className={`z-10 p-4 text-white text-2xl font-bold bg-purple-700 bg-opacity-70 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 transform-gpu ${isButtonHeld ? 'scale-95' : 'scale-100'}`}
          >
            Deep dive in
          </button>
        </div>
      </div>
    );
  };

  const ProjectDetailsPage = ({ project, onBack }) => {
    return (
      <div className="w-screen h-screen text-white font-sans overflow-auto bg-gradient-to-b from-[#2E3192] to-[#00FFE9] p-10">
        <div className="container mx-auto max-w-7xl">
          <button onClick={onBack} className="text-white text-xl font-bold hover:text-blue-400 transition-colors duration-200 mb-8">
            ← Back to Projects
          </button>
          <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12">
            <div className="w-full md:w-1/2 p-8 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm flex flex-col items-center text-center">
              <div className="w-full h-auto mb-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-xl relative">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full object-cover"
                />
                <div className="absolute inset-0 border-4 border-transparent rounded-lg animate-glow" style={{'--glow-color': '#00FFE9'}}></div>
              </div>
              <h3 className="text-3xl font-bold mt-4">{project.title}</h3>
              <p className="text-gray-300 text-lg">{project.tech}</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {project.tech.split(',').map(tech => (
                  <span key={tech.trim()} className="bg-gray-700 bg-opacity-50 text-white text-sm px-3 py-1 rounded-full">{tech.trim()}</span>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 p-8 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm text-center flex flex-col justify-center transform transition-transform duration-300 hover:scale-105">
              <h4 className="text-3xl font-bold mb-4">{project.title} Details</h4>
              <p className="text-gray-300 text-lg leading-relaxed">{project.details}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ProfilePage = ({ onProjectClick, previousScrollY, setPreviousScrollY }) => {
    const containerRef = useRef(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isNavbarOpen, setIsNavbarOpen] = useState(false);
    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const lastScrollY = useRef(0);

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
        }, (error) => {
            console.log('FAILED...', error.text);
            setSendStatus('error');
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

    const skillData = [
      { category: 'Languages', name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { category: 'Languages', name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
      { category: 'Languages', name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { category: 'Databases', name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { category: 'Frameworks', name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
      { category: 'Frameworks', name: 'React Native', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { category: 'Frameworks', name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { category: 'Frameworks', name: 'Bootstrap', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
      { category: 'Cloud', name: 'GCP', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
      { category: 'Databases', name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
      { category: 'Cloud', name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
      { category: 'Cloud', name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
      { category: 'Tools', name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
      { category: 'Frameworks', name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
      { category: 'Tools', name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { category: 'Tools', name: 'Kubernetes', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg' },
      { category: 'Tools', name: 'Jenkins', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' }
    ];

    return (
      <div
        className={`w-screen h-screen text-white font-sans overflow-auto bg-gradient-to-b from-[#2E3192] to-[#00FFE9] transition-opacity duration-1000 ease-in-out ${isMounted ? 'opacity-100' : 'opacity-0'}`}
        ref={containerRef}
      >
        {/* Navbar */}
        <nav 
          onMouseEnter={() => setIsNavbarOpen(true)}
          onMouseLeave={() => setIsNavbarOpen(false)}
          className={`fixed top-0 left-0 right-0 h-[12vh] bg-gray-800 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-between px-10 border-b border-gray-700 transition-all duration-300 ease-in-out ${isNavbarVisible ? 'translate-y-0' : '-translate-y-full'}`}
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
        <div className="pt-[12vh] p-10 min-h-screen flex flex-col items-center justify-center">
          <div id="top" className={`w-full max-w-7xl mx-auto rounded-xl shadow-2xl p-10 bg-transparent transform transition-all duration-1000 ease-out hover:scale-[1.01] ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12">
              
              {/* Detail Box - Styled like the left card in the image */}
              <div 
                id="about" 
                className="w-full md:w-5/12 p-8 rounded-lg shadow-lg bg-gradient-to-b from-[#2E3192] to-[#00FFE9] bg-opacity-50 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105"
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
              <div className="w-full md:w-7/12 p-8 rounded-lg shadow-lg text-white bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 transform transition-transform duration-300 hover:scale-105">
                <h2 className="text-3xl font-bold font-[Playfair Display] mb-4">About Me</h2>
                <p className="text-lg leading-relaxed text-white">
                  Hello, I'm LALIT CHOUDHARY, a passionate and detail-oriented frontend developer with over 5 years of experience building beautiful and intuitive web applications. My expertise lies in crafting engaging user interfaces using modern technologies like React, Tailwind CSS, and Three.js to create dynamic and memorable digital experiences. I am dedicated to writing clean, efficient, and maintainable code that delivers both exceptional performance and user satisfaction.
                </p>
              </div>

            </div>
          </div>
          
          {/* Skillset Section */}
          <div id="skills" className="w-full max-w-7xl mx-auto mt-20 p-10 rounded-xl shadow-2xl bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 text-center transform transition-transform duration-300 hover:scale-[1.01]">
            <h1 className="text-5xl font-extrabold font-sans text-white mb-8">SKILLSETS</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {skillData.map((item, index) => {
                let animationClass = '';
                if (index % 3 === 0) { // Left column
                  animationClass = skillsVisible[index] ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0';
                } else if (index % 3 === 2) { // Right column
                  animationClass = skillsVisible[index] ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0';
                } else { // Middle column
                  animationClass = skillsVisible[index] ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0';
                }

                return (
                  <div
                    key={`${item.name}-${item.category}`}
                    ref={el => skillsRef.current[index] = el}
                    className={`p-6 rounded-xl shadow-lg bg-gray-800 bg-opacity-70 backdrop-blur-sm flex items-center space-x-4 transform transition-all duration-700 ease-in-out hover:scale-105 ${animationClass}`}
                  >
                    <div className="w-12 h-12 flex-shrink-0">
                      <img src={item.icon} alt={`${item.name} icon`} className="w-full h-full object-contain animate-spin-slow" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-left">{item.name}</h3>
                      <p className="text-gray-300 text-left">{item.category}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Projects Section */}
          <div id="projects" className="w-full max-w-7xl mx-auto mt-20 p-10 bg-transparent text-center">
            <h1 className="text-5xl font-extrabold font-sans text-white mb-8">PROJECTS</h1>
            <div className="flex flex-col gap-8">
              {projectData.map((project, index) => {
                const isLeft = index % 2 === 0;
                const animationClass = projectsVisible[index] ? 'translate-x-0 opacity-100' : (isLeft ? '-translate-x-full opacity-0' : 'translate-x-full opacity-0');

                return (
                  <div
                    key={project.id}
                    ref={el => projectsRef.current[index] = el}
                    className={`relative group mx-auto w-full max-w-6xl p-6 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm transform transition-all duration-1000 hover:scale-105 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} ${animationClass}`}
                  >
                    <div className="flex flex-col md:flex-row items-center justify-center p-4">
                      {/* Project Box Content */}
                      <div className={`w-full md:w-1/2 flex flex-col items-center text-center transition-all duration-300`}>
                        <div className="w-64 h-48 mb-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-xl relative">
                          <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 border-4 border-transparent rounded-lg animate-glow" style={{'--glow-color': index % 2 === 0 ? '#00FFE9' : '#f042ff'}}></div>
                        </div>
                        <h3 className="text-3xl font-bold cursor-pointer" onClick={() => onProjectClick(project, containerRef)}>{project.title}</h3>
                        <p className="text-gray-300">{project.tech}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                  <p className="text-green-400 mt-2">Message sent successfully! I'll get back to you soon.</p>
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
          `}
        </style>
      </div>
    );
  };

  // Main component rendering logic based on the current page state
  switch (currentPage) {
    case 'home':
      return <HomeAndLandingPage />;
    case 'profile':
      return <ProfilePage onProjectClick={handleProjectClick} previousScrollY={previousScrollY} setPreviousScrollY={setPreviousScrollY} />;
    case 'project-details':
        return <ProjectDetailsPage project={selectedProject} onBack={handleBackToProjects} />;
    default:
      return <HomeAndLandingPage />;
  }
};

export default App;
