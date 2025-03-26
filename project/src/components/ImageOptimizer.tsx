import React from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

export const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy'
}) => {
  // Generate srcset for responsive images
  const generateSrcSet = () => {
    if (!src.includes('unsplash.com')) return undefined;
    
    const sizes = [320, 640, 768, 1024, 1280, 1536];
    return sizes
      .map(size => `${src}&w=${size} ${size}w`)
      .join(', ');
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      srcSet={generateSrcSet()}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      decoding="async"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = 'fallback-image.jpg';
      }}
    />
  );
};