import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Check, Lock, Star, Sparkles, Award, Footprints, BookOpen } from 'lucide-react';
import { AppScene, MissionId } from '../types';
import { MISSIONS_DATA } from '../data/missions';
import { CharacterAvatar } from '../components/illustrations/CharacterAvatar';
import { sound } from '../utils/audio';

interface MapSceneProps {
  completedMissions: Record<MissionId, boolean>;
  stars: number;
  onSelectMission: (scene: AppScene) => void;
  onOpenJournal?: () => void;
}

// Defined keypoints along the winding trail in percentage coordinates (x, y)
const TRAIL_WAYPOINTS: Record<number, { x: number; y: number; label: string }> = {
  0: { x: 5, y: 85, label: 'Gerbang Sekolah' },
  1: { x: 12, y: 72, label: 'Taman Sekolah' },
  2: { x: 25, y: 55, label: 'Jalur Bebatuan' },
  3: { x: 38, y: 75, label: 'Kebun Rindang' },
  4: { x: 50, y: 48, label: 'Area Terbuka' },
  5: { x: 62, y: 70, label: 'Taman & Kolam' },
  6: { x: 74, y: 45, label: 'Tepi Aliran Air' },
  7: { x: 86, y: 65, label: 'Pojok Terpadu' },
  8: { x: 92, y: 35, label: 'Puncak Pandang' },
  9: { x: 96, y: 22, label: 'Puncak Finish' },
};

