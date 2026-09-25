import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Compass, Footprints } from 'lucide-react';
import { AppScene } from '../types';
import { CharacterAvatar } from './illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

export interface MissionTransitionData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
}

// Single source of truth for mission transition data
export const MISSIONS: MissionTransitionData[] = [
  {
    id: 1,
    title: 'Pengenalan Ekosistem',
    subtitle: 'Memulai Petualangan',
    description: 'Gerbang awal untuk memahami ekosistem sebagai kesatuan makhluk hidup dan lingkungan tak hidup yang saling berkaitan.',
  },
  {
    id: 2,
    title: 'Jelajah Jenis Ekosistem',
    subtitle: 'Ekosistem Darat & Air',
    description: 'Kenali dua kelompok besar ekosistem: Ekosistem Darat (hutan, kebun, taman) dan Ekosistem Air (sungai, kolam, danau).',
  },
  {
    id: 3,
    title: 'Siapa Aku? (Individu)',
    subtitle: 'Satu Makhluk Hidup',
    description: 'Individu adalah satu makhluk hidup tunggal. Temukan dan amati berbagai individu di alam sekitar kita!',
  },
  {
    id: 4,
    title: 'Temukan Populasi',
    subtitle: 'Kumpulan Individu Sejenis',
    description: 'Populasi adalah sekumpulan individu sejenis yang hidup bersama di suatu tempat dan waktu yang sama.',
  },
  {
    id: 5,
    title: 'Temukan Komunitas',
    subtitle: 'Kumpulan Berbagai Populasi',
    description: 'Komunitas adalah kumpulan dari bermacam-macam populasi makhluk hidup yang hidup berdampingan di lingkungan yang sama.',
  },
  {
    id: 6,
    title: 'Detektif Biotik & Abiotik',
    subtitle: 'Game Pilahkan Komponen',
    description: 'Biotik adalah seluruh makhluk hidup, sedangkan abiotik adalah faktor dan benda tak hidup penyokong kehidupan.',
  },
  {
    id: 7,
    title: 'Misi Gabungan Ekosistem',
    subtitle: 'Penyelidikan Lingkungan Nyata',
    description: 'Menyelidiki alur nyata pembentukan ekosistem: dari individu tunggal, populasi, komunitas, hingga menyatu harmonis.',
  },
  {
    id: 8,
    title: 'Piramida Ekosistem',
    subtitle: 'Puncak Rangkuman Ekosistem',
    description: 'Susun tingkat trofik dari Produsen hingga Konsumen Puncak untuk memahami keseimbangan dan aliran energi ekosistem.',
  },
];

export interface SceneTransitionInfo {
  sceneId: AppScene;
  stepNumber: number;
  primaryBoardText: string;
  secondaryBoardText: string;
  headerTitle: string;
  badgeLabel: string;
  badgeSubtitle: string;
  title: string;
  subtitle: string;
  description: string;
  speechGreeting: (studentName: string) => string;
  speechArrived: string;
  progressPercent: number;
}

