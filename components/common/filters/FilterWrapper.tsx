import React from 'react';

interface FilterWrapperProps {
  children: React.ReactNode;
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({ children }) => {
  return (
    <div className="border border-gray-200 rounded-lg bg-gray-50">
      {children}
    </div>
  );
};
