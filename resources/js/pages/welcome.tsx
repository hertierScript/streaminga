import { useState, useMemo, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { movies } from '@/data/movies';
import { Movie } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnnouncementBar } from '@/components/announcement-bar';
import { useAnnouncement } from '@/hooks/use-announcement';
import { Star, Search, Filter, SortAsc, SortDesc, Grid, List, Home, Film, User, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Welcome() {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('category');
    const { message, backgroundColor, dismissible, scroll } = useAnnouncement();
    const { url } = usePage();

    // Read URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        if (searchParam) {
            setSearch(searchParam);
        }
    }, []);

    // Filter to only show movies without interpreters (izidasobanuye - uninterpreted movies)
    const uninterpretedMovies = useMemo(() => {
        return movies.filter(movie => !movie.interpreter);
    }, []);

    const filteredMovies = useMemo(() => {
        let filtered = uninterpretedMovies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(search.toLowerCase()) ||
                                movie.description.toLowerCase().includes(search.toLowerCase());

            // Filter by specific category if selected
            let matchesCategory = true;
            if (sortBy === 'action') {
                matchesCategory = movie.category === 'action';
            } else if (sortBy === 'romance') {
                matchesCategory = movie.category === 'romance';
            } else if (sortBy === 'drama') {
                matchesCategory = movie.category === 'drama';
            } else if (sortBy === 'comedy') {
                matchesCategory = movie.category === 'comedy';
            } else if (sortBy === 'horror') {
                matchesCategory = movie.category === 'horror';
            }

            return matchesSearch && matchesCategory;
        });

        return filtered;
    }, [search, sortBy, uninterpretedMovies]);

    return (
        <>
            <Head title="Izidasobanuye - Uninterpreted Movies" />

            {/* Professional Navbar */}
            <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center">
                                <img src="/Images/logo.png" alt="Streaminga" className="h-22 w-auto" />
                            </Link>
                            <div className="hidden md:flex space-x-6">
                                <Link href="/izisobanuye" onClick={() => window.dispatchEvent(new CustomEvent('showLoading'))} className={(url === '/' || url === '/izisobanuye') ? "text-red-500 font-semibold" : "text-gray-300 hover:text-white transition-colors"}>
                                    <Home className="inline w-4 h-4 mr-1" />
                                    izisobanuye
                                </Link>
                                <Link href="/izidasobanuye" onClick={() => window.dispatchEvent(new CustomEvent('showLoading'))} className={url === '/izidasobanuye' ? "text-red-500 font-semibold" : "text-gray-300 hover:text-white transition-colors"}>
                                    <Film className="inline w-4 h-4 mr-1" />
                                    izidasobanuye
                                </Link>
                            </div>
                        </div>
                        {/* Search Bar */}
                        <div className="mx-8 hidden md:flex items-center space-x-2">
                            <form onSubmit={(e) => { e.preventDefault(); }} className="relative">
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
                                value={['action', 'romance', 'drama', 'comedy', 'horror'].includes(sortBy) ? sortBy : 'category'}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-32 bg-gray-700 border-gray-600 text-white h-10 px-3 rounded text-sm"
                            >
                                <option value="category">All Categories</option>
                                <option value="drama">Drama</option>
                                <option value="horror">Horror</option>
                                <option value="action">Action</option>
                                <option value="comedy">Comedy</option>
                                <option value="romance">Romance</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link href="/register" className="text-gray-300 hover:text-white transition-colors">
                                <User className="inline w-4 h-4 mr-1" />
                                Sign Up
                            </Link>
                            <Link href="/login" className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
                                <LogOut className="inline w-4 h-4 mr-1" />
                                Login
                            </Link>
                        </div>
                    </div>
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
                <div className="relative h-screen flex items-center">
                    {/* Background Poster */}
                    <div className="absolute inset-0">
                        <img
                            src="/Images/sinners_ver4.jpg"
                            alt="Inception"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60"></div>
                    </div>
        
                    {/* Content */}
                    <div className="relative z-10 container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center min-h-screen">
                            {/* Left Side - Poster (Hidden on mobile, visible on lg+) */}
                            <div className="hidden lg:block order-2 lg:order-1">
                                <div className="relative">
                                    <img
                                        src="/Images/sinners_ver4.jpg"
                                        alt="Inception"
                                        className="w-full max-w-md mx-auto rounded-lg shadow-2xl"
                                    />
                                </div>
                            </div>

                            {/* Right Content */}
                            <div className="space-y-6 order-1 lg:order-2">
                                {/* Movie Title */}
                                <h1 className="text-5xl lg:text-7xl font-bold text-red-600 leading-tight">
                                    Inception
                                </h1>

                                {/* Metadata */}
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
                                    <span>Action, Sci-Fi, Thriller</span>
                                    <span>|</span>
                                    <span>USA</span>
                                    <span>|</span>
                                    <span>2010</span>
                                    <span>|</span>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-red-600 text-white text-xs font-medium ransition-colors">
                                        Trending
                                    </div>
                                </div>

                                {/* Movie Overview */}
                                <p className="text-lg text-white max-w-lg leading-relaxed">
                                    A thief who steals corporate secrets through the use of dream-sharing technology
                                    is given the inverse task of planting an idea into the mind of a C.E.O.
                                </p>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg font-semibold rounded-lg transition-colors">
                                        Watch Now
                                    </Button>
                                    <Button variant="outline" className="border-gray-400 text-gray-300 hover:bg-gray-800 px-8 py-3 text-lg font-semibold rounded-lg transition-colors">
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
                    {/* Category-based Horizontal Rows */}
                    <div className="space-y-12">
                        {/* Recent Movies */}
                        <MovieRow
                            title="Recent Movies"
                            movies={uninterpretedMovies.filter(m => m.category === 'recent').slice(0, 12)}
                        />

                        {/* Romance Movies */}
                        <MovieRow
                            title="Romance"
                            movies={uninterpretedMovies.filter(m => m.category === 'romance').slice(0, 12)}
                        />

                        {/* Hot Seasons (TV Shows) */}
                        <MovieRow
                            title="Hot Seasons"
                            movies={uninterpretedMovies.filter(m => m.category === 'hot-seasons').slice(0, 12)}
                        />

                        {/* Action Movies */}
                        <MovieRow
                            title="Action"
                            movies={uninterpretedMovies.filter(m => m.category === 'action').slice(0, 12)}
                        />

                        {/* Drama Movies */}
                        <MovieRow
                            title="Drama"
                            movies={uninterpretedMovies.filter(m => m.category === 'drama').slice(0, 12)}
                        />
                    </div>
                </div>

                {/* Professional Footer */}
                <footer className="bg-gray-800 border-t border-gray-700 mt-16">
                    <div className="container mx-auto px-4 py-12">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            <div className="col-span-1 md:col-span-2">
                                <img src="/Images/logo.png" alt="Streaminga" className="h-22 w-auto mb-4" />
                                <p className="text-gray-400 mb-4 max-w-md">
                                    Discover your next favorite movie from our extensive collection of films from around the world.
                                </p>
                                <div className="flex space-x-4">
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="sr-only">Facebook</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                        <span className="sr-only">Instagram</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.017 0C8.396 0 7.996.014 6.8.067 5.609.12 4.843.267 4.199.5c-.675.24-1.248.562-1.818.933C1.813 1.803 1.248 2.248.928 2.931.562 3.623.4 4.396.333 5.6c-.053 1.196-.067 1.596-.067 5.217s.014 4.021.067 5.217c.067 1.204.229 1.977.595 2.669.28.683.695 1.128 1.248 1.818.57.37 1.143.693 1.818.933.644.233 1.41.38 2.199.433C7.996 19.986 8.396 20 12.017 20s4.021-.014 5.217-.067c1.196-.053 1.977-.2 2.669-.433.675-.24 1.248-.562 1.818-.933.57-.69 1.128-1.135 1.818-1.818.366-.692.528-1.465.595-2.669.053-1.196.067-1.596.067-5.217s-.014-4.021-.067-5.217c-.067-1.204-.229-1.977-.595-2.669-.69-.683-1.248-1.128-1.818-1.818C18.248.562 17.675.24 17 .5c-.644-.233-1.41-.38-2.199-.433C16.021.014 15.621 0 12.017 0zm0 1.888c3.555 0 3.977.013 5.387.06 1.304.053 2.021.27 2.504.45.526.196.93.43 1.34.84.41.41.644.814.84 1.34.18.483.397 1.2.45 2.504.047 1.41.06 1.832.06 5.387s-.013 3.977-.06 5.387c-.053 1.304-.27 2.021-.45 2.504-.196.526-.43.93-.84 1.34-.41.41-.814.644-1.34.84-.483.18-1.2.397-2.504.45-1.41.047-1.832.06-5.387.06s-3.977-.013-5.387-.06c-1.304-.053-2.021-.27-2.504-.45-.526-.196-.93-.43-1.34-.84-.41-.41-.644-.814-.84-1.34-.18-.483-.397-1.2-.45-2.504C2.65 8.396 2.637 7.974 2.637 4.42s.013-3.977.06-5.387c.053-1.304.27-2.021.45-2.504.196-.526.43-.93.84-1.34.41-.41.814-.644 1.34-.84.483-.18 1.2-.397 2.504-.45C8.04 1.901 8.462 1.888 12.017 1.888zm0 3.107a7.222 7.222 0 100 14.444 7.222 7.222 0 000-14.444zm0 11.889a4.667 4.667 0 110-9.334 4.667 4.667 0 010 9.334zm8.472-11.889a1.722 1.722 0 11-3.444 0 1.722 1.722 0 013.444 0z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                                <ul className="space-y-2">
                                    <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">izisobanuye</Link></li>
                                    <li><Link href="/movies" className="text-gray-400 hover:text-white transition-colors">izidasobanuye</Link></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Releases</a></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-lg font-semibold mb-4">Support</h4>
                                <ul className="space-y-2">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                            <p className="text-gray-400">
                                © {new Date().getFullYear()} streaminga. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function MovieRow({ title, movies }: { title: string; movies: Movie[] }) {
    const [scrollPosition, setScrollPosition] = useState(0);

    const scrollLeft = () => {
        setScrollPosition(Math.max(0, scrollPosition - 300));
    };

    const scrollRight = () => {
        setScrollPosition(Math.min((movies.length - 5) * 200, scrollPosition + 300));
    };

    if (movies.length === 0) return null;

    return (
        <div className="px-4">
            <h2 className="text-2xl font-bold mb-6 text-white">{title}</h2>
            <div className="relative">
                <div
                    className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{ transform: `translateX(-${scrollPosition}px)` }}
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>

                {/* Scroll Buttons */}
                {scrollPosition > 0 && (
                    <button
                        onClick={scrollLeft}
                        className="absolute top-1/2 left-0 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>
                )}

                {scrollPosition < (movies.length - 5) * 200 && (
                    <button
                        onClick={scrollRight}
                        className="absolute top-1/2 right-0 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                )}
            </div>
        </div>
    );
}

function MovieCard({ movie }: { movie: Movie }) {
    return (
        <Card className="bg-gray-800 border-gray-700 overflow-hidden transition-all hover:scale-105 hover:shadow-2xl w-full max-w-[220px] sm:max-w-[250px] h-[420px] sm:h-[460px] md:h-[480px] mx-auto rounded-lg">
            <Link href={`/movies/${movie.id}`}>
                <div className="relative aspect-[2/3] bg-gray-700 overflow-hidden">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform hover:scale-110"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                                parent.innerHTML = `
                                    <div class="w-full h-full bg-gray-700 flex items-center justify-center">
                                        <div class="text-center text-gray-400">
                                            <div class="text-4xl sm:text-5xl mb-2">🎬</div>
                                            <div className="text-xs sm:text-sm font-medium">Movie Poster</div>
                                        </div>
                                    </div>
                                `;
                            }
                        }}
                    />
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                        <Badge className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white shadow-lg px-1.5 sm:px-2 py-0.5 sm:py-1">
                            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                            <span className="font-bold text-xs sm:text-sm">{movie.rating}</span>
                        </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                        <Badge variant="secondary" className="text-xs bg-black/80 text-white border-0 capitalize w-fit px-2 sm:px-3 py-0.5 sm:py-1">
                            {movie.genre[0] || 'Movie'}
                        </Badge>
                    </div>
                </div>
                <CardContent className="p-4 sm:p-5 h-[140px] sm:h-[160px] md:h-[170px] flex flex-col justify-between">
                    <div>
                        <h3 className="font-bold text-base sm:text-lg mb-3 line-clamp-2 text-white leading-tight">
                            {movie.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm sm:text-base text-gray-400 mb-2">
                            <span className="font-medium">{movie.releaseYear}</span>
                            <span className="font-medium">{movie.duration} min</span>
                        </div>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}