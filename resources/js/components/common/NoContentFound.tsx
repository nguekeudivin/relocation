import { ReactNode } from "react";

export default function NoContentFound({ children }: { children: ReactNode }) {
  return (
    <div className="bg-gray-100  rounded-md border border-dashed py-12 flex items-center justify-center">
      {children}
    </div>
  );
}
