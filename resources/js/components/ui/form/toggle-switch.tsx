import React from "react";

export default function ToggleSwitch({ checked, onChange, label }: any) {
  return (
    <label className="flex items-center cursor-pointer gap-2">
      <div className="relative">
        {/* Hidden native checkbox */}
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />

        {/* Track */}
        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-primary-600 transition-colors"></div>

        {/* Thumb */}
        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
      </div>
      {label && <span className="font-medium text-gray-700">{label}</span>}
    </label>
  );
}
