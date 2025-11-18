import { Eye, Pencil, Trash2 } from "lucide-react";

export default function TableActions<T>({
  item,
  onView,
  onEdit,
  onDelete,
}: {
  item: any;
  resourceName?: string;
  onView?: any;
  onEdit?: any;
  onDelete?: any;
}) {
  return (
    <div className="flex gap-4">
      {onView && (
        <button
          onClick={() => onView?.(item)}
          className="text-teal-600 hover:text-teal-800"
          title="Details"
        >
          <Eye size={18} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit?.(item)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Pencil size={18} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => onDelete?.(item)}
          className="text-gray-600 hover:text-gray-800"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
