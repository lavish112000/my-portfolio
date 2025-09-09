import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SkeletonLoader, ProjectCardSkeleton, SkillCardSkeleton, ProfileSkeleton } from './components/SkeletonLoader.js';

describe('SkeletonLoader Components', () => {
  test('SkeletonLoader renders with default props', () => {
    render(<SkeletonLoader />);
    const skeleton = screen.getByTestId('skeleton-loader');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('animate-pulse');
  });

  test('SkeletonLoader renders with custom className', () => {
    render(<SkeletonLoader className="custom-class" />);
    const skeleton = screen.getByTestId('skeleton-loader');
    expect(skeleton).toHaveClass('custom-class', 'animate-pulse');
  });

  test('ProjectCardSkeleton renders correctly', () => {
    render(<ProjectCardSkeleton />);
    expect(screen.getByTestId('project-card-skeleton')).toBeInTheDocument();
    // Check for skeleton animation
    expect(screen.getByTestId('project-card-skeleton')).toHaveClass('animate-pulse');
  });

  test('SkillCardSkeleton renders correctly', () => {
    render(<SkillCardSkeleton />);
    expect(screen.getByTestId('skill-card-skeleton')).toBeInTheDocument();
    // Check for skeleton animation
    expect(screen.getByTestId('skill-card-skeleton')).toHaveClass('animate-pulse');
  });

  test('ProfileSkeleton renders correctly', () => {
    render(<ProfileSkeleton />);
    expect(screen.getByTestId('profile-skeleton')).toBeInTheDocument();
    // Check for skeleton animation
    expect(screen.getByTestId('profile-skeleton')).toHaveClass('animate-pulse');
  });

  test('SkeletonLoader has proper structure', () => {
    render(<SkeletonLoader />);
    const skeleton = screen.getByTestId('skeleton-loader');
    expect(skeleton).toBeInTheDocument();
  });
});
