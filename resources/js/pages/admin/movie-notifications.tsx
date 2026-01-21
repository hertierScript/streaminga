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

type NotificationType = 'untranslated' | 'translated' | 'read';

export default function MovieNotifications() {
    // Commented out notification-related code as requested
    /*
    const [type, setType] = useState<NotificationType>('untranslated');
    const [showToggle, setShowToggle] = useState(true);
    const [displayType, setDisplayType] = useState<NotificationType>('untranslated');

    useEffect(() => {
        const currentPath = window.location.pathname;
        const isUntranslatedPath = currentPath.includes('/untranslated');
        const isTranslatedPath = currentPath.includes('/translated');
        const isReadPath = currentPath.includes('/read');
        const isGeneralPath = currentPath === '/admin/notifications';

        if (isUntranslatedPath) {
            setType('translated'); // Show translated data
            setDisplayType('untranslated'); // But display as untranslated
        } else if (isTranslatedPath) {
            setType('translated');
            setDisplayType('translated');
        } else if (isReadPath) {
            setType('read');
            setDisplayType('read');
        } else {
            setType('untranslated');
            setDisplayType('untranslated');
        }

        setShowToggle(!isReadPath); // Hide toggle on read page
    }, []);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [totalWatchDuration, setTotalWatchDuration] = useState(0);

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

    const getColors = () => {
        if (displayType === 'untranslated') {
            return { primary: 'orange', secondary: 'orange' };
        } else if (displayType === 'translated') {
            return { primary: 'green', secondary: 'green' };
        } else if (displayType === 'read') {
            return { primary: 'blue', secondary: 'blue' };
        }
        return { primary: 'gray', secondary: 'gray' };
    };

    const colors = getColors();

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
        fetchTotalWatchDuration();
        // Mark all as read when page opens or type changes
        markAllAsRead();
    }, [type]);

    const fetchNotifications = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`/admin/api/notifications?type=${type}&page=${page}`);
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
            const response = await fetch('/admin/api/notification-counts');
            const data = await response.json();
            setUnreadCount(data[type]);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchTotalWatchDuration = async () => {
        try {
            const response = await fetch(`/admin/api/total-watch-duration-${type}`);
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

            // Remove the notification from the list (move to read page)
            if (pagination) {
                const updatedData = pagination.data.filter(notification => notification.id !== notificationId);
                setPagination({
                    ...pagination,
                    data: updatedData,
                    total: pagination.total - 1,
                    to: pagination.to - 1
                });
            }

            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`/admin/api/notifications/mark-all-read?type=${type}`, {
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
        if (!confirm(`Are you sure you want to delete all ${displayType} movie notifications? This action cannot be undone.`)) {
            return;
        }
        try {
            await fetch(`/admin/api/notifications/reset?type=${type}`, {
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
    */

    return (
        <>
            <Head title="Movie Notifications" />

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
                                    Movie Notifications
                                </h1>
                                <p className="text-gray-400 mt-2">Track when movies are viewed by users</p>
                            </div>
                        </div>
                    </div>

                    {/* Placeholder content since notifications are commented out */}
                    <div className="text-center py-12">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">Notifications temporarily disabled</h3>
                        <p className="text-gray-500">
                            Notification functionality has been commented out for debugging.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}