export function getSceneTransitionInfo(scene?: AppScene): SceneTransitionInfo {
  if (!scene || scene === 'start') {
    return {
      sceneId: 'start',
      stepNumber: 0,
      primaryBoardText: 'Gerbang Sekolah',
      secondaryBoardText: 'Asal',
      headerTitle: 'Gerbang Sekolah Asal',
      badgeLabel: 'Gerbang Sekolah',
      badgeSubtitle: 'Titik Awal',
      title: 'Gerbang Sekolah Asal',
      subtitle: 'Memulai Petualangan',
      description: 'Gerbang awal sebelum melangkah menyusuri jejak ekosistem alam di sekitar kita.',
      speechGreeting: (name) => `Halo ${name}! Siap memulai petualangan?`,
      speechArrived: '✨ Tiba di Gerbang Sekolah!',
      progressPercent: 0,
    };
  }

  if (scene === 'quiz') {
    return {
      sceneId: 'quiz',
      stepNumber: 9,
      primaryBoardText: 'Tantangan',
      secondaryBoardText: 'Evaluasi Ekosistem',
      headerTitle: 'Menuju Tantangan: Evaluasi Ekosistem',
      badgeLabel: 'Tantangan',
      badgeSubtitle: 'Puncak Petualangan',
      title: 'Tantangan: Evaluasi Ekosistem',
      subtitle: 'Uji Pemahaman & Raih Bintang',
      description: 'Saatnya tantangan akhir! Ayo uji semua pengetahuan ekosistemmu dari Misi 1 sampai Misi 8 dan raih bintang penjelajah!',
      speechGreeting: (name) => `Halo ${name}! Siap menghadapi Tantangan?`,
      speechArrived: '✨ Tiba di Tantangan Ekosistem!',
      progressPercent: 100,
    };
  }

  if (scene === 'map') {
    return {
      sceneId: 'map',
      stepNumber: 0,
      primaryBoardText: 'Peta Petualangan',
      secondaryBoardText: 'Jalan Setapak',
      headerTitle: 'Menuju Peta Petualangan',
      badgeLabel: 'Peta',
      badgeSubtitle: 'Penjelajahan',
      title: 'Peta Petualangan Ekosistem',
      subtitle: 'Jalan Setapak Alam',
      description: 'Lihat seluruh rute perjalanan dan stasiun pengamatan ekosistem.',
      speechGreeting: (name) => `Halo ${name}! Mari lihat peta petualangan!`,
      speechArrived: '✨ Tiba di Peta Petualangan!',
      progressPercent: 0,
    };
  }

  if (scene === 'material') {
    return {
      sceneId: 'material',
      stepNumber: 0,
      primaryBoardText: 'Buku Materi',
      secondaryBoardText: 'Pusat Ilmu',
      headerTitle: 'Menuju Buku Materi Ekosistem',
      badgeLabel: 'Materi',
      badgeSubtitle: 'Pusat Referensi',
      title: 'Buku Materi Ekosistem',
      subtitle: 'Panduan Penjelajah',
      description: 'Pelajari konsep biotik, abiotik, individu, populasi, komunitas, dan ekosistem secara menyeluruh.',
      speechGreeting: (name) => `Halo ${name}! Mari buka materi pembelajaran!`,
      speechArrived: '✨ Tiba di Buku Materi!',
      progressPercent: 0,
    };
  }

  if (scene.startsWith('mission-')) {
    const mid = parseInt(scene.replace('mission-', ''), 10);
    const validMid = mid >= 1 && mid <= MISSIONS.length ? mid : 1;
    const missionData = MISSIONS[validMid - 1];
    const progressPercent = Math.round((validMid / MISSIONS.length) * 100);

    return {
      sceneId: `mission-${validMid}` as AppScene,
      stepNumber: validMid,
      primaryBoardText: `Misi ${validMid}`,
      secondaryBoardText: missionData.title,
      headerTitle: `Menuju Misi ${validMid}: ${missionData.title}`,
      badgeLabel: `Misi ${validMid}`,
      badgeSubtitle: 'Pemberhentian Selanjutnya',
      title: `Misi ${validMid}: ${missionData.title}`,
      subtitle: missionData.subtitle,
      description: missionData.description,
      speechGreeting: (name) => `Halo ${name}! Siap ke Misi ${validMid}?`,
      speechArrived: `✨ Tiba di Misi ${validMid}!`,
      progressPercent,
    };
  }

  return {
    sceneId: scene,
    stepNumber: 1,
    primaryBoardText: 'Petualangan',
    secondaryBoardText: 'Jalan Setapak',
    headerTitle: 'Menuju Langkah Selanjutnya',
    badgeLabel: 'Petualangan',
    badgeSubtitle: 'Langkah Baru',
    title: 'Langkah Penjelajahan',
    subtitle: 'Menyusuri Alam',
    description: 'Lanjutkan langkah perjalanan menyusuri alam.',
    speechGreeting: (name) => `Halo ${name}! Siap melangkah?`,
    speechArrived: '✨ Tiba di tujuan!',
    progressPercent: 50,
  };
}

