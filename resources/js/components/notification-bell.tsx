import { useEffect, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Notification {
    id: number;
    movie_id: number;
    movie_title: string;
    previous_view_count: number;
    new_view_count: number;
    is_read: boolean;
    created_at: string;
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
}

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState<PaginationData | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUnreadCount();

        // Refresh count when window gets focus (user returns to tab)
        const handleFocus = () => fetchUnreadCount();
        window.addEventListener('focus', handleFocus);

        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await fetch('/admin/api/notifications/unread-count');
            const data = await response.json();
            setUnreadCount(data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const fetchNotifications = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const response = await fetch('/admin/api/notifications');
            const data = await response.json();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
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
            fetchUnreadCount();
            fetchNotifications();
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
            setUnreadCount(0);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (open && !notifications) {
            fetchNotifications();
        }
    };

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => window.location.href = '/admin/notifications'}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-600">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>
                )}
            </Button>
        </div>
    );
}