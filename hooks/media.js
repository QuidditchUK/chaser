import { useState, useEffect } from 'react';
import { throttle } from 'throttle-debounce';

export function useBreakpoint(size, { speed } = { speed: 100 }) {
  const [matches, setMatches] = useState();

  const calculatedSize = parseInt(size, 10);

  useEffect(() => {
    setMatches(window.innerWidth >= calculatedSize * 16);

    const mediaQuery = window.matchMedia(`(min-width: ${calculatedSize}rem)`);

    const onToggle = throttle(1000 / speed, ({ matches: nextMatches }) => {
      setMatches(nextMatches);
    });

    mediaQuery.addListener(onToggle);

    return () => mediaQuery.removeListener(onToggle);
  }, [size, speed, calculatedSize]);

  return matches;
}
