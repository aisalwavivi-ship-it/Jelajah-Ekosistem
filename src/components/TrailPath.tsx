import React from 'react';
import { motion } from 'motion/react';
import { CharacterAvatar } from './illustrations/CharacterAvatar';
import { AppScene, MissionId } from '../types';
import { MISSIONS_DATA } from '../data/missions';
import { sound } from '../utils/audio';

interface TrailPathProps {
  currentScene: AppScene;
  completedMissions: Record<MissionId, boolean>;
  onSelectScene: (scene: AppScene) => void;
  variant?: 'hud' | 'full-map';
}

export const TrailPath: React.FC<TrailPathProps> = ({
  currentScene,
  completedMissions,
  onSelectScene,
  variant = 'hud',
}) => {
  // Map current scene to step index (0 = start, 1..8 = missions, 9 = quiz, 10 = finish)
  const getStepIndex = (scene: AppScene): number => {
    if (scene === 'start') return 0;
    if (scene === 'map') return 0;
    if (scene.startsWith('mission-')) {
      return parseInt(scene.replace('mission-', ''), 10);
    }
    if (scene === 'quiz') return 9;
    if (scene === 'finish') return 10;
    return 0;
  };

  const currentStep = getStepIndex(currentScene);

  // Checkpoints representation
  const checkpoints = [
    { id: 'start' as AppScene, label: 'Sekolah', icon: '🏫', step: 0 },
    ...MISSIONS_DATA.map((m) => ({
      id: `mission-${m.id}` as AppScene,
      missionId: m.id,
      label: `M${m.id}`,
      name: m.title,
      icon: m.icon,
      step: m.id,
    })),
    { id: 'quiz' as AppScene, label: 'Tantangan', icon: '🏆', step: 9 },
    { id: 'finish' as AppScene, label: 'Finish', icon: '🌅', step: 10 },
  ];

  if (variant === 'hud') {
    return (
      <div className="w-full bg-gradient-to-r from-amber-900/90 via-amber-800/90 to-emerald-900/90 backdrop-blur-md text-white py-2 px-3 sm:px-6 shadow-md border-b-2 border-amber-600/60 relative overflow-hidden z-20">
        {/* Subtle ground texture & small stones in background */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#fed7aa_1px,transparent_1px)] [background-size:12px_12px]" />

        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4 relative">
          {/* Label Jalan Setapak */}
          <div className="hidden md:flex items-center gap-2 font-display text-amber-200 text-xs sm:text-sm font-semibold tracking-wide shrink-0">
            <span className="text-base">🛤️</span>
            <span>Jalan Setapak:</span>
          </div>

          {/* Stepping Trail Path Container */}
          <div className="flex-1 relative overflow-x-auto scrollbar-none py-2 px-1">
            <div className="flex items-center justify-between min-w-[540px] sm:min-w-0 relative">
              {/* The winding earthy trail line connecting checkpoints */}
              <div className="absolute left-4 right-4 h-3 bg-amber-700/80 rounded-full border border-amber-950/40 shadow-inner z-0" />
              <div
                className="absolute left-4 h-3 bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-700 ease-out z-0"
                style={{
                  width: `${Math.min(100, Math.max(0, (currentStep / 10) * 100))}%`,
                }}
              />

              {/* Checkpoints */}
              {checkpoints.map((cp) => {
                const isStart = cp.step === 0;
                const isFinish = cp.step === 10;
                const isQuiz = cp.step === 9;
                const isMission = cp.step >= 1 && cp.step <= 8;
                const isCompleted =
                  isStart ||
                  (isMission && completedMissions[cp.step as MissionId]) ||
                  (isQuiz && completedMissions[8]) ||
                  (isFinish && completedMissions[8]);

                const isCurrent = currentStep === cp.step;
                const isUnlocked =
                  isStart ||
                  cp.step === 1 ||
                  (isMission && (completedMissions[(cp.step - 1) as MissionId] || completedMissions[cp.step as MissionId])) ||
                  (isQuiz && completedMissions[8]) ||
                  (isFinish && completedMissions[8]);

                return (
                  <div
                    key={cp.id}
                    className="relative flex flex-col items-center group cursor-pointer z-10"
                    onClick={() => {
                      if (isUnlocked) {
                        sound.playClick();
                        onSelectScene(cp.id);
                      }
                    }}
                  >
                    {/* Character walking/standing on active checkpoint with Framer Motion layoutId */}
                    {isCurrent && (
                      <motion.div
                        layoutId="trail-hud-avatar"
                        transition={{
                          type: 'spring',
                          stiffness: 280,
                          damping: 24,
                        }}
                        className="absolute -top-7 sm:-top-8.5 z-30 pointer-events-none"
                      >
                        <CharacterAvatar size="sm" isWalking={true} direction="right" />
                      </motion.div>
                    )}

                    {/* Stepping Stone Node */}
                    <motion.div
                      whileHover={isUnlocked ? { scale: 1.15 } : {}}
                      whileTap={isUnlocked ? { scale: 0.95 } : {}}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-md border-2 ${
                        isCurrent
                          ? 'bg-amber-300 border-white text-stone-900 ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-900'
                          : isCompleted
                          ? 'bg-emerald-600 border-emerald-300 text-white'
                          : isUnlocked
                          ? 'bg-amber-600 border-amber-300 text-amber-100 hover:bg-amber-500'
                          : 'bg-stone-700/80 border-stone-600 text-stone-400 opacity-60'
                      }`}
                      title={cp.label}
                    >
                      {isCompleted && !isCurrent ? '✓' : cp.icon}
                    </motion.div>

                    {/* Label */}
                    <span
                      className={`text-[10px] font-medium mt-1 transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'text-amber-200 font-bold'
                          : isUnlocked
                          ? 'text-stone-300 group-hover:text-amber-100'
                          : 'text-stone-400'
                      }`}
                    >
                      {cp.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Map Button */}
          <button
            id="btn-trail-open-map"
            onClick={() => {
              sound.playClick();
              onSelectScene('map');
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-600/80 hover:bg-amber-600 text-amber-50 rounded-xl text-xs font-semibold border border-amber-400/50 shadow transition shrink-0 active:scale-95"
          >
            <span>🗺️</span>
            <span className="hidden sm:inline">Peta</span>
          </button>
        </div>
      </div>
    );
  }

  return null;
};
