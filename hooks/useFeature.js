import { useMemo } from 'react';

const useFeature = (feature) => useMemo(() => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem(feature);
  }
  return false;
}, [feature]);

export default useFeature;
