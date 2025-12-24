import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import emailjs from '@emailjs/browser';

import profileImage from '../profile.jpg';
import ProfileCard from '../components/ProfileCard';
import ScrollFloat from '../ScrollFloat';
import TextPressure from '../TextPressure';
import { trackContactSubmission, trackPageView } from '../analytics';

const StaggeredMenu = lazy(() => import('../StaggeredMenu'));

const ABOUT_TEXT =
  "Hello, I am LALIT CHOUDHARY, a passionate and detail-oriented Full Stack developer with over 4 years of experience building beautiful and intuitive web applications. My expertise lies in crafting engaging user interfaces using modern technologies like React, Tailwind CSS, Next.js and Three.js to create dynamic and memorable digital experiences. I am dedicated to writing clean, efficient, and maintainable code that delivers both exceptional performance and user satisfaction.Currently building this portfolio site to showcase my work and skills!";

const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

const MENU_ITEMS = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '#' },
  { label: 'My Work', ariaLabel: 'View my work', link: '#projects' },
  { label: 'Skills', ariaLabel: 'View skills', link: '#skills' },
  { label: 'About Me', ariaLabel: 'Learn about me', link: '#about' }
];

const SOCIAL_ITEMS = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

const PROFILE_SKILLS_BY_CATEGORY = {
  Languages: [
    { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    {
      name: 'JavaScript',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'
    }
  ],
  Frontend: [
    { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg' },
    { name: 'Next.Js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    {
      name: 'Tailwind CSS',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg'
    }
  ],
  Backend: [
    { name: 'Apache', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg' },
    { name: 'Rest API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { name: 'DSA', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    { name: 'Version control', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Express.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'Flask', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
    {
      name: 'TensorFlow',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg'
    }
  ],
  Databases: [
    { name: 'Oracle', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
    { name: 'SQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' }
  ],
  Cloud: [
    {
      name: 'GCP',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg'
    },
    { name: 'AWS', icon: 'https://img.icons8.com/?size=100&id=wU62u24brJ44&format=png&color=000000' },
    { name: 'Azure', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' }
  ],
  Tools: [
    { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    {
      name: 'Kubernetes',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-original.svg'
    }
  ],
  'App Development': [
    {
      name: 'App studio',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/androidstudio/androidstudio-original.svg'
    },
    { name: 'VS code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    {
      name: 'Windurf',
      icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg'
    }
  ]
};

const PROFILE_ALL_SKILLS = Object.values(PROFILE_SKILLS_BY_CATEGORY).flat();

const updateVisibilityMap = (refs, viewportHeight, setVisible) => {
  refs.forEach((ref, index) => {
    if (!ref) return;
    const rect = ref.getBoundingClientRect();
    const visible = rect.top < viewportHeight - 100;
    setVisible((prev) => ({ ...prev, [index]: visible }));
  });
};

const scrollToContainerChild = (containerRef, selector) => {
  const container = containerRef.current;
  if (!container) return;

  const target = container.querySelector(selector);
  if (!target) return;

  gsap.to(window, {
    scrollTo: {
      y: target,
      autoKill: false,
      offsetY: 20
    },
    duration: 0.6,
    ease: 'power2.inOut'
  });
};

const useMountedAfterDelay = (delayMs) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), delayMs);
    return () => clearTimeout(timer);
  }, [delayMs]);

  return isMounted;
};

const useScrambleRevealText = ({ enabled, text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  useEffect(() => {
    if (!enabled || isAnimating || animationCompleted) return;

    setIsAnimating(true);
    let currentIndex = 0;
    let animationInterval;

    const animateText = () => {
      if (currentIndex < text.length) {
        const totalSteps = 1500 / 50;
        const charsPerStep = Math.ceil(text.length / totalSteps);
        const nextIndex = Math.min(currentIndex + charsPerStep, text.length);

        const randomText = text
          .slice(nextIndex)
          .split('')
          .map(() => RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)])
          .join('');

        setDisplayedText(text.slice(0, nextIndex) + randomText);
        currentIndex = nextIndex;
        return;
      }

      setDisplayedText(text);
      setIsAnimating(false);
      setAnimationCompleted(true);
      clearInterval(animationInterval);
    };

    const startTimer = setTimeout(() => {
      animationInterval = setInterval(animateText, 50);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [animationCompleted, enabled, isAnimating, text]);

  return { displayedText, animationCompleted };
};

const useEmailSender = (formRef) => {
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);
    setSendStatus('');

    emailjs
      .sendForm('service_x4eo2tt', 'template_qso6min', formRef.current, 'JRxqzQ62gWdVI6-Lr')
      .then(
        (result) => {
          console.log('SUCCESS!', result.text);
          setSendStatus('success');
          formRef.current.reset();
          trackContactSubmission(true);
        },
        (error) => {
          console.log('FAILED...', error.text);
          setSendStatus('error');
          trackContactSubmission(false);
        }
      )
      .finally(() => {
        setIsSending(false);
      });
  };

  return { isSending, sendStatus, sendEmail };
};

const ProfileHeroSection = ({
  containerRef,
  isMounted,
  isMobileDevice,
  onContactClick
}) => {
  return (
    <section className="relative w-full flex items-center justify-center min-h-[92dvh] overflow-visible bg-gradient-to-b from-[#2E3192] to-[#00FFE9] px-4 py-8">
      <div className="linear-gradient(to bottom, #2E3192, #00FFE9)" />
      <div
        className={`relative z-10 transform transition-all duration-1000 ease-out w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl ${
          isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <ProfileCard
          avatarUrl={profileImage}
          name="LALIT CHOUDHARY"
          title="FULL STACK WEB & APP DEVELOPER"
          handle="lavish112000"
          status="Available"
          contactText="Contact"
          enableMobileTilt={isMobileDevice()}
          mobileTiltSensitivity={3}
          maxTiltX={20}
          maxTiltY={20}
          maxTiltZ={10}
          onContactClick={onContactClick}
          className="scale-75 xs:scale-80 sm:scale-90 md:scale-95 lg:scale-100"
          backgroundColor="linear-gradient(to bottom, #2E3192, #00FFE9)"
        />
      </div>
      <div className="absolute top-2 md:top-0 right-2 md:right-0 h-full flex-auto z-50">
        <Suspense fallback={null}>
          <StaggeredMenu
            position="right"
            items={MENU_ITEMS}
            socialItems={SOCIAL_ITEMS}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#000"
            openMenuButtonColor="#000"
            changeMenuColorOnOpen={true}
            colors={['#B19EEF', '#5227FF']}
            logoUrl="/path-to-your-logo.svg"
            accentColor="#ff6b6b"
          />
        </Suspense>
      </div>
    </section>
  );
};

const AboutSection = ({ isMounted, displayedText }) => {
  return (
    <section id="about" className="w-full max-w-5xl mx-auto mt-12 md:mt-24 px-4 md:px-8">
      <div
        className={`rounded-xl shadow-2xl p-6 md:p-10 bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 backdrop-blur-sm transform transition-all duration-1000 ease-out hover:scale-[1.01] ${
          isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
      >
        <h2 className="text-responsive-3xl md:text-6xl font-bold font-[Playfair Display] mb-0">
          <div style={{ position: 'relative', height: 'clamp(200px, 30vw, 300px)' }}>
            <TextPressure
              text="About Me!"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#ff0000"
              minFontSize={16}
            />
          </div>
        </h2>
        <p className="text-responsive-base md:text-lg leading-relaxed text-white">
          {displayedText ||
            'Hello, I am LALIT CHOUDHARY, a passionate and detail-oriented Full Stack developer with over 4 years of experience building beautiful and intuitive web applications. My expertise lies in crafting engaging user interfaces using modern technologies like React, Tailwind CSS, Next.js and Three.js to create dynamic and memorable digital experiences. I am dedicated to writing clean, efficient, and maintainable code that delivers both exceptional performance and user satisfaction. Currently building this portfolio site to showcase my work and skills.'}
        </p>
      </div>
    </section>
  );
};

const ProjectsSection = ({ containerRef, projectData, projectsVisible, projectsRef, onProjectClick }) => {
  return (
    <div id="projects" className="w-full max-w-7xl mx-auto mt-12 md:mt-20 p-4 md:p-10 bg-transparent text-center">
      <ScrollFloat
        scrollContainerRef={containerRef}
        animationDuration={1}
        ease="back.inOut(4)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
        textClassName="text-white font-extrabold font-sans text-responsive-3xl md:text-5xl lg:text-7xl"
      >
        MY WORK
      </ScrollFloat>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mt-12 md:mt-20">
        {projectData.map((project, index) => {
          const isLeft = index % 2 === 0;
          const animationClass = projectsVisible[index]
            ? 'translate-x-0 opacity-100'
            : isLeft
              ? '-translate-x-full opacity-0'
              : 'translate-x-full opacity-0';

          return (
            <div
              key={project.id}
              ref={(el) => (projectsRef.current[index] = el)}
              className={`relative group p-4 md:p-6 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 backdrop-blur-sm skill-card-hover cursor-pointer transition-transform duration-300 hover:scale-105 ${animationClass}`}
              onClick={() => onProjectClick(project, containerRef)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-full h-48 md:h-64 mb-4 overflow-hidden rounded-lg border-4 border-gray-700 shadow-xl relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0 border-4 border-transparent rounded-lg animate-glow"
                    style={{ '--glow-color': index % 2 === 0 ? '#00FFE9' : '#f042ff' }}
                  ></div>
                </div>
                <h3 className="text-responsive-xl md:text-2xl lg:text-3xl font-bold cursor-pointer text-white">{project.title}</h3>
                <p className="text-gray-300 text-responsive-sm md:text-base mt-2">{project.tech}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsSection = ({ containerRef, skillsVisible, skillsRef, onSkillClick, onSkillsetsClick }) => {
  return (
    <div
      id="skills"
      className="w-full max-w-7xl mx-auto mt-12 md:mt-20 p-4 md:p-10 rounded-xl shadow-2xl bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 text-center transform transition-transform duration-300 hover:scale-[1.01]"
    >
      <div onClick={onSkillsetsClick} className="cursor-pointer">
        <ScrollFloat
          scrollContainerRef={containerRef}
          animationDuration={1}
          ease="back.inOut(4)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
          textClassName="text-white font-extrabold font-sans text-responsive-3xl md:text-5xl lg:text-7xl"
        >
          SKILLSETS
        </ScrollFloat>
      </div>

      <div className="space-y-6 md:space-y-8">
        {Object.entries(PROFILE_SKILLS_BY_CATEGORY).map(([category, skills]) => (
          <div key={category}>
            <h2 className="text-responsive-xl md:text-2xl lg:text-3xl font-bold text-white mb-4 mt-12 md:mt-20">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {skills.map((item, skillIndex) => {
                const globalIndex = PROFILE_ALL_SKILLS.findIndex((s) => s.name === item.name);
                let animationClass = '';

                if (skillIndex % 3 === 0) {
                  animationClass = skillsVisible[globalIndex]
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-full opacity-0';
                } else if (skillIndex % 3 === 2) {
                  animationClass = skillsVisible[globalIndex]
                    ? 'translate-x-0 opacity-100'
                    : 'translate-x-full opacity-0';
                } else {
                  animationClass = skillsVisible[globalIndex]
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-full opacity-0';
                }

                return (
                  <button
                    key={`${item.name}-${category}`}
                    ref={(el) => (skillsRef.current[globalIndex] = el)}
                    onClick={() => onSkillClick(item.name)}
                    className={`p-4 md:p-6 rounded-xl shadow-lg bg-gray-800 bg-opacity-70 backdrop-blur-sm flex items-center space-x-3 md:space-x-4 skill-card-hover cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50 transition-all duration-300 hover:scale-105 hover:bg-opacity-80 min-h-[60px] ${animationClass}`}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0">
                      {item.customIcon ? (
                        item.customIcon
                      ) : (
                        <img
                          src={item.icon}
                          alt={`${item.name} icon`}
                          className="w-full h-full object-contain animate-spin-slow"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-responsive-base md:text-xl lg:text-2xl font-bold text-left text-white">{item.name}</h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ConnectSection = ({ containerRef, formRef, onSubmit, isSending, sendStatus }) => {
  return (
    <div
      id="connect"
      className="w-full max-w-7xl mx-auto mt-12 md:mt-20 p-4 md:p-10 rounded-xl shadow-2xl bg-gradient-to-b from-[#f042ff] via-[#ffe51] to-[#87f5f5] bg-opacity-50 text-center transform transition-transform duration-300 hover:scale-[1.01]"
    >
      <ScrollFloat
        scrollContainerRef={containerRef}
        animationDuration={1}
        ease="back.inOut(4)"
        scrollStart="center bottom+=50%"
        scrollEnd="bottom bottom-=40%"
        stagger={0.03}
        textClassName="text-white font-extrabold font-sans text-responsive-3xl md:text-5xl lg:text-7xl"
      >
        Connect with me
      </ScrollFloat>

      <div className="flex flex-col lg:flex-row items-center justify-center space-y-8 lg:space-y-0 lg:space-x-12 mt-12 md:mt-20">
        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="w-full lg:w-1/2 p-4 md:p-8 rounded-lg shadow-lg bg-gray-800 bg-opacity-70 backdrop-blur-sm flex flex-col space-y-4"
        >
          <input
            type="text"
            name="user_name"
            placeholder="Your Name"
            required
            className="p-3 md:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base"
          />
          <input
            type="email"
            name="user_email"
            placeholder="Your Email"
            required
            className="p-3 md:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            className="p-3 md:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 text-base"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            required
            className="p-3 md:p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-all duration-200 text-base"
          ></textarea>
          <button
            type="submit"
            disabled={isSending}
            className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-full disabled:bg-gray-500 disabled:cursor-not-allowed min-h-[48px] text-base md:text-lg"
          >
            {isSending ? 'Sending...' : 'Send Message'}
          </button>
          {sendStatus === 'success' && (
            <p className="text-green-400 mt-2 text-sm md:text-base">Message sent successfully! I'll get back to you soon.</p>
          )}
          {sendStatus === 'error' && (
            <p className="text-red-400 mt-2 text-sm md:text-base">
              Failed to send message. Please try again or contact me via my social links.
            </p>
          )}
        </form>

        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center space-y-6 md:space-y-8">
          <a
            href="https://github.com/lavish112000"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="transform transition-transform duration-300 hover:scale-110 animate-float-icon-1 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-300 md:w-16 md:h-16"
            >
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>

          <a
            href="https://linkedin.com/in/lalit11"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="transform transition-transform duration-300 hover:scale-110 animate-float-icon-2 p-2 rounded-full hover:bg-blue-400 hover:bg-opacity-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-blue-400 md:w-16 md:h-16"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>

          <a
            href="https://twitter.com/your-username"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profile"
            className="transform transition-transform duration-300 hover:scale-110 animate-float-icon-3 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white md:w-16 md:h-16"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const ProfilePageStyles = () => {
  return (
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
  );
};

const ProfilePage = ({
  onProjectClick,
  previousScrollY,
  setPreviousScrollY,
  isVisible,
  projectData,
  onSkillClick,
  isMobileDevice,
  pagePath
}) => {
  const containerRef = useRef(null);

  const isMounted = useMountedAfterDelay(100);
  const { displayedText } = useScrambleRevealText({ enabled: isMounted, text: ABOUT_TEXT });

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
  const { isSending, sendStatus, sendEmail } = useEmailSender(form);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleScroll = () => {
      const viewportHeight = window.innerHeight;
      updateVisibilityMap(skillsRef.current, viewportHeight, setSkillsVisible);
      updateVisibilityMap(projectsRef.current, viewportHeight, setProjectsVisible);
    };

    currentContainer.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      currentContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!previousScrollY || !containerRef.current) return;

    containerRef.current.scrollTop = previousScrollY;
    setPreviousScrollY(0);
  }, [previousScrollY, setPreviousScrollY]);

  useEffect(() => {
    if (pagePath) {
      trackPageView(pagePath);
    }
  }, [pagePath]);

  const pageVisibilityClass = isMounted && isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none';

  return (
    <div
      className={`w-screen h-screen text-white font-sans overflow-auto bg-gradient-to-b from-[#2E3192] to-[#00FFE9] transition-opacity duration-1000 ease-in-out ${pageVisibilityClass}`}
      ref={containerRef}
    >
      <ProfileHeroSection
        containerRef={containerRef}
        isMounted={isMounted}
        isMobileDevice={isMobileDevice}
        onContactClick={() => scrollToContainerChild(containerRef, '#connect')}
      />
      <AboutSection isMounted={isMounted} displayedText={displayedText} />
      <ProjectsSection
        containerRef={containerRef}
        projectData={projectData}
        projectsVisible={projectsVisible}
        projectsRef={projectsRef}
        onProjectClick={onProjectClick}
      />
      <SkillsSection
        containerRef={containerRef}
        skillsVisible={skillsVisible}
        skillsRef={skillsRef}
        onSkillClick={onSkillClick}
        onSkillsetsClick={handleSkillsetsClick}
      />
      <ConnectSection
        containerRef={containerRef}
        formRef={form}
        onSubmit={sendEmail}
        isSending={isSending}
        sendStatus={sendStatus}
      />
      <ProfilePageStyles />
    </div>
  );
};

export default ProfilePage;