export function resolveTransitionContext(
  fromScene?: AppScene,
  toScene?: AppScene,
  initialMission?: number
): { fromInfo: SceneTransitionInfo; toInfo: SceneTransitionInfo } {
  // 1. Resolve destination
  let resolvedToScene: AppScene = 'mission-1';
  if (toScene) {
    resolvedToScene = toScene;
  } else if (initialMission && initialMission >= 1 && initialMission <= MISSIONS.length) {
    resolvedToScene = `mission-${initialMission}` as AppScene;
  }

  const toInfo = getSceneTransitionInfo(resolvedToScene);

  // 2. Resolve origin dynamically (Context-based, strictly avoiding hardcoded Misi 1 fallback)
  let resolvedFromScene: AppScene;
  if (fromScene) {
    resolvedFromScene = fromScene;
  } else {
    // Dynamic contextual fallback based on destination
    if (resolvedToScene === 'mission-1') {
      resolvedFromScene = 'start';
    } else if (resolvedToScene.startsWith('mission-')) {
      const currentMid = toInfo.stepNumber;
      resolvedFromScene = currentMid > 1 ? (`mission-${currentMid - 1}` as AppScene) : 'start';
    } else if (resolvedToScene === 'quiz') {
      resolvedFromScene = 'mission-8';
    } else {
      resolvedFromScene = 'start';
    }
  }

  const fromInfo = getSceneTransitionInfo(resolvedFromScene);

  return { fromInfo, toInfo };
}

interface TrailWalkingTransitionProps {
  fromScene?: AppScene;
  toScene?: AppScene;
  studentName?: string;
  initialMission?: number;
  onFinish?: () => void;
  onSkip?: () => void;
}

// Reusable SignBoard Component for both Left (Asal) and Right (Tujuan)
interface SignBoardProps {
  position: 'left' | 'right';
  primaryText: string;
  secondaryText: string;
  highlight?: boolean;
}

const SignBoard: React.FC<SignBoardProps> = ({
  position,
  primaryText,
  secondaryText,
  highlight = false,
}) => {
  const isLeft = position === 'left';

  return (
    <div
      className={`absolute z-20 flex flex-col items-center pointer-events-none transition-all duration-500 ${
        isLeft
          ? 'left-[3%] sm:left-[6%] bottom-[43%] sm:bottom-[45%]'
          : 'right-[3%] sm:right-[6%] bottom-[43%] sm:bottom-[45%]'
      }`}
    >
      <motion.div
        animate={highlight ? { scale: [1, 1.08, 1], y: [0, -3, 0] } : {}}
        transition={{ duration: 0.8, repeat: highlight ? Infinity : 0, repeatDelay: 1 }}
        className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border-2 shadow-2xl backdrop-blur-[2px] text-center min-w-[110px] sm:min-w-[150px] max-w-[150px] sm:max-w-[210px] ${
          isLeft
            ? 'bg-gradient-to-b from-amber-900/90 to-amber-950/95 border-amber-400 text-amber-50 shadow-amber-950/50'
            : highlight
            ? 'bg-gradient-to-b from-emerald-600/95 to-teal-900/95 border-amber-300 text-white ring-4 ring-amber-300/60 scale-105'
            : 'bg-gradient-to-b from-teal-800/90 to-emerald-950/95 border-emerald-400/90 text-emerald-50 shadow-emerald-950/50'
        }`}
      >
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-0.5">
          <span
            className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
              isLeft ? 'bg-amber-300' : 'bg-emerald-300 animate-pulse'
            }`}
          />
          <span
            className={`text-[10px] sm:text-xs font-black uppercase tracking-wider truncate ${
              isLeft ? 'text-amber-200' : 'text-emerald-200'
            }`}
          >
            {primaryText}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-display font-extrabold leading-tight text-white block line-clamp-2 drop-shadow-sm">
          {secondaryText}
        </span>
      </motion.div>
      {/* Wooden Signpost Stake */}
      <div
        className={`w-2.5 sm:w-3.5 h-6 sm:h-8 rounded-b shadow-md ${
          isLeft ? 'bg-amber-950' : 'bg-emerald-950'
        }`}
      />
    </div>
  );
};

