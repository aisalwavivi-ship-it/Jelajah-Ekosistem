import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScene, MissionId, GameState, MissionJournalEntry, SessionRecord } from './types';
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
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { ConfirmResetModal } from './components/ConfirmResetModal';
import { WorkHistoryModal } from './components/WorkHistoryModal';
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

const STORAGE_KEY = 'jelajah_ekosistem_state_v3';
const STORAGE_HISTORY_KEY = 'jelajah_ekosistem_history_v3';
const LEGACY_STORAGE_KEY = 'jelajah_ekosistem_state_v2';

export interface ActiveSessionMeta {
  attemptNumber: number;
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'completed';
  missionStars: Record<number, number>;
}

interface AppGameState {
  studentName: string;
  completedMissions: Record<MissionId, boolean>;
  stars: number;
  badges: string[];
  isAudioMuted: boolean;
  isMusicPlaying: boolean;
  quizScore: number | null;
  journalEntries: MissionJournalEntry[];
  lastCheckInDate?: string;
  checkInStreak?: number;
  activeSession: ActiveSessionMeta;
  history: SessionRecord[];
}

const INITIAL_ACTIVE_SESSION: ActiveSessionMeta = {
  attemptNumber: 1,
  startedAt: new Date().toISOString(),
  status: 'active',
  missionStars: {},
};

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
  lastCheckInDate: undefined,
  checkInStreak: 1,
  activeSession: INITIAL_ACTIVE_SESSION,
  history: [],
};

