import { Head, usePage, router } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminSidebar } from '@/components/admin-sidebar';
import {
    Film,
    Users,
    CreditCard,
    MessageSquare,
    AlertTriangle,
    TrendingUp,
    Download,
    Calendar,
    Eye,
    Star,
    DollarSign,
    BarChart3,
    PieChart,
    Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface ReportsPageProps {
    reportsData?: ReportsData;
    timeRange?: string;
}

interface ReportsData {
    movies: {
        total_movies: number;
        new_this_month: number;
        most_viewed: string;
        avg_rating: number;
        movies_by_genre: Array<{
            genre: string;
            count: number;
            percentage: number;
        }>;
        most_viewed_movies: Array<{
            title: string;
            views: string;
            rating: number;
        }>;
        highest_rated_movies: Array<{
            title: string;
            rating: number;
            votes: string;
        }>;
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
        top_users: Array<{
            name: string;
            watchTime: string;
            movies: number;
        }>;
    };
    subscription: {
        monthly_revenue: number;
        new_subscriptions: number;
        renewals: number;
        cancellations: number;
        revenue_breakdown: {
            monthly_plans: { amount: number; percentage: number };
            yearly_plans: { amount: number; percentage: number };
            weekly_plans: { amount: number; percentage: number };
        };
        subscription_trends: {
            new_subscriptions: { count: number; change: number };
            renewals: { count: number; change: number };
            cancellations: { count: number; change: number };
        };
    };
    engagement: {
        total_comments: number;
        comments_this_month: number;
        most_commented_movie: string;
        flagged_comments: number;
        most_commented_movies: Array<{
            title: string;
            comments: number;
            engagement: string;
        }>;
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
        recent_errors: Array<{
            time: string;
            error: string;
            severity: string;
        }>;
        storage_breakdown: Array<{
            category: string;
            used: string;
            percentage: number;
        }>;
    };
}

export default function AdminReports({ reportsData: initialReportsData, timeRange: initialTimeRange }: ReportsPageProps) {
    const { user, loading: authLoading } = useAuth();


    // Initialize with fallback data
    const fallbackData: ReportsData = {
        movies: {
            total_movies: 0,
            new_this_month: 0,
            most_viewed: 'N/A',
            avg_rating: 0,
            movies_by_genre: [],
            most_viewed_movies: [],
            highest_rated_movies: []
        },
        users: {
            total_users: 0,
            active_users: 0,
            new_this_month: 0,
            avg_watch_time: '0h 0m',
            user_activity: { active: { count: 0, percentage: 0 }, inactive: { count: 0, percentage: 0 }, dormant: { count: 0, percentage: 0 } },
            subscription_overview: { active: 0, expired: 0, canceled: 0, free_trial: 0 },
            top_users: []
        },
        subscription: {
            monthly_revenue: 0,
            new_subscriptions: 0,
            renewals: 0,
            cancellations: 0,
            revenue_breakdown: { monthly_plans: { amount: 0, percentage: 0 }, yearly_plans: { amount: 0, percentage: 0 }, weekly_plans: { amount: 0, percentage: 0 } },
            subscription_trends: { new_subscriptions: { count: 0, change: 0 }, renewals: { count: 0, change: 0 }, cancellations: { count: 0, change: 0 } }
        },
        engagement: {
            total_comments: 0,
            comments_this_month: 0,
            most_commented_movie: 'N/A',
            flagged_comments: 0,
            most_commented_movies: [],
            comment_status: { approved: 0, pending: 0, flagged: 0, admin_replies: 0 }
        },
        system: {
            system_uptime: 99.8,
            storage_used: '2.4TB',
            error_rate: 0.02,
            avg_response_time: 245,
            recent_errors: [],
            storage_breakdown: []
        }
    };

    const [activeSection, setActiveSection] = useState('movies');
    const [timeRange, setTimeRange] = useState(initialTimeRange || '30d');
    const [reportsData, setReportsData] = useState<ReportsData>(initialReportsData || fallbackData);

    // Fetch real data from API when time range changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/admin/api/reports-data?time_range=${timeRange}`);
                setReportsData(response.data);
            } catch (error) {
                console.error('Failed to fetch reports data:', error);
                // Keep fallback data
            }
        };

        fetchData();
    }, [timeRange]);

    const sections = [
        { id: 'movies', label: 'Movies Reports', icon: Film },
        { id: 'users', label: 'User Reports', icon: Users },
        { id: 'subscription', label: 'Subscription & Payment', icon: CreditCard },
        { id: 'engagement', label: 'Comments & Engagement', icon: MessageSquare },
        { id: 'system', label: 'System Reports', icon: AlertTriangle },
    ];


    return (
        <>
            <Head title="Reports & Insights" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Reports & Insights</h1>
                        <div className="flex items-center space-x-4">
                            <Select value={timeRange} onValueChange={(value) => {
                                setTimeRange(value);
                                router.visit('/admin/reports', {
                                    method: 'get',
                                    data: { time_range: value },
                                    preserveState: false,
                                    preserveScroll: false,
                                });
                            }}>
                                <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                    <SelectItem value="7d">Last 7 days</SelectItem>
                                    <SelectItem value="30d">Last 30 days</SelectItem>
                                    <SelectItem value="90d">Last 90 days</SelectItem>
                                    <SelectItem value="1y">Last year</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button variant="outline" className="border-gray-600">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-4">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-red-600 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{section.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Movies Reports */}
                    {activeSection === 'movies' && (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Total Movies</p>
                                                <p className="text-2xl font-bold">{reportsData.movies.total_movies.toLocaleString()}</p>
                                            </div>
                                            <Film className="h-8 w-8 text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">New This Month</p>
                                                <p className="text-2xl font-bold">{reportsData.movies.new_this_month}</p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Most Viewed</p>
                                                <p className="text-2xl font-bold">{reportsData.movies.most_viewed || 'N/A'}</p>
                                            </div>
                                            <Eye className="h-8 w-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Avg Rating</p>
                                                <p className="text-2xl font-bold">{reportsData.movies.avg_rating}</p>
                                            </div>
                                            <Star className="h-8 w-8 text-yellow-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Movies by Category */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Movies by Category/Genre</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {reportsData.movies.movies_by_genre.map((item) => (
                                            <div key={item.genre} className="flex items-center justify-between">
                                                <span className="flex-1">{item.genre}</span>
                                                <div className="flex-1 mx-4">
                                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                                        <div
                                                            className="bg-red-600 h-2 rounded-full"
                                                            style={{ width: `${item.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-400 w-16 text-right">{item.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Movies Tables */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardHeader>
                                        <CardTitle>Most Viewed Movies</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {reportsData.movies.most_viewed_movies.map((movie, index) => (
                                                <div key={movie.title} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg font-bold text-red-400">#{index + 1}</span>
                                                        <div>
                                                            <p className="font-medium">{movie.title}</p>
                                                            <p className="text-sm text-gray-400">{movie.views} views</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm">{movie.rating}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-gray-700 bg-gray-800">
                                    <CardHeader>
                                        <CardTitle>Highest Rated Movies</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {reportsData.movies.highest_rated_movies.map((movie, index) => (
                                                <div key={movie.title} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-lg font-bold text-red-400">#{index + 1}</span>
                                                        <div>
                                                            <p className="font-medium">{movie.title}</p>
                                                            <p className="text-sm text-gray-400">{movie.votes} votes</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-1">
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="text-sm">{movie.rating}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* User Reports */}
                    {activeSection === 'users' && (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Total Users</p>
                                                <p className="text-2xl font-bold">{reportsData.users.total_users.toLocaleString()}</p>
                                            </div>
                                            <Users className="h-8 w-8 text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Active Users</p>
                                                <p className="text-2xl font-bold">{reportsData.users.active_users.toLocaleString()}</p>
                                            </div>
                                            <Activity className="h-8 w-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">New This Month</p>
                                                <p className="text-2xl font-bold">{reportsData.users.new_this_month.toLocaleString()}</p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Avg Watch Time</p>
                                                <p className="text-2xl font-bold">{reportsData.users.avg_watch_time}</p>
                                            </div>
                                            <Eye className="h-8 w-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* User Activity Breakdown */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>User Activity Status</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-400 mb-2">{reportsData.users.user_activity.active.percentage}%</div>
                                            <p className="text-sm text-gray-400">Active Users</p>
                                            <p className="text-lg font-semibold">{reportsData.users.user_activity.active.count.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-400 mb-2">{reportsData.users.user_activity.inactive.percentage}%</div>
                                            <p className="text-sm text-gray-400">Inactive Users</p>
                                            <p className="text-lg font-semibold">{reportsData.users.user_activity.inactive.count.toLocaleString()}</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-red-400 mb-2">{reportsData.users.user_activity.dormant.percentage}%</div>
                                            <p className="text-sm text-gray-400">Dormant Users</p>
                                            <p className="text-lg font-semibold">{reportsData.users.user_activity.dormant.count.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subscription Overview */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Subscription Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="text-center p-4 bg-green-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-green-400 mb-1">{reportsData.users.subscription_overview.active.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Active</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-red-400 mb-1">{reportsData.users.subscription_overview.expired.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Expired</p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-400 mb-1">{reportsData.users.subscription_overview.canceled.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Canceled</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 mb-1">{reportsData.users.subscription_overview.free_trial.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Free Trial</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Users */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Top Users by Watch Time</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {reportsData.users.top_users.map((user, index) => (
                                            <div key={user.name} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-lg font-bold text-red-400">#{index + 1}</span>
                                                    <div>
                                                        <p className="font-medium">{user.name}</p>
                                                        <p className="text-sm text-gray-400">{user.movies} movies watched</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">{user.watchTime}</p>
                                                    <p className="text-sm text-gray-400">total watch time</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Subscription & Payment Reports */}
                    {activeSection === 'subscription' && (
                        <div className="space-y-6">
                            {/* Revenue Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Monthly Revenue</p>
                                                <p className="text-2xl font-bold">${reportsData.subscription.monthly_revenue.toLocaleString()}</p>
                                            </div>
                                            <DollarSign className="h-8 w-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">New Subscriptions</p>
                                                <p className="text-2xl font-bold">{reportsData.subscription.new_subscriptions.toLocaleString()}</p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Renewals</p>
                                                <p className="text-2xl font-bold">{reportsData.subscription.renewals.toLocaleString()}</p>
                                            </div>
                                            <Activity className="h-8 w-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Cancellations</p>
                                                <p className="text-2xl font-bold">{reportsData.subscription.cancellations.toLocaleString()}</p>
                                            </div>
                                            <AlertTriangle className="h-8 w-8 text-red-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Revenue Breakdown */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Revenue Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center p-6 bg-gray-700 rounded-lg">
                                            <div className="text-2xl font-bold text-green-400 mb-2">${reportsData.subscription.revenue_breakdown.monthly_plans.amount.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400 mb-1">Monthly Plans</p>
                                            <p className="text-lg">{reportsData.subscription.revenue_breakdown.monthly_plans.percentage}%</p>
                                        </div>
                                        <div className="text-center p-6 bg-gray-700 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 mb-2">${reportsData.subscription.revenue_breakdown.yearly_plans.amount.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400 mb-1">Yearly Plans</p>
                                            <p className="text-lg">{reportsData.subscription.revenue_breakdown.yearly_plans.percentage}%</p>
                                        </div>
                                        <div className="text-center p-6 bg-gray-700 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-400 mb-2">${reportsData.subscription.revenue_breakdown.weekly_plans.amount.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400 mb-1">Weekly Plans</p>
                                            <p className="text-lg">{reportsData.subscription.revenue_breakdown.weekly_plans.percentage}%</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Subscription Trends */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Subscription Trends</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium">New Subscriptions</p>
                                                <p className="text-sm text-gray-400">Last 30 days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-green-400">+{reportsData.subscription.subscription_trends.new_subscriptions.count.toLocaleString()}</p>
                                                <p className="text-sm text-green-400">+{reportsData.subscription.subscription_trends.new_subscriptions.change}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium">Renewals</p>
                                                <p className="text-sm text-gray-400">Last 30 days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-blue-400">{reportsData.subscription.subscription_trends.renewals.count.toLocaleString()}</p>
                                                <p className="text-sm text-blue-400">+{reportsData.subscription.subscription_trends.renewals.change}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium">Cancellations</p>
                                                <p className="text-sm text-gray-400">Last 30 days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-red-400">{reportsData.subscription.subscription_trends.cancellations.count.toLocaleString()}</p>
                                                <p className="text-sm text-red-400">{reportsData.subscription.subscription_trends.cancellations.change > 0 ? '+' : ''}{reportsData.subscription.subscription_trends.cancellations.change}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Export Options */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Export Payment Reports</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Button variant="outline" className="border-gray-600 justify-start">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export as CSV
                                        </Button>
                                        <Button variant="outline" className="border-gray-600 justify-start">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export as PDF
                                        </Button>
                                        <Button variant="outline" className="border-gray-600 justify-start">
                                            <Download className="h-4 w-4 mr-2" />
                                            Export as Excel
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Comments & Engagement Reports */}
                    {activeSection === 'engagement' && (
                        <div className="space-y-6">
                            {/* Overview Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Total Comments</p>
                                                <p className="text-2xl font-bold">{reportsData.engagement.total_comments.toLocaleString()}</p>
                                            </div>
                                            <MessageSquare className="h-8 w-8 text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Comments This Month</p>
                                                <p className="text-2xl font-bold">{reportsData.engagement.comments_this_month.toLocaleString()}</p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Most Commented Movie</p>
                                                <p className="text-2xl font-bold">{reportsData.engagement.most_commented_movie}</p>
                                            </div>
                                            <BarChart3 className="h-8 w-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Flagged Comments</p>
                                                <p className="text-2xl font-bold">{reportsData.engagement.flagged_comments.toLocaleString()}</p>
                                            </div>
                                            <AlertTriangle className="h-8 w-8 text-red-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Comments per Movie */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Most Commented Movies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {reportsData.engagement.most_commented_movies.map((movie, index) => (
                                            <div key={movie.title} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-lg font-bold text-red-400">#{index + 1}</span>
                                                    <div>
                                                        <p className="font-medium">{movie.title}</p>
                                                        <p className="text-sm text-gray-400">{movie.comments} comments</p>
                                                    </div>
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    movie.engagement === 'High' ? 'bg-green-900 text-green-300' :
                                                    movie.engagement === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                                    'bg-red-900 text-red-300'
                                                }`}>
                                                    {movie.engagement} Engagement
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Comment Status Breakdown */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Comment Status Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        <div className="text-center p-4 bg-green-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-green-400 mb-1">{reportsData.engagement.comment_status.approved.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Approved</p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-400 mb-1">{reportsData.engagement.comment_status.pending.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Pending</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-red-400 mb-1">{reportsData.engagement.comment_status.flagged.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Flagged</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 mb-1">{reportsData.engagement.comment_status.admin_replies.toLocaleString()}</div>
                                            <p className="text-sm text-gray-400">Admin Replies</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* System Reports */}
                    {activeSection === 'system' && (
                        <div className="space-y-6">
                            {/* System Health Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">System Uptime</p>
                                                <p className="text-2xl font-bold">{reportsData.system.system_uptime}%</p>
                                            </div>
                                            <Activity className="h-8 w-8 text-green-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Storage Used</p>
                                                <p className="text-2xl font-bold">{reportsData.system.storage_used}</p>
                                            </div>
                                            <BarChart3 className="h-8 w-8 text-blue-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Error Rate</p>
                                                <p className="text-2xl font-bold">{reportsData.system.error_rate}%</p>
                                            </div>
                                            <AlertTriangle className="h-8 w-8 text-yellow-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-gray-700 bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-400">Avg Response Time</p>
                                                <p className="text-2xl font-bold">{reportsData.system.avg_response_time}ms</p>
                                            </div>
                                            <TrendingUp className="h-8 w-8 text-purple-400" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Error Logs */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Recent System Errors</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {reportsData.system.recent_errors.map((error, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                                <div className="flex items-center space-x-3">
                                                    <AlertTriangle className={`h-5 w-5 ${
                                                        error.severity === 'High' ? 'text-red-400' :
                                                        error.severity === 'Medium' ? 'text-yellow-400' :
                                                        'text-blue-400'
                                                    }`} />
                                                    <div>
                                                        <p className="font-medium">{error.error}</p>
                                                        <p className="text-sm text-gray-400">{error.time}</p>
                                                    </div>
                                                </div>
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                    error.severity === 'High' ? 'bg-red-900 text-red-300' :
                                                    error.severity === 'Medium' ? 'bg-yellow-900 text-yellow-300' :
                                                    'bg-blue-900 text-blue-300'
                                                }`}>
                                                    {error.severity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Storage Usage */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Storage Usage Breakdown</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {reportsData.system.storage_breakdown.map((item, index) => (
                                            <div key={item.category} className="flex items-center justify-between">
                                                <span className="flex-1">{item.category}</span>
                                                <div className="flex-1 mx-4">
                                                    <div className="w-full bg-gray-700 rounded-full h-3">
                                                        <div
                                                            className={`h-3 rounded-full ${
                                                                index === 0 ? 'bg-blue-600' :
                                                                index === 1 ? 'bg-green-600' :
                                                                index === 2 ? 'bg-yellow-600' :
                                                                'bg-gray-600'
                                                            }`}
                                                            style={{ width: `${item.percentage}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-400 w-20 text-right">{item.used}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Export System Logs */}
                            <Card className="border-gray-700 bg-gray-800">
                                <CardHeader>
                                    <CardTitle>Export System Logs</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Button variant="outline" className="border-gray-600 justify-start">
                                            <Download className="h-4 w-4 mr-2" />
                                            Error Logs
                                        </Button>
                                        <Button variant="outline" className="border-gray-600 justify-start">
                                            <Download className="h-4 w-4 mr-2" />
                                            Access Logs
                                        </Button>
                                        <Button variant="outline" className="border-gray-600 justify-start">
                                            <Download className="h-4 w-4 mr-2" />
                                            Performance Logs
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}