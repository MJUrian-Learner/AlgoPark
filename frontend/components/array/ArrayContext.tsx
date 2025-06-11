"use client";

import _ from "lodash";
import { nanoid } from "nanoid";
import {
  createContext,
  PropsWithChildren,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrayItem } from "./Array";
import {
  ARRAY_ITEM_GAP,
  ARRAY_ITEM_SIZE,
  HALF_ARRAY_ITEM_SIZE,
} from "@/app/constants/array";

interface ArrayContextValue {
  items: ArrayItem[];
  itemRefs: RefObject<{
    container: HTMLDivElement | null;
    [key: string]: HTMLDivElement | null;
  }>;
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
  handleSwapAnimationEnd: () => void;
  bubbleSort: () => void;
}

interface ArrayContextProps extends PropsWithChildren {
  initialItems: number[];
}

const Context = createContext<ArrayContextValue>({
  items: [],
  itemRefs: { current: { container: null } },
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
    isSwapping: false,
    isHighlighted: false,
    isSorted: false,
  }),
  popWithAnimation: async () => ({
    id: "",
    value: 0,
    isSwapping: false,
    isHighlighted: false,
    isSorted: false,
  }),
  handlePopAnimationEnd: () => {},
  shift: async () => ({
    id: "",
    value: 0,
    isSwapping: false,
    isHighlighted: false,
    isSorted: false,
  }),
  shiftWithAnimation: async () => ({
    id: "",
    value: 0,
    isSwapping: false,
    isHighlighted: false,
    isSorted: false,
  }),
  handleShiftAnimationEnd: () => {},
  unshift: async () => [],
  unshiftWithAnimation: async () => [],
  handleUnshiftAnimationEnd: () => {},
  swap: async () => [],
  swapWithAnimation: async () => [],
  handleSwapAnimationEnd: () => {},
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
      isSwapping: false,
      isHighlighted: false,
      isSorted: false,
    }))
  );

  const itemRefs = useRef<ArrayContextValue["itemRefs"]["current"]>({
    container: null,
  });

  const itemCount = useMemo(() => items.length, [items.length]);

  const [isPushing, setIsPushing] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isShifting, setIsShifting] = useState(false);
  const [isUnshifting, setIsUnshifting] = useState(false);

  const isAnimating = useMemo(
    () =>
      isPushing ||
      isPopping ||
      isShifting ||
      isUnshifting ||
      items.some((item) => item.isSwapping),
    [isPushing, isPopping, isShifting, isUnshifting, items]
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
    arguments: Parameters<ArrayContextValue["swap"]>;
    fn: (value: ArrayItem[] | PromiseLike<ArrayItem[]>) => void;
  }>(undefined);

  const push = useCallback<ArrayContextValue["push"]>((value) => {
    return new Promise((resolve) => {
      setItems((items) => {
        const newItems = _.cloneDeep(items);
        newItems.push({
          id: nanoid(),
          value,
          isSwapping: false,
          isHighlighted: false,
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
    setIsPopping(false);

    const poppedItem = await pop();
    resolvePopWithAnimationRef.current?.(poppedItem);
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
    setIsShifting(false);

    const shiftedItem = await shift();
    resolveShiftWithAnimationRef.current?.(shiftedItem);
  }, [shift]);

  const unshift = useCallback<ArrayContextValue["unshift"]>((value) => {
    return new Promise((resolve) => {
      setItems((items) => {
        const newItems = _.cloneDeep(items);
        newItems.unshift({
          id: nanoid(),
          value,
          isSwapping: false,
          isHighlighted: false,
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
          newItems[firstIndex].isSwapping = false;
          newItems[firstIndex].swapPathData = undefined;

          newItems[secondIndex] = items[firstIndex];
          newItems[secondIndex].isSwapping = false;
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
      const x1 =
        (secondIndex - firstIndex) * (ARRAY_ITEM_SIZE + ARRAY_ITEM_GAP) + o;
      const x2 =
        (firstIndex - secondIndex) * (ARRAY_ITEM_SIZE + ARRAY_ITEM_GAP) + o;

      const path1 = `M ${o} ${o} L ${o} ${
        o - yOffset - ARRAY_ITEM_GAP
      } L ${x1} ${o - yOffset - ARRAY_ITEM_GAP} L ${x1} ${o}`;

      const path2 = `M ${o} ${o} L ${o} ${
        o + yOffset + ARRAY_ITEM_GAP
      } L ${x2} ${o + yOffset + ARRAY_ITEM_GAP} L ${x2} ${o}`;

      return new Promise((resolve) => {
        resolveSwapWithAnimatonRef.current = {
          arguments: [firstIndex, secondIndex],
          fn: resolve,
        };

        setItems((items) => {
          const newItems = _.cloneDeep(items);

          newItems[firstIndex].isSwapping = true;
          newItems[firstIndex].swapPathData = path1;

          newItems[secondIndex].isSwapping = true;
          newItems[secondIndex].swapPathData = path2;

          return newItems;
        });
      });
    },
    []
  );

  const handleSwapAnimationEnd = useCallback<
    ArrayContextValue["handleSwapAnimationEnd"]
  >(() => {
    const resolve = resolveSwapWithAnimatonRef.current;
    if (resolve === undefined) return;

    resolveSwapWithAnimatonRef.current = undefined;

    const firstIndex = resolve.arguments[0];
    const secondIndex = resolve.arguments[1];

    swap(firstIndex, secondIndex).then((items) => {
      resolve.fn(items);
    });
  }, [swap]);

  const bubbleSort = useCallback<ArrayContextValue["bubbleSort"]>(() => {
    // TODO: Implement bubble sort
  }, []);

  useEffect(() => {
    setTimeout(() => {
      swapWithAnimation(1, 2).then(() => {
        swapWithAnimation(2, 3).then(() => {
          swapWithAnimation(3, 4).then(() => {
            swapWithAnimation(4, 5).then(() => {
              swapWithAnimation(5, 6).then(() => {
                swapWithAnimation(0, 6).then(() => {});
              });
            });
          });
        });
      });
    }, 1000);
  }, [swapWithAnimation]);

  return (
    <Context
      value={{
        items,
        itemRefs,
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
        handleSwapAnimationEnd,
        bubbleSort,
      }}
    >
      {children}
    </Context>
  );
}
