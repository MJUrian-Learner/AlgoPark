"use client";

import { ARRAY_ITEM_GAP } from "@/app/constants/array";
import { useArray } from "./ArrayContext";
import ArrayItem, { ArrayItemProps } from "./ArrayItem";

export type ArrayItem = Omit<
  ArrayItemProps,
  "isPushing" | "isPopping" | "isBeingPopped" | "onPush" | "onPop"
>;

export default function Array() {
  const { items, isPushing, isPopping, onPushAnimationEnd, onPopAnimationEnd } =
    useArray();

  return (
    <div style={{ display: "flex", gap: ARRAY_ITEM_GAP }}>
      {items.map((item, idx) => {
        const isLastItem = idx === items.length - 1;
        const onPush = isLastItem && isPushing ? onPushAnimationEnd : undefined;
        const onPop = isLastItem && isPopping ? onPopAnimationEnd : undefined;

        return (
          <ArrayItem
            key={idx}
            {...item}
            isPushing={isPushing}
            isPopping={isPopping}
            isBeingPopped={isPopping && isLastItem}
            onPush={onPush}
            onPop={onPop}
          />
        );
      })}
    </div>
  );
}
