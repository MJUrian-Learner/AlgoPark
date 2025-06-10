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
import { ArrayItem } from "./Array";

interface ArrayContextValue {
  items: ArrayItem[];
  itemCount: number;
  isPushing: boolean;
  isPopping: boolean;
  isAnimating: boolean;
  push: (value: number, cb?: (arrayItems: ArrayItem[]) => void) => void;
  pushWithAnimation: (
    value: number,
    cb?: (arrayItems: ArrayItem[]) => void
  ) => void;
  onPushAnimationEnd: () => void;
  pop: (cb?: () => void) => void;
  popWithAnimation: (cb?: () => void) => void;
  onPopAnimationEnd: () => void;
  shift: () => void;
  unshift: () => void;
}

interface ArrayContextProps extends PropsWithChildren {
  initialItems: number[];
}

const Context = createContext<ArrayContextValue>({
  items: [],
  itemCount: 0,
  isPushing: false,
  isPopping: false,
  isAnimating: false,
  push: () => {},
  pushWithAnimation: () => {},
  onPushAnimationEnd: () => {},
  pop: () => {},
  popWithAnimation: () => {},
  onPopAnimationEnd: () => {},
  shift: () => {},
  unshift: () => {},
});

export const useArray = () => useContext(Context);

export default function ArrayContext({
  initialItems,
  children,
}: ArrayContextProps) {
  const [items, setItems] = useState(() =>
    initialItems.map<ArrayItem>((item, idx) => ({
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

  const isAnimating = useMemo(
    () => isPushing || isPopping,
    [isPushing, isPopping]
  );

  const pushCbRef = useRef<((arrayItems: ArrayItem[]) => void) | undefined>(
    undefined
  );
  const popCbRef = useRef<(() => void) | undefined>(undefined);

  const push = useCallback<ArrayContextValue["push"]>((value, cb) => {
    pushCbRef.current = cb;
    setItems((items) => {
      const newItems = _.cloneDeep(items);
      newItems.push({
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
      push(value, (arrayItems) => {
        cb?.(arrayItems);
        setIsPushing(true);
      });
    },
    [push]
  );

  const onPushAnimationEnd = useCallback<
    ArrayContextValue["onPushAnimationEnd"]
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

  const onPopAnimationEnd = useCallback<
    ArrayContextValue["onPopAnimationEnd"]
  >(() => {
    pop(popCbRef.current);
    setIsPopping(false);
  }, [pop]);

  const shift = useCallback<ArrayContextValue["shift"]>(() => {}, []);

  const unshift = useCallback<ArrayContextValue["unshift"]>(() => {}, []);

  useLayoutEffect(() => {
    if (itemCount === previousItemCount) return;

    if (itemCount > previousItemCount) {
      pushCbRef.current?.(items);
      pushCbRef.current = undefined;
      return;
    }

    popCbRef.current?.();
  }, [items, itemCount, previousItemCount]);

  return (
    <Context
      value={{
        items,
        itemCount,
        isPushing,
        isPopping,
        isAnimating,
        push,
        pushWithAnimation,
        onPushAnimationEnd,
        pop,
        popWithAnimation,
        onPopAnimationEnd,
        shift,
        unshift,
      }}
    >
      {children}
    </Context>
  );
}
