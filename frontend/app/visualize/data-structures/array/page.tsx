"use client";

import Array from "@/components/array/Array";
import { useArray } from "@/components/array/ArrayContext";
import { Button } from "@/components/ui/button";
import { getRandomNumber } from "@/lib/utils";

export default function ArrayComponent() {
  const {
    itemCount,
    isAnimating,
    pushWithAnimation,
    popWithAnimation,
    shiftWithAnimation,
    unshiftWithAnimation,
    bubbleSort,
  } = useArray();

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-10">
      <div>
        <h1 className="text-2xl font-bold">Array</h1>
      </div>
      <Array />
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => pushWithAnimation(getRandomNumber(0, 100))}
          disabled={isAnimating}
        >
          Push
        </Button>
        <Button
          onClick={() => popWithAnimation()}
          disabled={itemCount === 0 || isAnimating}
        >
          Pop
        </Button>
        <Button
          onClick={() => shiftWithAnimation()}
          disabled={itemCount === 0 || isAnimating}
        >
          Shift
        </Button>
        <Button
          onClick={() => unshiftWithAnimation(getRandomNumber(0, 100))}
          disabled={isAnimating}
        >
          Unshift
        </Button>
        <Button onClick={() => bubbleSort()} disabled={isAnimating}>
          Bubble sort
        </Button>
      </div>
    </div>
  );
}
