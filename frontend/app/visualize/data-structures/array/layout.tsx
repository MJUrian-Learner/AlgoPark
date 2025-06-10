import ArrayContext from "@/components/array/ArrayContext";
import { PropsWithChildren } from "react";

const initialItems = [12, 58, 51, 21, 34, 10, 15];

export default function ArrayLayout({ children }: PropsWithChildren) {
  return <ArrayContext initialItems={initialItems}>{children}</ArrayContext>;
}
