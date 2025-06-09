"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { useContainerRelativeRect } from "@/hooks/use-container-relative-rect";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { animate, motion, useMotionValue } from "framer-motion";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Array() {
  const [array, setArray] = useState<number[]>([12, 58, 51, 21, 34, 10, 15]);
  const [pathD, setPathD] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingValue, setPendingValue] = useState<number | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const lastBoxRef = useRef<HTMLDivElement>(null);

  const size = useResizeObserver<HTMLDivElement>(canvasRef);
  const lastBoxRect = useContainerRelativeRect(lastBoxRef, canvasRef);

  // Calculate path when dependencies change
  useEffect(() => {
    if (!lastBoxRect) return;

    const startX = size.width / 2;
    const startY = size.height - size.height * 0.1;
    const endX = lastBoxRect.x + lastBoxRect.width / 2 + lastBoxRect.width + 8;
    const endY = lastBoxRect.y + lastBoxRect.height / 2;

    // Example control points
    const c1x = startX + startX * 0.3,
      c1y = startY - startY * 0.5;
    const c2x = endX - endX * 0.01,
      c2y = endY + endY * 1.5;

    setPathD(
      `M${startX},${startY} C${c1x},${c1y} ${c2x},${c2y} ${endX},${endY}`
    );
  }, [lastBoxRect, size, array]);

  // Framer Motion value for progress along the path
  const progress = useMotionValue(0);

  // Animate the floating box along the path
  useEffect(() => {
    if (isAnimating) {
      progress.set(0);
      const controls = animate(progress, 1, {
        duration: 1.5,
        ease: [0.4, 0, 0.2, 1],
        onComplete: () => {
          if (pendingValue !== null) {
            setArray((prev) => [...prev, pendingValue]);
            setPendingValue(null);
            setIsAnimating(false);
          }
        },
      });
      return () => controls.stop();
    }
    // eslint-disable-next-line
  }, [isAnimating]);

  const handlePush = () => {
    if (isAnimating) return; // Prevent multiple animations
    const value = Math.floor(Math.random() * 100);
    setPendingValue(value);
    setIsAnimating(true);
  };

  // Calculate the box size for the animated box
  const boxWidth = lastBoxRect?.width || 56; // fallback to 56px
  const boxHeight = lastBoxRect?.height || 56;

  // Get the current position along the path for the animated box
  const [xy, setXY] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (!isAnimating || !pathD) return;
    const pathElem = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    pathElem.setAttribute("d", pathD);
    const totalLength = pathElem.getTotalLength();

    const unsubscribe = progress.on("change", (t) => {
      const point = pathElem.getPointAtLength(t * totalLength);
      setXY({ x: point.x - boxWidth / 2, y: point.y - boxHeight / 2 });
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [isAnimating, pathD, boxWidth, boxHeight]);

  return (
    <>
      <div className="flex flex-col items-center justify-between h-full w-full p-10">
        <div>
          <h1 className="text-2xl font-bold">Array</h1>
        </div>
        <div
          ref={canvasRef}
          className="relative border border-red-500 flex flex-row items-center justify-center gap-2 w-full h-8/12 overflow-hidden"
          style={{ minHeight: 300 }}
        >
          {/* Render the animated box above the SVG and array */}
          {isAnimating && (
            <motion.div
              style={{
                position: "absolute",
                left: xy.x,
                top: xy.y,
                width: boxWidth,
                height: boxHeight,
                zIndex: 20,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box className="p-5 text-2xl">{pendingValue}</Box>
            </motion.div>
          )}
          {/* SVG Path for reference */}
          {/* <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
            <path ref={pathRef} d={pathD} stroke="black" fill="none" />
          </svg> */}
          {/* Render the array */}
          {array.map((item, index) => (
            <Box
              className="p-5 text-2xl"
              key={index}
              ref={index === array.length - 1 ? lastBoxRef : null}
            >
              {item}
            </Box>
          ))}
        </div>
        <div>
          <Button onClick={handlePush} disabled={isAnimating}>
            <Play />
          </Button>
        </div>
      </div>
    </>
  );
}
