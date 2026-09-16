import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppScene, MissionId, ActiveSession, SessionHistoryItem, MissionJournalEntry } from './types';
import { sound } from './utils/audio';
import { tts } from './utils/tts';
import { ambientMusic } from './utils/ambientMusic';
import {
  triggerMissionSuccessConfetti,
  triggerQuizFinishConfetti,
  triggerCertificateConfetti,
} from './utils/confetti';
import { BADGES, MISSIONS_DATA, MISSION_JOURNAL_DETAILS } from './data/missions';
import {
  loadActiveSessionFromStorage,
  saveActiveSessionToStorage,
  saveHistoryToStorage,
  recordSessionToHistory,
  startNewSession,
} from './utils/sessionStorage';

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
import { RestartConfirmModal } from './components/RestartConfirmModal';
import { HistoryModal } from './components/HistoryModal';
import { GameOpeningScreen } from './components/GameOpeningScreen';
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

export default function App() {
  const [currentScene, setCurrentScene] = useState<AppScene>('start');
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isJournalOpen, setIsJournalOpen] = useState<boolean>(false);
  const [isDailyCheckInOpen, setIsDailyCheckInOpen] = useState<boolean>(false);
  const [isRestartConfirmOpen, setIsRestartConfirmOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const [weatherMode, setWeatherMode] = useState<WeatherMode>('auto-time');
  const [currentTime, setCurrentTime] = useState<Date>(() => new Date());

  // Periodically update local clock to keep live weather synchronized
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Initialize activeSession and history from storage migration utility
  const [initialData] = useState(() => loadActiveSessionFromStorage());
  const [activeSession, setActiveSession] = useState<ActiveSession>(initialData.activeSession);
  const [history, setHistory] = useState<SessionHistoryItem[]>(initialData.history);

  // Audio / Music preference state
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem('jelajah_audio_muted') === 'true';
    } catch {
      return false;
    }
  });
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);

  // Daily check-in streak
  const [lastCheckInDate, setLastCheckInDate] = useState<string | undefined>(() => {
    try {
      return localStorage.getItem('jelajah_last_checkin_date') || undefined;
    } catch {
      return undefined;
    }
  });
  const [checkInStreak, setCheckInStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('jelajah_checkin_streak') || '1', 10);
    } catch {
      return 1;
    }
  });

  // Game Opening Screen state (Only shown on initial entry, saved per session)
  const [hasSeenOpening, setHasSeenOpening] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('jelajah_has_seen_opening') === 'true';
    } catch {
      return false;
    }
  });

  const handleFinishOpening = () => {
    try {
      sessionStorage.setItem('jelajah_has_seen_opening', 'true');
    } catch {
      // ignore
    }
    setHasSeenOpening(true);
  };

  // Automatically persist active session whenever it changes
  useEffect(() => {
    saveActiveSessionToStorage(activeSession);
  }, [activeSession]);

  // Automatically persist history whenever it changes
  useEffect(() => {
    saveHistoryToStorage(history);
  }, [history]);

  // Audio mute toggle
  const handleToggleAudio = () => {
    const nextMuted = sound.toggleMute();
    tts.setSoundEnabled(!nextMuted);
    setIsAudioMuted(nextMuted);
    try {
      localStorage.setItem('jelajah_audio_muted', String(nextMuted));
    } catch {
      // ignore
    }
  };

  // Stop narration on scene transition
  useEffect(() => {
    tts.stop();
  }, [currentScene]);

  // Background Nature Music toggle
  const handleToggleMusic = () => {
    const nextPlaying = !isMusicPlaying;
    if (nextPlaying) {
      ambientMusic.start();
    } else {
      ambientMusic.stop();
    }
    setIsMusicPlaying(nextPlaying);
  };

  // Ensure audio nodes are stopped if the app unmounts
  useEffect(() => {
    return () => {
      ambientMusic.stop();
    };
  }, []);

  // Check if daily bonus is available today
  const todayDateStr = new Date().toISOString().split('T')[0];
  const isDailyClaimedToday = lastCheckInDate === todayDateStr;

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
    if (lastCheckInDate) {
      const lastDate = new Date(lastCheckInDate);
      const diffTime = today.getTime() - lastDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
      if (diffDays === 1) {
        nextStreak = (checkInStreak || 1) + 1;
      } else if (diffDays === 0) {
        nextStreak = checkInStreak || 1;
      } else {
        nextStreak = 1;
      }
    }

    setLastCheckInDate(todayStr);
    setCheckInStreak(nextStreak);
    try {
      localStorage.setItem('jelajah_last_checkin_date', todayStr);
      localStorage.setItem('jelajah_checkin_streak', String(nextStreak));
    } catch {
      // ignore
    }

    // Award 5 stars to active session
    setActiveSession((prev) => ({
      ...prev,
      stars: prev.stars + 5,
    }));

    triggerMissionSuccessConfetti();
    setIsDailyCheckInOpen(false);
  };

  // Track the most recently completed mission to celebrate badge unlocking
  const [lastCompletedMissionId, setLastCompletedMissionId] = useState<MissionId | null>(null);

  // Generic mission completion handler
  const handleCompleteMission = (missionId: MissionId, earnedStars: number) => {
    triggerMissionSuccessConfetti();
    setLastCompletedMissionId(missionId);

    const now = new Date().toISOString();
    const meta = MISSIONS_DATA.find((m) => m.id === missionId);
    const details = MISSION_JOURNAL_DETAILS[missionId];

    setActiveSession((prev) => {
      const isAlreadyCompleted = prev.completedMissions[missionId];
      const newCompleted = { ...prev.completedMissions, [missionId]: true };
      const updatedStars = isAlreadyCompleted ? prev.stars : prev.stars + earnedStars;
      const updatedScores = {
        ...prev.missionScores,
        [missionId]: Math.max(prev.missionScores[missionId] || 0, earnedStars),
      };

      // Update or record journal entry
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

      const totalMissionScore = (Object.values(updatedScores) as (number | undefined)[]).reduce<number>(
        (sum, score) => sum + (score || 0),
        0
      );
      const allDone = Object.values(newCompleted).filter(Boolean).length === 8;

      return {
        ...prev,
        completedMissions: newCompleted,
        missionScores: updatedScores,
        stars: updatedStars,
        journalEntries: updatedJournal,
        totalScore: totalMissionScore + (prev.quizScore || 0),
        status: allDone ? 'all_missions_done' : 'in_progress',
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

  const handleStartAdventure = (name?: string) => {
    sound.playFootstep();
    ambientMusic.start();
    setIsMusicPlaying(true);

    const safeArgName = typeof name === 'string' ? name.trim() : '';
    const safeCurrentName =
      typeof activeSession?.studentName === 'string' ? activeSession.studentName.trim() : '';
    const trimmed = safeArgName || safeCurrentName || 'Penjelajah Muda';
    setActiveSession((prev) => ({
      ...prev,
      studentName: trimmed,
    }));

    // If user already completed some missions in this session, navigate to the first incomplete mission
    for (let i = 1; i <= 8; i++) {
      if (!activeSession.completedMissions[i as MissionId]) {
        navigateWithWalkingTrail(`mission-${i}` as AppScene, 'start');
        return;
      }
    }
    navigateWithWalkingTrail('quiz', 'start');
  };

  const handleSelectMission = (scene: AppScene) => {
    sound.playFootstep();
    if (scene !== currentScene && (scene.startsWith('mission-') || scene === 'quiz')) {
      navigateWithWalkingTrail(scene, currentScene);
    } else {
      setCurrentScene(scene);
    }
  };

  const handleFinishQuiz = (finalScore: number) => {
    triggerQuizFinishConfetti();

    const earnedBadge =
      BADGES.find((b) => finalScore >= b.minScore) || BADGES[BADGES.length - 1];

    setActiveSession((prev) => {
      const missionScoreSum = (Object.values(prev.missionScores) as (number | undefined)[]).reduce<number>(
        (sum, score) => sum + (score || 0),
        0
      );
      const totalScore = missionScoreSum + finalScore;
      const updatedBadges = prev.badges.includes(earnedBadge.id)
        ? prev.badges
        : [...prev.badges, earnedBadge.id];

      const completedSession: ActiveSession = {
        ...prev,
        quizScore: finalScore,
        totalScore,
        badges: updatedBadges,
        status: 'completed',
        completedAt: new Date().toISOString(),
      };

      // Immediately archive to history so this attempt is securely saved
      setHistory((currHist) => recordSessionToHistory(completedSession, currHist));

      return completedSession;
    });
  };

  // Start a new session while preserving history
  const handleConfirmRestart = () => {
    sound.playClick();
    ambientMusic.stop();
    setIsMusicPlaying(false);

    const { newSession, updatedHistory } = startNewSession(activeSession, history);
    setActiveSession(newSession);
    setHistory(updatedHistory);
    setIsRestartConfirmOpen(false);

    // Smoothly return to the Map Scene with Checkpoint M1 active
    setCurrentScene('map');
  };

  const completedCount = Object.values(activeSession.completedMissions).filter(Boolean).length;
  const isCertificateUnlocked = completedCount >= 8 || activeSession.quizScore !== null;
  const userBadge =
    BADGES.find((b) => (activeSession.quizScore ?? 100) >= b.minScore) ||
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

      {/* 1. Global Navigation Header */}
      <HeaderNav
        currentScene={currentScene}
        stars={activeSession.stars}
        playerName={activeSession.studentName}
        soundEnabled={!isAudioMuted}
        isMuted={isAudioMuted}
        onToggleSound={handleToggleAudio}
        onToggleMute={handleToggleAudio}
        isMusicPlaying={isMusicPlaying}
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
            for (let i = 1; i <= 8; i++) {
              if (!activeSession.completedMissions[i as MissionId]) {
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
        onOpenDailyCheckIn={() => {
          sound.playClick();
          setIsDailyCheckInOpen(true);
        }}
        isDailyClaimedToday={isDailyClaimedToday}
        completedCount={completedCount}
        completedMissions={activeSession.completedMissions}
        onOpenHistory={() => {
          sound.playClick();
          setIsHistoryOpen(true);
        }}
        onOpenRestartConfirm={() => {
          sound.playClick();
          setIsRestartConfirmOpen(true);
        }}
        attemptNumber={activeSession.attemptNumber}
        historyCount={history.length}
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
            for (let i = 1; i <= 8; i++) {
              if (!activeSession.completedMissions[i as MissionId]) {
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
        completedMissions={activeSession.completedMissions}
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
                playerName={activeSession.studentName || 'Penjelajah Muda'}
                initialStudentName={activeSession.studentName || 'Penjelajah Muda'}
                onUpdatePlayerName={(name) => {
                  const safeName = typeof name === 'string' ? name.trim() : '';
                  setActiveSession((prev) => ({
                    ...prev,
                    studentName: safeName || 'Penjelajah Muda',
                  }));
                }}
                onStartAdventure={() => {
                  handleStartAdventure(activeSession.studentName || 'Penjelajah Muda');
                }}
                onStart={(name) => {
                  handleStartAdventure(name || activeSession.studentName || 'Penjelajah Muda');
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
                completedCount={completedCount}
                activeAttemptNumber={activeSession.attemptNumber}
                onOpenHistory={() => {
                  sound.playClick();
                  setIsHistoryOpen(true);
                }}
                onOpenRestartConfirm={() => {
                  sound.playClick();
                  setIsRestartConfirmOpen(true);
                }}
              />
            )}

            {currentScene === 'map' && (
              <MapScene
                completedMissions={activeSession.completedMissions}
                stars={activeSession.stars}
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
                onRestartAll={() => setIsRestartConfirmOpen(true)}
                totalGameStars={activeSession.stars}
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
      {!pendingWalkingScene && hasSeenOpening && (
        <FloatingMascot
          currentScene={currentScene}
          studentName={activeSession.studentName}
          isAudioMuted={isAudioMuted}
        />
      )}

      {/* 5b. Game Opening Screen (Intro cinematic adventure layer before entering main website) */}
      {!hasSeenOpening && (
        <GameOpeningScreen
          onFinish={handleFinishOpening}
          studentName={activeSession.studentName}
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
        playerName={activeSession.studentName}
        score={activeSession.quizScore ?? 100}
        badge={userBadge}
        stars={activeSession.stars}
      />

      <ExplorerJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        entries={activeSession.journalEntries}
        studentName={activeSession.studentName}
        totalStars={activeSession.stars}
        completedMissions={activeSession.completedMissions}
        lastCompletedMissionId={lastCompletedMissionId}
        onNavigateToMission={(missionId) => {
          setIsJournalOpen(false);
          navigateWithWalkingTrail(`mission-${missionId}` as AppScene);
        }}
        onOpenHistory={() => {
          setIsJournalOpen(false);
          setIsHistoryOpen(true);
        }}
        historyCount={history.length}
      />

      <DailyCheckInModal
        isOpen={isDailyCheckInOpen}
        studentName={activeSession.studentName}
        streak={checkInStreak || 1}
        bonusStars={5}
        isAlreadyClaimedToday={isDailyClaimedToday}
        onClaimBonus={handleClaimDailyBonus}
        onClose={() => setIsDailyCheckInOpen(false)}
      />

      {/* 7. Restart Confirmation Modal */}
      <RestartConfirmModal
        isOpen={isRestartConfirmOpen}
        onClose={() => setIsRestartConfirmOpen(false)}
        onConfirm={handleConfirmRestart}
        onConfirmRestart={handleConfirmRestart}
        completedCount={completedCount}
        stars={activeSession.stars}
        currentAttempt={activeSession.attemptNumber}
        currentAttemptNumber={activeSession.attemptNumber}
      />

      {/* 8. Session History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        activeSession={activeSession}
        studentName={activeSession.studentName || 'Penjelajah Muda'}
        onStartNewAttempt={() => {
          setIsHistoryOpen(false);
          setIsRestartConfirmOpen(true);
        }}
        onOpenRestartConfirm={() => {
          setIsHistoryOpen(false);
          setIsRestartConfirmOpen(true);
        }}
        onGoToMap={() => {
          setCurrentScene('map');
        }}
      />
    </div>
  );
}
