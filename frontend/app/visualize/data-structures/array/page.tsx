"use client";

import Array from "@/components/array/Array";
import { useArray } from "@/components/array/ArrayContext";
import { Button } from "@/components/ui/button";

export default function ArrayComponent() {
  const {
    itemCount,
    isAnimating,
    pushWithAnimation,
    popWithAnimation,
    shiftWithAnimation,
    unshiftWithAnimation,
  } = useArray();

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-10">
      <div>
        <h1 className="text-2xl font-bold">Array</h1>
      </div>
      <Array />
      <div className="flex flex-row gap-2">
        <Button onClick={() => pushWithAnimation(2)} disabled={isAnimating}>
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
        <Button onClick={() => unshiftWithAnimation(1)} disabled={isAnimating}>
          Unshift
        </Button>
      </div>
    </div>
  );
}
