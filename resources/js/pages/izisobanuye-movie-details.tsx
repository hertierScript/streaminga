import { AnnouncementBar } from '@/components/announcement-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnnouncement } from '@/hooks/use-announcement';
import { Comment, Movie } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowLeft,
    Check,
    Film,
    Heart,
    Home,
    LogOut,
    Menu,
    Play,
    Search,
    Send,
    Star,
    User,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    movie: Movie;
}

export default function IzisobanuyeMovieDetails({ movie }: Props) {
    const { auth } = usePage().props as any;
    const [comments, setComments] = useState<Comment[]>([]);
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [movieModal, setMovieModal] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const {
        message: announcementMessage,
        backgroundColor,
        dismissible,
        scroll,
    } = useAnnouncement();

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetchComments();
        // Increment view count for this movie
        incrementViewCount();

        const startTime = Date.now();

        const handleBeforeUnload = () => {
            const duration = Math.floor((Date.now() - startTime) / 1000);
            // Send duration update
            axios.post(`/admin/api/movies/${movie.id}/increment-view`, {
                watch_duration: duration
            }).catch(error => {
                console.error('Error updating watch duration:', error);
            });
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Also send on unmount
            const duration = Math.floor((Date.now() - startTime) / 1000);
            axios.post(`/admin/api/movies/${movie.id}/increment-view`, {
                watch_duration: duration
            }).catch(error => {
                console.error('Error updating watch duration:', error);
            });
        };
    }, [movie.id]);

    const incrementViewCount = async () => {
        try {
            await axios.post(`/admin/api/movies/${movie.id}/increment-view`);
        } catch (error) {
            console.error('Error incrementing view count:', error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get(
                `/api/comments?movie_id=${movie.id}`,
            );
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        // Frontend validation
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!nameRegex.test(name)) {
            setErrors({ name: 'Name must contain only letters and spaces.' });
            setLoading(false);
            return;
        }

        const messageRegex = /^[a-zA-Z0-9\s]+$/;
        if (!messageRegex.test(message)) {
            setErrors({
                message:
                    'Message must contain only letters, numbers, and spaces.',
            });
            setLoading(false);
            return;
        }

        if (/(.)\1{3,}/.test(message)) {
            setErrors({
                message:
                    'Message cannot contain more than 3 consecutive same letters.',
            });
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/comments', {
                movie_id: movie.id,
                name,
                message,
            });
            setName('');
            setMessage('');
            fetchComments();
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return (
            new Date(dateString).toLocaleDateString() +
            ' ' +
            new Date(dateString).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
            })
        );
    };

    const isAdmin = (comment: Comment) => {
        return comment.name === 'streaminga' || comment.user?.role === 'admin';
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Redirect to movies page with search query
            window.location.href = `/movies?search=${encodeURIComponent(searchQuery.trim())}`;
        }
    };
    return (
        <>
            <Head title={movie.title} />

            {/* Announcement Bar */}
            <AnnouncementBar
                message={announcementMessage}
                backgroundColor={backgroundColor}
                dismissible={dismissible}
                scroll={scroll}
            />

            {/* Professional Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
                <div className="mx-auto px-3 sm:px-4">
                    <div className="flex h-14 items-center justify-between sm:h-16">
                        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
                            <Link
                                href="/"
                                preserveScroll
                                className="flex flex-shrink-0 items-center"
                            >
                                <img
                                    src="/Images/logo.png"
                                    alt="Streaminga"
                                    className="h-22 w-auto pt-2"
                                />
                            </Link>
                            <div className="hidden space-x-4 md:flex lg:space-x-6">
                                <Link
                                    href="/izisobanuye"
                                    preserveScroll
                                    className="text-sm text-gray-300 transition-colors hover:text-white lg:text-base"
                                >
                                    <Home className="mr-1 inline h-3 w-3 lg:h-4 lg:w-4" />
                                    izisobanuye
                                </Link>
                                <Link
                                    href="/izidasobanuye"
                                    preserveScroll
                                    className="text-sm text-gray-300 transition-colors hover:text-white lg:text-base"
                                >
                                    <Film className="mr-1 inline h-3 w-3 lg:h-4 lg:w-4" />
                                    izidasobanuye
                                </Link>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mx-4 hidden max-w-xs flex-1 md:block lg:mx-8 lg:max-w-md">
                            <form onSubmit={handleSearch} className="relative">
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search movies..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="rounded-full border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-sm text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-red-500"
                                />
                            </form>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setIsMobileMenuOpen(!isMobileMenuOpen)
                                    }
                                    className="p-2 text-white"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                    ) : (
                                        <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                                    )}
                                </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                                <a
                                    href="tel:*182*8*1*1090675#"
                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700 sm:px-4 sm:py-2"
                                >
                                    <Heart className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
                                    Donate
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="border-t border-gray-800 py-4 md:hidden">
                            <div className="space-y-4">
                                <form
                                    onSubmit={handleSearch}
                                    className="relative"
                                >
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search movies..."
                                        value={searchQuery}
                                        onChange={(e) =>
                                            setSearchQuery(e.target.value)
                                        }
                                        className="rounded-lg border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400"
                                    />
                                </form>
                                <Button
                                    type="button"
                                    onClick={handleSearch}
                                    className="flex w-full items-center justify-center space-x-2 rounded-lg bg-red-600 py-2 text-white hover:bg-red-700"
                                >
                                    <Search className="h-4 w-4" />
                                    <span>Search Movies</span>
                                </Button>
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href="/"
                                        preserveScroll
                                        className="py-2 text-gray-300 hover:text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Home className="mr-2 inline h-4 w-4" />
                                        izisobanuye
                                    </Link>
                                    <Link
                                        href="/izidasobanuye"
                                        preserveScroll
                                        className="py-2 text-gray-300 hover:text-white"
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Film className="mr-2 inline h-4 w-4" />
                                        izidasobanuye
                                    </Link>
                                    <div className="space-y-2">
                                        <a
                                            href="tel:*182*8*1*1090675#"
                                            className="py-2 text-gray-300 hover:text-white block"
                                        >
                                            <Heart className="mr-2 inline h-4 w-4" />
                                            Donate
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            <div className="bg-gray-800 px-3 py-2 sm:px-4 sm:py-3">
                <Button
                    onClick={() => window.history.back()}
                    variant="outline"
                    className="w-full border-gray-600 text-sm text-white hover:bg-gray-700 sm:w-auto sm:text-base"
                >
                    <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Back to Movies
                </Button>
            </div>

            <div className="min-h-screen bg-gray-900 text-white">
                {/* Hero Section */}
                <div className="relative flex h-[60vh] items-center justify-center bg-gray-900 sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
                    {/* Background Poster */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: movie.poster ? `url(${movie.poster})` : 'none',
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black/70"></div>

                    {/* Content */}
                    <div className="relative z-20 mx-auto w-full max-w-4xl px-6 text-center sm:px-8 lg:px-12">
                        <h1 className="mb-2 text-2xl leading-tight font-bold text-shadow-lg sm:mb-3 sm:text-3xl md:mb-4 md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
                            {movie.title}
                        </h1>
                        <div className="mb-3 flex flex-col items-center justify-center gap-2 sm:mb-4 sm:flex-row sm:gap-4 md:mb-6">
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Star className="h-3 w-3 flex-shrink-0 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                                <span className="text-sm font-semibold sm:text-base md:text-lg lg:text-xl">
                                    {movie.rating ? (Math.floor(movie.rating * 10) / 10) : 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-300 sm:gap-4 sm:text-sm md:text-base lg:text-lg">
                                <span className="hidden sm:inline">•</span>
                                <span className="whitespace-nowrap">
                                    {movie.releaseYear}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="whitespace-nowrap">
                                    {movie.duration}min
                                </span>
                            </div>
                        </div>
                        <div className="mb-4 px-2 sm:mb-6 sm:px-4 md:mb-8">
                            <div className="flex max-w-full flex-wrap justify-center gap-1 overflow-hidden sm:gap-2">
                                {movie.genre.slice(0, 4).map((g) => (
                                    <Badge
                                        key={g}
                                        className="flex-shrink-0 bg-red-600 px-2 py-1 text-xs whitespace-nowrap hover:bg-red-700 sm:text-sm"
                                    >
                                        {g}
                                    </Badge>
                                ))}
                                {movie.genre.length > 4 && (
                                    <Badge className="flex-shrink-0 bg-gray-600 px-2 py-1 text-xs whitespace-nowrap sm:text-sm">
                                        +{movie.genre.length - 4}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="mx-auto flex max-w-sm flex-col justify-center gap-3 px-6 sm:max-w-md sm:flex-row sm:gap-4 sm:px-8">
                            <Button
                                className="w-full min-w-0 bg-red-600 px-4 py-3 text-sm text-white transition-all duration-200 hover:bg-red-700 sm:px-6 sm:py-4 sm:text-base"
                                onClick={() => {
                                    if (movie.movie_file_path) {
                                        // Use uploaded movie file
                                        window.open(`/${movie.movie_file_path}`, '_blank');
                                    } else {
                                        // Fallback to external link
                                        window.open(
                                            `https://vidsrc.to/embed/movie/${movie.id}`,
                                            '_blank',
                                        );
                                    }
                                }}
                            >
                                <Play className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                <span className="truncate">Watch Now</span>
                            </Button>
                            <Button
                                className="w-full min-w-0 bg-green-600 px-4 py-3 text-sm text-white transition-all duration-200 hover:bg-green-700 sm:px-6 sm:py-4 sm:text-base"
                                onClick={() => {
                                    if (movie.movie_file_path) {
                                        // Download the movie file
                                        const link = document.createElement('a');
                                        link.href = `/${movie.movie_file_path}`;
                                        link.download = `${movie.title}.mp4`;
                                        link.click();
                                    }
                                }}
                                disabled={!movie.movie_file_path}
                            >
                                <svg className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="truncate">Download</span>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full min-w-0 border-white/80 px-4 py-3 text-sm text-white transition-all duration-200 hover:bg-white hover:text-black sm:px-6 sm:py-4 sm:text-base"
                                onClick={() =>
                                    movie.trailer &&
                                    window.open(movie.trailer, '_blank')
                                }
                                disabled={!movie.trailer}
                            >
                                <Film className="mr-2 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
                                <span className="truncate">Watch Trailer</span>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="bg-gray-900">
                    <div className="mx-auto w-full max-w-full px-4 py-8 sm:max-w-4xl sm:px-6 sm:py-10 md:max-w-5xl md:px-8 md:py-16 lg:max-w-6xl lg:px-12">
                        <div className="space-y-6 sm:space-y-8 md:space-y-12 lg:space-y-16">
                            {/* Overview Section */}
                            <div className="mx-auto max-w-4xl px-2 sm:px-0">
                                <h2 className="mb-3 text-center text-lg font-bold text-white sm:mb-4 sm:text-xl md:text-2xl lg:text-3xl">
                                    Overview
                                </h2>
                                <p className="rounded-lg bg-black/30 p-3 text-xs leading-relaxed break-words text-gray-200 backdrop-blur-sm sm:p-4 sm:text-sm md:p-6 md:text-base lg:p-8 lg:text-lg">
                                    {movie.description}
                                </p>
                            </div>

                            {/* Movie Details Grid */}
                            <div className="mx-auto max-w-4xl px-2 sm:px-0">
                                <h2 className="mb-4 text-center text-lg font-bold text-white sm:mb-6 sm:text-xl md:text-2xl lg:text-3xl">
                                    Movie Details
                                </h2>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6 lg:grid-cols-3">
                                    <div className="rounded-lg border border-gray-700/50 bg-black/40 p-3 text-center backdrop-blur-sm sm:p-4 md:p-6">
                                        <div className="mb-1 text-lg font-bold text-white sm:mb-2 sm:text-xl md:text-2xl lg:text-3xl">
                                            {movie.releaseYear}
                                        </div>
                                        <div className="text-xs text-gray-300 sm:text-sm">
                                            Release Year
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-700/50 bg-black/40 p-3 text-center backdrop-blur-sm sm:p-4 md:p-6">
                                        <div className="mb-1 text-lg font-bold text-white sm:mb-2 sm:text-xl md:text-2xl lg:text-3xl">
                                            {movie.duration}min
                                        </div>
                                        <div className="text-xs text-gray-300 sm:text-sm">
                                            Duration
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-gray-700/50 bg-black/40 p-3 text-center backdrop-blur-sm sm:col-span-2 sm:p-4 md:p-6 lg:col-span-1">
                                        <div className="mb-1 text-lg font-bold text-white sm:mb-2 sm:text-xl md:text-2xl lg:text-3xl">
                                            {movie.rating ? (Math.floor(movie.rating * 10) / 10) : 'N/A'}/10
                                        </div>
                                        <div className="text-xs text-gray-300 sm:text-sm">
                                            Rating
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments Section */}
                            <div className="mx-auto max-w-4xl">
                                <h2 className="mb-6 text-center text-xl font-bold text-white sm:text-2xl md:text-3xl">
                                    Comments
                                </h2>

                                {/* Comment Form */}
                                <div className="mb-4 rounded-lg border border-gray-700/50 bg-black/40 p-3 backdrop-blur-sm sm:mb-6 sm:p-4 md:p-6">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3 sm:mb-4">
                                            <Input
                                                type="text"
                                                placeholder="Your name"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="border-gray-600 bg-gray-800 text-sm text-white placeholder-gray-400 sm:text-base"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-xs text-red-400 sm:text-sm">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                        <div className="mb-3 sm:mb-4">
                                            <textarea
                                                placeholder="Write your comment..."
                                                value={message}
                                                onChange={(e) =>
                                                    setMessage(
                                                        e.target.value,
                                                    )
                                                }
                                                className="min-h-[80px] w-full rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:outline-none sm:min-h-[100px] sm:text-base"
                                                required
                                            />
                                            {errors.message && (
                                                <p className="mt-1 text-xs text-red-400 sm:text-sm">
                                                    {errors.message}
                                                </p>
                                            )}
                                        </div>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                            className="bg-red-600 text-sm text-white hover:bg-red-700 sm:text-base"
                                        >
                                            <Send className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                            {loading
                                                ? 'Posting...'
                                                : 'Post Comment'}
                                        </Button>
                                    </form>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-3 sm:space-y-4">
                                    {comments.map((comment) => (
                                        <div
                                            key={comment.id}
                                            className="rounded-lg border border-gray-700/50 bg-black/40 p-3 backdrop-blur-sm sm:p-4 md:p-6"
                                        >
                                            <div className="flex items-start space-x-3 sm:space-x-4">
                                                <div className="flex-shrink-0">
                                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 sm:h-10 sm:w-10">
                                                        <span className="text-xs font-bold text-white sm:text-sm">
                                                            {comment.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-medium text-white sm:text-base">
                                                                {comment.name}
                                                            </span>
                                                            {isAdmin(
                                                                comment,
                                                            ) && (
                                                                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 sm:h-5 sm:w-5">
                                                                    <Check className="h-2 w-2 text-white sm:h-3 sm:w-3" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2 text-xs text-gray-400 sm:text-sm">
                                                            <span className="sm:hidden">
                                                                •
                                                            </span>
                                                            <span>
                                                                {formatDate(
                                                                    comment.created_at,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="mb-2 text-sm leading-relaxed text-gray-200 sm:mb-3 sm:text-base">
                                                        {comment.message}
                                                    </p>

                                                    {/* Status Badges */}
                                                    <div className="mb-2 flex flex-wrap gap-1 sm:mb-3 sm:gap-2">
                                                        {comment.replies &&
                                                            comment.replies
                                                                .length > 0 && (
                                                                <Badge className="bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700">
                                                                    Admin
                                                                    Replied
                                                                </Badge>
                                                            )}
                                                    </div>

                                                    {/* Replies */}
                                                    {comment.replies &&
                                                        comment.replies.length >
                                                            0 && (
                                                            <div className="ml-4 space-y-2 sm:ml-6 sm:space-y-3">
                                                                {comment.replies.map(
                                                                    (reply) => (
                                                                        <div
                                                                            key={
                                                                                reply.id
                                                                            }
                                                                            className="rounded-lg border border-blue-500/30 bg-blue-900/30 p-2 sm:p-3"
                                                                        >
                                                                            <div className="mb-1 flex flex-col sm:mb-2 sm:flex-row sm:items-center sm:space-x-2">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <span className="text-sm font-semibold text-blue-300">
                                                                                        {
                                                                                            reply.name
                                                                                        }
                                                                                    </span>
                                                                                    {isAdmin(
                                                                                        reply,
                                                                                    ) && (
                                                                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 sm:h-5 sm:w-5">
                                                                                            <Check className="h-2 w-2 text-white sm:h-3 sm:w-3" />
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex items-center space-x-2 text-xs text-gray-400">
                                                                                    <span>
                                                                                        replied
                                                                                        to{' '}
                                                                                        {
                                                                                            comment.name
                                                                                        }
                                                                                    </span>
                                                                                    <span>
                                                                                        •
                                                                                    </span>
                                                                                    <span>
                                                                                        {formatDate(
                                                                                            reply.created_at,
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-sm leading-relaxed text-gray-200">
                                                                                {
                                                                                    reply.message
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {comments.length === 0 && (
                                            <div className="py-6 text-center sm:py-8">
                                                <p className="text-sm text-gray-400 sm:text-base">
                                                    No comments yet. Be number one to comment!
                                                </p>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
