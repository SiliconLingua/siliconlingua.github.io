import { useSyncExternalStore } from 'react';
import { REDUCED_MOTION_QUERY, prefersReducedMotion } from './motionProfile';

function subscribe(callback) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', callback);
  return () => {
    query.removeEventListener('change', callback);
  };
}

export default function useReducedMotionProfile() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => true);
}