export default function App() {
  const [currentScene, setCurrentScene] = useState<AppScene>('start');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState<boolean>(false);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [selectedHistoryCertificate, setSelectedHistoryCertificate] = useState<SessionRecord | null>(null);

  const [weatherMode, setWeatherMode] = useState<WeatherMode>('auto-time');
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Periodically update local clock to keep live weather synchronized
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Load initial state from localStorage if present with graceful migration
  const [gameState, setGameState] = useState<AppGameState>(() => {
    try {
      // 1. Try to load v3 state
      const savedV3 = localStorage.getItem(STORAGE_KEY);
      const savedHistory = localStorage.getItem(STORAGE_HISTORY_KEY);
      let parsedHistory: SessionRecord[] = [];
      if (savedHistory) {
        try {
          const ph = JSON.parse(savedHistory);
          if (Array.isArray(ph)) parsedHistory = ph;
        } catch {
          // ignore
        }
      }

      if (savedV3) {
        const parsed = JSON.parse(savedV3);
        if (parsed && parsed.completedMissions) {
          const finalHistory = Array.isArray(parsed.history) && parsed.history.length > 0
            ? parsed.history
            : parsedHistory;

          const activeSess: ActiveSessionMeta = parsed.activeSession || {
            attemptNumber: 1,
            startedAt: new Date().toISOString(),
            status: parsed.quizScore !== null ? 'completed' : 'active',
            missionStars: {},
          };

          return {
            ...INITIAL_GAME_STATE,
            ...parsed,
            isMusicPlaying: false,
            activeSession: activeSess,
            history: finalHistory,
          };
        }
      }

      // 2. Backward compatibility fallback from v2
      const savedV2 = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (savedV2) {
        const legacy = JSON.parse(savedV2);
        if (legacy && legacy.completedMissions) {
          const completedCount = Object.values(legacy.completedMissions).filter(Boolean).length;
          const isFinished = completedCount >= 8 && legacy.quizScore !== null;
          const userBadge = BADGES.find((b) => (legacy.quizScore ?? 100) >= b.minScore) || BADGES[BADGES.length - 1];

          let legacyHistory: SessionRecord[] = [];
          if (isFinished) {
            legacyHistory.push({
              id: `session-legacy-1`,
              attemptNumber: 1,
              studentName: legacy.studentName || 'Penjelajah Muda',
              startedAt: new Date(Date.now() - 3600000).toISOString(),
              completedAt: new Date().toISOString(),
              status: 'completed',
              completedMissionsCount: 8,
              completedMissions: { ...legacy.completedMissions },
              progressPercent: 100,
              stars: legacy.stars || 120,
              missionScores: {},
              quizScore: legacy.quizScore,
              badgeTitle: userBadge.title,
              badgeIcon: userBadge.icon,
            });
          }

          const initialSession: ActiveSessionMeta = {
            attemptNumber: isFinished ? 1 : 1,
            startedAt: new Date().toISOString(),
            completedAt: isFinished ? new Date().toISOString() : undefined,
            status: isFinished ? 'completed' : 'active',
            missionStars: {},
          };

          return {
            ...INITIAL_GAME_STATE,
            studentName: legacy.studentName || 'Penjelajah Muda',
            completedMissions: legacy.completedMissions || INITIAL_GAME_STATE.completedMissions,
            stars: legacy.stars || 0,
            badges: legacy.badges || [],
            quizScore: legacy.quizScore,
            journalEntries: legacy.journalEntries || [],
            lastCheckInDate: legacy.lastCheckInDate,
            checkInStreak: legacy.checkInStreak || 1,
            activeSession: initialSession,
            history: legacyHistory,
            isMusicPlaying: false,
          };
        }
      }
    } catch (e) {
      console.warn('Could not read state from localStorage', e);
    }
    return INITIAL_GAME_STATE;
  });

  // Sync state to localStorage whenever it changes (without clear)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(gameState.history));
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

  // Check if daily bonus is available today
  const todayDateStr = new Date().toISOString().split('T')[0];
  const isDailyClaimedToday = gameState.lastCheckInDate === todayDateStr;

  // Auto-prompt daily check-in once per session if not claimed yet
  useEffect(() => {
    const hasPromptedThisSession = sessionStorage.getItem('daily_checkin_prompted');
    if (!hasPromptedThisSession && !isDailyClaimedToday) {
      sessionStorage.setItem('daily_checkin_prompted', 'true');
      const timer = setTimeout(() => {
        setIsDailyCheckInOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [isDailyClaimedToday]);

  const handleClaimDailyBonus = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    // Calculate streak
    let nextStreak = 1;
    if (gameState.lastCheckInDate) {
      const lastDate = new Date(gameState.lastCheckInDate);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        nextStreak = (gameState.checkInStreak || 1) + 1;
      } else if (diffDays === 0) {
        nextStreak = gameState.checkInStreak || 1;
      } else {
        nextStreak = 1;
      }
    }

    setGameState((prev) => ({
      ...prev,
      stars: prev.stars + 5,
      lastCheckInDate: todayStr,
      checkInStreak: nextStreak,
    }));
    triggerMissionSuccessConfetti();
    setIsDailyCheckInOpen(false);
  };

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
      const updatedMissionStars = {
        ...prev.activeSession.missionStars,
        [missionId]: Math.max(prev.activeSession.missionStars[missionId] || 0, earnedStars),
      };

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
        activeSession: {
          ...prev.activeSession,
          missionStars: updatedMissionStars,
        },
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

    setGameState((prev) => {
      const completedCount = Object.values(prev.completedMissions).filter(Boolean).length;
      const nowStr = new Date().toISOString();
      const userBadge = BADGES.find((b) => finalScore >= b.minScore) || BADGES[BADGES.length - 1];

      // Create session record for history archive
      const finishedSessionRecord: SessionRecord = {
        id: `session-${prev.activeSession.attemptNumber}-${Date.now()}`,
        attemptNumber: prev.activeSession.attemptNumber,
        studentName: prev.studentName,
        startedAt: prev.activeSession.startedAt,
        completedAt: nowStr,
        status: 'completed',
        completedMissionsCount: completedCount,
        completedMissions: { ...prev.completedMissions },
        progressPercent: Math.round((completedCount / 8) * 100),
        stars: prev.stars,
        missionScores: { ...prev.activeSession.missionStars },
        quizScore: finalScore,
        badgeTitle: userBadge.title,
        badgeIcon: userBadge.icon,
      };

      const existingIndex = prev.history.findIndex(
        (h) => h.attemptNumber === prev.activeSession.attemptNumber
      );
      let newHistory: SessionRecord[];
      if (existingIndex >= 0) {
        newHistory = [...prev.history];
        newHistory[existingIndex] = finishedSessionRecord;
      } else {
        newHistory = [finishedSessionRecord, ...prev.history];
      }

      return {
        ...prev,
        quizScore: finalScore,
        activeSession: {
          ...prev.activeSession,
          status: 'completed',
          completedAt: nowStr,
        },
        history: newHistory,
      };
    });
  };

  // Request restart / new session with confirmation dialog
  const handleRequestReset = () => {
    sound.playClick();
    setIsConfirmResetOpen(true);
  };

  // Start new active session without clearing history
  const handleConfirmStartNewSession = () => {
    sound.playClick();
    ambientMusic.stop();

    setGameState((prev) => {
      let updatedHistory = [...prev.history];
      const completedCount = Object.values(prev.completedMissions).filter(Boolean).length;

      // If current session had progress and isn't archived yet, archive it
      const alreadySaved = updatedHistory.some(
        (h) => h.attemptNumber === prev.activeSession.attemptNumber
      );
      if (!alreadySaved && (completedCount > 0 || prev.quizScore !== null)) {
        const userBadge = BADGES.find((b) => (prev.quizScore ?? 70) >= b.minScore) || BADGES[BADGES.length - 1];
        const isDone = completedCount >= 8 && prev.quizScore !== null;
        const archivedRecord: SessionRecord = {
          id: `session-${prev.activeSession.attemptNumber}-${Date.now()}`,
          attemptNumber: prev.activeSession.attemptNumber,
          studentName: prev.studentName,
          startedAt: prev.activeSession.startedAt,
          completedAt: prev.activeSession.completedAt || (isDone ? new Date().toISOString() : undefined),
          status: isDone ? 'completed' : 'in-progress',
          completedMissionsCount: completedCount,
          completedMissions: { ...prev.completedMissions },
          progressPercent: Math.round((completedCount / 8) * 100),
          stars: prev.stars,
          missionScores: { ...prev.activeSession.missionStars },
          quizScore: prev.quizScore,
          badgeTitle: userBadge.title,
          badgeIcon: userBadge.icon,
        };
        updatedHistory = [archivedRecord, ...updatedHistory];
      }

      // Determine next attempt number (incrementing)
      const maxAttemptInHistory = updatedHistory.reduce((max, h) => Math.max(max, h.attemptNumber), 0);
      const nextAttempt = Math.max(prev.activeSession.attemptNumber, maxAttemptInHistory) + 1;

      return {
        ...prev,
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
        quizScore: null,
        journalEntries: [],
        activeSession: {
          attemptNumber: nextAttempt,
          startedAt: new Date().toISOString(),
          status: 'active',
          missionStars: {},
        },
        history: updatedHistory,
      };
    });

    setIsConfirmResetOpen(false);
    setIsHistoryOpen(false);
    setIsCertificateOpen(false);
    setSelectedHistoryCertificate(null);
    setLastCompletedMissionId(null);
    navigateWithWalkingTrail('mission-1', currentScene);
  };

  const handleRestartAll = () => {
    handleRequestReset();
  };

  const handleViewCertificateForSession = (session: SessionRecord) => {
    setSelectedHistoryCertificate(session);
    setIsHistoryOpen(false);
    setIsCertificateOpen(true);
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
        onOpenHistory={() => {
          sound.playClick();
          setIsHistoryOpen(true);
        }}
        onRequestReset={handleRequestReset}
        activeAttemptNumber={gameState.activeSession.attemptNumber}
        onOpenDailyCheckIn={() => {
          sound.playClick();
          setIsDailyCheckInOpen(true);
        }}
        isDailyClaimedToday={isDailyClaimedToday}
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
                onOpenHistory={() => {
                  sound.playClick();
                  setIsHistoryOpen(true);
                }}
                onRequestReset={handleRequestReset}
                activeAttemptNumber={gameState.activeSession.attemptNumber}
                activeCompletedCount={completedCount}
                activeStatus={gameState.activeSession.status}
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
                onRequestNewSession={handleRequestReset}
                onOpenHistory={() => {
                  sound.playClick();
                  setIsHistoryOpen(true);
                }}
                activeAttemptNumber={gameState.activeSession.attemptNumber}
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
        onClose={() => {
          setIsCertificateOpen(false);
          setSelectedHistoryCertificate(null);
        }}
        playerName={selectedHistoryCertificate?.studentName || gameState.studentName}
        score={selectedHistoryCertificate?.quizScore ?? gameState.quizScore ?? 100}
        badge={
          selectedHistoryCertificate?.quizScore !== undefined && selectedHistoryCertificate?.quizScore !== null
            ? BADGES.find((b) => selectedHistoryCertificate.quizScore! >= b.minScore) || userBadge
            : userBadge
        }
        stars={selectedHistoryCertificate?.stars ?? gameState.stars}
        dateStr={
          selectedHistoryCertificate?.completedAt
            ? new Date(selectedHistoryCertificate.completedAt).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : undefined
        }
        attemptNumber={selectedHistoryCertificate?.attemptNumber ?? gameState.activeSession.attemptNumber}
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

      <DailyCheckInModal
        isOpen={isDailyCheckInOpen}
        studentName={gameState.studentName}
        streak={gameState.checkInStreak || 1}
        bonusStars={5}
        isAlreadyClaimedToday={isDailyClaimedToday}
        onClaimBonus={handleClaimDailyBonus}
        onClose={() => setIsDailyCheckInOpen(false)}
      />

      {/* 7. Modal Konfirmasi Mulai Lagi / Sesi Baru (Anti-accidental reset) */}
      <ConfirmResetModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={handleConfirmStartNewSession}
        currentAttemptNumber={gameState.activeSession.attemptNumber}
        completedCount={completedCount}
      />

      {/* 8. Modal Riwayat Pengerjaan (Arsip Sesi Murid) */}
      <WorkHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        sessions={gameState.history}
        currentAttemptNumber={gameState.activeSession.attemptNumber}
        onStartNewSession={handleRequestReset}
        onViewCertificate={handleViewCertificateForSession}
      />
    </div>
  );
}
