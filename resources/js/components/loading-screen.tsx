import { Loader2 } from 'lucide-react';

export function LoadingScreen() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900">
            <div className="flex flex-col items-center space-y-6">
                <Loader2 className="h-16 w-16 animate-spin text-red-600" />
                <p className="text-xl font-semibold text-white">
                    Please wait...
                </p>
            </div>
        </div>
    );
}