// Math helper for cubic bezier curve evaluation: M20 95 C140 55 250 120 370 85 C500 45 600 100 680 70
function getCubicBezier(p0: number, p1: number, p2: number, p3: number, t: number): number {
  const oneMinusT = 1 - t;
  return (
    Math.pow(oneMinusT, 3) * p0 +
    3 * Math.pow(oneMinusT, 2) * t * p1 +
    3 * oneMinusT * Math.pow(t, 2) * p2 +
    Math.pow(t, 3) * p3
  );
}

function getPathCoordinates(progress: number): { xPercent: number; yPercent: number } {
  const t = Math.max(0, Math.min(1, progress));
  let rawX: number;
  let rawY: number;

  if (t <= 0.5) {
    const localT = t / 0.5;
    rawX = getCubicBezier(20, 140, 250, 370, localT);
    rawY = getCubicBezier(95, 55, 120, 85, localT);
  } else {
    const localT = (t - 0.5) / 0.5;
    rawX = getCubicBezier(370, 500, 600, 680, localT);
    rawY = getCubicBezier(85, 45, 100, 70, localT);
  }

  // Horizontal mapping: from 10% (near left board) to 80% (near right board)
  const xPercent = 10 + ((rawX - 20) / (680 - 20)) * 70;

  // Vertical mapping: in SVG viewBox 700x140, rawY is in range 45 to 120.
  // Map distance from bottom: (140 - rawY) into container bottom percentage (20% to 38%)
  const yPercent = 20 + ((140 - rawY) / 140) * 26;

  return { xPercent, yPercent };
}

