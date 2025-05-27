import { cn } from "@/lib/utils";
import React from "react";

interface BoxProps {
  children: React.ReactNode;
  className?: string;
}

const Box = ({ children, className }: BoxProps) => {
  return (
    <div
      className={cn(
        "bg-muted/50 rounded-md flex items-center justify-center border border-border",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
