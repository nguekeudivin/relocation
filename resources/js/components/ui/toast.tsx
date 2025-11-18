import { useDisplay } from "@/hooks/use-display";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { motion } from "motion/react";
import React, { FC, useEffect } from "react";

interface ToastProps {
  message: React.ReactNode;
  name: string;
  className?: string;
  autoClose?: number;
}

export const Toast: FC<ToastProps> = ({
  message,
  name,
  className,
  autoClose = 3000,
}) => {
  const display = useDisplay();

  useEffect(() => {
    if (autoClose && display.visible[name]) {
      const timer = setTimeout(() => {
        display.hide(name);
      }, autoClose);

      return () => clearTimeout(timer);
    }
  }, [display.visible[name]]);

  if (!display.visible[name]) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-8 right-8 z-50 flex items-center gap-2 rounded-md border border-gray-300 bg-white p-4 shadow-lg",
        className
      )}
    >
      <Info className="h-5 w-5 text-blue-500" />
      <div className="text-sm font-medium text-gray-800">{message}</div>
      <button
        onClick={() => display.hide(name)}
        className="ml-auto flex h-6 w-6 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200"
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-3 w-3"
          fill="none"
          viewBox="0 0 14 14"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M1 1l12 12M13 1L1 13" />
        </svg>
      </button>
    </motion.div>
  );
};

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-8 right-8 z-50 flex flex-col gap-2">
      {children}
    </div>
  );
}
