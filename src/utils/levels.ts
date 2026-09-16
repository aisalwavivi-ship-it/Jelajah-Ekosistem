import { ExplorerLevel } from '../types';

export const EXPLORER_LEVELS: ExplorerLevel[] = [
  {
    level: 1,
    title: 'Penjelajah Pemula',
    minStars: 0,
    maxStars: 24,
    icon: '🌱',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-300',
    bgColor: 'bg-emerald-50',
    progressColor: 'bg-emerald-500',
    description: 'Baru memulai pengamatan alam dan mengenali dasar-dasar lingkungan sekitar.',
  },
  {
    level: 2,
    title: 'Penjelajah Muda',
    minStars: 25,
    maxStars: 49,
    icon: '🌿',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-300',
    textColor: 'text-teal-800',
    borderColor: 'border-teal-300',
    bgColor: 'bg-teal-50',
    progressColor: 'bg-teal-500',
    description: 'Mampu membedakan makhluk hidup (biotik) dan benda tak hidup (abiotik) dengan cermat.',
  },
  {
    level: 3,
    title: 'Penjelajah Tangguh',
    minStars: 50,
    maxStars: 74,
    icon: '🧭',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-300',
    bgColor: 'bg-amber-50',
    progressColor: 'bg-amber-500',
    description: 'Memahami hubungan saling ketergantungan dan rantai kehidupan di dalam ekosistem.',
  },
  {
    level: 4,
    title: 'Detektif Alam',
    minStars: 75,
    maxStars: 99,
    icon: '🔎',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-300',
    bgColor: 'bg-blue-50',
    progressColor: 'bg-blue-500',
    description: 'Mampu menganalisis simulasi dampak perubahan lingkungan dan keseimbangan alam.',
  },
  {
    level: 5,
    title: 'Ahli Ekosistem',
    minStars: 100,
    maxStars: null,
    icon: '👑',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-300',
    bgColor: 'bg-purple-50',
    progressColor: 'bg-gradient-to-r from-purple-500 to-amber-500',
    description: 'Menguasai seluruh konsep harmoni ekosistem dan siap menjadi duta pelestari alam!',
  },
];

/**
 * Returns the corresponding ExplorerLevel based on total accumulated stars
 */
export function getExplorerLevel(stars: number): ExplorerLevel {
  const safeStars = Math.max(0, stars);
  for (let i = EXPLORER_LEVELS.length - 1; i >= 0; i--) {
    if (safeStars >= EXPLORER_LEVELS[i].minStars) {
      return EXPLORER_LEVELS[i];
    }
  }
  return EXPLORER_LEVELS[0];
}

/**
 * Calculates current level, next level target, progress percentage, and stars needed
 */
export function getNextLevelProgress(stars: number) {
  const currentLevel = getExplorerLevel(stars);
  const currentIndex = EXPLORER_LEVELS.findIndex((lvl) => lvl.level === currentLevel.level);
  const nextLevel = currentIndex < EXPLORER_LEVELS.length - 1 ? EXPLORER_LEVELS[currentIndex + 1] : null;

  if (!nextLevel) {
    return {
      currentLevel,
      nextLevel: null,
      progressPercent: 100,
      starsNeeded: 0,
      currentSpanProgress: stars - currentLevel.minStars,
      spanTarget: 0,
    };
  }

  const spanTarget = nextLevel.minStars - currentLevel.minStars;
  const currentSpanProgress = Math.min(spanTarget, Math.max(0, stars - currentLevel.minStars));
  const progressPercent = Math.min(100, Math.round((currentSpanProgress / spanTarget) * 100));
  const starsNeeded = Math.max(0, nextLevel.minStars - stars);

  return {
    currentLevel,
    nextLevel,
    progressPercent,
    starsNeeded,
    currentSpanProgress,
    spanTarget,
  };
}
