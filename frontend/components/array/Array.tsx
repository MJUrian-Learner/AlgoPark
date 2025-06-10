"use client";

import { ARRAY_ITEM_GAP } from "@/app/constants/array";
import { useArray } from "./ArrayContext";
import ArrayItem, { ArrayItemProps } from "./ArrayItem";

export type ArrayItem = Omit<
  ArrayItemProps,
  | "isPushing"
  | "isPopping"
  | "isBeingPopped"
  | "isShifting"
  | "isBeingShifted"
  | "isUnshifting"
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
            isPushing={isPushing}
            isPopping={isPopping}
            isBeingPopped={isPopping && isLastItem}
            isShifting={isShifting}
            isBeingShifted={isShifting && isFirstItem}
            isUnshifting={isUnshifting}
            onPush={onPush}
            onPop={onPop}
            onShift={onShift}
            onUnshift={onUnshift}
          />
        );
      })}
    </div>
  );
}
