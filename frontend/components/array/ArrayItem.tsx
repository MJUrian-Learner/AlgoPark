import {
  ARRAY_ITEM_SIZE,
  LEFT_POINT,
  ORIGIN_POINT,
  RIGHT_POINT,
} from "@/app/constants/array";
import { motion, useAnimationControls, Variants } from "framer-motion";
import _ from "lodash";
import { memo, useEffect } from "react";

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
  shifting: {
    offsetPath: LEFT_POINT,
    offsetDistance: "100%",
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
  unshifting: {
    offsetPath: ORIGIN_POINT,
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
        ease: [0.8, 0.4, 0.3, 1],
      },
    },
  },
  highlight: { backgroundColor: "#fcd34d", scale: 1.1 },
  sorted: { backgroundColor: "#34d399", scale: 1 },
};

export interface ArrayItemProps {
  id: string;
  index: number;
  value: number;
  isPushing: boolean;
  isPopping: boolean;
  isBeingPopped: boolean;
  isShifting: boolean;
  isBeingShifted: boolean;
  isUnshifting: boolean;
  isSwapping: boolean;
  isHighlighted: boolean;
  isSorted: boolean;
  swapPathData?: string;
  onPush?: () => void;
  onPop?: () => void;
  onShift?: () => void;
  onUnshift?: () => void;
  onSwap?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

export default memo(function ArrayItem({
  isPushing,
  isPopping,
  isBeingPopped,
  isShifting,
  isBeingShifted,
  isUnshifting,
  isSwapping,
  isHighlighted,
  isSorted,
  swapPathData,
  onPush,
  onPop,
  onShift,
  onUnshift,
  onSwap,
  ref,
  ...item
}: ArrayItemProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (isPushing) {
      controls.set({
        offsetPath: RIGHT_POINT,
        offsetDistance: "0%",
      });
      controls.start("pushing").then(() => {
        onPush?.();
      });
    } else if (isPopping) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
      controls.start("popping");

      if (isBeingPopped) {
        controls.start("nonexistent").then(() => {
          onPop?.();
        });
      }
    } else if (isShifting) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
      controls.start("shifting");

      if (isBeingShifted) {
        controls.start("nonexistent").then(() => {
          onShift?.();
        });
      }
    } else if (isUnshifting) {
      controls.set({
        offsetPath: LEFT_POINT,
        offsetDistance: "0%",
      });
      controls.start("unshifting").then(() => {
        onUnshift?.();
      });
    } else if (isSwapping && swapPathData) {
      controls
        .start({
          ...ARRAY_ITEM_VARIANTS.swapping,
          offsetPath: `path("${swapPathData}")`,
          offsetDistance: "100%",
        })
        .then(() => {
          onSwap?.();
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
    isShifting,
    isBeingShifted,
    isUnshifting,
    isSwapping,
    isHighlighted,
    isSorted,
    swapPathData,
    onPush,
    onPop,
    onShift,
    onUnshift,
    onSwap,
    controls,
  ]);

  useEffect(() => {
    if (!isPushing) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
    }
  }, [controls, isPushing]);

  useEffect(() => {
    if (!isPopping) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
    }
  }, [controls, isPopping]);

  useEffect(() => {
    if (!isShifting) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
    }
  }, [controls, isShifting]);

  useEffect(() => {
    if (!isUnshifting) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
    }
  }, [controls, isUnshifting]);

  useEffect(() => {
    if (!isSwapping) {
      controls.set({
        offsetPath: ORIGIN_POINT,
        offsetDistance: "0%",
      });
    }
  }, [controls, isSwapping]);

  return (
    <motion.div
      ref={ref}
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
