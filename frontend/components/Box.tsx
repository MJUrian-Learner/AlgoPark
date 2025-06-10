import { cn } from "@/lib/utils";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface BoxProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Box = ({ children, className, style, ...props }: BoxProps) => {
  return (
    <motion.div
      className={cn(
        "p-4 rounded-lg flex items-center justify-center",
        className
      )}
      style={style}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Box;
