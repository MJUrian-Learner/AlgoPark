import makePoint from "@/utils/makePoint";

export const ARRAY_ITEM_SIZE = 60;
export const ARRAY_ITEM_GAP = 12;

export const HALF_ARRAY_ITEM_SIZE = ARRAY_ITEM_SIZE / 2;
export const HALF_ARRAY_ITEM_GAP = ARRAY_ITEM_GAP / 2;

export const ORIGIN_POINT = makePoint(HALF_ARRAY_ITEM_SIZE);
export const RIGHT_POINT = makePoint(
  ARRAY_ITEM_SIZE + HALF_ARRAY_ITEM_GAP,
  HALF_ARRAY_ITEM_SIZE
);
export const LEFT_POINT = makePoint(-HALF_ARRAY_ITEM_GAP, HALF_ARRAY_ITEM_SIZE);
