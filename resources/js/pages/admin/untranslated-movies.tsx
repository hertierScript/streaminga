import { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { AdminSidebar } from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Play,
    Film,
    Star,
    Calendar,
    Filter,
    Globe,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface Movie {
    id: number;
    tmdb_id: number;
    title: string;
    description: string | null;
    poster_path: string | null;
    rating: number | null;
    genres: string[] | null;
    release_year: number | null;
    duration: number | null;
    interpreter: string | null;
    trailer_url: string | null;
    view_count: number;
    is_deleted_for_users: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginationData {
    current_page: number;
    data: Movie[];
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

export default function AdminUntranslatedMovies() {
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovies();
    }, [currentPage, searchTerm, genreFilter, statusFilter, sortBy, sortOrder]);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                search: searchTerm,
                genre: genreFilter,
                status: statusFilter,
                sort_by: sortBy,
                sort_order: sortOrder,
                per_page: '20'
            });

            const response = await fetch(`/admin/api/movies?${params}`);
            const data = await response.json();
            setPagination(data);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchMovies();
    };

    const handleFilterChange = () => {
        setCurrentPage(1);
        fetchMovies();
    };

    const handleSort = (column: string) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('asc');
        }
        setCurrentPage(1);
    };

    const handleToggleDelete = async (tmdbId: number) => {
        if (confirm('Are you sure you want to toggle the delete status for this movie?')) {
            try {
                await fetch(`/admin/api/movies/${tmdbId}/toggle-delete`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    }
                });
                fetchMovies(); // Refresh the list
            } catch (error) {
                console.error('Error toggling delete status:', error);
            }
        }
    };

    const handleAddMovie = () => {
        alert('Add New Movie modal would open here');
    };

    const handleEditMovie = (movieId: number) => {
        alert(`Edit movie with ID: ${movieId}`);
    };

    const genres = Array.from(new Set(pagination?.data.flatMap(movie => movie.genres || []) || []));
    const statuses = ['active', 'deleted'];

    return (
        <>
            <Head title="Untranslated Movies Management" />

            <AdminSidebar />

            <div className="min-h-screen bg-gray-900 text-white lg:ml-64 p-8">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Untranslated Movies Management</h1>
                            <p className="text-gray-400 mt-2">Manage untranslated movies and content</p>
                        </div>
                        {/* <Button onClick={handleAddMovie} className="bg-red-600 hover:bg-red-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add New Movie
                        </Button> */}
                    </div>

                    {/* Filters and Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search movies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10 pr-20 bg-gray-800 border-gray-700 text-white"
                            />
                            <Button
                                onClick={handleSearch}
                                size="sm"
                                className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700"
                            >
                                Search
                            </Button>
                        </div>

                        <Select value={genreFilter} onValueChange={(value) => { setGenreFilter(value); handleFilterChange(); }}>
                            <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                                <Globe className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Genre" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="all" className="text-white hover:bg-gray-700">All Genres</SelectItem>
                                {genres.map(genre => (
                                    <SelectItem key={genre} value={genre} className="text-white hover:bg-gray-700">{genre}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32 bg-gray-800 border-gray-700 text-white">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-700">
                                <SelectItem value="all" className="text-white hover:bg-gray-700">All Status</SelectItem>
                                {statuses.map(status => (
                                    <SelectItem key={status} value={status} className="text-white hover:bg-gray-700">{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Untranslated Movies Table */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-4">Untranslated Movies ({pagination?.total || 0})</h2>
                    <Card className="bg-gray-800 border-gray-700">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                #
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Title & Poster
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Rating
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Views
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {pagination?.data.map((movie, index) => (
                                            <tr key={movie.id} className="hover:bg-gray-700">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                                                    {(pagination.current_page - 1) * pagination.per_page + index + 1}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <img
                                                            src={movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : ''}
                                                            alt={movie.title}
                                                            className="h-12 w-8 object-cover rounded mr-3"
                                                        />
                                                        <div>
                                                            <div className="text-sm font-medium text-white">{movie.title}</div>
                                                            <div className="text-xs text-gray-400">TMDB ID: {movie.tmdb_id}</div>
                                                            <div className="text-xs text-gray-500">{movie.release_year || 'N/A'} • {movie.genres ? movie.genres.slice(0, 2).join(', ') : 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center text-sm">
                                                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                                        <span className="font-medium text-white">{movie.rating || 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                    <div className="flex items-center">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {movie.view_count}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <Badge className={
                                                        movie.is_deleted_for_users ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                                                    }>
                                                        {movie.is_deleted_for_users ? 'Deleted for Users' : 'Active'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleEditMovie(movie.id)}
                                                            className="border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleToggleDelete(movie.tmdb_id)}
                                                            className={movie.is_deleted_for_users ?
                                                                "border-green-600 text-green-400 hover:bg-green-600 hover:text-white" :
                                                                "border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                            }
                                                        >
                                                            {movie.is_deleted_for_users ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-600 hover:bg-green-700"
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

                            {(!pagination?.data || pagination.data.length === 0) && (
                                <div className="text-center py-12">
                                    <p className="text-gray-400">No movies found matching your criteria.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {pagination && pagination.last_page > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-400">
                                Showing {pagination.from} to {pagination.to} of {pagination.total} movies
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.current_page - 1)}
                                    disabled={pagination.current_page === 1}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>

                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: pagination.last_page }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button
                                                key={page}
                                                variant={pagination.current_page === page ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className={pagination.current_page === page ?
                                                    "bg-red-600 hover:bg-red-700" :
                                                    "border-gray-600 text-gray-300 hover:bg-gray-700"
                                                }
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.current_page + 1)}
                                    disabled={pagination.current_page === pagination.last_page}
                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}