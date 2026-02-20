import { AdminSidebar } from '@/components/admin-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import {
    BarChart3,
    Clock,
    DollarSign,
    Eye,
    Film,
    Globe,
    MessageSquare,
    Star,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface ReportsData {
    movies: {
        total_movies: number;
        new_this_month: number;
        most_viewed: string;
        avg_rating: number;
        movies_by_genre: { genre: string; count: number; percentage: number }[];
        most_viewed_movies: { title: string; views: string; rating: number }[];
        highest_rated_movies: {
            title: string;
            rating: number;
            votes: string;
        }[];
    };
    users: {
        total_users: number;
        active_users: number;
        new_this_month: number;
        avg_watch_time: string;
        user_activity: {
            active: { count: number; percentage: number };
            inactive: { count: number; percentage: number };
            dormant: { count: number; percentage: number };
        };
        subscription_overview: {
            active: number;
            expired: number;
            canceled: number;
            free_trial: number;
        };
        top_users: { name: string; watchTime: string; movies: number }[];
    };
    subscription: {
        monthly_revenue: number;
        new_subscriptions: number;
        renewals: number;
        cancellations: number;
    };
    engagement: {
        total_comments: number;
        comments_this_month: number;
        most_commented_movie: string;
        flagged_comments: number;
        most_commented_movies: {
            title: string;
            comments: number;
            engagement: string;
        }[];
        comment_status: {
            approved: number;
            pending: number;
            flagged: number;
            admin_replies: number;
        };
    };
    system: {
        system_uptime: number;
        storage_used: string;
        error_rate: number;
        avg_response_time: number;
    };
}

