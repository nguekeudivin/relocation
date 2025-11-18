import { useDisplay } from "@/hooks/use-display";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface BlocksProps {
  items: Record<string, ReactNode>;
  base?: string;
  className?: string;
}

export const Blocks = ({ items, base, className }: BlocksProps) => {
  const display = useDisplay();
  const [current, setCurrent] = useState<string>("");
  const [hasChecked, setHasChecked] = useState<boolean>(false);

  useEffect(() => {
    if (!hasChecked) return;
    const displayedNames = Object.keys(display.visible).filter(
      (item) => display.visible[item]
    );
    const blocksNames = Object.keys(items);
    const candidatesNames = blocksNames.filter((item) =>
      displayedNames.includes(item)
    );
    if (candidatesNames.length != 0) {
      setCurrent(candidatesNames[candidatesNames.length - 1]);
    } else {
      if (candidatesNames.length == 0 && base) {
        setCurrent(base);
      }
    }
  }, [display.visible]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const blockParam = params.get("block");
    if (blockParam && items[blockParam]) {
      display.show(blockParam);
    } else {
      display.show(base as string);
    }
    setHasChecked(true);
  }, []);

  useEffect(() => {
    if (!current) return;
    const params = new URLSearchParams(window.location.search);
    params.set("block", current);
    // Check if there is url data
    if (display.data[current]) {
      const urlData = display.data[current].url;
      if (urlData) {
        Object.keys(urlData).map((item) => {
          params.set(item, urlData[item]);
        });
      }
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [current]);

  return <div className={cn(className)}>{items[current]}</div>;
};

interface BlockProps {
  closeText?: string;
  name?: string;
  children: ReactNode;
  className?: string;
  mainClass?: string;
  defaultClose?: boolean;
  prefix?: React.ReactNode;
  surfix?: React.ReactNode;
}

export const Block = ({
  name,
  children,
  className,
  mainClass,
  defaultClose = true,
  prefix,
  surfix,
  closeText = "Back",
}: BlockProps) => {
  const display = useDisplay();
  return (
    <>
      <div className={cn("flex items-center justify-between py-1", mainClass)}>
        {prefix ? (
          <>{prefix}</>
        ) : (
          <>
            {defaultClose && (
              <button
                type="button"
                onClick={() => display.hide(name as string)}
                className="py-2 inline-flex gap-2 items-center justify-center rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:text-gray-900 hover:underline font-semibold"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="">{closeText}</span>
              </button>
            )}
          </>
        )}
        {surfix && <>{surfix}</>}
      </div>
      <div className={cn("rounded-md", className)}>{children}</div>
    </>
  );
};