export const TrailWalkingTransition: React.FC<TrailWalkingTransitionProps> = ({
  fromScene,
  toScene,
  studentName = 'Penjelajah Muda',
  initialMission,
  onFinish,
  onSkip,
}) => {
  // Resolve dynamic context for origin and destination
  const { fromInfo, toInfo } = resolveTransitionContext(fromScene, toScene, initialMission);

  // Character walking animation state
  const [walkProgress, setWalkProgress] = useState<number>(0);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [hasArrived, setHasArrived] = useState<boolean>(false);
  const [footsteps, setFootsteps] = useState<{ id: number; x: number; y: number }[]>([]);
  const footstepCounterRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset animation states whenever destination or origin changes
  useEffect(() => {
    setWalkProgress(0);
    setIsWalking(false);
    setHasArrived(false);
    setFootsteps([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [fromScene, toScene]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // Compute character position along the motion path
  const characterCoords = getPathCoordinates(walkProgress);

  const handleEnterOrSkip = () => {
    sound.playClick();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (onFinish) {
      onFinish();
    } else if (onSkip) {
      onSkip();
    }
  };

  // Trigger automated walking step animation when button is clicked
  const handleAdvanceStep = () => {
    if (isWalking) return;

    if (hasArrived) {
      handleEnterOrSkip();
      return;
    }

    sound.playClick();
    sound.playWalkingSteps(6, 200);
    setIsWalking(true);
    setHasArrived(false);
    setWalkProgress(0);

    const startTime = Date.now();
    const duration = 1250; // Smooth 1.25s walking animation along the curve

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const p = Math.min(1, elapsed / duration);
      setWalkProgress(p);

      const pos = getPathCoordinates(p);
      if (p > 0.06 && p < 0.94) {
        footstepCounterRef.current += 1;
        const newStepId = footstepCounterRef.current;
        setFootsteps((prev) => {
          const next = [...prev, { id: newStepId, x: pos.xPercent, y: pos.yPercent }];
          return next.length > 8 ? next.slice(next.length - 8) : next;
        });
      }

      if (elapsed >= duration) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setWalkProgress(1);
        setHasArrived(true);
        sound.playStarEarned();

        setTimeout(() => {
          setIsWalking(false);
        }, 300);
      }
    }, 40);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Interactive Main Card Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -16 }}
        className="w-full max-w-4xl bg-gradient-to-b from-amber-50 via-emerald-50 to-stone-100 rounded-3xl border-4 border-amber-300 shadow-2xl overflow-hidden relative flex flex-col"
      >
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-amber-700 via-emerald-800 to-amber-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-lg">
              <Compass
                className="w-5 h-5 text-amber-300 animate-spin"
                style={{ animationDuration: '8s' }}
              />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-amber-200 flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                Perjalanan Menyusuri Jalan Setapak
              </span>
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                {toInfo.headerTitle}
              </h3>
            </div>
          </div>

          {/* Skip / Close Button */}
          <button
            onClick={handleEnterOrSkip}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-amber-100 rounded-xl text-xs font-semibold border border-white/20 transition active:scale-95 cursor-pointer"
          >
            <span>Lewati Jalan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scenic Panoramic Road Canvas with Background Landscape */}
        <div className="relative w-full h-64 sm:h-76 overflow-hidden border-b-2 border-amber-200">
          {/* Main Realistic Background Image with object-cover */}
          <img
            src="/peta/jalan-setapak-transisi.jpg"
            alt="Pemandangan Jalan Setapak Petualangan Ekosistem"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
            referrerPolicy="no-referrer"
          />
          {/* Ambient Lighting / Glow Layer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

          {/* Ambient Animation 1: Subtle Sun Glow at Top-Right */}
          <div className="absolute top-2 sm:top-4 right-10 sm:right-16 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-yellow-300/20 animate-sun-glow pointer-events-none blur-sm" />

          {/* Ambient Animation 2: Soft Slow Clouds */}
          <div className="absolute top-3 left-12 opacity-85 text-2xl sm:text-3xl animate-slow-cloud pointer-events-none select-none">
            ☁️
          </div>
          <div
            className="absolute top-6 right-28 opacity-75 text-xl sm:text-2xl animate-slow-cloud pointer-events-none select-none"
            style={{ animationDelay: '12s' }}
          >
            ☁️
          </div>

          {/* Ambient Animation 3: Fluttering Butterfly on Sky */}
          <div className="absolute top-8 left-8 sm:left-14 pointer-events-none z-10 animate-butterfly-flight">
            <div className="text-xl sm:text-2xl animate-wing-flap">🦋</div>
          </div>

          {/* Ambient Animation 4: Floating Leaves */}
          <div className="absolute top-10 left-1/4 pointer-events-none z-10 animate-leaf-1 text-sm">
            🍃
          </div>
          <div className="absolute top-14 right-1/3 pointer-events-none z-10 animate-leaf-2 text-xs">
            🌿
          </div>

          {/* Reusable Direction Sign Boards Driven By Dynamic Context */}
          {/* Papan Kiri: Asal (Current Origin) */}
          <SignBoard
            position="left"
            primaryText={fromInfo.primaryBoardText}
            secondaryText={fromInfo.secondaryBoardText}
          />

          {/* Papan Kanan: Tujuan (Destination Target) */}
          <SignBoard
            position="right"
            primaryText={toInfo.primaryBoardText}
            secondaryText={toInfo.secondaryBoardText}
            highlight={hasArrived}
          />

          {/* Dynamic Footsteps along the Motion Curve */}
          {footsteps.map((fs, idx) => (
            <motion.div
              key={`footstep-node-${fs.id}-${idx}`}
              initial={{ opacity: 0.8, scale: 0.6 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.4 }}
              style={{
                left: `${fs.x}%`,
                bottom: `${fs.y}%`,
              }}
              className="absolute pointer-events-none text-stone-800/60 text-xs transform -translate-x-1/2 -translate-y-1/2 font-bold select-none z-10"
            >
              👣
            </motion.div>
          ))}

          {/* SEPARATE CHARACTER ELEMENT WALKING ALONG MOTION PATH */}
          <div
            style={{
              left: `${characterCoords.xPercent}%`,
              bottom: `${characterCoords.yPercent}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none transition-all duration-150 ease-out"
          >
            {/* Thought / Speech Bubble above Character */}
            <AnimatePresence mode="wait">
              <motion.div
                key={hasArrived ? 'arrived' : isWalking ? 'walking' : `idle-${toInfo.sceneId}`}
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white/95 text-stone-900 px-3 py-1 rounded-xl shadow-lg border border-amber-300 text-center mb-1 max-w-[190px] sm:max-w-[240px]"
              >
                <p className="text-[10px] sm:text-[11px] font-semibold leading-tight text-stone-800">
                  {hasArrived
                    ? toInfo.speechArrived
                    : isWalking
                    ? 'Menyusuri jalan setapak...'
                    : toInfo.speechGreeting(studentName)}
                </p>
                <div className="w-2 h-2 bg-white rotate-45 mx-auto -mb-1.5 border-r border-b border-amber-300" />
              </motion.div>
            </AnimatePresence>

            {/* Main Explorer Character Sprite with Walking & Bobbing Effects */}
            <div className="relative">
              <CharacterAvatar
                size="lg"
                isWalking={isWalking}
                isCelebrating={hasArrived}
                direction="right"
              />

              {/* Walking Dust Puffs behind feet */}
              {isWalking && (
                <motion.div
                  animate={{ opacity: [0.7, 0], scale: [0.8, 1.5], x: [-6, -18] }}
                  transition={{ repeat: Infinity, duration: 0.32, ease: 'easeOut' }}
                  className="absolute -bottom-1 left-2 w-4 h-2 bg-amber-600/35 rounded-full blur-xs pointer-events-none"
                />
              )}

              {/* Star sparkles upon arrival */}
              {hasArrived && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.25, 1], opacity: 1 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute -top-3 -right-2 text-amber-500 pointer-events-none"
                >
                  <Sparkles
                    className="w-6 h-6 fill-amber-400 text-amber-500 animate-spin"
                    style={{ animationDuration: '3s' }}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Story Card & Exploration Notes (Layout Preserved) */}
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/95">
          <div className="flex-1 space-y-1 text-center sm:text-left">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] tracking-wide">
                {toInfo.badgeLabel}
              </span>
              <span className="text-xs font-semibold text-stone-500">
                {toInfo.badgeSubtitle}
              </span>
            </div>

            {/* Judul Besar Otomatis */}
            <h4 className="font-display font-extrabold text-base sm:text-lg text-emerald-950 transition-colors">
              {toInfo.title}
            </h4>

            {/* Deskripsi Otomatis */}
            <p className="text-xs text-stone-600 leading-relaxed font-medium max-w-xl">
              {toInfo.description}
            </p>
          </div>

          {/* Action / Progress Area */}
          <div className="w-full sm:w-68 flex flex-col items-center sm:items-end gap-2.5 shrink-0">
            {/* Animated Walking Progress Bar */}
            <div className="w-full">
              <div className="flex justify-between text-[11px] font-bold text-stone-600 mb-1">
                <span className="flex items-center gap-1.5">
                  <img
                    src="/karakter-penjelajah.png"
                    alt="Penjelajah"
                    className="w-4 h-4 object-contain inline-block"
                    referrerPolicy="no-referrer"
                  />
                  <span>Progress Jalan Setapak</span>
                </span>
                <span className="font-mono text-emerald-700">
                  {toInfo.progressPercent}%
                </span>
              </div>
              <div className="w-full h-3 bg-stone-200 rounded-full overflow-hidden border border-stone-300 shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-full shadow-sm"
                  initial={false}
                  animate={{ width: `${toInfo.progressPercent}%` }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Action Buttons: Lanjutkan Langkah & Masuk Misi */}
            <div className="w-full flex items-center gap-2">
              <button
                onClick={handleAdvanceStep}
                disabled={isWalking}
                className={`flex-1 py-2.5 px-4 rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition transform active:scale-95 cursor-pointer ${
                  isWalking
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : hasArrived
                    ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/30'
                    : 'bg-amber-500 hover:bg-amber-600 text-white hover:shadow-amber-500/25'
                }`}
              >
                <span>
                  {isWalking
                    ? 'Melangkah...'
                    : hasArrived
                    ? (toInfo.sceneId === 'quiz' ? 'Masuk ke Tantangan →' : 'Masuk ke Misi →')
                    : 'Lanjutkan Langkah →'}
                </span>
              </button>

              {/* Direct entry button if student wants to begin mission right away */}
              <button
                onClick={handleEnterOrSkip}
                className="py-2.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-1 shadow-md transition active:scale-95 cursor-pointer"
                title={toInfo.sceneId === 'quiz' ? 'Mulai Tantangan Sekarang' : 'Mulai Misi Ini Sekarang'}
              >
                <span>{toInfo.sceneId === 'quiz' ? 'Mulai Tantangan' : 'Mulai'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
