import React from 'react';

interface TanahSuburImageProps {
  className?: string;
  alt?: string;
}

/**
 * TanahSuburImage
 * Renders the user-provided fertile soil (Tanah Subur) image
 * across all missions and pages wherever an item or icon is named 'Tanah Subur' or contains 'Tanah Subur'.
 */
export const TanahSuburImage: React.FC<TanahSuburImageProps> = ({
  className = 'w-8 h-8 object-contain',
  alt = 'Tanah Subur',
}) => {
  return (
    <img
      src="/tanah-subur.png"
      alt={alt}
      className={`${className} inline-block select-none drop-shadow-xs transition-transform`}
      referrerPolicy="no-referrer"
      loading="eager"
    />
  );
};

export function isTanahSubur(name?: string): boolean {
  if (!name) return false;
  const n = name.trim().toLowerCase();
  return (
    n.includes('tanah subur') ||
    n.includes('tanah gembur & subur') ||
    n.includes('tanah gembur dan subur')
  );
}
