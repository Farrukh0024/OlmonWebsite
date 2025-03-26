import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  href?: string;
  variant?: 'primary' | 'accent' | 'outline' | 'link';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ 
  onClick, 
  children, 
  className = '', 
  href,
  variant = 'primary'
}) => {
  const baseStyles = {
    primary: 'bg-primary hover:bg-primary-dark text-white font-semibold',
    accent: 'bg-accent hover:bg-accent-dark text-background font-semibold',
    outline: 'border-2 border-accent text-accent hover:bg-accent hover:text-background font-semibold',
    link: 'text-accent hover:text-accent-dark underline-offset-4 hover:underline font-semibold'
  };

  const buttonContent = (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17,
        duration: 0.3
      }}
      className={`${baseStyles[variant]} ${className} transform transition-all duration-300 ease-out rounded-lg px-6 py-3 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:shadow-sm backdrop-blur-sm`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {buttonContent}
      </a>
    );
  }

  return buttonContent;
};

export default AnimatedButton;