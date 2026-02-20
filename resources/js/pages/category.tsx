import { AnnouncementBar } from '@/components/announcement-bar';
import { LoadingScreen } from '@/components/loading-screen';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAnnouncement } from '@/hooks/use-announcement';
import { Movie } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    ChevronLeft,
    ChevronRight,
    Film,
    Heart,
    Menu,
    Search,
    Star,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface Props {
    category: string;
    categoryLabel: string;
    tmdbApiKey: string;
    initialPage?: number;
}

export default function Category({
    category,
    categoryLabel,
    tmdbApiKey,
    initialPage = 1,
}: Props) {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { message, backgroundColor, dismissible, scroll } = useAnnouncement();
    const { url } = usePage();

    // Get API key from props
    const apiKey = tmdbApiKey || '';

    // Pagination state
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    // Reset search page when search query changes
    useEffect(() => {
        setSearchCurrentPage(1);
    }, [search]);

    // Search pagination state
    const [searchCurrentPage, setSearchCurrentPage] = useState(1);
    const [searchTotalPages, setSearchTotalPages] = useState(1);
    const [searchTotalResults, setSearchTotalResults] = useState(0);
    
    // Search state
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch movies from API
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                let endpoint = '';

                // Map category to TMDB API endpoint
                const genreCategoryMap: { [key: string]: string } = {
                    action: '28',
                    horror: '27',
                    comedy: '35',
                    drama: '18',
                    romance: '10749',
                    animation: '16',
                    thriller: '53',
                    'sci-fi': '878',
                    crime: '80',
                    adventure: '12',
                    fantasy: '14',
                    family: '10751',
                };

                // Handle popular separately
                if (category === 'popular') {
                    endpoint = `https://api.themoviedb.org/3/movie/popular`;
                } else if (genreCategoryMap[category]) {
                    endpoint = `https://api.themoviedb.org/3/discover/movie`;
                } else {
                    endpoint = `https://api.themoviedb.org/3/movie/${category}`;
                }

                // Build query parameters
                const params: Record<string, string | number> = { 
                    api_key: apiKey, 
                    page: currentPage 
                };
                if (category !== 'popular' && genreCategoryMap[category]) {
                    params.with_genres = genreCategoryMap[category];
                    params.sort_by = 'popularity.desc';
                }

                const response = await axios.get(endpoint, { params });

                if (response.data && response.data.results) {
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

                    const transformed = response.data.results.map(
                        (movie: any) => ({
                            id: movie.id,
                            title: movie.title,
                            poster: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/Images/default-movie.jpg',
                            rating: movie.vote_average || 0,
                            genre: (movie.genre_ids || []).map(
                                (id: number) => genreMap[id] || 'Unknown',
                            ),
                            description: movie.overview || '',
                            releaseYear: movie.release_date
                                ? new Date(movie.release_date).getFullYear()
                                : new Date().getFullYear(),
                            duration: movie.runtime || 0,
                            interpreter: undefined,
                            trailer: undefined,
                            poster_file_path: undefined,
                            movie_file_path: undefined,
                            category: 'api',
                        }),
                    );

                    setMovies(transformed);
                    setTotalPages(response.data.total_pages || 1);
                    setTotalResults(response.data.total_results || 0);
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [category, currentPage, apiKey]);

    // Search for movies across all categories
    useEffect(() => {
        const searchMovies = async (page: number = 1) => {
            if (!search.trim()) {
                setSearchResults([]);
                setHasSearched(false);
                setSearchTotalResults(0);
                return;
            }

            setIsSearching(true);
            setHasSearched(true);
            
            console.log('Searching for:', search, 'page:', page);
            
            try {
                // Use server-side API to search (avoids CORS issues)
                const response = await axios.get('/api/movies/search', {
                    params: { q: search, page: page }
                });

                console.log('Search response:', response.data);

                if (response.data && response.data.results) {
                    console.log('Search results count:', response.data.results.length);
                    
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

                    const transformed = response.data.results.map(
                        (movie: any) => ({
                            id: movie.id,
                            title: movie.title,
                            poster: movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : '/Images/default-movie.jpg',
                            rating: movie.vote_average || 0,
                            genre: (movie.genre_ids || []).map(
                                (id: number) => genreMap[id] || 'Unknown',
                            ),
                            description: movie.overview || '',
                            releaseYear: movie.release_date
                                ? new Date(movie.release_date).getFullYear()
                                : new Date().getFullYear(),
                            duration: movie.runtime || 0,
                            interpreter: undefined,
                            trailer: undefined,
                            poster_file_path: undefined,
                            movie_file_path: undefined,
                            category: 'api',
                        }),
                    );

                    console.log('Transformed search results:', transformed.length);
                    setSearchResults(transformed);
                    setSearchTotalPages(response.data.total_pages || 1);
                    setSearchTotalResults(response.data.total_results || 0);
                }
            } catch (error) {
                console.error('Error searching movies:', error);
            } finally {
                setIsSearching(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            searchMovies(searchCurrentPage);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [search, searchCurrentPage, apiKey]);

    // Filter movies by search - now uses API search results
    const filteredMovies = useMemo(() => {
        if (!search.trim()) return movies;
        // If we have search results from API, use those
        if (searchResults.length > 0) return searchResults;
        // Otherwise filter locally
        return movies.filter((movie) => {
            const matchesSearch =
                movie.title.toLowerCase().includes(search.toLowerCase()) ||
                movie.description.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });
    }, [search, movies, searchResults]);

    const handlePageChange = (newPage: number) => {
        if (search.trim()) {
            // Search pagination - update state only (no page reload)
            if (newPage >= 1 && newPage <= searchTotalPages) {
                setSearchCurrentPage(newPage);
            }
        } else {
            // Regular category pagination
            if (newPage >= 1 && newPage <= totalPages) {
                window.location.href = `/category/${category}?page=${newPage}`;
            }
        }
    };

    // Get page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        // Use search pagination when searching, otherwise use category pagination
        const activeTotalPages = search.trim() ? searchTotalPages : totalPages;
        const activeCurrentPage = search.trim() ? searchCurrentPage : currentPage;

        if (activeTotalPages <= maxVisible) {
            for (let i = 1; i <= activeTotalPages; i++) {
                pages.push(i);
            }
        } else {
            if (activeCurrentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(activeTotalPages);
            } else if (activeCurrentPage >= activeTotalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = activeTotalPages - 3; i <= activeTotalPages; i++)
                    pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = activeCurrentPage - 1; i <= activeCurrentPage + 1; i++)
                    pages.push(i);
                pages.push('...');
                pages.push(activeTotalPages);
            }
        }
        return pages;
    };

    return (
        <>
            {loading && <LoadingScreen />}
            <Head title={`${categoryLabel} Movies - StreamingA`} />

            {/* Professional Navbar */}
            <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <Link
                                href="/"
                                className="flex items-center"
                                preserveScroll
                            >
                                <img
                                    src="/Images/logo.png"
                                    alt="Streaminga"
                                    className="h-22 w-auto pt-2"
                                />
                            </Link>
                            <div className="hidden space-x-6 md:flex">
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
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="md:hidden">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                        setIsMobileMenuOpen(!isMobileMenuOpen)
                                    }
                                    className="text-white"
                                >
                                    {isMobileMenuOpen ? (
                                        <X className="h-5 w-5" />
                                    ) : (
                                        <Menu className="h-5 w-5" />
                                    )}
                                </Button>
                            </div>
                            <a
                                href="tel:*182*8*1*1090675#"
                                className="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
                            >
                                <Heart className="mr-1 inline h-4 w-4" />
                                Donate
                            </a>
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
                                <div className="flex flex-col space-y-2">
                                    <Link
                                        href="/izidasobanuye"
                                        preserveScroll
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
                                    <a
                                        href="tel:*182*8*1*1090675#"
                                        className="py-2 text-gray-300 transition-colors hover:text-white"
                                    >
                                        <Heart className="mr-2 inline h-4 w-4" />
                                        Donate
                                    </a>
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
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                {search.trim() 
                                    ? `Search Results for "${search}"`
                                    : `${categoryLabel} Movies`
                                }
                            </h1>
                            <p className="mt-1 text-gray-400">
                                {search.trim() 
                                    ? isSearching 
                                        ? 'Searching...'
                                        : `${searchTotalResults.toLocaleString()} movies found`
                                    : `${totalResults.toLocaleString()} movies found`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Search Results or Movies Grid */}
                    {search.trim() ? (
                        isSearching ? (
                            <div className="py-12 text-center">
                                <h3 className="text-xl font-semibold text-white">
                                    Searching...
                                </h3>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <MovieGrid movies={searchResults} />
                        ) : (
                            <div className="py-12 text-center">
                                <h3 className="mb-2 text-xl font-semibold text-white">
                                    No movie found
                                </h3>
                                <p className="text-gray-400">
                                    We couldn't find any movies matching "
                                    {search}". Please try a different search
                                    term.
                                </p>
                            </div>
                        )
                    ) : (
                        <MovieGrid movies={movies} />
                    )}

                    {/* Pagination - shows for both category and search results */}
                    {((!search.trim() && totalPages > 1) || (search.trim() && searchTotalPages > 1)) && (
                        <div className="mt-12 flex items-center justify-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange((search.trim() ? searchCurrentPage : currentPage) - 1)}
                                disabled={(search.trim() ? searchCurrentPage : currentPage) === 1}
                                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {getPageNumbers().map((page, index) => (
                                <span key={index}>
                                    {page === '...' ? (
                                        <span className="px-2 text-gray-400">
                                            ...
                                        </span>
                                    ) : (
                                        <Button
                                            variant={
                                                page === (search.trim() ? searchCurrentPage : currentPage)
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            size="sm"
                                            onClick={() => handlePageChange(Number(page))}
                                            className={
                                                page === (search.trim() ? searchCurrentPage : currentPage)
                                                    ? 'bg-red-600 hover:bg-red-700'
                                                    : 'border-gray-700 bg-gray-800 text-white hover:bg-gray-700'
                                            }
                                        >
                                            {page}
                                        </Button>
                                    )}
                                </span>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange((search.trim() ? searchCurrentPage : currentPage) + 1)}
                                disabled={(search.trim() ? searchCurrentPage : currentPage) === (search.trim() ? searchTotalPages : totalPages)}
                                className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="mt-16 border-t border-gray-700 bg-gray-800">
                    <div className="container mx-auto px-4 py-8 text-center">
                        <p className="text-gray-400">
                            © {new Date().getFullYear()} streaminga. All rights
                            reserved.
                        </p>
                        <p className="mt-2 text-gray-400">
                            Munyakazi (INTARE) created this website.{' '}
                            <a
                                href="https://munyakazi.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-500 hover:text-red-400"
                            >
                                View Portfolio
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}

function MovieGrid({ movies }: { movies: Movie[] }) {
    if (movies.length === 0) {
        return (
            <div className="py-12 text-center">
                <h3 className="text-xl font-semibold text-white">
                    No movies found
                </h3>
                <p className="text-gray-400">
                    Try a different category or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {movies.map((movie, index) => (
                <MovieCard key={`${movie.id}-${index}`} movie={movie} />
            ))}
        </div>
    );
}

function MovieCard({ movie }: { movie: Movie }) {
    const handleClick = () => {
        router.visit(`/movies/${movie.id}`, { preserveScroll: true });
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer overflow-hidden rounded-lg bg-gray-800 transition-all hover:scale-105 hover:shadow-2xl"
        >
            <div className="relative aspect-[2/3] bg-gray-700">
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
            <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-bold text-white">
                    {movie.title || 'No Title'}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                    {movie.releaseYear || 'N/A'}
                </p>
            </div>
        </div>
    );
}
