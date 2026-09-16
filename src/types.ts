export type MissionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export type AppScene = 
  | 'start' 
  | 'map' 
  | 'material'
  | 'mission-1' 
  | 'mission-2' 
  | 'mission-3' 
  | 'mission-4' 
  | 'mission-5' 
  | 'mission-6' 
  | 'mission-7' 
  | 'mission-8' 
  | 'quiz' 
  | 'finish';

export interface MissionMeta {
  id: MissionId;
  title: string;
  subtitle: string;
  location: string;
  icon: string;
  description: string;
  points: number;
}

export interface EcosystemIllustration {
  theme: 'pond' | 'garden' | 'forest' | 'grassland';
  caption: string;
  labels: {
    badgeId: string;
    name: string;
    level: 'individu' | 'populasi' | 'komunitas' | 'abiotik';
    icon: string;
    description: string;
  }[];
}

export interface QuizQuestion {
  id: number;
  badge?: string;
  scenario?: string;
  imageVisual?: string;
  illustration?: EcosystemIllustration;
  question: string;
  type: 'multiple-choice' | 'multi-select' | 'classify' | 'situation';
  options: {
    id: string;
    text: string;
    isCorrect?: boolean;
    category?: 'biotik' | 'abiotik';
  }[];
  explanation: string;
  hint?: string;
}

export interface BadgeInfo {
  id: string;
  title: string;
  minScore: number;
  icon: string;
  description: string;
  color: string;
}

export interface MissionJournalEntry {
  id: string;
  missionId: MissionId;
  title: string;
  subtitle: string;
  location: string;
  icon: string;
  starsEarned: number;
  completedAt: string; // ISO string
  summary: string;
  categoryTag?: 'biotik' | 'abiotik' | 'ekosistem';
  keyConcepts?: {
    biotik: string;
    abiotik: string;
    relationship?: string;
  };
}

export interface ExplorerLevel {
  level: number;
  title: string;
  minStars: number;
  maxStars: number | null;
  icon: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
  progressColor: string;
  description: string;
}

export interface ActiveSession {
  sessionId: number;
  attemptNumber: number;
  studentName?: string;
  status: 'in-progress' | 'completed' | 'all_missions_done';
  completedMissions: Record<MissionId, boolean>;
  missionScores: Record<MissionId, number>;
  stars: number;
  quizScore: number | null;
  totalScore: number;
  badges: string[];
  journalEntries: MissionJournalEntry[];
  startedAt: string;
  completedAt?: string;
}

export interface SessionHistoryItem {
  sessionId: number;
  attemptNumber: number;
  studentName?: string;
  completedAt: string;
  completedCount: number;
  progressPercent: number;
  missionScores: Record<MissionId, number>;
  quizScore: number | null;
  totalScore: number;
  stars: number;
  badgeTitle?: string;
  badgeIcon?: string;
  badges: string[];
  status: 'completed' | 'in-progress' | 'all_missions_done';
}

export interface GameState {
  studentName: string;
  currentMissionId: string;
  completedMissions: string[];
  unlockedMissions: string[];
  stars: number;
  badges: string[];
  isAudioMuted: boolean;
  quizScore: number | null;
  selectedPath: 'taman' | 'kolam' | null;
  journal?: MissionJournalEntry[];
}
