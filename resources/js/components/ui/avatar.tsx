import { cn } from "@/lib/utils";

// 26 colors for A-Z
const letterColors = [
  "#F44336",
  "#E91E63",
  "#9C27B0",
  "#673AB7",
  "#3F51B5",
  "#2196F3",
  "#03A9F4",
  "#00BCD4",
  "#009688",
  "#4CAF50",
  "#8BC34A",
  "#CDDC39",
  "#FFEB3B",
  "#FFC107",
  "#FF9800",
  "#FF5722",
  "#795548",
  "#9E9E9E",
  "#607D8B",
  "#F06292",
  "#BA68C8",
  "#64B5F6",
  "#4DD0E1",
  "#81C784",
  "#DCE775",
  "#FFD54F",
];

export default function Avatar({
  name,
  url,
  className,
}: {
  name: string;
  url: string | undefined;
  className?: string;
}) {
  if (!url) {
    // Get first letter
    const firstLetter = name ? name[0]?.toUpperCase() || "A" : "A";
    // Map A-Z to 0-25
    const charCode = firstLetter.charCodeAt(0);
    const index = charCode >= 65 && charCode <= 90 ? charCode - 65 : 0;
    const bgColor = letterColors[index];

    return (
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-full text-white",
          className
        )}
        style={{ backgroundColor: bgColor }}
      >
        <span>{firstLetter}</span>
      </div>
    );
  } else {
    return (
      <div
        className={cn("h-12 w-12 rounded-full bg-cover bg-center", className)}
        style={{ backgroundImage: `url(${url})` }}
      ></div>
    );
  }
}
