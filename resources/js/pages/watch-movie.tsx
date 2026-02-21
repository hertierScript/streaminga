import { Button } from '@/components/ui/button';
import { VideoPlayer } from '@/components/video-player';
import { Head, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
    movie: any;
}

export default function WatchMovie({ movie }: Props) {
    const { auth } = usePage().props as any;

    return (
        <>
            <Head title={`Watch ${movie.title} - Streaminga`} />

            {/* Professional Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
                <div className="mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={() => window.history.back()}
                            variant="ghost"
                            className="text-white hover:bg-gray-800"
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back
                        </Button>
                        <a href="/" className="flex items-center">
                            <img
                                src="/Images/logo.png"
                                alt="Streaminga"
                                className="h-12 w-auto"
                            />
                        </a>
                    </div>
                    <div className="hidden font-medium text-white md:block">
                        {movie.title}
                    </div>
                </div>
            </nav>

            <div className="min-h-screen bg-gray-900 text-white">
                {/* Video Player Section */}
                <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-4 py-4">
                        <VideoPlayer
                            movieId={movie.id}
                            movieFilePath={movie.movie_file_path}
                            title={movie.title}
                        />
                    </div>
                </div>

                {/* Movie Info Section */}
                <div className="mx-auto max-w-7xl px-4 py-8">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            <h1 className="mb-4 text-3xl font-bold">
                                {movie.title}
                            </h1>
                            <div className="mb-6 flex items-center gap-4 text-sm text-gray-300">
                                <span>{movie.releaseYear}</span>
                                <span>•</span>
                                <span>{movie.duration} min</span>
                                <span>•</span>
                                <span>
                                    {movie.rating
                                        ? Math.floor(movie.rating * 10) / 10
                                        : 'N/A'}
                                    /10
                                </span>
                            </div>
                            <div className="prose prose-invert max-w-none">
                                <p className="mb-6 leading-relaxed text-gray-300">
                                    {movie.description}
                                </p>
                            </div>
                            <div className="mb-8">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Genres
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {movie.genre.map((g: string) => (
                                        <span
                                            key={g}
                                            className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                                        >
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="rounded-lg bg-gray-800 p-6">
                                <h3 className="mb-4 text-xl font-semibold">
                                    Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <span className="mb-1 block text-sm text-gray-400">
                                            Quality
                                        </span>
                                        <span className="font-medium text-white">
                                            {movie.movie_file_path
                                                ? 'HD'
                                                : 'HD (Streaming)'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-sm text-gray-400">
                                            Format
                                        </span>
                                        <span className="font-medium text-white">
                                            {movie.movie_file_path
                                                ? 'MP4'
                                                : 'Streaming'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="mb-1 block text-sm text-gray-400">
                                            Source
                                        </span>
                                        <span className="font-medium text-white">
                                            {movie.movie_file_path
                                                ? 'Uploaded'
                                                : 'Vidsrc API'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {movie.trailer && (
                                <div className="mt-6 rounded-lg bg-gray-800 p-6">
                                    <h3 className="mb-4 text-xl font-semibold">
                                        Trailer
                                    </h3>
                                    <Button
                                        onClick={() =>
                                            window.open(movie.trailer, '_blank')
                                        }
                                        className="w-full bg-red-600 text-white hover:bg-red-700"
                                    >
                                        Watch Trailer
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
