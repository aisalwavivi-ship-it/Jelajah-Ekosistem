import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherType, WEATHER_CONDITIONS } from '../utils/weather';

interface DynamicWeatherBackgroundProps {
  weather: WeatherType;
}

export const DynamicWeatherBackground: React.FC<DynamicWeatherBackgroundProps> = ({ weather }) => {
  const currentCondition = WEATHER_CONDITIONS[weather];

  // Stable random positions for stars and fireflies
  const stars = useMemo(() => {
    return Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: (i * 37) % 96 + 2,
      y: (i * 23) % 45 + 3,
      size: (i % 3) + 1.5,
      delay: (i * 0.2) % 2.5,
      duration: 1.5 + (i % 4) * 0.5,
    }));
  }, []);

  const fireflies = useMemo(() => {
    return Array.from({ length: 9 }).map((_, i) => ({
      id: i,
      startX: 10 + ((i * 11) % 80),
      startY: 55 + ((i * 7) % 35),
      dx: (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 10),
      dy: (i % 3 === 0 ? -1 : 1) * (10 + (i % 4) * 8),
      delay: i * 0.4,
      duration: 3 + (i % 3) * 1.5,
    }));
  }, []);

  // Pre-calculated rain drops for smooth CSS render
  const raindrops = useMemo(() => {
    return Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: (i * 3.1) % 100,
      delay: ((i * 0.15) % 1.2).toFixed(2),
      duration: (0.7 + (i % 5) * 0.1).toFixed(2),
      opacity: 0.35 + (i % 4) * 0.15,
      height: 22 + (i % 4) * 8,
    }));
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-1000 select-none"
      aria-hidden="true"
      id="dynamic-weather-layer"
    >
      {/* 1. Global Ambient Atmosphere Tone Wash */}
      <AnimatePresence mode="wait">
        <motion.div
          key={weather}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {weather === 'sunny' && (
            <div className="absolute inset-0 bg-gradient-to-b from-amber-200/20 via-sky-100/10 to-emerald-50/15" />
          )}
          {weather === 'clouds' && (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-400/20 via-stone-300/15 to-emerald-900/5" />
          )}
          {weather === 'rain' && (
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/15 via-slate-800/10 to-teal-900/10 backdrop-brightness-[0.97]" />
          )}
          {weather === 'sunset' && (
            <div className="absolute inset-0 bg-gradient-to-b from-orange-400/20 via-rose-300/15 to-amber-200/10" />
          )}
          {weather === 'night' && (
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/25 via-slate-900/20 to-emerald-950/15" />
          )}
        </motion.div>
      </AnimatePresence>

      {/* 2. Weather Phenomena Elements */}

      {/* --- SUNNY / TERIK: Radiant Sun, God Rays & Warm Floating Motes --- */}
      {weather === 'sunny' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Radiant Sun Disc in Top Right */}
          <div className="absolute -top-12 right-6 sm:right-16 w-44 h-44 sm:w-60 sm:h-60 pointer-events-none">
            {/* Outer Warm Glow */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                opacity: [0.35, 0.5, 0.35],
              }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 blur-2xl opacity-40"
            />
            {/* Core Sun Disc */}
            <div className="absolute top-10 right-10 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-100 shadow-[0_0_50px_rgba(251,191,36,0.5)] border border-yellow-200/60" />

            {/* Subtle Rotating Sun Rays */}
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
              className="absolute inset-0 w-full h-full opacity-35"
              viewBox="0 0 200 200"
            >
              <g fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
                <line x1="100" y1="18" x2="100" y2="34" />
                <line x1="100" y1="166" x2="100" y2="182" />
                <line x1="18" y1="100" x2="34" y2="100" />
                <line x1="166" y1="100" x2="182" y2="100" />
                <line x1="42" y1="42" x2="54" y2="54" />
                <line x1="146" y1="146" x2="158" y2="158" />
                <line x1="42" y1="158" x2="54" y2="146" />
                <line x1="146" y1="54" x2="158" y2="42" />
              </g>
            </motion.svg>
          </div>

          {/* Diagonal Godrays / Light Shafts */}
          <div className="absolute top-0 right-0 w-full h-96 opacity-15 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-[140%] h-[120%] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-300/30 via-amber-200/10 to-transparent transform -rotate-12" />
          </div>

          {/* Floating Warm Golden Sun Pollen / Motes */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${15 + (i * 12) % 80}%`,
                y: '100%',
                opacity: 0,
              }}
              animate={{
                y: ['80vh', '15vh'],
                x: [`${15 + (i * 12) % 80}%`, `${18 + ((i * 12) % 80) + (i % 2 === 0 ? 3 : -3)}%`],
                opacity: [0, 0.6, 0.8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 9 + (i % 4) * 2,
                delay: i * 1.1,
                ease: 'easeInOut',
              }}
              className="absolute w-2 h-2 rounded-full bg-amber-300/70 blur-[0.5px] shadow-[0_0_8px_rgba(251,191,36,0.8)]"
            />
          ))}
        </div>
      )}

      {/* --- CLOUDS / MENDUNG: Multiple Drifting Soft Cloud Clusters --- */}
      {(weather === 'clouds' || weather === 'rain') && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Cloud Layer 1 - Slower, larger backdrop clouds */}
          <motion.div
            animate={{ x: ['-20%', '110%'] }}
            transition={{ repeat: Infinity, duration: 65, ease: 'linear' }}
            className="absolute top-3 left-0 opacity-40"
          >
            <svg width="280" height="90" viewBox="0 0 280 90" fill="none">
              <path
                d="M40 70C20 70 5 55 5 35C5 18 20 5 40 5C50 5 60 9 68 16C78 6 93 0 110 0C135 0 155 15 160 36C168 31 178 28 188 28C210 28 228 45 228 66C232 65 236 65 240 65C255 65 268 76 268 90H40V70Z"
                fill={weather === 'rain' ? '#94A3B8' : '#CBD5E1'}
              />
            </svg>
          </motion.div>

          {/* Cloud Layer 2 - Midground soft cloud */}
          <motion.div
            animate={{ x: ['-25%', '115%'] }}
            transition={{ repeat: Infinity, duration: 45, delay: 10, ease: 'linear' }}
            className="absolute top-12 left-0 opacity-50"
          >
            <svg width="220" height="75" viewBox="0 0 220 75" fill="none">
              <path
                d="M30 55C15 55 0 42 0 28C0 14 14 3 28 3C36 3 44 6 50 12C58 4 70 0 83 0C103 0 120 12 125 28C132 24 140 22 148 22C165 22 180 35 180 52C184 51 188 51 192 51C205 51 216 61 216 74H30V55Z"
                fill={weather === 'rain' ? '#64748B' : '#E2E8F0'}
              />
            </svg>
          </motion.div>

          {/* Cloud Layer 3 - Foreground right-drifting cloud */}
          <motion.div
            animate={{ x: ['110%', '-25%'] }}
            transition={{ repeat: Infinity, duration: 55, delay: 5, ease: 'linear' }}
            className="absolute top-8 right-0 opacity-45"
          >
            <svg width="260" height="85" viewBox="0 0 260 85" fill="none">
              <path
                d="M35 65C18 65 2 52 2 35C2 19 16 6 35 6C44 6 52 9 60 16C68 6 82 0 98 0C120 0 138 14 143 32C150 28 158 25 167 25C187 25 204 40 204 60C208 59 212 59 216 59C230 59 242 70 242 84H35V65Z"
                fill={weather === 'rain' ? '#475569' : '#94A3B8'}
              />
            </svg>
          </motion.div>
        </div>
      )}

      {/* --- RAIN / HUJAN: Angled Falling Raindrops & Surface Mist --- */}
      {weather === 'rain' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Falling Raindrops using keyframe motion */}
          {raindrops.map((drop) => (
            <motion.div
              key={drop.id}
              initial={{ y: -60 }}
              animate={{ y: ['-10vh', '105vh'] }}
              transition={{
                repeat: Infinity,
                duration: parseFloat(drop.duration),
                delay: parseFloat(drop.delay),
                ease: 'linear',
              }}
              style={{
                left: `${drop.left}%`,
                height: `${drop.height}px`,
                opacity: drop.opacity,
              }}
              className="absolute w-[1.5px] bg-gradient-to-b from-transparent via-cyan-300 to-sky-400 transform rotate-12"
            />
          ))}

          {/* Ground Splash Ripples along bottom edge */}
          <div className="absolute bottom-2 left-0 right-0 h-10 flex justify-around opacity-30">
            {Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={idx}
                animate={{
                  scale: [0.2, 1.4],
                  opacity: [0.8, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: idx * 0.25,
                  ease: 'easeOut',
                }}
                className="w-8 h-2 rounded-full border border-sky-400"
              />
            ))}
          </div>

          {/* Gentle Base Mist */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-teal-900/10 to-transparent pointer-events-none" />
        </div>
      )}

      {/* --- SUNSET / SENJA: Warm Low Sun, Golden Twilight & Amber Spores --- */}
      {weather === 'sunset' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Low Horizon Sun in Top Center-Left */}
          <div className="absolute top-8 left-12 sm:left-24 w-40 h-40 pointer-events-none">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 via-rose-400 to-amber-400 blur-2xl opacity-50"
            />
            <div className="absolute top-6 left-6 w-28 h-28 rounded-full bg-gradient-to-tr from-amber-500 via-orange-400 to-rose-300 shadow-[0_0_60px_rgba(249,115,22,0.6)]" />
          </div>

          {/* Soft Twilight Purple/Gold Cloud Streaks */}
          <div className="absolute top-16 left-0 right-0 h-32 opacity-25">
            <div className="w-full h-8 bg-gradient-to-r from-transparent via-rose-400 to-transparent blur-md" />
            <div className="w-full h-10 mt-4 bg-gradient-to-r from-transparent via-amber-400/80 to-transparent blur-md" />
          </div>

          {/* Floating Sunset Amber Embers */}
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: `${20 + (i * 11) % 70}%`,
                y: '90vh',
                opacity: 0,
              }}
              animate={{
                y: ['85vh', '25vh'],
                x: [`${20 + (i * 11) % 70}%`, `${22 + ((i * 11) % 70) + (i % 2 === 0 ? 5 : -5)}%`],
                opacity: [0, 0.7, 0.8, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 10 + (i % 3) * 2,
                delay: i * 0.9,
                ease: 'easeInOut',
              }}
              className="absolute w-2 h-2 rounded-full bg-orange-400/80 blur-[0.5px] shadow-[0_0_8px_rgba(249,115,22,0.9)]"
            />
          ))}
        </div>
      )}

      {/* --- NIGHT / MALAM: Crescent Moon, Twinkling Stars & Glowing Fireflies --- */}
      {weather === 'night' && (
        <div className="absolute inset-0 overflow-hidden">
          {/* Crescent Moon in Top Right */}
          <div className="absolute top-8 right-12 sm:right-24 w-16 h-16 pointer-events-none">
            <div className="w-14 h-14 rounded-full shadow-[0_0_30px_rgba(254,240,138,0.5)] flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path
                  d="M36 24C36 33.9411 27.9411 42 18 42C14.7351 42 11.6967 41.1306 9.07471 39.617C18.6655 38.3079 26 30.0163 26 20C26 13.9167 23.2384 8.47794 18.9175 4.90805C28.7885 5.96191 36 14.1611 36 24Z"
                  fill="#FEF08A"
                />
              </svg>
            </div>
          </div>

          {/* Twinkling Starlight Field */}
          {stars.map((s) => (
            <motion.div
              key={s.id}
              animate={{
                opacity: [0.2, 0.9, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                repeat: Infinity,
                duration: s.duration,
                delay: s.delay,
                ease: 'easeInOut',
              }}
              style={{
                top: `${s.y}%`,
                left: `${s.x}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
              }}
              className="absolute rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]"
            />
          ))}

          {/* Fluttering Glowing Fireflies (Kunang-Kunang Hutan) */}
          {fireflies.map((ff) => (
            <motion.div
              key={ff.id}
              animate={{
                x: [0, ff.dx, ff.dx / 2, 0],
                y: [0, ff.dy, ff.dy * 1.5, 0],
                opacity: [0.1, 0.9, 0.4, 0.9, 0.1],
                scale: [0.7, 1.2, 0.9, 1.3, 0.7],
              }}
              transition={{
                repeat: Infinity,
                duration: ff.duration,
                delay: ff.delay,
                ease: 'easeInOut',
              }}
              style={{
                top: `${ff.startY}%`,
                left: `${ff.startX}%`,
              }}
              className="absolute flex items-center justify-center pointer-events-none"
            >
              {/* Outer soft aura */}
              <div className="w-6 h-6 rounded-full bg-lime-300/30 blur-xs" />
              {/* Core light body */}
              <div className="absolute w-2 h-2 rounded-full bg-lime-200 shadow-[0_0_10px_rgba(190,242,100,1)]" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
