import { cn } from "@/lib/utils";
import React from "react";

interface CheckboxesFieldProps {
  name?: string;
  label?: string;
  options: any[];
  onCheckedChange: (item: any, checked: boolean) => void;
  error?: string | string[];
  className?: string;
  optionClassName?: string;
  optionsClassName?: string;
  values: (string | number)[];
  labelClass?: string;
}

export function CheckboxesField({
  label,
  options,
  name,
  onCheckedChange,
  error,
  className,
  values,
  labelClass,
  optionsClassName,
}: CheckboxesFieldProps) {
  const hasError = Boolean(
    error && (Array.isArray(error) ? error.length > 0 : error.length)
  );

  return (
    <div className={cn("mt-4 flex flex-col", className)}>
      {label && (
        <span
          className={cn(
            "mb-2 block text-base font-medium text-gray-900",
            labelClass
          )}
          id={`${name}-label`}
        >
          {label}
        </span>
      )}

      <div
        className={cn("space-y-2", optionsClassName)}
        role="group"
        aria-labelledby={label ? `${name}-label` : undefined}
      >
        {options.map(({ label: optionLabel, value, description }, index) => {
          const checkboxId = `${name}-option${index}`;
          const isChecked = values.includes(value);

          return (
            <div key={checkboxId} className="flex items-start space-x-2">
              <div className="flex justify-center item-center">
                <input
                  id={checkboxId}
                  type="checkbox"
                  name={name}
                  checked={isChecked}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onCheckedChange(
                      { label: optionLabel, value, description },
                      e.target.checked
                    )
                  }
                  className={cn(
                    "h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:border-primary-500 focus:ring-primary-500"
                  )}
                  aria-describedby={
                    description ? `${checkboxId}-desc` : undefined
                  }
                />
              </div>

              <div className="-mt-1 flex flex-col justify-start">
                <label
                  htmlFor={checkboxId}
                  className="cursor-pointer font-medium select-none"
                >
                  {optionLabel}
                </label>
                {description && (
                  <p
                    id={`${checkboxId}-desc`}
                    className="text-sm font-normal text-gray-600"
                  >
                    {description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {hasError && (
        <div className="pl-1 text-red-500" role="alert">
          {Array.isArray(error) ? (
            <ul>
              {error.map((item, index) => (
                <li key={`input${name}error${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <span>{error}</span>
          )}
        </div>
      )}
    </div>
  );
}
