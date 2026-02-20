import NotificationBell from '@/components/notification-bell';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
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
    Search,
    Settings,
    Shield,
    TrendingUp,
    UserCheck,
    Users,
    X,
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
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
    
    // Global search state
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCounts();
        // Get CSRF token
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
        setCsrfToken(token);
        
        // Click outside to close search results
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    // Global search using TMDB API
    useEffect(() => {
        const performSearch = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                setIsSearching(false);
                return;
            }

            setIsSearching(true);
            
            try {
                const response = await axios.get('/api/movies/search', {
                    params: { q: searchQuery }
                });

                if (response.data && response.data.results) {
                    const genreMap: { [key: number]: string } = {
                        28: 'Action',
                        27: 'Horror',
                        35: 'Comedy',
                        18: 'Drama',
                        10749: 'Romance',
                        16: 'Animation',
                        53: 'Thriller',
                        878: 'Sci-Fi',
                        80: 'Crime',
                        12: 'Adventure',
                        14: 'Fantasy',
                        10751: 'Family',
                    };

                    const results = response.data.results.slice(0, 8).map((movie: any) => ({
                        id: movie.id,
                        title: movie.title,
                        poster: movie.poster_path
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                            : null,
                        year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
                        genre: (movie.genre_ids || []).slice(0, 2).map((id: number) => genreMap[id] || 'Other').join(', '),
                    }));

                    setSearchResults(results);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            performSearch();
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setShowResults(true);
    };

    const handleMovieClick = (movieId: number) => {
        setShowResults(false);
        setSearchQuery('');
        // Navigate to the movie detail page
        window.location.href = `/movies/${movieId}`;
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
                    
                    {/* Global Search */}
                    <div ref={searchRef} className="mt-4 relative">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search movies..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onFocus={() => setShowResults(true)}
                                className="w-full rounded-lg border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:border-red-500 focus:ring-red-500"
                            />
                        </div>
                        
                        {/* Search Results Dropdown */}
                        {showResults && searchQuery.trim() && (
                            <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-700 bg-gray-800 shadow-lg max-h-80 overflow-y-auto">
                                {isSearching ? (
                                    <div className="p-3 text-sm text-gray-400 text-center">
                                        Searching...
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <div className="py-1">
                                        {searchResults.map((movie) => (
                                            <button
                                                key={movie.id}
                                                onClick={() => handleMovieClick(movie.id)}
                                                className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-gray-700"
                                            >
                                                {movie.poster ? (
                                                    <img
                                                        src={movie.poster}
                                                        alt={movie.title}
                                                        className="h-10 w-7 flex-shrink-0 rounded object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-10 w-7 flex-shrink-0 rounded bg-gray-600 flex items-center justify-center">
                                                        <Film className="h-4 w-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-white truncate">
                                                        {movie.title}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {movie.year} • {movie.genre}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-3 text-sm text-gray-400 text-center">
                                        No movies found
                                    </div>
                                )}
                            </div>
                        )}
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
