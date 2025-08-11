import React from 'react';

export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`px-6 py-3 rounded text-lg font-medium transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
