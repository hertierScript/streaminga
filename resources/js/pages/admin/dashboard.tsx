import { Head } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminSidebar } from '@/components/admin-sidebar';
import { movies } from '@/data/movies';
import {
    Activity,
    BarChart3,
    Eye,
    MessageSquare,
    TrendingUp,
    Users,
    DollarSign,
    Clock
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface WatchDurationStats {
    total_duration: number;
    average_duration: number;
    total_views_with_duration: number;
}

export default function AdminDashboard() {
    const [watchStats, setWatchStats] = useState<WatchDurationStats | null>(null);

    useEffect(() => {
        fetchWatchStats();
    }, []);

    const fetchWatchStats = async () => {
        try {
            const response = await fetch('/admin/api/watch-duration-stats');
            const data = await response.json();
            setWatchStats(data);
        } catch (error) {
            console.error('Error fetching watch stats:', error);
        }
    };

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    return (
        <>
            <Head title="Admin Dashboard" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Admin Dashboard</h1>
                        <div className="text-xs sm:text-sm text-gray-400">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                    </div>

                    {/* Quick Stats Cards */}
                    <div className="mb-6 sm:mb-8 lg:mb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
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

                        <Card className="hover:bg-gray-750 border-gray-700 bg-gray-800 transition-colors">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-400">
                                    Avg Watch Time
                                </CardTitle>
                                <Clock className="h-4 w-4 text-purple-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {watchStats ? formatDuration(watchStats.average_duration) : 'Loading...'}
                                </div>
                                <p className="text-xs text-green-400">
                                    {watchStats ? `${watchStats.total_views_with_duration} views` : ''}
                                </p>
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
                                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
                                    <span>Top Performing Movies</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3 sm:space-y-4">
                                    {movies.slice(0, 5).map((movie, index) => (
                                        <div key={movie.id} className="flex items-center space-x-3">
                                            <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-gray-700 text-xs sm:text-sm font-bold flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <img
                                                src={movie.poster}
                                                alt={movie.title}
                                                className="h-8 w-6 sm:h-10 sm:w-7 rounded object-cover flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{movie.title}</p>
                                                <p className="text-xs text-gray-400">{movie.rating} ★</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}