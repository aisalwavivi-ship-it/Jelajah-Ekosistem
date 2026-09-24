/**
 * Global Scroll Reset Utility for 🌿 JELAJAH EKOSISTEM
 * 
 * Ensures every scene, mission, and screen transition starts at scrollTop = 0 (top of the page)
 * without interfering with the student's normal scrolling while reading and interacting.
 */

let activeScrollTimeouts: number[] = [];

/**
 * Resets all global page scroll containers to (0, 0) immediately.
 * Does NOT touch internal modal or popup scroll containers.
 */
export function resetGlobalScroll(): void {
  if (typeof window === 'undefined') return;

  // 1. Primary browser window scroll
  try {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, 0);
  }

  // 2. Standard document root elements
  if (document.documentElement && (document.documentElement.scrollTop !== 0 || document.documentElement.scrollLeft !== 0)) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }
  if (document.body && (document.body.scrollTop !== 0 || document.body.scrollLeft !== 0)) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }

  // 3. React root element if holding scroll
  const root = document.getElementById('root');
  if (root && (root.scrollTop !== 0 || root.scrollLeft !== 0)) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  }

  // 4. Main viewport container if holding scroll
  const main = document.querySelector('main');
  if (main && (main.scrollTop !== 0 || main.scrollLeft !== 0)) {
    main.scrollTop = 0;
    main.scrollLeft = 0;
  }

  // 5. Direct root children wrapper if holding scroll
  const rootWrapper = document.querySelector('#root > div') as HTMLElement | null;
  if (rootWrapper && (rootWrapper.scrollTop !== 0 || rootWrapper.scrollLeft !== 0)) {
    rootWrapper.scrollTop = 0;
    rootWrapper.scrollLeft = 0;
  }
}

/**
 * Cancels any pending scroll reset timeouts so the student is never pulled back to the top
 * once they have started actively scrolling or reading.
 */
export function clearPendingScrollResets(): void {
  if (typeof window === 'undefined') return;
  activeScrollTimeouts.forEach((id) => window.clearTimeout(id));
  activeScrollTimeouts = [];
}

/**
 * Triggers a coordinated multi-phase scroll reset during page, mission, or scene transitions.
 * Accounts for Framer Motion exit/entry animations (~320ms in App.tsx) and asynchronous layout shifts,
 * while automatically cancelling future scroll resets as soon as the student manually scrolls.
 */
export function triggerSceneScrollReset(): void {
  if (typeof window === 'undefined') return;

  // Cancel any active transitions from previous scene changes
  clearPendingScrollResets();

  // Phase 1: Instant reset immediately upon state change
  resetGlobalScroll();

  // Phase 2: Reset on the next animation frame (when DOM commits)
  if (typeof window.requestAnimationFrame === 'function') {
    window.requestAnimationFrame(() => {
      resetGlobalScroll();
      // Double rAF to catch next paint after layout calculation
      window.requestAnimationFrame(() => {
        resetGlobalScroll();
      });
    });
  }

  // Phase 3: Staged checkpoints to ensure scroll is at 0 right after Framer Motion mode="wait"
  // (~320ms exit + enter animation)
  const delays = [60, 160, 360];
  delays.forEach((delay) => {
    const id = window.setTimeout(() => {
      resetGlobalScroll();
    }, delay);
    activeScrollTimeouts.push(id);
  });
}

// Global browser listeners for refresh, history navigation, and student interaction
if (typeof window !== 'undefined') {
  // Prevent browser from automatically restoring previous scroll position on reload / navigation
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }

  // Cancel pending transitions immediately if the student actively interacts/scrolls
  const handleUserIntentScroll = () => {
    if (activeScrollTimeouts.length > 0) {
      clearPendingScrollResets();
    }
  };

  window.addEventListener('wheel', handleUserIntentScroll, { passive: true });
  window.addEventListener('touchmove', handleUserIntentScroll, { passive: true });
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Space', 'Home', 'End'].includes(e.code)) {
      handleUserIntentScroll();
    }
  }, { passive: true });

  // On page unload / reload, ensure scroll position is reset to the top
  window.addEventListener('beforeunload', () => {
    resetGlobalScroll();
  });
}
