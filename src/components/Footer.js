import React from 'react';

const DEFAULT_LINKS = [
  { label: 'About', targetId: 'about' },
  { label: 'Projects', targetId: 'projects' },
  { label: 'Skills', targetId: 'skills' },
  { label: 'Connect', targetId: 'connect' }
];

const safeScrollToId = (targetId) => {
  if (!targetId) return;
  const el = document.getElementById(targetId);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const Footer = ({
  name = 'Lavish',
  role = 'Full-Stack Developer',
  links = DEFAULT_LINKS,
  socialLinks = [],
  onBack
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-14 md:mt-18">
      <div className="rounded-2xl bg-gray-900/45 backdrop-blur-sm border border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-10 md:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="text-2xl md:text-3xl font-extrabold tracking-tight">{name}</div>
              <div className="text-gray-200/90 text-sm md:text-base">{role}</div>
              <div className="text-gray-300/90 text-sm max-w-md leading-relaxed">
                Building fast, modern web experiences with strong UX, performance hygiene, and clean architecture.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-10">
              <div className="space-y-3">
                <div className="text-white font-bold">Quick Links</div>
                <div className="flex flex-col gap-2">
                  {links.map((link) => (
                    <button
                      key={link.label}
                      type="button"
                      onClick={() => safeScrollToId(link.targetId)}
                      className="text-left text-gray-200 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </button>
                  ))}
                  {typeof onBack === 'function' && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="text-left text-gray-200 hover:text-white transition-colors duration-200"
                    >
                      Back to My Work
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-white font-bold">Get In Touch</div>
                <div className="flex flex-col gap-2">
                  {socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.link}
                      target={item.link?.startsWith('mailto:') ? undefined : '_blank'}
                      rel={item.link?.startsWith('mailto:') ? undefined : 'noreferrer'}
                      className="text-gray-200 hover:text-white transition-colors duration-200"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-gray-200/80 text-sm">
              © {year} {name}. All rights reserved.
            </div>
            <div className="text-gray-200/80 text-sm">
              Built with React, Tailwind CSS, and modern UI motion.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
