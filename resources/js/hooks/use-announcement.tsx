import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AnnouncementContextType {
    message: string;
    backgroundColor: string;
    isEnabled: boolean;
    dismissible: boolean;
    scroll: boolean;
    setAnnouncement: (message: string, backgroundColor?: string, dismissible?: boolean, scroll?: boolean) => void;
    enableAnnouncement: () => void;
    disableAnnouncement: () => void;
    clearAnnouncement: () => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

export function AnnouncementProvider({ children }: { children: ReactNode }) {
    const [message, setMessage] = useState('');
    const [backgroundColor, setBackgroundColor] = useState('#3b82f6');
    const [isEnabled, setIsEnabled] = useState(true);
    const [dismissible, setDismissible] = useState(true);
    const [scroll, setScroll] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const loadFromStorage = () => {
            const savedMessage = localStorage.getItem('announcement-message');
            const savedColor = localStorage.getItem('announcement-color');
            const savedEnabled = localStorage.getItem('announcement-enabled');
            const savedDismissible = localStorage.getItem('announcement-dismissible');
            const savedScroll = localStorage.getItem('announcement-scroll');

            setMessage(savedMessage || '');
            if (savedColor) setBackgroundColor(savedColor);
            if (savedEnabled !== null) setIsEnabled(savedEnabled === 'true');
            if (savedDismissible !== null) setDismissible(savedDismissible === 'true');
            if (savedScroll !== null) setScroll(savedScroll === 'true');
        };

        loadFromStorage();

        // Listen for localStorage changes from other tabs
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key && e.key.startsWith('announcement-')) {
                loadFromStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const setAnnouncement = (newMessage: string, newColor: string = '#3b82f6', newDismissible: boolean = true, newScroll: boolean = false) => {
        setMessage(newMessage);
        setBackgroundColor(newColor);
        setDismissible(newDismissible);
        setScroll(newScroll);
        setIsEnabled(true);

        // Save to localStorage
        localStorage.setItem('announcement-message', newMessage);
        localStorage.setItem('announcement-color', newColor);
        localStorage.setItem('announcement-enabled', 'true');
        localStorage.setItem('announcement-dismissible', newDismissible.toString());
        localStorage.setItem('announcement-scroll', newScroll.toString());

        // Reset dismissal when new announcement is set
        localStorage.removeItem('announcement-dismissed');
    };

    const enableAnnouncement = () => {
        setIsEnabled(true);
        localStorage.setItem('announcement-enabled', 'true');
    };

    const disableAnnouncement = () => {
        setIsEnabled(false);
        localStorage.setItem('announcement-enabled', 'false');
    };

    const clearAnnouncement = () => {
        setMessage('');
        setIsEnabled(false);
        localStorage.removeItem('announcement-message');
        localStorage.removeItem('announcement-color');
        localStorage.removeItem('announcement-enabled');
        localStorage.removeItem('announcement-dismissible');
        localStorage.removeItem('announcement-scroll');
    };

    const value = {
        message: isEnabled ? message : '',
        backgroundColor,
        isEnabled,
        dismissible,
        scroll,
        setAnnouncement,
        enableAnnouncement,
        disableAnnouncement,
        clearAnnouncement,
    };

    return (
        <AnnouncementContext.Provider value={value}>
            {children}
        </AnnouncementContext.Provider>
    );
}

export function useAnnouncement() {
    const context = useContext(AnnouncementContext);
    if (context === undefined) {
        throw new Error('useAnnouncement must be used within an AnnouncementProvider');
    }
    return context;
}