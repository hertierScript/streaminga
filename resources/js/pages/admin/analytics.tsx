import { Head } from '@inertiajs/react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    UserCheck,
    TrendingUp,
    TrendingDown,
    Eye,
    Star,
    MessageSquare,
    Calendar,
    Globe,
    Smartphone,
    Monitor,
    Clock,
    Play,
    Film,
    DollarSign,
    BarChart3,
    PieChart
} from 'lucide-react';

// Mock data for analytics
const analyticsData = {
    userStats: {
        totalUsers: 12540,
        activeSubscribers: 8750,
        newSubscribersWeek: 245,
        newSubscribersMonth: 892,
        churnRate: 3.2
    },
    moviePerformance: {
        topMovies: [
            { title: 'Inception', views: 45230, rating: 8.8, comments: 1247 },
            { title: 'The Dark Knight', views: 42150, rating: 9.0, comments: 1156 },
            { title: 'Interstellar', views: 38920, rating: 8.6, comments: 987 },
            { title: 'The Matrix', views: 35680, rating: 8.7, comments: 892 },
            { title: 'Pulp Fiction', views: 33450, rating: 8.9, comments: 756 }
        ],
        averageRating: 8.4,
        totalComments: 15642,
        recentMovies: [
            { title: 'Dune: Part Two', releaseDate: '2024-03-01', views: 12500 },
            { title: 'Oppenheimer', releaseDate: '2023-07-21', views: 18750 },
            { title: 'Barbie', releaseDate: '2023-07-21', views: 22100 }
        ]
    },
    trafficInsights: {
        totalVisits: 892340,
        dau: 12450,
        wau: 45670,
        topLocations: [
            { country: 'United States', percentage: 34.2 },
            { country: 'United Kingdom', percentage: 18.7 },
            { country: 'Canada', percentage: 12.3 }
        ],
        deviceUsage: {
            mobile: 68.5,
            desktop: 31.5
        }
    },
    engagementMetrics: {
        avgWatchTime: '2h 34m',
        trailerViews: 45620,
        fullMoviePlays: 234560,
        totalLikes: 89234,
        totalComments: 15642
    },
    financialMetrics: {
        totalRevenue: 245670,
        revenueByPlan: {
            weekly: 15640,
            monthly: 89230,
            yearly: 140800
        },
        growthData: [
            { month: 'Jan', revenue: 18500 },
            { month: 'Feb', revenue: 22100 },
            { month: 'Mar', revenue: 19800 },
            { month: 'Apr', revenue: 25600 },
            { month: 'May', revenue: 28900 },
            { month: 'Jun', revenue: 31200 }
        ]
    }
};

