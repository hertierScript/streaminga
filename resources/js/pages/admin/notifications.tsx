import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Bell,
    Check,
    CheckCheck,
    Eye,
    Clock,
    ArrowLeft
} from 'lucide-react';

interface Notification {
    id: number;
    movie_id: number;
    movie_title: string;
    previous_view_count: number;
    new_view_count: number;
    ip_address: string;
    user_agent: string;
    metadata: any;
    is_read: boolean;
    created_at: string;
    read_at: string | null;
    watch_duration: number | null;
    movie?: {
        id: number;
        title: string;
    };
}

interface PaginationData {
    current_page: number;
    data: Notification[];
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function AdminNotifications() {
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalWatchDuration, setTotalWatchDuration] = useState(0);
    const [activeTab, setActiveTab] = useState<'izisobanuye' | 'izidasobanuye'>('izisobanuye');

    const formatDuration = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            return `${hours}h ${minutes}m ${remainingSeconds}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        } else {
            return `${remainingSeconds}s`;
        }
    };

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        fetchTotalWatchDuration();
        // Mark all as read when page opens
        markAllAsRead();
    }, [activeTab]);

    const fetchNotifications = async (page = 1) => {
        setLoading(true);
        try {
            const type = activeTab === 'izisobanuye' ? 'izisobanuye' : 'translated';
            const response = await fetch(`/admin/api/notifications?page=${page}&type=${type}`);
            const data = await response.json();
            setPagination(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch('/admin/api/notifications/unread-count');
            const data = await response.json();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchTotalWatchDuration = async () => {
        try {
            const endpoint = activeTab === 'izisobanuye'
                ? '/admin/api/total-watch-duration-translated'  // For izisobanuye movies
                : '/admin/api/total-watch-duration-untranslated';  // For izidasobanuye movies
            const response = await fetch(endpoint);
            const data = await response.json();
            setTotalWatchDuration(data.total_duration);
        } catch (error) {
            console.error('Error fetching total watch duration:', error);
        }
    };

    const markAsRead = async (notificationId: number) => {
        try {
            await fetch(`/admin/api/notifications/${notificationId}/mark-read`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            // Update local state immediately
            if (pagination) {
                const updatedData = pagination.data.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, is_read: true, read_at: new Date().toISOString() }
                        : notification
                );
                setPagination({
                    ...pagination,
                    data: updatedData
                });
            }

            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/admin/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });

            // Update local state immediately
            if (pagination) {
                const updatedData = pagination.data.map(notification => ({
                    ...notification,
                    is_read: true,
                    read_at: new Date().toISOString()
                }));
                setPagination({
                    ...pagination,
                    data: updatedData
                });
            }

            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const resetNotifications = async () => {
        if (!confirm('Are you sure you want to reset all notifications? This will delete all notifications and reset IDs.')) {
            return;
        }
        try {
            await fetch('/admin/api/notifications/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                }
            });
            setUnreadCount(0);
            setPagination(null);
            setTotalWatchDuration(0);
        } catch (error) {
            console.error('Error resetting notifications:', error);
        }
    };

    return (
        <>
            <Head title="Notifications" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => window.history.back()}
                                className="text-gray-400 hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <div>
                                <h1 className="text-3xl font-bold flex items-center">
                                    <Bell className="h-8 w-8 mr-3 text-blue-400" />
                                    {activeTab === 'izisobanuye' ? 'Izisobanuye' : 'Izidasobanuye'} Movie View Notifications
                                </h1>
                                <p className="text-gray-400 mt-2">Track when {activeTab === 'izisobanuye' ? 'interpreted' : 'original'} movies are viewed by users</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {unreadCount > 0 && (
                                <Button
                                    onClick={markAllAsRead}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <CheckCheck className="h-4 w-4 mr-2" />
                                    Mark All as Read ({unreadCount})
                                </Button>
                            )}
                            <Button
                                onClick={resetNotifications}
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Reset Notifications
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex space-x-1 mb-6 bg-gray-800 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('izisobanuye')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'izisobanuye'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Izisobanuye Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('izidasobanuye')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                activeTab === 'izidasobanuye'
                                    ? 'bg-red-600 text-white'
                                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                        >
                            Izidasobanuye Notifications
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Bell className="h-8 w-8 text-blue-400" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-400">Total Notifications</p>
                                        <p className="text-2xl font-bold">{pagination?.total || 0}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Eye className="h-8 w-8 text-red-400" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-400">Unread</p>
                                        <p className="text-2xl font-bold text-red-400">{unreadCount}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Check className="h-8 w-8 text-green-400" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-400">Read</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {(pagination?.total || 0) - unreadCount}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gray-800 border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <Clock className="h-8 w-8 text-blue-400" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-400">Total Watch Time</p>
                                        <p className="text-2xl font-bold text-blue-400">
                                            {formatDuration(totalWatchDuration)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Notifications List */}
                <Card className="bg-gray-800 border-gray-700">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading notifications...</p>
                            </div>
                        ) : pagination?.data?.length ? (
                            <div className="space-y-4">
                                {pagination.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 rounded-lg border ${
                                            notification.is_read
                                                ? 'bg-gray-700 border-gray-600'
                                                : 'bg-blue-900/20 border-blue-600'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Badge
                                                        className={
                                                            notification.is_read
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-blue-600 hover:bg-blue-700'
                                                        }
                                                    >
                                                        {notification.is_read ? 'Read' : 'Unread'}
                                                    </Badge>
                                                    <span className="text-sm text-gray-400 flex items-center">
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-semibold mb-2">
                                                    "{notification.movie_title}" was viewed
                                                </h3>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-gray-400">View Count:</span>
                                                        <span className="ml-2 font-medium">
                                                            {notification.previous_view_count} → {notification.new_view_count}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-400">IP Address:</span>
                                                        <span className="ml-2 font-mono text-xs">
                                                            {notification.ip_address}
                                                        </span>
                                                    </div>
                                                    {notification.watch_duration && (
                                                        <div className="md:col-span-2">
                                                            <span className="text-gray-400">Watch Duration:</span>
                                                            <span className="ml-2 font-medium text-green-400">
                                                                {formatDuration(notification.watch_duration)}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {notification.metadata && (
                                                    <div className="mt-3 text-xs text-gray-500">
                                                        <span className="text-gray-400">Referrer:</span>
                                                        <span className="ml-2">
                                                            {notification.metadata.referrer || 'Direct'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {!notification.is_read && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white ml-4"
                                                >
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Mark as Read
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                                <h3 className="text-lg font-medium text-gray-400 mb-2">No notifications yet</h3>
                                <p className="text-gray-500">
                                    Notifications will appear here when users start viewing movies on your platform.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-6">
                        <Button
                            onClick={() => fetchNotifications(pagination.current_page - 1)}
                            disabled={pagination.current_page === 1}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            Previous
                        </Button>
                        <span className="text-gray-400">
                            Page {pagination.current_page} of {pagination.last_page}
                        </span>
                        <Button
                            onClick={() => fetchNotifications(pagination.current_page + 1)}
                            disabled={pagination.current_page === pagination.last_page}
                            variant="outline"
                            className="border-gray-600 text-gray-300 hover:bg-gray-700"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}