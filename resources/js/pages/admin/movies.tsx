import { AdminSidebar } from '@/components/admin-sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    Film,
    Filter,
    Play,
    Plus,
    Search,
    Star,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Movie {
    id: number;
    title: string;
    description: string;
    poster_path: string;
    rating: number;
    genres: string[];
    release_year: number;
    duration: number;
    interpreter: string;
    trailer_url: string;
    view_count: number;
    is_deleted_for_users: boolean;
    created_at: string;
    updated_at: string;
}

export default function AdminMovies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [izisobanuyeMovies, setIzisobanuyeMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [activeTab, setActiveTab] = useState<'izidasobanuye' | 'izisobanuye'>(
        'izisobanuye',
    );
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Fetch movies from API
    useEffect(() => {
        fetchMovies();
        fetchIzisobanuyeMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            const response = await fetch('/admin/api/movies');
            const data = await response.json();
            setMovies(data.data || []);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchIzisobanuyeMovies = async () => {
        // Static data for Izisobanuye movies
        const staticIzisobanuyeMovies = [
            {
                id: 1,
                title: 'Sample Izisobanuye Movie 1',
                description: 'A sample interpreted movie for demonstration purposes.',
                poster_path: '/Images/default-movie.jpg',
                rating: 8.5,
                genres: ['Drama', 'Cultural'],
                release_year: 2024,
                duration: 120,
                interpreter: 'Local Director',
                trailer_url: '',
                view_count: 0,
                is_deleted_for_users: false,
                created_at: '2024-01-01T00:00:00.000000Z',
                updated_at: '2024-01-01T00:00:00.000000Z',
            },
            {
                id: 2,
                title: 'Sample Izisobanuye Movie 2',
                description: 'Another sample interpreted movie showcasing local talent.',
                poster_path: '/Images/default-movie.jpg',
                rating: 9.0,
                genres: ['Comedy', 'Family'],
                release_year: 2024,
                duration: 95,
                interpreter: 'Community Theater',
                trailer_url: '',
                view_count: 0,
                is_deleted_for_users: false,
                created_at: '2024-01-02T00:00:00.000000Z',
                updated_at: '2024-01-02T00:00:00.000000Z',
            },
            {
                id: 3,
                title: 'Sample Izisobanuye Movie 3',
                description: 'A documentary about local culture and traditions.',
                poster_path: '/Images/default-movie.jpg',
                rating: 8.8,
                genres: ['Documentary', 'Educational'],
                release_year: 2024,
                duration: 85,
                interpreter: 'Cultural Group',
                trailer_url: '',
                view_count: 0,
                is_deleted_for_users: false,
                created_at: '2024-01-03T00:00:00.000000Z',
                updated_at: '2024-01-03T00:00:00.000000Z',
            },
        ];
        setIzisobanuyeMovies(staticIzisobanuyeMovies);
    };

    // Get current movies based on active tab
    const currentMovies =
        activeTab === 'izisobanuye' ? izisobanuyeMovies : movies;

    // Filter and sort movies
    const filteredMovies = currentMovies
        .filter((movie) => {
            const matchesSearch =
                movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                movie.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            const matchesGenre =
                genreFilter === 'all' ||
                (movie.genres && movie.genres.includes(genreFilter));
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'active' && !movie.is_deleted_for_users) ||
                (statusFilter === 'deleted' && movie.is_deleted_for_users);
            return matchesSearch && matchesGenre && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any = a[sortBy as keyof typeof a];
            let bValue: any = b[sortBy as keyof typeof b];

            if (sortBy === 'release_year' || sortBy === 'created_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            } else if (sortBy === 'rating') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else {
                aValue = String(aValue).toLowerCase();
                bValue = String(bValue).toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
    };

    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="h-4 w-4" />;
        return sortOrder === 'asc' ? (
            <ArrowUp className="h-4 w-4" />
        ) : (
            <ArrowDown className="h-4 w-4" />
        );
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const [newMovie, setNewMovie] = useState({
        title: '',
        description: '',
        poster_path: '',
        rating: 0,
        genres: [] as string[],
        release_year: 0,
        duration: 0,
        interpreter: '',
        trailer_url: '',
        movie_file: null as File | null,
        poster_file: null as File | null,
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string[] }>(
        {},
    );
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');

    const handleAddMovie = () => {
        setShowAddForm(true);
    };

    const handleSaveMovie = () => {
        setIsSubmitting(true);
        setFormErrors({});
        setUploadProgress(0);
        setUploadStatus('Uploading files...');

        const formData = new FormData();

        // Add basic movie data
        formData.append('title', newMovie.title);
        formData.append('description', newMovie.description);
        formData.append('rating', newMovie.rating.toString());
        formData.append('genres', JSON.stringify(newMovie.genres));
        formData.append('release_year', newMovie.release_year.toString());
        formData.append('duration', newMovie.duration.toString());
        formData.append('interpreter', newMovie.interpreter);
        formData.append('trailer_url', newMovie.trailer_url);

        // Add files if they exist
        if (newMovie.movie_file) {
            formData.append('movie_file', newMovie.movie_file);
        }
        if (newMovie.poster_file) {
            formData.append('poster_file', newMovie.poster_file);
        } else if (newMovie.poster_path) {
            formData.append('poster_path', newMovie.poster_path);
        }

        const apiEndpoint =
            activeTab === 'izisobanuye'
                ? '/admin/api/izisobanuye-movies'
                : '/admin/api/movies';

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
                const percentComplete = Math.round(
                    (event.loaded / event.total) * 100,
                ); // Upload progress 0-100%
                setUploadProgress(percentComplete);
            }
        });

        xhr.addEventListener('load', () => {
            setUploadProgress(95); // Processing
            setUploadStatus('Processing...');

            console.log('Upload response status:', xhr.status);
            console.log('Upload response text:', xhr.responseText);

            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const result = JSON.parse(xhr.responseText);
                    console.log('Upload success result:', result);

                    setUploadProgress(100); // Complete
                    setUploadStatus('Complete!');

                    setShowAddForm(false);
                    setNewMovie({
                        title: '',
                        description: '',
                        poster_path: '',
                        rating: 0,
                        genres: [],
                        release_year: 0,
                        duration: 0,
                        interpreter: '',
                        trailer_url: '',
                        movie_file: null,
                        poster_file: null,
                    });

                    if (activeTab === 'izisobanuye') {
                        fetchIzisobanuyeMovies();
                    } else {
                        fetchMovies();
                    }

                    alert('Movie uploaded successfully!');
                } catch (e) {
                    console.error('JSON parse error:', e);
                    setUploadProgress(100); // Still complete
                    setUploadStatus('Complete!');
                    alert('Movie uploaded successfully!');
                }
            } else {
                try {
                    const result = JSON.parse(xhr.responseText);
                    console.log('Upload error result:', result);

                    // Handle validation errors
                    if (result.errors) {
                        setFormErrors(result.errors);
                        setUploadStatus('Error: Validation failed');
                        alert(
                            'Please fix the validation errors and try again.',
                        );
                    } else {
                        setUploadStatus('Error: Upload failed');
                        alert(
                            'Error uploading movie: ' +
                                (result.message || 'Unknown error'),
                        );
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e);
                    setUploadStatus('Error: Network issue');
                    alert(
                        `Error uploading movie (${xhr.status}). Please check your connection and try again.`,
                    );
                }
            }

            setIsSubmitting(false);
            setUploadProgress(0);
            setUploadStatus('');
        });

        xhr.addEventListener('error', () => {
            setUploadStatus('Network error occurred');
            alert(
                'Network error occurred. Please check your connection and try again.',
            );
            setIsSubmitting(false);
            setUploadProgress(0);
            setUploadStatus('');
        });

        xhr.addEventListener('abort', () => {
            setUploadStatus('Upload cancelled');
            alert('Upload was cancelled.');
            setIsSubmitting(false);
            setUploadProgress(0);
            setUploadStatus('');
        });

        xhr.open('POST', apiEndpoint);
        xhr.setRequestHeader(
            'X-CSRF-TOKEN',
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || '',
        );
        xhr.send(formData);
    };

    const handleEditMovie = (movieId: number) => {
        // TODO: Open edit movie modal
        alert(`Edit movie with ID: ${movieId}`);
    };

    const handleDeleteMovie = async (movieId: number) => {
        if (confirm('Are you sure you want to delete this movie?')) {
            try {
                const apiEndpoint =
                    activeTab === 'izisobanuye'
                        ? `/admin/api/izisobanuye-movies/${movieId}/toggle-delete`
                        : `/admin/api/movies/${movieId}/toggle-delete`;

                await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                });

                if (activeTab === 'izisobanuye') {
                    fetchIzisobanuyeMovies();
                } else {
                    fetchMovies();
                }
            } catch (error) {
                console.error('Error deleting movie:', error);
            }
        }
    };

    const recentlyAddedMovies = currentMovies
        .sort(
            (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
        )
        .slice(0, 3);

    const genres = Array.from(
        new Set(currentMovies.flatMap((movie) => movie.genres || [])),
    );
    const statuses = ['active', 'deleted'];

    return (
        <>
            <Head title="Movies Management - Izisobanuye & Izidasobanuye" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 p-8 text-white lg:ml-64">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            Movies Management
                        </h1>
                        <p className="mt-2 text-gray-400">
                            Manage your movie catalog - Izisobanuye
                            (interpreted) and Izidasobanuye (original) content
                        </p>
                    </div>
                    <Button
                        onClick={handleAddMovie}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New{' '}
                        {activeTab === 'izisobanuye'
                            ? 'Izisobanuye'
                            : 'Izidasobanuye'}{' '}
                        Movie
                    </Button>
                </div>

                {/* Tabs */}
                <div className="mb-6 flex space-x-1 rounded-lg bg-gray-800 p-1">
                    <button
                        onClick={() => setActiveTab('izisobanuye')}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'izisobanuye'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Izisobanuye Movies
                    </button>
                    <button
                        onClick={() => setActiveTab('izidasobanuye')}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                            activeTab === 'izidasobanuye'
                                ? 'bg-red-600 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        Izidasobanuye Movies
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row">
                    <div className="relative max-w-md flex-1">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search movies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-gray-700 bg-gray-800 pl-10 text-white"
                        />
                    </div>

                    <Select value={genreFilter} onValueChange={setGenreFilter}>
                        <SelectTrigger className="w-40 border-gray-700 bg-gray-800 text-white">
                            <Film className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Genre" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-700 bg-gray-800">
                            <SelectItem
                                value="all"
                                className="text-white hover:bg-gray-700"
                            >
                                All Genres
                            </SelectItem>
                            {genres.map((genre) => (
                                <SelectItem
                                    key={genre}
                                    value={genre}
                                    className="text-white hover:bg-gray-700"
                                >
                                    {genre}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="w-32 border-gray-700 bg-gray-800 text-white">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="border-gray-700 bg-gray-800">
                            <SelectItem
                                value="all"
                                className="text-white hover:bg-gray-700"
                            >
                                All Status
                            </SelectItem>
                            <SelectItem
                                value="active"
                                className="text-white hover:bg-gray-700"
                            >
                                Active
                            </SelectItem>
                            <SelectItem
                                value="deleted"
                                className="text-white hover:bg-gray-700"
                            >
                                Deleted
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Sort Options */}
                <div className="mb-6 flex flex-wrap gap-2">
                    <span className="mr-2 text-gray-400">Sort by:</span>
                    {[
                        { key: 'title', label: 'Title' },
                        { key: 'releaseDate', label: 'Release Date' },
                        { key: 'rating', label: 'Rating' },
                    ].map(({ key, label }) => (
                        <Button
                            key={key}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSort(key)}
                            className={`flex items-center space-x-1 border-gray-600 text-gray-300 hover:bg-gray-700 ${
                                sortBy === key ? 'bg-gray-700' : ''
                            }`}
                        >
                            <span>{label}</span>
                            {getSortIcon(key)}
                        </Button>
                    ))}
                </div>

                {/* Add Movie Form */}
                {showAddForm && (
                    <div className="mb-8">
                        <Card className="border-gray-700 bg-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center text-white">
                                    <Film className="mr-2 h-5 w-5" />
                                    Add New{' '}
                                    {activeTab === 'izisobanuye'
                                        ? 'Izisobanuye'
                                        : 'Izidasobanuye'}{' '}
                                    Movie
                                </CardTitle>
                                <p className="text-sm text-gray-400">
                                    Upload a complete movie with all details for
                                    the{' '}
                                    {activeTab === 'izisobanuye'
                                        ? 'interpreted'
                                        : 'original'}{' '}
                                    movies section
                                    {activeTab === 'izisobanuye' &&
                                        ' - Interpreter field is required'}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Basic Information */}
                                    <div className="md:col-span-2">
                                        <h3 className="mb-4 text-lg font-semibold text-white">
                                            Basic Information
                                        </h3>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Movie Title *
                                        </label>
                                        <Input
                                            value={newMovie.title}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    title: e.target.value,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="Enter movie title"
                                            required
                                        />
                                        {formErrors.title && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {formErrors.title[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Interpreter{' '}
                                            {activeTab === 'izisobanuye'
                                                ? '*'
                                                : '(Optional)'}
                                        </label>
                                        <Input
                                            value={newMovie.interpreter}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    interpreter: e.target.value,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="Director/Interpreter name"
                                            required={
                                                activeTab === 'izisobanuye'
                                            }
                                        />
                                        {formErrors.interpreter && (
                                            <p className="mt-1 text-xs text-red-400">
                                                {formErrors.interpreter[0]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Rating *
                                        </label>
                                        <Input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            max="10"
                                            value={newMovie.rating}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    rating:
                                                        parseFloat(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="8.5"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Release Year *
                                        </label>
                                        <Input
                                            type="number"
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                            value={newMovie.release_year}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    release_year:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="2023"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Duration (minutes) *
                                        </label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={newMovie.duration}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    duration:
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="120"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Genres *
                                        </label>
                                        <Input
                                            value={newMovie.genres.join(', ')}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    genres: e.target.value
                                                        .split(',')
                                                        .map((g) => g.trim())
                                                        .filter((g) => g),
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="Action, Drama, Thriller"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            Separate multiple genres with commas
                                        </p>
                                    </div>

                                    {/* File Uploads */}
                                    <div className="md:col-span-2">
                                        <h3 className="mb-4 text-lg font-semibold text-white">
                                            Media Files
                                        </h3>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Movie File *
                                        </label>
                                        <Input
                                            type="file"
                                            accept="video/*,.mp4,.avi,.mkv,.mov,.wmv,.flv,.webm"
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    movie_file:
                                                        e.target.files?.[0] ||
                                                        null,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white file:mr-3 file:rounded file:border-none file:bg-red-600 file:px-3 file:py-1 file:text-white"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            Supported: MP4, AVI, MKV, MOV, WMV,
                                            FLV, WebM
                                        </p>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Poster Image *
                                        </label>
                                        <Input
                                            type="file"
                                            accept="image/*,.jpg,.jpeg,.png,.gif,.webp"
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    poster_file:
                                                        e.target.files?.[0] ||
                                                        null,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white file:mr-3 file:rounded file:border-none file:bg-red-600 file:px-3 file:py-1 file:text-white"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            Supported: JPG, PNG, GIF, WebP
                                        </p>
                                    </div>

                                    {/* Optional Fields */}
                                    <div className="md:col-span-2">
                                        <h3 className="mb-4 text-lg font-semibold text-white">
                                            Optional Information
                                        </h3>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Trailer URL
                                        </label>
                                        <Input
                                            value={newMovie.trailer_url}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    trailer_url: e.target.value,
                                                })
                                            }
                                            className="border-gray-600 bg-gray-700 text-white"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            YouTube or other video platform URL
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-1 block text-sm font-medium text-gray-300">
                                            Movie Description *
                                        </label>
                                        <textarea
                                            value={newMovie.description}
                                            onChange={(e) =>
                                                setNewMovie({
                                                    ...newMovie,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="resize-vertical h-32 w-full rounded border border-gray-600 bg-gray-700 px-3 py-2 text-white placeholder-gray-400"
                                            placeholder="Detailed movie description and plot summary"
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-400">
                                            Provide a comprehensive description
                                            of the movie
                                        </p>
                                    </div>
                                </div>

                                {/* Upload Progress Bar */}
                                {isSubmitting && (
                                    <div className="border-t border-gray-700 pt-4">
                                        <div className="mb-2 flex items-center justify-between text-sm">
                                            <span className="text-gray-300">
                                                {uploadStatus || 'Uploading movie...'}
                                            </span>
                                            <span className="font-medium text-white">
                                                {uploadProgress}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-red-600 transition-all duration-300 ease-out"
                                                style={{
                                                    width: `${uploadProgress}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="mt-2 text-xs text-gray-400">
                                            Please wait while your files are
                                            being uploaded. Do not close this
                                            window.
                                        </p>
                                    </div>
                                )}

                                <div className="flex space-x-3 border-t border-gray-700 pt-4">
                                    <Button
                                        onClick={handleSaveMovie}
                                        disabled={isSubmitting}
                                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Upload Movie
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        onClick={() => setShowAddForm(false)}
                                        disabled={isSubmitting}
                                        variant="outline"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Recently Added Movies */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold">
                        Recently Added Movies
                    </h2>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {recentlyAddedMovies.map((movie) => (
                            <Card
                                key={movie.id}
                                className="overflow-hidden border-gray-700 bg-gray-800"
                            >
                                <div className="relative aspect-[2/3]">
                                    <img
                                        src={
                                            movie.poster_path
                                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                : '/Images/default-movie.jpg'
                                        }
                                        alt={movie.title}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge className="bg-green-600">
                                            New
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="mb-2 text-lg font-bold">
                                        {movie.title}
                                    </h3>
                                    <p className="mb-2 line-clamp-2 text-sm text-gray-400">
                                        {movie.description}
                                    </p>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="flex items-center">
                                            <Star className="mr-1 h-4 w-4 text-yellow-400" />
                                            {movie.rating}
                                        </span>
                                        <span className="text-gray-400">
                                            {movie.release_year}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* All Movies Table */}
                <div className="mb-8">
                    <h2 className="mb-4 text-2xl font-bold">
                        All Movies ({filteredMovies.length})
                    </h2>
                    <Card className="border-gray-700 bg-gray-800">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                <button
                                                    onClick={() =>
                                                        handleSort('title')
                                                    }
                                                    className="flex items-center space-x-1 hover:text-white"
                                                >
                                                    <span>Title</span>
                                                    {getSortIcon('title')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                Description
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                Genres
                                            </th>
                                            {activeTab === 'izidasobanuye' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                    Type
                                                </th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                Interpreter
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                <button
                                                    onClick={() =>
                                                        handleSort(
                                                            'release_year',
                                                        )
                                                    }
                                                    className="flex items-center space-x-1 hover:text-white"
                                                >
                                                    <span>Release Year</span>
                                                    {getSortIcon(
                                                        'release_year',
                                                    )}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                <button
                                                    onClick={() =>
                                                        handleSort('rating')
                                                    }
                                                    className="flex items-center space-x-1 hover:text-white"
                                                >
                                                    <span>Rating</span>
                                                    {getSortIcon('rating')}
                                                </button>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-300 uppercase">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredMovies.map((movie) => (
                                            <tr
                                                key={movie.id}
                                                className="hover:bg-gray-700"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={
                                                                movie.poster_path
                                                                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                                                    : '/Images/default-movie.jpg'
                                                            }
                                                            alt={movie.title}
                                                            className="mr-3 h-12 w-8 rounded object-cover"
                                                            loading="lazy"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium">
                                                                {movie.title}
                                                            </div>
                                                            <div className="text-sm text-gray-400">
                                                                ID: {movie.id}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="max-w-xs truncate text-sm text-gray-300">
                                                        {movie.description}
                                                    </div>
                                                </td>
                                                {activeTab ===
                                                    'izidasobanuye' && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge
                                                            className={
                                                                movie.interpreter
                                                                    ? 'bg-blue-600 hover:bg-blue-700'
                                                                    : 'bg-green-600 hover:bg-green-700'
                                                            }
                                                        >
                                                            {movie.interpreter
                                                                ? 'Izisobanuye'
                                                                : 'Izidasobanuye'}
                                                        </Badge>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                                    {movie.genres?.join(', ') ||
                                                        'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                                    {movie.interpreter ||
                                                        'Unknown'}
                                                </td>
                                                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-300">
                                                    {movie.release_year ||
                                                        'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm">
                                                        <Star className="mr-1 h-4 w-4 text-yellow-400" />
                                                        <span className="font-medium">
                                                            {movie.rating}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge
                                                        className={
                                                            !movie.is_deleted_for_users
                                                                ? 'bg-green-600 hover:bg-green-700'
                                                                : 'bg-red-600 hover:bg-red-700'
                                                        }
                                                    >
                                                        {!movie.is_deleted_for_users
                                                            ? 'Active'
                                                            : 'Deleted'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleEditMovie(
                                                                    movie.id,
                                                                )
                                                            }
                                                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                handleDeleteMovie(
                                                                    movie.id,
                                                                )
                                                            }
                                                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                                                        >
                                                            <Play className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-red-600 hover:bg-red-700"
                                                        >
                                                            <Film className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {filteredMovies.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-400">
                                        No movies found matching your criteria.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
