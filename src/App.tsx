import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScene, MissionId, GameState, MissionJournalEntry } from './types';
import { sound } from './utils/audio';
import { tts } from './utils/tts';
import { ambientMusic } from './utils/ambientMusic';
import {
  triggerMissionSuccessConfetti,
  triggerQuizFinishConfetti,
  triggerCertificateConfetti,
} from './utils/confetti';
import { BADGES, MISSIONS_DATA, MISSION_JOURNAL_DETAILS } from './data/missions';

// Components
import { HeaderNav } from './components/HeaderNav';
import { MissionProgressBar } from './components/MissionProgressBar';
import { TrailPath } from './components/TrailPath';
import { TrailWalkingTransition } from './components/TrailWalkingTransition';
import { FloatingMascot } from './components/FloatingMascot';
import { HowToPlayModal } from './components/HowToPlayModal';
import { CertificateModal } from './components/CertificateModal';
import { ExplorerJournal } from './components/ExplorerJournal';
import { DynamicWeatherBackground } from './components/DynamicWeatherBackground';
import { WeatherType, WeatherMode, resolveActiveWeather } from './utils/weather';

// Scenes
import { StartScene } from './scenes/StartScene';
import { MapScene } from './scenes/MapScene';
import { Mission1Observe } from './scenes/Mission1Observe';
import { Mission2Detective } from './scenes/Mission2Detective';
import { Mission3Biotic } from './scenes/Mission3Biotic';
import { Mission4Abiotic } from './scenes/Mission4Abiotic';
import { Mission5BuildEco } from './scenes/Mission5BuildEco';
import { Mission6WhatIf } from './scenes/Mission6WhatIf';
import { Mission7EcosystemDetective } from './scenes/Mission7EcosystemDetective';
import { Mission8MindMap } from './scenes/Mission8MindMap';
import { QuizScene } from './scenes/QuizScene';
import { MaterialScene } from './scenes/MaterialScene';

const STORAGE_KEY = 'jelajah_ekosistem_state_v2';

interface AppGameState {
  studentName: string;
  completedMissions: Record<MissionId, boolean>;
  stars: number;
  badges: string[];
  isAudioMuted: boolean;
  isMusicPlaying: boolean;
  quizScore: number | null;
  journalEntries: MissionJournalEntry[];
}

const INITIAL_GAME_STATE: AppGameState = {
  studentName: 'Penjelajah Muda',
  completedMissions: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  },
  stars: 0,
  badges: [],
  isAudioMuted: false,
  isMusicPlaying: false,
  quizScore: null,
  journalEntries: [],
};

