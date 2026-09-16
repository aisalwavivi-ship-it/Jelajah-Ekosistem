import React from 'react';
import { motion } from 'motion/react';

interface CharacterAvatarProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isWalking?: boolean;
  isCelebrating?: boolean;
  showMagnifier?: boolean;
  direction?: 'left' | 'right';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
  className = '',
  size = 'md',
  isWalking = false,
  isCelebrating = false,
  direction = 'right',
}) => {
  const sizeMap = {
    sm: 'w-10 h-13 sm:w-11 sm:h-14',
    md: 'w-16 h-20 sm:w-18 sm:h-23',
    lg: 'w-24 h-30 sm:w-28 sm:h-35',
    xl: 'w-36 h-45 sm:w-44 sm:h-55',
  };

  return (
    <div className={`relative inline-flex flex-col items-center justify-end select-none ${sizeMap[size]} ${className}`}>
      {/* Ground Contact Shadow */}
      <motion.div
        className="absolute bottom-0 w-3/4 h-2.5 bg-black/20 rounded-full blur-[1.5px] pointer-events-none -z-0"
        animate={
          isCelebrating
            ? { scale: [1, 0.5, 1, 0.7, 1], opacity: [0.25, 0.1, 0.25, 0.15, 0.25] }
            : isWalking
            ? { scale: [0.85, 1.05, 0.85], opacity: [0.28, 0.18, 0.28] }
            : { scale: [0.95, 1, 0.95], opacity: [0.22, 0.26, 0.22] }
        }
        transition={{
          repeat: Infinity,
          duration: isCelebrating ? 0.7 : isWalking ? 0.35 : 2.4,
          ease: 'easeInOut',
          type: 'tween',
        }}
      />

      {/* Main Explorer Character Sprite */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center z-10 origin-bottom"
        animate={
          isCelebrating
            ? {
                y: [0, -14, 0, -8, 0],
                rotate: [0, -4, 4, -2, 0],
                scale: [1, 1.05, 1, 1.03, 1],
                scaleX: direction === 'left' ? -1 : 1,
              }
            : isWalking
            ? {
                y: [0, -6, 0, -5, 0],
                rotate: [-3, 3, -3],
                scaleX: direction === 'left' ? -1 : 1,
              }
            : {
                y: [0, -2.5, 0],
                scaleX: direction === 'left' ? -1 : 1,
              }
        }
        transition={{
          duration: isCelebrating ? 0.7 : isWalking ? 0.35 : 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
          type: 'tween',
        }}
      >
        <img
          src="/karakter-penjelajah.png"
          alt="Penjelajah Cilik"
          className="w-full h-full object-contain filter drop-shadow-md select-none pointer-events-none"
          referrerPolicy="no-referrer"
          loading="eager"
        />
      </motion.div>
    </div>
  );
};
