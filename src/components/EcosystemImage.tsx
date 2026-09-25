import React, { useState } from 'react';
import { 
  TreePine, 
  Flower2, 
  Bird, 
  Bug, 
  Fish, 
  Droplets, 
  Sun, 
  Mountain, 
  Layers, 
  Wind, 
  Sparkles
} from 'lucide-react';

interface EcosystemImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  objectType?: 'tumbuhan' | 'hewan' | 'air' | 'batu' | 'tanah_cahaya' | 'lingkungan' | string;
  rounded?: boolean;
}

/**
 * EcosystemImage
 * Resilient image component for Jelajah Ekosistem.
 * - Prevents raw browser broken image icons on missing assets
 * - Preserves size, styling, clickability, and layout positioning
 * - Uses clean educational vector placeholders when asset file is missing or fails to load
 */
export const EcosystemImage: React.FC<EcosystemImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-contain',
  fallbackIcon,
  objectType,
  rounded = false,
}) => {
  const [loadFailed, setLoadFailed] = useState(false);

  // Select an appropriate Lucide vector icon based on entity name or type
  const renderLucideFallback = () => {
    const lower = (alt || '').toLowerCase();
    let IconComponent = Sparkles;
    let colorClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';

    if (lower.includes('pohon') || lower.includes('hutan') || lower.includes('pinus')) {
      IconComponent = TreePine;
      colorClass = 'text-emerald-700 bg-emerald-50/90 border-emerald-300';
    } else if (lower.includes('bunga') || lower.includes('teratai') || lower.includes('tanaman')) {
      IconComponent = Flower2;
      colorClass = 'text-pink-600 bg-pink-50/90 border-pink-300';
    } else if (lower.includes('burung') || lower.includes('pipit') || lower.includes('elang')) {
      IconComponent = Bird;
      colorClass = 'text-sky-700 bg-sky-50/90 border-sky-300';
    } else if (lower.includes('kupu') || lower.includes('lebah') || lower.includes('ulat') || lower.includes('belalang') || lower.includes('semut') || lower.includes('capung') || lower.includes('keong')) {
      IconComponent = Bug;
      colorClass = 'text-amber-700 bg-amber-50/90 border-amber-300';
    } else if (lower.includes('ikan') || lower.includes('katak') || lower.includes('kodok') || lower.includes('bebek')) {
      IconComponent = Fish;
      colorClass = 'text-blue-600 bg-blue-50/90 border-blue-300';
    } else if (lower.includes('air') || lower.includes('sungai') || lower.includes('danau') || lower.includes('kolam') || lower.includes('laut')) {
      IconComponent = Droplets;
      colorClass = 'text-cyan-700 bg-cyan-50/90 border-cyan-300';
    } else if (lower.includes('matahari') || lower.includes('cahaya') || lower.includes('sun')) {
      IconComponent = Sun;
      colorClass = 'text-amber-600 bg-amber-50/90 border-amber-300';
    } else if (lower.includes('batu') || lower.includes('kerikil')) {
      IconComponent = Mountain;
      colorClass = 'text-stone-600 bg-stone-100 border-stone-300';
    } else if (lower.includes('tanah') || lower.includes('lumpur')) {
      IconComponent = Layers;
      colorClass = 'text-amber-800 bg-amber-50 border-amber-300';
    } else if (lower.includes('udara') || lower.includes('oksigen') || lower.includes('angin')) {
      IconComponent = Wind;
      colorClass = 'text-teal-600 bg-teal-50 border-teal-200';
    }

    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-1 rounded-2xl border ${colorClass} shadow-2xs select-none`}
        title={`Asset ${alt}`}
      >
        <IconComponent className="w-5 h-5 stroke-[1.75]" />
        <span className="text-[9px] font-bold text-center leading-tight truncate max-w-full px-1 mt-0.5">
          {alt}
        </span>
      </div>
    );
  };

  if (loadFailed) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        {renderLucideFallback()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${rounded ? 'rounded-2xl' : ''}`}
      referrerPolicy="no-referrer"
      loading="eager"
      onError={() => {
        setLoadFailed(true);
      }}
    />
  );
};
