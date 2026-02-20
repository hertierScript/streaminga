import { AdminSidebar } from '@/components/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import {
    Activity,
    AlertCircle,
    DollarSign,
    Eye,
    Film,
    Globe,
    MessageSquare,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface DashboardStats {
    untranslated_views: number;
    untranslated_movie_count: number;
    translated_views: number;
    translated_movie_count: number;
    izisobanuye_views: number;
    izisobanuye_movie_count: number;
    total_views: number;
    total_comments: number;
    total_subscribers: number;
    revenue: number;
    total_movies: number;
    total_watch_time: number;
}

interface RecentActivity {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    created_at: string;
}

interface UntranslatedMovie {
    id: number;
    tmdb_id: number;
    title: string;
    poster: string | null;
    rating: number | null;
    view_count: number;
    release_year: number | null;
    interpreter: string | null;
    created_at: string;
}

export default function AdminDashboard() {
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
        null,
    );
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
        [],
    );
    const [untranslatedMovies, setUntranslatedMovies] = useState<
        UntranslatedMovie[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardStats();
        fetchRecentActivities();
        fetchUntranslatedMovies();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch('/admin/api/dashboard-stats');
            const data = await response.json();
            setDashboardStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchRecentActivities = async () => {
        try {
            const response = await fetch('/admin/api/recent-activities');
            const data = await response.json();
            setRecentActivities(data);
        } catch (error) {
            console.error('Error fetching recent activities:', error);
        }
    };

    const fetchUntranslatedMovies = async () => {
        try {
            const response = await fetch(
                '/admin/api/recent-untranslated-movies',
            );
            const data = await response.json();
            setUntranslatedMovies(data);
        } catch (error) {
            console.error('Error fetching untranslated movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return '0m 0s';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round((seconds % 60) * 10) / 10;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <>
            <Head title="Admin Dashboard - Izidasobanuye" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold sm:text-3xl lg:text-4xl">
                                Admin Dashboard
                            </h1>
                            <p className="mt-1 text-gray-400">
                                Manage Izidasobanuye (Untranslated Movies)
                            </p>
                        </div>
                        <div className="text-xs text-gray-400 sm:text-sm">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Untranslated Movies Stats Cards */}
                    <div className="mb-6 sm:mb-8 lg:mb-12">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                            Izidasobanuye (Untranslated) Movies
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                            <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        Total Movies
                                    </CardTitle>
                                    <Film className="h-4 w-4 text-yellow-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? dashboardStats.total_movies.toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-yellow-400">
                                        All movies in system
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        Total Watch Time
                                    </CardTitle>
                                    <Eye className="h-4 w-4 text-blue-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? Math.round(
                                                  dashboardStats.total_watch_time,
                                              ).toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-green-400">
                                        Seconds watched
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        Untranslated Movies
                                    </CardTitle>
                                    <Globe className="h-4 w-4 text-green-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? dashboardStats.untranslated_movie_count.toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-green-400">
                                        Movies needing translation
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        Izisobanuye Movies
                                    </CardTitle>
                                    <Film className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? dashboardStats.izisobanuye_movie_count.toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-purple-400">
                                        Local content
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Overall Stats */}
                    <div className="mb-6 sm:mb-8 lg:mb-12">
                        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
                            <TrendingUp className="h-5 w-5 text-blue-400" />
                            Overall Statistics
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                            <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        Total Views
                                    </CardTitle>
                                    <Eye className="h-4 w-4 text-blue-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? dashboardStats.total_views.toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-green-400">
                                        All movies combined
                                    </p>
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
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? dashboardStats.total_comments.toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-green-400">
                                        User feedback
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium text-gray-400">
                                        Subscribers
                                    </CardTitle>
                                    <Users className="h-4 w-4 text-purple-400" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? dashboardStats.total_subscribers.toLocaleString()
                                            : 'Loading...'}
                                    </div>
                                    <p className="text-xs text-green-400">
                                        Active subscriptions
                                    </p>
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
                                    <div className="text-2xl font-bold">
                                        {dashboardStats
                                            ? `${(dashboardStats.revenue / 1000).toFixed(1)}K`
                                            : 'Loading...'}{' '}
                                        RWF
                                    </div>
                                    <p className="text-xs text-green-400">
                                        From subscriptions
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Untranslated Movies List and Recent Activity */}
                    <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                                    <Film className="h-4 w-4 text-yellow-400 sm:h-5 sm:w-5" />
                                    <span>Recent Untranslated Movies</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                {loading ? (
                                    <p className="text-sm text-gray-400">
                                        Loading...
                                    </p>
                                ) : untranslatedMovies.length > 0 ? (
                                    <div className="space-y-3 sm:space-y-4">
                                        {untranslatedMovies
                                            .slice(0, 8)
                                            .map((movie) => (
                                                <div
                                                    key={movie.id}
                                                    className="flex items-center space-x-3"
                                                >
                                                    {movie.poster ? (
                                                        <img
                                                            src={movie.poster}
                                                            alt={movie.title}
                                                            className="h-10 w-7 flex-shrink-0 rounded object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-10 w-7 flex-shrink-0 items-center justify-center rounded bg-gray-600 text-xs text-gray-400">
                                                            N/A
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium">
                                                            {movie.title}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {movie.release_year ||
                                                                'N/A'}{' '}
                                                            •
                                                            {movie.rating
                                                                ? ` ★ ${movie.rating}`
                                                                : ' No rating'}{' '}
                                                            •{movie.view_count}{' '}
                                                            views
                                                        </p>
                                                    </div>
                                                    <Badge
                                                        variant="outline"
                                                        className="border-yellow-600 text-xs text-yellow-400"
                                                    >
                                                        {movie.interpreter
                                                            ? 'Has Interpreter'
                                                            : 'No Interpreter'}
                                                    </Badge>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400">
                                        No untranslated movies found
                                    </p>
                                )}
                                <div className="mt-4">
                                    <a
                                        href="/admin/untranslated-movies"
                                        className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                                    >
                                        View all untranslated movies →
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-3 sm:pb-4">
                                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                                    <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Recent Activity</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3 sm:space-y-4">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.slice(0, 10).map((activity) => (
                                            <div
                                                key={activity.id}
                                                className="flex items-center space-x-3"
                                            >
                                                <div
                                                    className={`h-2 w-2 flex-shrink-0 rounded-full ${
                                                        activity.type ===
                                                        'user_registration'
                                                            ? 'bg-green-400'
                                                            : activity.type ===
                                                                'movie_view'
                                                              ? 'bg-blue-400'
                                                              : activity.type ===
                                                                  'subscription'
                                                                ? 'bg-yellow-400'
                                                                : activity.type ===
                                                                    'izisobanuye_upload'
                                                                  ? 'bg-purple-400'
                                                                  : 'bg-gray-400'
                                                    }`}
                                                ></div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm">
                                                        {activity.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {activity.timestamp}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">
                                            No recent activities
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
