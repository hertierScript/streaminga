// Original copy with evidences

import { AnnouncementBar } from '@/components/announcement-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnnouncement } from '@/hooks/use-announcement';
import { Movie } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    Film,
    Home,
    LogOut,
    Search,
    Star,
    User,
    Menu,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function Izidasobanuye() {
    const [search, setSearch] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('All');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
    const [heroTrailer, setHeroTrailer] = useState<string | null>(null);
    const [actionMovies, setActionMovies] = useState<Movie[]>([]);
    const [horrorMovies, setHorrorMovies] = useState<Movie[]>([]);
    const [comedyMovies, setComedyMovies] = useState<Movie[]>([]);
    const [dramaMovies, setDramaMovies] = useState<Movie[]>([]);
    const [romanceMovies, setRomanceMovies] = useState<Movie[]>([]);
    const [animationMovies, setAnimationMovies] = useState<Movie[]>([]);
    const [thrillerMovies, setThrillerMovies] = useState<Movie[]>([]);
    const [sciFiMovies, setSciFiMovies] = useState<Movie[]>([]);
    const [crimeMovies, setCrimeMovies] = useState<Movie[]>([]);
    const [adventureMovies, setAdventureMovies] = useState<Movie[]>([]);
    const [fantasyMovies, setFantasyMovies] = useState<Movie[]>([]);
    const [familyMovies, setFamilyMovies] = useState<Movie[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { message, backgroundColor, dismissible, scroll } = useAnnouncement();
    const { url } = usePage();

    const genreMap: { [key: number]: string } = {
        28: 'Action',
        27: 'Horror',
        35: 'Comedy',
        18: 'Drama',
        10749: 'Romance',
        16: 'Animation',
        53: 'Thriller',
        878: 'Science Fiction',
        80: 'Crime',
        12: 'Adventure',
        14: 'Fantasy',
        10751: 'Family',
    };

    // Fetch popular movies from TMDB API
    useEffect(() => {
        fetch('/api/movies/popular')
            .then((res) => res.json())
            .then((data) => {
                const transformed = data.results.slice(0, 20).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    poster: m.poster_path
                        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                        : '',
                    rating: parseFloat(m.vote_average.toFixed(1)),
                    genre: m.genre_ids ? m.genre_ids.slice(0, 2).map((id: number) => genreMap[id] || '').filter(Boolean) : [],
                    description: m.overview,
                    releaseYear: m.release_date
                        ? new Date(m.release_date).getFullYear()
                        : 0,
                    duration: null,
                    category: 'popular',
                }));
                setMovies(transformed);
                setHeroMovie(transformed[0] || null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    // Fetch genre movies
    useEffect(() => {
        const fetchGenreMovies = async (endpoint: string, setter: (movies: Movie[]) => void) => {
            try {
                const res = await fetch(endpoint);
                const data = await res.json();
                const transformed = data.results.slice(0, 20).map((m: any) => ({
                    id: m.id,
                    title: m.title,
                    poster: m.poster_path
                        ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                        : '',
                    rating: parseFloat(m.vote_average.toFixed(1)),
                    genre: m.genre_ids ? m.genre_ids.slice(0, 2).map((id: number) => genreMap[id] || '').filter(Boolean) : [],
                    description: m.overview,
                    releaseYear: m.release_date
                        ? new Date(m.release_date).getFullYear()
                        : 0,
                    duration: null,
                    category: 'genre',
                }));
                setter(transformed);
            } catch (error) {
                setter([]);
            }
        };

        fetchGenreMovies('/api/movies/genre/action', setActionMovies);
        fetchGenreMovies('/api/movies/genre/horror', setHorrorMovies);
        fetchGenreMovies('/api/movies/genre/comedy', setComedyMovies);
        fetchGenreMovies('/api/movies/genre/drama', setDramaMovies);
        fetchGenreMovies('/api/movies/genre/romance', setRomanceMovies);
        fetchGenreMovies('/api/movies/genre/animation', setAnimationMovies);
        fetchGenreMovies('/api/movies/genre/thriller', setThrillerMovies);
        fetchGenreMovies('/api/movies/genre/sci-fi', setSciFiMovies);
        fetchGenreMovies('/api/movies/genre/crime', setCrimeMovies);
        fetchGenreMovies('/api/movies/genre/adventure', setAdventureMovies);
        fetchGenreMovies('/api/movies/genre/fantasy', setFantasyMovies);
        fetchGenreMovies('/api/movies/genre/family', setFamilyMovies);
    }, []);

    // Fetch hero trailer
    useEffect(() => {
        if (heroMovie) {
            fetch(`/api/movies/${heroMovie.id}`)
                .then((res) => res.json())
                .then((data) => {
                    const videos = data.videos?.results || [];
                    const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
                    setHeroTrailer(trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null);
                })
                .catch(() => setHeroTrailer(null));
        }
    }, [heroMovie]);

    // Fetch search results with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (search.trim()) {
                fetch(`/api/movies/search?q=${encodeURIComponent(search.trim())}`)
                    .then((res) => res.json())
                    .then((data) => {
                        const transformed = data.results.slice(0, 20).map((m: any) => ({
                            id: m.id,
                            title: m.title,
                            poster: m.poster_path
                                ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
                                : '',
                            rating: parseFloat(m.vote_average.toFixed(1)),
                            genre: m.genre_ids ? m.genre_ids.slice(0, 2).map((id: number) => genreMap[id] || '').filter(Boolean) : [],
                            description: m.overview,
                            releaseYear: m.release_date
                                ? new Date(m.release_date).getFullYear()
                                : 0,
                            duration: null,
                            category: 'search',
                        }));
                        setSearchResults(transformed);
                    })
                    .catch(() => setSearchResults([]));
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [search]);

    // Read URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearch(searchParam);
        }
    }, []);

    const filteredMovies = useMemo(() => {
        if (loading) return [];
        return movies.filter((movie) => {
            const matchesSearch =
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.description.toLowerCase().includes(search.toLowerCase());

            const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);

            return matchesSearch && matchesGenre;
        });
    }, [search, selectedGenre, movies, loading]);

    const displayMovies = search.trim() ? searchResults : filteredMovies;

    return (
        <>
            <Head title="Izidasobanuye - Uninterpreted Movies" />

            {/* Professional Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center" preserveScroll>
                                <img
                                    src="/Images/logo.png"
                                    alt="Streaminga"
                                    className="h-22 w-auto"
                                />
                            </Link>
                            <div className="hidden space-x-6 md:flex">
                                <Link
                                    href="/izisobanuye"
                                    preserveScroll
                                    className={
                                        url === '/' || url === '/izisobanuye'
                                            ? 'font-semibold text-red-500'
                                            : 'text-gray-300 transition-colors hover:text-white'
                                    }
                                >
                                    <Home className="mr-1 inline h-4 w-4" />
                                    izisobanuye
                                </Link>
                                <Link
                                    href="/izidasobanuye"
                                    preserveScroll
                                    className={
                                        url === '/izidasobanuye'
                                            ? 'font-semibold text-red-500'
                                            : 'text-gray-300 transition-colors hover:text-white'
                                    }
                                >
                                    <Film className="mr-1 inline h-4 w-4" />
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
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="h-10 w-32 rounded border-gray-600 bg-gray-700 px-3 text-sm text-white"
                            >
                                <option value="All">All Genres</option>
                                <option value="Action">Action</option>
                                <option value="Horror">Horror</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Drama">Drama</option>
                                <option value="Romance">Romance</option>
                                <option value="Animation">Animation</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Science Fiction">Science Fiction</option>
                                <option value="Crime">Crime</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Family">Family</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="text-white"
                                >
                                    {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </Button>
                            </div>
                            <Link
                                href="/register"
                                preserveScroll
                                className="hidden sm:inline-block text-gray-300 transition-colors hover:text-white"
                            >
                                <User className="mr-1 inline h-4 w-4" />
                                Sign Up
                            </Link>
                            <Link
                                href="/login"
                                preserveScroll
                                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
                            >
                                <LogOut className="mr-1 inline h-4 w-4" />
                                Login
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-800 py-4">
                        <div className="space-y-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                }}
                                className="relative"
                            >
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Search movies..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-800 border-gray-700 text-white placeholder-gray-400 rounded-lg"
                                />
                            </form>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full h-10 rounded border-gray-600 bg-gray-700 px-3 text-sm text-white"
                            >
                                <option value="All">All Genres</option>
                                <option value="Action">Action</option>
                                <option value="Horror">Horror</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Drama">Drama</option>
                                <option value="Romance">Romance</option>
                                <option value="Animation">Animation</option>
                                <option value="Thriller">Thriller</option>
                                <option value="Science Fiction">Science Fiction</option>
                                <option value="Crime">Crime</option>
                                <option value="Adventure">Adventure</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Family">Family</option>
                            </select>
                            <div className="flex flex-col space-y-2">
                                <Link
                                    href="/izisobanuye"
                                    preserveScroll
                                    className={
                                        url === '/' || url === '/izisobanuye'
                                            ? 'font-semibold text-red-500 py-2'
                                            : 'text-gray-300 transition-colors hover:text-white py-2'
                                    }
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Home className="inline w-4 h-4 mr-2" />
                                    izisobanuye
                                </Link>
                                <Link
                                    href="/izidasobanuye"
                                    preserveScroll
                                    className={
                                        url === '/izidasobanuye'
                                            ? 'font-semibold text-red-500 py-2'
                                            : 'text-gray-300 transition-colors hover:text-white py-2'
                                    }
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Film className="inline w-4 h-4 mr-2" />
                                    izidasobanuye
                                </Link>
                                <Link
                                    href="/register"
                                    preserveScroll
                                    className="text-gray-300 transition-colors hover:text-white py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <User className="inline w-4 h-4 mr-2" />
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
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
                <div className="relative flex h-screen items-center">
                    {/* Background Poster */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${heroMovie?.poster})`,
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black/60"></div>

                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-4">
                        <div className="grid min-h-screen grid-cols-1 items-center gap-8 lg:grid-cols-2">
                            {/* Left Side - Poster (Hidden on mobile, visible on lg+) */}
                            <div className="order-2 hidden lg:order-1 lg:block">
                                <div className="relative">
                                    <img
                                        src={heroMovie?.poster}
                                        alt={heroMovie?.title}
                                        className="mx-auto w-full max-w-md rounded-lg shadow-2xl"
                                    />
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="order-1 space-y-6 lg:order-2">
                                {/* Movie Title */}
                                <h1 className="text-5xl leading-tight font-bold text-red-600 lg:text-7xl">
                                    {heroMovie?.title}
                                </h1>

                                {/* Movie Overview */}
                                <p className="max-w-lg text-lg leading-relaxed text-white">
                                    {heroMovie?.description}
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-4 pt-4 sm:flex-row">
                                    <Button
                                        className="rounded-lg bg-red-600 px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-red-700"
                                        onClick={() => heroMovie && window.open(`https://vidsrc.to/embed/movie/${heroMovie.id}`, '_blank')}
                                    >
                                        Watch Now
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="rounded-lg border-gray-400 px-8 py-3 text-lg font-semibold text-gray-300 transition-colors hover:bg-gray-800"
                                        onClick={() => heroTrailer && window.open(heroTrailer, '_blank')}
                                        disabled={!heroTrailer}
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

                <div className="container mx-auto px-4 py-8">
                    {/* Movie Sections */}
                    <div className="space-y-12">
                        <MovieRow
                            title={search.trim() ? "Search Results" : "Popular Movies"}
                            movies={displayMovies.slice(0, 12)}
                        />
                        {!search.trim() && (
                            <>
                                <MovieRow
                                    title="Action"
                                    movies={actionMovies}
                                />
                                <MovieRow
                                    title="Horror"
                                    movies={horrorMovies}
                                />
                                <MovieRow
                                    title="Comedy"
                                    movies={comedyMovies}
                                />
                                <MovieRow
                                    title="Drama"
                                    movies={dramaMovies}
                                />
                                <MovieRow
                                    title="Romance"
                                    movies={romanceMovies}
                                />
                                <MovieRow
                                    title="Animation"
                                    movies={animationMovies}
                                />
                                <MovieRow
                                    title="Thriller"
                                    movies={thrillerMovies}
                                />
                                <MovieRow
                                    title="Science Fiction"
                                    movies={sciFiMovies}
                                />
                                <MovieRow
                                    title="Crime"
                                    movies={crimeMovies}
                                />
                                <MovieRow
                                    title="Adventure"
                                    movies={adventureMovies}
                                />
                                <MovieRow
                                    title="Fantasy"
                                    movies={fantasyMovies}
                                />
                                <MovieRow
                                    title="Family"
                                    movies={familyMovies}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Professional Footer */}
                <footer className="mt-16 border-t border-gray-700 bg-gray-800">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div className="col-span-1 md:col-span-2">
                                <img
                                    src="/Images/logo.png"
                                    alt="Streaminga"
                                    className="mb-4 h-22 w-auto"
                                />
                                <p className="mb-4 max-w-md text-gray-400">
                                    Discover your next favorite movie from our
                                    extensive collection of films from around
                                    the world.
                                </p>
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        <span className="sr-only">
                                            Facebook
                                        </span>
                                        <svg
                                            className="h-6 w-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        <span className="sr-only">Twitter</span>
                                        <svg
                                            className="h-6 w-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="text-gray-400 transition-colors hover:text-white"
                                    >
                                        <span className="sr-only">
                                            Instagram
                                        </span>
                                        <svg
                                            className="h-6 w-6"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12.017 0C8.396 0 7.996.014 6.8.067 5.609.12 4.843.267 4.199.5c-.675.24-1.248.562-1.818.933C1.813 1.803 1.248 2.248.928 2.931.562 3.623.4 4.396.333 5.6c-.053 1.196-.067 1.596-.067 5.217s.014 4.021.067 5.217c.067 1.204.229 1.977.595 2.669.28.683.695 1.128 1.248 1.818.57.37 1.143.693 1.818.933.644.233 1.41.38 2.199.433C7.996 19.986 8.396 20 12.017 20s4.021-.014 5.217-.067c1.196-.053 1.977-.2 2.669-.433.675-.24 1.248-.562 1.818-.933.57-.69 1.128-1.135 1.818-1.818.366-.692.528-1.465.595-2.669.053-1.196.067-1.596.067-5.217s-.014-4.021-.067-5.217c-.067-1.204-.229-1.977-.595-2.669-.69-.683-1.248-1.128-1.818-1.818C18.248.562 17.675.24 17 .5c-.644-.233-1.41-.38-2.199-.433C16.021.014 15.621 0 12.017 0zm0 1.888c3.555 0 3.977.013 5.387.06 1.304.053 2.021.27 2.504.45.526.196.93.43 1.34.84.41.41.644.814.84 1.34.18.483.397 1.2.45 2.504.047 1.41.06 1.832.06 5.387s-.013 3.977-.06 5.387c-.053 1.304-.27 2.021-.45 2.504-.196.526-.43.93-.84 1.34-.41.41-.814.644-1.34.84-.483.18-1.2.397-2.504.45-1.41.047-1.832.06-5.387.06s-3.977-.013-5.387-.06c-1.304-.053-2.021-.27-2.504-.45-.526-.196-.93-.43-1.34-.84-.41-.41-.644-.814-.84-1.34-.18-.483-.397-1.2-.45-2.504C2.65 8.396 2.637 7.974 2.637 4.42s.013-3.977.06-5.387c.053-1.304.27-2.021.45-2.504.196-.526.43-.93.84-1.34.41-.41.814-.644 1.34-.84.483-.18 1.2-.397 2.504-.45C8.04 1.901 8.462 1.888 12.017 1.888zm0 3.107a7.222 7.222 0 100 14.444 7.222 7.222 0 000-14.444zm0 11.889a4.667 4.667 0 110-9.334 4.667 4.667 0 010 9.334zm8.472-11.889a1.722 1.722 0 11-3.444 0 1.722 1.722 0 013.444 0z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-4 text-lg font-semibold">
                                    Quick Links
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <Link
                                            href="/"
                                            preserveScroll
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            izisobanuye
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href="/izidasobanuye"
                                            preserveScroll
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            izidasobanuye
                                        </Link>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Categories
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            New Releases
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="mb-4 text-lg font-semibold">
                                    Support
                                </h4>
                                <ul className="space-y-2">
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Contact Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="text-gray-400 transition-colors hover:text-white"
                                        >
                                            Terms of Service
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
                            <p className="text-gray-400">
                                © {new Date().getFullYear()} streaminga. All
                                rights reserved.
                            </p>
                        </div>
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
        scrollRef.current?.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
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
    return (
        <div className="ml-3 h-[300px] sm:h-[400px] w-[150px] sm:w-[200px] flex-shrink-0 overflow-hidden rounded-lg bg-gray-800 transition-all hover:scale-105 hover:shadow-2xl">
            <Link href={`/movies/${movie.id}`}>
                <div className="relative h-[225px] sm:h-[300px] bg-gray-700">
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
                                {movie.rating}
                            </span>
                        </Badge>
                    </div>
                </div>
                <div className="p-3 sm:p-4">
                    <h3 className="mb-2 line-clamp-2 text-sm sm:text-lg leading-tight font-bold text-white">
                        {movie.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400">
                        {movie.releaseYear} • {movie.genre.slice(0, 2).join(', ')}
                    </p>
                </div>
            </Link>
        </div>
    );
}
