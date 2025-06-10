"use client";

import usePrevious from "@/hooks/use-previous";
import _ from "lodash";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { nanoid } from "nanoid";
import { ArrayItem } from "./Array";

interface ArrayContextValue {
  items: ArrayItem[];
  itemCount: number;
  isPushing: boolean;
  isPopping: boolean;
  isShifting: boolean;
  isUnshifting: boolean;
  isAnimating: boolean;
  push: (value: number, cb?: (items: ArrayItem[]) => void) => void;
  pushWithAnimation: (value: number, cb?: (items: ArrayItem[]) => void) => void;
  handlePushAnimationEnd: () => void;
  pop: (cb?: () => void) => void;
  popWithAnimation: (cb?: () => void) => void;
  handlePopAnimationEnd: () => void;
  shift: (cb?: () => void) => void;
  shiftWithAnimation: (cb?: () => void) => void;
  handleShiftAnimationEnd: () => void;
  unshift: (value: number, cb?: (items: ArrayItem[]) => void) => void;
  unshiftWithAnimation: (
    value: number,
    cb?: (items: ArrayItem[]) => void
  ) => void;
  handleUnshiftAnimationEnd: () => void;
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
  push: () => {},
  pushWithAnimation: () => {},
  handlePushAnimationEnd: () => {},
  pop: () => {},
  popWithAnimation: () => {},
  handlePopAnimationEnd: () => {},
  shift: () => {},
  shiftWithAnimation: () => {},
  handleShiftAnimationEnd: () => {},
  unshift: () => {},
  unshiftWithAnimation: () => {},
  handleUnshiftAnimationEnd: () => {},
});

export const useArray = () => useContext(Context);

export default function ArrayContext({
  initialItems,
  children,
}: ArrayContextProps) {
  const [items, setItems] = useState(() =>
    initialItems.map<ArrayItem>((item, idx) => ({
      id: nanoid(),
      index: idx,
      value: item,
      isSwapping: false,
      isHighlighted: false,
      isSorted: false,
    }))
  );

  const itemCount = useMemo(() => items.length, [items.length]);
  const previousItemCount = usePrevious(itemCount, 0);

  const [isPushing, setIsPushing] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isShifting, setIsShifting] = useState(false);
  const [isUnshifting, setIsUnshifting] = useState(false);

  const isAnimating = useMemo(
    () => isPushing || isPopping || isShifting || isUnshifting,
    [isPushing, isPopping, isShifting, isUnshifting]
  );

  const pushCbRef = useRef<((items: ArrayItem[]) => void) | undefined>(
    undefined
  );
  const popCbRef = useRef<(() => void) | undefined>(undefined);
  const shiftCbRef = useRef<(() => void) | undefined>(undefined);
  const unshiftCbRef = useRef<((items: ArrayItem[]) => void) | undefined>(
    undefined
  );

  const push = useCallback<ArrayContextValue["push"]>((value, cb) => {
    pushCbRef.current = cb;
    setItems((items) => {
      const newItems = _.cloneDeep(items);
      newItems.push({
        id: nanoid(),
        index: items.length,
        value,
        isSwapping: false,
        isHighlighted: false,
        isSorted: false,
      });
      return newItems;
    });
  }, []);

  const pushWithAnimation = useCallback<ArrayContextValue["pushWithAnimation"]>(
    (value, cb) => {
      push(value, (items) => {
        cb?.(items);
        setIsPushing(true);
      });
    },
    [push]
  );

  const handlePushAnimationEnd = useCallback<
    ArrayContextValue["handlePushAnimationEnd"]
  >(() => {
    setIsPushing(false);
  }, []);

  const pop = useCallback<ArrayContextValue["pop"]>((cb) => {
    popCbRef.current = cb;
    setItems((items) => {
      const newItems = _.cloneDeep(items);
      newItems.pop();
      return newItems;
    });
  }, []);

  const popWithAnimation = useCallback<ArrayContextValue["popWithAnimation"]>(
    (cb) => {
      popCbRef.current = cb;
      setIsPopping(true);
    },
    []
  );

  const handlePopAnimationEnd = useCallback<
    ArrayContextValue["handlePopAnimationEnd"]
  >(() => {
    pop(popCbRef.current);
    setIsPopping(false);
  }, [pop]);

  const shift = useCallback<ArrayContextValue["shift"]>((cb) => {
    shiftCbRef.current = cb;
    setItems((items) => {
      const newItems = _.cloneDeep(items);
      newItems.shift();
      return newItems;
    });
  }, []);

  const shiftWithAnimation = useCallback<
    ArrayContextValue["shiftWithAnimation"]
  >((cb) => {
    shiftCbRef.current = cb;
    setIsShifting(true);
  }, []);

  const handleShiftAnimationEnd = useCallback<
    ArrayContextValue["handleShiftAnimationEnd"]
  >(() => {
    shift(shiftCbRef.current);
    setIsShifting(false);
  }, [shift]);

  const unshift = useCallback<ArrayContextValue["unshift"]>((value, cb) => {
    unshiftCbRef.current = cb;
    setItems((items) => {
      const newItems = _.cloneDeep(items);
      newItems.unshift({
        id: nanoid(),
        index: items.length,
        value,
        isSwapping: false,
        isHighlighted: false,
        isSorted: false,
      });
      return newItems;
    });
  }, []);

  const unshiftWithAnimation = useCallback<
    ArrayContextValue["unshiftWithAnimation"]
  >(
    (value, cb) => {
      unshift(value, (items) => {
        cb?.(items);
        setIsUnshifting(true);
      });
    },
    [unshift]
  );

  const handleUnshiftAnimationEnd = useCallback<
    ArrayContextValue["handleUnshiftAnimationEnd"]
  >(() => {
    setIsUnshifting(false);
  }, []);

  useLayoutEffect(() => {
    if (itemCount === previousItemCount) return;

    if (itemCount > previousItemCount) {
      // pushCbRef and unshiftCbRef might be both present
      // if push and unshift is somehow used simultaenously
      // this might cause bugs in the future

      if (pushCbRef.current !== undefined) {
        pushCbRef.current(items);
        pushCbRef.current = undefined;
      }

      if (unshiftCbRef.current !== undefined) {
        unshiftCbRef.current(items);
        unshiftCbRef.current = undefined;
      }

      return;
    }

    if (popCbRef.current !== undefined) {
      popCbRef.current();
      popCbRef.current = undefined;
    }

    if (shiftCbRef.current !== undefined) {
      shiftCbRef.current();
      shiftCbRef.current = undefined;
    }
  }, [items, itemCount, previousItemCount]);

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
      }}
    >
      {children}
    </Context>
  );
}
