import { cn } from '@/lib/utils';

export default function ToggleSwitch({ checked, onChange, labelClass, label, className }: any) {
    return (
        <label className={cn('flex cursor-pointer items-center gap-2', className)}>
            <div className="relative">
                {/* Hidden native checkbox */}
                <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />

                {/* Track */}
                <div className="peer-checked:bg-primary-600 h-6 w-11 rounded-full bg-gray-300 transition-colors"></div>

                {/* Thumb */}
                <div className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white transition-transform peer-checked:translate-x-5"></div>
            </div>
            {label && <span className={cn('text-sm font-medium text-gray-700', labelClass)}>{label}</span>}
        </label>
    );
}
