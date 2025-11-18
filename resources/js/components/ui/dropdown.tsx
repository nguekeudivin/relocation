"use client";

import { cn } from "@/lib/utils";
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  ReactNode,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
  FloatingPortal,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
} from "@floating-ui/react";

interface DropdownContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  refs: any;
  floatingStyles: React.CSSProperties;
  getReferenceProps: any;
  getFloatingProps: any;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("useDropdown must be used inside <Dropdown.Root>");
  return ctx;
};

const DropdownMenu = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-end", // start below and right-aligned
    middleware: [offset(6), flip(), shift()],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  return (
    <DropdownContext.Provider
      value={{
        open,
        setOpen,
        refs,
        floatingStyles,
        getReferenceProps,
        getFloatingProps,
      }}
    >
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
};

const Trigger = ({ children }: { children: ReactNode }) => {
  const { refs, getReferenceProps } = useDropdown();
  return (
    <div
      ref={refs.setReference}
      {...getReferenceProps()}
      className="cursor-pointer"
    >
      {children}
    </div>
  );
};

const Content = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open, refs, floatingStyles, getFloatingProps } = useDropdown();

  if (!open) return null;

  return (
    <FloatingPortal>
      <ul
        ref={refs.setFloating}
        style={floatingStyles}
        {...getFloatingProps()}
        className={cn(
          "z-50 min-w-[10rem] divide-y divide-gray-100 rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 transition-all",
          className
        )}
      >
        {children}
      </ul>
    </FloatingPortal>
  );
};

const Item = ({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  const { setOpen } = useDropdown();
  return (
    <li
      onClick={() => {
        onClick?.();
        setOpen(false);
      }}
      className={cn(
        "flex items-center gap-2 cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
        className
      )}
    >
      {children}
    </li>
  );
};

const Dropdown = {
  Root: DropdownMenu,
  Trigger,
  Content,
  Item,
};

export default Dropdown;
