import React from 'react';

interface VisuallyHiddenProps {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ 
  children, 
  as: Component = 'span',
  className = ''
}) => {
  return (
    <Component className={`sr-only ${className}`}>
      {children}
    </Component>
  );
};