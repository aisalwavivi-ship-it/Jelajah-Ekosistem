import React from 'react';

interface BatuTamanImageProps {
  className?: string;
  alt?: string;
}

/**
 * BatuTamanImage
 * Renders the user-specified garden boulder (batu taman) image
 * across all missions wherever an item or icon is named 'batu taman'.
 */
export const BatuTamanImage: React.FC<BatuTamanImageProps> = ({
  className = 'w-8 h-8 object-contain',
  alt = 'Batu Taman',
}) => {
  return (
    <img
      src="/batu-taman.png"
      alt={alt}
      className={`${className} inline-block select-none mix-blend-multiply drop-shadow-xs transition-transform`}
      referrerPolicy="no-referrer"
      loading="eager"
    />
  );
};

export function isBatuTaman(name?: string): boolean {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return n.includes('batu taman') || n.includes('batu hias');
}
