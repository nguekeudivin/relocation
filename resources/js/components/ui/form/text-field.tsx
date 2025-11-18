import * as React from "react";
import { cn } from "@/lib/utils";
import { AnimatedFieldLabel } from "./field-label";
import { Eye, EyeClosed } from "lucide-react";

interface TextFieldProps extends React.ComponentProps<"input"> {
  label?: string;
  canToggleType?: boolean;
  error?: string | string[];
  leading?: React.ReactNode;
  bgColor?: string;
  floatingClass?: string;
  floating?: boolean;
  inputClass?: string;
}

// Define the MaterialInput component with forwardRef
const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      type,
      placeholder,
      onChange,
      onFocus,
      onBlur,
      value = "",
      label,
      canToggleType = false,
      name,
      error,
      disabled,
      id,
      bgColor = "bg-white",
      floatingClass,
      floating,
      inputClass,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState<boolean>(false);
    const [inputType, setType] = React.useState<any>(
      type == undefined ? "text" : type
    );

    // Determine if the label should be shown
    const shouldShowLabelOnTop =
      isFocused ||
      value !== "" ||
      placeholder != undefined ||
      floating === true;

    const hasError = error != undefined && error != "";
    const generatedId = id ?? `input-${name}`;

    return (
      <div className={cn(bgColor, className)}>
        <div className="relative w-full flex h-10 items-center bg-inherit">
          {/*  When the leading is set. The label is fixed automatically. */}
          {label != undefined && (
            <AnimatedFieldLabel
              htmlFor={id != undefined ? id : `input${name}`}
              label={label}
              move={shouldShowLabelOnTop}
              error={error}
              floatingClassName={floatingClass}
            />
          )}

          {canToggleType && (
            <button
              className="absolute right-3 top-3 text-muted-foreground"
              onClick={() => {
                console.log(inputType == "password" ? "text" : "password");
                setType(inputType == "password" ? "text" : "password");
              }}
            >
              {inputType == "password" ? <EyeClosed /> : <Eye />}
            </button>
          )}

          {/* Input */}
          <input
            {...props}
            id={id != undefined ? id : `input${name}`}
            name={name}
            type={inputType}
            disabled={disabled}
            value={value}
            placeholder={placeholder}
            onChange={(e) => {
              if (onChange) onChange(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              if (onFocus) onFocus(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) onBlur(e);
            }}
            className={cn(
              "h-10 focus:ring-secondary-300 block w-full rounded-lg border border-gray-300 bg-transparent p-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none",
              inputClass,
              {
                "border-red-500 focus:ring-red-500": hasError,
              }
            )}
            ref={ref}
          />
        </div>
        {hasError && (
          <div className="mt-1 text-sm text-red-500">
            {Array.isArray(error) ? (
              <ul>
                {error.map((msg, i) => (
                  <li key={`${generatedId}-error-${i}`}>{msg}</li>
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
);

// Set a display name for better debugging in React DevTools
TextField.displayName = "TextField";

export default TextField;
