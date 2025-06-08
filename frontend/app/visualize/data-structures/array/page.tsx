"use client";

import React from "react";
import Box from "@/components/box";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export default function Array() {
  const [array, setArray] = useState<number[]>([12, 58, 51, 21, 34, 10, 15]);

  const handlePush = () => {
    setArray([...array, Math.floor(Math.random() * 100)]);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-10">
      <div>
        <h1 className="text-2xl font-bold">Array</h1>
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        {array.map((item, index) => (
          <Box className="p-5 text-2xl" key={index}>
            {item}
          </Box>
        ))}
        <Box className="p-5 text-2xl" style={{ offsetPath: "inset(0 0 0 0)" }}>
          51
        </Box>
      </div>
      <div>
        <Button onClick={handlePush}>
          <Play />
        </Button>
      </div>
    </div>
  );
}
