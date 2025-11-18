import {
  ArrowLeftRight,
  ClipboardList,
  Edit,
  Ellipsis,
  RotateCcw,
  Trash2,
  Undo2,
  UndoDot,
} from "lucide-react";
import Dropdown from "../ui/dropdown";

export default function DropdownExample() {
  return (
    <>
      <div className="relative">
        <Dropdown.Root>
          <Dropdown.Trigger>
            <button className="flex items-center justify-center rounded-md  p-2 hover:bg-gray-100">
              <Ellipsis className="h-4 w-4 text-gray-600" />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item className="flex items-center gap-2">
              <Edit className="h-4 w-4 text-gray-700" />
              Edit
            </Dropdown.Item>

            <Dropdown.Item className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-gray-700" />
              Reajust
            </Dropdown.Item>

            <Dropdown.Item className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-gray-700" />
              Register Order
            </Dropdown.Item>

            <Dropdown.Item className="flex items-center gap-2">
              <ArrowLeftRight className="h-4 w-4 text-gray-700" />
              Transfer
            </Dropdown.Item>

            <Dropdown.Item className="flex items-center gap-2">
              <Undo2 className="h-4 w-4 text-gray-700" />
              Make Sale Return
            </Dropdown.Item>

            <Dropdown.Item className="flex items-center gap-2">
              <UndoDot className="h-4 w-4 text-gray-700" />
              Make Supply Return
            </Dropdown.Item>
            <Dropdown.Item className="flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-red-500" />
              Delete
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    </>
  );
}
