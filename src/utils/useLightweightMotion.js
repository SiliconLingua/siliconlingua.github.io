import { useSyncExternalStore } from 'react';
import { LIGHTWEIGHT_MOTION_QUERY, prefersLightweightMotion } from './motionProfile';

function subscribe(callback) {
  const query = window.matchMedia(LIGHTWEIGHT_MOTION_QUERY);
  const connection = window.navigator.connection;
  query.addEventListener('change', callback);
  connection?.addEventListener('change', callback);
  return () => {
    query.removeEventListener('change', callback);
    connection?.removeEventListener('change', callback);
  };
}

export default function useLightweightMotion() {
  return useSyncExternalStore(subscribe, prefersLightweightMotion, () => true);
}
