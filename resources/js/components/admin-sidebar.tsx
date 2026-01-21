import NotificationBell from '@/components/notification-bell';
import { Badge } from '@/components/ui/badge';
import { Link, usePage, router } from '@inertiajs/react';
import {
    BarChart3,
    Bell,
    ChevronDown,
    ChevronRight,
    DollarSign,
    Edit,
    Film,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Shield,
    TrendingUp,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
type NavItem = {
    href?: string;
    label: string;
    icon: any;
    badge?: number;
    subItems?: {
        href: string;
        label: string;
        icon: any;
        badge?: number;
    }[];
};

const getAdminNavItems = (
    translatedNotificationCount: number,
    untranslatedNotificationCount: number,
    commentCount: number,
    translatedMoviesCount: number,
    untranslatedMoviesCount: number,
): NavItem[] => [
    { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
    {
        label: 'Notifications',
        icon: Bell,
        subItems: [
            {
                href: '/admin/notifications/translated',
                label: 'Izisobanuye',
                icon: Film,
                badge:
                    translatedNotificationCount > 0
                        ? translatedNotificationCount
                        : undefined,
            },
            {
                href: '/admin/notifications/untranslated',
                label: 'Izidasobanuye',
                icon: Edit,
                badge:
                    untranslatedNotificationCount > 0
                        ? untranslatedNotificationCount
                        : undefined,
            },
        ],
    },
    // {
    //     label: 'Movie Management',
    //     icon: Film,
    //     subItems: [
    //         {
    //             href: '/admin/movies',
    //             label: 'Izisobanuye',
    //             icon: Film,
    //             badge:
    //                 translatedMoviesCount > 0
    //                     ? translatedMoviesCount
    //                     : undefined,
    //         },
    //         {
    //             href: '/admin/untranslated-movies',
    //             label: 'Izidasobanuye',
    //             icon: Edit,
    //             badge:
    //                 untranslatedMoviesCount > 0
    //                     ? untranslatedMoviesCount
    //                     : undefined,
    //         },
    //     ],
    // },
    { href: '/admin/movies', label: 'Movie Management', icon: Film },
    {
        href: '/admin/comments',
        label: 'Comments Management',
        icon: MessageSquare,
        badge: commentCount > 0 ? commentCount : undefined,
    },
    { href: '/admin/users', label: 'User Management', icon: Users },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    // { href: '/admin/subscriptions', label: 'Subscriptions', icon: DollarSign },
    // { href: '/admin/reports', label: 'Reports', icon: TrendingUp },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminSidebar() {
    const page = usePage();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [translatedNotificationCount, setTranslatedNotificationCount] =
        useState(0);
    const [untranslatedNotificationCount, setUntranslatedNotificationCount] =
        useState(0);
    const [commentCount, setCommentCount] = useState(0);
    const [translatedMoviesCount, setTranslatedMoviesCount] = useState(0);
    const [untranslatedMoviesCount, setUntranslatedMoviesCount] = useState(0);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    useEffect(() => {
        fetchCounts();
        // Get CSRF token
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        setCsrfToken(token);
    }, []);

    const fetchCounts = async () => {
        try {
            // Fetch notification counts for translated and untranslated movies
            const notificationResponse = await fetch(
                '/admin/api/notification-counts',
            );
            const notificationData = await notificationResponse.json();
            setTranslatedNotificationCount(notificationData.translated);
            setUntranslatedNotificationCount(notificationData.untranslated);

            // Fetch dashboard stats for other counts
            const statsResponse = await fetch('/admin/api/dashboard-stats');
            const statsData = await statsResponse.json();
            setCommentCount(statsData.total_comments);

            // Fetch movie counts
            const movieCountsResponse = await fetch('/admin/api/movie-counts');
            const movieCountsData = await movieCountsResponse.json();
            setTranslatedMoviesCount(movieCountsData.translated);
            setUntranslatedMoviesCount(movieCountsData.untranslated);
        } catch (error) {
            console.error('Error fetching sidebar counts:', error);
        }
    };

    const toggleExpanded = (label: string) => {
        setExpandedItems((prev) =>
            prev.includes(label)
                ? prev.filter((item) => item !== label)
                : [...prev, label],
        );
    };

    const isActive = (href: string) => page.url === href;
    const isParentActive = (subItems: any[]) =>
        subItems.some((item) => isActive(item.href));

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLoggingOut(true);

        // Show loading spinner for 2 seconds, then submit the form
        setTimeout(() => {
            const form = document.getElementById('logout-form') as HTMLFormElement;
            if (form) {
                form.submit();
            }
        }, 2000);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed top-4 left-4 z-50 rounded-lg bg-gray-800 p-2 shadow-lg lg:hidden"
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
                    className="bg-opacity-50 fixed inset-0 z-40 bg-black lg:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 z-50 min-h-screen w-64 bg-gray-900 text-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} `}
            >
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-red-500">
                                Admin Panel
                            </h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Management Console
                            </p>
                        </div>
                        <NotificationBell />
                    </div>
                </div>
                <nav className="space-y-1 px-4">
                    {getAdminNavItems(
                        translatedNotificationCount,
                        untranslatedNotificationCount,
                        commentCount,
                        translatedMoviesCount,
                        untranslatedMoviesCount,
                    ).map((item) => {
                        const Icon = item.icon;
                        const hasSubItems =
                            item.subItems && item.subItems.length > 0;
                        const isExpanded = expandedItems.includes(item.label);
                        const itemIsActive = hasSubItems
                            ? isParentActive(item.subItems || [])
                            : isActive(item.href || '');

                        if (hasSubItems) {
                            return (
                                <div key={item.label}>
                                    <button
                                        onClick={() =>
                                            toggleExpanded(item.label)
                                        }
                                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors ${
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
                                        <div className="mt-1 ml-6 space-y-1">
                                            {item.subItems.map((subItem) => {
                                                const SubIcon = subItem.icon;
                                                const subIsActive = isActive(
                                                    subItem.href,
                                                );
                                                return (
                                                    <Link
                                                        key={subItem.href}
                                                        href={subItem.href}
                                                        className={`flex items-center justify-between space-x-3 rounded-lg px-4 py-2 text-left text-sm transition-colors ${
                                                            subIsActive
                                                                ? 'bg-red-600 text-white'
                                                                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                                                        }`}
                                                    >
                                                        <div className="flex items-center space-x-3">
                                                            <SubIcon className="h-4 w-4" />
                                                            <span>
                                                                {subItem.label}
                                                            </span>
                                                        </div>
                                                        {subItem.badge &&
                                                            subItem.badge >
                                                                0 && (
                                                                <Badge className="bg-red-600 text-xs text-white">
                                                                    {subItem.badge >
                                                                    99
                                                                        ? '99+'
                                                                        : subItem.badge}
                                                                </Badge>
                                                            )}
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
                                className={`flex items-center justify-between space-x-3 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                                    itemIsActive
                                        ? 'bg-red-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <Icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge && item.badge > 0 && (
                                    <Badge className="bg-red-600 text-xs text-white">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </Badge>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
                    <form
                        id="logout-form"
                        method="POST"
                        action="/logout"
                        className="hidden"
                    >
                        <input
                            type="hidden"
                            name="_token"
                            value={csrfToken}
                        />
                    </form>

                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-left text-sm text-gray-300 transition-colors hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoggingOut ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                            <LogOut className="h-5 w-5" />
                        )}
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </div>
        </>
    );
}
