import { cn, generateRandomString } from "@/lib/utils";
import { Image, X } from "lucide-react";
import { ReactNode } from "react";

export interface ImageFile {
  file: File | undefined;
  src: string;
  id?: string;
}

export interface ImageFieldProps {
  image?: ImageFile | undefined;
  onImageChange: (image: ImageFile | undefined) => void;
  id: string;
  error?: string | string[];
  className?: string;
  name: string;
  placeholder?: ReactNode;
  accept?: string;
  label?: string;
  labelClass?: string;
  overlay?: ReactNode;
}

export function ImageField({
  image,
  onImageChange,
  id,
  error,
  className,
  name,
  placeholder,
  accept = "image/*",
  label,
  labelClass,
  overlay,
}: ImageFieldProps) {
  const upload = (event: any) => {
    const file = event.target.files[0];
    // reach theme
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        onImageChange({
          file: file,
          src: e.target.result,
          id: generateRandomString(),
        });
      };
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

      <div
        className={cn(
          "relative flex h-[300px] w-full items-center justify-center rounded-xl border border-gray-300 bg-gray-100 bg-cover bg-center",
          className,
          {
            "border-red-500": hasError,
          }
        )}
        style={{ backgroundImage: `url(${image?.src})` }}
      >
        {image == undefined ? (
          <>
            {placeholder ? (
              <label className="block" htmlFor={id}>
                {placeholder}
              </label>
            ) : (
              <label htmlFor={id} className="p-4 text-center text-sm">
                <Image className="mx-auto h-8 w-8 text-gray-400" />
                <p className="text-gray-600 text-sm">
                  Drop or click select to an image
                </p>
              </label>
            )}
          </>
        ) : (
          <div className="h-full w-full">
            <button
              onClick={(e: any) => {
                e.preventDefault();
                onImageChange(undefined);
              }}
              className="absolute top-2 right-2 rounded-full bg-gray-900/60 p-0.5 text-white transition-all duration-300 ease-in-out hover:bg-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
            {overlay}
          </div>
        )}
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

      <input
        type="file"
        multiple={true}
        id={id}
        className="hidden"
        accept={accept}
        name={id}
        onChange={upload}
      />
    </div>
  );
}
