/**
 * Utility to reliably reset scroll position to the very top of the page
 * when navigating between missions, scenes, or quiz completion.
 *
 * Works across desktop, tablet, and mobile browsers by resetting:
 * 1. window.scrollTo (standard browser viewport)
 * 2. document.documentElement / document.body (HTML/Body elements)
 * 3. App root and main containers (in case flexbox or overflow containers are used)
 */

export function scrollToPageTop(): void {
  if (typeof window === 'undefined') return;

  // 1. Primary browser viewport scroll
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  } catch {
    window.scrollTo(0, 0);
  }

  // 2. Direct document element scrollTop fallback
  if (typeof document !== 'undefined') {
    if (document.documentElement && document.documentElement.scrollTop !== 0) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body && document.body.scrollTop !== 0) {
      document.body.scrollTop = 0;
    }

    // 3. Fallback for potential root or main element scrolling
    const rootEl = document.getElementById('root');
    if (rootEl && rootEl.scrollTop !== 0) {
      rootEl.scrollTop = 0;
    }

    const mainEl = document.querySelector('main');
    if (mainEl && mainEl.scrollTop !== 0) {
      mainEl.scrollTop = 0;
    }

    const appContainer = document.querySelector('.min-h-screen');
    if (appContainer && appContainer.scrollTop !== 0) {
      appContainer.scrollTop = 0;
    }
  }
}

/**
 * Executes a staggered scroll-to-top sequence during scene transitions
 * to account for Framer Motion exit/enter animations and browser layout recalcs,
 * ensuring the destination mission is reliably anchored at the top without
 * persistent interference once the user starts interacting.
 */
export function scheduleSceneScrollReset(): () => void {
  // Immediate reset
  scrollToPageTop();

  // Animation frame reset
  const rafId =
    typeof requestAnimationFrame !== 'undefined'
      ? requestAnimationFrame(() => scrollToPageTop())
      : 0;

  // Short timeout after DOM paint
  const t1 = setTimeout(() => scrollToPageTop(), 50);

  // Medium timeout matching transition enter completion (~320ms duration)
  const t2 = setTimeout(() => scrollToPageTop(), 340);

  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    clearTimeout(t1);
    clearTimeout(t2);
  };
}