export default function App() {
  const [currentScene, setCurrentScene] = useState<AppScene>('start');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('auto-time');
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Periodically update local clock to keep live weather synchronized
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Load initial state from localStorage if present
  const [gameState, setGameState] = useState<AppGameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.completedMissions) {
          // Gracefully backfill journal entries if user had completed missions before journal was added
          let entries: MissionJournalEntry[] = Array.isArray(parsed.journalEntries)
            ? parsed.journalEntries
            : [];

          if (entries.length === 0) {
            const backfilled: MissionJournalEntry[] = [];
            for (let i = 1; i <= 8; i++) {
              const id = i as MissionId;
              if (parsed.completedMissions[id]) {
                const meta = MISSIONS_DATA.find((m) => m.id === id);
                const details = MISSION_JOURNAL_DETAILS[id];
                if (meta) {
                  backfilled.push({
                    id: `journal-init-${id}`,
                    missionId: id,
                    title: meta.title,
                    subtitle: meta.subtitle,
                    location: meta.location,
                    icon: meta.icon,
                    starsEarned: meta.points,
                    completedAt: new Date(Date.now() - (9 - id) * 15 * 60 * 1000).toISOString(),
                    summary: details?.summary || meta.description,
                    categoryTag: details?.categoryTag || 'ekosistem',
                  });
                }
              }
            }
            entries = backfilled;
          }

          return {
            ...INITIAL_GAME_STATE,
            ...parsed,
            isMusicPlaying: false,
            journalEntries: entries,
          };
        }
      }
    } catch (e) {
      console.warn('Could not read state from localStorage', e);
    }
    return INITIAL_GAME_STATE;
  });

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.warn('Could not save state to localStorage', e);
    }
  }, [gameState]);

  // Audio mute sync
  const handleToggleAudio = () => {
    const nextMuted = sound.toggleMute();
    tts.setSoundEnabled(!nextMuted);
    setGameState((prev) => ({ ...prev, isAudioMuted: nextMuted }));
  };

  // Stop narration on scene transition
  useEffect(() => {
    tts.stop();
  }, [currentScene]);

  // Background Nature Music toggle
  const handleToggleMusic = () => {
    const nextPlaying = !gameState.isMusicPlaying;
    if (nextPlaying) {
      ambientMusic.start();
    } else {
      ambientMusic.stop();
    }
    setGameState((prev) => ({ ...prev, isMusicPlaying: nextPlaying }));
  };

  // Ensure audio nodes are stopped if the app unmounts
  useEffect(() => {
    return () => {
      ambientMusic.stop();
    };
  }, []);

  // Track the most recently completed mission to celebrate badge unlocking
  const [lastCompletedMissionId, setLastCompletedMissionId] = useState<MissionId | null>(null);

  // Generic mission completion handler
  const handleCompleteMission = (missionId: MissionId, earnedStars: number) => {
    // Trigger celebratory confetti explosion
    triggerMissionSuccessConfetti();
    setLastCompletedMissionId(missionId);

    const now = new Date().toISOString();
    const meta = MISSIONS_DATA.find((m) => m.id === missionId);
    const details = MISSION_JOURNAL_DETAILS[missionId];

    setGameState((prev) => {
      const isAlreadyCompleted = prev.completedMissions[missionId];
      const newCompleted = { ...prev.completedMissions, [missionId]: true };
      const updatedStars = isAlreadyCompleted ? prev.stars : prev.stars + earnedStars;

      // Update or record journal entry with timestamp and stars earned
      const existingIndex = prev.journalEntries.findIndex((e) => e.missionId === missionId);
      let updatedJournal: MissionJournalEntry[];

      if (existingIndex >= 0) {
        updatedJournal = [...prev.journalEntries];
        updatedJournal[existingIndex] = {
          ...updatedJournal[existingIndex],
          starsEarned: Math.max(updatedJournal[existingIndex].starsEarned, earnedStars),
          completedAt: now,
        };
      } else {
        const newEntry: MissionJournalEntry = {
          id: `journal-m${missionId}-${Date.now()}`,
          missionId,
          title: meta?.title || `Misi ${missionId}`,
          subtitle: meta?.subtitle || '',
          location: meta?.location || 'Jalur Lapangan',
          icon: meta?.icon || '🌿',
          starsEarned: earnedStars,
          completedAt: now,
          summary: details?.summary || meta?.description || 'Misi berhasil diselesaikan!',
          categoryTag: details?.categoryTag || 'ekosistem',
        };
        updatedJournal = [...prev.journalEntries, newEntry];
      }

      return {
        ...prev,
        completedMissions: newCompleted,
        stars: updatedStars,
        journalEntries: updatedJournal,
      };
    });
  };

  // Walking transition state when traveling between missions
  const [pendingWalkingScene, setPendingWalkingScene] = useState<{
    fromScene: AppScene;
    toScene: AppScene;
  } | null>(null);

  const navigateWithWalkingTrail = (toScene: AppScene, fromScene?: AppScene) => {
    const from = fromScene || currentScene;
    if (from !== toScene) {
      setPendingWalkingScene({
        fromScene: from,
        toScene: toScene,
      });
    } else {
      setCurrentScene(toScene);
    }
  };

  const handleStartAdventure = (name: string) => {
    sound.playFootstep();
    // Start ambient nature track upon beginning adventure for immersion
    ambientMusic.start();
    setGameState((prev) => ({
      ...prev,
      studentName: name.trim() || 'Penjelajah Muda',
      isMusicPlaying: true,
    }));
    navigateWithWalkingTrail('mission-1', 'start');
  };

  const handleSelectMission = (scene: AppScene) => {
    sound.playFootstep();
    // If moving between different mission scenes, show animated walking transition
    if (scene !== currentScene && (scene.startsWith('mission-') || scene === 'quiz')) {
      navigateWithWalkingTrail(scene, currentScene);
    } else {
      setCurrentScene(scene);
    }
  };

  const handleFinishQuiz = (finalScore: number) => {
    // Grand finale celebration confetti
    triggerQuizFinishConfetti();

    setGameState((prev) => ({
      ...prev,
      quizScore: finalScore,
    }));
  };

  const handleRestartAll = () => {
    sound.playClick();
    ambientMusic.stop();
    setGameState(INITIAL_GAME_STATE);
    setCurrentScene('start');
  };

  const completedCount = Object.values(gameState.completedMissions).filter(Boolean).length;
  const isCertificateUnlocked = completedCount >= 8 || gameState.quizScore !== null;
  const userBadge =
    BADGES.find((b) => (gameState.quizScore ?? 100) >= b.minScore) ||
    BADGES[BADGES.length - 1];

  // Resolve active weather state based on mode, local time, or mission progress
  const activeWeather: WeatherType = resolveActiveWeather(
    weatherMode,
    currentScene,
    completedCount,
    currentTime
  );
  const localTimeFormatted = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 relative overflow-x-hidden">
      {/* 
        0. MANDATED FULL-SCREEN RESPONSIVE WORLD BACKGROUND:
        - Covers the entire viewport
        - background-size: cover
        - background-position: center center
        - background-repeat: no-repeat
        - Consistent across all scenes to create ONE continuous Jelajah Ekosistem world
      */}
      <div
        id="world-ecosystem-bg"
        className="fixed inset-0 w-full h-full pointer-events-none z-0 ecosystem-world-bg"
        style={{
          backgroundImage: "url('/jelajah-ekosistem-bg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      >
        {/* Ambient tint overlay to keep high WCAG AA contrast while retaining lush art */}
        <div className="absolute inset-0 bg-stone-900/10 pointer-events-none" />
      </div>

      {/* Dynamic Weather & Atmospheric Abiotic Layer (Pointer-events-none) */}
      <DynamicWeatherBackground weather={activeWeather} />

      {/* 1. Global Navigation Header (6 mandated items: Beranda, Peta, Materi, Misi, Kuis, Profil) */}
      <HeaderNav
        currentScene={currentScene}
        stars={gameState.stars}
        playerName={gameState.studentName}
        soundEnabled={!gameState.isAudioMuted}
        isMuted={gameState.isAudioMuted}
        onToggleSound={handleToggleAudio}
        onToggleMute={handleToggleAudio}
        isMusicPlaying={gameState.isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        activeWeather={activeWeather}
        weatherMode={weatherMode}
        onChangeWeatherMode={(newMode) => setWeatherMode(newMode)}
        localTimeStr={localTimeFormatted}
        onOpenHowToPlay={() => {
          sound.playClick();
          setIsHelpOpen(true);
        }}
        onOpenHelp={() => {
          sound.playClick();
          setIsHelpOpen(true);
        }}
        onGoToStart={() => {
          sound.playClick();
          setCurrentScene('start');
        }}
        onGoToMap={() => {
          sound.playClick();
          setCurrentScene('map');
        }}
        onGoToMaterial={() => {
          sound.playClick();
          setCurrentScene('material');
        }}
        onGoToMissions={(targetMissionId) => {
          if (targetMissionId) {
            handleSelectMission(`mission-${targetMissionId}` as AppScene);
          } else {
            // Find first incomplete mission or default to mission-1
            for (let i = 1; i <= 8; i++) {
              if (!gameState.completedMissions[i as MissionId]) {
                handleSelectMission(`mission-${i}` as AppScene);
                return;
              }
            }
            handleSelectMission('mission-1');
          }
        }}
        onGoToQuiz={() => {
          sound.playStarEarned();
          setCurrentScene('quiz');
        }}
        onOpenCertificate={() => {
          sound.playStarEarned();
          setIsCertificateOpen(true);
        }}
        isCertificateUnlocked={isCertificateUnlocked}
        onOpenJournal={() => {
          sound.playClick();
          setIsJournalOpen(true);
        }}
        completedCount={completedCount}
        completedMissions={gameState.completedMissions}
      />

      {/* Visual Progress Bar beneath Header Navigation */}
      {currentScene !== 'start' && (
        <MissionProgressBar
          completedCount={completedCount}
          totalMissions={8}
          currentScene={currentScene}
          onGoToQuiz={() => {
            sound.playStarEarned();
            setCurrentScene('quiz');
          }}
          onContinueMissions={() => {
            // Find first incomplete mission or go to next
            for (let i = 1; i <= 8; i++) {
              if (!gameState.completedMissions[i as MissionId]) {
                handleSelectMission(`mission-${i}` as AppScene);
                return;
              }
            }
            setCurrentScene('quiz');
          }}
        />
      )}

      {/* 2. Persistent Interactive Trail Path (Visible throughout the learning journey) */}
      <TrailPath
        currentScene={currentScene}
        completedMissions={gameState.completedMissions}
        onSelectScene={handleSelectMission}
      />

      {/* 3. Main Scene Viewport with Atmospheric Fading Route Transitions */}
      <main className="flex-1 w-full flex flex-col relative overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentScene}
            initial={{ opacity: 0, filter: 'blur(4px)', y: 6 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, filter: 'blur(4px)', y: -6 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 w-full flex flex-col"
          >
            {currentScene === 'start' && (
              <StartScene
                playerName={gameState.studentName}
                initialStudentName={gameState.studentName}
                onUpdatePlayerName={(name) =>
                  setGameState((prev) => ({
                    ...prev,
                    studentName: name.trim() || 'Penjelajah Muda',
                  }))
                }
                onStartAdventure={() => {
                  handleStartAdventure(gameState.studentName);
                }}
                onStart={(name) => {
                  handleStartAdventure(name);
                }}
                onGoToMaterial={() => {
                  sound.playClick();
                  setCurrentScene('material');
                }}
                onGoToMap={() => {
                  sound.playClick();
                  setCurrentScene('map');
                }}
                onOpenHowToPlay={() => {
                  sound.playClick();
                  setIsHelpOpen(true);
                }}
                onOpenHelp={() => {
                  sound.playClick();
                  setIsHelpOpen(true);
                }}
              />
            )}

            {currentScene === 'map' && (
              <MapScene
                completedMissions={gameState.completedMissions}
                stars={gameState.stars}
                onSelectMission={handleSelectMission}
                onOpenJournal={() => setIsJournalOpen(true)}
              />
            )}

            {currentScene === 'material' && (
              <MaterialScene
                onGoToMap={() => setCurrentScene('map')}
                onSelectMission={(targetScene) => handleSelectMission(targetScene)}
                onGoToQuiz={() => {
                  sound.playStarEarned();
                  setCurrentScene('quiz');
                }}
              />
            )}

            {currentScene === 'mission-1' && (
              <Mission1Observe
                onComplete={(pts) => handleCompleteMission(1, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-2', 'mission-1')}
              />
            )}

            {currentScene === 'mission-2' && (
              <Mission2Detective
                onComplete={(pts) => handleCompleteMission(2, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-3', 'mission-2')}
              />
            )}

            {currentScene === 'mission-3' && (
              <Mission3Biotic
                onComplete={(pts) => handleCompleteMission(3, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-4', 'mission-3')}
              />
            )}

            {currentScene === 'mission-4' && (
              <Mission4Abiotic
                onComplete={(pts) => handleCompleteMission(4, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-5', 'mission-4')}
                activeWeather={activeWeather}
              />
            )}

            {currentScene === 'mission-5' && (
              <Mission5BuildEco
                onComplete={(pts) => handleCompleteMission(5, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-6', 'mission-5')}
              />
            )}

            {currentScene === 'mission-6' && (
              <Mission6WhatIf
                onComplete={(pts) => handleCompleteMission(6, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-7', 'mission-6')}
              />
            )}

            {currentScene === 'mission-7' && (
              <Mission7EcosystemDetective
                onComplete={(pts) => handleCompleteMission(7, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('mission-8', 'mission-7')}
              />
            )}

            {currentScene === 'mission-8' && (
              <Mission8MindMap
                onComplete={(pts) => handleCompleteMission(8, pts)}
                onGoToMap={() => setCurrentScene('map')}
                onNextMission={() => navigateWithWalkingTrail('quiz', 'mission-8')}
              />
            )}

            {currentScene === 'quiz' && (
              <QuizScene
                onFinishQuiz={handleFinishQuiz}
                onOpenCertificate={() => setIsCertificateOpen(true)}
                onGoToMap={() => setCurrentScene('map')}
                onRestartAll={handleRestartAll}
                totalGameStars={gameState.stars}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Fullscreen Animated Walking Journey along 'Jalan Setapak' */}
      {pendingWalkingScene && (
        <TrailWalkingTransition
          fromScene={pendingWalkingScene.fromScene}
          toScene={pendingWalkingScene.toScene}
          onFinish={() => {
            setCurrentScene(pendingWalkingScene.toScene);
            setPendingWalkingScene(null);
          }}
          onSkip={() => {
            setCurrentScene(pendingWalkingScene.toScene);
            setPendingWalkingScene(null);
          }}
        />
      )}

      {/* 5. Floating Mascot with Framer Motion entry and audio-cued contextual tips */}
      {!pendingWalkingScene && (
        <FloatingMascot
          currentScene={currentScene}
          studentName={gameState.studentName}
          isAudioMuted={gameState.isAudioMuted}
        />
      )}

      {/* 6. Interactive Modals */}
      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        playerName={gameState.studentName}
        score={gameState.quizScore ?? 100}
        badge={userBadge}
        stars={gameState.stars}
      />

      <ExplorerJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        entries={gameState.journalEntries}
        studentName={gameState.studentName}
        totalStars={gameState.stars}
        completedMissions={gameState.completedMissions}
        lastCompletedMissionId={lastCompletedMissionId}
        onNavigateToMission={(missionId) => {
          setIsJournalOpen(false);
          navigateWithWalkingTrail(`mission-${missionId}` as AppScene);
        }}
      />
    </div>
  );
}
