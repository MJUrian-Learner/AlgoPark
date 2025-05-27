"use client";

import { AppSidebar } from "@/components/app-sidebar";
import Box from "@/components/Box";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useState, useRef } from "react";
import { Reorder } from "motion/react";
import React from "react";

export default function Page() {
  const [items, setItems] = useState(
    Array.from({ length: 10 }, (_, i) => i + 1)
  );
  const [isSorting, setIsSorting] = useState(false);
  const [compareIndices, setCompareIndices] = useState([-1, -1]);
  const [swapIndices, setSwapIndices] = useState([-1, -1]);
  const [justSwapped, setJustSwapped] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  // Helper to clear timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleRandomize = () => {
    if (isSorting) return;
    setItems((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleBubbleSort = () => {
    if (isSorting) return;
    const arr = [...items];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    setItems(arr);
  };

  // Step-by-step bubble sort visualization
  const handleVisualizeBubbleSort = () => {
    if (isSorting) return;
    setIsSorting(true);
    const arr = [...items];
    let i = 0;
    let j = 0;
    let swapped = false;
    function step() {
      setJustSwapped(false);
      setSwapIndices([-1, -1]);
      if (i < arr.length - 1) {
        if (j === 0) swapped = false;
        if (j < arr.length - i - 1) {
          setCompareIndices([j, j + 1]);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setItems([...arr]);
            swapped = true;
            setSwapIndices([j, j + 1]);
            setJustSwapped(true);
            timeoutRef.current = setTimeout(step, 700) as unknown as number;
            return;
          }
          j++;
          timeoutRef.current = setTimeout(step, 500) as unknown as number;
        } else {
          if (!swapped) {
            setCompareIndices([-1, -1]);
            setIsSorting(false);
            return;
          }
          j = 0;
          i++;
          timeoutRef.current = setTimeout(step, 500) as unknown as number;
        }
      } else {
        setCompareIndices([-1, -1]);
        setIsSorting(false);
      }
    }
    step();
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-full flex-col gap-4">
          <div className="flex gap-2 mb-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              onClick={handleRandomize}
              disabled={isSorting}
            >
              Randomize Order
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              onClick={handleBubbleSort}
              disabled={isSorting}
            >
              Bubble Sort
            </button>
            <button
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
              onClick={handleVisualizeBubbleSort}
              disabled={isSorting}
            >
              Visualize Bubble Sort
            </button>
          </div>
          {/* Pointer arrows above compared boxes */}
          <div className="flex flex-row gap-1 h-8">
            {items.map((_, idx) => (
              <div
                key={idx}
                className="w-24 flex flex-col items-center justify-end"
              >
                {compareIndices.includes(idx) ? (
                  <>
                    <span className="text-xs font-bold">Pointer</span>
                    <span className="text-2xl">↓</span>
                  </>
                ) : (
                  <span className="h-7"></span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-1">
            <Reorder.Group
              axis="x"
              values={items}
              onReorder={setItems}
              className="flex flex-row gap-1 "
            >
              {items.map((item) => (
                <Reorder.Item
                  key={item}
                  value={item}
                  style={{ listStyle: "none" }}
                >
                  <Box className=" w-24 h-24">{item}</Box>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
          {/* Curved arrow below swapped boxes */}
          <div className="flex flex-row gap-1 h-8">
            {items.map((_, idx) => (
              <div key={idx} className="w-24 flex items-center justify-center">
                {justSwapped && swapIndices.includes(idx) ? (
                  swapIndices[0] === idx ? (
                    <svg width="48" height="24" viewBox="0 0 48 24">
                      <path
                        d="M4 4 Q24 32 44 4"
                        stroke="#f59e42"
                        strokeWidth="3"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                      />
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="6"
                          markerHeight="6"
                          refX="3"
                          refY="3"
                          orient="auto"
                        >
                          <polygon points="0 0, 6 3, 0 6" fill="#f59e42" />
                        </marker>
                      </defs>
                    </svg>
                  ) : null
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