export default function AdminAnalytics() {
    return (
        <>
            <Head title="Analytics Dashboard" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-gray-400 mt-2">Comprehensive insights into your streaming platform</p>
                </div>

                {/* User & Subscriber Stats */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Users className="mr-3 h-6 w-6" />
                        User & Subscriber Statistics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Total Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.userStats.totalUsers.toLocaleString()}</div>
                                <div className="flex items-center text-sm text-green-400 mt-1">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    +12.5% from last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Active Subscribers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.userStats.activeSubscribers.toLocaleString()}</div>
                                <div className="flex items-center text-sm text-green-400 mt-1">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    +8.3% from last month
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">New This Week</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.userStats.newSubscribersWeek.toLocaleString()}</div>
                                <div className="flex items-center text-sm text-green-400 mt-1">
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    +15.2% from last week
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Churn Rate</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.userStats.churnRate}%</div>
                                <div className="flex items-center text-sm text-red-400 mt-1">
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                    -0.5% from last month
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Movie Performance */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Film className="mr-3 h-6 w-6" />
                        Movie Performance
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Star className="mr-2 h-5 w-5" />
                                    Average Rating
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{analyticsData.moviePerformance.averageRating}</div>
                                <div className="text-sm text-gray-400 mt-1">Across all movies</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MessageSquare className="mr-2 h-5 w-5" />
                                    Total Comments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">{analyticsData.moviePerformance.totalComments.toLocaleString()}</div>
                                <div className="text-sm text-gray-400 mt-1">User reviews & discussions</div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>Top 5 Most Viewed Movies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.moviePerformance.topMovies.map((movie, index) => (
                                        <div key={movie.title} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium">{movie.title}</div>
                                                    <div className="text-sm text-gray-400 flex items-center space-x-2">
                                                        <Eye className="h-3 w-3" />
                                                        <span>{movie.views.toLocaleString()}</span>
                                                        <Star className="h-3 w-3 ml-2" />
                                                        <span>{movie.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant="secondary" className="bg-gray-700">
                                                {movie.comments} comments
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>Recently Added Movies</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analyticsData.moviePerformance.recentMovies.map((movie) => (
                                        <div key={movie.title} className="flex items-center justify-between">
                                            <div>
                                                <div className="font-medium">{movie.title}</div>
                                                <div className="text-sm text-gray-400 flex items-center space-x-2">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>{movie.releaseDate}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium">{movie.views.toLocaleString()}</div>
                                                <div className="text-sm text-gray-400">views</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Traffic Insights */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <Globe className="mr-3 h-6 w-6" />
                        Traffic Insights
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Total Visits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.trafficInsights.totalVisits.toLocaleString()}</div>
                                <div className="text-sm text-green-400 mt-1">+18.7% from last month</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Daily Active Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.trafficInsights.dau.toLocaleString()}</div>
                                <div className="text-sm text-green-400 mt-1">+5.2% from yesterday</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Weekly Active Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.trafficInsights.wau.toLocaleString()}</div>
                                <div className="text-sm text-green-400 mt-1">+12.1% from last week</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Device Usage</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Smartphone className="h-4 w-4" />
                                            <span className="text-sm">Mobile</span>
                                        </div>
                                        <span className="font-medium">{analyticsData.trafficInsights.deviceUsage.mobile}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Monitor className="h-4 w-4" />
                                            <span className="text-sm">Desktop</span>
                                        </div>
                                        <span className="font-medium">{analyticsData.trafficInsights.deviceUsage.desktop}%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle>Top Locations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analyticsData.trafficInsights.topLocations.map((location, index) => (
                                    <div key={location.country} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <span className="font-medium">{location.country}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">{location.percentage}%</div>
                                            <div className="w-24 bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{ width: `${location.percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Engagement Metrics */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <BarChart3 className="mr-3 h-6 w-6" />
                        Engagement Metrics
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Avg Watch Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.engagementMetrics.avgWatchTime}</div>
                                <div className="text-sm text-gray-400 mt-1">Per user session</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                                    <Play className="mr-2 h-4 w-4" />
                                    Trailer Views
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.engagementMetrics.trailerViews.toLocaleString()}</div>
                                <div className="text-sm text-gray-400 mt-1">Total trailer plays</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                                    <Film className="mr-2 h-4 w-4" />
                                    Full Movie Plays
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{analyticsData.engagementMetrics.fullMoviePlays.toLocaleString()}</div>
                                <div className="text-sm text-gray-400 mt-1">Complete movie views</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">Total Interactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">
                                    {(analyticsData.engagementMetrics.totalLikes + analyticsData.engagementMetrics.totalComments).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                    {analyticsData.engagementMetrics.totalLikes.toLocaleString()} likes, {analyticsData.engagementMetrics.totalComments.toLocaleString()} comments
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Financial Metrics */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <DollarSign className="mr-3 h-6 w-6" />
                        Financial Overview
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>Total Revenue</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold">${analyticsData.financialMetrics.totalRevenue.toLocaleString()}</div>
                                <div className="text-sm text-green-400 mt-1">+23.5% from last month</div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardHeader>
                                <CardTitle>Revenue by Plan</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Yearly Plan</span>
                                        <span className="font-medium">${analyticsData.financialMetrics.revenueByPlan.yearly.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Monthly Plan</span>
                                        <span className="font-medium">${analyticsData.financialMetrics.revenueByPlan.monthly.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Weekly Plan</span>
                                        <span className="font-medium">${analyticsData.financialMetrics.revenueByPlan.weekly.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="bg-gray-800 border-gray-700 mt-6">
                        <CardHeader>
                            <CardTitle>Revenue Growth (Last 6 Months)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end space-x-4 h-32">
                                {analyticsData.financialMetrics.growthData.map((data, index) => (
                                    <div key={data.month} className="flex flex-col items-center flex-1">
                                        <div
                                            className="bg-red-600 w-full rounded-t"
                                            style={{
                                                height: `${(data.revenue / Math.max(...analyticsData.financialMetrics.growthData.map(d => d.revenue))) * 100}%`,
                                                minHeight: '20px'
                                            }}
                                        ></div>
                                        <div className="text-xs text-gray-400 mt-2">{data.month}</div>
                                        <div className="text-xs font-medium">${(data.revenue / 1000).toFixed(0)}k</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}