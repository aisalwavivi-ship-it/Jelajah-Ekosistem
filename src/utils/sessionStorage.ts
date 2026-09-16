import { ActiveSession, SessionHistoryItem, MissionId, MissionJournalEntry } from '../types';
import { MISSIONS_DATA, MISSION_JOURNAL_DETAILS, BADGES } from '../data/missions';

export const ACTIVE_SESSION_STORAGE_KEY = 'jelajah_ekosistem_active_session_v3';
export const HISTORY_STORAGE_KEY = 'jelajah_ekosistem_history_v3';
export const OLD_STATE_KEY = 'jelajah_ekosistem_state_v2';

export const INITIAL_COMPLETED_MISSIONS: Record<MissionId, boolean> = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
  8: false,
};

export const INITIAL_MISSION_SCORES: Record<MissionId, number> = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
};

/**
 * Creates a brand new initial active session for a given attempt number.
 * Progress starts strictly at 0/8, 0 stars, and checkpoints locked except M1.
 */
export const createInitialActiveSession = (
  attemptNumber: number = 1,
  studentName: string = 'Penjelajah Muda'
): ActiveSession => {
  return {
    sessionId: attemptNumber,
    attemptNumber,
    studentName: studentName || 'Penjelajah Muda',
    status: 'in-progress',
    completedMissions: { ...INITIAL_COMPLETED_MISSIONS },
    missionScores: { ...INITIAL_MISSION_SCORES },
    stars: 0,
    quizScore: null,
    totalScore: 0,
    badges: [],
    journalEntries: [],
    startedAt: new Date().toISOString(),
  };
};

/**
 * Safely reads and migrates past storage data without clearing anything.
 */
