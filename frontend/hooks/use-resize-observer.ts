import { useEffect, useState, RefObject } from "react";

export function useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T | null>
) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });

    observer.observe(node);

    return () => observer.disconnect();
  }, [ref]);

  return size;
}
