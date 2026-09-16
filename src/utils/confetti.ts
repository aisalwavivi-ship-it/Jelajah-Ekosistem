import confetti from 'canvas-confetti';

// Palette inspired by nature, rainforest, golden sun, and Indonesian classroom joy
const NATURE_COLORS = [
  '#10b981', // emerald
  '#059669', // deep green
  '#f59e0b', // amber gold
  '#fbbf24', // bright yellow
  '#06b6d4', // cyan water
  '#3b82f6', // sky blue
  '#ec4899', // floral pink
  '#84cc16', // fresh lime
];

const GOLDEN_VICTORY_COLORS = [
  '#f59e0b', // amber gold
  '#fbbf24', // yellow gold
  '#d97706', // bronze gold
  '#fef08a', // pale gold sparkle
  '#10b981', // emerald accent
  '#ffffff', // diamond sparkle
];

/**
 * Vibrant dual-burst celebration for completing an individual mission along the trail.
 */
export function triggerMissionSuccessConfetti() {
  try {
    // 1. Center burst
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: NATURE_COLORS,
      ticks: 200,
      gravity: 1.1,
      scalar: 1.1,
      zIndex: 9999,
    });

    // 2. Left side cannon
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 60,
        spread: 55,
        origin: { x: 0.05, y: 0.75 },
        colors: NATURE_COLORS,
        ticks: 240,
        gravity: 1,
        scalar: 1,
        zIndex: 9999,
      });
    }, 150);

    // 3. Right side cannon
    setTimeout(() => {
      confetti({
        particleCount: 45,
        angle: 120,
        spread: 55,
        origin: { x: 0.95, y: 0.75 },
        colors: NATURE_COLORS,
        ticks: 240,
        gravity: 1,
        scalar: 1,
        zIndex: 9999,
      });
    }, 280);
  } catch (error) {
    console.warn('Confetti effect unavailable:', error);
  }
}

/**
 * Grand finale fireworks and continuous confetti cascade for completing the final IPAS quiz.
 */
export function triggerQuizFinishConfetti() {
  try {
    const end = Date.now() + 2500; // 2.5 seconds of celebratory shower

    // Immediate big center burst
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: GOLDEN_VICTORY_COLORS,
      ticks: 300,
      gravity: 0.9,
      scalar: 1.25,
      zIndex: 9999,
    });

    // Repeating volley from left and right corners
    const interval: ReturnType<typeof setInterval> = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      // Left corner launch
      confetti({
        particleCount: 35,
        angle: 55,
        spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: NATURE_COLORS,
        ticks: 220,
        gravity: 1.0,
        scalar: 1.1,
        zIndex: 9999,
      });

      // Right corner launch
      confetti({
        particleCount: 35,
        angle: 125,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: GOLDEN_VICTORY_COLORS,
        ticks: 220,
        gravity: 1.0,
        scalar: 1.1,
        zIndex: 9999,
      });
    }, 320);
  } catch (error) {
    console.warn('Quiz confetti effect unavailable:', error);
  }
}

/**
 * Golden prestige shimmer when opening or viewing the Explorer Certificate.
 */
export function triggerCertificateConfetti() {
  try {
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.4 },
      colors: GOLDEN_VICTORY_COLORS,
      ticks: 260,
      gravity: 0.8,
      scalar: 1.2,
      zIndex: 10000,
    });
  } catch (error) {
    console.warn('Certificate confetti unavailable:', error);
  }
}
