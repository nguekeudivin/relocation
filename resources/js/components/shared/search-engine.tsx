"use client";

import useAppStore from "@/store";
import { ListFilterPlus, Search } from "lucide-react";
import { Button } from "../ui/button";
import Select from "../ui/select";
import { cn } from "@/lib/utils";

export const SearchEngine = ({
  form,
  selects,
  children,
  onSubmit,
  autoComplete,
  inputClass,
  className,
  inputSize,
}: {
  form: any;
  children?: any;
  onSubmit: any;
  selects: any;
  autoComplete?: any;
  inputClass?: string;
  className?: string;
  inputSize?: string;
}) => {
  const store = useAppStore();

  return (
    <section className="mb-4">
      <div className={cn("flex items-center gap-4", className)}>
        <div className={cn("relative", inputSize)}>
          <input
            placeholder="Enter a keyword to make a research"
            name="keyword"
            value={form.values.keyword || ""}
            onChange={(e: any) => {
              form.setValue("keyword", e.target.value);

              if (autoComplete)
                autoComplete({
                  ...form.values,
                  keyword: e.target.value,
                });
            }}
            className={cn(
              "w-[400px] bg-white focus:ring-secondary-300 block rounded-lg border border-gray-300 p-2 text-sm text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none",
              inputClass
            )}
            onKeyDown={(e: any) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onSubmit();
              }
            }}
          />
          <Search className="absolute top-3 right-3 w-4 h-4 text-gray-500" />
        </div>

        <div className="flex items-center gap-2">
          {selects.map((item: any, index: number) => {
            const options = item.placeholder
              ? [{ label: item.placeholder, value: undefined }, ...item.options]
              : item.options;
            return (
              <Select.Root
                key={`filter${item.name}${index}`}
                value={form.values[item.name]}
                onChange={(option: any) => {
                  form.setValue(item.name, option.value);
                  if (autoComplete)
                    autoComplete({
                      ...form.values,
                      [item.name]: option.value,
                    });
                }}
              >
                <Select.Button
                  className={cn("w-[200px]", item.size)}
                  prefix={item.icon}
                  label={<Select.Label options={options} />}
                />

                <Select.Content className={item.size}>
                  {options.map((item: any, index2: number) => (
                    <Select.Item
                      key={`filter${item.name}${index}${index2}`}
                      value={item.value}
                    >
                      {item.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            );
          })}
        </div>
        {children && (
          <Button
            onClick={() => store.display.toggle("TableFilters")}
            color="outline"
            className="border-gray-300 border-1 px-3 py-[0.6rem] bg-white"
          >
            <ListFilterPlus className="w-4 h-4" />
          </Button>
        )}
      </div>
      {store.display.visible.TableFilters && children && (
        <div className="mt-4 rounded-md border border-gray-200 bg-white p-4">
          {children}
        </div>
      )}
    </section>
  );
};
