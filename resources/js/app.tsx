import '../css/app.css';

import React, { useState, useEffect } from 'react';
import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import { AnnouncementProvider } from './hooks/use-announcement';
import { LoadingScreen } from './components/loading-screen';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function AppWrapper({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [navigating, setNavigating] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handleShowLoading = () => setNavigating(true);
        const handleFinish = () => {
            // Show spinner for at least 2 seconds during navigation
            setTimeout(() => {
                setNavigating(false);
            }, 2000);
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
            <AnnouncementProvider>
                <AppWrapper>
                    <App {...props} />
                </AppWrapper>
            </AnnouncementProvider>
        );
    },
    progress: false,
});

// This will set light / dark mode on load...
initializeTheme();
