import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'sm' | 'md';
}

export const Loading: React.FC<LoadingProps> = ({
  fullScreen = false,
  message,
  size = 'md',
}) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 absolute top-0 left-0"></div>
          </div>
          {message && (
            <p className="text-gray-700 text-lg font-medium animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <div className="relative flex-shrink-0">
        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-200"></div>
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-blue-500 absolute top-0 left-0"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 absolute top-0 left-0"></div>
      </div>
    </div>
  );
};
