import { Package } from "lucide-react";

export default function DataPlaceholder() {
  return (
    <div className="h-full mt-2  flex items-center justify-center border-gray-300 border-1 border-dashed">
      <div>
        <div className="text-center mx-auto">
          <Package className="mx-auto w-8 h-8 text-gray-600" />
        </div>
        <div className="text-center text-gray-600 mt-2">No data available</div>
      </div>
    </div>
  );
}
