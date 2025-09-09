# Lavish's Portfolio

A modern, responsive portfolio website built with React, featuring 3D animations, interactive skill games, and comprehensive analytics integration.

## 🚀 Features

- **3D Landing Page**: Interactive Three.js animations with multilingual greetings
- **Responsive Design**: Fully responsive across all devices using Tailwind CSS
- **Skill Games**: Interactive HTML/CSS/JavaScript games for each skill
- **Project Showcase**: Detailed project cards with impact metrics
- **Contact Form**: EmailJS integration for seamless contact
- **PWA Support**: Offline functionality with service worker
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Loading States**: Skeleton loaders for better UX
- **Google Analytics**: Comprehensive tracking and insights
- **Testing Suite**: Jest and React Testing Library setup

## 🛠️ Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **3D Graphics**: Three.js
- **Email Service**: EmailJS
- **Testing**: Jest, React Testing Library
- **Analytics**: Google Analytics 4
- **PWA**: Service Worker API
- **Build Tool**: Create React App

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd my-portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:

```env
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Google Analytics 4 Measurement ID.

## 🚀 Running the Application

### Development Mode

```bash
npm start
```

Opens [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
```

### Testing

```bash
npm test
```

## 📱 PWA Features

The portfolio includes Progressive Web App capabilities:

- **Offline Support**: Core content cached for offline viewing
- **Installable**: Can be installed as a standalone app
- **Fast Loading**: Service worker caches assets for quick loading

## 📊 Analytics Integration

Google Analytics is integrated to track:

- Page views and navigation
- Project interactions
- Skill game usage
- Contact form submissions
- Social media clicks

## 🧪 Testing

The project includes comprehensive tests:

- Unit tests for components
- Error boundary testing
- Skeleton loader testing
- Analytics function testing

Run tests with:

```bash
npm test
```

## 🎮 Skill Games

Interactive games included:

- **HTML Game**: Test your HTML knowledge
- **CSS Game**: CSS challenge game
- **JavaScript Game**: JavaScript coding challenges
- **Python Game**: Python programming quiz

## 📁 Project Structure

```
src/
├── components/
│   ├── ErrorBoundary.js
│   ├── SkeletonLoader.js
│   └── ...
├── analytics.js
├── App.js
├── index.js
├── serviceWorker.js
└── ...
```

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_GA_TRACKING_ID` | Google Analytics 4 Measurement ID | No |

## 🚀 Deployment

### Netlify Deployment

1. Build the project:

```bash
npm run build
```

2. Deploy the `build` folder to Netlify

### Other Platforms

The built files in the `build` folder can be deployed to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

Feel free to reach out through the contact form on the website or connect on social media!

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
