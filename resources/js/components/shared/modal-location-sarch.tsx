import { useDisplay } from '@/hooks/use-display';
import { useLoading } from '@/hooks/use-loading';
import { Loader2, MapPin, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';

type ModalLocationSearchProps = {
    name: string;
    form: any;
    attribute: string;
    placeholder: string;
    handleAutoComplete: any;
    locations: any[];
};

export default function ModalLocationSearch({ name, form, attribute, placeholder, handleAutoComplete, locations }: ModalLocationSearchProps) {
    const display = useDisplay();
    const loading = useLoading();
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input when modal becomes visible
    useEffect(() => {
        if (display.visible[name] && inputRef.current) {
            inputRef.current.focus();
        }
    }, [display.visible, name]);

    return (
        <AnimatePresence>
            {display.visible[name] && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    tabIndex={-1} // avoid scroll on focus
                    className="fixed top-0 left-0 z-50 h-screen w-full bg-white p-4"
                    aria-modal="true"
                    role="dialog"
                >
                    <div className="flex justify-between text-gray-600">
                        <div></div>
                        <button
                            onClick={() => {
                                loading.stop(`${attribute}_options`);
                                display.hide(name);
                            }}
                        >
                            <X className="text-gray-600" />
                        </button>
                    </div>
                    <div className="flex items-center border-b border-gray-300">
                        {loading.status[attribute] ? (
                            <Loader2 className="text-secondary-700 animate-spin" />
                        ) : (
                            <MapPin className="h-5 w-5 text-gray-500" />
                        )}
                        <input
                            ref={inputRef}
                            name={attribute}
                            value={form.values[attribute]}
                            onChange={handleAutoComplete}
                            placeholder={placeholder}
                            className="cursor-pointer px-4 py-3 text-gray-700 focus:border-none focus:outline-none"
                        />
                    </div>
                    <ul className="no-scroll-visual h-full overflow-auto">
                        {locations.map((item, index) => (
                            <li
                                key={`${attribute}${index}${item.name}`}
                                onClick={() => {
                                    form.setValue(attribute, item.city);
                                    display.hide(`${attribute}_options`);
                                    display.hide(name);
                                }}
                                className="hover:bg-secondary-100 cursor-pointer border-b border-gray-300 px-4 py-3 text-start"
                            >
                                <div className="text-sm text-gray-500">{item.city}</div>
                                <div className="text-gray-700">{item.name}</div>
                            </li>
                        ))}
                    </ul>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
