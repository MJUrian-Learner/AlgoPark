import {
  ARRAY_ITEM_SIZE,
  LEFT_POINT,
  ORIGIN_POINT,
  RIGHT_POINT,
} from "@/app/constants/array";
import usePrevious from "@/hooks/use-previous";
import { motion, useAnimationControls, Variants } from "framer-motion";
import _ from "lodash";
import { memo, useCallback, useEffect } from "react";

const ARRAY_ITEM_VARIANTS: Variants = {
  nonexistent: {
    opacity: 0,
    scale: 0.8,
  },
  default: {
    offsetPath: ORIGIN_POINT,
    offsetDistance: "0%",
    backgroundColor: "#fffbeb",
    opacity: 1,
    scale: 1,
    transition: {
      offsetPath: { duration: 0 },
      offsetDistance: { duration: 0 },
    },
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
    offsetDistance: "100%",
    backgroundColor: "#fcd34d",
    scale: 1.05,
    transition: {
      offsetDistance: {
        type: "tween",
        duration: 0.8,
        ease: [0.8, 0.4, 0.3, 1],
      },
    },
  },
  compare: {
    backgroundColor: "#fcd34d",
    scale: 1.05,
  },
  sorted: { backgroundColor: "#34d399", scale: 1 },
};

export interface ArrayItemProps {
  id: string;
  index: number;
  value: number;
  isArrayPushing: boolean;
  isArrayPopping: boolean;
  isBeingPopped: boolean;
  isArrayShifting: boolean;
  isBeingShifted: boolean;
  isArrayUnshifting: boolean;
  isBeingSwapped: boolean;
  isBeingCompared: boolean;
  isSorted: boolean;
  swapPathData?: string;
  onPush?: () => void;
  onPop?: () => void;
  onShift?: () => void;
  onUnshift?: () => void;
  onSwapPreEnd?: (idx: number) => void;
  onSwapPostEnd?: () => void;
  onComparePreEnd?: (idx: number) => void;
  onComparePostEnd?: () => void;
  ref?: React.Ref<HTMLDivElement>;
}

export default memo(function ArrayItem({
  isArrayPushing,
  isArrayPopping,
  isBeingPopped,
  isArrayShifting,
  isBeingShifted,
  isArrayUnshifting,
  isBeingSwapped,
  isBeingCompared,
  isSorted,
  swapPathData,
  onPush,
  onPop,
  onShift,
  onUnshift,
  onSwapPreEnd,
  onSwapPostEnd,
  onComparePreEnd,
  onComparePostEnd,
  ref,
  ...item
}: ArrayItemProps) {
  const isBeingSwappedPreviously = usePrevious(isBeingSwapped, false);
  const isBeingComparedPreviously = usePrevious(isBeingCompared, false);

  const controls = useAnimationControls();

  const resetPoint = useCallback(
    (offsetPath: string = ORIGIN_POINT) => {
      controls.set({
        offsetPath,
        offsetDistance: "0%",
      });
    },
    [controls]
  );

  useEffect(() => {
    if (isArrayPushing) {
      resetPoint(RIGHT_POINT);
      controls.start("pushing").then(onPush);
      return;
    }

    if (isArrayPopping) {
      resetPoint();
      controls.start("popping");

      if (isBeingPopped) {
        controls.start("nonexistent").then(onPop);
      }

      return;
    }

    if (isArrayShifting) {
      resetPoint();
      controls.start("shifting");

      if (isBeingShifted) {
        controls.start("nonexistent").then(onShift);
      }

      return;
    }

    if (isArrayUnshifting) {
      resetPoint(LEFT_POINT);
      controls.start("unshifting").then(onUnshift);
      return;
    }

    if (isBeingSwapped && swapPathData) {
      controls
        .start({
          ...ARRAY_ITEM_VARIANTS.swapping,
          offsetPath: `path("${swapPathData}")`,
        })
        .then(() => onSwapPreEnd?.(item.index));
      return;
    }

    if (isBeingCompared) {
      controls.start("compare").then(() => onComparePreEnd?.(item.index));
      return;
    }

    if (isSorted) {
      controls.start("sorted");
      return;
    }

    controls.start("default").then(() => {
      if (isBeingSwappedPreviously) {
        onSwapPostEnd?.();
      } else if (isBeingComparedPreviously) {
        onComparePostEnd?.();
      }
    });
  }, [
    isArrayPushing,
    isArrayPopping,
    isBeingPopped,
    isArrayShifting,
    isBeingShifted,
    isArrayUnshifting,
    isBeingSwapped,
    isBeingCompared,
    isSorted,
    swapPathData,
    onPush,
    onPop,
    onShift,
    onUnshift,
    onSwapPreEnd,
    onSwapPostEnd,
    onComparePreEnd,
    onComparePostEnd,
    item.index,
    isBeingSwappedPreviously,
    isBeingComparedPreviously,
    controls,
    resetPoint,
  ]);

  return (
    <motion.div
      ref={ref}
      style={{
        width: ARRAY_ITEM_SIZE,
        height: ARRAY_ITEM_SIZE,
        zIndex: isBeingCompared || isBeingSwapped ? 1 : 0,
        offsetRotate: "0deg",
      }}
      variants={ARRAY_ITEM_VARIANTS}
      initial="nonexistent"
      exit="nonexistent"
      animate={controls}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        opacity: { type: "tween", duration: 0.2, ease: "easeInOut" },
        backgroundColor: { type: "tween", duration: 0.2, ease: "easeInOut" },
      }}
      className="grid place-items-center rounded-sm text-sm font-medium"
    >
      {item.value}
    </motion.div>
  );
},
_.isEqual);
