"use client";

import {
  ARRAY_ITEM_GAP,
  ARRAY_ITEM_SIZE,
  HALF_ARRAY_ITEM_GAP,
  HALF_ARRAY_ITEM_SIZE,
} from "@/app/constants/array";
import bubble from "@/lib/algorithms/sorting/bubble";
import _ from "lodash";
import { nanoid } from "nanoid";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrayItem } from "./Array";

interface ArrayContextValue {
  items: ArrayItem[];
  itemCount: number;
  isPushing: boolean;
  isPopping: boolean;
  isShifting: boolean;
  isUnshifting: boolean;
  isAnimating: boolean;
  push: (value: number) => Promise<ArrayItem[]>;
  pushWithAnimation: (value: number) => Promise<ArrayItem[]>;
  handlePushAnimationEnd: () => void;
  pop: () => Promise<ArrayItem | undefined>;
  popWithAnimation: () => Promise<ArrayItem | undefined>;
  handlePopAnimationEnd: () => void;
  shift: () => Promise<ArrayItem | undefined>;
  shiftWithAnimation: () => Promise<ArrayItem | undefined>;
  handleShiftAnimationEnd: () => void;
  unshift: (value: number) => Promise<ArrayItem[]>;
  unshiftWithAnimation: (value: number) => Promise<ArrayItem[]>;
  handleUnshiftAnimationEnd: () => void;
  swap: (firstIndex: number, secondIndex: number) => Promise<ArrayItem[]>;
  swapWithAnimation: (
    firstIndex: number,
    secondIndex: number
  ) => Promise<ArrayItem[]>;
  handleSwapAnimationPreEnd: (idx: number) => void;
  handleSwapAnimationPostEnd: () => void;
  handleCompareAnimationPreEnd: (idx: number) => void;
  handleCompareAnimationPostEnd: () => void;
  bubbleSort: () => void;
}

interface ArrayContextProps extends PropsWithChildren {
  initialItems: number[];
}

const Context = createContext<ArrayContextValue>({
  items: [],
  itemCount: 0,
  isPushing: false,
  isPopping: false,
  isShifting: false,
  isUnshifting: false,
  isAnimating: false,
  push: async () => [],
  pushWithAnimation: async () => [],
  handlePushAnimationEnd: () => {},
  pop: async () => ({
    id: "",
    value: 0,
    isBeingSwapped: false,
    isBeingCompared: false,
    isSorted: false,
  }),
  popWithAnimation: async () => ({
    id: "",
    value: 0,
    isBeingSwapped: false,
    isBeingCompared: false,
    isSorted: false,
  }),
  handlePopAnimationEnd: () => {},
  shift: async () => ({
    id: "",
    value: 0,
    isBeingSwapped: false,
    isBeingCompared: false,
    isSorted: false,
  }),
  shiftWithAnimation: async () => ({
    id: "",
    value: 0,
    isBeingSwapped: false,
    isBeingCompared: false,
    isSorted: false,
  }),
  handleShiftAnimationEnd: () => {},
  unshift: async () => [],
  unshiftWithAnimation: async () => [],
  handleUnshiftAnimationEnd: () => {},
  swap: async () => [],
  swapWithAnimation: async () => [],
  handleSwapAnimationPreEnd: () => {},
  handleSwapAnimationPostEnd: () => {},
  handleCompareAnimationPreEnd: () => {},
  handleCompareAnimationPostEnd: () => {},
  bubbleSort: () => {},
});

export const useArray = () => useContext(Context);

