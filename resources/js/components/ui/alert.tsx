import { useDisplay } from "@/hooks/use-display";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { FC, useEffect } from "react";

interface AlertProps {
  message: React.ReactNode;
  name: string;
  className?: string;
  autoClose?: number;
}

export const Alert: FC<AlertProps> = ({
  message,
  name,
  className,
  autoClose,
}) => {
  const display = useDisplay();

  useEffect(() => {
    if (autoClose) {
      if (display.visible[name]) {
        setTimeout(() => {
          display.hide(name);
        }, autoClose);
      }
    }
  }, [display.visible]);

  if (display.visible[name]) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}
        id="alert-border-1"
        className={cn(
          "mb-4 flex border-t-4 border-blue-300 bg-blue-50 p-4 text-blue-800",
          className
        )}
        role="alert"
      >
        {/* <Info className="w-4 h-4" /> */}
        <div className="ms-3 text-sm font-medium">{message}</div>
        <button
          onClick={() => {
            display.hide(name);
          }}
          type="button"
          className="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 p-1.5 text-blue-500 hover:bg-blue-200 focus:ring-2 focus:ring-blue-400"
          data-dismiss-target="#alert-border-1"
          aria-label="Close"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            className="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </motion.div>
    );
  } else {
    return undefined;
  }
};
