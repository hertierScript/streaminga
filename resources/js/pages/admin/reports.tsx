import { Head } from '@inertiajs/react';
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
import { useState } from 'react';

export default function AdminReports() {
    const [activeSection, setActiveSection] = useState('movies');
    const [timeRange, setTimeRange] = useState('30d');

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
                            <Select value={timeRange} onValueChange={setTimeRange}>
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
                                                <p className="text-2xl font-bold">1,247</p>
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
                                                <p className="text-2xl font-bold">23</p>
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
                                                <p className="text-2xl font-bold">Inception</p>
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
                                                <p className="text-2xl font-bold">4.2</p>
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
                                        {[
                                            { genre: 'Action', count: 245, percentage: 19.6 },
                                            { genre: 'Drama', count: 198, percentage: 15.9 },
                                            { genre: 'Comedy', count: 167, percentage: 13.4 },
                                            { genre: 'Sci-Fi', count: 134, percentage: 10.7 },
                                            { genre: 'Thriller', count: 123, percentage: 9.9 },
                                            { genre: 'Romance', count: 98, percentage: 7.9 },
                                            { genre: 'Horror', count: 87, percentage: 7.0 },
                                            { genre: 'Documentary', count: 76, percentage: 6.1 },
                                            { genre: 'Animation', count: 65, percentage: 5.2 },
                                            { genre: 'Other', count: 54, percentage: 4.3 },
                                        ].map((item) => (
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
                                            {[
                                                { title: 'Inception', views: '2.4M', rating: 4.8 },
                                                { title: 'The Dark Knight', views: '2.1M', rating: 4.9 },
                                                { title: 'Interstellar', views: '1.9M', rating: 4.7 },
                                                { title: 'Pulp Fiction', views: '1.7M', rating: 4.6 },
                                                { title: 'The Matrix', views: '1.6M', rating: 4.5 },
                                            ].map((movie, index) => (
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
                                            {[
                                                { title: 'The Shawshank Redemption', rating: 4.9, votes: '2.3M' },
                                                { title: 'The Godfather', rating: 4.9, votes: '1.8M' },
                                                { title: 'The Dark Knight', rating: 4.9, votes: '2.4M' },
                                                { title: 'Pulp Fiction', rating: 4.8, votes: '1.9M' },
                                                { title: 'Forrest Gump', rating: 4.8, votes: '2.0M' },
                                            ].map((movie, index) => (
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
                                                <p className="text-2xl font-bold">45,678</p>
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
                                                <p className="text-2xl font-bold">32,145</p>
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
                                                <p className="text-2xl font-bold">2,341</p>
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
                                                <p className="text-2xl font-bold">2h 15m</p>
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
                                            <div className="text-3xl font-bold text-green-400 mb-2">70.5%</div>
                                            <p className="text-sm text-gray-400">Active Users</p>
                                            <p className="text-lg font-semibold">32,145</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-yellow-400 mb-2">20.3%</div>
                                            <p className="text-sm text-gray-400">Inactive Users</p>
                                            <p className="text-lg font-semibold">9,267</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-red-400 mb-2">9.2%</div>
                                            <p className="text-sm text-gray-400">Dormant Users</p>
                                            <p className="text-lg font-semibold">4,266</p>
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
                                            <div className="text-2xl font-bold text-green-400 mb-1">18,234</div>
                                            <p className="text-sm text-gray-400">Active</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-red-400 mb-1">2,145</div>
                                            <p className="text-sm text-gray-400">Expired</p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-400 mb-1">1,567</div>
                                            <p className="text-sm text-gray-400">Canceled</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 mb-1">15,678</div>
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
                                        {[
                                            { name: 'john_doe', watchTime: '156h 32m', movies: 89 },
                                            { name: 'movie_lover', watchTime: '142h 15m', movies: 76 },
                                            { name: 'cinema_fan', watchTime: '138h 45m', movies: 82 },
                                            { name: 'film_buff', watchTime: '129h 18m', movies: 71 },
                                            { name: 'stream_user', watchTime: '124h 52m', movies: 68 },
                                        ].map((user, index) => (
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
                                                <p className="text-2xl font-bold">$45,678</p>
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
                                                <p className="text-2xl font-bold">1,234</p>
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
                                                <p className="text-2xl font-bold">856</p>
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
                                                <p className="text-2xl font-bold">123</p>
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
                                            <div className="text-2xl font-bold text-green-400 mb-2">$28,945</div>
                                            <p className="text-sm text-gray-400 mb-1">Monthly Plans</p>
                                            <p className="text-lg">63.4%</p>
                                        </div>
                                        <div className="text-center p-6 bg-gray-700 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 mb-2">$12,345</div>
                                            <p className="text-sm text-gray-400 mb-1">Yearly Plans</p>
                                            <p className="text-lg">27.0%</p>
                                        </div>
                                        <div className="text-center p-6 bg-gray-700 rounded-lg">
                                            <div className="text-2xl font-bold text-purple-400 mb-2">$4,388</div>
                                            <p className="text-sm text-gray-400 mb-1">Weekly Plans</p>
                                            <p className="text-lg">9.6%</p>
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
                                                <p className="text-xl font-bold text-green-400">+1,234</p>
                                                <p className="text-sm text-green-400">+15.2%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium">Renewals</p>
                                                <p className="text-sm text-gray-400">Last 30 days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-blue-400">856</p>
                                                <p className="text-sm text-blue-400">+8.7%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                                            <div>
                                                <p className="font-medium">Cancellations</p>
                                                <p className="text-sm text-gray-400">Last 30 days</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-bold text-red-400">123</p>
                                                <p className="text-sm text-red-400">-2.1%</p>
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
                                                <p className="text-2xl font-bold">12,456</p>
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
                                                <p className="text-2xl font-bold">2,341</p>
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
                                                <p className="text-2xl font-bold">Inception</p>
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
                                                <p className="text-2xl font-bold">89</p>
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
                                        {[
                                            { title: 'Inception', comments: 234, engagement: 'High' },
                                            { title: 'The Dark Knight', comments: 198, engagement: 'High' },
                                            { title: 'Interstellar', comments: 187, engagement: 'High' },
                                            { title: 'Pulp Fiction', comments: 156, engagement: 'Medium' },
                                            { title: 'The Matrix', comments: 143, engagement: 'Medium' },
                                        ].map((movie, index) => (
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
                                            <div className="text-2xl font-bold text-green-400 mb-1">10,234</div>
                                            <p className="text-sm text-gray-400">Approved</p>
                                        </div>
                                        <div className="text-center p-4 bg-yellow-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-yellow-400 mb-1">1,567</div>
                                            <p className="text-sm text-gray-400">Pending</p>
                                        </div>
                                        <div className="text-center p-4 bg-red-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-red-400 mb-1">89</div>
                                            <p className="text-sm text-gray-400">Flagged</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-900/20 rounded-lg">
                                            <div className="text-2xl font-bold text-blue-400 mb-1">566</div>
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
                                                <p className="text-2xl font-bold">99.8%</p>
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
                                                <p className="text-2xl font-bold">2.4TB</p>
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
                                                <p className="text-2xl font-bold">0.02%</p>
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
                                                <p className="text-2xl font-bold">245ms</p>
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
                                        {[
                                            { time: '2 hours ago', error: 'Video streaming buffer timeout', severity: 'Medium' },
                                            { time: '5 hours ago', error: 'Database connection timeout', severity: 'High' },
                                            { time: '1 day ago', error: 'Payment gateway timeout', severity: 'Medium' },
                                            { time: '2 days ago', error: 'CDN cache miss rate high', severity: 'Low' },
                                            { time: '3 days ago', error: 'User authentication failure', severity: 'Medium' },
                                        ].map((error, index) => (
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
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">Video Content</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-gray-700 rounded-full h-3">
                                                    <div className="bg-blue-600 h-3 rounded-full" style={{ width: '75%' }}></div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400 w-20 text-right">1.8TB</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">User Data</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-gray-700 rounded-full h-3">
                                                    <div className="bg-green-600 h-3 rounded-full" style={{ width: '15%' }}></div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400 w-20 text-right">360GB</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">System Logs</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-gray-700 rounded-full h-3">
                                                    <div className="bg-yellow-600 h-3 rounded-full" style={{ width: '5%' }}></div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400 w-20 text-right">120GB</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="flex-1">Available</span>
                                            <div className="flex-1 mx-4">
                                                <div className="w-full bg-gray-700 rounded-full h-3">
                                                    <div className="bg-gray-600 h-3 rounded-full" style={{ width: '5%' }}></div>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-400 w-20 text-right">120GB</span>
                                        </div>
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