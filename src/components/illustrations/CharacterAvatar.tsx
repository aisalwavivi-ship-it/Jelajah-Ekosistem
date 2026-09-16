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
  showMagnifier = true,
  direction = 'right',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  return (
    <motion.div
      className={`relative inline-block select-none ${sizeMap[size]} ${className}`}
      animate={
        isCelebrating
          ? { y: [0, -12, 0, -8, 0], rotate: [0, -4, 4, -2, 0], scaleX: direction === 'left' ? -1 : 1 }
          : isWalking
          ? { y: [0, -6, 0, -5, 0], rotate: [-3, 3, -3], scaleX: direction === 'left' ? -1 : 1 }
          : { y: [0, -2, 0], scaleX: direction === 'left' ? -1 : 1 }
      }
      transition={{
        duration: isCelebrating ? 0.7 : isWalking ? 0.35 : 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full drop-shadow-md overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <motion.ellipse
          cx="60"
          cy="114"
          rx={isWalking ? 28 : 34}
          ry="6"
          fill="#00000018"
          animate={isWalking ? { scale: [0.85, 1, 0.85] } : {}}
          transition={{ repeat: Infinity, duration: 0.35 }}
        />

        {/* Explorer Backpack on back */}
        <g>
          <rect x="25" y="60" width="15" height="24" rx="4" fill="#854d0e" />
          <rect x="23" y="66" width="6" height="12" rx="2" fill="#a16207" />
          {/* Bedroll on top of backpack */}
          <ellipse cx="32" cy="58" rx="8" ry="4" fill="#047857" />
        </g>

        {/* Boots with walking movement */}
        <g>
          <motion.ellipse
            cx="48"
            cy="108"
            rx="9"
            ry="5"
            fill="#854d0e"
            animate={isWalking ? { y: [0, -5, 0], x: [0, 2, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.35 }}
          />
          <motion.ellipse
            cx="72"
            cy="108"
            rx="9"
            ry="5"
            fill="#713f12"
            animate={isWalking ? { y: [-5, 0, -5], x: [0, -2, 0] } : {}}
            transition={{ repeat: Infinity, duration: 0.35 }}
          />
        </g>

        {/* Legs / Khaki shorts */}
        <path d="M43 90 L53 90 L51 106 L45 106 Z" fill="#ca8a04" />
        <path d="M67 90 L77 90 L75 106 L69 106 Z" fill="#a16207" />

        {/* Explorer Body / Vest */}
        <path
          d="M38 62 C38 52 82 52 82 62 L85 92 C85 94 35 94 35 92 Z"
          fill="#15803d"
        />
        {/* Shirt inner */}
        <path d="M52 56 L68 56 L63 90 L57 90 Z" fill="#fef08a" />
        {/* Vest collar & pockets */}
        <path d="M42 66 L52 74 L42 82 Z" fill="#166534" />
        <path d="M78 66 L68 74 L78 82 Z" fill="#14532d" />
        <rect x="42" y="78" width="9" height="8" rx="2" fill="#166534" />
        <rect x="69" y="78" width="9" height="8" rx="2" fill="#14532d" />

        {/* Neck */}
        <rect x="54" y="47" width="12" height="10" rx="3" fill="#fbcfe8" />

        {/* Head */}
        <circle cx="60" cy="38" r="18" fill="#fed7aa" />

        {/* Cheerful Eyes */}
        <circle cx="53" cy="36" r="2.8" fill="#1c1917" />
        <circle cx="67" cy="36" r="2.8" fill="#1c1917" />
        <circle cx="54" cy="35" r="1" fill="#ffffff" />
        <circle cx="68" cy="35" r="1" fill="#ffffff" />

        {/* Rosy Cheeks */}
        <circle cx="48" cy="42" r="3" fill="#fca5a5" opacity="0.6" />
        <circle cx="72" cy="42" r="3" fill="#fca5a5" opacity="0.6" />

        {/* Happy Smile */}
        <path
          d="M54 42 Q60 48 66 42"
          stroke="#78350f"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Hair */}
        <path
          d="M42 34 C42 22 78 22 78 34 C76 30 70 28 60 28 C50 28 44 30 42 34 Z"
          fill="#451a03"
        />

        {/* Explorer Safari Hat */}
        <g>
          {/* Hat brim */}
          <ellipse cx="60" cy="26" rx="28" ry="7" fill="#b45309" />
          {/* Hat crown */}
          <path
            d="M44 26 C44 14 76 14 76 26 Z"
            fill="#d97706"
          />
          {/* Hat band with leaf badge */}
          <ellipse cx="60" cy="25" rx="16" ry="3.5" fill="#15803d" />
          <circle cx="60" cy="24" r="2.5" fill="#fde047" />
        </g>

        {/* Magnifying Glass in hand */}
        {showMagnifier && (
          <g>
            {/* Hand */}
            <circle cx="88" cy="74" r="5" fill="#fed7aa" />
            {/* Handle */}
            <line
              x1="88"
              y1="74"
              x2="98"
              y2="64"
              stroke="#78350f"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Rim */}
            <circle
              cx="102"
              cy="60"
              r="8"
              stroke="#d97706"
              strokeWidth="2.5"
              fill="#bae6fd"
              fillOpacity="0.5"
            />
            {/* Glass highlight */}
            <path
              d="M98 56 Q102 54 105 57"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>
    </motion.div>
  );
};
