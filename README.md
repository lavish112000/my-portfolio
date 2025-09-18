# 🌟 Lavish's Portfolio

A modern, interactive portfolio website showcasing skills through 3D animations, interactive games, and comprehensive project demonstrations. Built with cutting-edge web technologies for an exceptional user experience.

![Portfolio Preview](https://img.shields.io/badge/React-19.1.1-blue) ![Three.js](https://img.shields.io/badge/Three.js-0.179.1-black) ![GSAP](https://img.shields.io/badge/GSAP-3.13.0-green) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3.X-blue)

## ✨ Features

### 🎨 **Visual Excellence**

- **3D Landing Page**: Immersive Three.js animations with dynamic multilingual greetings
- **Smooth Animations**: GSAP-powered character-by-character text reveals and scroll-triggered effects
- **Responsive Design**: Pixel-perfect layout across all devices using Tailwind CSS
- **Modern UI/UX**: Clean, professional design with intuitive navigation

### 🎮 **Interactive Experience**

- **Skill Games**: 20+ interactive HTML/CSS/JavaScript games demonstrating technical skills
- **Project Showcase**: Detailed project cards with live demos, GitHub links, and impact metrics
- **Contact Integration**: EmailJS-powered contact form with real-time feedback
- **Smooth Transitions**: Seamless page transitions with fade effects

### 🚀 **Performance & PWA**

- **Progressive Web App**: Offline functionality with service worker caching
- **Optimized Loading**: Lazy loading, code splitting, and asset optimization
- **Fast Performance**: Core Web Vitals optimized for excellent user experience
- **Cross-browser Support**: Compatible with all modern browsers

### 📊 **Analytics & Monitoring**

- **Google Analytics 4**: Comprehensive tracking of user interactions and behavior
- **Error Boundaries**: Graceful error handling with user-friendly recovery
- **Performance Monitoring**: Web Vitals tracking for continuous optimization
- **Testing Suite**: Complete test coverage with Jest and React Testing Library

## 🛠️ Tech Stack

### **Core Technologies**

- **Frontend Framework**: React 19.1.1 with Hooks
- **Styling**: Tailwind CSS 3.3.X with PostCSS
- **3D Graphics**: Three.js 0.179.1 for WebGL animations
- **Animations**: GSAP 3.13.0 for smooth transitions
- **Motion**: Motion library for advanced animations

### **Development Tools**

- **Build Tool**: Create React App with Webpack 5
- **Testing**: Jest + React Testing Library
- **Email Service**: EmailJS for contact forms
- **Analytics**: Google Analytics 4
- **PWA**: Service Worker API with Workbox

### **Development Dependencies**

- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: Automatic CSS vendor prefixing
- **Webpack Dev Server**: Hot reloading development server

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher (comes with Node.js)
- **Git**: For version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/lavish112000/my-portfolio.git
cd my-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```env
# Google Analytics 4 Measurement ID (optional)
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX

# EmailJS Configuration (for contact form)
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### 4. Start Development Server

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server with hot reloading |
| `npm run build` | Create optimized production build |
| `npm test` | Run test suite in interactive mode |
| `npm run eject` | Eject from Create React App (irreversible) |

## 🎮 Interactive Skill Games

The portfolio includes 20+ interactive skill demonstration games:

### **Programming Languages**

- **Python**: Interactive Python programming challenges
- **Java**: Object-oriented programming concepts
- **JavaScript**: Modern ES6+ features and DOM manipulation

### **Web Technologies**

- **HTML**: Semantic markup and accessibility
- **CSS**: Advanced styling and animations
- **React**: Component-based development
- **Next.js**: Server-side rendering and routing

### **Backend & Databases**

- **Node.js**: Server-side JavaScript runtime
- **Express.js**: RESTful API development
- **MongoDB**: NoSQL database operations
- **PostgreSQL**: Relational database management

### **Cloud & DevOps**

- **AWS**: Cloud computing services
- **Docker**: Containerization and deployment
- **GitHub**: Version control and collaboration

## 📁 Project Structure

```text
my-portfolio/
├── public/
│   ├── skill-games/          # Interactive skill demonstration games
│   ├── favicon.ico          # Website favicon
│   ├── manifest.json        # PWA manifest
│   └── robots.txt           # Search engine crawling rules
├── src/
│   ├── components/          # Reusable React components
│   │   ├── ErrorBoundary.js # Error handling component
│   │   └── SkeletonLoader.js # Loading state component
│   ├── analytics.js         # Google Analytics utilities
│   ├── App.js              # Main application component
│   ├── index.js            # Application entry point
│   ├── serviceWorker.js    # PWA service worker
│   └── ScrollFloat.js      # Animated text component
├── build/                  # Production build output
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── postcss.config.js       # PostCSS configuration
└── README.md              # Project documentation
```

## 🔧 Configuration Files

### **Tailwind CSS** (`tailwind.config.js`)

```javascript
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2E3192",
        secondary: "#00FFE9"
      }
    }
  }
}
```

### **PostCSS** (`postcss.config.js`)

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

## 📊 Analytics & Performance

### **Google Analytics Integration**

- **Page Views**: Track user navigation patterns
- **Skill Interactions**: Monitor which skills users explore
- **Project Engagement**: Measure project interest and clicks
- **Contact Conversions**: Track form submission success rates
- **Performance Metrics**: Monitor Core Web Vitals

### **Performance Monitoring**

- **First Contentful Paint (FCP)**: < 1.8s target
- **Largest Contentful Paint (LCP)**: < 2.5s target
- **Cumulative Layout Shift (CLS)**: < 0.1 target
- **First Input Delay (FID)**: < 100ms target

## 🧪 Testing Strategy

### **Test Coverage**

- **Unit Tests**: Individual component functionality
- **Integration Tests**: Component interactions
- **Error Boundary Tests**: Error handling scenarios
- **Analytics Tests**: Tracking function validation

### **Running Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

## 🚀 Deployment

### **Netlify (Recommended)**

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Configure environment variables
5. Deploy automatically on push

### **Vercel**

1. Import your GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy with zero configuration

### **Manual Deployment**

```bash
# Build for production
npm run build

# Deploy the build folder to any static hosting service
# Examples: GitHub Pages, AWS S3, Firebase Hosting
```

## 🔒 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_GA_TRACKING_ID` | Google Analytics 4 Measurement ID | No | - |
| `REACT_APP_EMAILJS_SERVICE_ID` | EmailJS service identifier | No | - |
| `REACT_APP_EMAILJS_TEMPLATE_ID` | EmailJS template identifier | No | - |
| `REACT_APP_EMAILJS_PUBLIC_KEY` | EmailJS public key | No | - |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### **Development Guidelines**

- Follow React best practices and hooks patterns
- Write comprehensive tests for new features
- Ensure responsive design across all devices
- Maintain performance optimization standards
- Update documentation for any new features

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Contact & Support

### **Connect With Me**

- **Portfolio**: [lavishportfolio.com](https://lavishportfolio.com)
- **LinkedIn**: [linkedin.com/in/lavishchoudhary](https://linkedin.com/in/lavishchoudhary)
- **GitHub**: [github.com/lavish112000](https://github.com/lavish112000)
- **Email**: <lavish@example.com>

### **Support**

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/lavish112000/my-portfolio/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/lavish112000/my-portfolio/discussions)
- 📧 **General Inquiries**: Use the contact form on the website

---

## Built with ❤️ by Lalit Choudhary

### Last updated: September 18, 2025
