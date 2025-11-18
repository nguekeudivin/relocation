import { cn } from "@/lib/utils";
import useAppStore from "@/store";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Button } from "./button";

interface SheetFooterProps {
  submit?: any;
  name: string;
  cancelText?: string;
  submitText?: string;
  loading?: boolean;
  render?: any;
  className?: string;
}

interface Props {
  children: React.ReactNode;
  name: string;
  title?: string;
  className?: string;
  header?: React.ReactNode;
  footer?: SheetFooterProps;
  side?: "right" | "left" | "bottom";
  position?: string;
}

export const Sheet = ({
  name,
  children,
  title,
  className,
  header,
  footer,
  side = "right",
  position = "justify-end",
}: Props) => {
  const store = useAppStore();
  const display = store.display;
  const isVisible = display.visible[name];
  const toggleModal = () => display.toggle(name);

  useEffect(() => {
    if (isVisible) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const sideAnimation: any = {
    right: { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" } },
    left: { initial: { x: "-100%" }, animate: { x: 0 }, exit: { x: "-100%" } },
    bottom: { initial: { y: "100%" }, animate: { y: 0 }, exit: { y: "100%" } },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed inset-0 z-50 flex h-screen w-full justify-end bg-black/50",
            position
          )}
          onClick={toggleModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            {...sideAnimation[side]}
            transition={{ duration: 0.3, easing: "ease-out" }}
            className={cn(
              "relative h-full max-h-[100vh] max-w-md bg-white shadow-xl",
              footer && "flex flex-col",
              side === "bottom" && "max-h-[90vh] w-full rounded-t-lg",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <header className="flex-shrink-0 border-b border-gray-200">
              {header ? (
                header
              ) : (
                <div className="relative flex items-center justify-between p-4 md:px-8">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {title}
                  </h3>
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close sheet</span>
                  </button>
                </div>
              )}
            </header>

            {/* Scrollable content */}
            <div
              className={cn(
                "h-full p-4 md:px-8 md:py-6",
                footer && "flex-1 overflow-y-auto"
              )}
            >
              {children}
            </div>

            {/* Fixed footer */}
            {footer && (
              <footer
                className={cn(
                  "flex-shrink-0 border-t border-gray-200 bg-white p-4 md:px-8",
                  footer.className
                )}
              >
                {!footer.render ? (
                  <SheetFooter {...footer} />
                ) : (
                  <>{footer.render}</>
                )}
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SheetFooter = ({
  name,
  submit,
  cancelText = "Cancel",
  submitText = "Confirm",
  loading = false,
}: SheetFooterProps) => {
  const store = useAppStore();
  return (
    <div className="flex items-center justify-start gap-2">
      {cancelText != "" && (
        <Button color="neutral" onClick={() => store.display.hide(name)}>
          {cancelText}
        </Button>
      )}

      <Button onClick={submit} loading={loading}>
        {submitText}
      </Button>
    </div>
  );
};
