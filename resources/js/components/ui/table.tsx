import { cn } from '@/lib/utils';
import { Package } from 'lucide-react';
import { ReactNode } from 'react';

export const TableContainer = ({ className, children }: { className?: string; children: ReactNode }) => {
    return <div className={cn('relative overflow-x-auto border border-gray-200', className)}>{children}</div>;
};

export const Table = ({ className, children }: { className?: string; children: ReactNode }) => {
    return <table className={cn('w-full text-left text-base text-sm rtl:text-right', className)}>{children}</table>;
};

export const TableHead = ({ className, children }: { className?: string; children: ReactNode }) => {
    return (
        <thead className={cn('bg-white text-sm text-gray-700', className)}>
            <tr className="border-b border-gray-200 py-2">{children}</tr>
        </thead>
    );
};

export const TableHeadCell = ({ className, children }: { className?: string; children: ReactNode }) => {
    return (
        <th scope="col" className={cn('px-4 py-3', className)}>
            {children}
        </th>
    );
};

export const TableRow = ({ children, className }: { children: ReactNode; className?: string }) => {
    return <tr className={cn('border-b border-gray-200 bg-white hover:bg-gray-50', className)}>{children}</tr>;
};

export const TableCell = ({ children, className }: { children: ReactNode; className?: string }) => {
    return <td className={cn('px-4 py-4', className)}>{children}</td>;
};

export default function SimpleTable({
    containerClass,
    tableClass,
    headClass,
    headCellClass,
    rowClass,
    cellClass,
    items,
    columns,
}: {
    containerClass?: string;
    tableClass?: string;
    headClass?: string;
    headCellClass?: string;
    rowClass?: string;
    cellClass?: string;
    items: any[];
    columns: any[];
}) {
    return (
        <div>
            {items.length == 0 ? (
                <div className="border-2 border-dashed border-gray-300 p-8 text-center">
                    <div>
                        <div className="mx-auto text-center">
                            <Package className="mx-auto h-8 w-8 text-gray-600" />
                        </div>
                        <div className="mt-2 text-center text-gray-600">No data available</div>
                    </div>
                </div>
            ) : (
                <TableContainer className={containerClass}>
                    <Table className={tableClass}>
                        <TableHead className={headClass}>
                            {columns.map((item) => {
                                return (
                                    <TableHeadCell key={`${item.header}`} className={cn(headCellClass, item.headClass)}>
                                        {item.header}
                                    </TableHeadCell>
                                );
                            })}
                        </TableHead>
                        <tbody>
                            {items.map((item: any, index: number) => {
                                return (
                                    <TableRow key={`table${index}`} className={rowClass}>
                                        {columns.map((col) => {
                                            return (
                                                <TableCell key={col.name} className={cn(cellClass, col.className)}>
                                                    {col.row ? col.row(item, index) : item[col.name]}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                        </tbody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}
