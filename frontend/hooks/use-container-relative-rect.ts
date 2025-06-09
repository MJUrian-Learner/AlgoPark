import { useEffect, useState, useCallback, RefObject } from "react";

export function useContainerRelativeRect<T extends HTMLElement>(
  elementRef: RefObject<T | null>,
  containerRef: RefObject<T | null>
) {
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const updateRect = useCallback(() => {
    const element = elementRef.current;
    const container = containerRef.current;
    if (!element || !container) return;

    const {
      left: elementLeft,
      top: elementTop,
      width,
      height,
    } = element.getBoundingClientRect();
    const { left: containerLeft, top: containerTop } =
      container.getBoundingClientRect();

    setRect({
      x: elementLeft - containerLeft,
      y: elementTop - containerTop,
      width,
      height,
    });
  }, [elementRef, containerRef]);

  useEffect(() => {
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [updateRect]);

  // Poll for ref changes
  useEffect(() => {
    let prevElement = elementRef.current;
    let prevContainer = containerRef.current;
    const interval = setInterval(() => {
      if (
        elementRef.current !== prevElement ||
        containerRef.current !== prevContainer
      ) {
        prevElement = elementRef.current;
        prevContainer = containerRef.current;
        updateRect();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [elementRef, containerRef, updateRect]);

  return rect;
}
