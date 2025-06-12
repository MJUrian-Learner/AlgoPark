"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

// Helper to create the initial state with unique IDs
const initialItems = [12, 58, 51, 21, 34, 10, 15];
const getInitialState = () =>
  initialItems.map((value, index) => ({
    id: index,
    value,
  }));

export default function ArrayComponent() {
  // 1. State now holds objects with a unique `id` and a `value`
  const [array, setArray] = useState(getInitialState());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // 2. Use a ref to generate unique IDs that persist across re-renders
  const nextId = useRef(initialItems.length);

  const handlePush = () => {
    setIsAnimating(true);
    const newId = nextId.current++;
    const value = Math.floor(Math.random() * 90) + 10;
    setArray((prev) => [...prev, { id: newId, value }]);
  };

  const handlePop = () => {
    if (array.length === 0) return;
    setIsAnimating(true);
    setArray((prev) => prev.slice(0, -1));
  };

  const handleShift = () => {
    if (array.length === 0) return;
    setIsAnimating(true);
    setArray((prev) => prev.slice(1));
  };

  const handleUnshift = () => {
    setIsAnimating(true);
    const newId = nextId.current++;
    const value = Math.floor(Math.random() * 90) + 10;
    setArray((prev) => [{ id: newId, value }, ...prev]);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-10">
      <div>
        <h1 className="text-2xl font-bold">Array</h1>
      </div>
      <div className="flex flex-row flex-wrap items-center justify-center gap-2 w-full overflow-hidden p-2">
        {/*
          4. Use onExitComplete on AnimatePresence. This is a more robust way
             to know when all "exit" animations are done.
        */}
        <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
          {array.map((item) => (
            <Box
              // 3. Use the stable and unique `item.id` as the key
              key={item.id}
              className="bg-accent border border-border shadow-sm"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              // onAnimationComplete for enter animations
              onAnimationComplete={() => {
                // This will fire for every box on load and for new boxes entering
                // Setting it to false here works well for push/unshift
                setIsAnimating(false);
              }}
              whileHover={{ scale: 1.15 }}
            >
              {item.value}
            </Box>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex flex-row gap-2">
        <Button onClick={handlePush} disabled={isAnimating}>
          Push
        </Button>
        <Button
          onClick={handlePop}
          disabled={isAnimating || array.length === 0}
        >
          Pop
        </Button>
        <Button
          onClick={handleShift}
          disabled={isAnimating || array.length === 0}
        >
          Shift
        </Button>
        <Button onClick={handleUnshift} disabled={isAnimating}>
          Unshift
        </Button>
      </div>
    </div>
  );
}
