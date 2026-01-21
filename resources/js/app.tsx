import '../css/app.css';

import React, { useState, useEffect } from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { AnnouncementProvider } from './hooks/use-announcement';
import { LoadingScreen } from './components/loading-screen';
import { AuthProvider } from './contexts/AuthContext';


const appName = import.meta.env.VITE_APP_NAME || 'Laravel';


function AppWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        // Remove artificial delay - show content immediately
        setLoading(false);
    }, []);

    useEffect(() => {
        const handleShowLoading = () => setNavigating(true);
        const handleFinish = () => {
            // Show spinner briefly during navigation, then hide immediately
            setNavigating(false);
        };

        window.addEventListener('showLoading', handleShowLoading);
        router.on('finish', handleFinish);

        return () => {
            window.removeEventListener('showLoading', handleShowLoading);
        };
    }, []);

    return (
        <>
            {(loading || navigating) && <LoadingScreen />}
            {children}
        </>
    );
}

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <AuthProvider>
                <AnnouncementProvider>
                    <AppWrapper>
                        <App {...props} />
                    </AppWrapper>
                </AnnouncementProvider>
            </AuthProvider>
        );
    },
    progress: false,
});

// This will set light / dark mode on load...
initializeTheme();
