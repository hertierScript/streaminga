import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-red-500" />
                <p className="text-white text-lg font-semibold">Loading...</p>
            </div>
        </div>
    );
}