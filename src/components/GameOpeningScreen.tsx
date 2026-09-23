import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { CharacterAvatar } from './illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface GameOpeningScreenProps {
  onFinish: () => void;
  studentName?: string;
}

export const GameOpeningScreen: React.FC<GameOpeningScreenProps> = ({
  onFinish,
  studentName = 'Penjelajah Muda',
}) => {
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Play short opening jingle with browser autoplay safety
  useEffect(() => {
    // 1. Attempt to play cheerful opening jingle
    sound.playOpeningJingle();

    // 2. Safe user-gesture fallback if browser strictly blocked autoplay
    const handleFirstGesture = () => {
      sound.playOpeningJingle();
      window.removeEventListener('pointerdown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      // Clean up opening sound when leaving opening screen
      sound.stopOpeningJingle();
    };
  }, []);

  const handleStart = () => {
    if (isStarting || isExiting) return;
    sound.stopOpeningJingle();
    sound.playGameStartTransition();
    setIsStarting(true);

    // Animasi Game Start Transition berjalan ~1.0 detik sebelum berpindah mulus ke Home
    setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        onFinish();
      }, 120);
    }, 950);
  };

  const handleSkip = () => {
    if (isStarting || isExiting) return;
    sound.stopOpeningJingle();
    sound.playClick();
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 200);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="game-opening-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col justify-between items-center w-full h-full overflow-y-auto select-none"
        >
          {/* 1. Existing Ecosystem Background with gentle cinematic entrance & game-start forward glide */}
          <motion.div
            className="fixed inset-0 w-full h-full pointer-events-none -z-10"
            initial={{ scale: 1.05, opacity: 0.85 }}
            animate={
              isStarting
                ? { scale: 1.14, opacity: 0.35 }
                : { scale: 1.0, opacity: 1 }
            }
            transition={
              isStarting
                ? { duration: 0.95, ease: 'easeInOut' }
                : { duration: 1.6, ease: 'easeOut' }
            }
            style={{
              backgroundImage: "url('/jelajah-ekosistem-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Ambient vignette and subtle darkening to ensure maximum legibility */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/25 to-black/55 pointer-events-none" />
            <div className="absolute inset-0 bg-emerald-950/15 pointer-events-none" />
          </motion.div>

          {/* Glowing Nature & Adventure Transition Veil when entering game */}
          {isStarting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0.85, 0] }}
              transition={{ duration: 1.0, ease: 'easeInOut' }}
              className="fixed inset-0 pointer-events-none bg-gradient-to-b from-amber-200/25 via-emerald-200/20 to-teal-900/35 backdrop-blur-[2px] z-30"
            />
          )}

          {/* Floating Nature Elements (Leaves & Ambient Glow) */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-5">
            {[
              { id: 1, left: '10%', delay: 0.2, dur: 7, size: 'text-xl', icon: '🍃' },
              { id: 2, left: '35%', delay: 1.5, dur: 8, size: 'text-2xl', icon: '🌿' },
              { id: 3, left: '75%', delay: 0.8, dur: 6.5, size: 'text-lg', icon: '🍃' },
              { id: 4, left: '88%', delay: 2.2, dur: 9, size: 'text-xl', icon: '✨' },
            ].map((leaf) => (
              <motion.div
                key={leaf.id}
                initial={{ y: -40, opacity: 0, x: 0 }}
                animate={{
                  y: ['0vh', '110vh'],
                  x: [0, 25, -20, 15, 0],
                  opacity: [0, 0.8, 0.8, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: leaf.dur,
                  repeat: Infinity,
                  delay: leaf.delay,
                  ease: 'easeInOut',
                }}
                style={{ left: leaf.left }}
                className={`absolute top-0 ${leaf.size} pointer-events-none filter drop-shadow-xs`}
              >
                {leaf.icon}
              </motion.div>
            ))}

            {/* Soft Golden Sunbeam Glow from top canopy */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-amber-200/30 via-emerald-200/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Top Bar: Mini Tag (Tombol Lewati di pojok kanan atas telah dihapus sesuai instruksi) */}
          <div className="w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6 flex items-center justify-between z-20 shrink-0">
            {/* Mini Game Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={isStarting ? { opacity: 0, y: -15 } : { opacity: 1, y: 0 }}
              transition={{ duration: isStarting ? 0.35 : 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-sm text-emerald-200 text-xs font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Petualangan Sains SD</span>
            </motion.div>

            {/* Area kanan atas bersih tanpa tombol Lewati sekunder */}
            <div className="w-10 h-6" />
          </div>

          {/* Center Stage: Title, Subtitle, Character & Primary CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.84, y: 28 }}
            animate={
              isStarting
                ? { opacity: 0, scale: 1.06, y: -24, filter: 'blur(4px)' }
                : { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }
            }
            transition={
              isStarting
                ? { duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }
            }
            className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center justify-center text-center z-20 my-auto relative"
          >
            {/* Dynamic Game Start Burst Particles and Sunburst Aura when button is pressed */}
            {isStarting && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
                {/* Radial golden-emerald burst */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0 }}
                  animate={{ scale: [0.2, 1.6, 2.4], opacity: [0, 0.8, 0] }}
                  transition={{ duration: 0.85, ease: 'easeOut' }}
                  className="w-64 h-64 rounded-full bg-radial from-amber-300/60 via-emerald-400/30 to-transparent blur-xl"
                />

                {/* Sparkling adventure elements popping outward */}
                {[
                  { id: 1, angle: 0, dist: 130, icon: '✨', delay: 0.0 },
                  { id: 2, angle: 45, dist: 150, icon: '🍃', delay: 0.04 },
                  { id: 3, angle: 90, dist: 120, icon: '⭐', delay: 0.02 },
                  { id: 4, angle: 135, dist: 145, icon: '🌿', delay: 0.05 },
                  { id: 5, angle: 180, dist: 130, icon: '✨', delay: 0.01 },
                  { id: 6, angle: 225, dist: 155, icon: '🍃', delay: 0.06 },
                  { id: 7, angle: 270, dist: 125, icon: '⭐', delay: 0.03 },
                  { id: 8, angle: 315, dist: 145, icon: '✨', delay: 0.04 },
                ].map((p) => {
                  const rad = (p.angle * Math.PI) / 180;
                  const tx = Math.cos(rad) * p.dist;
                  const ty = Math.sin(rad) * p.dist;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                      animate={{
                        x: tx,
                        y: ty,
                        scale: [0, 1.35, 0.7],
                        opacity: [0, 1, 0],
                        rotate: [0, 180],
                      }}
                      transition={{ duration: 0.75, delay: p.delay, ease: 'easeOut' }}
                      className="absolute text-2xl filter drop-shadow-md pointer-events-none select-none"
                    >
                      {p.icon}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Category Pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400 text-amber-950 font-bold text-xs sm:text-sm shadow-md border border-amber-200 mb-2"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Petualangan Penyelidikan Alam</span>
              <Sparkles className="w-3.5 h-3.5 fill-current" />
            </motion.div>

            {/* 1. Game Title: 🌿 JELAJAH EKOSISTEM */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-white tracking-tight leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,0.7)]"
            >
              <span className="text-emerald-300 drop-shadow-[0_2px_6px_rgba(6,78,59,0.9)]">🌿 </span>
              <span className="bg-gradient-to-b from-white via-amber-50 to-amber-100 bg-clip-text text-transparent">
                JELAJAH EKOSISTEM
              </span>
            </motion.h1>

            {/* 2. Subtitle: “Siap menjelajahi dunia ekosistem?” */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              className="mt-2.5 max-w-xl"
            >
              <p className="font-display font-semibold text-lg sm:text-2xl text-amber-200 drop-shadow-[0_2px_5px_rgba(0,0,0,0.8)]">
                “Siap menjelajahi dunia ekosistem?”
              </p>
              <p className="text-xs sm:text-sm text-stone-200 font-medium mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                Temukan komponen biotik, abiotik, serta rahasia keseimbangan alam di sekitarmu!
              </p>
            </motion.div>

            {/* Explorer Character Mascot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
              className="mt-4 mb-2 flex flex-col items-center"
            >
              {/* Speech bubble */}
              <div className="bg-white/95 text-stone-800 px-3.5 py-1.5 rounded-2xl shadow-lg border-2 border-amber-300 text-center mb-1.5">
                <span className="text-xs font-bold text-emerald-950">
                  👋 Halo {studentName}! Ayo kita mulai petualangannya!
                </span>
                <div className="w-2.5 h-2.5 bg-white rotate-45 mx-auto -mb-2 border-r-2 border-b-2 border-amber-300" />
              </div>

              {/* Character Avatar */}
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <CharacterAvatar
                  size="md"
                  isCelebrating={true}
                  direction="right"
                />
              </div>
            </motion.div>

            {/* 3. TOMBOL UTAMA (CTA PRIMARY): ▶ MULAI PETUALANGAN */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.35 }}
              className="mt-3 w-full max-w-sm sm:max-w-md flex flex-col items-center"
            >
              <motion.button
                id="btn-start-opening-adventure"
                onClick={handleStart}
                whileHover={{ scale: isStarting ? 1 : 1.03 }}
                whileTap={{ scale: 0.95 }}
                animate={
                  isStarting
                    ? {
                        scale: [1, 0.93, 1.08, 1.02],
                        boxShadow: [
                          '0 0 0 0 rgba(251, 191, 36, 0.8)',
                          '0 0 40px 12px rgba(251, 191, 36, 0.9)',
                          '0 0 50px 16px rgba(16, 185, 129, 0.8)',
                        ],
                      }
                    : {
                        scale: [1, 1.015, 1],
                        boxShadow: [
                          '0 10px 25px -5px rgba(5, 150, 105, 0.5)',
                          '0 14px 35px -2px rgba(16, 185, 129, 0.75)',
                          '0 10px 25px -5px rgba(5, 150, 105, 0.5)',
                        ],
                      }
                }
                transition={
                  isStarting
                    ? { duration: 0.8, ease: 'easeOut' }
                    : {
                        scale: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                        boxShadow: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                      }
                }
                className="w-full py-4 px-6 sm:px-8 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-display font-black text-xl sm:text-2xl rounded-2xl shadow-2xl border-2 border-amber-300 flex items-center justify-center gap-3 transition cursor-pointer relative overflow-hidden"
              >
                {/* Gentle shimmering light sweep when starting */}
                {isStarting && (
                  <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{ duration: 0.65, ease: 'easeInOut' }}
                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none"
                  />
                )}
                <span className="text-amber-300 text-xl sm:text-2xl leading-none select-none">▶</span>
                <span className="tracking-wide drop-shadow-sm">MULAI PETUALANGAN</span>
              </motion.button>

              {/* 4. SATU-SATUNYA TOMBOL LEWATI (Berada di bawah tombol utama) */}
              <motion.button
                id="btn-skip-opening-bottom"
                onClick={handleSkip}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-3 text-stone-200 hover:text-white text-xs sm:text-sm font-semibold underline underline-offset-4 decoration-stone-400 hover:decoration-white transition cursor-pointer py-1 px-3"
              >
                Lewati
              </motion.button>
            </motion.div>

          </motion.div>

          {/* Bottom Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isStarting ? { opacity: 0 } : { opacity: 0.85 }}
            transition={{ duration: 0.35, delay: isStarting ? 0 : 0.4 }}
            className="w-full text-center pb-3 sm:pb-4 z-20 shrink-0"
          >
            <p className="text-[11px] text-white/80 font-medium drop-shadow-sm">
              Kurikulum Merdeka • Kelas 5 SD • Ilmu Pengetahuan Alam dan Sosial (IPAS)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
