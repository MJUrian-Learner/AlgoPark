"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { Mail, Play } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";

export default function Array() {
  const [array, setArray] = useState<number[]>([12, 58, 51, 21, 34, 10, 15]);
  const [pushedIndex, setPushedIndex] = useState<number | null>(null);
  const [poppedIndex, setPoppedIndex] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePush = () => {
    const value = Math.floor(Math.random() * 90) + 10;
    setArray([...array, value]);
    setPushedIndex(array.length);
    setIsAnimating(true);
  };

  const handlePop = () => {
    if (array.length === 0) return;
    setPoppedIndex(array.length - 1);
    setIsAnimating(true);
    // Wait for exit animation to complete before removing the element
    setTimeout(() => {
      setArray(array.slice(0, -1));
      setPoppedIndex(null);
    }, 500); // Match the animation duration
  };

  return (
    <>
      <div className="flex flex-col items-center justify-between h-full w-full p-10">
        <div>
          <h1 className="text-2xl font-bold">Array</h1>
        </div>
        <div
          className="flex flex-row flex-wrap items-center justify-center gap-2 w-full overflow-hidden"
          style={{ minHeight: 300 }}
        >
          {/* Render the array */}
          <AnimatePresence>
            {array.map((item, index) => {
              const isPushed = pushedIndex === index;
              const isPopped = poppedIndex === index;

              if (isPopped) {
                return (
                  <Box
                    className="p-5 text-2xl"
                    key={index}
                    initial={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={() => setIsAnimating(false)}
                  >
                    {item}
                  </Box>
                );
              }

              if (isPushed) {
                return (
                  <Box
                    className="p-5 text-2xl"
                    key={index}
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    onAnimationComplete={() => setIsAnimating(false)}
                  >
                    {item}
                  </Box>
                );
              }

              return (
                <Box className="p-5 text-2xl" key={index}>
                  {item}
                </Box>
              );
            })}
          </AnimatePresence>
        </div>
        <div>
          <Button onClick={handlePush} disabled={isAnimating}>
            <Play />
          </Button>
          <Button
            onClick={handlePop}
            disabled={isAnimating || array.length === 0}
          >
            <Mail />
          </Button>
        </div>
      </div>
    </>
  );
}
