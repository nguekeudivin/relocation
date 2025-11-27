import Popover from '@/components/ui/popover';
import { useDisplay } from '@/hooks/use-display';

export default function LocationPopoverSearch({
    name,
    attribute,
    form,
    locations,
}: {
    name: string;
    attribute: string;
    form: any;
    locations: any[];
}) {
    const display = useDisplay();
    return (
        <Popover
            name={name}
            className="no-scroll-visual top-12 left-0 z-30 max-h-[400px] w-[500px] overflow-auto rounded-md bg-white shadow-xl md:top-[70px]"
        >
            <ul>
                {locations.map((item: any, index) => (
                    <li
                        key={`${attribute}${index}${item.name}`}
                        onClick={() => {
                            form.setValue(attribute, item.city);
                            display.hide(name);
                        }}
                        className="hover:bg-secondary-100 cursor-pointer border-b border-gray-300 px-4 py-3 text-start"
                    >
                        <div className="text-sm text-gray-500">{item.city}</div>
                        <div className="text-gray-700">{item.name}</div>
                    </li>
                ))}
            </ul>
        </Popover>
    );
}