export default function ArrayContext({
  initialItems,
  children,
}: ArrayContextProps) {
  const [items, setItems] = useState(() =>
    initialItems.map<ArrayItem>((item) => ({
      id: nanoid(),
      value: item,
      isBeingSwapped: false,
      isBeingCompared: false,
      isSorted: false,
    }))
  );

  const itemCount = useMemo(() => items.length, [items.length]);

  const [isPushing, setIsPushing] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isShifting, setIsShifting] = useState(false);
  const [isUnshifting, setIsUnshifting] = useState(false);
  const [isBubbleSorting, setIsBubbleSorting] = useState(false);

  const isAnimating = useMemo(
    () =>
      isPushing ||
      isPopping ||
      isShifting ||
      isUnshifting ||
      isBubbleSorting ||
      items.some((item) => item.isBeingSwapped) ||
      items.some((item) => item.isBeingCompared),
    [isPushing, isPopping, isShifting, isUnshifting, isBubbleSorting, items]
  );

  const resolvePopWithAnimationRef =
    useRef<
      (
        value: ArrayItem | PromiseLike<ArrayItem | undefined> | undefined
      ) => void
    >(undefined);

  const resolveShiftWithAnimationRef =
    useRef<
      (
        value: ArrayItem | PromiseLike<ArrayItem | undefined> | undefined
      ) => void
    >(undefined);

  const resolveSwapWithAnimatonRef = useRef<{
    firstIndex: number;
    secondIndex: number;
    fn: (value: ArrayItem[] | PromiseLike<ArrayItem[]>) => void;
  }>(undefined);

  const resolveCompareRef = useRef<{
    firstIndex: number;
    secondIndex: number;
    willSwap: boolean;
    fn: (value: unknown) => void;
  }>(undefined);

  const push = useCallback<ArrayContextValue["push"]>((value) => {
    return new Promise((resolve) => {
      setItems((items) => {
        const newItems = _.cloneDeep(items);
        newItems.push({
          id: nanoid(),
          value,
          isBeingSwapped: false,
          isBeingCompared: false,
          isSorted: false,
        });
        resolve(newItems);
        return newItems;
      });
    });
  }, []);

  const pushWithAnimation = useCallback<ArrayContextValue["pushWithAnimation"]>(
    async (value) => {
      const items = await push(value);
      setIsPushing(true);
      return items;
    },
    [push]
  );

  const handlePushAnimationEnd = useCallback<
    ArrayContextValue["handlePushAnimationEnd"]
  >(() => {
    setIsPushing(false);
  }, []);

  const pop = useCallback<ArrayContextValue["pop"]>(() => {
    return new Promise((resolve) => {
      setItems((items) => {
        const newItems = _.cloneDeep(items);
        resolve(newItems.pop());
        return newItems;
      });
    });
  }, []);

  const popWithAnimation = useCallback<
    ArrayContextValue["popWithAnimation"]
  >(() => {
    setIsPopping(true);
    return new Promise((resolve) => {
      resolvePopWithAnimationRef.current = resolve;
    });
  }, []);

  const handlePopAnimationEnd = useCallback<
    ArrayContextValue["handlePopAnimationEnd"]
  >(async () => {
    const resolve = resolvePopWithAnimationRef.current;

    setIsPopping(false);
    resolvePopWithAnimationRef.current = undefined;

    const poppedItem = await pop();
    resolve?.(poppedItem);
  }, [pop]);

  const shift = useCallback<ArrayContextValue["shift"]>(() => {
    return new Promise((resolve) => {
      setItems((items) => {
        const newItems = _.cloneDeep(items);
        resolve(newItems.shift());
        return newItems;
      });
    });
  }, []);

  const shiftWithAnimation = useCallback<
    ArrayContextValue["shiftWithAnimation"]
  >(() => {
    setIsShifting(true);
    return new Promise((resolve) => {
      resolveShiftWithAnimationRef.current = resolve;
    });
  }, []);

  const handleShiftAnimationEnd = useCallback<
    ArrayContextValue["handleShiftAnimationEnd"]
  >(async () => {
    const resolve = resolveShiftWithAnimationRef.current;

    setIsShifting(false);
    resolveSwapWithAnimatonRef.current = undefined;

    const shiftedItem = await shift();
    resolve?.(shiftedItem);
  }, [shift]);

  const unshift = useCallback<ArrayContextValue["unshift"]>((value) => {
    return new Promise((resolve) => {
      setItems((items) => {
        const newItems = _.cloneDeep(items);
        newItems.unshift({
          id: nanoid(),
          value,
          isBeingSwapped: false,
          isBeingCompared: false,
          isSorted: false,
        });
        resolve(newItems);
        return newItems;
      });
    });
  }, []);

  const unshiftWithAnimation = useCallback<
    ArrayContextValue["unshiftWithAnimation"]
  >(
    async (value) => {
      const items = await unshift(value);
      setIsUnshifting(true);
      return items;
    },
    [unshift]
  );

  const handleUnshiftAnimationEnd = useCallback<
    ArrayContextValue["handleUnshiftAnimationEnd"]
  >(() => {
    setIsUnshifting(false);
  }, []);

  const swap = useCallback<ArrayContextValue["swap"]>(
    (firstIndex, secondIndex) => {
      return new Promise((resolve) => {
        setItems((items) => {
          const newItems = _.cloneDeep(items);

          newItems[firstIndex] = items[secondIndex];
          newItems[firstIndex].isBeingSwapped = false;
          newItems[firstIndex].swapPathData = undefined;

          newItems[secondIndex] = items[firstIndex];
          newItems[secondIndex].isBeingSwapped = false;
          newItems[secondIndex].swapPathData = undefined;

          resolve(newItems);
          return newItems;
        });
      });
    },
    []
  );

  const swapWithAnimation = useCallback<ArrayContextValue["swapWithAnimation"]>(
    (firstIndex, secondIndex) => {
      const o = HALF_ARRAY_ITEM_SIZE;
      const d = Math.abs(firstIndex - secondIndex);

      const yOffset = d === 1 ? HALF_ARRAY_ITEM_SIZE : ARRAY_ITEM_SIZE;
      const yGap = d === 1 ? HALF_ARRAY_ITEM_GAP : ARRAY_ITEM_GAP;

      const x1 =
        (secondIndex - firstIndex) * (ARRAY_ITEM_SIZE + ARRAY_ITEM_GAP) + o;
      const y1 = o - yOffset - yGap;
      const x2 =
        (firstIndex - secondIndex) * (ARRAY_ITEM_SIZE + ARRAY_ITEM_GAP) + o;
      const y2 = o + yOffset + yGap;

      const path1 = `M ${o} ${o} L ${o} ${y1} L ${x1} ${y1} L ${x1} ${o}`;
      const path2 = `M ${o} ${o} L ${o} ${y2} L ${x2} ${y2} L ${x2} ${o}`;

      return new Promise((resolve) => {
        resolveSwapWithAnimatonRef.current = {
          firstIndex,
          secondIndex,
          fn: resolve,
        };

        setItems((items) => {
          const newItems = _.cloneDeep(items);

          // two swapping elements might still be in a comparing state (isBeingCompared=true)
          // this means that `handleCompareAnimationPostEnd` will not run
          // which makes the next animation wait forever as the resolve will never run
          // setting the state to false will proceed to the next animation
          newItems[firstIndex].isBeingCompared = false;
          newItems[secondIndex].isBeingCompared = false;

          newItems[firstIndex].isBeingSwapped = true;
          newItems[firstIndex].swapPathData = path1;

          newItems[secondIndex].isBeingSwapped = true;
          newItems[secondIndex].swapPathData = path2;

          return newItems;
        });
      });
    },
    []
  );

  const handleSwapAnimationPreEnd = useCallback<
    ArrayContextValue["handleSwapAnimationPreEnd"]
  >(
    (idx) => {
      const resolve = resolveSwapWithAnimatonRef.current;

      if (resolve === undefined || resolve.firstIndex !== idx) return;

      swap(resolve.firstIndex, resolve.secondIndex);
    },
    [swap]
  );

  const handleSwapAnimationPostEnd = useCallback<
    ArrayContextValue["handleSwapAnimationPostEnd"]
  >(() => {
    const resolve = resolveSwapWithAnimatonRef.current;
    if (resolve === undefined) return;

    resolveSwapWithAnimatonRef.current = undefined;

    resolve.fn(items);
  }, [items]);

  const compare = useCallback(
    async (firstIndex: number, secondIndex: number, willSwap: boolean) => {
      return new Promise((resolve) => {
        resolveCompareRef.current = {
          firstIndex,
          secondIndex,
          willSwap,
          fn: resolve,
        };

        setItems((items) => {
          const newItems = _.cloneDeep(items);

          newItems[firstIndex].isBeingCompared = true;
          newItems[secondIndex].isBeingCompared = true;

          return newItems;
        });
      });
    },
    []
  );

  const handleCompareAnimationPostEnd = useCallback<
    ArrayContextValue["handleCompareAnimationPostEnd"]
  >(() => {
    const resolve = resolveCompareRef.current;
    resolveCompareRef.current = undefined;
    resolve?.fn(undefined);
  }, []);

  const handleCompareAnimationPreEnd = useCallback<
    ArrayContextValue["handleCompareAnimationPreEnd"]
  >(
    (idx) => {
      const resolve = resolveCompareRef.current;

      if (resolve === undefined || resolve.firstIndex !== idx) return;

      // since both compare and swap states involves highlighting of element
      // we will skip the compare->default animation and
      // immediately proceed to the swapping animation
      // `isBeingCompared` is set to false in `swapWithAnimation`
      if (resolve.willSwap) {
        handleCompareAnimationPostEnd();
        return;
      }

      setItems((items) => {
        const newItems = _.cloneDeep(items);

        newItems[resolve.firstIndex].isBeingCompared = false;
        newItems[resolve.secondIndex].isBeingCompared = false;

        return newItems;
      });
    },
    [handleCompareAnimationPostEnd]
  );

  const bubbleSort = useCallback(async () => {
    if (isBubbleSorting) return;

    setIsBubbleSorting(true);

    const currentItems = _.cloneDeep(items);
    const steps = bubble(currentItems);

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      if (step.action === "swap") {
        await swapWithAnimation(step.firstIndex, step.secondIndex);
        continue;
      }

      await compare(step.firstIndex, step.secondIndex, step.willSwap);
    }

    setIsBubbleSorting(false);
  }, [items, isBubbleSorting, swapWithAnimation, compare]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     compare(0, 1, false);
  //   }, 1000);
  // }, [compare]);

  return (
    <Context
      value={{
        items,
        itemCount,
        isPushing,
        isPopping,
        isShifting,
        isUnshifting,
        isAnimating,
        push,
        pushWithAnimation,
        handlePushAnimationEnd,
        pop,
        popWithAnimation,
        handlePopAnimationEnd,
        shift,
        shiftWithAnimation,
        handleShiftAnimationEnd,
        unshift,
        unshiftWithAnimation,
        handleUnshiftAnimationEnd,
        swap,
        swapWithAnimation,
        handleSwapAnimationPreEnd,
        handleSwapAnimationPostEnd,
        handleCompareAnimationPreEnd,
        handleCompareAnimationPostEnd,
        bubbleSort,
      }}
    >
      {children}
    </Context>
  );
}
