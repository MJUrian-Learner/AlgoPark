import { cn } from "@/lib/utils";
import React from "react";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Box = ({ children, className, style }: BoxProps) => {
  return (
    <div
      className={cn(
        "bg-accent rounded-md flex items-center justify-center border border-border",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
};

export default Box;
