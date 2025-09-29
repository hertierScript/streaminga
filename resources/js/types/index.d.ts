import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
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
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    role?: 'admin' | 'user';
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Movie {
    id: number;
    title: string;
    poster: string;
    rating: number;
    genre: string[];
    description: string;
    releaseYear: number;
    duration: number; // in minutes
    category: string; // trending, recent, romance, hot-seasons, action, drama, etc.
    interpreter?: string; // Interpreter for izisobanuye movies (optional)
    country?: string; // Country of origin
    trailer?: string; // Trailer URL
}

export interface Comment {
    id: number;
    user_id: number | null;
    movie_id: number;
    name: string;
    message: string;
    status: 'pending' | 'approved' | 'flagged';
    parent_id: number | null;
    created_at: string;
    updated_at: string;
    user?: User;
    replies?: Comment[];
}
