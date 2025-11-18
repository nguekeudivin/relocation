import { cn } from "@/lib/utils";
import { FileUp, X } from "lucide-react";
import { ReactNode } from "react";
import FileIcon from "@/components/ui/file-icon";

export interface FileValue {
  file: File;
  url: string;
}

export interface FileFieldProps {
  file?: FileValue | undefined;
  onFileChange: (file: FileValue | undefined) => void;
  id: string;
  error?: string | string[];
  className?: string;
  name: string;
  placeholder?: ReactNode;
  label?: string;
  labelClass?: string;
}

export function FileField({
  file,
  onFileChange,
  id,
  error,
  className,
  name,
  placeholder,
  label,
  labelClass,
}: FileFieldProps) {
  const upload = (event: any) => {
    const file = event.target.files[0];
    // reach theme
    if (file) {
      onFileChange({ file, url: "" });
    }
  };

  const hasError = !!error && (Array.isArray(error) ? error.length > 0 : true);

  const generatedId = id ?? `input-${name}`;

  return (
    <div>
      {label && (
        <label
          htmlFor={generatedId}
          className={cn(
            "mb-1.5 block text-sm font-medium text-gray-900",
            labelClass
          )}
        >
          {label}
        </label>
      )}

      <label
        htmlFor={id}
        className={cn(
          "relative flex w-full flex-col items-center justify-center rounded-xl border border-gray-300 bg-gray-100 bg-cover bg-center p-4",
          className,
          {
            "border-red-500": hasError,
          }
        )}
      >
        {file == undefined ? (
          <>
            {placeholder ? (
              <>{placeholder}</>
            ) : (
              <>
                <FileUp className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-gray-600 text-sm font-medium">
                  Drop or click to select file
                </span>
              </>
            )}
          </>
        ) : (
          <label
            htmlFor={id}
            className="h-full w-full text-sm hover:bg-gray-200/30"
          >
            <div className="flex items-center gap-2">
              <div>
                <FileIcon name={file.file.name} />
              </div>
              <div>
                <p>{file.file.name}</p>
                <p>{file.file.size}</p>
              </div>
            </div>
            <button
              onClick={(e: any) => {
                e.preventDefault();
                onFileChange(undefined);
              }}
              className="absolute top-2 right-2 rounded-full bg-gray-900/60 p-0.5 text-white transition-all duration-300 ease-in-out hover:bg-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          </label>
        )}
      </label>

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

      <input
        type="file"
        multiple={true}
        id={id}
        className="hidden"
        name={id}
        onChange={upload}
      />
    </div>
  );
}
