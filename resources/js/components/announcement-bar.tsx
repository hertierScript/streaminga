import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
    message?: string;
    backgroundColor?: string;
    dismissible?: boolean;
    scroll?: boolean;
}

export function AnnouncementBar({ message, backgroundColor = '#3b82f6', dismissible = true, scroll = false }: AnnouncementBarProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if announcement was previously dismissed
        const dismissed = localStorage.getItem('announcement-dismissed');
        if (dismissed) {
            setIsDismissed(true);
        }
    }, []);

    useEffect(() => {
        // Show announcement if message exists and (not dismissible OR not dismissed)
        if (message && (!dismissible || !isDismissed)) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [message, isDismissed, dismissible]);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        localStorage.setItem('announcement-dismissed', 'true');
    };

    if (!isVisible || !message) {
        return null;
    }

    // Determine text color based on background brightness
    const getTextColor = (bgColor: string) => {
        // Simple brightness calculation
        const hex = bgColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? 'text-black' : 'text-white';
    };

    const textColorClass = getTextColor(backgroundColor);

    return (
        <div
            key={message}
            className={`px-4 py-2 text-center text-sm relative overflow-hidden`}
            style={{ backgroundColor, color: textColorClass.replace('text-', '') }}
        >
            {scroll ? (
                <div className="whitespace-nowrap">
                    <span className="inline-block animate-scroll-right-to-left">
                        {message}
                    </span>
                </div>
            ) : (
                <span className="block sm:inline">{message}</span>
            )}
            {dismissible && (
                <button
                    onClick={handleDismiss}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/20 rounded-full transition-colors z-10"
                    aria-label="Dismiss announcement"
                    style={{ color: textColorClass.replace('text-', '') }}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}