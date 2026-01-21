import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { movies } from '@/data/movies';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Edit,
    Eye,
    Film,
    MessageSquare,
    Plus,
    Search,
    Settings,
    Trash2,
    Users,
    ChevronLeft,
    ChevronRight,
    Home,
    UserCheck,
    DollarSign,
    TrendingUp,
    Calendar,
    Activity,
    Shield,
    Database,
    Star
} from 'lucide-react';

const ITEMS_PER_PAGE = 15;

export default function AdminDashboard() {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    // Debug logging
    useEffect(() => {
        console.log('Active section changed to:', activeSection);
    }, [activeSection]);

    // Filter movies based on search and category
    const filteredMovies = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || movie.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    // Pagination
    const totalPages = Math.ceil(filteredMovies.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedMovies = filteredMovies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'movies', label: 'Movie Management', icon: Film },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'subscriptions', label: 'Subscriptions', icon: DollarSign },
        { id: 'reports', label: 'Reports', icon: TrendingUp },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex min-h-screen bg-gray-900 text-white">
                {/* Mobile Sidebar Overlay */}
                <div className={`fixed inset-0 z-40 lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
                    <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="relative w-64 max-w-[80vw] h-full bg-gray-800 shadow-lg">
                        <div className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg sm:text-xl font-bold text-red-500">Admin Panel</h2>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Management Console</p>
                        </div>
                        <nav className="px-3 sm:px-4">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            console.log('Setting active section to:', item.id);
                                            setActiveSection(item.id);
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className={`flex w-full items-center space-x-2 sm:space-x-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors text-sm sm:text-base ${
                                            activeSection === item.id
                                                ? 'bg-red-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                        <span className="truncate">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Desktop Sidebar */}
                <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-gray-800 shadow-lg">
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-red-500">Admin Panel</h2>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">Management Console</p>
                    </div>
                    <nav className="flex-1 px-3 sm:px-4 space-y-1">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        // Close mobile sidebar when item is clicked
                                        if (activeSection === 'sidebar') {
                                            setActiveSection(item.id);
                                        }
                                    }}
                                    className={`flex w-full items-center space-x-2 sm:space-x-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-left transition-colors text-sm sm:text-base ${
                                        activeSection === item.id
                                            ? 'bg-red-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span className="truncate">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-64">
                    {/* Mobile Header */}
                    <div className="lg:hidden flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="text-gray-400 hover:text-white"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg font-bold text-red-500">Admin Panel</h1>
                        <div></div>
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl">
                            {activeSection === 'dashboard' && (
                                <div key="dashboard">
                                    <DashboardContent />
                                </div>
                            )}
                            {activeSection === 'movies' && (
                                <div key="movies">
                                    <MoviesManagement
                                        movies={paginatedMovies}
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={setCurrentPage}
                                        searchTerm={searchTerm}
                                        onSearchChange={setSearchTerm}
                                        filterCategory={filterCategory}
                                        onFilterChange={setFilterCategory}
                                    />
                                </div>
                            )}
                            {activeSection === 'users' && (
                                <div key="users">
                                    <UsersManagement />
                                </div>
                            )}
                            {activeSection === 'analytics' && (
                                <div key="analytics">
                                    <AnalyticsContent />
                                </div>
                            )}
                            {activeSection === 'subscriptions' && (
                                <div key="subscriptions">
                                    <SubscriptionsContent />
                                </div>
                            )}
                            {activeSection === 'reports' && (
                                <div key="reports">
                                    <ReportsContent />
                                </div>
                            )}
                            {activeSection === 'settings' && (
                                <div key="settings">
                                    <SettingsContent />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function DashboardContent() {
    return (
        <>
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
                <div className="text-xs sm:text-sm text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="mb-6 sm:mb-8 lg:mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Total Views
                        </CardTitle>
                        <Eye className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234,567</div>
                        <p className="text-xs text-green-400">+12% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Total Comments
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89,432</div>
                        <p className="text-xs text-green-400">+8% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Total Subscribers
                        </CardTitle>
                        <Users className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">45,678</div>
                        <p className="text-xs text-green-400">+15% from last month</p>
                    </CardContent>
                </Card>

                <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-400">
                            Revenue
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$234,567</div>
                        <p className="text-xs text-green-400">+22% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                            <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>Recent Activity</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-green-400 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">New user registered</p>
                                    <p className="text-xs text-gray-400">2 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-blue-400 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">Movie "Inception" viewed 1,234 times</p>
                                    <p className="text-xs text-gray-400">15 minutes ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="h-2 w-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm">New subscription purchased</p>
                                    <p className="text-xs text-gray-400">1 hour ago</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader className="pb-3 sm:pb-4">
                        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                            <span>Recently Added Movies</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-3 sm:space-y-4">
                            <RecentMoviesList />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function RecentMoviesList() {
    const [recentMovies, setRecentMovies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentMovies();
    }, []);

    const fetchRecentMovies = async () => {
        try {
            const response = await fetch('/admin/api/recent-izisobanuye-movies');
            const data = await response.json();
            setRecentMovies(data);
        } catch (error) {
            console.error('Error fetching recent movies:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p className="text-sm text-gray-400">Loading recent movies...</p>;
    }

    if (recentMovies.length === 0) {
        return <p className="text-sm text-gray-400">No recent movies found</p>;
    }

    return (
        <>
            {recentMovies.slice(0, 5).map((movie: any, index: number) => (
                <div key={movie.id} className="flex items-center space-x-3">
                    <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-700 text-xs sm:text-sm font-bold flex-shrink-0">
                        {index + 1}
                    </div>
                    {movie.poster ? (
                        <img
                            src={movie.poster}
                            alt={movie.title}
                            className="h-8 w-6 sm:h-10 sm:w-7 rounded object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="h-8 w-6 sm:h-10 sm:w-7 rounded bg-gray-600 flex items-center justify-center text-xs text-gray-400 flex-shrink-0">
                            No Image
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{movie.title}</p>
                        <p className="text-xs text-gray-400">{movie.rating} ★ • {new Date(movie.created_at).toLocaleDateString()}</p>
                    </div>
                </div>
            ))}
        </>
    );
}

function MoviesManagement({ movies: paginatedMovies, currentPage, totalPages, onPageChange, searchTerm, onSearchChange, filterCategory, onFilterChange }: any) {
    const categories = Array.from(new Set(movies.map((m: any) => m.category)));

    return (
        <>
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Movie Management</h1>
                <Button className="bg-red-600 hover:bg-red-700 w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Movie
                </Button>
            </div>

            {/* Search and Filters */}
            <div className="mb-4 sm:mb-6 flex flex-col gap-3 sm:gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 bg-gray-800 border-gray-700 text-white h-10 sm:h-12"
                    />
                </div>
                <Select value={filterCategory} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white h-10 sm:h-12">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectItem value="" className="text-white hover:bg-gray-700">All Categories</SelectItem>
                        {categories.map((category: string) => (
                            <SelectItem key={category} value={category} className="text-white hover:bg-gray-700 capitalize">
                                {category.replace('-', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Movies List */}
            <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
                    {paginatedMovies.map((movie: any) => (
                        <div
                            key={movie.id}
                            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-lg bg-gray-700 p-3 sm:p-4 transition-colors hover:bg-gray-600 gap-3 sm:gap-4"
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="h-16 w-12 sm:h-20 sm:w-14 lg:h-24 lg:w-16 rounded object-cover flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold truncate">{movie.title}</h3>
                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-400 mt-1">
                                        <span>{movie.releaseYear}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{movie.duration} min</span>
                                        <span className="hidden sm:inline">•</span>
                                        <div className="flex flex-wrap gap-1">
                                            {movie.genre.slice(0, 2).map((g: string) => (
                                                <Badge key={g} variant="secondary" className="text-xs px-1.5 py-0.5">
                                                    {g}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 w-full sm:w-auto">
                                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-600 w-full sm:w-auto text-xs sm:text-sm">
                                    <Edit className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    Edit
                                </Button>
                                <Button variant="outline" size="sm" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white w-full sm:w-auto text-xs sm:text-sm">
                                    <Trash2 className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
                            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, movies.length)} of {movies.length} movies
                        </div>
                        <div className="flex justify-center sm:justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="border-gray-600 text-gray-300 hover:bg-gray-600 text-xs sm:text-sm px-2 sm:px-3"
                            >
                                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline ml-1">Previous</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="border-gray-600 text-gray-300 hover:bg-gray-600 text-xs sm:text-sm px-2 sm:px-3"
                            >
                                <span className="hidden sm:inline mr-1">Next</span>
                                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

function UsersManagement() {
    return (
        <>
            <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">User Management</h1>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Total Users</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,345</div>
                        <p className="text-xs text-green-400">+5% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <UserCheck className="h-5 w-5" />
                            <span>Active Users</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">9,876</div>
                        <p className="text-xs text-green-400">+3% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Admin Users</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">5</div>
                        <p className="text-xs text-gray-400">No change</p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function AnalyticsContent() {
    return (
        <>
            <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">Analytics</h1>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>View Analytics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <BarChart3 className="h-12 w-12" />
                            <span className="ml-2">Chart visualization would go here</span>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>User Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Average watch time</span>
                                <span className="font-bold">2h 15m</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Completion rate</span>
                                <span className="font-bold">78%</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Return visitors</span>
                                <span className="font-bold">65%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function SubscriptionsContent() {
    return (
        <>
            <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">Subscription Management</h1>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>Weekly Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$4.99</div>
                        <p className="text-sm text-gray-400">1,234 subscribers</p>
                        <Button className="mt-4 w-full bg-red-600 hover:bg-red-700">Manage</Button>
                    </CardContent>
                </Card>
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>Monthly Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$9.99</div>
                        <p className="text-sm text-gray-400">5,678 subscribers</p>
                        <Button className="mt-4 w-full bg-red-600 hover:bg-red-700">Manage</Button>
                    </CardContent>
                </Card>
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>Yearly Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$99.99</div>
                        <p className="text-sm text-gray-400">2,345 subscribers</p>
                        <Button className="mt-4 w-full bg-red-600 hover:bg-red-700">Manage</Button>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function ReportsContent() {
    return (
        <>
            <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">Reports & Insights</h1>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>Monthly Report</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Total Revenue</span>
                                <span className="font-bold">$234,567</span>
                            </div>
                            <div className="flex justify-between">
                                <span>New Subscribers</span>
                                <span className="font-bold">1,234</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Content Views</span>
                                <span className="font-bold">456,789</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Avg. Session Time</span>
                                <span className="font-bold">2h 15m</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

function SettingsContent() {
    return (
        <>
            <h1 className="mb-6 sm:mb-8 text-2xl sm:text-3xl lg:text-4xl font-bold">System Settings</h1>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Site Maintenance Mode</span>
                                <Button variant="outline" size="sm" className="border-gray-600">Toggle</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Email Notifications</span>
                                <Button variant="outline" size="sm" className="border-gray-600">Configure</Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Cache Management</span>
                                <Button variant="outline" size="sm" className="border-gray-600">Clear Cache</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-gray-700 bg-gray-800">
                    <CardHeader>
                        <CardTitle>Database Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span>Backup Database</span>
                                <Button variant="outline" size="sm" className="border-gray-600">
                                    <Database className="mr-2 h-4 w-4" />
                                    Create Backup
                                </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Export Data</span>
                                <Button variant="outline" size="sm" className="border-gray-600">Export</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