export const loadActiveSessionFromStorage = (): {
  activeSession: ActiveSession;
  history: SessionHistoryItem[];
} => {
  let activeSession: ActiveSession | null = null;
  let history: SessionHistoryItem[] = [];

  // 1. Try loading existing history
  try {
    const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (rawHistory) {
      const parsed = JSON.parse(rawHistory);
      if (Array.isArray(parsed)) {
        history = parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read history from storage', err);
  }

  // 2. Try loading existing active session
  try {
    const rawActive = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY);
    if (rawActive) {
      const parsed = JSON.parse(rawActive) as Partial<ActiveSession>;
      if (parsed && parsed.completedMissions && typeof parsed.attemptNumber === 'number') {
        activeSession = {
          sessionId: parsed.sessionId || parsed.attemptNumber,
          attemptNumber: parsed.attemptNumber,
          studentName: parsed.studentName || 'Penjelajah Muda',
          status: parsed.status || 'in-progress',
          completedMissions: {
            ...INITIAL_COMPLETED_MISSIONS,
            ...parsed.completedMissions,
          },
          missionScores: {
            ...INITIAL_MISSION_SCORES,
            ...(parsed.missionScores || {}),
          },
          stars: parsed.stars || 0,
          quizScore: parsed.quizScore !== undefined ? parsed.quizScore : null,
          totalScore: parsed.totalScore || 0,
          badges: Array.isArray(parsed.badges) ? parsed.badges : [],
          journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : [],
          startedAt: parsed.startedAt || new Date().toISOString(),
          completedAt: parsed.completedAt,
        };
      }
    }
  } catch (err) {
    console.warn('Could not read active session from storage', err);
  }

  // 3. Fallback / Migration: If no active session yet, migrate from OLD_STATE_KEY
  if (!activeSession) {
    try {
      const rawOld = localStorage.getItem(OLD_STATE_KEY);
      if (rawOld) {
        const parsedOld = JSON.parse(rawOld);
        if (parsedOld && parsedOld.completedMissions) {
          const completedCount = Object.values(parsedOld.completedMissions).filter(Boolean).length;
          const isCompleted = completedCount >= 8 && parsedOld.quizScore !== null && parsedOld.quizScore !== undefined;

          // Backfill mission scores from points
          const migratedScores: Record<MissionId, number> = { ...INITIAL_MISSION_SCORES };
          for (let i = 1; i <= 8; i++) {
            const mId = i as MissionId;
            if (parsedOld.completedMissions[mId]) {
              const meta = MISSIONS_DATA.find((m) => m.id === mId);
              migratedScores[mId] = meta?.points || 15;
            }
          }

          // Backfill journal entries if empty
          let migratedEntries: MissionJournalEntry[] = Array.isArray(parsedOld.journalEntries)
            ? parsedOld.journalEntries
            : [];

          if (migratedEntries.length === 0 && completedCount > 0) {
            for (let i = 1; i <= 8; i++) {
              const id = i as MissionId;
              if (parsedOld.completedMissions[id]) {
                const meta = MISSIONS_DATA.find((m) => m.id === id);
                const details = MISSION_JOURNAL_DETAILS[id];
                if (meta) {
                  migratedEntries.push({
                    id: `journal-migrated-${id}`,
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
          }

          activeSession = {
            sessionId: 1,
            attemptNumber: 1,
            studentName: parsedOld.studentName || 'Penjelajah Muda',
            status: isCompleted ? 'completed' : 'in-progress',
            completedMissions: {
              ...INITIAL_COMPLETED_MISSIONS,
              ...parsedOld.completedMissions,
            },
            missionScores: migratedScores,
            stars: parsedOld.stars || 0,
            quizScore: parsedOld.quizScore !== undefined ? parsedOld.quizScore : null,
            totalScore: (parsedOld.stars || 0) + (parsedOld.quizScore || 0),
            badges: Array.isArray(parsedOld.badges) ? parsedOld.badges : [],
            journalEntries: migratedEntries,
            startedAt: new Date().toISOString(),
            completedAt: isCompleted ? new Date().toISOString() : undefined,
          };

          // If old session was completed and history doesn't have it yet, add to history
          if (isCompleted && history.length === 0) {
            const badgeMeta = BADGES.find((b) => (parsedOld.quizScore ?? 100) >= b.minScore) || BADGES[BADGES.length - 1];
            history.push({
              sessionId: 1,
              attemptNumber: 1,
              completedAt: new Date().toISOString(),
              completedCount: 8,
              progressPercent: 100,
              missionScores: migratedScores,
              quizScore: parsedOld.quizScore ?? null,
              totalScore: (parsedOld.stars || 0) + (parsedOld.quizScore || 0),
              stars: parsedOld.stars || 0,
              badgeTitle: badgeMeta.title,
              badgeIcon: badgeMeta.icon,
              badges: [badgeMeta.title],
              status: 'completed',
            });
            try {
              localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
            } catch {
              // ignore
            }
          }

          // Persist the migrated active session
          try {
            localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(activeSession));
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.warn('Could not migrate old state', err);
    }
  }

  // 4. If still null, create clean initial Percobaan 1
  if (!activeSession) {
    activeSession = createInitialActiveSession(1);
    try {
      localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(activeSession));
    } catch {
      // ignore
    }
  }

  return { activeSession, history };
};

/**
 * Persists active session into localStorage.
 */
export const saveActiveSessionToStorage = (session: ActiveSession): void => {
  try {
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Failed to save active session to localStorage', err);
  }
};

/**
 * Persists history list into localStorage.
 */
export const saveHistoryToStorage = (history: SessionHistoryItem[]): void => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.warn('Failed to save history to localStorage', err);
  }
};

/**
 * Records or updates a finished or in-progress session in history.
 * Ensures NO duplicate entries with the same sessionId / attemptNumber.
 */
export const recordSessionToHistory = (
  session: ActiveSession,
  existingHistory: SessionHistoryItem[]
): SessionHistoryItem[] => {
  const completedCount = Object.values(session.completedMissions).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 8) * 100);

  const badgeMeta =
    BADGES.find((b) => (session.quizScore ?? 100) >= b.minScore) || BADGES[BADGES.length - 1];

  const missionScoreTotal = Object.values(session.missionScores).reduce((a, b) => a + b, 0);
  const totalScore = missionScoreTotal + (session.quizScore ?? 0);

  const historyItem: SessionHistoryItem = {
    sessionId: session.sessionId,
    attemptNumber: session.attemptNumber,
    studentName: session.studentName || 'Penjelajah Muda',
    completedAt: session.completedAt || new Date().toISOString(),
    completedCount,
    progressPercent,
    missionScores: { ...session.missionScores },
    quizScore: session.quizScore,
    totalScore,
    stars: session.stars,
    badgeTitle: badgeMeta.title,
    badgeIcon: badgeMeta.icon,
    badges: session.badges.length > 0 ? session.badges : [badgeMeta.title],
    status: session.status,
  };

  // Check if this attempt is already recorded
  const existingIndex = existingHistory.findIndex(
    (h) => h.sessionId === session.sessionId || h.attemptNumber === session.attemptNumber
  );

  let updatedList: SessionHistoryItem[];
  if (existingIndex >= 0) {
    updatedList = [...existingHistory];
    updatedList[existingIndex] = historyItem;
  } else {
    // Add to history (newest attempts first or chronological)
    updatedList = [historyItem, ...existingHistory];
  }

  saveHistoryToStorage(updatedList);
  return updatedList;
};

/**
 * Starts a brand new session:
 * - If current session is completed or has progress, ensures it is archived in history
 * - Determines next attempt number (highest existing + 1)
 * - Returns new fresh ActiveSession and updated history
 */
export const startNewSession = (
  currentSession: ActiveSession,
  history: SessionHistoryItem[]
): {
  newSession: ActiveSession;
  updatedHistory: SessionHistoryItem[];
} => {
  let updatedHistory = [...history];

  // If current session completed or had work done, record to history so nothing is lost
  const completedCount = Object.values(currentSession.completedMissions).filter(Boolean).length;
  if (currentSession.status === 'completed' || completedCount > 0) {
    updatedHistory = recordSessionToHistory(currentSession, updatedHistory);
  }

  // Calculate next attempt number
  const allAttempts = [
    currentSession.attemptNumber,
    ...updatedHistory.map((h) => h.attemptNumber),
    0,
  ];
  const nextAttemptNumber = Math.max(...allAttempts) + 1;

  // Create brand new active session with clean 0 progress
  const newSession = createInitialActiveSession(
    nextAttemptNumber,
    currentSession.studentName || 'Penjelajah Muda'
  );

  // Save both
  saveActiveSessionToStorage(newSession);
  saveHistoryToStorage(updatedHistory);

  return { newSession, updatedHistory };
};
