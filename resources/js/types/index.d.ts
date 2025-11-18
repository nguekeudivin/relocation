import { Profile, User } from '@/store/User';
import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
    profiles: Profile[];
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface MenuItemType {
    label: string;
    icon: any;
    route?: string;
    badge?: ReactNode;
    menu?: any[];
    method?: any;
}

export interface CheckBoxOptionType {
    value: any;
    label: string;
    description?: string;
}

export type IdType = number | string;

export interface FileItem {
    id?: IdType;
    name: string;
    size: number;
    type: string;
    starred?: boolean;
    date: Date | string;
    users?: any[];
}

export interface Folder {
    id: IdType;
    name: string;
    files?: File[];
    folders?: Folder[];
    starred?: boolean;
    size?: number;
    users?: any[];
}

export interface VideoFile {
    file: File | undefined;
    src: string;
}

type PageProps = {
    auth: {
        user: {
            name: string;
            email: string;
            company_step_at: string | null;
        };
    };
    sidebar: {
        bgColor: string;
    };
};

type Idtype = string | number;
