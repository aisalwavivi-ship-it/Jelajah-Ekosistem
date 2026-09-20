import React, { useState } from 'react';

interface BungaTerataiPopulasiImageProps {
  className?: string;
  alt?: string;
}

/**
 * BungaTerataiPopulasiImage
 * Menampilkan ilustrasi rumpun beberapa bunga teratai (minimal 3 bunga mekar)
 * dilengkapi dengan daun teratai terapung di atas permukaan air kolam.
 * Memvisualisasikan konsep POPULASI (lebih dari satu individu sejenis).
 */
export const BungaTerataiPopulasiImage: React.FC<BungaTerataiPopulasiImageProps> = ({
  className = 'w-10 h-10 object-cover rounded-xl',
  alt = 'Rumpun Bunga Teratai (Populasi)',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Vector SVG fallback dengan 3 bunga teratai merah muda mekar dan daun teratai di kolam
    return (
      <svg
        viewBox="0 0 100 80"
        className={`${className} inline-block select-none drop-shadow-xs bg-sky-100/60 p-0.5`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={alt}
      >
        {/* Air Kolam & Riak */}
        <ellipse cx="50" cy="65" rx="46" ry="12" fill="#bae6fd" opacity="0.8" />
        <ellipse cx="50" cy="64" rx="36" ry="7" fill="#7dd3fc" opacity="0.9" />

        {/* Daun-daun Teratai (Lily pads) */}
        <g fill="#16a34a" stroke="#15803d" strokeWidth="1">
          {/* Daun kiri */}
          <path d="M 12 56 C 8 48, 30 46, 33 54 C 31 60, 16 62, 12 56 Z" fill="#22c55e" />
          {/* Daun kanan */}
          <path d="M 64 56 C 67 46, 88 48, 86 58 C 80 63, 66 62, 64 56 Z" fill="#15803d" />
          {/* Daun tengah belakang */}
          <ellipse cx="50" cy="54" rx="20" ry="7" fill="#16a34a" />
        </g>

        {/* Bunga 1: Kiri (Mekar) */}
        <g transform="translate(16, 30) scale(0.65)">
          <path d="M20,35 C5,25 2,12 18,5 C12,18 20,30 20,35 Z" fill="#f472b6" />
          <path d="M20,35 C35,25 38,12 22,5 C28,18 20,30 20,35 Z" fill="#f472b6" />
          <path d="M20,35 C10,20 12,5 20,0 C28,5 30,20 20,35 Z" fill="#ec4899" />
          <circle cx="20" cy="18" r="4" fill="#fef08a" />
        </g>

        {/* Bunga 2: Kanan (Mekar) */}
        <g transform="translate(54, 32) scale(0.65)">
          <path d="M20,35 C5,25 2,12 18,5 C12,18 20,30 20,35 Z" fill="#f472b6" />
          <path d="M20,35 C35,25 38,12 22,5 C28,18 20,30 20,35 Z" fill="#f472b6" />
          <path d="M20,35 C10,20 12,5 20,0 C28,5 30,20 20,35 Z" fill="#ec4899" />
          <circle cx="20" cy="18" r="4" fill="#fef08a" />
        </g>

        {/* Bunga 3: Tengah (Paling besar dan mekar penuh) */}
        <g transform="translate(33, 16) scale(0.85)">
          <path d="M20,38 C0,26 -2,10 16,3 C10,18 19,32 20,38 Z" fill="#f472b6" />
          <path d="M20,38 C40,26 42,10 24,3 C30,18 21,32 20,38 Z" fill="#f472b6" />
          <path d="M20,38 C8,22 10,6 20,0 C30,6 32,22 20,38 Z" fill="#db2777" />
          <circle cx="20" cy="20" r="5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
        </g>
      </svg>
    );
  }

  return (
    <img
      src="/bunga-teratai-populasi.jpg"
      alt={alt}
      className={`${className} inline-block select-none rounded-xl object-cover drop-shadow-xs transition-transform`}
      referrerPolicy="no-referrer"
      loading="eager"
      onError={() => setHasError(true)}
    />
  );
};
