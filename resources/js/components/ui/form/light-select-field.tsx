import { ReactNode } from "react";
import Select from "../select";
import { cn } from "@/lib/utils";
import { AnimatedFieldLabel } from "./field-label";

interface LightSelectFieldProps {
  name: string;
  id?: string;
  value: any;
  onChange: (e: any) => void;
  options: { label: string; value: any }[];
  icon?: ReactNode;
  error?: string[] | string;
  className?: string;
  label?: string;
  floating?: boolean;
  floatingClass?: string;
}

export function LightSelectField({
  name,
  value,
  onChange,
  options,
  icon,
  id,
  error,
  className,
  label,
  floating,
  floatingClass,
}: LightSelectFieldProps) {
  const generatedId = id ?? `light-select-${name}`;
  const hasError = !!error && (Array.isArray(error) ? error.length > 0 : true);

  return (
    <div className={cn("relative bg-white", className)}>
      {label && (
        <>
          {floating ? (
            <AnimatedFieldLabel
              htmlFor={id != undefined ? id : `input${name}`}
              label={label}
              move={true}
              error={error}
              floatingClassName={floatingClass}
            />
          ) : (
            <label
              htmlFor={generatedId}
              className="mb-1.5 block text-sm font-medium text-gray-900"
            >
              {label}
            </label>
          )}
        </>
      )}
      <Select.Root
        value={value}
        onChange={(option: any) => {
          onChange({ target: { name, value: option.value } });
        }}
      >
        <Select.Button
          className="w-full"
          prefix={icon}
          label={<Select.Label options={options} />}
        />
        <Select.Content className="w-full">
          {options.map((item: any, index: number) => (
            <Select.Item
              key={`shop_field_option${name}${index}`}
              value={item.value}
            >
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {hasError && (
        <div className="mt-1 pl-1 text-sm text-red-500">
          {Array.isArray(error) ? (
            <ul>
              {error.map((item, index) => (
                <li key={`${generatedId}-error-${index}`}>{item}</li>
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
