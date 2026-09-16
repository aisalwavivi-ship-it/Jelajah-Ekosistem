import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Compass, Footprints } from 'lucide-react';
import { AppScene, MissionId } from '../types';
import { MISSIONS_DATA } from '../data/missions';
import { CharacterAvatar } from './illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface TrailWalkingTransitionProps {
  fromScene: AppScene;
  toScene: AppScene;
  studentName?: string;
  onFinish: () => void;
  onSkip: () => void;
}

interface SceneInfo {
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  thought: string;
}

export const TrailWalkingTransition: React.FC<TrailWalkingTransitionProps> = ({
  fromScene,
  toScene,
  studentName = 'Penjelajah Muda',
  onFinish,
  onSkip,
}) => {
  const [progress, setProgress] = useState(0);
  const [hasArrived, setHasArrived] = useState(false);
  const [footsteps, setFootsteps] = useState<{ id: number; x: number; y: number }[]>([]);

  // Resolve titles and details
  const getSceneDetails = (scene: AppScene): SceneInfo => {
    if (scene === 'start') {
      return {
        title: 'Gerbang Sekolah',
        subtitle: 'Titik Awal Petualangan',
        icon: '🏫',
        badge: 'Titik Mulai',
        thought: `Halo ${studentName}! Siapkan ransel dan kaca pembesar, kita akan menyusuri jalan setapak ekosistem!`,
      };
    }
    if (scene === 'map') {
      return {
        title: 'Peta Penjelajahan',
        subtitle: 'Panduan Jalan Setapak',
        icon: '🗺️',
        badge: 'Peta',
        thought: 'Mari lihat arah jalan setapak kita selanjutnya!',
      };
    }
    if (scene.startsWith('mission-')) {
      const mid = parseInt(scene.replace('mission-', ''), 10) as MissionId;
      const m = MISSIONS_DATA.find((item) => item.id === mid);
      if (m) {
        const thoughts: Record<number, string> = {
          1: 'Jalan setapak ini mengarah ke Taman Sekolah. Lihat tanaman hijau dan kupu-kupu yang berterbangan!',
          2: 'Langkah kita berlanjut ke Jalur Bebatuan! Banyak benda tak hidup dan serangga kecil di sela-selanya.',
          3: 'Memasuki Kebun Rindang yang sejuk... Pepohonan dan cacing tanah hidup berdampingan!',
          4: 'Kita sampai di Area Terbuka yang hangat. Matahari bersinar terang dan angin sepoi-sepoi berhembus.',
          5: 'Jalan setapak bercabang dua! Kita bisa memilih merancang ekosistem Taman atau Kolam yang kaya kehidupan.',
          6: 'Mendekati tepian air yang tenang... Bayangkan apa yang terjadi jika salah satu komponen alam berubah?',
          7: 'Langkah semakin mantap! Kita tiba di Pojok Terpadu untuk menguji ketajaman mata detektif ekosistem.',
          8: 'Jalan setapak menanjak menuju Puncak Pandang! Dari sini seluruh konsep ekosistem terlihat jelas!',
        };

        return {
          title: `Misi ${m.id}: ${m.title}`,
          subtitle: m.subtitle,
          icon: m.icon,
          badge: `Misi ${m.id}`,
          thought: thoughts[m.id] || `Ayo lanjutkan perjalanan menyusuri jalan setapak menuju ${m.title}!`,
        };
      }
    }
    if (scene === 'quiz') {
      return {
        title: 'Tantangan Evaluasi Akhir',
        subtitle: 'Puncak Bukit Pengetahuan',
        icon: '🏆',
        badge: 'Ujian Akhir',
        thought: 'Luar biasa! Kita telah mencapai puncak akhir jalan setapak untuk menguji semua pemahamanmu!',
      };
    }

    return {
      title: 'Jalan Setapak Alam',
      subtitle: 'Menjelajahi Lingkungan',
      icon: '🌿',
      badge: 'Petualangan',
      thought: 'Setiap langkah di jalan setapak membawa kita lebih dekat dengan rahasia alam!',
    };
  };

  const fromInfo = getSceneDetails(fromScene);
  const toInfo = getSceneDetails(toScene);

  // Play rhythmic footsteps & progress simulation
  useEffect(() => {
    // Start footstep audio sequence
    sound.playWalkingSteps(6, 320);

    const startTime = Date.now();
    const duration = 2800; // 2.8 seconds walking sequence

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(currentProgress);

      // Add footstep particles along the path
      if (currentProgress > 5 && currentProgress < 95) {
        setFootsteps((prev) => {
          if (prev.length > 8) return prev.slice(1);
          return [
            ...prev,
            {
              id: Date.now(),
              x: currentProgress - 4,
              y: Math.sin((currentProgress / 100) * Math.PI * 4) * 8,
            },
          ];
        });
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setHasArrived(true);
        sound.playStarEarned();

        // Complete transition after brief celebration pause
        const autoFinishTimer = setTimeout(() => {
          onFinish();
        }, 800);

        return () => clearTimeout(autoFinishTimer);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Interactive Journey Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-4xl bg-gradient-to-b from-amber-50 via-emerald-50 to-stone-100 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden relative flex flex-col"
      >
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-amber-700 via-emerald-800 to-amber-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-lg">
              <Compass className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-200 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                Perjalanan Menyusuri Jalan Setapak
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                Menuju {toInfo.title}
              </h3>
            </div>
          </div>

          {/* Skip Button */}
          <button
            onClick={() => {
              sound.playClick();
              onSkip();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-amber-100 rounded-xl text-xs font-semibold border border-white/20 transition active:scale-95"
          >
            <span>Lewati Jalan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scenic Panoramic Road Canvas */}
        <div className="relative w-full h-64 sm:h-72 bg-gradient-to-b from-sky-200 via-sky-100 to-amber-100 overflow-hidden border-b-2 border-amber-200">
          {/* Distant Mountains Silhouette */}
          <svg
            viewBox="0 0 1000 300"
            className="absolute bottom-16 left-0 right-0 w-full h-36 opacity-35 pointer-events-none"
            preserveAspectRatio="none"
          >
            <polygon points="0,180 160,80 320,200" fill="#93c5fd" />
            <polygon points="260,200 440,60 620,210" fill="#bfdbfe" />
            <polygon points="560,210 750,90 920,220" fill="#6ee7b7" />
            <polygon points="840,220 950,110 1000,190" fill="#a7f3d0" />
          </svg>

          {/* Floating Clouds & Gentle Sun */}
          <motion.div
            animate={{ x: [0, 25, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: 'easeInOut', type: 'tween' }}
            className="absolute top-4 left-10 text-3xl opacity-80"
          >
            ☁️
          </motion.div>
          <motion.div
            animate={{ x: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut', type: 'tween' }}
            className="absolute top-8 right-16 text-2xl opacity-75"
          >
            ☁️
          </motion.div>
          <div className="absolute top-3 right-8 text-3xl">☀️</div>

          {/* Animated Butterfly fluttering across */}
          <motion.div
            animate={{
              x: ['10%', '90%'],
              y: [60, 40, 75, 45, 65],
              rotate: [0, 15, -15, 10, 0],
            }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className="absolute text-xl pointer-events-none z-10"
          >
            🦋
          </motion.div>

          {/* Scenery Trees & Bushes */}
          <div className="absolute bottom-24 left-6 text-3xl opacity-90">🌳</div>
          <div className="absolute bottom-28 left-28 text-2xl opacity-75">🌲</div>
          <div className="absolute bottom-26 right-28 text-3xl opacity-85">🌳</div>
          <div className="absolute bottom-24 right-8 text-2xl opacity-80">🪴</div>

          {/* SVG Winding Dirt Road (Jalan Setapak) */}
          <svg
            viewBox="0 0 1000 240"
            className="absolute bottom-0 left-0 right-0 w-full h-40 pointer-events-none"
            preserveAspectRatio="none"
          >
            {/* Green verge / grassy roadside */}
            <path
              d="M 0 240 L 0 160 Q 250 110 500 150 T 1000 130 L 1000 240 Z"
              fill="#86efac"
              opacity="0.7"
            />
            {/* Dark earthy base */}
            <path
              d="M 0 240 Q 250 130 500 170 T 1000 150 L 1000 240 Z"
              fill="#78350f"
              opacity="0.3"
            />
            {/* Warm dirt pathway */}
            <path
              d="M 0 215 C 200 150, 400 210, 600 175 S 850 190, 1000 160"
              stroke="#d97706"
              strokeWidth="54"
              strokeLinecap="round"
              fill="none"
            />
            {/* Pathway texture stones */}
            <path
              d="M 0 215 C 200 150, 400 210, 600 175 S 850 190, 1000 160"
              stroke="#b45309"
              strokeWidth="42"
              strokeLinecap="round"
              fill="none"
              opacity="0.85"
            />
            {/* Stepping stone pavers line */}
            <path
              d="M 0 215 C 200 150, 400 210, 600 175 S 850 190, 1000 160"
              stroke="#fef3c7"
              strokeWidth="6"
              strokeDasharray="16 22"
              fill="none"
              opacity="0.9"
            />
          </svg>

          {/* Start Point Marker Signpost (Left) */}
          <div className="absolute bottom-12 left-4 sm:left-8 z-10 flex flex-col items-center">
            <div className="px-2.5 py-1 bg-amber-900/90 text-amber-100 rounded-xl border border-amber-600 shadow-md text-center max-w-[120px]">
              <span className="text-xs block font-bold truncate">{fromInfo.title}</span>
              <span className="text-[9px] text-amber-300">Asal</span>
            </div>
            <div className="w-2.5 h-7 bg-amber-950 rounded-b shadow-sm" />
          </div>

          {/* Destination Milestone Post (Right) */}
          <div className="absolute bottom-14 right-4 sm:right-8 z-10 flex flex-col items-center">
            <motion.div
              animate={hasArrived ? { scale: [1, 1.15, 1], rotate: [0, -3, 3, 0] } : {}}
              className={`px-3 py-1 rounded-xl border-2 shadow-lg text-center max-w-[150px] transition-all ${
                hasArrived
                  ? 'bg-amber-400 text-stone-900 border-white ring-4 ring-amber-300'
                  : 'bg-emerald-800 text-emerald-50 border-emerald-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm">{toInfo.icon}</span>
                <span className="text-xs font-display font-bold truncate">{toInfo.title}</span>
              </div>
              <span className="text-[9px] font-semibold block text-emerald-200">
                {hasArrived ? '🎉 Tiba di Tujuan!' : 'Tujuan'}
              </span>
            </motion.div>
            <div className="w-2.5 h-7 bg-emerald-950 rounded-b shadow-sm" />
          </div>

          {/* Dynamic Footsteps Particles on the Path */}
          {footsteps.map((fs) => (
            <motion.div
              key={fs.id}
              initial={{ opacity: 0.8, scale: 0.6 }}
              animate={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 1.5 }}
              style={{
                left: `${fs.x}%`,
                bottom: `${48 + fs.y}%`,
              }}
              className="absolute pointer-events-none text-stone-700/50 text-xs transform -translate-x-1/2 -translate-y-1/2 font-bold"
            >
              👣
            </motion.div>
          ))}

          {/* THE MAIN CHARACTER WALKING ALONG THE PATH */}
          <motion.div
            style={{
              left: `${Math.min(84, Math.max(8, progress * 0.8 + 8))}%`,
              bottom: `${42 + Math.sin((progress / 100) * Math.PI * 3.5) * 6}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none"
          >
            {/* Thought / Dialogue Bubble while walking */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-white/95 text-stone-900 px-3 py-1.5 rounded-2xl shadow-lg border border-amber-300 text-center mb-1 max-w-[200px] sm:max-w-[260px]"
              >
                <p className="text-[11px] font-medium leading-tight text-stone-800">
                  {hasArrived
                    ? '✨ Hore, kita sudah sampai di tujuan! Mari mulai misinya!'
                    : `Menyusuri jalan setapak...`}
                </p>
                {/* Pointer triangle */}
                <div className="w-2.5 h-2.5 bg-white rotate-45 mx-auto -mb-2 border-r border-b border-amber-300" />
              </motion.div>
            </AnimatePresence>

            {/* Character Avatar with Walking or Celebrating State */}
            <div className="relative">
              <CharacterAvatar
                size="lg"
                isWalking={!hasArrived}
                isCelebrating={hasArrived}
                direction="right"
              />

              {/* Dust puffs while walking */}
              {!hasArrived && (
                <motion.div
                  animate={{ opacity: [0.6, 0], scale: [0.8, 1.4], x: [-5, -15] }}
                  transition={{ repeat: Infinity, duration: 0.35, type: 'tween', ease: 'easeOut' }}
                  className="absolute -bottom-1 left-2 w-4 h-2 bg-amber-400/40 rounded-full blur-xs pointer-events-none"
                />
              )}

              {/* Celebration Star sparkles when arrived */}
              {hasArrived && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: 1 }}
                  transition={{ duration: 0.6, type: 'tween', ease: 'easeOut' }}
                  className="absolute -top-3 -right-2 text-2xl text-amber-500"
                >
                  <Sparkles className="w-6 h-6 fill-amber-400 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Story Card & Exploration Notes */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/90">
          <div className="flex-1 space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {toInfo.badge}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                Pemberhentian Selanjutnya
              </span>
            </div>
            <h4 className="font-display font-extrabold text-base sm:text-lg text-emerald-950">
              {toInfo.title}
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-medium">
              {toInfo.thought}
            </p>
          </div>

          {/* Action / Progress Area */}
          <div className="w-full sm:w-64 flex flex-col items-center sm:items-end gap-2 shrink-0">
            {/* Walking Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-[11px] font-bold text-stone-600 mb-1">
                <span className="flex items-center gap-1">
                  <span>🚶‍♂️</span>
                  <span>Jalan Setapak</span>
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden border border-stone-300 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Arrive Button */}
            <button
              onClick={() => {
                sound.playStarEarned();
                onFinish();
              }}
              className={`w-full py-2 px-4 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 ${
                hasArrived
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              <span>{hasArrived ? 'Masuk ke Misi Sekarang!' : 'Lanjutkan Langkah ➔'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
