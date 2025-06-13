export type BubbleStep =
  | {
      action: "compare";
      firstIndex: number;
      secondIndex: number;
      willSwap: boolean;
    }
  | { action: "swap"; firstIndex: number; secondIndex: number };

export default function bubble(items: { value: number }[]) {
  const steps: BubbleStep[] = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length - i - 1; j++) {
      const firstIndex = j;
      const secondIndex = j + 1;
      const firstItem = items[firstIndex];
      const secondItem = items[secondIndex];
      const willSwap = firstItem.value > secondItem.value;

      steps.push({
        action: "compare",
        firstIndex,
        secondIndex,
        willSwap,
      });

      if (willSwap) {
        steps.push({
          action: "swap",
          firstIndex,
          secondIndex,
        });

        items[firstIndex] = secondItem;
        items[secondIndex] = firstItem;
      }
    }
  }

  return steps;
}
