"use client";

import Box from "@/components/box";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef } from "react";

// Helper to create the initial state with unique IDs
const initialItems = [12, 58, 51, 21, 34, 10, 15];
const getInitialState = () =>
  initialItems.map((value, index) => ({
    id: index,
    value,
    isComparing: false,
    isSorted: false,
    position: index,
  }));

export default function ArrayComponent() {
  const [array, setArray] = useState(getInitialState());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [swapping, setSwapping] = useState<[number, number] | null>(null);
  const nextId = useRef(initialItems.length);

  const handlePush = () => {
    setIsAnimating(true);
    const newId = nextId.current++;
    const value = Math.floor(Math.random() * 90) + 10;
    setArray((prev) => [
      ...prev,
      {
        id: newId,
        value,
        isComparing: false,
        isSorted: false,
        position: prev.length,
      },
    ]);
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
    setArray((prev) => [
      { id: newId, value, isComparing: false, isSorted: false, position: 0 },
      ...prev.map((item, idx) => ({ ...item, position: idx + 1 })),
    ]);
  };

  const bubbleSort = async () => {
    if (isSorting) return;
    setIsSorting(true);
    setIsAnimating(true);

    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setArray((prev) =>
          prev.map((item, idx) => ({
            ...item,
            isComparing: idx === j || idx === j + 1,
            isSorted: idx >= n - i,
          }))
        );
        setSwapping(null);
        await new Promise((resolve) => setTimeout(resolve, 400));

        if (arr[j].value > arr[j + 1].value) {
          setSwapping([arr[j].id, arr[j + 1].id]);
          await new Promise((resolve) => setTimeout(resolve, 200));
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await new Promise((resolve) => setTimeout(resolve, 300));
          setSwapping(null);
        }
      }
    }

    setArray((prev) =>
      prev.map((item) => ({
        ...item,
        isComparing: false,
        isSorted: true,
      }))
    );
    setSwapping(null);
    setIsSorting(false);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-10">
      <div>
        <h1 className="text-2xl font-bold">Array</h1>
      </div>
      <motion.div
        layout
        transition={{
          layout: {
            type: "spring",
            stiffness: 100,
            damping: 10,
          },
        }}
        className="flex flex-row flex-wrap items-center justify-center gap-2 w-full overflow-hidden h-full"
      >
        <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
          {array.map((item) => {
            let y = 0;
            if (
              swapping &&
              (item.id === swapping[0] || item.id === swapping[1])
            ) {
              y = item.id === swapping[0] ? -30 : 30;
            }
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1, y }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  mass: 1,
                }}
              >
                <Box
                  className={`border border-border shadow-sm transition-colors duration-300 ${
                    item.isComparing
                      ? "bg-blue-500!"
                      : item.isSorted
                      ? "bg-green-500!"
                      : "bg-accent"
                  }`}
                  whileHover={{ scale: 1.15 }}
                >
                  {item.value}
                </Box>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      <div className="flex flex-row gap-2">
        <Button onClick={handlePush} disabled={isAnimating || isSorting}>
          Push
        </Button>
        <Button
          onClick={handlePop}
          disabled={isAnimating || array.length === 0 || isSorting}
        >
          Pop
        </Button>
        <Button
          onClick={handleShift}
          disabled={isAnimating || array.length === 0 || isSorting}
        >
          Shift
        </Button>
        <Button onClick={handleUnshift} disabled={isAnimating || isSorting}>
          Unshift
        </Button>
        <Button
          onClick={bubbleSort}
          disabled={isAnimating || isSorting || array.length === 0}
        >
          Bubble Sort
        </Button>
      </div>
    </div>
  );
}
