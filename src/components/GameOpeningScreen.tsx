import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, Compass, Trees, Wind, ChevronRight } from 'lucide-react';
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
  const [phase, setPhase] = useState<number>(1);
  const [isExiting, setIsExiting] = useState<boolean>(false);

  // Progressive timed reveal of the opening game sequences (smooth & responsive)
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 500);   // Scene 2: Title card
    const t2 = setTimeout(() => setPhase(3), 1100);  // Scene 3: Subtitle
    const t3 = setTimeout(() => setPhase(4), 1600);  // Scene 4: Mascot & Nature Elements
    const t4 = setTimeout(() => setPhase(5), 2100);  // Scene 5: Primary Action Call

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const handleStart = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      sound.playFootstep();
      sound.playStarEarned();
    } catch (err) {
      console.warn('Audio play error in opening:', err);
    }
    setIsExiting(true);
    // Instant fallback call to guarantee transition occurs
    setTimeout(() => {
      onFinish();
    }, 150);
  };

  const handleSkip = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.stopPropagation();
    }
    try {
      sound.playClick();
    } catch (err) {
      console.warn('Audio click error in opening:', err);
    }
    setIsExiting(true);
    setTimeout(() => {
      onFinish();
    }, 150);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          id="game-opening-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between items-center w-full h-full h-screen max-h-screen overflow-hidden select-none touch-manipulation"
        >
          {/* SCENE 1: Existing Ecosystem Background with gentle cinematic zoom */}
          <motion.div
            className="absolute inset-0 w-full h-full pointer-events-none -z-10"
            initial={{ scale: 1.08, opacity: 0.7 }}
            animate={{ scale: 1.0, opacity: 1 }}
            transition={{ duration: 2.5, ease: 'easeOut' }}
            style={{
              backgroundImage: "url('/jelajah-ekosistem-bg.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Cinematic subtle vignette & ambient light overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45 pointer-events-none" />
            <div className="absolute inset-0 bg-emerald-950/10 pointer-events-none" />
          </motion.div>

          {/* SCENE 4: Floating Ambient Nature Elements (Wind Leaves & Sun Rays) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Soft floating leaves */}
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

            {/* Soft Golden Sunbeam Glow from upper canopy */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.15, 0.3, 0.15] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-amber-200/35 via-emerald-200/10 to-transparent rounded-full blur-3xl pointer-events-none"
            />
          </div>

          {/* Top Bar: Skip Button and Mini Tag */}
          <div className="w-full max-w-6xl mx-auto px-4 pt-3 sm:pt-4 flex items-center justify-between z-20 shrink-0">
            {/* Mini Game Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-md text-emerald-950 text-xs font-bold"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Game Petualangan Sains SD</span>
            </motion.div>

            {/* Tombol Skip: Lewati */}
            <button
              id="btn-skip-opening"
              type="button"
              onClick={handleSkip}
              onTouchEnd={handleSkip}
              className="group inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/85 hover:bg-white active:scale-95 text-stone-700 hover:text-stone-900 border border-stone-200/80 shadow-md text-xs font-bold transition-all cursor-pointer backdrop-blur-md pointer-events-auto touch-manipulation"
            >
              <span>Lewati</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-500 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Center Stage: Title, Subtitle, Character & Call to Action */}
          <div className="w-full max-w-3xl mx-auto px-4 py-1 flex-1 flex flex-col items-center justify-center text-center relative z-30 pointer-events-auto min-h-0">
            
            {/* SCENE 2: Game Title "🌿 JELAJAH EKOSISTEM" */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-1.5 sm:space-y-2"
                >
                  {/* Category Pill */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-0.5 rounded-full bg-amber-400/90 text-amber-950 font-bold text-xs shadow-md border border-amber-200/80">
                    <Sparkles className="w-3 h-3 fill-current" />
                    <span>Petualangan Penyelidikan Alam</span>
                    <Sparkles className="w-3 h-3 fill-current" />
                  </div>

                  {/* Main Title Card */}
                  <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.55)]">
                    <span className="text-emerald-300 drop-shadow-[0_2px_4px_rgba(6,78,59,0.9)]">🌿 </span>
                    <span className="bg-gradient-to-b from-white via-amber-50 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)]">
                      JELAJAH EKOSISTEM
                    </span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SCENE 3: Subtitle "Siap menjelajahi dunia ekosistem?" */}
            <AnimatePresence>
              {phase >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  className="mt-1 sm:mt-2 max-w-xl"
                >
                  <p className="font-display font-medium text-sm sm:text-lg md:text-xl text-amber-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                    “Siap menjelajahi dunia ekosistem?”
                  </p>
                  <p className="text-[11px] sm:text-xs md:text-sm text-stone-100/90 font-medium mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
                    Temukan komponen biotik, abiotik, rantai makanan, dan rahasia keseimbangan alam di sekitarmu!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SCENE 4: New Explorer Character Mascot with gentle stepping motion */}
            <AnimatePresence>
              {phase >= 4 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="mt-2 sm:mt-3 mb-1 sm:mb-2 flex flex-col items-center relative"
                >
                  {/* Floating speech bubble greeting */}
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="bg-white/95 text-stone-800 px-3 py-1 rounded-2xl shadow-xl border-2 border-amber-300 text-center mb-1"
                  >
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-950 flex items-center gap-1">
                      <span>👋 Halo {studentName}! Ayo kita mulai petualangannya!</span>
                    </span>
                    <div className="w-2 h-2 bg-white rotate-45 mx-auto -mb-1 border-r-2 border-b-2 border-amber-300" />
                  </motion.div>

                  {/* Character Avatar */}
                  <div className="relative">
                    <CharacterAvatar
                      size="md"
                      isCelebrating={true}
                      direction="right"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* SCENE 5: Primary Action "▶ MULAI PETUALANGAN" */}
            <AnimatePresence>
              {phase >= 5 && (
                <motion.div
                  initial={{ opacity: 0, y: 16, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 18,
                  }}
                  className="mt-2 sm:mt-3 w-full max-w-xs sm:max-w-sm relative z-40 pointer-events-auto shrink-0"
                >
                  <button
                    id="btn-start-opening-adventure"
                    type="button"
                    onClick={handleStart}
                    onTouchEnd={handleStart}
                    className="w-full py-3 sm:py-3.5 px-6 sm:px-8 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-display font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-700/40 border-2 border-emerald-300 flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer pointer-events-auto touch-manipulation select-none ring-4 ring-emerald-400/30"
                  >
                    <Play className="w-5 h-5 fill-current shrink-0" />
                    <span>MULAI PETUALANGAN</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Bottom Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="w-full text-center pb-2 sm:pb-3 z-20 shrink-0"
          >
            <p className="text-[10px] sm:text-[11px] text-white/80 font-medium drop-shadow-sm">
              Kurikulum Merdeka • Kelas 5 SD • Ilmu Pengetahuan Alam dan Sosial (IPAS)
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
