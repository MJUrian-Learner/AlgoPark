import {
  ARRAY_ITEM_SIZE,
  ORIGIN_POINT,
  RIGHT_POINT,
} from "@/app/constants/array";
import { motion, useAnimationControls, Variants } from "framer-motion";
import _ from "lodash";
import { memo, useEffect, useLayoutEffect } from "react";

const ARRAY_ITEM_VARIANTS: Variants = {
  nonexistent: {
    opacity: 0,
    scale: 0.8,
  },
  default: {
    backgroundColor: "#fffbeb",
    opacity: 1,
    scale: 1,
  },
  pushing: {
    offsetPath: ORIGIN_POINT,
    offsetDistance: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  popping: {
    offsetPath: RIGHT_POINT,
    offsetDistance: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  swapping: {
    backgroundColor: "#fcd34d",
    scale: 1.1,
    transition: {
      offsetDistance: {
        type: "tween",
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  },
  highlight: { backgroundColor: "#fcd34d", scale: 1.1 },
  sorted: { backgroundColor: "#34d399", scale: 1 },
};

export interface ArrayItemProps {
  index: number;
  value: number;
  isPushing: boolean;
  isPopping: boolean;
  isBeingPopped: boolean;
  isSwapping: boolean;
  isHighlighted: boolean;
  isSorted: boolean;
  pathData?: string;
  onPush?: () => void;
  onPop?: () => void;
  onPopFinish?: () => void;
}

export default memo(function ArrayItem({
  isPushing,
  isPopping,
  isBeingPopped,
  isSwapping,
  isHighlighted,
  isSorted,
  pathData,
  onPush,
  onPop,
  onPopFinish,
  ...item
}: ArrayItemProps) {
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    if (isPushing) {
      controls.set({
        offsetPath: RIGHT_POINT,
        offsetDistance: "0%",
      });
      controls.start("pushing").then(() => {
        controls.set({
          offsetPath: ORIGIN_POINT,
          offsetDistance: "0%",
        });
        onPush?.();
      });
    } else if (isPopping) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
      controls.start("popping").then(() => {});

      if (isBeingPopped) {
        controls.start("nonexistent").then(() => {
          onPop?.();
        });
      }
    } else if (isSwapping && pathData) {
      controls.start({
        ...ARRAY_ITEM_VARIANTS.swapping,
        offsetPath: `path("${pathData}")`,
        offsetDistance: "100%",
      });
    } else if (isHighlighted) {
      controls.start("highlight");
    } else if (isSorted) {
      controls.start("sorted");
    } else {
      controls.start("default");
    }
  }, [
    isPushing,
    isPopping,
    isBeingPopped,
    isSwapping,
    isHighlighted,
    isSorted,
    pathData,
    onPush,
    onPop,
    onPopFinish,
    controls,
  ]);

  useEffect(() => {
    if (!isPopping) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
    }
  }, [controls, isPopping]);

  return (
    <motion.div
      style={{
        width: ARRAY_ITEM_SIZE,
        height: ARRAY_ITEM_SIZE,
        zIndex: isHighlighted || isSwapping ? 1 : 0,
        offsetRotate: "0deg",
        offsetPath: ORIGIN_POINT,
      }}
      variants={ARRAY_ITEM_VARIANTS}
      initial="nonexistent"
      exit="nonexistent"
      animate={controls}
      transition={{
        type: "spring",
        duration: 0.3,
        scale: { type: "spring", bounce: 0.615 },
        opacity: { type: "tween", duration: 0.2, ease: "easeInOut" },
        backgroundColor: { type: "tween", duration: 0.2, ease: "easeInOut" },
      }}
      className="grid place-items-center rounded-sm"
    >
      {item.value}
    </motion.div>
  );
},
_.isEqual);
