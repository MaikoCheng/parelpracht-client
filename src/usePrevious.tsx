import { useEffect, useRef } from 'react';

export const usePrevious = <T extends unknown>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  if (ref.current === undefined) return value;
  return ref.current;
};