export default function AdminAnalytics() {
    const [reportsData, setReportsData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d');

    useEffect(() => {
        fetchReportsData();
    }, [timeRange]);

    const fetchReportsData = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `/admin/api/reports-data?time_range=${timeRange}`,
            );
            const data = await response.json();
            setReportsData(data);
        } catch (error) {
            console.error('Error fetching reports data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Head title="Analytics Dashboard" />
                <AdminSidebar />
                <div className="flex min-h-screen items-center justify-center bg-gray-900 p-8 text-white lg:ml-64">
                    <div className="text-xl">Loading analytics data...</div>
                </div>
            </>
        );
    }

    if (!reportsData) {
        return (
            <>
                <Head title="Analytics Dashboard" />
                <AdminSidebar />
                <div className="flex min-h-screen items-center justify-center bg-gray-900 p-8 text-white lg:ml-64">
                    <div className="text-xl">Failed to load analytics data</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Analytics Dashboard" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 p-8 text-white lg:ml-64">
                <div className="mb-8">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Analytics Dashboard
                            </h1>
                            <p className="mt-2 text-gray-400">
                                Comprehensive insights into your streaming
                                platform
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {['7d', '30d', '90d', '1y'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`rounded px-4 py-2 ${
                                        timeRange === range
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {range === '7d'
                                        ? '7 Days'
                                        : range === '30d'
                                          ? '30 Days'
                                          : range === '90d'
                                            ? '90 Days'
                                            : '1 Year'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* User & Subscriber Stats */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <Users className="mr-3 h-6 w-6" />
                        User & Subscriber Statistics
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Total Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.users.total_users.toLocaleString()}
                                </div>
                                <div className="mt-1 flex items-center text-sm text-green-400">
                                    <TrendingUp className="mr-1 h-4 w-4" />
                                    {reportsData.users.new_this_month} new this
                                    month
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Active Subscribers
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.users.subscription_overview.active.toLocaleString()}
                                </div>
                                <div className="mt-1 flex items-center text-sm text-gray-400">
                                    {
                                        reportsData.users.subscription_overview
                                            .expired
                                    }{' '}
                                    expired,{' '}
                                    {
                                        reportsData.users.subscription_overview
                                            .canceled
                                    }{' '}
                                    canceled
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Active Users
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.users.active_users.toLocaleString()}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    {
                                        reportsData.users.user_activity.active
                                            .percentage
                                    }
                                    % of total
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Free Trials
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.users.subscription_overview.free_trial.toLocaleString()}
                                </div>
                                <div className="mt-1 text-sm text-blue-400">
                                    Trial users
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Movie Performance */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <Film className="mr-3 h-6 w-6" />
                        Movie Performance
                    </h2>
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Film className="mr-2 h-5 w-5" />
                                    Total Movies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.movies.total_movies}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    {reportsData.movies.new_this_month} new this
                                    month
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Star className="mr-2 h-5 w-5" />
                                    Average Rating
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.movies.avg_rating}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Across all movies
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Eye className="mr-2 h-5 w-5" />
                                    Most Viewed
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="truncate text-xl font-bold">
                                    {reportsData.movies.most_viewed || 'N/A'}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Top performing
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    Total Comments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.engagement.total_comments.toLocaleString()}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    User reviews
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle>Top 5 Most Viewed Movies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {reportsData.movies.most_viewed_movies &&
                                    reportsData.movies.most_viewed_movies
                                        .length > 0 ? (
                                        reportsData.movies.most_viewed_movies.map(
                                            (movie, index) => (
                                                <div
                                                    key={movie.title}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="max-w-[200px] truncate font-medium">
                                                                {movie.title}
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                                <Eye className="h-3 w-3" />
                                                                <span>
                                                                    {
                                                                        movie.views
                                                                    }
                                                                </span>
                                                                <Star className="ml-2 h-3 w-3" />
                                                                <span>
                                                                    {
                                                                        movie.rating
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-gray-400">
                                            No movie data available
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle>
                                    Top 5 Highest Rated Movies
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {reportsData.movies.highest_rated_movies &&
                                    reportsData.movies.highest_rated_movies
                                        .length > 0 ? (
                                        reportsData.movies.highest_rated_movies.map(
                                            (movie, index) => (
                                                <div
                                                    key={movie.title}
                                                    className="flex items-center justify-between"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-600 text-sm font-bold">
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <div className="max-w-[200px] truncate font-medium">
                                                                {movie.title}
                                                            </div>
                                                            <div className="flex items-center space-x-2 text-sm text-gray-400">
                                                                <Star className="h-3 w-3 text-yellow-400" />
                                                                <span>
                                                                    {
                                                                        movie.rating
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <p className="text-gray-400">
                                            No movie data available
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Movies by Genre */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <BarChart3 className="mr-3 h-6 w-6" />
                        Movies by Genre
                    </h2>
                    <Card className="border-gray-700 bg-gray-800">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {reportsData.movies.movies_by_genre &&
                                reportsData.movies.movies_by_genre.length >
                                    0 ? (
                                    reportsData.movies.movies_by_genre.map(
                                        (genre) => (
                                            <div
                                                key={genre.genre}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <span className="w-32 font-medium">
                                                        {genre.genre}
                                                    </span>
                                                </div>
                                                <div className="flex max-w-md flex-1 items-center space-x-3">
                                                    <div className="h-2 w-full rounded-full bg-gray-700">
                                                        <div
                                                            className="h-2 rounded-full bg-red-600"
                                                            style={{
                                                                width: `${genre.percentage}%`,
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="w-16 text-sm text-gray-400">
                                                        {genre.count} (
                                                        {genre.percentage}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <p className="text-gray-400">
                                        No genre data available
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Engagement Metrics */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <BarChart3 className="mr-3 h-6 w-6" />
                        Engagement Metrics
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Avg Watch Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.users.avg_watch_time}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Per user session
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center text-sm font-medium text-gray-400">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Comments This Month
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.engagement.comments_this_month.toLocaleString()}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    New comments
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Flagged Comments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.engagement.flagged_comments}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Need moderation
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Comment Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-green-400">
                                            Approved:
                                        </span>
                                        <span>
                                            {
                                                reportsData.engagement
                                                    .comment_status.approved
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-yellow-400">
                                            Pending:
                                        </span>
                                        <span>
                                            {
                                                reportsData.engagement
                                                    .comment_status.pending
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-400">
                                            Flagged:
                                        </span>
                                        <span>
                                            {
                                                reportsData.engagement
                                                    .comment_status.flagged
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Financial Metrics */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <DollarSign className="mr-3 h-6 w-6" />
                        Financial Overview
                    </h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle>Monthly Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.subscription.monthly_revenue.toLocaleString()}{' '}
                                    RWF
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Estimated
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle>New Subscriptions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.subscription.new_subscriptions}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    In selected period
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle>Renewals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.subscription.renewals}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    In selected period
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle>Cancellations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">
                                    {reportsData.subscription.cancellations}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    In selected period
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Top Users by Watch Time */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <Users className="mr-3 h-6 w-6" />
                        Top Users by Watch Time
                    </h2>
                    <Card className="border-gray-700 bg-gray-800">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {reportsData.users.top_users &&
                                reportsData.users.top_users.length > 0 ? (
                                    reportsData.users.top_users.map(
                                        (user, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div
                                                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                                                            index === 0
                                                                ? 'bg-yellow-600'
                                                                : index === 1
                                                                  ? 'bg-gray-400'
                                                                  : index === 2
                                                                    ? 'bg-orange-600'
                                                                    : 'bg-gray-700'
                                                        }`}
                                                    >
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {user.movies} movies
                                                            watched
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-lg font-bold">
                                                    {user.watchTime}
                                                </div>
                                            </div>
                                        ),
                                    )
                                ) : (
                                    <p className="text-gray-400">
                                        No user watch data available
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Stats */}
                <div className="mb-8">
                    <h2 className="mb-6 flex items-center text-2xl font-bold">
                        <Globe className="mr-3 h-6 w-6" />
                        System Status
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    System Uptime
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.system.system_uptime}%
                                </div>
                                <div className="mt-1 text-sm text-green-400">
                                    Operational
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Storage Used
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.system.storage_used}
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Total storage
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Error Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.system.error_rate}%
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Last 24 hours
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Avg Response
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {reportsData.system.avg_response_time}ms
                                </div>
                                <div className="mt-1 text-sm text-gray-400">
                                    Response time
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
