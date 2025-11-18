import { Asset } from '@/store/Asset';
import { X } from 'lucide-react';
import FileIcon from '../ui/file-icon';

export const FileAsset = ({ onRemove, asset }: { onRemove: any; asset: Asset }) => {
    return (
        <div className="relative h-full w-full rounded-md border border-gray-200 p-4 text-sm hover:bg-gray-200/30">
            <div className="flex items-center gap-2">
                <div>
                    <FileIcon name={asset.name as string} />
                </div>
                <div>
                    <p>{asset.name}</p>
                    <p>{asset.size_bytes}</p>
                </div>
            </div>
            <button
                onClick={(e: any) => {
                    e.preventDefault();
                    onRemove();
                }}
                className="absolute top-2 right-2 rounded-full bg-gray-900/60 p-0.5 text-white transition-all duration-300 ease-in-out hover:bg-gray-900"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
};
