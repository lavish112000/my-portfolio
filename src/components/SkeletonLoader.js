import React from 'react';

const SkeletonLoader = ({ className = "", variant = "default" }) => {
  const baseClasses = "animate-pulse bg-gray-700 bg-opacity-50 rounded";

  const variants = {
    default: "h-4",
    card: "h-32",
    text: "h-4",
    avatar: "h-12 w-12 rounded-full",
    button: "h-10 w-24",
    image: "h-48 w-full"
  };

  return (
    <div
      className={`${baseClasses} ${variants[variant]} ${className}`}
      data-testid="skeleton-loader"
    />
  );
};

const ProjectCardSkeleton = () => (
  <div className="bg-gray-800 bg-opacity-50 rounded-xl shadow-2xl p-6 animate-pulse" data-testid="project-card-skeleton">
    <SkeletonLoader variant="image" className="mb-4" />
    <SkeletonLoader variant="text" className="h-6 mb-2" />
    <SkeletonLoader variant="text" className="h-4 w-3/4" />
  </div>
);

const SkillCardSkeleton = () => (
  <div className="p-6 rounded-xl shadow-lg bg-gray-800 bg-opacity-70 flex items-center space-x-4 animate-pulse" data-testid="skill-card-skeleton">
    <SkeletonLoader variant="avatar" />
    <div className="flex-1">
      <SkeletonLoader variant="text" className="h-6 mb-2" />
      <SkeletonLoader variant="text" className="h-4 w-1/2" />
    </div>
  </div>
);

const ProfileSkeleton = () => (
  <div className="w-full max-w-7xl mx-auto mt-20 p-10 rounded-xl shadow-2xl bg-gray-800 bg-opacity-50 animate-pulse" data-testid="profile-skeleton">
    <div className="flex flex-col md:flex-row space-y-12 md:space-y-0 md:space-x-12">
      <div className="w-full md:w-5/12 p-8 rounded-lg shadow-lg bg-gray-700 bg-opacity-50 flex flex-col items-center text-center">
        <SkeletonLoader variant="avatar" className="w-48 h-48 mb-6" />
        <SkeletonLoader variant="text" className="h-8 w-48 mb-2" />
        <SkeletonLoader variant="text" className="h-6 w-32 mb-2" />
        <SkeletonLoader variant="text" className="h-4 w-24" />
      </div>
      <div className="w-full md:w-7/12 p-8 rounded-lg shadow-lg bg-gray-700 bg-opacity-50">
        <SkeletonLoader variant="text" className="h-8 w-32 mb-4" />
        <div className="space-y-3">
          <SkeletonLoader variant="text" className="h-4 w-full" />
          <SkeletonLoader variant="text" className="h-4 w-full" />
          <SkeletonLoader variant="text" className="h-4 w-3/4" />
        </div>
      </div>
    </div>
  </div>
);

export { SkeletonLoader, ProjectCardSkeleton, SkillCardSkeleton, ProfileSkeleton };
