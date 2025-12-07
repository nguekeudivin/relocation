import { useAway } from '@/hooks/use-away';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { createContext, useContext } from 'react';

interface DropdownContextType {
    open: boolean;
    setOpen: any;
    onChange: any;
    onItemSelect: any;
    selectedValue: any;
}

const DropdownContext = createContext<DropdownContextType | undefined>(undefined);

const useSelect = (): DropdownContextType => {
    const context = useContext(DropdownContext);
    if (!context) {
        throw new Error('Cannot use dropdown outside context');
    }
    return context;
};

const Trigger = ({ children, className }: { children: React.ReactNode; className: string }) => {
    const { setOpen, open } = useSelect();
    return (
        <div
            onClick={() => {
                setOpen(!open);
            }}
            className={cn('flex h-10 cursor-pointer items-center rounded-none border border-gray-300 bg-white px-4 text-sm', className)}
        >
            {children}
        </div>
    );
};

const SelectButton = ({
    prefix,
    className,
    surfix,
    label,
}: {
    className?: string;
    prefix?: React.ReactNode;
    surfix?: React.ReactNode;
    label: any;
}) => {
    const { setOpen, open, selectedValue } = useSelect();
    return (
        <button
            onClick={() => {
                setOpen(!open);
            }}
            className={cn(
                'relative flex inline-flex h-10 cursor-pointer items-center justify-between rounded-none border border-gray-300 bg-white px-4 text-sm',
                className,
            )}
        >
            <span className="inline-flex items-center gap-2">
                {prefix && <span className="text-gray-500">{prefix}</span>}
                <span>{label}</span>
            </span>
            <span className="ml-4">
                {surfix ? (
                    <>{surfix}</>
                ) : (
                    <>
                        <ChevronsUpDown className="h-4 w-4 text-gray-500" />
                    </>
                )}
            </span>
        </button>
    );
};

const Content = ({ children, className }: { children: any; className?: string }) => {
    const { open } = useSelect();
    return (
        <ul
            id="dropdown"
            aria-labelledby="dropdownDefaultButton"
            className={cn(
                'absolute z-30 hidden w-[200px] space-y-1 rounded-lg bg-white p-2 shadow-sm',
                {
                    block: open,
                },
                className,
            )}
        >
            {children}
        </ul>
    );
};

const Item = ({ children, className, value }: { children: React.ReactNode; className?: string; value: any }) => {
    const { setOpen, onChange, onItemSelect, selectedValue } = useSelect();
    return (
        <li
            onClick={() => {
                const option = {
                    value: value,
                    label: children,
                };
                if (onChange) onChange(option);
                if (onItemSelect) onItemSelect(option);
                setOpen(false);
            }}
            data-value={value}
            className={cn('relative block w-full cursor-pointer rounded-none px-4 py-1.5 text-sm hover:bg-gray-100', className, {
                'bg-gray-100': selectedValue == value,
            })}
        >
            {children}
            {value == selectedValue && (
                <div className="absolute top-0 right-3 flex h-full items-center">
                    <Check className="h-4 w-4" />
                </div>
            )}
        </li>
    );
};

const SelectedLabel = ({ options }: { options: { label: string; value: any; description?: string }[] }) => {
    const { selectedValue } = useSelect();

    useEffect(() => {}, [selectedValue]);
    return <>{options.find((item: any) => item.value == selectedValue)?.label}</>;
};

const SelectMenu = ({
    children,
    onChange,
    defaultValue,
    onItemSelect,
    value,
    onFocus,
}: {
    defaultValue?: string;
    children: React.ReactNode;
    onChange?: any;
    onFocus?: (bool: boolean) => void;
    onItemSelect?: any;
    value: string;
}) => {
    const [open, setOpen] = useState<boolean>(false);
    const elementRef = useRef<any>(false);

    useAway(elementRef, () => {
        setOpen(false);
    });

    useEffect(() => {
        if (onFocus) onFocus(open);
    }, [open]);

    useEffect(() => {
        if (defaultValue) {
            const items = elementRef.current.querySelectorAll('.item');
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.dataset.value == defaultValue) {
                    onChange({
                        value: defaultValue,
                        label: <div dangerouslySetInnerHTML={{ __html: item.innerHTML }} />,
                    });
                }
            }
        }
    }, []);

    return (
        <DropdownContext.Provider
            value={{
                open,
                setOpen,
                onChange,
                onItemSelect,
                selectedValue: value,
            }}
        >
            <div ref={elementRef} className="relative">
                {children}
            </div>
        </DropdownContext.Provider>
    );
};

const Select = {
    Button: SelectButton,
    Label: SelectedLabel,
    Root: SelectMenu,
    Trigger: Trigger,
    Content: Content,
    Item: Item,
};

export default Select;
