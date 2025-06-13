"use client";

import { ARRAY_ITEM_GAP } from "@/app/constants/array";
import { useArray } from "./ArrayContext";
import ArrayItem, { ArrayItemProps } from "./ArrayItem";

export type ArrayItem = Omit<
  ArrayItemProps,
  | "index"
  | "isArrayPushing"
  | "isArrayPopping"
  | "isBeingPopped"
  | "isArrayShifting"
  | "isBeingShifted"
  | "isArrayUnshifting"
  | "onPush"
  | "onPop"
  | "onShift"
  | "onUnshift"
>;

export default function Array() {
  const {
    items,
    isPushing,
    isPopping,
    isShifting,
    isUnshifting,
    handlePushAnimationEnd,
    handlePopAnimationEnd,
    handleShiftAnimationEnd,
    handleUnshiftAnimationEnd,
    handleSwapAnimationPreEnd,
    handleSwapAnimationPostEnd,
    handleCompareAnimationPreEnd,
    handleCompareAnimationPostEnd,
  } = useArray();

  return (
    <div style={{ display: "flex", gap: ARRAY_ITEM_GAP }}>
      {items.map((item, idx) => {
        const isFirstItem = idx == 0;
        const isLastItem = idx === items.length - 1;

        const onPush =
          isLastItem && isPushing ? handlePushAnimationEnd : undefined;
        const onPop =
          isLastItem && isPopping ? handlePopAnimationEnd : undefined;

        const onShift =
          isFirstItem && isShifting ? handleShiftAnimationEnd : undefined;
        const onUnshift =
          isFirstItem && isUnshifting ? handleUnshiftAnimationEnd : undefined;

        return (
          <ArrayItem
            key={item.id}
            {...item}
            index={idx}
            isArrayPushing={isPushing}
            isArrayPopping={isPopping}
            isBeingPopped={isPopping && isLastItem}
            isArrayShifting={isShifting}
            isBeingShifted={isShifting && isFirstItem}
            isArrayUnshifting={isUnshifting}
            onPush={onPush}
            onPop={onPop}
            onShift={onShift}
            onUnshift={onUnshift}
            onSwapPreEnd={handleSwapAnimationPreEnd}
            onSwapPostEnd={handleSwapAnimationPostEnd}
            onComparePreEnd={handleCompareAnimationPreEnd}
            onComparePostEnd={handleCompareAnimationPostEnd}
          />
        );
      })}
    </div>
  );
}
