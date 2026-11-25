import React, { useState } from 'react';
import { Car } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#DCEFEF] via-[#F1F5F9] to-[#E2E8F0] text-[#0F766E] p-4 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Car className="w-8 h-8 opacity-75 mb-1.5" />
        {fallbackLabel && (
          <span className="text-xs font-medium text-[#172B3A]/80 text-center line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};