export const MapScene: React.FC<MapSceneProps> = ({
  completedMissions,
  stars,
  onSelectMission,
  onOpenJournal,
}) => {
  const completedCount = Object.values(completedMissions).filter(Boolean).length;
  
  // Determine next active mission ID
  let nextActiveMissionId: MissionId = 1;
  for (let i = 1; i <= 8; i++) {
    if (!completedMissions[i as MissionId]) {
      nextActiveMissionId = i as MissionId;
      break;
    }
  }
  const allMissionsDone = completedCount === 8;
  const initialStep = allMissionsDone ? 9 : nextActiveMissionId;

  // Character walking state
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isWalking, setIsWalking] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(allMissionsDone);
  const [walkingPath, setWalkingPath] = useState<{ x: number; y: number }[]>([]);
  const [characterFacing, setCharacterFacing] = useState<'right' | 'left'>('right');
  const [speechText, setSpeechText] = useState<string>(
    allMissionsDone
      ? 'Hore! Semua misi di jalan setapak telah selesai! Ayo ke Puncak Finish!'
      : `Dara siap menyusuri jalan setapak menuju Misi ${nextActiveMissionId}!`
  );

  // Sync position and speech when completed missions change or reset
  useEffect(() => {
    const targetStep = allMissionsDone ? 9 : nextActiveMissionId;
    setCurrentStep(targetStep);
    setIsCelebrating(allMissionsDone);
    setSpeechText(
      allMissionsDone
        ? 'Hore! Semua misi di jalan setapak telah selesai! Ayo ke Puncak Finish!'
        : `Dara siap menyusuri jalan setapak menuju Misi ${nextActiveMissionId}!`
    );
  }, [completedCount, nextActiveMissionId, allMissionsDone]);

  // Function to walk the character along the winding path between nodes
  const handleWalkToNode = (targetStep: number, targetScene: AppScene) => {
    if (isWalking) return;

    if (targetStep === currentStep) {
      sound.playFootstep();
      onSelectMission(targetScene);
      return;
    }

    setIsWalking(true);
    setIsCelebrating(false);
    setCharacterFacing(targetStep > currentStep ? 'right' : 'left');

    const stepDiff = Math.abs(targetStep - currentStep);
    const targetInfo = TRAIL_WAYPOINTS[targetStep];
    setSpeechText(`Dara melangkah menyusuri jalan setapak ke ${targetInfo.label}... 🌿`);

    // Build intermediate waypoint path for natural curved walking
    const intermediatePoints: { x: number; y: number }[] = [];
    const stepSign = targetStep > currentStep ? 1 : -1;

    for (let s = currentStep; s !== targetStep; s += stepSign) {
      const pCurrent = TRAIL_WAYPOINTS[s];
      const pNext = TRAIL_WAYPOINTS[s + stepSign];
      // Arc point
      intermediatePoints.push({
        x: (pCurrent.x + pNext.x) / 2,
        y: (pCurrent.y + pNext.y) / 2 + (s % 2 === 0 ? -4 : 4),
      });
      intermediatePoints.push({ x: pNext.x, y: pNext.y });
    }

    setWalkingPath(intermediatePoints);

    // Play footstep sounds along the walk
    sound.playWalkingSteps(Math.min(6, stepDiff * 2), 260);

    const walkDurationMs = Math.min(1800, Math.max(900, stepDiff * 400));

    setTimeout(() => {
      setCurrentStep(targetStep);
      setIsWalking(false);
      setIsCelebrating(true);
      sound.playStarEarned();
      setSpeechText(`Sampai di ${targetInfo.label}! 🎒✨`);

      // Automatically transition to scene after a brief arrival pause
      setTimeout(() => {
        onSelectMission(targetScene);
      }, 500);
    }, walkDurationMs);
  };

  // Visual coordinates for the winding trail on the map (percentages for responsive placement)
  const mapNodes = [
    { id: 1 as MissionId, x: 12, y: 72, label: 'Taman Sekolah', icon: '🌱' },
    { id: 2 as MissionId, x: 25, y: 55, label: 'Jalur Bebatuan', icon: '🔎' },
    { id: 3 as MissionId, x: 38, y: 75, label: 'Kebun Rindang', icon: '🌿' },
    { id: 4 as MissionId, x: 50, y: 48, label: 'Area Terbuka', icon: '☀️' },
    { id: 5 as MissionId, x: 62, y: 70, label: 'Taman & Kolam', icon: '💧' },
    { id: 6 as MissionId, x: 74, y: 45, label: 'Tepi Aliran Air', icon: '💭' },
    { id: 7 as MissionId, x: 86, y: 65, label: 'Pojok Terpadu', icon: '🕵️' },
    { id: 8 as MissionId, x: 92, y: 35, label: 'Puncak Pandang', icon: '🧠' },
  ];

  return (
    <div className="min-h-[calc(100vh-115px)] w-full p-3 sm:p-6 flex flex-col justify-between relative z-10">
      <div className="max-w-6xl mx-auto w-full space-y-4">
        {/* Top Header Card */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-5 border-2 border-emerald-200/80 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-emerald-950">
                Peta Petualangan: Jalan Setapak Ekosistem
              </h2>
            </div>
            <p className="text-stone-600 text-xs sm:text-sm mt-0.5">
              Ikuti jalan setapak berkelok untuk menjelajahi seluruh sudut lingkungan!
            </p>
          </div>

          {/* Progress Counters */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-emerald-50 border border-emerald-300 rounded-2xl text-center">
              <span className="text-[11px] font-semibold text-emerald-800 block">
                Petualangan
              </span>
              <span className="font-display font-extrabold text-lg text-emerald-900">
                {completedCount}/8 Misi
              </span>
            </div>

            <div className="px-4 py-2 bg-amber-50 border border-amber-300 rounded-2xl text-center">
              <span className="text-[11px] font-semibold text-amber-800 block">
                Total Bintang
              </span>
              <span className="font-display font-extrabold text-lg text-amber-900 flex items-center justify-center gap-1">
                ⭐ {stars}
              </span>
            </div>

            {/* Jurnal Button */}
            {onOpenJournal && (
              <button
                id="btn-map-open-journal"
                onClick={() => {
                  sound.playClick();
                  onOpenJournal();
                }}
                className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 font-display font-bold rounded-2xl shadow-xs text-xs sm:text-sm flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                title="Buka Jurnal Penjelajah (Catatan Misi & Bintang)"
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span className="hidden sm:inline">Jurnal</span>
                {completedCount > 0 && (
                  <span className="px-1.5 py-0.2 bg-amber-300 text-amber-950 rounded-full text-[10px] font-black">
                    {completedCount}
                  </span>
                )}
              </button>
            )}

            {/* Quick Action Button */}
            <button
              onClick={() => {
                if (allMissionsDone) {
                  handleWalkToNode(9, 'quiz');
                } else {
                  handleWalkToNode(nextActiveMissionId, `mission-${nextActiveMissionId}` as AppScene);
                }
              }}
              disabled={isWalking}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 text-white font-display font-bold rounded-2xl shadow-md text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 cursor-pointer"
            >
              <Footprints className="w-4 h-4" />
              <span>{isWalking ? 'Sedang Berjalan...' : allMissionsDone ? 'Mulai Evaluasi' : `Jalan ke Misi ${nextActiveMissionId}`}</span>
            </button>
          </div>
        </div>

        {/* The Illustrated Panoramic Map Canvas */}
        <div className="relative w-full bg-stone-900/10 rounded-3xl border-4 border-amber-300/90 shadow-2xl overflow-hidden min-h-[480px] sm:min-h-[540px] md:min-h-[580px] aspect-[16/9] max-h-[640px]">
          {/* Main Natural Landscape Background Image */}
          <img
            src="/jelajah-ekosistem-bg.jpg"
            alt="Lansekap Peta Petualangan Ekosistem"
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none z-0"
            referrerPolicy="no-referrer"
          />

          {/* Subtle natural atmosphere gradient overlay for contrast */}
          <div className="absolute inset-0 bg-radial-[ellipse_at_center,_var(--tw-gradient-stops)] from-transparent via-stone-900/5 to-stone-950/20 pointer-events-none z-0" />

          {/* SVG Winding Natural Trail Path across all nodes */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
          >
            {/* Trail shadow / outer edge */}
            <path
              d="M 50 510 C 100 480, 120 440, 140 432 S 230 350, 260 330 S 360 460, 390 450 S 480 310, 510 288 S 600 430, 630 420 S 720 290, 750 270 S 840 400, 870 390 S 910 230, 930 210 L 960 160"
              stroke="#92400e"
              strokeWidth="28"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.8"
            />
            {/* Trail inner warm soil */}
            <path
              d="M 50 510 C 100 480, 120 440, 140 432 S 230 350, 260 330 S 360 460, 390 450 S 480 310, 510 288 S 600 430, 630 420 S 720 290, 750 270 S 840 400, 870 390 S 910 230, 930 210 L 960 160"
              stroke="#d97706"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Stepping stones / pebbles line on top of path */}
            <path
              d="M 50 510 C 100 480, 120 440, 140 432 S 230 350, 260 330 S 360 460, 390 450 S 480 310, 510 288 S 600 430, 630 420 S 720 290, 750 270 S 840 400, 870 390 S 910 230, 930 210 L 960 160"
              stroke="#fef3c7"
              strokeWidth="4"
              strokeDasharray="14 18"
              fill="none"
              opacity="0.9"
            />
          </svg>

          {/* DYNAMIC MAIN CHARACTER WALKING ON THE PANORAMIC TRAIL */}
          <motion.div
            animate={
              isWalking && walkingPath.length > 0
                ? {
                    left: walkingPath.map((p) => `${p.x}%`),
                    top: walkingPath.map((p) => `${p.y}%`),
                  }
                : {
                    left: `${TRAIL_WAYPOINTS[currentStep]?.x ?? 12}%`,
                    top: `${TRAIL_WAYPOINTS[currentStep]?.y ?? 72}%`,
                  }
            }
            transition={
              isWalking
                ? {
                    duration: Math.min(1.8, Math.max(0.9, walkingPath.length * 0.22)),
                    ease: 'easeInOut',
                  }
                : {
                    type: 'spring',
                    stiffness: 280,
                    damping: 24,
                  }
            }
            className="absolute -translate-x-1/2 -translate-y-[85%] z-30 flex flex-col items-center pointer-events-none"
          >
            {/* Thought / Speech Bubble */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/95 text-stone-900 px-2.5 py-1 rounded-xl shadow-md border border-amber-300 text-center mb-1 max-w-[190px]"
            >
              <p className="text-[10px] font-bold leading-tight text-stone-800">
                {speechText}
              </p>
              <div className="w-2 h-2 bg-white rotate-45 mx-auto -mb-1.5 border-r border-b border-amber-300" />
            </motion.div>

            {/* Avatar with Walking or Celebrating State */}
            <div className="relative">
              <CharacterAvatar
                size="md"
                isWalking={isWalking}
                isCelebrating={isCelebrating}
                direction={characterFacing}
              />

              {/* Dust puffs while walking */}
              {isWalking && (
                <motion.div
                  animate={{ opacity: [0.7, 0], scale: [0.7, 1.4], x: [-3, -12] }}
                  transition={{ repeat: Infinity, duration: 0.3, type: 'tween', ease: 'easeOut' }}
                  className="absolute -bottom-1 left-2 w-3.5 h-1.5 bg-amber-500/50 rounded-full blur-xs"
                />
              )}

              {/* Celebration Sparkles */}
              {isCelebrating && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1], rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.8, type: 'tween', ease: 'easeInOut' }}
                  className="absolute -top-3 -right-2 text-amber-500"
                >
                  <Sparkles className="w-5 h-5 fill-amber-400" />
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Interactive Checkpoint Nodes */}
          {mapNodes.map((node) => {
            const isCompleted = completedMissions[node.id];
            const isCurrent = node.id === currentStep;
            const isUnlocked =
              node.id === 1 ||
              completedMissions[(node.id - 1) as MissionId] ||
              isCompleted;

            const missionMeta = MISSIONS_DATA.find((m) => m.id === node.id)!;

            return (
              <div
                key={node.id}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
              >
                {/* Node Button */}
                <motion.button
                  id={`btn-checkpoint-mission-${node.id}`}
                  whileHover={isUnlocked ? { scale: 1.15 } : {}}
                  whileTap={isUnlocked ? { scale: 0.92 } : {}}
                  onClick={() => {
                    if (isUnlocked) {
                      handleWalkToNode(node.id, `mission-${node.id}` as AppScene);
                    } else {
                      sound.playWrong();
                    }
                  }}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center font-display font-bold text-base sm:text-lg shadow-lg border-3 transition-all relative ${
                    isCurrent
                      ? 'bg-amber-300 border-white text-stone-900 ring-4 ring-amber-400/80 animate-pulse-subtle'
                      : isCompleted
                      ? 'bg-emerald-600 border-emerald-200 text-white hover:bg-emerald-500'
                      : isUnlocked
                      ? 'bg-amber-600 border-amber-300 text-white hover:bg-amber-500'
                      : 'bg-stone-600/90 border-stone-500 text-stone-300 cursor-not-allowed opacity-75'
                  }`}
                  title={`${missionMeta.title} (${isCompleted ? 'Selesai' : isUnlocked ? 'Terbuka' : 'Terkunci'})`}
                >
                  {isCompleted ? (
                    <div className="flex flex-col items-center">
                      <span className="text-lg">✓</span>
                    </div>
                  ) : isUnlocked ? (
                    <span className="text-xl">{node.icon}</span>
                  ) : (
                    <Lock className="w-5 h-5 text-stone-300" />
                  )}

                  {/* Tiny Mission ID Tag */}
                  <span className="absolute -bottom-2 px-1.5 py-0.2 bg-stone-900 text-amber-200 rounded-full text-[9px] font-bold">
                    M{node.id}
                  </span>
                </motion.button>

                {/* Label Box */}
                <div
                  className={`mt-2.5 px-2 py-0.5 rounded-lg text-center backdrop-blur-xs shadow-xs border transition ${
                    isCurrent
                      ? 'bg-amber-400 text-stone-950 font-bold border-white'
                      : isCompleted
                      ? 'bg-emerald-800/90 text-emerald-100 font-semibold border-emerald-600'
                      : isUnlocked
                      ? 'bg-amber-900/80 text-amber-100 font-semibold border-amber-700'
                      : 'bg-stone-800/80 text-stone-300 border-stone-700'
                  }`}
                >
                  <p className="text-[10px] sm:text-xs leading-none whitespace-nowrap">
                    {node.label}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Finish Node (Tempat Pandang Evaluasi) */}
          <div
            style={{ left: '96%', top: '22%' }}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center"
          >
            <motion.button
              id="btn-checkpoint-finish"
              whileHover={allMissionsDone ? { scale: 1.15 } : {}}
              onClick={() => {
                if (allMissionsDone) {
                  handleWalkToNode(9, 'quiz');
                } else {
                  sound.playWrong();
                }
              }}
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-3xl flex flex-col items-center justify-center font-display font-bold shadow-xl border-3 transition-all ${
                allMissionsDone
                  ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 border-white text-amber-950 ring-4 ring-amber-400 animate-pulse-subtle cursor-pointer'
                  : 'bg-stone-700/80 border-stone-600 text-stone-400 cursor-not-allowed opacity-75'
              }`}
            >
              <span className="text-2xl">{allMissionsDone ? '🏆' : '🔒'}</span>
              <span className="text-[9px] uppercase font-bold tracking-tight">Evaluasi</span>
            </motion.button>
            <div className="mt-2 px-2 py-0.5 rounded-lg bg-stone-900/90 text-amber-200 text-[10px] font-bold border border-amber-500/50">
              Puncak Finish
            </div>
          </div>
        </div>

        {/* Mission Cards Preview List Below Map */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {MISSIONS_DATA.slice(0, 4).map((m) => {
            const isCompleted = completedMissions[m.id];
            const isCurrent = m.id === currentStep;
            return (
              <div
                key={m.id}
                onClick={() => {
                  if (m.id === 1 || completedMissions[(m.id - 1) as MissionId] || isCompleted) {
                    handleWalkToNode(m.id, `mission-${m.id}` as AppScene);
                  }
                }}
                className={`p-2.5 rounded-2xl border text-left cursor-pointer transition ${
                  isCurrent
                    ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-300'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-300 hover:bg-emerald-100/70'
                    : 'bg-white border-stone-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100">
                    Misi {m.id}
                  </span>
                </div>
                <h4 className="font-display font-bold text-xs text-stone-800 mt-1 line-clamp-1">
                  {m.title}
                </h4>
                <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                  {m.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
