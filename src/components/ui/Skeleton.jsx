import React from 'react';

export const Skeleton = ({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular'
  width,
  height,
  ...props
}) => {
  const variantStyles = {
    text: 'rounded h-4 w-full',
    circular: 'rounded-full w-10 h-10',
    rectangular: 'rounded-lg w-full h-24'
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      style={style}
      className={`animate-pulse bg-slate-200/80 ${variantStyles[variant] || variantStyles.rectangular} ${className}`}
      {...props}
    />
  );
};

export default Skeleton;
