import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// utils/formatDate.ts
import { format as formatFn } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { PhoneNumberUtil } from 'google-libphonenumber';

export function pick(obj: any, keys: string | string[]) {
    if (Array.isArray(keys)) {
        const result: any = {};
        for (const key of keys) {
            if (key in obj) {
                result[key] = obj[key];
            }
        }
        return result;
    } else {
        return obj[keys];
    }
}

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const hexToRGBA = (hex: string, opacity: number) => {
    if (hex != undefined) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    } else {
        return hex;
    }
};

export function removeMember<T extends object, K extends keyof T>(obj: T, keys: K | K[]): Omit<T, K> {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const result = { ...obj };

    for (const key of keysArray) {
        delete result[key];
    }

    return result;
}

export function pickMember<T extends object, K extends keyof T>(obj: T, keys: K | K[]): Pick<T, K> {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const picked = {} as Pick<T, K>;

    for (const key of keysArray) {
        if (key in obj) {
            picked[key] = obj[key];
        }
    }

    return picked;
}

export function unPick(obj: any, keys: string | string[]) {
    const keysToRemove = Array.isArray(keys) ? keys : [keys];
    const result: any = {};

    for (const key in obj) {
        if (!keysToRemove.includes(key)) {
            result[key] = obj[key];
        }
    }

    return result;
}

export function generateRandomString(length: number = 10) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function valueIsSet(value: any) {
    if (Array.isArray(value)) {
        return value.length;
    } else {
        return value != undefined && value != null && value != '';
    }
}

export function formatDate(date: string | Date | null | undefined, format: string = 'd MMMM yyyy', locale: string = 'en'): string {
    if (!date) return '';

    const localesMap: any = {
        fr,
        en: enUS,
    };
    return formatFn(new Date(date), format, { locale: localesMap[locale] });
}

export function parsePhoneNumber(number: string): { code: string; value: string } {
    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
        // Parse the number; null region works if number includes '+'
        const parsed = phoneUtil.parse(number, undefined);
        const countryCode = parsed.getCountryCode(); // e.g., 1, 33, 237
        const nationalNumber = parsed.getNationalNumber(); // numeric part

        return {
            code: `+${countryCode}`,
            value: nationalNumber?.toString() as string,
        };
    } catch (e) {
        return { code: '', value: '' };
    }
}

export function dateFromHourIndex(index: number): Date {
    const now = new Date();
    const date = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        index, // hour
        0, // minutes
        0, // seconds
        0, // milliseconds
    );
    return date;
}

export function formatNumber(value: number, locale = 'fr-FR', currency?: string): string {
    if (isNaN(value)) return '0';

    return new Intl.NumberFormat(locale, {
        style: currency ? 'currency' : 'decimal',
        currency: currency || undefined,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}

/**
 * Export an array of objects to CSV and trigger a download in browser
 * @param {Array<Object>} items - Array of objects to export
 * @param {String} filename - Name of the exported file (default: export.csv)
 * @param {Object|Array} headers - Optional. Either:
 *   - Array of field names (in order), or
 *   - Object mapping { fieldName: "Header Label" }
 */
export function exportToCSV(items: any, filename = 'export.csv', headers: any = null) {
    if (!items || !items.length) {
        console.error('No data to export.');
        return;
    }

    let headerKeys = [];
    let headerLabels = [];

    // Handle header configuration
    if (Array.isArray(headers)) {
        headerKeys = headers;
        headerLabels = headers;
    } else if (typeof headers === 'object' && headers !== null) {
        headerKeys = Object.keys(headers);
        headerLabels = Object.values(headers);
    } else {
        headerKeys = Object.keys(items[0]);
        headerLabels = headerKeys;
    }

    // Build CSV content
    const csvRows = [];

    // Add header row
    csvRows.push(headerLabels.join(','));

    // Add data rows
    for (const item of items) {
        const values = headerKeys.map((key) => {
            let val = item[key] ?? '';
            val = String(val).replace(/"/g, '""'); // Escape quotes
            if (val.includes(',') || val.includes('"') || val.includes('\n')) {
                val = `"${val}"`;
            }
            return val;
        });
        csvRows.push(values.join(','));
    }

    // Convert to CSV string
    const csvString = csvRows.join('\n');

    // Create Blob and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Modern colors array
export const colors = [
    '#F3C6B8', // Millennial Pink
    '#B7F0D4', // Neo Mint
    '#6B5B95', // Ultra Violet
    '#FF6F61', // Coral Reef
    '#FF5E3A', // Sunset Orange
    '#7FDBFF', // Aqua Sky
    '#9CAF88', // Sage Green
    '#36454F', // Charcoal Gray
    '#DCAE96', // Dusty Rose
    '#007FFF', // Electric Blue
    '#FFE5B4', // Peach Fuzz
    '#6B8E23', // Olive Drab
    '#E6E6FA', // Lavender Mist
    '#E2725B', // Terracotta
    '#008080', // Teal Tide
    '#4C6A92', // Cobalt Slate
    '#FFF1B5', // Buttercream Yellow
    '#B7410E', // Rust Red
    '#FF00FF', // Fuchsia Glow
    '#837060', // Mocha Latte
];

// Function to get first x colors, modulo 20
export function getFirstColors(x: number) {
    const result = [];
    const modulo = 20; // Wrap every 20 colors
    for (let i = 0; i < x; i++) {
        result.push(colors[i % modulo]);
    }
    return result;
}
// Example usage:
