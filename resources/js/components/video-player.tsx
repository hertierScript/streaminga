import { Button } from '@/components/ui/button';
import { Play, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface VideoPlayerProps {
    movieId: string;
    movieFilePath?: string;
    title: string;
}

export function VideoPlayer({
    movieId,
    movieFilePath,
    title,
}: VideoPlayerProps) {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleIframeLoad = () => {
        setIsLoading(false);
        setIsError(false);
    };

    const handleIframeError = () => {
        setIsLoading(false);
        setIsError(true);
    };

    const handleReload = () => {
        setIsLoading(true);
        setIsError(false);
    };

    // If movie file path is available, use it directly
    if (movieFilePath) {
        return (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
                <video
                    src={`/${movieFilePath}`}
                    controls
                    className="h-full w-full object-contain"
                    poster={`https://via.placeholder.com/1280x720/1a1a1a/ffffff?text=${encodeURIComponent(title)}`}
                    onError={handleIframeError}
                    onLoadedData={handleIframeLoad}
                >
                    Your browser does not support the video tag.
                </video>
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                        <div className="flex flex-col items-center gap-2">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                            <p className="text-sm font-medium text-white">
                                Loading video...
                            </p>
                        </div>
                    </div>
                )}
                {isError && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-4 text-center">
                        <div className="max-w-md">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                                <Play
                                    className="h-8 w-8 text-red-500"
                                    fill="currentColor"
                                />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-white">
                                Video Unavailable
                            </h3>
                            <p className="mb-6 text-gray-300">
                                This movie is not available right now. Please
                                try again later.
                            </p>
                            <Button
                                onClick={handleReload}
                                className="transform rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-all hover:scale-105 hover:bg-red-700"
                            >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Fallback to vidsrc iframe
    return (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl">
            {!isError && (
                <iframe
                    src={`https://vidsrc.to/embed/movie/${movieId}`}
                    className="h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title={title}
                />
            )}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                        <p className="text-sm font-medium text-white">
                            Loading video player...
                        </p>
                    </div>
                </div>
            )}
            {isError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 p-4 text-center">
                    <div className="max-w-md">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                            <Play
                                className="h-8 w-8 text-red-500"
                                fill="currentColor"
                            />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-white">
                            Video Unavailable
                        </h3>
                        <p className="mb-6 text-gray-300">
                            This movie is not available right now. Please try
                            again later.
                        </p>
                        <Button
                            onClick={handleReload}
                            className="transform rounded-lg bg-red-600 px-6 py-2 font-medium text-white transition-all hover:scale-105 hover:bg-red-700"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Another Server
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
