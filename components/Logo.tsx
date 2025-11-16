'use client';

import Link from 'next/link';

interface LogoProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ showText = true, size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link href="/" className={`flex items-center space-x-3 ${className}`}>
      <div className={`relative ${sizeClasses[size]} flex-shrink-0`}>
        <img
          src="/data/HD_logo.jpeg"
          alt="Partner Pay Logo"
          className="object-contain w-full h-full"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 dark:text-white ${textSizeClasses[size]}`}>
          Partner Pay
        </span>
      )}
    </Link>
  );
}

