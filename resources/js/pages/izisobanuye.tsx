import { AnnouncementBar } from '@/components/announcement-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnnouncement } from '@/hooks/use-announcement';
import { Movie } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Film,
    Heart,
    Home,
    Menu,
    Search,
    Star,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Props {
    movies: Movie[];
    hero?: Movie;
}

export default function Izisobanuye({ movies, hero }: Props) {
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { message, backgroundColor, dismissible, scroll } = useAnnouncement();
    const { url, auth } = usePage().props as any;

    // Featured movies with local images - COMMENTED OUT to show only uploaded movies
    /*
    const featuredMovies = [
        {
            id: 1001,
            title: 'Back in Action',
            poster: '/Images/back_in_action.jpg',
            rating: 8.5,
            genre: ['Action', 'Comedy'],
            description: 'A thrilling action-comedy featuring high-octane stunts and hilarious moments.',
            releaseYear: 2024,
            duration: 128,
            interpreter: 'Action Star',
            trailer: undefined,
            watch_now_url: undefined,
            category: 'featured'
        },
        {
            id: 1002,
            title: 'Beauty in Black',
            poster: '/Images/beauty_in_black.jpg',
            rating: 9.0,
            genre: ['Drama', 'Romance'],
            description: 'A captivating story of love, loss, and redemption in the shadows of darkness.',
            releaseYear: 2024,
            duration: 145,
            interpreter: 'Drama Director',
            trailer: undefined,
            watch_now_url: undefined,
            category: 'featured'
        },
        {
            id: 1003,
            title: 'Forty Seven Ronin',
            poster: '/Images/forty_seven_ronin.jpg',
            rating: 8.8,
            genre: ['Action', 'Historical'],
            description: 'An epic tale of honor, loyalty, and revenge in feudal Japan.',
            releaseYear: 2024,
            duration: 162,
            interpreter: 'Historical Epic Director',
            trailer: undefined,
            watch_now_url: undefined,
            category: 'featured'
        },
        {
            id: 1004,
            title: 'Man from Toronto',
            poster: '/Images/man_from_toronto.jpg',
            rating: 7.8,
            genre: ['Action', 'Comedy'],
            description: 'A case of mistaken identity leads to an unlikely partnership between a teacher and a contract killer.',
            releaseYear: 2024,
            duration: 110,
            interpreter: 'Comedy Action Director',
            trailer: undefined,
            watch_now_url: undefined,
            category: 'featured'
        },
        {
            id: 1005,
            title: 'Sinners Version 4',
            poster: '/Images/sinners_ver4.jpg',
            rating: 9.2,
            genre: ['Drama', 'Thriller'],
            description: 'A psychological thriller exploring the depths of human morality and redemption.',
            releaseYear: 2024,
            duration: 155,
            interpreter: 'Thriller Master',
            trailer: undefined,
            watch_now_url: undefined,
            category: 'featured'
        },
        {
            id: 1006,
            title: 'Vikings Legacy',
            poster: '/Images/vikings.jpg',
            rating: 8.7,
            genre: ['Action', 'Adventure'],
            description: 'The legendary saga of Norse warriors, their conquests, and their enduring legacy.',
            releaseYear: 2024,
            duration: 178,
            interpreter: 'Epic Director',
            trailer: undefined,
            watch_now_url: undefined,
            category: 'featured'
        }
    ];
    */

    // Empty featured movies array to hide static content
    const featuredMovies = [];

    // Use custom hero if available, otherwise first database movie
    const heroMovie = hero || (movies.length > 0 ? movies[0] : null);

    // Filter to only show movies with interpreters (izisobanuye - interpreted movies)
    const interpretedMovies = movies
        .filter((movie) => movie.interpreter)
        .map((movie) => ({
            ...movie,
            poster: movie.poster_file_path || movie.poster,
            movie_file: movie.movie_file_path,
        }));

    const filteredMovies = useMemo(() => {
        if (interpretedMovies.length === 0) return [];
        return interpretedMovies.filter((movie) => {
            const matchesSearch =
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.description.toLowerCase().includes(search.toLowerCase());

            const matchesGenre =
                selectedGenre === 'All' || movie.genre.includes(selectedGenre);

            return matchesSearch && matchesGenre;
        });
    }, [search, selectedGenre, interpretedMovies]);

    // Group movies by genre for display
    const moviesByGenre = useMemo(() => {
        const grouped: { [key: string]: Movie[] } = {};
        const moviesToGroup = search.trim()
            ? filteredMovies
            : interpretedMovies;

        moviesToGroup.forEach((movie) => {
            if (movie.genre && Array.isArray(movie.genre)) {
                movie.genre.forEach((genre) => {
                    if (!grouped[genre]) {
                        grouped[genre] = [];
                    }
                    grouped[genre].push(movie);
                });
            }
        });

        return grouped;
    }, [search, filteredMovies, interpretedMovies]);

    const displayMovies = search.trim() ? filteredMovies : interpretedMovies;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            // Redirect to movies page with search query
            window.location.href = `/izisobanuye?search=${encodeURIComponent(search.trim())}`;
        }
    };

    // Read URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearch(searchParam);
        }
    }, []);

    return (
        <>
            <Head title="Izisobanuye - Interpreted Movies" />

            {/* Professional Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
                <div className="mx-auto px-3 sm:px-4">
                    <div className="flex h-14 items-center justify-between sm:h-16">
                        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
                            <Link
                                href="/"
                                className="flex flex-shrink-0 items-center"
                            >
                                <img
                                    src="/Images/logo.png"
                                    alt="Streaminga"
                                    className="h-22 w-auto pt-2"
                                />
                            </Link>
                            <div className="hidden space-x-4 md:flex lg:space-x-6">
                                {/* // Navigation link to the izisobanuye
                                (interpreted movies) page with conditional
                                styling
                                <Link
                                    href="/izisobanuye"
                                    className={
                                        url === '/' || url === '/izisobanuye'
                                            ? 'font-semibold text-red-500'
                                            : 'text-gray-300 transition-colors hover:text-white'
                                    }
                                >
                                    <Home className="mr-1 inline h-3 w-3 lg:h-4 lg:w-4" />
                                    izisobanuye
                                </Link> */}
                                <Link
                                    href="/izidasobanuye"
                                    className={
                                        url === '/izidasobanuye'
                                            ? 'font-semibold text-red-500'
                                            : 'text-gray-300 transition-colors hover:text-white'
                                    }
                                >
                                    <Film className="mr-1 inline h-3 w-3 lg:h-4 lg:w-4" />
                                    izidasobanuye
                                </Link>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="mx-8 hidden items-center space-x-2 md:flex">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                                className="relative"
                            >
                                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search movies..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64 rounded-full border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400 focus:border-transparent focus:ring-2 focus:ring-red-500"
                                />
                            </form>
                            <select
                                value={selectedGenre}
                                onChange={(e) =>
                                    setSelectedGenre(e.target.value)
                                }
                                className="h-10 w-32 rounded border-gray-600 bg-gray-700 px-3 text-sm text-white"
                            >
                                <option value="All">All Genre</option>
                                <option value="Action">Action</option>
                                <option value="Horror">Horror</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Drama">Drama</option>
                                <option value="Romance">Romance</option>
                                <option value="Animation">Animation</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Science Fiction">
                                    Science Fiction
                                </option>
                                <option value="Crime">Crime</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Family">Family</option>
                            </select>
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
                                <Link
                                    href="/donate"
                                    className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-green-700 sm:px-4 sm:py-2"
                                >
                                    <Heart className="mr-1 inline h-3 w-3 sm:h-4 sm:w-4" />
                                    Donate
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="border-t border-gray-800 py-4 md:hidden">
                            <div className="space-y-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                    }}
                                    className="relative"
                                >
                                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Search movies..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        className="rounded-lg border-gray-700 bg-gray-800 py-2 pr-4 pl-10 text-white placeholder-gray-400"
                                    />
                                </form>
                                <select
                                    value={selectedGenre}
                                    onChange={(e) =>
                                        setSelectedGenre(e.target.value)
                                    }
                                    className="h-10 w-full rounded border-gray-600 bg-gray-700 px-3 text-sm text-white"
                                >
                                    <option value="All">All Genres</option>
                                    <option value="Action">Action</option>
                                    <option value="Horror">Horror</option>
                                    <option value="Comedy">Comedy</option>
                                    <option value="Drama">Drama</option>
                                    <option value="Romance">Romance</option>
                                    <option value="Animation">Animation</option>
                                    <option value="Thriller">Thriller</option>
                                    <option value="Science Fiction">
                                        Science Fiction
                                    </option>
                                    <option value="Crime">Crime</option>
                                    <option value="Adventure">Adventure</option>
                                    <option value="Fantasy">Fantasy</option>
                                    <option value="Family">Family</option>
                                </select>
                                <div className="flex flex-col space-y-2">
                                    // Navigation link to the izisobanuye
                                    (interpreted movies) page with conditional
                                    styling
                                    <Link
                                        href="/izisobanuye"
                                        className={
                                            url === '/' ||
                                            url === '/izisobanuye'
                                                ? 'py-2 font-semibold text-red-500'
                                                : 'py-2 text-gray-300 transition-colors hover:text-white'
                                        }
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Home className="mr-2 inline h-4 w-4" />
                                        izisobanuye
                                    </Link>
                                    <Link
                                        href="/izidasobanuye"
                                        className={
                                            url === '/izidasobanuye'
                                                ? 'py-2 font-semibold text-red-500'
                                                : 'py-2 text-gray-300 transition-colors hover:text-white'
                                        }
                                        onClick={() =>
                                            setIsMobileMenuOpen(false)
                                        }
                                    >
                                        <Film className="mr-2 inline h-4 w-4" />
                                        izidasobanuye
                                    </Link>
                                    <div className="space-y-2">
                                        <Link
                                            href="/donate"
                                            className="block py-2 text-gray-300 transition-colors hover:text-white"
                                            onClick={() =>
                                                setIsMobileMenuOpen(false)
                                            }
                                        >
                                            <Heart className="mr-2 inline h-4 w-4" />
                                            Donate
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Announcement Bar */}
            <AnnouncementBar
                message={message}
                backgroundColor={backgroundColor}
                dismissible={dismissible}
                scroll={scroll}
            />

            <div className="min-h-screen bg-gray-900 text-white">
                {/* Hero Section */}
                {heroMovie && (
                    <div className="relative flex h-screen items-center">
                        {/* Background Poster */}
                        <div className="absolute inset-0">
                            <img
                                src={heroMovie.poster}
                                alt={heroMovie.title}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60"></div>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 container mx-auto px-4">
                            <div className="grid min-h-screen grid-cols-1 items-center gap-8 lg:grid-cols-2">
                                {/* Left Side - Poster (Hidden on mobile, visible on lg+) */}
                                <div className="order-2 hidden lg:order-1 lg:block">
                                    <div className="relative">
                                        <img
                                            src={heroMovie.poster}
                                            alt={heroMovie.title}
                                            className="mx-auto w-full max-w-md rounded-lg shadow-2xl"
                                        />
                                    </div>
                                </div>

                                {/* Right Content */}
                                <div className="order-1 space-y-6 lg:order-2">
                                    {/* Movie Title */}
                                    <h1 className="text-5xl leading-tight font-bold text-red-600 lg:text-7xl">
                                        {heroMovie.title}
                                    </h1>

                                    {/* Metadata */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                        <span>
                                            {heroMovie.genre.join(', ')}
                                        </span>
                                        <span>|</span>
                                        <span>{heroMovie.releaseYear}</span>
                                        <span>|</span>
                                        <div className="ransition-colors inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white">
                                            New Release
                                        </div>
                                    </div>

                                    {/* Movie Overview */}
                                    <p className="max-w-lg text-lg leading-relaxed text-white">
                                        {heroMovie.description}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                        <Button
                                            className="rounded-lg bg-red-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-red-700"
                                            onClick={() => {
                                                if (heroMovie.watch_now_url) {
                                                    window.open(
                                                        heroMovie.watch_now_url,
                                                        '_blank',
                                                    );
                                                } else {
                                                    router.visit(
                                                        `/movies/${heroMovie.id}`,
                                                        {
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                        >
                                            Watch Now
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="rounded-lg border-gray-400 px-8 py-3 text-lg font-semibold text-gray-300 transition-colors hover:bg-gray-800"
                                            onClick={() =>
                                                heroMovie.trailer &&
                                                window.open(
                                                    heroMovie.trailer,
                                                    '_blank',
                                                )
                                            }
                                            disabled={!heroMovie.trailer}
                                        >
                                            Watch Trailer
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/80 to-transparent"></div>
                    </div>
                )}

                <div className="container mx-auto px-4 py-8">
                    <div className="space-y-12">
                        {/* Featured Movies Section - COMMENTED OUT */}
                        {/*
                        <MovieRow
                            title="Featured Movies"
                            movies={featuredMovies}
                        />
                        */}

                        {/* Izisobanuye Movies by Genre */}
                        {search.trim() ? (
                            <MovieRow
                                title="Search Results"
                                movies={displayMovies}
                            />
                        ) : (
                            Object.entries(moviesByGenre).map(
                                ([genre, genreMovies]) => (
                                    <MovieRow
                                        key={genre}
                                        title={`${genre} Movies`}
                                        movies={genreMovies}
                                    />
                                ),
                            )
                        )}
                    </div>
                </div>

                {/* Simple Footer */}
                <footer className="mt-16 border-t border-gray-700 bg-gray-800">
                    <div className="container mx-auto px-4 py-12 text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} streaminga. All rights
                            reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollAmount = 212; // scroll by one movie

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    if (movies.length === 0) return null;

    return (
        <div className="px-4">
            <h2 className="mb-6 text-2xl font-bold text-white">{title}</h2>
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex gap-0 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* Scroll Buttons */}
                {movies.length > 3 && (
                    <>
                        <button
                            onClick={scrollLeft}
                            className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function MovieCard({ movie }: { movie: Movie }) {
    const handleClick = () => {
        // Don't navigate for featured movies (IDs >= 1000)
        if (movie.id >= 1000) {
            return;
        }
        router.visit(`/movies/${movie.id}`, { preserveScroll: true });
    };

    return (
        <div className="ml-3 h-[300px] w-[150px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-800 transition-all hover:scale-105 hover:shadow-2xl sm:h-[400px] sm:w-[200px]">
            <div onClick={handleClick} className="h-full cursor-pointer">
                <div className="relative h-[225px] bg-gray-700 sm:h-[300px]">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = `
                                    <div class="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <div class="text-center text-gray-400">
                                            <div class="text-4xl mb-2">🎬</div>
                                            <div class="text-sm font-medium">Movie Poster</div>
                                        </div>
                                    </div>
                                `;
                            }
                        }}
                    />
                    <div className="absolute top-2 right-2">
                        <Badge className="flex items-center gap-1 bg-red-600 px-2 py-1 text-white shadow-lg hover:bg-red-700">
                            <Star className="h-3 w-3 fill-current" />
                            <span className="text-sm font-bold">
                                {movie.rating
                                    ? Math.floor(movie.rating * 10) / 10
                                    : 'N/A'}
                            </span>
                        </Badge>
                    </div>
                </div>
                <div className="p-3 sm:p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm leading-tight font-bold text-white sm:text-lg">
                        {movie.title || 'No Title'}
                    </h3>
                    <p className="text-xs text-gray-400 sm:text-sm">
                        {movie.releaseYear || 'N/A'} •{' '}
                        {movie.genre && movie.genre.length > 0
                            ? movie.genre.slice(0, 2).join(', ')
                            : 'Unknown'}
                    </p>
                </div>
            </div>
        </div>
    );
}
