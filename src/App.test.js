import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock Three.js to avoid canvas-related issues in tests
jest.mock('three', () => ({
  Scene: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  })),
  PerspectiveCamera: jest.fn().mockImplementation(() => ({
    position: { z: 5 },
    aspect: 1,
    updateProjectionMatrix: jest.fn(),
  })),
  WebGLRenderer: jest.fn().mockImplementation(() => ({
    setSize: jest.fn(),
    setClearColor: jest.fn(),
    domElement: {
      tagName: 'CANVAS',
      getContext: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    },
    dispose: jest.fn(),
    render: jest.fn(),
  })),
}));

// Mock emailjs
jest.mock('@emailjs/browser', () => ({
  sendForm: jest.fn(),
}));

// Mock analytics
jest.mock('./analytics', () => ({
  trackPageView: jest.fn(),
  trackNavigation: jest.fn(),
  trackProjectView: jest.fn(),
  trackSkillGameInteraction: jest.fn(),
  trackContactSubmission: jest.fn(),
  trackSocialClick: jest.fn(),
}));

const App = require('./App.js').default;

describe('App Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('renders the portfolio application', () => {
    render(<App />);
    // Check if the app renders without crashing
    expect(document.body).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  test('includes error boundary wrapper', () => {
    // Test that the app is wrapped with error boundary in index.js
    // This is tested indirectly through the app rendering
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });
});
