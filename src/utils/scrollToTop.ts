/**
 * Global Scroll Reset Utility for Jelajah Ekosistem
 * 
 * Ensures that whenever a student transitions between scenes, missions,
 * challenges, or main application views, the destination view opens
 * from the very top (scroll position = 0).
 * 
 * Features:
 * 1. Resets window scroll instantly (top: 0, left: 0).
 * 2. Resets documentElement, body, and container wrappers (e.g., #root, <main>).
 * 3. Does NOT lock or continuously force scroll during reading/activities.
 * 4. Multi-frame & layout-settle pass to prevent Framer Motion exit animation
 *    height collapse from restoring unwanted scroll offsets.
 * 5. Configures browser history scrollRestoration to 'manual' on load.
 */

export function scrollToPageTop() {
  if (typeof window === 'undefined') return;

  // 1. Primary browser window scroll reset (instant, no smooth lag)
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  } catch {
    window.scrollTo(0, 0);
  }

  // 2. Direct document-level element scroll reset
  if (document.documentElement && (document.documentElement.scrollTop !== 0 || document.documentElement.scrollLeft !== 0)) {
    document.documentElement.scrollTop = 0;
    document.documentElement.scrollLeft = 0;
  }

  if (document.body && (document.body.scrollTop !== 0 || document.body.scrollLeft !== 0)) {
    document.body.scrollTop = 0;
    document.body.scrollLeft = 0;
  }

  // 3. Application root & main content wrappers if any have internal scroll offsets
  const rootEl = document.getElementById('root');
  if (rootEl && rootEl.scrollTop !== 0) {
    rootEl.scrollTop = 0;
  }

  const mainEl = document.querySelector('main');
  if (mainEl && mainEl.scrollTop !== 0) {
    mainEl.scrollTop = 0;
  }

  const openingEl = document.getElementById('game-opening-screen');
  if (openingEl && openingEl.scrollTop !== 0) {
    openingEl.scrollTop = 0;
  }
}

/**
 * Multi-phase scroll reset tailored for React + Framer Motion scene transitions:
 * - Immediate: Resets scroll at the moment state changes.
 * - Next Animation Frame: Catches DOM mutation.
 * - After Exit Animation (50ms & 340ms): Catches new scene mounting and layout stabilization.
 * Does not keep running afterwards, so user can freely scroll up and down.
 */
export function triggerSceneScrollReset(): () => void {
  scrollToPageTop();

  let rafId: number | null = null;
  if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
    rafId = window.requestAnimationFrame(() => {
      scrollToPageTop();
    });
  }

  const timer1 = setTimeout(() => {
    scrollToPageTop();
  }, 50);

  const timer2 = setTimeout(() => {
    scrollToPageTop();
  }, 350);

  return () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    clearTimeout(timer1);
    clearTimeout(timer2);
  };
}

/**
 * Initializes browser scroll restoration configuration to manual.
 * Prevents browser refresh from jumping to previous scroll position.
 */
export function initScrollRestoration() {
  if (typeof window === 'undefined') return;

  if ('scrollRestoration' in window.history) {
    try {
      window.history.scrollRestoration = 'manual';
    } catch {
      // ignore
    }
  }

  // Ensure scroll is at 0 on initial page load / refresh
  scrollToPageTop();

  // Reset before unload so reloads start clean
  window.addEventListener('beforeunload', () => {
    scrollToPageTop();
  });
}
