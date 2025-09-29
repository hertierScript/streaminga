import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import NotificationBell from '@/components/notification-bell';
import {
    BarChart3,
    Bell,
    ChevronDown,
    ChevronRight,
    Edit,
    Film,
    Home,
    MessageSquare,
    Settings,
    TrendingUp,
    Users,
    DollarSign,
    UserCheck,
    Shield,
    Menu,
    X
} from 'lucide-react';

type NavItem = {
    href?: string;
    label: string;
    icon: any;
    subItems?: {
        href: string;
        label: string;
        icon: any;
    }[];
};

const adminNavItems: NavItem[] = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    {
        label: 'Movie Management',
        icon: Film,
        subItems: [
            { href: '/admin/movies', label: 'Translated Movies', icon: Film },
            { href: '/admin/untranslated-movies', label: 'Untranslated Movies', icon: Edit },
        ]
    },
    { href: '/admin/comments', label: 'Comments Management', icon: MessageSquare },
    {
        label: 'User Management',
        icon: Users,
        subItems: [
            { href: '/admin/end-users', label: 'End Users', icon: UserCheck },
            { href: '/admin/admin-users', label: 'Admin Users', icon: Shield },
        ]
    },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/subscriptions', label: 'Subscriptions', icon: DollarSign },
    { href: '/admin/reports', label: 'Reports', icon: TrendingUp },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleExpanded = (label: string) => {
        setExpandedItems(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (href: string) => page.url === href;
    const isParentActive = (subItems: any[]) => subItems.some(item => isActive(item.href));

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-lg shadow-lg"
            >
                {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <Menu className="h-6 w-6 text-white" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <div className={`
                min-h-screen bg-gray-900 text-white shadow-lg transition-transform duration-300 ease-in-out
                w-64 fixed left-0 top-0 z-50
                lg:translate-x-0
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-red-500">Admin Panel</h2>
                        <p className="text-sm text-gray-400 mt-1">Management Console</p>
                    </div>
                    <NotificationBell />
                </div>
            </div>
            <nav className="px-4 space-y-1">
                {adminNavItems.map((item) => {
                    const Icon = item.icon;
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isExpanded = expandedItems.includes(item.label);
                    const itemIsActive = hasSubItems ? isParentActive(item.subItems || []) : isActive(item.href || '');

                    if (hasSubItems) {
                        return (
                            <div key={item.label}>
                                <button
                                    onClick={() => toggleExpanded(item.label)}
                                    className={`flex items-center justify-between w-full rounded-lg px-4 py-3 text-left transition-colors text-sm ${
                                        itemIsActive
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon className="h-5 w-5" />
                                        <span>{item.label}</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4" />
                                    )}
                                </button>
                                {isExpanded && item.subItems && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.subItems.map((subItem) => {
                                            const SubIcon = subItem.icon;
                                            const subIsActive = isActive(subItem.href);
                                            return (
                                                <Link
                                                    key={subItem.href}
                                                    href={subItem.href}
                                                    className={`flex items-center space-x-3 rounded-lg px-4 py-2 text-left transition-colors text-sm ${
                                                        subIsActive
                                                            ? 'bg-red-600 text-white'
                                                            : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                    }`}
                                                >
                                                    <SubIcon className="h-4 w-4" />
                                                    <span>{subItem.label}</span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-3 rounded-lg px-4 py-3 text-left transition-colors text-sm ${
                                itemIsActive
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
        </>
    );
}